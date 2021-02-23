import MainWrapper from '../../wrappers/MainWrapper'
import { Spinner } from '../../components/Spinner'
import React, { useEffect, useState, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { readPostDetail, deletePost, likePost } from '../../redux/board'
import { fontSize, AnonymousSVG } from '../../lib/constants'
import { Link, useHistory } from 'react-router-dom'
import MarkdownRenderer from '../../components/MarkdownRenderer'
import {
  AnswerEditor,
  AnswerTextarea,
} from '../../components/board/AnswerEditor'
import { Answer } from '../../components/board/Answer'
import LikeSproutGray from '../../assets/LikeSproutGray.svg'
import LikeSproutGreen from '../../assets/LikeSproutGreen.svg'

import styled from 'styled-components'

export default function PostDetailPage({ match }) {
  const { postID } = match.params
  const dispatch = useDispatch()
  const history = useHistory()
  const {
    user,
    myID,
    loading,
    postTitle,
    postContent,
    postCreatedAt,
    postAuthor,
    postPlace,
    postAnswers,
    postLike,
    postLikeUsers,
    myUserInfo,
  } = useSelector((state) => {
    return {
      user: state.auth,
      myID: state.auth.userID,
      myUserInfo: state.auth.myUserInfo,
      loading: state.board.loading,
      postPlace: state.auth.userPlace,
      postTitle: state.board.postTitle,
      postContent: state.board.postContent,
      postCreatedAt: state.board.postCreatedAt,
      postAuthor: state.board.postAuthor,
      postAnswers: state.board.postAnswers,
      postLike: state.board.postLike,
      postLikeUsers: state.board.postLikeUsers,
    }
  })
  const [answers, setAnswers] = useState(null)
  const [isEdit, setIsEdit] = useState(false)

  const onSetIsEdit = useCallback((param) => {
    setIsEdit(param)
  }, [])

  useEffect(() => {
    dispatch(readPostDetail(postID))
  }, [])

  useEffect(() => {
    setAnswers(postAnswers)
  }, postAnswers)

  const onSetAnswers = useCallback((answers) => {
    setAnswers(answers)
  }, [])

  const onDeleteQuestion = useCallback(() => {
    //alert('정말 삭제합니까?');
    dispatch(deletePost(postID))
  }, [dispatch])

  if (loading) {
    return (
      <MainWrapper>
        <Spinner />
      </MainWrapper>
    )
  }

  return (
    <MainWrapper>
      <PlaceContainer>
        <Link to={`/board/${postPlace}?page=1`}>{postPlace}</Link>
      </PlaceContainer>
      <PostContainer>
        <PostHeader>
          <PostHeader_Left>
            <AnonymousSVG />
            <AuthorName>{postAuthor.displayName}</AuthorName>
          </PostHeader_Left>
          {postLikeUsers.find((ele) => ele == myID) ? (
            <Likes
              onClick={() => {
                dispatch(likePost(postID))
              }}
            >
              <img
                src={LikeSproutGreen}
                style={{ width: '24px', height: '24px' }}
              />
              <span style={{ color: '#6d9b7b' }}>{postLike}</span> likes
            </Likes>
          ) : (
            <Likes
              onClick={() => {
                dispatch(likePost(postID))
              }}
            >
              <img
                src={LikeSproutGray}
                style={{ width: '24px', height: '24px' }}
              />
              <span style={{ color: '#6d9b7b' }}>{postLike}</span> likes
            </Likes>
          )}
        </PostHeader>
        <PostTitle>{postTitle}</PostTitle>
        <PostContent>
          <MarkdownRenderer text={postContent} style={{ padding: '0px' }} />
        </PostContent>
        {/* {postCreatedAt} */}
        {user.userID === postAuthor?.firebaseUid ? (
          <PostFooter>
            <Button>
              <Link to={`edit/${postID}`}>수정</Link>
            </Button>
            <Button onClick={onDeleteQuestion}>삭제</Button>
          </PostFooter>
        ) : (
          ''
        )}
      </PostContainer>

      {answers?.length
        ? answers.map((answer, idx) => {
            return (
              <AnswerContainer>
                <Answer
                  answer={answer}
                  answers={answers}
                  setAnswers={onSetAnswers}
                  key={idx}
                  user={user}
                ></Answer>
              </AnswerContainer>
            )
          })
        : null}

      {user.loginState && (
        <AnswerEditor
          user={user}
          postID={postID}
          answers={answers}
          setAnswers={onSetAnswers}
        />
      )}
      {/*목록을 누르면 어느 페이지로 가야되는가?*/}
      {/*<BackButton
        onClick={(e) => {
          e.preventDefault()
          history.push(`/board/${postPlace}`)
        }}
      >
        <HamburgerSVG />
        <span>목록</span>
      </BackButton>*/}
    </MainWrapper>
  )
}

export const AnswerContainer = styled.div`
  border-radius: 22px;
  border: 0.7px solid #6d9b7b;
  padding: 20px 20px 0px 20px;
  background: #fffef8;
  margin-bottom: 10px;
  & > div:not(div:first-child) {
    border-top: 0.5px solid #6d9b7b;
  }
`

const PlaceContainer = styled.div`
  padding: 40px 20px;
  font-size: ${fontSize.xlarge};
  font-weight: bold;
  //color: #707070;
`

export const PostContainer = styled.div`
  background: #fffef8;
  border-radius: 22px;
  border: 0.7px solid #6d9b7b;
  padding: 20px 40px 20px 20px;
  margin-bottom: 10px;
`

export const PostHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 17px;
`

export const PostHeader_Left = styled.div`
  display: flex;
  /* justify-content: space-between; */
  align-items: center;
`

// export const AnonymousSVG = () => {
//   return (
//     <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
//       <g id="그룹_14" data-name="그룹 14" transform="translate(-365 -717)">
//         <rect id="사각형_73" data-name="사각형 73" width="40" height="40" rx="10" transform="translate(365 717)" fill="#b2c8b4"/>
//         <g id="그룹_3" data-name="그룹 3" transform="translate(-8.137 450.947)">
//           <circle id="타원_1" data-name="타원 1" cx="7.298" cy="7.298" r="7.298" transform="translate(385.846 276)" fill="#fff"/>
//           <path id="패스_1" data-name="패스 1" d="M393.137,414a12.151,12.151,0,0,0-12.151,12.136h24.3A12.151,12.151,0,0,0,393.137,414Z" transform="translate(0 -121.083)" fill="#fff"/>
//         </g>
//       </g>
//     </svg>
//   )
// }

export const AuthorName = styled.div`
  font-size: ${fontSize.small};
  font-weight: bold;
  margin-left: 10px;
  color: #707070;
`

export const Likes = styled.button`
  all: unset;
  cursor: pointer;
  font-size: ${fontSize.small};
  font-weight: bold;
  color: #707070;

  &:hover {
    color: #6d9b7b;
  }
`

export const PostTitle = styled.div`
  margin-bottom: 21px;
  color: #6d9b7b;
  font-size: ${fontSize.large};
  font-weight: bold;
`

export const PostContent = styled.div`
  font-size: ${fontSize.medium};
  //color: #999;
  padding-left: 1rem;
  padding-right: 1rem;
  margin-bottom: 66px;
`
export const PostFooter = styled.div`
  display: flex;
  flex-direction: row-reverse;
`

export const Button = styled.button`
  all: unset;
  cursor: pointer;
  padding: 5px 20px;
  font-size: ${fontSize.medium};
  background: #b2c8b4;
  color: #f8f6ed;
  border-radius: 10px;
  margin-left: 10px;
`

const HamburgerSVG = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="17.033"
      height="10.531"
      viewBox="0 0 17.033 10.531"
    >
      <g id="그룹_21" data-name="그룹 21" transform="translate(-319 -572)">
        <g id="그룹_12" data-name="그룹 12" transform="translate(320 573)">
          <g id="그룹_10" data-name="그룹 10" transform="translate(3.417)">
            <line
              id="선_17"
              data-name="선 17"
              x2="11.616"
              transform="translate(0)"
              fill="rgba(0,0,0,0)"
              stroke="#b2c8b4"
              stroke-linecap="round"
              stroke-width="2"
            />
            <line
              id="선_18"
              data-name="선 18"
              x2="11.616"
              transform="translate(0 4.266)"
              fill="rgba(0,0,0,0)"
              stroke="#b2c8b4"
              stroke-linecap="round"
              stroke-width="2"
            />
            <line
              id="선_19"
              data-name="선 19"
              x2="11.616"
              transform="translate(0 8.531)"
              fill="rgba(0,0,0,0)"
              stroke="#b2c8b4"
              stroke-linecap="round"
              stroke-width="2"
            />
          </g>
          <g id="그룹_11" data-name="그룹 11">
            <line
              id="선_17-2"
              data-name="선 17"
              transform="translate(0.035)"
              fill="rgba(0,0,0,0)"
              stroke="#b2c8b4"
              stroke-linecap="round"
              stroke-width="2"
            />
            <line
              id="선_18-2"
              data-name="선 18"
              transform="translate(0 4.266)"
              fill="rgba(0,0,0,0)"
              stroke="#b2c8b4"
              stroke-linecap="round"
              stroke-width="2"
            />
            <line
              id="선_19-2"
              data-name="선 19"
              x2="0.001"
              transform="translate(0 8.531)"
              fill="rgba(0,0,0,0)"
              stroke="#b2c8b4"
              stroke-linecap="round"
              stroke-width="2"
            />
          </g>
        </g>
      </g>
    </svg>
  )
}

const BackButton = styled.button`
  all: unset;
  display: flex;
  justify-content: center;
  cursor: pointer;
  align-items: center;
  width: 72px;
  height: 32px;
  color: #b2c8b4;
  border: 1px solid #b2c8b4;
  border-radius: 10px;
`
