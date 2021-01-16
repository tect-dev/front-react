import React, { useCallback, useEffect, useState } from 'react'
import { Button } from './Button'
import styled from 'styled-components'
import { FaBold, FaItalic, FaLink, FaCode, FaSuperscript } from 'react-icons/fa'

export default React.memo(function MarkdownEditorBlock({
  onChangeContentProps,
  contentProps,
  width,
  height,
}) {
  const [localContent, setLocalContent] = useState(contentProps)

  const onChangeContent = useCallback(
    (e) => {
      e.preventDefault()
      setLocalContent(e.target.value)
      onChangeContentProps(e.target.value)
    },
    [onChangeContentProps]
  )

  const addCodeBlock = useCallback(
    (e) => {
      e.preventDefault()
      const addedContent = `${localContent}\n\`\`\`c\nint main () {\n  printf('hello world!');\n  return 0;\n}\n\`\`\``
      setLocalContent(addedContent)
      onChangeContentProps(addedContent)
    },
    [localContent, onChangeContentProps]
  )

  const addMathBlock = useCallback(
    (e) => {
      e.preventDefault()
      const addedContent = `${localContent}\n$-\\frac{\\hbar^{2}}{2m} \\nabla^{2} \\psi + V \\psi = E \\psi$`
      setLocalContent(addedContent)
      onChangeContentProps(addedContent)
    },
    [localContent, onChangeContentProps]
  )

  const addBoldText = useCallback(
    (e) => {
      e.preventDefault()
      const addedContent = `${localContent} **Bold Text**`
      setLocalContent(addedContent)
      onChangeContentProps(addedContent)
    },
    [localContent, onChangeContentProps]
  )

  const addItalicText = useCallback(
    (e) => {
      e.preventDefault()
      const addedContent = `${localContent} *Italic Text*`
      setLocalContent(addedContent)
      onChangeContentProps(addedContent)
    },
    [localContent, onChangeContentProps]
  )

  const addLargeTitle = useCallback(
    (e) => {
      e.preventDefault()
      const addedContent = `${localContent}\n## Large Title`
      setLocalContent(addedContent)
      onChangeContentProps(addedContent)
    },
    [localContent, onChangeContentProps]
  )

  const addSmallTitle = useCallback(
    (e) => {
      e.preventDefault()
      const addedContent = `${localContent}\n### Small Title`
      setLocalContent(addedContent)
      onChangeContentProps(addedContent)
    },
    [localContent, onChangeContentProps]
  )

  const addLink = useCallback(
    (e) => {
      e.preventDefault()
      const addedContent = `${localContent} [오른쪽 괄호안에는 링크 주소를 적습니다](https://tect.dev)`
      setLocalContent(addedContent)
      onChangeContentProps(addedContent)
    },
    [localContent, onChangeContentProps]
  )

  return (
    <>
      <div>
        <Button onClick={addCodeBlock}>
          <FaCode />
        </Button>
        <Button onClick={addMathBlock}>
          <FaSuperscript />
        </Button>
        <Button onClick={addBoldText}>
          <FaBold />
        </Button>
        <Button onClick={addLargeTitle}>L</Button>
        <Button onClick={addSmallTitle}>S</Button>
        <Button onClick={addItalicText}>
          <FaItalic />
        </Button>
        <Button onClick={addLink}>
          <FaLink />
        </Button>
        <label htmlFor="content"></label>
        <textarea
          id="content"
          value={contentProps}
          onChange={onChangeContent}
          style={{ width: width, height: height }}
        ></textarea>
      </div>
    </>
  )
})
