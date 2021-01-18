import { useCallback, useEffect, useLayoutEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import MainLayout from '../../components/layout/MainLayout'
import { readQuestionList } from '../../redux/readPost'
import { Link } from 'react-router-dom'
import QuestionBlock from '../../components/question/QuestionBlock'
import { Spinner } from '../../components/Spinner'

import { Button } from '../../components/Button'
import { Pagination } from '../../components/Pagination'

import '../../styles/page/question/QuestionListPage.scss'

export default function QuestionListPage() {
  const { loading, data, error } = useSelector((state) => {
    return state.readPost.questionList
  })

  const dispatch = useDispatch()

  // useCallback : 함수의 불필요한 리렌더링을 막기 위한 hooks.
  // react 는 컴포넌트가 리렌더링되면 함수도 새로 생기는데, 반복적으로 사용하는 함수를 리렌더링 하지 않고 재사용하기 위함.

  useEffect(() => {
    dispatch(readQuestionList())
  }, [dispatch])

  if (loading)
    return (
      <MainLayout>
        <Spinner />
      </MainLayout>
    )
  if (error)
    return (
      <MainLayout>
        <div>error...</div>
      </MainLayout>
    )

  if (!data)
    return (
      <MainLayout>
        <div>no data</div>
      </MainLayout>
    )

  return (
    <>
      <MainLayout>
        <div className="questionList-container">
          <section>
            <div className="questionList-left">
              <div className="questionList-left-top">
                <div className="questionList-title-container">
                  <div className="questionList-Latest">최신</div>
                  {/*인기순 정렬은 나중에 추가하자*/}
                  {/*<div className="questionList-popular">인기</div>*/}
                </div>
                <Link to={'/question/write'} className="ask-btn-container">
                  <Button className="ask-btn" buttonStyle="btn--outline">
                    질문하기
                  </Button>
                </Link>
              </div>
              <div className="questionList">
                <Pagination data={data} />
              </div>
            </div>
          </section>
          <section>
            <div className="questionList-right">
              <div className="questionList-right-title">Tags</div>
            </div>
          </section>
        </div>
      </MainLayout>
    </>
  )
}
