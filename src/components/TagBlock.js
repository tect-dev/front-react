import React, { useCallback } from 'react'
import styled from 'styled-components'

const StyledTagBlock = styled.div`
  display: inline-flex;
  border-radius: 5px;
  background: #69bc69;
  color: #ffffff;
  padding: 2px 2px;
  margin: 2px 2px 0 2px;
  width: inherit;
  opacity: 0.8;
  &:hover {
    background: #69bc69;
    color: #ffffff;
    transition: all ease-in 0.2s;
    opacity: 1;
    cursor: pointer;
  }
`

export const TagBlock = React.memo(({ text, functionProps }) => {
  const onClickTag = useCallback((e) => {
    alert('tag is clicked!')
  })
  return <StyledTagBlock onClick={onClickTag}>{text}</StyledTagBlock>
})
