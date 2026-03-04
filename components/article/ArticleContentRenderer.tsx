'use client';

import { AlertTriangle, CheckCircle2, Info, Lightbulb } from '@/lib/icons';

// Parse content blocks with basic markdown-like syntax
function parseContent(content: string): React.ReactNode[] {
  const blocks: React.ReactNode[] = [];
  const paragraphs = content.split(/\n\n+/);
  
  let i = 0;
  for (const paragraph of paragraphs) {
    const trimmed = paragraph.trim();
    if (!trimmed) continue;
    
    // Check for callouts first (must be at start of paragraph)
    const calloutMatch = trimmed.match(/^\[!(INFO|WARNING|TIP|DANGER)\]\s*(.*)?/i);
    if (calloutMatch) {
      const [, type, title] = calloutMatch;
      const rest = trimmed.replace(calloutMatch[0], '').trim();
      const calloutType = type.toLowerCase() as 'info' | 'warning' | 'tip' | 'danger';
      blocks.push(
        <CalloutBox key={i++} type={calloutType} title={title || undefined}>
          {rest}
        </CalloutBox>
      );
      continue;
    }
    
    // Check for headings
    const headingMatch = trimmed.match(/^(#{1,3})\s+(.+)$/);
    if (headingMatch) {
      const [, hashes, text] = headingMatch;
      const level = hashes.length;
      if (level === 1) {
        blocks.push(<h2 key={i++} className="text-2xl font-black text-white mt-12 mb-6 tracking-tight">{text}</h2>);
      } else if (level === 2) {
        blocks.push(<h3 key={i++} className="text-xl font-bold text-white mt-8 mb-4">{text}</h3>);
      } else {
        blocks.push(<h4 key={i++} className="text-lg font-semibold text-zinc-200 mt-6 mb-3">{text}</h4>);
      }
      continue;
    }
    
    // Check for blockquote
    if (trimmed.startsWith('> ')) {
      const quote = trimmed.replace(/^>\s*/g, '');
      blocks.push(
        <blockquote key={i++} className="border-l-4 border-green-500 pl-6 py-2 my-6 text-zinc-400 italic">
          {quote}
        </blockquote>
      );
      continue;
    }
    
    // Check for list items (unordered)
    if (trimmed.match(/^[-*]\s+/m)) {
      const items = trimmed.split(/\n/).filter(line => line.match(/^[-*]\s+/));
      if (items.length > 0) {
        blocks.push(
          <ul key={i++} className="list-disc list-inside space-y-2 my-6 text-zinc-300">
            {items.map((item, idx) => (
              <li key={idx}>{item.replace(/^[-*]\s+/, '')}</li>
            ))}
          </ul>
        );
        continue;
      }
    }
    
    // Check for ordered list
    if (trimmed.match(/^\d+\.\s+/m)) {
      const items = trimmed.split(/\n/).filter(line => line.match(/^\d+\.\s+/));
      if (items.length > 0) {
        blocks.push(
          <ol key={i++} className="list-decimal list-inside space-y-2 my-6 text-zinc-300">
            {items.map((item, idx) => (
              <li key={idx}>{item.replace(/^\d+\.\s+/, '')}</li>
            ))}
          </ol>
        );
        continue;
      }
    }
    
    // Regular paragraph with inline formatting
    blocks.push(
      <p key={i++} className="text-zinc-300 leading-relaxed mb-6">
        {formatInline(trimmed)}
      </p>
    );
  }
  
  return blocks;
}

// Format inline elements (bold, italic, links)
function formatInline(text: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  let remaining = text;
  let key = 0;
  
  // Bold: **text**
  const boldRegex = /\*\*(.+?)\*\*/g;
  // Italic: *text* or _text_
  const italicRegex = /(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)|_(.+?)_/g;
  
  let lastIndex = 0;
  let match;
  
  // Process bold
  const boldMatches: { start: number; end: number; text: string }[] = [];
  while ((match = boldRegex.exec(text)) !== null) {
    boldMatches.push({ start: match.index, end: match.index + match[0].length, text: match[1] });
  }
  
  // Simple approach: replace bold first, then italic
  let result = text.replace(/\*\*(.+?)\*\*/g, '___BOLD___$1___BOLD___');
  result = result.replace(/_(.+?)_/g, '___ITALIC___$1___ITALIC___');
  
  const segments = result.split(/___(BOLD|ITALIC)___/);
  
  for (const segment of segments) {
    if (segment === 'BOLD' || segment === 'ITALIC') continue;
    if (!segment) continue;
    
    if (segment.startsWith('BOLD') || segment.endsWith('BOLD')) {
      const content = segment.replace(/BOLD/g, '');
      parts.push(<strong key={key++} className="text-white font-bold">{content}</strong>);
    } else if (segment.startsWith('ITALIC') || segment.endsWith('ITALIC')) {
      const content = segment.replace(/ITALIC/g, '');
      parts.push(<em key={key++} className="text-zinc-200 italic">{content}</em>);
    } else {
      parts.push(segment);
    }
  }
  
  return parts.length > 0 ? parts : text;
}

interface CalloutBoxProps {
  type: 'info' | 'warning' | 'tip' | 'danger';
  title?: string;
  children: string;
}

function CalloutBox({ type, title, children }: CalloutBoxProps) {
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
  
  return (
    <div className={`relative p-6 rounded-2xl ${config.bg} border ${config.border} my-6`}>
      <div className="flex items-start gap-3">
        <Icon className={`h-5 w-5 ${config.iconColor} shrink-0 mt-0.5`} />
        <div>
          {title && (
            <h4 className={`font-bold ${config.titleColor} mb-2`}>
              {title}
            </h4>
          )}
          <div className="text-zinc-300 text-sm leading-relaxed">
            {children}
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
  return (
    <div className="article-content">
      {parseContent(content)}
    </div>
  );
}
