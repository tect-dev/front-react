import MainWrapper from '../../wrappers/MainWrapper'

import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { readPostDetail } from '../../redux/board'

export default function PostDetailPage({ match }) {
  const { postID } = match.params
  const dispatch = useDispatch()

  const { postTitle, postContent, postCreatedAt, postAuthor } = useSelector(
    (state) => {
      return {
        postTitle: state.board.postTitle,
        postContent: state.board.postContent,
        postCreatedAt: state.board.postCreatedAt,
        postAuthor: state.board.postAuthor,
      }
    }
  )

  useEffect(() => {
    dispatch(readPostDetail(postID))
  }, [])

  return (
    <MainWrapper>
      {postTitle}
      {postContent}
      {postCreatedAt}
    </MainWrapper>
  )
}
