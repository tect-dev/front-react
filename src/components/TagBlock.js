import React, { useCallback } from 'react'
import styled from 'styled-components'
import { colorPalette } from '../lib/constants'

export const StyledTagBlock = styled.div`
  //display: inline-flex;
  border-radius: 5px;
  background: ${colorPalette.mainGreen};
  color: #ffffff;
  padding-bottom: 2px;
  padding-left: 5px;
  padding-right: 5px;
  margin: 2px;
  width: inherit;
  opacity: 0.8;
  &:hover {
    background: ${colorPalette.mainGreen};
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
