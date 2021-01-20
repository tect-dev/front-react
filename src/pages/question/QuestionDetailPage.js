import { useEffect, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { readQuestionByUID } from '../../redux/readPost'
import HalfWidthContainer from '../../components/layout/HalfWidthContainer'
import MainLayout from '../../components/layout/MainLayout'
import DoublesideLayout from '../../components/layout/DoublesideLayout'

import QuestionSection from '../../components/question/QuestionSection'
import AnswerSection from '../../components/question/AnswerSection'
import { Spinner } from '../../components/Spinner'


// 상속
// import Navbar from '../../components/layout/Navbar'
// import Footer from '../../components/layout/Footer'
// import '../../styles/layout/MainLayout.scss'

export default function QuestionDetailPage({ match }) {
  const questionID = match.params.questionID
  const { loading, data, error } = useSelector((state) => {
    return state.readPost.question
  })

  const dispatch = useDispatch()

  const getQuestionAsync = useCallback(() => {
    dispatch(readQuestionByUID(questionID))
  }, [dispatch, questionID])

  useEffect(() => {
    getQuestionAsync()
  }, [dispatch])

  if (loading)
    return (
      <MainLayout>
        <Spinner />
      </MainLayout>
    )

  if (error) {
    console.log(error)
    return (
      <MainLayout>
        <div>error...</div>
      </MainLayout>
    )
  }
  if (!data)
    return (
      <>
        <MainLayout>no data</MainLayout>
      </>
    )
  return (
    <>
      <DoublesideLayout>
          <HalfWidthContainer>
            <QuestionSection data={data} />
          </HalfWidthContainer>
          <HalfWidthContainer>
            <AnswerSection data={data} />
          </HalfWidthContainer>
      </DoublesideLayout>
    </>
  )
}
