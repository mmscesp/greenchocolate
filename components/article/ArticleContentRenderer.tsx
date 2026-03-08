'use client';

import { AlertTriangle, Info, Lightbulb } from '@/lib/icons';
import { normalizeArticleContent } from '@/lib/article-content';
import { useLanguage } from '@/hooks/useLanguage';

type CalloutType = 'info' | 'warning' | 'tip' | 'danger';

function isSeparatorLine(line: string): boolean {
  return /^\s*([-_*])\1{2,}\s*$/.test(line);
}

function isTableBlock(block: string): boolean {
  const lines = block
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length < 2) {
    return false;
  }

  const hasHeader = lines[0].includes('|');
  const hasDivider = /^\|?\s*:?-+:?\s*(\|\s*:?-+:?\s*)+\|?$/.test(lines[1]);

  return hasHeader && hasDivider;
}

function normalizeHref(url: string, language: string): string {
  if (/^\/(en|es|fr|de)\//.test(url)) {
    return url.replace(/^\/(en|es|fr|de)\//, `/${language}/`);
  }

  return url;
}

function parseTable(block: string, key: number, language: string): React.ReactNode {
  const lines = block
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

  const header = lines[0]
    .split('|')
    .map((cell) => cell.trim())
    .filter((cell, index, arr) => !(cell === '' && (index === 0 || index === arr.length - 1)));

  const rows = lines
    .slice(2)
    .map((line) =>
      line
        .split('|')
        .map((cell) => cell.trim())
        .filter((cell, index, arr) => !(cell === '' && (index === 0 || index === arr.length - 1)))
    )
    .filter((row) => row.length > 0);

  return (
    <div key={key} className="my-8 overflow-x-auto rounded-2xl border border-white/10">
      <table className="min-w-full border-collapse text-left text-sm text-zinc-200">
        <thead className="bg-white/5">
          <tr>
            {header.map((cell, index) => (
              <th key={index} className="border-b border-white/10 px-4 py-3 font-semibold text-white">
                {formatInline(cell, language)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex} className="odd:bg-transparent even:bg-white/5">
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} className="border-b border-white/5 px-4 py-3 align-top">
                  {formatInline(cell, language)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function formatInline(text: string, language: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  const tokenRegex = /(\[[^\]]+\]\([^)]+\)|\*\*[^*]+\*\*|`[^`]+`|\*[^*\n]+\*|_[^_\n]+_)/g;

  let lastIndex = 0;
  let key = 0;
  let match: RegExpExecArray | null;

  while ((match = tokenRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    const token = match[0];

    if (token.startsWith('[')) {
      const linkMatch = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (linkMatch) {
        const [, label, url] = linkMatch;
        const isExternal = /^https?:\/\//i.test(url);
        parts.push(
          <a
            key={key++}
            href={normalizeHref(url, language)}
            className="text-brand underline decoration-brand/50 underline-offset-2 hover:text-brand-dark"
            target={isExternal ? '_blank' : undefined}
            rel={isExternal ? 'noopener noreferrer' : undefined}
          >
            {label}
          </a>
        );
      } else {
        parts.push(token);
      }
    } else if (token.startsWith('**')) {
      parts.push(
        <strong key={key++} className="font-bold text-white">
          {token.slice(2, -2)}
        </strong>
      );
    } else if (token.startsWith('`')) {
      parts.push(
        <code key={key++} className="rounded bg-white/10 px-1.5 py-0.5 text-[0.92em] text-zinc-100">
          {token.slice(1, -1)}
        </code>
      );
    } else if (token.startsWith('*') || token.startsWith('_')) {
      parts.push(
        <em key={key++} className="italic text-zinc-100">
          {token.slice(1, -1)}
        </em>
      );
    } else {
      parts.push(token);
    }

    lastIndex = match.index + token.length;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts;
}

function parseContent(content: string, language: string): React.ReactNode[] {
  const normalized = normalizeArticleContent(content);
  const blocks: React.ReactNode[] = [];
  const paragraphs = normalized.split(/\n\n+/);

  let key = 0;

  for (const paragraph of paragraphs) {
    const trimmed = paragraph.trim();
    if (!trimmed) {
      continue;
    }

    const lines = trimmed.split('\n').map((line) => line.trimEnd());

    const calloutMatch = lines[0].match(/^\[!(INFO|WARNING|TIP|DANGER)\]\s*(.*)?/i);
    if (calloutMatch) {
      const [, type, title] = calloutMatch;
      const calloutType = type.toLowerCase() as CalloutType;
      const rest = lines.slice(1).join('\n').trim();
      blocks.push(
        <CalloutBox key={key++} type={calloutType} title={title?.trim() || undefined} language={language}>
          {rest}
        </CalloutBox>
      );
      continue;
    }

    if (lines.length === 1 && isSeparatorLine(lines[0])) {
      blocks.push(<hr key={key++} className="my-10 border-white/10" />);
      continue;
    }

    if (isTableBlock(trimmed)) {
      blocks.push(parseTable(trimmed, key++, language));
      continue;
    }

    const headingMatch = lines[0].match(/^(#{1,3})\s+(.+)$/);
    if (headingMatch && lines.length === 1) {
      const [, hashes, text] = headingMatch;
      const level = hashes.length;

      if (level === 1) {
        blocks.push(
          <h2 key={key++} className="mt-12 mb-6 text-2xl font-black tracking-tight text-white">
            {text}
          </h2>
        );
      } else if (level === 2) {
        blocks.push(
          <h3 key={key++} className="mt-8 mb-4 text-xl font-bold text-white">
            {text}
          </h3>
        );
      } else {
        blocks.push(
          <h4 key={key++} className="mt-6 mb-3 text-lg font-semibold text-zinc-200">
            {text}
          </h4>
        );
      }
      continue;
    }

    if (lines.every((line) => line.startsWith('> '))) {
      const quote = lines.map((line) => line.replace(/^>\s*/, '')).join(' ');
      blocks.push(
        <blockquote key={key++} className="my-6 border-l-4 border-green-500 pl-6 py-2 italic text-zinc-400">
          {formatInline(quote, language)}
        </blockquote>
      );
      continue;
    }

    if (lines.every((line) => /^[-*]\s+/.test(line))) {
      blocks.push(
        <ul key={key++} className="my-6 list-inside list-disc space-y-2 text-zinc-300">
          {lines.map((line, index) => (
            <li key={index}>{formatInline(line.replace(/^[-*]\s+/, '').trim(), language)}</li>
          ))}
        </ul>
      );
      continue;
    }

    if (lines.every((line) => /^\d+\.\s+/.test(line))) {
      blocks.push(
        <ol key={key++} className="my-6 list-inside list-decimal space-y-2 text-zinc-300">
          {lines.map((line, index) => (
            <li key={index}>{formatInline(line.replace(/^\d+\.\s+/, '').trim(), language)}</li>
          ))}
        </ol>
      );
      continue;
    }

    blocks.push(
      <p key={key++} className="mb-6 leading-relaxed text-zinc-300">
        {formatInline(lines.join('\n'), language)}
      </p>
    );
  }

  return blocks;
}

interface CalloutBoxProps {
  type: CalloutType;
  title?: string;
  children: string;
  language: string;
}

function CalloutBox({ type, title, children, language }: CalloutBoxProps) {
  const configs = {
    info: {
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/30',
      icon: Info,
      iconColor: 'text-blue-400',
      titleColor: 'text-blue-400',
    },
    warning: {
      bg: 'bg-brand/10',
      border: 'border-brand/30',
      icon: AlertTriangle,
      iconColor: 'text-brand',
      titleColor: 'text-brand',
    },
    tip: {
      bg: 'bg-green-500/10',
      border: 'border-green-500/30',
      icon: Lightbulb,
      iconColor: 'text-green-400',
      titleColor: 'text-green-400',
    },
    danger: {
      bg: 'bg-red-500/10',
      border: 'border-red-500/30',
      icon: AlertTriangle,
      iconColor: 'text-red-400',
      titleColor: 'text-red-400',
    },
  };

  const config = configs[type];
  const Icon = config.icon;
  const lines = children
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

  return (
    <div className={`relative my-6 rounded-2xl border p-6 ${config.bg} ${config.border}`}>
      <div className="flex items-start gap-3">
        <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${config.iconColor}`} />
        <div>
          {title && <h4 className={`mb-2 font-bold ${config.titleColor}`}>{title}</h4>}
          <div className="space-y-2 text-sm leading-relaxed text-zinc-300">
            {lines.map((line, index) => (
              <p key={index}>{formatInline(line, language)}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

interface ArticleContentRendererProps {
  content: string;
}

export default function ArticleContentRenderer({ content }: ArticleContentRendererProps) {
  const { language } = useLanguage();

  return <div className="article-content">{parseContent(content, language)}</div>;
}
