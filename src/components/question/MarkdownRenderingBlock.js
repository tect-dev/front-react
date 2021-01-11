import { useState, useEffect } from 'react';
import unified from 'unified';
import parse from 'remark-parse';
import breaks from 'remark-breaks';
import math from 'remark-math';
import remark2rehype from 'remark-rehype';
import katex from 'rehype-katex';
import stringify from 'rehype-stringify';
import raw from 'rehype-raw';
import slug from 'remark-slug';
import { htmlFilter } from '../../lib/functions';

export default function MarkdownRenderingBlock({ content }) {
  const [html, setHtml] = useState(content);

  useEffect(() => {
    setHtml(
      // html 필터를 쓰면 latex 렌더링이 이상하게 된다!
      // 그래서 html 필터랑 katex whitelist 를 함께 쓰는듯.
      //htmlFilter(
      unified()
        .use(breaks)
        .use(parse)
        .use(slug)
        .use(remark2rehype)
        .use(raw)
        .use(math)
        .use(katex)
        .use(stringify)
        .processSync(content)
        .toString()
      //)
    );
  }, [content]);

  //unified()
  //  .use(parse)
  //  .use(math)
  //  .use(remark2rehype)
  //  .use(katex)
  //  .use(remark2react)
  //  .processSync(content).result

  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: html }} />
      {/*<div>{content} : content in Preview</div>*/}
    </>
  );
}
