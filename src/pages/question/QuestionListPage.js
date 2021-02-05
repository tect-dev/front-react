import { useCallback, useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import MainLayout from '../../components/layout/MainLayout'
import { readQuestionList, readHashtagResults, refreshHashtag } from '../../redux/readPost'
import { Link } from 'react-router-dom'
import QuestionBlock from '../../components/question/QuestionBlock'
import { Spinner } from '../../components/Spinner'

import { Button } from '../../components/Button'
import { Pagination } from '../../components/Pagination'

import '../../styles/page/question/QuestionListPage.scss'
import styled from 'styled-components'
import { colorPalette } from '../../lib/constants'

export default function QuestionListPage({ location }) {
  const { loading, data, error } = useSelector((state) => {
    return state.readPost.questionList
  })
  let hashtag = useSelector((state)=>{
    return state.readPost.hashtag
  })
  const { loginState } = useSelector((state) => {
    return { loginState: state.auth.loginState }
  })

  const [ title, setTitle ] = useState(hashtag ? hashtag : "최신")

  const dispatch = useDispatch()

  // useCallback : 함수의 불필요한 리렌더링을 막기 위한 hooks.
  // react 는 컴포넌트가 리렌더링되면 함수도 새로 생기는데, 반복적으로 사용하는 함수를 리렌더링 하지 않고 재사용하기 위함.

  useEffect(() => {
    if(!hashtag){
      dispatch(readQuestionList(false))
    }
    return () => {
      dispatch(refreshHashtag())
    }
  }, [dispatch])

  useEffect(()=>{
    if(hashtag){
      setTitle(hashtag)
    }
  }, [hashtag])

  if (loading)
    return (
      <MainLayout>
        <Spinner/>
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

  const selectTitleLatest = (e) => {
    e.preventDefault()
    setTitle('최신')
    dispatch(readQuestionList(true))
  }
  const selectTitleHashtag = (e) => {
    e.preventDefault()
    const target = e.target.innerText.replace('#', '')
    setTitle(target)
    if(title === "최신"){
      dispatch(readHashtagResults(target))
    }
  }

  return (
    <>
      <MainLayout>
        <div className="questionList-container">
          <section>
            <div className="questionList-left">
              <div className="questionList-left-top">
                <TitleContainer>
                  {title === "최신"
                    ? <SelectedTitle>최신</SelectedTitle>
                    : <Title onClick={selectTitleLatest}>최신</Title>
                  }
                  {hashtag
                    ? <>
                      {title === hashtag
                        ? <SelectedTitle>{"#" + hashtag}</SelectedTitle>
                        : <Title onClick={selectTitleHashtag}>{"#" + hashtag}</Title>
                      }
                      </>
                    : null}
                </TitleContainer>
                {loginState ? (
                  <Link to={'/question/write'} className="ask-btn-container">
                    <Button className="ask-btn" buttonStyle="btn--outline">
                      질문하기
                    </Button>
                  </Link>
                ) : (
                  ''
                )}
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

export const TitleContainer = styled.div`
  display: flex;
  font-size: 24px;
  font-weight: 700;
`

export const Title = styled.div`
  color: ${colorPalette.gray7};
  border-bottom: 2px solid ${colorPalette.gray7};
  margin-right: 1vw;
  cursor: pointer;
`

export const SelectedTitle = styled(Title)`
  color: #00bebe;
  border-bottom: 2px solid #00bebe;
`