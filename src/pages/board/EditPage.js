import React, { useEffect, useCallback, useState } from 'react'
import { useInput } from '../../hooks/hooks'
import DoublesideLayout from '../../components/layout/DoublesideLayout'
import { useSelector, useDispatch } from 'react-redux'
import MarkdownRenderingBlock from '../../components/MarkdownRenderingBlock'
import WritePage from './WritePage'
import { useHistory, Redirect } from 'react-router-dom'

const EditPage = () => {
  const { data, userID, userPlace } = useSelector((state) => {
    return {
      data: state.board,
      userID: state.auth.userID,
      userPlace: state.auth.userPlace
    }
  }) || {
    data: null,
    userID: null,
  } 
  return (
    <>
      {data.postID && userID === data?.postAuthor?.firebaseUid ? (
        <WritePage match={{params: {category : userPlace}}} prevPost={data}/>
      ) : (
        <Redirect to="/board/main" />
      )}
    </>
  )
}

export default EditPage
