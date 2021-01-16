import React, { useCallback, useEffect, useState } from 'react'

export default React.memo(function MarkdownEditorBlock({
  onChangeContentProps,
  contentProps,
}) {
  const [content, setContent] = useState(contentProps)

  const onChangeContent = useCallback((e) => {
    setContent(e.target.value)
    onChangeContentProps(e)
  }, [])

  return (
    <>
      <label htmlFor="content"></label>
      <textarea
        id="content"
        value={content}
        onChange={onChangeContent}
      ></textarea>
    </>
  )
})
