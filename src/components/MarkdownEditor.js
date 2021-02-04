import React, { useCallback, useState } from 'react'

import styled from 'styled-components'
import {
  FaBold,
  FaItalic,
  FaLink,
  FaCode,
  FaSuperscript,
  FaHeading,
} from 'react-icons/fa'

MarkdownEditor.defaultProps = {
  width: '600px',
  height: '400px',
}

function MarkdownEditor({ bindingText, bindingSetter, width, height }) {
  const [localText, setLocalText] = useState(bindingText)

  const onChangeText = useCallback(
    (e) => {
      // e.target.value 에서 \n을 <br /> 으로 치환한뒤 이걸 넣어주자.

      setLocalText(e.target.value)
      bindingSetter(e.target.value)
    },
    [bindingSetter]
  )

  const addCodeBlock = useCallback(
    (e) => {
      e.preventDefault()
      const addedContent = `${localText}\n\`\`\`c\nint main () {\n  printf('hello world!');\n  return 0;\n}\n\`\`\``
      setLocalText(addedContent)
      bindingSetter(addedContent)
    },
    [localText, bindingSetter]
  )

  const addMathBlock = useCallback(
    (e) => {
      e.preventDefault()
      const addedContent = `${localText}\n$-\\frac{\\hbar^{2}}{2m} \\nabla^{2} \\psi + V \\psi = E \\psi$`
      setLocalText(addedContent)
      bindingSetter(addedContent)
    },
    [localText, bindingSetter]
  )

  const addBoldText = useCallback(
    (e) => {
      e.preventDefault()
      const addedContent = `${localText} **Bold Text**`
      setLocalText(addedContent)
      bindingSetter(addedContent)
    },
    [localText, bindingSetter]
  )

  const addItalicText = useCallback(
    (e) => {
      e.preventDefault()
      const addedContent = `${localText} *Italic Text*`
      setLocalText(addedContent)
      bindingSetter(addedContent)
    },
    [localText, bindingSetter]
  )

  const addLargeTitle = useCallback(
    (e) => {
      e.preventDefault()
      const addedContent = `${localText}\n## Large Title`
      setLocalText(addedContent)
      bindingSetter(addedContent)
    },
    [localText, bindingSetter]
  )

  const addLink = useCallback(
    (e) => {
      e.preventDefault()
      const addedContent = `${localText} [오른쪽 괄호안에는 링크 주소를 적습니다](https://tect.dev)`
      setLocalText(addedContent)
      bindingSetter(addedContent)
    },
    [localText, bindingSetter]
  )

  return (
    <div>
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
        <StyledTextarea
          id="content"
          value={bindingText}
          onChange={onChangeText}
          maxLength={10000}
          style={{ width: width, height: height }}
        ></StyledTextarea>
      </div>
    </div>
  )
}

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

const StyledTextarea = styled.textarea`
  border: none;
  padding: 10px;
  background-color: #f8f9fa !important;
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

export default React.memo(MarkdownEditor)
