import React, { useEffect, useState, useCallback } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import MainWrapper from '../../wrappers/MainWrapper'
import DoubleSideLayout from '../../wrappers/DoubleSideLayout'
import MarkdownEditor from '../../components/MarkdownEditor'
import MarkdownRenderer from '../../components/MarkdownRenderer'
import { HalfWidthWrapper } from '../../wrappers/HalfWidthWrapper'
import TechtreeMap from '../../components/TechtreeMap'
import { Spinner } from '../../components/Spinner'
import { DefaultButton, LikeButton } from '../../components/Button'
import {
  TitleInput,
  TitleBottomLine,
  StyledTitle,
} from '../../components/TitleInput'
import Loader from 'react-loader-spinner'
import LikeSproutGray from '../../assets/LikeSproutGray.svg'
import LikeSproutGreen from '../../assets/LikeSproutGreen.svg'

import styled from 'styled-components'

import {
  finishDocuEdit,
  selectNode,
  readTechtree,
  updateTechtree,
  deleteTechtree,
  changeTechtreeTitle,
  editTechtree,
  finishTechtreeEdit,
  likeTree,
  forkTree,
} from '../../redux/techtree'
import { returnPreviousNodeList, returnNextNodeList } from '../../lib/functions'
import { colorPalette, fontSize } from '../../lib/constants'

export default function TechtreeDetailPage({ match }) {
  const dispatch = useDispatch()
  const history = useHistory()
  const { techtreeID } = match.params

  const { loginState, userID } = useSelector((state) => {
    return { loginState: state.auth.loginState, userID: state.auth.userID }
  })
  const { loading, isSavingTechtree, isEditingTechtree } = useSelector(
    (state) => {
      return {
        loading: state.techtree.loading,
        isSavingTechtree: state.techtree.isSavingTechtree,
        isEditingTechtree: state.techtree.isEditingTechtree,
      }
    }
  )

  const { selectedNode, previousNodeList, nextNodeList } = useSelector(
    (state) => {
      return {
        selectedNode: state.techtree.selectedNode,
        previousNodeList: state.techtree.previousNodeList,
        nextNodeList: state.techtree.nextNodeList,
      }
    }
  )

  const {
    techtreeData,
    nodeList,
    linkList,
    techtreeTitle,
    treeLikeUsers,
  } = useSelector((state) => {
    return {
      techtreeData: state.techtree.techtreeData,
      nodeList: state.techtree.nodeList,
      linkList: state.techtree.linkList,
      techtreeTitle: state.techtree.techtreeTitle,
      treeLikeUsers: state.techtree.treeLikeUsers,
    }
  })

  const [documentTitle, setDocumentTitle] = useState('')
  const [documentText, setDocumentText] = useState('')
  const [isEditingDocument, setIsEditingDocument] = useState(false)

  const [localTreeLike, setLocalTreeLike] = useState()
  const [isLiked, setIsLiked] = useState(false)

  useEffect(() => {
    dispatch(readTechtree(techtreeID))
    window.scrollTo(0, 0)
  }, [dispatch])

  useEffect(() => {
    setDocumentTitle(selectedNode.name)
    setDocumentText(selectedNode.body)
  }, [selectedNode, techtreeData])

  useEffect(() => {
    setLocalTreeLike(techtreeData.like)
    if (
      treeLikeUsers?.find((ele) => {
        return ele === userID
      })
    ) {
      setIsLiked(true)
    } else {
      setIsLiked(false)
    }
  }, [techtreeData, userID, treeLikeUsers])

  const onChangeDocumentTitle = useCallback(
    (e) => {
      e.preventDefault()
      setDocumentTitle(e.target.value)
    },
    [documentTitle]
  )

  const onChangeTechtreeTitle = useCallback((e) => {
    e.preventDefault()
    dispatch(changeTechtreeTitle(e.target.value))
  }, [])

  const onFinishEdit = useCallback(() => {
    dispatch(
      finishDocuEdit(
        selectedNode.id,
        documentTitle,
        documentText,
        nodeList,
        linkList,
        techtreeData
      )
    )
    setIsEditingDocument(false)
  }, [
    isEditingDocument,
    selectedNode,
    documentTitle,
    documentText,
    nodeList,
    linkList,
    techtreeData,
  ])

  const onClickTechtreeEdit = useCallback(() => {
    if (isEditingTechtree) {
      dispatch(finishTechtreeEdit())
    } else {
      dispatch(editTechtree())
    }
  }, [dispatch, isEditingTechtree])

  const onClickTechtreeCommit = useCallback(async () => {
    //e.preventDefault()
    const svgDOM = document.getElementById('techtreeContainer')
    const source = new XMLSerializer().serializeToString(svgDOM)
    var decoded = unescape(encodeURIComponent(source))
    // Now we can use btoa to convert the svg to base64
    const base64 = btoa(decoded)
    const thumbnailURL = `data:image/svg+xml;base64,${base64}`
    dispatch(
      updateTechtree(
        nodeList,
        linkList,
        techtreeID,
        techtreeTitle,
        thumbnailURL
      )
    )
  }, [dispatch, nodeList, linkList, techtreeID, techtreeTitle])

  const onClickForkTree = useCallback(() => {
    const svgDOM = document.getElementById('techtreeContainer')
    const source = new XMLSerializer().serializeToString(svgDOM)
    var decoded = unescape(encodeURIComponent(source))
    // Now we can use btoa to convert the svg to base64
    const base64 = btoa(decoded)
    const thumbnailURL = `data:image/svg+xml;base64,${base64}`
    dispatch(forkTree(techtreeData, nodeList, linkList, userID, thumbnailURL))
  }, [dispatch, nodeList, linkList, techtreeID, techtreeData, userID])

  if (loading) {
    return (
      <MainWrapper>
        <Spinner />
      </MainWrapper>
    )
  } else if (!loading) {
    return (
      <MainWrapper>
        <TreePageHeader>
          Tree
          {isLiked ? (
            <LikeButton
              onClick={() => {
                if (loginState) {
                  dispatch(likeTree(techtreeID))
                  setIsLiked(false)
                  setLocalTreeLike(localTreeLike - 1)
                } else {
                  alert('로그인이 필요해요!')
                }
              }}
            >
              <img
                src={LikeSproutGreen}
                style={{ width: '20px', height: '20px' }}
              />
              <span style={{ color: '#6d9b7b' }}>{localTreeLike}</span> likes
            </LikeButton>
          ) : (
            <LikeButton
              onClick={() => {
                if (loginState) {
                  dispatch(likeTree(techtreeID))
                  setIsLiked(true)
                  setLocalTreeLike(localTreeLike + 1)
                } else {
                  alert('로그인이 필요해요!')
                }
              }}
            >
              <img
                src={LikeSproutGray}
                style={{ width: '20px', height: '20px' }}
              />
              <span style={{ color: '#6d9b7b' }}>{localTreeLike}</span> likes
            </LikeButton>
          )}
        </TreePageHeader>
        <DoubleSideLayout>
          <HalfWidthContainer>
            <TreeTitleArea>
              {techtreeData?.author?.firebaseUid === userID ? (
                <TitleInput
                  value={techtreeTitle}
                  placeholder="트리의 주제를 적어주세요!"
                  onChange={onChangeTechtreeTitle}
                  maxLength="60"
                />
              ) : (
                <>
                  <StyledTitle>{techtreeTitle}</StyledTitle>

                  <StyledDisplayName>
                    <Link to={`/forest/${techtreeData?.author?.firebaseUid}`}>
                      {techtreeData?.author?.displayName}
                    </Link>
                  </StyledDisplayName>
                </>
              )}
            </TreeTitleArea>
            <TreeEditorArea>
              <TechtreeMap
              //techtreeTitle={techtreeTitle}
              //techtreeID={techtreeID}
              />
            </TreeEditorArea>

            <TreeEditButtonArea>
              <DefaultButton onClick={onClickForkTree}>
                트리 분양받기
              </DefaultButton>
              {!isEditingDocument &&
              userID === techtreeData?.author?.firebaseUid ? (
                <DefaultButton
                  onClick={() => {
                    const deleteOK = window.confirm(`정말 삭제하시나요?`)
                    if (deleteOK) {
                      dispatch(deleteTechtree(techtreeData?._id))
                    } else {
                      return
                    }
                  }}
                >
                  트리 전체 삭제
                </DefaultButton>
              ) : (
                ''
              )}
              {!isEditingDocument &&
              userID === techtreeData?.author?.firebaseUid ? (
                <DefaultButton onClick={onClickTechtreeEdit}>
                  수정모드
                </DefaultButton>
              ) : (
                ''
              )}
              {!isEditingDocument &&
              !isSavingTechtree &&
              userID === techtreeData?.author?.firebaseUid ? (
                <DefaultButton onClick={onClickTechtreeCommit}>
                  변경사항 저장
                </DefaultButton>
              ) : (
                ''
              )}
              {isSavingTechtree ? (
                <div>
                  <Loader
                    type="Grid"
                    color={colorPalette.teal5}
                    height={20}
                    width={20}
                  />
                </div>
              ) : (
                ''
              )}
            </TreeEditButtonArea>
          </HalfWidthContainer>

          <HalfWidthDocumentContainer>
            <DocuWrapper id="docuWrapper">
              <DocuHeaderArea>
                <div className="docuTitle">
                  {isEditingDocument ? (
                    <div>
                      <TitleInput
                        value={documentTitle}
                        onChange={onChangeDocumentTitle}
                      />
                    </div>
                  ) : (
                    <StyledTitle>{selectedNode.name}</StyledTitle>
                  )}
                </div>

                <EditDocuButtonArea>
                  {isEditingDocument ? (
                    <DefaultButton onClick={onFinishEdit}>
                      수정완료
                    </DefaultButton>
                  ) : (
                    ''
                  )}
                  {typeof selectedNode.id !== 'undefined' &&
                  !isEditingDocument &&
                  userID === techtreeData?.author?.firebaseUid ? (
                    <DefaultButton
                      onClick={() => {
                        setIsEditingDocument(true)
                      }}
                    >
                      문서 수정
                    </DefaultButton>
                  ) : (
                    ''
                  )}
                </EditDocuButtonArea>
              </DocuHeaderArea>
              <TitleBottomLine />
              <DocuBodyArea>
                {isEditingDocument ? (
                  <MarkdownEditor
                    bindingText={documentText}
                    bindingSetter={setDocumentText}
                    width="100%"
                  />
                ) : (
                  <MarkdownRenderer text={selectedNode.body} />
                )}
              </DocuBodyArea>
            </DocuWrapper>
            <NodeButtonArea>
              <PrevNodeArea>
                {previousNodeList.length > 0 ? <div>이전 노드</div> : ''}
                {previousNodeList.map((node, index) => {
                  return (
                    <div key={index}>
                      <DefaultButton
                        onClick={() => {
                          const newPreviousNodeList = returnPreviousNodeList(
                            linkList,
                            nodeList,
                            node
                          )
                          const newNextNodeList = returnNextNodeList(
                            linkList,
                            nodeList,
                            node
                          )
                          dispatch(
                            selectNode(
                              newPreviousNodeList,
                              newNextNodeList,
                              node
                            )
                          )
                          const offsetElement = document.getElementById(
                            'docuWrapper'
                          )
                          const clientRect = offsetElement.getBoundingClientRect()
                          const relativeTop = clientRect.top
                          const scrolledTopLength = window.pageYOffset
                          const absoluteYPosition =
                            scrolledTopLength + relativeTop
                          window.scrollTo(0, absoluteYPosition - 80)
                        }}
                      >
                        {node?.name}
                      </DefaultButton>
                    </div>
                  )
                })}
              </PrevNodeArea>
              <NextNodeArea>
                {nextNodeList.length > 0 ? <div>다음 노드</div> : ''}
                {nextNodeList.map((node, index) => {
                  return (
                    <div key={index}>
                      <DefaultButton
                        onClick={() => {
                          const newPreviousNodeList = returnPreviousNodeList(
                            linkList,
                            nodeList,
                            node
                          )
                          const newNextNodeList = returnNextNodeList(
                            linkList,
                            nodeList,
                            node
                          )
                          dispatch(
                            selectNode(
                              newPreviousNodeList,
                              newNextNodeList,
                              node
                            )
                          )
                          const offsetElement = document.getElementById(
                            'docuWrapper'
                          )
                          const clientRect = offsetElement.getBoundingClientRect()
                          const relativeTop = clientRect.top
                          const scrolledTopLength = window.pageYOffset
                          const absoluteYPosition =
                            scrolledTopLength + relativeTop
                          window.scrollTo(0, absoluteYPosition - 80)
                        }}
                      >
                        {node?.name}
                      </DefaultButton>
                    </div>
                  )
                })}
              </NextNodeArea>
            </NodeButtonArea>
          </HalfWidthDocumentContainer>
        </DoubleSideLayout>
      </MainWrapper>
    )
  }
}

export const TreePageHeader = styled.div`
  width: inherit;
  padding-left: 10px;
  display: grid;
  //border: 1px solid ${colorPalette.mainGreen};
  font-size: ${fontSize.xlarge};
  color: ${colorPalette.gray7};
  font-weight: bold;
  margin: 1rem;
  color: ${colorPalette.gray7};
`

export const TreeTitleArea = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  width: 100%;
  justify-items: space-between;
  align-items: center;
`

export const StyledDisplayName = styled(StyledTitle)`
  font-size: ${fontSize.small};
`

export const TreeEditorArea = styled.div``

export const TreeEditButtonArea = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  justify-content: space-between;
  justify-items: center;
  padding: 20px;
`

export const DocuWrapper = styled.div`
  border-radius: 22px;
  background: #ffffff;
  border: 0.5px solid #6d9b7b;
  box-sizing: border-box;
  padding: 10px;
`

export const DocuHeaderArea = styled.div`
  display: grid;
  //justify-content: space-between;
  grid-template-columns: 2fr 1fr;
`

export const EditDocuButtonArea = styled.div`
  display: inline;
`

export const DocuBodyArea = styled.div`
  padding-left: 1rem;
  padding-right: 1rem;
  padding-bottom: 1rem;
`

export const NodeButtonArea = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 20px;

  justify-content: space-between;
  padding: 20px;
  font-size: ${fontSize.small};
`

export const PrevNodeArea = styled.div``

export const NextNodeArea = styled.div``

export const HalfWidthContainer = styled.div`
  overflow: visible;
  width: 100%;
  //@media (max-width: 650px) {
  //  overflow-x: scroll;
  //}
`

export const HalfWidthDocumentContainer = styled(HalfWidthWrapper)`
  width: 100%;
  height: 80vh;
  @media (max-width: 650px) {
    height: auto;
  }
  overflow-y: scroll;
`
