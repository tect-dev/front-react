import React, { useEffect, useCallback, useState } from 'react'
import { useInput } from '../../hooks/hooks'
import DoublesideLayout from '../../components/layout/DoublesideLayout'
import { useSelector, useDispatch } from 'react-redux'
import MarkdownRenderingBlock from '../../components/MarkdownRenderingBlock'
import QuestionEditSection from '../../components/question/QuestionEditSection'
import { useHistory, Redirect } from 'react-router-dom'

const EditPage = () => {
  const { loading, data, userID } = useSelector((state) => {
    return {
      loading: state.board.loading,
      data: state.board,
      userID: state.auth.userID,
    }
  }) || {
    data: null,
    userID: null,
  }
  console.log(loading)
  const history = useHistory()
    
  
  return (
    <DoublesideLayout>
      {/* {data ? (
        <QuestionEditSection initialData={data} />
      ) : (
        <Redirect to="/board/main" />
      )} */}
      만드는 중
    </DoublesideLayout>
  )
}

export default EditPage
