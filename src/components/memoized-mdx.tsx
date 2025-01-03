'use client';

import { MDXRemote, type MDXRemoteSerializeResult } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import React, { useState, useEffect, useRef, useMemo, memo } from 'react';

// Import all custom interactive chat components

import { CustomHeading, CustomParagraph } from './mdx-components/md';
import { Card } from './mdx-components/Card';
import { Quiz } from './mdx-components/Quiz';

// Include all custom components in this object

const components = {
    h1: CustomHeading,
    p: CustomParagraph,
    Card: Card,
    Quiz: Quiz,
};


// Error boundary to catch rendering errors
class MDXErrorBoundary extends React.Component<{ fallback: React.ReactNode, children: React.ReactNode }, { hasError: boolean }> {
    constructor(props: { fallback: React.ReactNode, children: React.ReactNode }) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(_error: Error) {
        return { hasError: true };
    }

    render() {
        if (this.state.hasError) {
            return this.props.fallback;
        }
        return this.props.children;
    }
}


// Safely wrap MDX content
const SafeMDXContent = ({ content, components }: { content: MDXRemoteSerializeResult; components: any }) => {
    return (
        <MDXErrorBoundary fallback={<div className="text-gray-500">Loading...</div>}>
            <MDXRemote {...content} components={components} />
        </MDXErrorBoundary>
    );
};


// Memoize the MDX serialization and rendering
const MDXRenderer = memo(({ content }: { content: string }) => {
    const [mdxSource, setMdxSource] = useState<MDXRemoteSerializeResult | null>(null);
    const prevContentRef = useRef<string | null>(null);


    useEffect(() => {
        if (!content) {
            setMdxSource(null)
            return;
        }
        if (prevContentRef.current === content) {
            return;
        }
        prevContentRef.current = content;

        const prepareMDX = async () => {
            try {
                const mdxSource = await serialize(content, {
                    components: components,
                });
                setMdxSource(mdxSource);
            } catch (error) {
                console.error('Error serializing MDX:', error);
                setMdxSource(null) // set to null if error so we can try again on next content
            }
        };

        prepareMDX();
    }, [content]);

    return (
        <div className="prose max-w-none">
            {mdxSource ? (
                <SafeMDXContent content={mdxSource} components={components} />
            ) : (
                <div className="text-gray-500">Loading...</div>
            )}
        </div>
    );
}, (prevProps, nextProps) => prevProps.content === nextProps.content)

MDXRenderer.displayName = 'MDXRenderer';

export default MDXRenderer;