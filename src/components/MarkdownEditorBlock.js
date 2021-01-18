import React, { useCallback, useEffect, useState } from 'react'
import { Button } from './Button'
import styled from 'styled-components'
import {
  FaBold,
  FaItalic,
  FaLink,
  FaCode,
  FaSuperscript,
  FaHeading,
} from 'react-icons/fa'
import { mediaQuery, colorPalette, mediaSize } from '../lib/constants'

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
      // e.target.value 에서 \n을 <br /> 으로 치환한뒤 이걸 넣어주자.

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
      <EditorContainer>
        <MarkdownToolkit>
          <MarkdownButton onClick={addCodeBlock}>
            <FaCode />
          </MarkdownButton>
          <MarkdownButton onClick={addMathBlock}>
            <FaSuperscript />
          </MarkdownButton>
          <MarkdownButton onClick={addBoldText}>
            <FaBold />
          </MarkdownButton>
          <MarkdownButton onClick={addLargeTitle}>
            <FaHeading />
          </MarkdownButton>
          <MarkdownButton onClick={addItalicText}>
            <FaItalic />
          </MarkdownButton>
          <MarkdownButton onClick={addLink}>
            <FaLink />
          </MarkdownButton>
        </MarkdownToolkit>
        <div>
          <label htmlFor="content"></label>
          <StyledTextarea
            id="content"
            value={contentProps}
            onChange={onChangeContent}
            style={{ width: width, height: height }}
          ></StyledTextarea>
        </div>
      </EditorContainer>
    </>
  )
})

const MarkdownToolkit = styled.div`
  margin-bottom: 10px;
`
const MarkdownButton = styled.button`
  border-radius: 3px;
  display: inline-flex;
  padding: 8px 10px;
  border-radius: 5px;
  color: '#ffffff';
  background-color: transparent;
  outline: 0;
  cursor: pointer;
  border: none;
  justify-content: space-around;
  font-family: Arial, sans-serif;
`

const EditorContainer = styled.div`
  ${mediaSize.small} {
  }
`
const StyledTextarea = styled.textarea`
  border: none;
  padding: 10px;
  background-color: ${colorPalette.gray0} !important;
  &:active {
    border: none;
  }
  &:focus {
    outline: none;
  }
  &:hover {
    border: none;
  }
`
