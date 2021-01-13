import React, { useCallback, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { writeContent } from '../redux/createPost';

export default function MarkdownEditorBlock({
  onChangeContentProps,
  initialContent,
}) {
  //const [content, setContent] = useState(initialContent);

  return (
    <>
      <label htmlFor="content"></label>
      <textarea
        id="content"
        //value={content}
        onChange={onChangeContentProps}
      ></textarea>
    </>
  );
}
