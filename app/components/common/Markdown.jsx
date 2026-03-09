'use client'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export default function Markdown({ content = '', className = '', inline = false }) {
  if (!content) return null

  const InlineWrapper = inline ? 'span' : 'div'

  return (
    <InlineWrapper className={`markdown-body ${className}`.trim()}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={
          inline
            ? {
                p: ({ children }) => <>{children}</>,
              }
            : undefined
        }
      >
        {content}
      </ReactMarkdown>
    </InlineWrapper>
  )
}
