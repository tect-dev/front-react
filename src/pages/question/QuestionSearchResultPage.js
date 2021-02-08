import React, { useEffect, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useLocation, useParams } from 'react-router-dom'
import { readSearchedResults } from '../../redux/readPost'
import MainLayout from '../../components/layout/MainLayout'
import { Spinner } from '../../components/Spinner'

// QuestionListPage의 디자인과 구성을 상속한다.
import { Link } from 'react-router-dom'
import { Button } from '../../components/Button'
import '../../styles/page/question/QuestionListPage.scss'
import { Pagination } from '../../components/Pagination'
import { TitleContainer, Title } from '../question/QuestionListPage'

import ErrorPage from '../../components/layout/ErrorPage'

const QuestionSearchResultPage = () => {
  const { loading, data, error } = useSelector((state) => {
    return state.readPost.searchedResults
  })

  const dispatch = useDispatch()

  const getSearchResultsAsync = useCallback(
    (params) => {
      dispatch(readSearchedResults(params))
    },
    [dispatch]
  )

  const { searchValue } = useParams()
  useEffect(() => {
    // 기존 쿼리방식 삭제
    // const searchParams = new URLSearchParams(location.search)
    // const querystring = searchParams.get("query")
    // getSearchResultsAsync(querystring)
    getSearchResultsAsync(searchValue)
  }, [dispatch, searchValue])

  if (loading)
    return (
      <MainLayout>
        <Spinner />
      </MainLayout>
    )

  if (error) {
    return (
      <ErrorPage>
        {error.toString()}
      </ErrorPage>
    )
  }
  // if (!data | data.length === 0){
  if (!data | (data?.length === 0)) {
    return (
      <>
        <MainLayout>no data</MainLayout>
      </>
    )
  }

  return (
    <>
      <MainLayout>
        <div className="questionList-container">
          <section>
            <div className="questionList-left">
              <div className="questionList-left-top">
                <TitleContainer>
                  <Title>검색결과</Title>
                </TitleContainer>
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
              <div className="questionList-right-title">Trending Tags</div>
            </div>
          </section>
        </div>
      </MainLayout>
    </>
  )
}

export default QuestionSearchResultPage
