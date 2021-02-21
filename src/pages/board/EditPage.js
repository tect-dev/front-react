import React from 'react'

import { useSelector } from 'react-redux'

import WritePage from './WritePage'
import { Redirect } from 'react-router-dom'

const EditPage = () => {
  const { data, userID, userPlace } = useSelector((state) => {
    return {
      data: state.board,
      userID: state.auth.userID,
      userPlace: state.auth.userPlace,
    }
  }) || {
    data: null,
    userID: null,
  }
  return (
    <>
      {data.postID && userID === data?.postAuthor?.firebaseUid ? (
        <WritePage
          match={{ params: { category: userPlace } }}
          prevPost={data}
        />
      ) : (
        <Redirect to="/board/main" />
      )}
    </>
  )
}

export default EditPage
