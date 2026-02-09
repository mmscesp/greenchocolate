import fs from 'fs';
import path from 'path';
import { compileMDX } from 'next-mdx-remote/rsc';
import { ReactElement } from 'react';
import React from 'react';

// Define the content directory
const contentDirectory = path.join(process.cwd(), 'data/content');

export interface Article {
  slug: string;
  category: string;
  meta: ArticleMeta;
  content: ReactElement;
}

export interface ArticleMeta {
  title: string;
  excerpt: string;
  date: string;
  author: string;
  tags?: string[];
  lastVerified?: string;
}

// MDX Components to be used in articles
const components = {
  // Custom components can be added here
  AnswerBox: (props: { children: React.ReactNode }) => (
    React.createElement('div', { className: "my-6 p-6 bg-primary/5 border border-primary/20 rounded-xl" },
      React.createElement('h3', { className: "text-lg font-semibold text-primary mb-2 flex items-center gap-2" },
        React.createElement('span', { className: "bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full" }, "TL;DR"),
        "The Short Answer"
      ),
      React.createElement('div', { className: "text-muted-foreground" }, props.children)
    )
  ),
  SafetyChecklist: (props: { title: string; items: string[] }) => (
    React.createElement('div', { className: "my-6 p-6 bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800 rounded-xl" },
      React.createElement('h3', { className: "text-lg font-semibold text-green-800 dark:text-green-300 mb-4" }, props.title),
      React.createElement('ul', { className: "space-y-2" },
        props.items.map((item, index) => (
          React.createElement('li', { key: index, className: "flex items-start gap-2" },
            React.createElement('span', { className: "text-green-600 dark:text-green-400 mt-1" }, "✓"),
            React.createElement('span', { className: "text-green-900 dark:text-green-100" }, item)
          )
        ))
      )
    )
  ),
  WarningBox: (props: { title: string; children: React.ReactNode }) => (
    React.createElement('div', { className: "my-6 p-6 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-xl" },
      React.createElement('h3', { className: "text-lg font-semibold text-red-800 dark:text-red-300 mb-2 flex items-center gap-2" },
        "⚠️ " + props.title
      ),
      React.createElement('div', { className: "text-red-900 dark:text-red-100" }, props.children)
    )
  ),
};

export async function getArticleBySlug(category: string, slug: string): Promise<Article | null> {
  try {
    const realSlug = slug.replace(/\.mdx$/, '');
    const filePath = path.join(contentDirectory, category, `${realSlug}.mdx`);
    
    if (!fs.existsSync(filePath)) {
      return null;
    }

    const fileContent = fs.readFileSync(filePath, 'utf8');

    const { content, frontmatter } = await compileMDX<ArticleMeta>({
      source: fileContent,
      options: { parseFrontmatter: true },
      components: components,
    });

    return {
      slug: realSlug,
      category,
      meta: frontmatter,
      content,
    };
  } catch (error) {
    console.error(`Error loading article ${category}/${slug}:`, error);
    return null;
  }
}

export async function getAllArticles(category?: string): Promise<ArticleMeta[]> {
  const categories = category ? [category] : ['legal', 'etiquette', 'harm-reduction'];
  let allArticles: ArticleMeta[] = [];

  for (const cat of categories) {
    const catPath = path.join(contentDirectory, cat);
    if (fs.existsSync(catPath)) {
      const files = fs.readdirSync(catPath);
      
      for (const file of files) {
        if (file.endsWith('.mdx')) {
          const filePath = path.join(catPath, file);
          const fileContent = fs.readFileSync(filePath, 'utf8');
          // We only need frontmatter here, but compileMDX is the robust way to get it
          const { frontmatter } = await compileMDX<ArticleMeta>({
            source: fileContent,
            options: { parseFrontmatter: true },
          });
          
          allArticles.push({
            ...frontmatter,
            // Add a synthetic slug/category for linking if needed in the meta list
            // (Though typically slug is enough if we know the context)
          });
        }
      }
    }
  }

  return allArticles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
