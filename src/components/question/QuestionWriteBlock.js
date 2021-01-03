import React, { useCallback, useState } from 'react';
import { uid } from 'uid';
import unified from 'unified';
import parse from 'remark-parse';
import remark2react from 'remark-react';
import math from 'remark-math';
import remark2rehype from 'remark-rehype';
import katex from 'rehype-katex';
import stringify from 'rehype-stringify';

import { useInput } from '../../hooks/hooks';
import { useSelector, useDispatch } from 'react-redux';
import { createQuestion } from '../../redux/createPost';

export default function QuestionWriteBlock() {
  const { loginState, userInfo } = useSelector((state) => {
    return { loginState: state.auth.loginState, userInfo: state.auth.userInfo };
  });
  const [title, onChangeTitle] = useInput();
  //const [content, onChangeContent] = useInput('$\\frac{v^{2}}{2}$');
  const [content, setContent] = useState();

  function onChangeContent(e) {
    setContent(e.target.value);
    setHtml(
      unified()
        //.use(breaks)
        .use(parse)
        //.use(slug)
        .use(remark2rehype)
        //.use(raw)
        .use(math)
        .use(katex)
        .use(stringify)
        .processSync(e.target.value)
        .toString()
    );
  }

  const dispatch = useDispatch();

  const onSubmitForm = useCallback(() => {
    if (!title || !content) {
      return alert('게시글을 작성하세요.');
    }
    const formData = new FormData();
    const uid24 = uid(24);
    formData.append('postUID', uid24);
    formData.append('contentType', 'question');
    formData.append('title', title);
    formData.append('content', content);

    if (userInfo.userUID) {
      formData.append('authorUID', userInfo.userUID);
    } else {
      formData.append('authorUID', '비회원 글쓰기');
    }
    dispatch(createQuestion(formData));
  }, [title, content]);

  const [html, setHtml] = useState(
    unified()
      //.use(breaks)
      .use(parse)
      //.use(slug)
      //.use(prismPlugin)
      //.use(embedPlugin)
      .use(remark2rehype)
      //.use(raw)
      .use(math)
      .use(katex)
      .use(stringify)
      //.use(remark2react)
      .processSync(content)
      //.result
      .toString()
  );

  return (
    <>
      {' '}
      <form onSubmit={onSubmitForm}>
        <div>
          <label for="title">title:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={onChangeTitle}
          />
        </div>
        <div>
          <label for="content">content:</label>
          <textarea
            id="content"
            value={content}
            onChange={onChangeContent}
          ></textarea>
        </div>
        <div id="preview">
          <div dangerouslySetInnerHTML={{ __html: html }} />
          {
            //unified()
            //  .use(parse)
            //  .use(math)
            //  .use(remark2rehype)
            //  .use(katex)
            //  .use(remark2react)
            //  .processSync(content).result
          }
        </div>
        <div class="button">
          <button type="submit">Send your message</button>
        </div>
      </form>
    </>
  );
}
