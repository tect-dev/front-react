import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import remark from 'remark'
import remarkParse from 'remark-parse'
import breaks from 'remark-breaks'
import math from 'remark-math'
import remark2rehype from 'remark-rehype'
import katex from 'rehype-katex'
import stringify from 'rehype-stringify'
import raw from 'rehype-raw'
import slug from 'remark-slug'
import { htmlFilter } from '../lib/functions'
import { prismPlugin } from '../lib/prismPlugin'
import { prismThemes } from '../lib/prismThemes'
import { colorPalette, mediaSize } from '../lib/constants'

// deprecated. MarkdownRenderer 사용을 권장.

const MarkdownStyledBlock = styled.div`
  &.atom-one-dark {
    ${prismThemes['atom-one-dark']}
  }
  &.atom-one-light {
    ${prismThemes['atom-one-light']}
  }
  &.vscDark {
    ${prismThemes['vscDark']}
  }
  &.github {
    ${prismThemes['github']}
  }
  &.monokai {
    ${prismThemes['monokai']}
  }
  &.dracula {
    ${prismThemes['dracula']}
  }
  &.tomorrow-night {
    ${prismThemes['tomorrow-night']}
  }
  pre {
    font-family: 'Fira Mono', source-code-pro, Menlo, Monaco, Consolas,
      'Courier New', monospace;
    font-size: 0.875rem;
    padding: 1rem;
    border-radius: 4px;
    line-height: 1.5;
    overflow-x: auto;
    letter-spacing: 0px;
    ${mediaSize.small} {
      font-size: 0.75rem;
      padding: 0.75rem;
    }
  }
  img {
    max-width: 100%;
    height: auto;
    display: block;
    margin-top: 1.5rem;
    margin-bottom: 1.5rem;
  }
  iframe {
    width: 768px;
    height: 430px;
    max-width: 100%;
    background: black;
    display: block;
    margin: auto;
    border: none;
    border-radius: 4px;
    overflow: hidden;
  }
  .twitter-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    border-left: none;
    background: none;
    padding: none;
  }
  table {
    min-width: 40%;
    max-width: 100%;
    border: 1px solid ${colorPalette.gray7};
    border-collapse: collapse;
    font-size: 0.875rem;
    thead > tr > th {
      /* text-align: left; */
      border-bottom: 4px solid ${colorPalette.gray7};
    }
    th,
    td {
      word-break: break-word;
      padding: 0.5rem;
    }
    td + td,
    th + th {
      border-left: 1px solid ${colorPalette.gray7};
    }
    tr:nth-child(even) {
      background: ${colorPalette.gray1};
    }
    tr:nth-child(odd) {
      background: white;
    }
  }
  .katex-mathml {
    display: none;
  }
  width: 39vw;
  ${mediaSize.small} {
    width: 95vw;
  }
`

export default React.memo(function MarkdownRenderingBlock({ content }) {
  const [html, setHtml] = useState(content)

  useEffect(() => {
    setHtml(
      // html 필터를 쓰면 latex 렌더링이 이상하게 된다!
      // 그래서 html 필터랑 katex whitelist 를 함께 쓰는듯.
      htmlFilter(
        //unified()
        remark()
          .use(breaks)
          .use(remarkParse)
          .use(slug)
          .use(prismPlugin)
          .use(remark2rehype, { allowDangerousHTML: true })
          .use(raw)
          .use(math)
          .use(katex)
          .use(stringify)
          .processSync(content)
          .toString()
      )
    )
  }, [content])

  return (
    <MarkdownStyledBlock
      className={'dracula'}
      dangerouslySetInnerHTML={{ __html: html }}
    ></MarkdownStyledBlock>
  )
})
