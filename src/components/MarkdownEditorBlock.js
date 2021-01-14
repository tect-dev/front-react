import React, { useCallback, useEffect, useState } from 'react'

export default React.memo(function MarkdownEditorBlock({
  onChangeContentProps,
  contentProps,
}) {
  //const [content, setContent] = useState(initialContent);

  return (
    <>
      <label htmlFor="content"></label>
      <textarea
        id="content"
        value={contentProps}
        onChange={onChangeContentProps}
      ></textarea>
    </>
  )
})
