import React, { useEffect, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { readSearchedResults } from '../../redux/readPost'
import MainLayout from '../../components/layout/MainLayout'
import { Spinner } from '../../components/Spinner'

// QuestionListPage의 디자인과 구성을 상속한다.
import { Link } from 'react-router-dom'
import { Button } from '../../components/Button'
import '../../styles/page/question/QuestionListPage.scss'
import { Pagination } from '../../components/Pagination'

const QuestionSearchResultPage = () => {
  const { loading, data, error } = useSelector((state) => {
    return state.readPost.searchedResults
  })

  const location = useLocation()

  const dispatch = useDispatch()

  const getSearchResultsAsync = useCallback((params) => {
    dispatch(readSearchedResults(params))
  }, [dispatch])

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search)
    const querystring = searchParams.get("query")
    getSearchResultsAsync(querystring)
  }, [dispatch, location])



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
  // if (!data | data.length === 0){
  if (!data | data?.length === 0){
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
                <div className="questionList-title-container">
                  <div className="questionList-Latest">검색결과</div>
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
                <Pagination data={data}/>
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
