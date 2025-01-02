"use client"
import { MDXRemote } from 'next-mdx-remote/rsc'

const components = {
  h1: (props) => (
    <h1 {...props} className="large-text text-green-500">
      {props.children}
    </h1>
  ),

  li: (props) => (
    <li {...props} className="text-red-500">
      * {props.children}
    </li>
  ),

  Card: (props) => (
    <div className="bg-red-300 p-4 rounded-lg">
      {props.children}
    </div>
  ),
}

function CustomMDX(props) {
  return (
    <MDXRemote
      {...props}
      components={{ ...components, ...(props.components || {}) }}
    />
  )
}

export default function Home() {
  return (
    <CustomMDX
      // h1 now renders with `large-text` className
      source={`# Hello World
      This is from Server Components!
      <Card>Hi</Card>
      - List item 1
    `}
    />
  )
}