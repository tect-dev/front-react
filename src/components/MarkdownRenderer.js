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

export default React.memo(function MarkdownRenderingBlock({ text }) {
  const [html, setHtml] = useState('')

  const codeBlockPattern = /(```[a-z]*\n[\s\S]*?\n```)/g // 이걸로 쓰면 통으로 잘라버리네.
  // /(```)([ㄱ-ㅎ가-핳a-zA-Z0-9\n\s\"\'\!\?\_\-\@\%\^\&\*\(\)\=\+\;\:\/\,\.\<\>\|\[\{\]\}]+)\1/gi
  const latexBlockPattern = /($$[a-z]*\n[\s\S]*?\n$$)/g

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
          //.use(slug)
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
                  return ele
                } else if (latexBlockPattern.test(ele)) {
                  return ele
                } else {
                  return ele.replaceAll(`\n`, '\n\n<br />\n\n')
                }
              })
              .join('')
          )
          .toString()
      )
    )

    console.log(
      '잘랐다가 다시 붙인 스트링: ',
      text
        .split(codeBlockPattern)
        .map((ele) => {
          if (/^```/.test(ele)) {
            return ele
          } else {
            return ele.replaceAll(`\n`, '<br />')
          }
        })
        .join('')
    )
  }, [text])

  const [delay, setDelay] = useState(25)

  const throttledUpdate = React.useMemo(() => {
    return throttle(delay, (text) => {
      unified()
        //remark()
        .use(remarkParse)
        .use(breaks)
        .use(slug)
        .use(prismPlugin)
        .use(embedPlugin)
        .use(remarkHTML)
        .use(remark2rehype, { allowDangerousHTML: true })
        .use(raw)
        .use(math)
        .use(katex)
        // .use(toHTML)
        .process(
          text,
          (err, file) => {
            const lines = text.split(/\r\n|\r|\n/).length
            const nextDelay = Math.max(
              Math.min(Math.floor(lines * 0.5), 1500),
              22
            )
            if (nextDelay !== delay) {
              setDelay(nextDelay)
            }

            const html = String(text.replace('\n', '<br />'))

            setHtml(htmlFilter(text.replace('\n', `<br />`)))
            return
          },
          1
        )
    })
  }, [delay])

  //useEffect(() => {
  //  throttledUpdate(text)
  //}, [text, throttledUpdate])

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
