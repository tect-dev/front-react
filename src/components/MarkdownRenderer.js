import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import remark from 'remark'
import remarkParse from 'remark-parse'
import remarkHTML from 'remark-html'
import math from 'remark-math'
import remark2rehype from 'remark-rehype'
import katex from 'rehype-katex'
import ryhype2string from 'rehype-stringify'
import raw from 'rehype-raw'
import breaks from 'remark-breaks'
import slug from 'remark-slug'
import unified from 'unified'
import { throttle } from 'throttle-debounce'
import { htmlFilter } from '../lib/functions'
import { prismPlugin } from '../lib/prismPlugin'
import { embedPlugin } from '../lib/embedPlugin'
import { prismThemes } from '../lib/prismThemes'
import { colorPalette, mediaSize } from '../lib/constants'
import { TypographyBlock } from '../wrappers/Typography'

const MarkdownStyledBlock = styled.div`
  &.monokai {
    ${prismThemes['monokai']}
  }
  &.dracula {
    ${prismThemes['dracula']}
  }
  word-break: break-all;
  pre {
    font-family: 'Fira Mono', source-code-pro, Menlo, Monaco, Consolas,
      'Courier New', monospace;
    font-size: 0.875rem;
    padding: 1rem;
    border-radius: 4px;
    line-height: 1.1;
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
    margin-top: 1rem;
    margin-bottom: 1rem;
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
`

export default React.memo(function MarkdownRenderingBlock({ text }) {
  const [html, setHtml] = useState('')

  const codeBlockPattern = /(```[\s\S]*\n[\s\S]*?\n```)/g // 이걸로 쓰면 통으로 잘라버리네.
  //const codeBlockPattern = /(```)([ㄱ-ㅎ가-핳a-zA-Z0-9\n\s\"\'\!\?\_\-\@\%\^\&\*\(\)\=\+\;\:\/\,\.\<\>\|\[\{\]\}]+)\1/gi
  const latexBlockPattern = /(\$\$[\s\S]*[\s\S]*?\$\$)/g

  const exceptionPattern = /(\$\$[\s\S]*[\s\S]*?\$\$)|(```[\s\S]*\n[\s\S]*?\n```)/g

  // /($$)([ㄱ-ㅎ가-핳a-zA-Z0-9\n\s\"\'\!\?\_\-\@\%\^\&\*\(\)\=\+\;\:\/\,\.\<\>\|\[\{\]\}]+)\1/gi
  const exceptionCodeBlockPattern = /^(```)([ㄱ-ㅎ가-핳a-zA-Z0-9\n\s\"\'\!\?\_\-\@\%\^\&\*\(\)\=\+\;\:\/\,\.\<\>\|\[\{\]\}]+)\1/gi
  const exceptionLatexBlockPattern = /^($$)([ㄱ-ㅎ가-핳a-zA-Z0-9\n\s\"\'\!\?\_\-\@\%\^\&\*\(\)\=\+\;\:\/\,\.\<\>\|\[\{\]\}]+)\1/gi

  useEffect(() => {
    setHtml(
      htmlFilter(
        // unified()
        remark()
          .use(remarkParse)
          .use(breaks)
          .use(slug)
          .use(prismPlugin)
          //.use(remarkHTML)
          .use(remark2rehype, { allowDangerousHTML: true })
          .use(raw)
          .use(math)
          .use(katex)
          .use(ryhype2string)
          .processSync(
            text
              .split(codeBlockPattern) // 코드 블럭 뿐만 아니라 레이텍 블럭 기준으로도 자를수있게해야함.
              .map((ele) => {
                if (codeBlockPattern.test(ele)) {
                  return `\n${ele}\n`
                } else if (latexBlockPattern.test(ele)) {
                  return `\n${ele}\n`
                } else {
                  return ele
                    .replaceAll(`\n`, '<br />')
                    .replaceAll(`\`\`\``, '\n```\n')
                }
              })
              .join('')
          )
          .toString()
      )
    )
  }, [text])

  return (
    <>
      <TypographyBlock>
        <MarkdownStyledBlock
          className={'dracula'}
          dangerouslySetInnerHTML={{ __html: html }}
        ></MarkdownStyledBlock>
      </TypographyBlock>
    </>
  )
})
