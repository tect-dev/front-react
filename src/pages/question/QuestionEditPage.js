import React, { useEffect, useCallback, useState } from 'react'
import { useInput } from '../../hooks/hooks'
import MainLayout from '../../components/layout/MainLayout'
import DoublesideLayout from '../../components/layout/DoublesideLayout'
import { useSelector, useDispatch } from 'react-redux'
import MarkdownRenderingBlock from '../../components/MarkdownRenderingBlock'
import QuestionEditSection from '../../components/question/QuestionEditSection'
import { useHistory } from 'react-router-dom'

export default function QuestionEditPage() {
  const { data, userID } = useSelector((state) => {
    return {
      data: state.readPost.question.data,
      userID: state.auth.userID,
    }
  }) || {
    data: { question: { questionBody: '' } },
    userID: null,
  }

  const history = useHistory()

  useEffect(() => {
    if (data.question.questionBody.authorID !== userID) {
      alert('잘못된 접근입니다.')
      history.push('/question')
    }
  }, [history])

  return (
    <DoublesideLayout>
      <QuestionEditSection initialData={data} />
    </DoublesideLayout>
  )
}
