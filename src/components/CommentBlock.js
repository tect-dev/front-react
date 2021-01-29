import React from 'react'
import styled from 'styled-components'
import { colorPalette } from '../lib/constants'
import { refineDatetime } from '../lib/refineDatetime'

const CommentBox = styled.div`
  border-top: 1px solid ${colorPalette.gray5};
  padding-top: 5px;
  padding-bottom: 25px;
`

const CommentInfo = styled.div`
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
  padding-bottom: 5px;
`
const Datetime = styled.div`
  color: ${colorPalette.gray5};
`

export const CommentBlock = ({ displayName, content, createdAt }) => {
  return (
    <CommentBox>
      <CommentInfo>
        <div>작성자: {displayName}</div>
        <Datetime>{createdAt}</Datetime>
      </CommentInfo>
      <div>{content}</div>
    </CommentBox>
  )
}
