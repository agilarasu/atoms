'use client';

import { MDXRemote } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

// Error boundary to catch rendering errors
class MDXErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

// Custom components with safety checks
const CustomHeading = ({ children }) => {
  if (!children) return null;
  return <h1 className="text-2xl font-bold my-4 text-blue-600">{children}</h1>;
};

const CustomParagraph = ({ children }) => {
  if (!children) return null;
  return <p className="my-2 leading-relaxed">{children}</p>;
};

const CustomCard = ({ title, children }) => {
  if (!children) return null;
  return (
    <Card className="my-4">
      <CardHeader>
        <CardTitle>{title || ''}</CardTitle>
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
};

// Safely wrap MDX content
const SafeMDXContent = ({ content, components }) => {
  return (
    <MDXErrorBoundary fallback={<div className="text-gray-500">Loading...</div>}>
      <MDXRemote {...content} components={components} />
    </MDXErrorBoundary>
  );
};

// Buffer incomplete tags
const useBufferedContent = (rawContent) => {
  const [bufferedContent, setBufferedContent] = useState('');
  
  useEffect(() => {
    // Simple tag matching - you might want to make this more robust
    const isCompleteTag = (str) => {
      const openTags = (str.match(/<[^/][^>]*>/g) || []).length;
      const closeTags = (str.match(/<\/[^>]*>/g) || []).length;
      return openTags === closeTags;
    };

    // Buffer the content until we have complete tags
    if (isCompleteTag(rawContent)) {
      setBufferedContent(rawContent);
    }
  }, [rawContent]);

  return bufferedContent;
};

const components = {
  h1: CustomHeading,
  p: CustomParagraph,
  Card: CustomCard,
};

const MDXRenderer = ({ content }) => {
  const [mdxSource, setMdxSource] = useState(null);
  const bufferedContent = useBufferedContent(content);

  useEffect(() => {
    const prepareMDX = async () => {
      if (!bufferedContent) return;
      
      try {
        const mdxSource = await serialize(bufferedContent);
        setMdxSource(mdxSource);
      } catch (error) {
        console.error('Error serializing MDX:', error);
        // Don't update mdxSource on error - keep showing previous valid content
      }
    };

    prepareMDX();
  }, [bufferedContent]);

  return (
    <div className="prose max-w-none">
      {mdxSource ? (
        <SafeMDXContent content={mdxSource} components={components} />
      ) : (
        <div className="text-green-500">Loading...</div>
      )}
    </div>
  );
};

export default MDXRenderer;