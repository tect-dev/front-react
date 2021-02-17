import MainWrapper from '../../wrappers/MainWrapper'
import { Spinner } from '../../components/Spinner'
import React, { useEffect, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { readPostDetail, deletePost } from '../../redux/board'
import { fontSize } from '../../lib/constants'
import { Link, useHistory } from 'react-router-dom'
import MarkdownRenderer from '../../components/MarkdownRenderer'

import styled from "styled-components"

export default function PostDetailPage({ match }) {
  const { postID } = match.params
  const dispatch = useDispatch()
  const history = useHistory()

  const { userID, loading, postTitle, postContent, postCreatedAt, postAuthor, postPlace } = useSelector(
    (state) => {
      console.log(state)
      return {
        userID: state.auth.userID,
        loading : state.board.loading,
        postPlace: state.auth.userPlace,
        postTitle: state.board.postTitle,
        postContent: state.board.postContent,
        postCreatedAt: state.board.postCreatedAt,
        postAuthor: state.board.postAuthor,
      }
    }
  )

  useEffect(() => {
    dispatch(readPostDetail(postID))
  }, [])

  const onDeleteQuestion = useCallback(() => {
    //alert('정말 삭제합니까?');
    dispatch(deletePost(postID))
  }, [dispatch])

  if (loading){
    return (
      <MainWrapper>
        <Spinner />
      </MainWrapper>
    )
  }

  return (
    <MainWrapper>
      <PlaceContainer>
        <Link to={`/board/${postPlace}`}>{postPlace}</Link>
      </PlaceContainer>
      <PostContainer>
        <PostHeader>
          <PostHeader_Left>
            <AnonymousSVG/>
            <AuthorName>
              {postAuthor.displayName}
            </AuthorName>
          </PostHeader_Left>
          <Likes>
            좋아요 0
          </Likes>
        </PostHeader>
        <PostTitle>
          <MarkdownRenderer text={postTitle} />
        </PostTitle>
        <PostContent>
          {postContent}
        </PostContent>
        {/* {postCreatedAt} */}
        {userID === postAuthor?.firebaseUid ? (
          <PostFooter>
            <Link to={`edit/${postID}`}>
              <Button>수정</Button>
            </Link>
            <Button onClick={onDeleteQuestion}>삭제</Button> 
          </PostFooter>
        ) : (
          ''
        )}
      </PostContainer>
      <div>
        {/* 나중에 map으로 iteration 돌려야 함. */}
        <Comment>
          {/* 아직은 거의 비슷해서 그냥 복붙함. */}
          <PostHeader>
            <PostHeader_Left>
              <AnonymousSVG/>
              <AuthorName>
                익명
              </AuthorName>
            </PostHeader_Left>
            <Likes>
              좋아요 0
            </Likes>
          </PostHeader>
          <CommentContent>
            댓글 본문입니다.
          </CommentContent>
        </Comment>

        <CommentEditor>
          <CommentTextarea
            placeholder="댓글을 입력해주세요"
          />
          <CommentEditor_Right>
            <Anonymous>
              <span>
                익명
              </span>
              <input
                type="checkbox"
                id="anonymousCheck"
              />
              <label htmlFor="anonymousCheck">
              </label>
              
            </Anonymous>
            <CommentSubmit onClick={e=>console.log(e)}>
              등록
            </CommentSubmit>
          </CommentEditor_Right>
        </CommentEditor>
      </div>
      <BackButton onClick={e=>{
        e.preventDefault()
        history.push(`/board/${postPlace}`)
      }}>
        <HamburgerSVG/>
        <span>목록</span>
      </BackButton>
    </MainWrapper>
  )
}

const PlaceContainer = styled.div`
  padding: 40px 20px;
  font-size: ${fontSize.xlarge};
  font-weight: bold;
  color: #707070;
`

const PostContainer = styled.div`
  background: #fffef8;
  border-radius: 22px;
  border: 1px solid #6d9b7b;
  padding: 20px 40px 20px 20px;
  margin-bottom: 10px;
`

const PostHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 17px;
`

const PostHeader_Left= styled.div`
  display: flex;
  /* justify-content: space-between; */
  align-items: center;
`

const AnonymousSVG = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
      <g id="그룹_14" data-name="그룹 14" transform="translate(-365 -717)">
        <rect id="사각형_73" data-name="사각형 73" width="40" height="40" rx="10" transform="translate(365 717)" fill="#b2c8b4"/>
        <g id="그룹_3" data-name="그룹 3" transform="translate(-8.137 450.947)">
          <circle id="타원_1" data-name="타원 1" cx="7.298" cy="7.298" r="7.298" transform="translate(385.846 276)" fill="#fff"/>
          <path id="패스_1" data-name="패스 1" d="M393.137,414a12.151,12.151,0,0,0-12.151,12.136h24.3A12.151,12.151,0,0,0,393.137,414Z" transform="translate(0 -121.083)" fill="#fff"/>
        </g>
      </g>
    </svg>
  )
}

const AuthorName = styled.div`
  font-size: ${fontSize.small};
  font-weight: bold;
  margin-left: 10px;
  color: #707070;
`

const Likes = styled.div`
  font-size: ${fontSize.small};
  color: #707070;
`

const PostTitle = styled.div`
  margin-bottom: 21px;
  color: #6d9b7b;
  font-size: ${fontSize.large};
  font-weight: bold;
`

const PostContent = styled.div`
  font-size: ${fontSize.medium};
  color: #999;
  margin-bottom: 66px;
`
const PostFooter = styled.div`
  display: flex;
  flex-direction: row-reverse;
`


const Comment = styled(PostContainer)`
  background: none;
`

const CommentContent = styled.div`
  font-size: ${fontSize.medium};
  color: #999;
  margin-bottom: 10px;
`

const CommentEditor = styled.div`
  padding: 20px;
  font-size: ${fontSize.medium};
  border-radius: 17px;
  background: #b2c8b4;
  margin-bottom: 30px;

  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`

const CommentEditor_Right = styled.div`
  display: flex;
`

const CommentTextarea = styled.textarea`
  all: unset;
  color: #fff;
  
  width: calc(100% - 150px);

  &::placeholder {
    color: #fff;
  }
`

const Anonymous = styled.div`
  display: flex;
  align-items: center;
  color: #f8f6ed;
  margin-right: 16px;

  input {
    display: none;

    &:checked + label {
      background: #f8f6ed;
    }
  }
  label {
    display: inline-block;
    cursor: pointer;
    width: 9px;
    height: 9px;
    background: none;
    border: 1px solid #f8f6ed;
    border-radius: 3px;
  }
`

const CommentSubmit = styled.button`
  all:unset;
  cursor: pointer;
  padding: 5px 20px;
  font-size: ${fontSize.medium};
  background: #f8f6ed;
  color: #b2c8b4;
  border-radius: 10px;
`

const Button = styled.button`
  all:unset;
  cursor: pointer;
  padding: 5px 20px;
  font-size: ${fontSize.medium};
  background: #b2c8b4;
  color: #f8f6ed;
  border-radius: 10px;
  margin-left: 10px;
`

const HamburgerSVG = () => {
  return(
    <svg xmlns="http://www.w3.org/2000/svg" width="17.033" height="10.531" viewBox="0 0 17.033 10.531">
      <g id="그룹_21" data-name="그룹 21" transform="translate(-319 -572)">
        <g id="그룹_12" data-name="그룹 12" transform="translate(320 573)">
          <g id="그룹_10" data-name="그룹 10" transform="translate(3.417)">
            <line id="선_17" data-name="선 17" x2="11.616" transform="translate(0)" fill="rgba(0,0,0,0)" stroke="#b2c8b4" stroke-linecap="round" stroke-width="2"/>
            <line id="선_18" data-name="선 18" x2="11.616" transform="translate(0 4.266)" fill="rgba(0,0,0,0)" stroke="#b2c8b4" stroke-linecap="round" stroke-width="2"/>
            <line id="선_19" data-name="선 19" x2="11.616" transform="translate(0 8.531)" fill="rgba(0,0,0,0)" stroke="#b2c8b4" stroke-linecap="round" stroke-width="2"/>
          </g>
          <g id="그룹_11" data-name="그룹 11">
            <line id="선_17-2" data-name="선 17" transform="translate(0.035)" fill="rgba(0,0,0,0)" stroke="#b2c8b4" stroke-linecap="round" stroke-width="2"/>
            <line id="선_18-2" data-name="선 18" transform="translate(0 4.266)" fill="rgba(0,0,0,0)" stroke="#b2c8b4" stroke-linecap="round" stroke-width="2"/>
            <line id="선_19-2" data-name="선 19" x2="0.001" transform="translate(0 8.531)" fill="rgba(0,0,0,0)" stroke="#b2c8b4" stroke-linecap="round" stroke-width="2"/>
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