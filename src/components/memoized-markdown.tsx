'use client';

import { marked } from 'marked';
import { memo, useEffect, useMemo, useState } from 'react';
import ReactMarkdown from 'react-markdown';

const MermaidRenderer = memo(({ content }: { content: string }) => {
  const [svg, setSvg] = useState<string>('');
  const elementId = useMemo(() => `mermaid-${Math.random().toString(36).substr(2, 9)}`, []);

  useEffect(() => {
    let isMounted = true;

    const renderMermaid = async () => {
      try {
        const mermaid = await import('mermaid');
        
        // Only initialize once
        if (!window.mermaidInitialized) {
          mermaid.default.initialize({
            startOnLoad: true,
            theme: 'default',
            securityLevel: 'loose',
          });
          window.mermaidInitialized = true;
        }

        // Validate syntax silently
        try {
          mermaid.default.parse(content);
          const { svg } = await mermaid.default.render(elementId, content);
          if (isMounted) {
            setSvg(svg);
          }
        } catch {
          // Silently skip on syntax errors
          if (isMounted) {
            setSvg('');
          }
        }
      } catch {
        // Silently skip if mermaid fails to load
        if (isMounted) {
          setSvg('');
        }
      }
    };

    renderMermaid();

    return () => {
      isMounted = false;
    };
  }, [content, elementId]);

  if (!svg) {
    return null;
  }

  return <div dangerouslySetInnerHTML={{ __html: svg }} />;
});

MermaidRenderer.displayName = 'MermaidRenderer';

function isMermaidBlock(block: string): boolean {
  try {
    const trimmedBlock = block.trim();
    return trimmedBlock.startsWith('```mermaid') && trimmedBlock.endsWith('```');
  } catch {
    return false;
  }
}

function extractMermaidContent(block: string): string {
  try {
    return block
      .trim()
      .replace(/^```mermaid\n/, '')
      .replace(/```$/, '')
      .trim();
  } catch {
    return '';
  }
}

interface ParsedBlock {
  content: string;
  type: 'mermaid' | 'markdown';
}

function parseMarkdownIntoBlocks(markdown: string): ParsedBlock[] {
  try {
    const tokens = marked.lexer(markdown);
    return tokens.map(token => ({
      content: token.raw,
      type: isMermaidBlock(token.raw) ? 'mermaid' : 'markdown'
    }));
  } catch {
    // On any error, treat everything as markdown
    return [{
      content: markdown,
      type: 'markdown'
    }];
  }
}

const MemoizedMarkdownBlock = memo(
  ({ block }: { block: ParsedBlock }) => {
    if (block.type === 'mermaid' && block.content.trim()) {
      return <MermaidRenderer content={extractMermaidContent(block.content)} />;
    }
    return <ReactMarkdown>{block.content}</ReactMarkdown>;
  },
  (prevProps, nextProps) => {
    if (prevProps.block.content !== nextProps.block.content) return false;
    return true;
  },
);

MemoizedMarkdownBlock.displayName = 'MemoizedMarkdownBlock';

export const MemoizedMarkdown = memo(
  ({ content, id }: { content: string; id: string }) => {
    const blocks = useMemo(() => parseMarkdownIntoBlocks(content), [content]);
    
    return blocks.map((block, index) => (
      <MemoizedMarkdownBlock 
        block={block} 
        key={`${id}-block_${index}`} 
      />
    ));
  },
);

// Add type declaration for window
declare global {
  interface Window {
    mermaidInitialized?: boolean;
  }
}

MemoizedMarkdown.displayName = 'MemoizedMarkdown';