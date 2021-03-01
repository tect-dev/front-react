import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import MainWrapper from '../../wrappers/MainWrapper'
import { Link } from 'react-router-dom'
import PageButtons from '../../components/PageButtons'

import { Spinner } from '../../components/Spinner'
import { DefaultButton } from '../../components/Button'
import { StyledTagBlock } from '../../components/TagBlock'

import '../../styles/page/question/QuestionListPage.scss'
import styled from 'styled-components'
import {
  colorPalette,
  boxShadow,
  hoverAction,
  fontSize,
  mediaSize,
} from '../../lib/constants'
import { isoStringToNaturalLanguage } from '../../lib/functions'

import ErrorPage from '../../components/layout/ErrorPage'
import NoDataPage from '../../components/layout/NoDataPage'

import { searchPostList, changeSortingMethod } from '../../redux/board'
import { setUserPlace } from '../../redux/auth'
import queryString from 'query-string'
import { authService } from '../../lib/firebase'
import { Search } from '../../components/Search'

export default function SearchedPage({ match, location }) {
  const target = location.pathname.split('/')[2].split('?')[0]

  const pageNumber = queryString.parse(location.search).page
  const dispatch = useDispatch()
  const { postList, loading, error, postSum, sortingMethod } = useSelector(
    (state) => {
      return {
        postList: state.board.postList,
        loading: state.board.loading,
        error: state.board.error,
        postSum: state.board.postSum,
        sortingMethod: state.board.sortingMethod,
      }
    }
  )
  const { loginState, emailVerified } = useSelector((state) => {
    return {
      loginState: state.auth.loginState,
      emailVerified: state.auth.emailVerified,
    }
  })
  const postPerPage = 10
  const pageMaxNumber = Math.floor(postSum / postPerPage) + 1
  const pageArray = []
  for (let i = 0; i < pageMaxNumber; i++) {
    pageArray.push(i + 1)
  }

  useEffect(() => {
    authService.currentUser?.reload()
    dispatch(setUserPlace('main'))
    dispatch(searchPostList(target, pageNumber))
  }, [target, pageNumber])

  if (loading)
    return (
      <MainWrapper>
        <Spinner />
      </MainWrapper>
    )
  if (error) return <ErrorPage>{error.toString()}</ErrorPage>

  return (
    <MainWrapper>
      <TwoOneMainWapper>
        <BoardListWrapper>
          <BoardListHeader>
            <Target>
              검색결과:{' '}
              {target !== 'main' && sortingMethod === 'time' ? target : '전체'}
            </Target>
            <Menuline>
              <Search />
              <Buttons>
                <Button>
                  {loginState && authService.currentUser.emailVerified ? (
                    <Link to={`/write/${target}`}>새 글 쓰기</Link>
                  ) : (
                    ''
                  )}
                </Button>
              </Buttons>
            </Menuline>
          </BoardListHeader>

          {postList.map((postData, idx) => {
            return (
              <Link to={`/post/${postData._id}`} key={idx}>
                <PostCard>
                  <Title>{postData.title}</Title>
                  <ContentSubstring>
                    {postData.contentSubstring}
                  </ContentSubstring>
                  {/* <div>{postData.createdAt}</div> */}

                  <LikeComment>
                    <StyledTagBlock style={{ marginRight: '10px' }}>
                      {postData.hashtags[0]}
                    </StyledTagBlock>
                    <div style={{ marginRight: '10px' }}>
                      {isoStringToNaturalLanguage(postData.createdAt)}
                    </div>

                    <div style={{ marginRight: '10px' }}>
                      좋아요 {postData.like}
                    </div>
                    <div>댓글 {postData.answerSum}</div>
                  </LikeComment>
                  {/* <div>{postData.author[0]?.displayName}</div>
                  <div>{postData.hashtags[0]}</div> */}
                </PostCard>
              </Link>
            )
          })}
        </BoardListWrapper>
      </TwoOneMainWapper>
      <PageButtonArea>
        <PageButtonContainer>
          <PageButtons
            pageNumber={pageNumber}
            treePerPage={10}
            postSum={postSum}
            routingString={`searched/${target}`}
          />
        </PageButtonContainer>
      </PageButtonArea>
    </MainWrapper>
  )
}

const PageButtonContainer = styled.div`
  display: flex;
`

const PageButtonArea = styled.div`
  width: 90%;
  display: grid;
  justify-items: center;
  padding: 1rem;
`

const SelectedButton = styled(DefaultButton)`
  background-color: ${colorPalette.mainGreen};
`

export const TwoOneMainWapper = styled.div`
  width: inherit;
  display: grid;
  grid-template-columns: 1fr;
  /* grid-template-columns: 2fr 1fr; */
  @media (max-width: 1440px) {
    /* grid-template-columns: 2fr 1fr; */
  }
  @media (max-width: 1024px) {
    /* grid-template-columns: 2fr 1fr; */
  }
  @media (max-width: 650px) {
    /* grid-template-columns: 1fr; */
  }
`
export const BoardListWrapper = styled.div`
  width: inherit;
  display: grid;
  grid-row-gap: 25px;
  box-sizing: border-box;
  /* border: 1px solid 'black'; */
`

export const BoardSideBarWrapper = styled.div`
  display: grid;
  grid-row-gap: 25px;
`

export const Menuline = styled.div`
  height: 30px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
`

const Buttons = styled.div`
  display: flex;
  max-width: 100%;
`

export const Button = styled.button`
  cursor: pointer;
  height: initial;
  background: none;
  border: none;
  margin-left: 10px;
  & a {
    height: 30px;
    padding: 6px 14px 5px 14px;
    border-radius: 13px;
    background: #6d9b7b;
    color: white;
    font-weight: bold;
    font-size: ${fontSize.small};
  }
`

export const Button2 = styled(Button)`
  display: flex;
  color: #707070;
  & span {
    align-self: flex-end;
    margin-bottom: 2px;
  }
`

export const Target = styled.div`
  font-size: ${fontSize.xlarge};
  color: #707070;
  font-weight: bold;
`

export const BoardListHeader = styled.div`
  width: inherit;
  padding-left: 10px;
`

export const Title = styled.div`
  font-size: ${fontSize.small};
  color: #6d9b7b;
  font-weight: bold;
  margin-bottom: 17px;
`

export const ContentSubstring = styled.div`
  font-size: ${fontSize.small};
  color: #999;
  margin-bottom: 22px;
  width: calc(80px + 60vw);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

export const LikeComment = styled.div`
  display: flex;
  font-size: ${fontSize.small};
  color: #999;
  justify-content: flex-end;
`

export const PostCard = styled.div`
  padding: 22px;
  box-sizing: border-box;
  background: #fffef8;
  width: inherit;
  height: 140px;
  border-radius: 22px;
  cursor: pointer;
  ${mediaSize.xsmall} {
    & {
      padding: 20px 10px;
    }
  }

  background-color: #fffef8;
  box-shadow: ${boxShadow.default};

  transition: 0.25s box-shadow ease-in, 0.25s transform ease-in;
  &:hover {
    ${hoverAction}
  }
`
export const TrendingListCard = styled.div`
  padding: 25px;
  width: 80%;

  background-color: #ffffff;
  box-shadow: ${boxShadow.default};
`
