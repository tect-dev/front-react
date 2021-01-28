import React from 'react'
import styled from 'styled-components'

const Textarea = styled.textarea`
  display: -moz-box;
  width: 100%;
  border-radius: 5px;
  transition: all ease 0.2s;
  min-height: 50px;
  /* resize: none; */
  &:focus{
    border: 1px solid rgba(0, 190, 190, 0.2);
    outline: none;
    box-shadow: 0px 0px 3px 0px rgba(0, 190, 190, 0.5);
    
    transition: all ease 0.2s;
  }
`

export const CommentTextarea = ({
  commentContent,
  onChangeComment
}) => {
  return (
    <Textarea value={commentContent} onChange={onChangeComment}/>
  )
}
