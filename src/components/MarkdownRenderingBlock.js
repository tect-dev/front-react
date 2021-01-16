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

export const mediaQuery = (maxWidth) => `
  @media (max-width: ${maxWidth}px)
`
const media = {
  xxlarge: mediaQuery(1920),
  xlarge: mediaQuery(1440),
  large: mediaQuery(1200),
  medium: mediaQuery(1024),
  small: mediaQuery(768),
  xsmall: mediaQuery(375),
  custom: mediaQuery,
}

export const palette = {
  /* teal */
  teal0: '#F3FFFB',
  teal1: '#C3FAE8',
  teal2: '#96F2D7',
  teal3: '#63E6BE',
  teal4: '#38D9A9',
  teal5: '#20C997',
  teal6: '#12B886',
  teal7: '#0CA678',
  teal8: '#099268',
  teal9: '#087F5B',
  /* gray */
  gray0: '#F8F9FA',
  gray1: '#F1F3F5',
  gray2: '#E9ECEF',
  gray3: '#DEE2E6',
  gray4: '#CED4DA',
  gray5: '#ADB5BD',
  gray6: '#868E96',
  gray7: '#495057',
  gray8: '#343A40',
  gray9: '#212529',
  /* red */
  red0: '#fff5f5',
  red1: '#ffe3e3',
  red2: '#ffc9c9',
  red3: '#ffa8a8',
  red4: '#ff8787',
  red5: '#ff6b6b',
  red6: '#fa5252',
  red7: '#f03e3e',
  red8: '#e03131',
  red9: '#c92a2a',
}

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
    ${media.small} {
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
    border: 1px solid ${palette.gray7};
    border-collapse: collapse;
    font-size: 0.875rem;
    thead > tr > th {
      /* text-align: left; */
      border-bottom: 4px solid ${palette.gray7};
    }
    th,
    td {
      word-break: break-word;
      padding: 0.5rem;
    }
    td + td,
    th + th {
      border-left: 1px solid ${palette.gray7};
    }
    tr:nth-child(even) {
      background: ${palette.gray1};
    }
    tr:nth-child(odd) {
      background: white;
    }
  }
  .katex-mathml {
    display: none;
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
    <>
      <MarkdownStyledBlock
        className={'dracula'}
        dangerouslySetInnerHTML={{ __html: html }}
      ></MarkdownStyledBlock>
    </>
  )
})
