import React, { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import MainWrapper from '../../wrappers/MainWrapper'
import DoubleSideLayout from '../../wrappers/DoubleSideLayout'
import MarkdownEditor from '../../components/MarkdownEditor'
import MarkdownRenderer from '../../components/MarkdownRenderer'
import { HalfWidthWrapper } from '../../wrappers/HalfWidthWrapper'
import TechtreeMap from '../../components/TechtreeMap'
import { Spinner } from '../../components/Spinner'
import { Button, DefaultButton } from '../../components/Button'
import {
  TitleInput,
  TitleBottomLine,
  StyledTitle,
} from '../../components/TitleInput'

import {
  TechtreeThumbnailCard,
  TechtreeThumbnailBlock,
  TechtreeInfo,
} from '../../components/Block'
import Loader from 'react-loader-spinner'

import styled from 'styled-components'

import {
  finishDocuEdit,
  selectNode,
  readTechtree,
  updateTechtree,
  deleteTechtree,
  changeTechtreeTitle,
  changeDocument,
  editTechtree,
  finishTechtreeEdit,
} from '../../redux/techtree'
import { returnPreviousNodeList, returnNextNodeList } from '../../lib/functions'
import { colorPalette, mediaSize, fontSize } from '../../lib/constants'
import MainWrapperDefault from '../../wrappers/MainWrapper'

export default function TechtreeDetailPage({ match }) {
  const dispatch = useDispatch()
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

  const { techtreeData, nodeList, linkList, techtreeTitle } = useSelector(
    (state) => {
      return {
        techtreeData: state.techtree.techtreeData,
        nodeList: state.techtree.nodeList,
        linkList: state.techtree.linkList,
        techtreeTitle: state.techtree.techtreeTitle,
      }
    }
  )

  const [documentTitle, setDocumentTitle] = useState('')
  const [documentText, setDocumentText] = useState('')

  const [isEditingDocument, setIsEditingDocument] = useState(false)

  useEffect(() => {
    dispatch(readTechtree(techtreeID))
    window.scrollTo(0, 0)
  }, [dispatch])

  useEffect(() => {
    setDocumentTitle(selectedNode.name)
    setDocumentText(selectedNode.body)
  }, [selectedNode, dispatch])

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

  const onClickTechtreeCommit = useCallback(
    async (e) => {
      e.preventDefault()
      const svgDOM = document.getElementById('techtreeContainer')
      const source = new XMLSerializer().serializeToString(svgDOM)
      var decoded = unescape(encodeURIComponent(source))
      // Now we can use btoa to convert the svg to base64
      const base64 = btoa(decoded)
      const thumbnailURL = `data:image/svg+xml;base64,${base64}`

      // 이제 put 메소드 이용해서 imgSource를 첨부해 보내면 됨.
      // 나중에 이걸 썸네일로 렌더링 하면 되는거고.

      dispatch(
        updateTechtree(
          nodeList,
          linkList,
          techtreeID,
          techtreeTitle,
          thumbnailURL
        )
      )
    },
    [dispatch, nodeList, linkList, techtreeID, techtreeTitle]
  )

  if (loading) {
    return (
      <MainWrapper>
        <Spinner />
      </MainWrapper>
    )
  } else if (!loading) {
    return (
      <MainWrapper>
        <TreePageHeader>Tree</TreePageHeader>
        <DoubleSideLayout>
          <HalfWidthContainer>
            <TreeTitleArea>
              {techtreeData.author.firebaseUid === userID ? (
                <TitleInput
                  value={techtreeTitle}
                  placeholder="트리의 주제를 적어주세요!"
                  onChange={onChangeTechtreeTitle}
                  maxLength="30"
                />
              ) : (
                <>
                  <StyledTitle>{techtreeTitle}</StyledTitle>

                  <StyledDisplayName>
                    <Link to={`/user/${techtreeData.author.firebaseUid}`}>
                      {techtreeData.author.displayName}
                    </Link>
                  </StyledDisplayName>
                </>
              )}
            </TreeTitleArea>
            <TreeEditorArea>
              <TechtreeMap
                techtreeTitle={techtreeTitle}
                techtreeID={techtreeID}
              />
            </TreeEditorArea>

            <TreeEditButtonArea>
              {!isEditingDocument &&
              userID === techtreeData.author?.firebaseUid ? (
                <DefaultButton
                  onClick={() => {
                    const deleteOK = window.confirm(`정말 삭제하시나요?`)
                    if (deleteOK) {
                      dispatch(deleteTechtree(techtreeData._id))
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
              userID === techtreeData.author?.firebaseUid ? (
                <DefaultButton onClick={onClickTechtreeEdit}>
                  수정모드
                </DefaultButton>
              ) : (
                ''
              )}
              {!isEditingDocument &&
              !isSavingTechtree &&
              userID === techtreeData.author?.firebaseUid ? (
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
            <DocuWrapper>
              <DocuHeaderArea>
                <div className="docuTitle">
                  {isEditingDocument ? (
                    <TitleInput
                      value={documentTitle}
                      onChange={onChangeDocumentTitle}
                    />
                  ) : (
                    <StyledTitle>{selectedNode.name}</StyledTitle>
                  )}
                </div>

                <div className="editDocu">
                  {isEditingDocument ? (
                    <DefaultButton onClick={onFinishEdit}>
                      수정완료
                    </DefaultButton>
                  ) : (
                    ''
                  )}
                  {typeof selectedNode.id !== 'undefined' &&
                  !isEditingDocument &&
                  userID === techtreeData.author?.firebaseUid ? (
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
                </div>
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
                {previousNodeList.map((node) => {
                  return (
                    <div>
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
                          window.scrollTo(0, 0)
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
                {nextNodeList.map((node) => {
                  return (
                    <div>
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
                          window.scrollTo(0, 0)
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

const TreeDetailPageMainWrapper = styled(MainWrapper)``

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

const TreeTitleArea = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  width: 100%;
  justify-items: space-between;
  align-items: center;
`

const StyledDisplayName = styled(StyledTitle)`
  font-size: ${fontSize.small};
`

const TreeEditorArea = styled.div``

const TreeEditButtonArea = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  justify-content: space-between;
  justify-items: center;
  padding: 20px;
`

const DocuWrapper = styled.div`
  border-radius: 22px;
  background: #ffffff;
  border: 0.5px solid #6d9b7b;
  box-sizing: border-box;
  padding: 10px;
`

const DocuHeaderArea = styled.div`
  display: grid;
  justify-content: space-between;
  grid-template-columns: 2fr 1fr;
`

const DocuBodyArea = styled.div``

const NodeButtonArea = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 20px;

  justify-content: space-between;
  padding: 20px;
  font-size: ${fontSize.small};
`

const PrevNodeArea = styled.div``

const NextNodeArea = styled.div``

const HalfWidthContainer = styled(HalfWidthWrapper)`
  overflow: visible;
  //overflow: hidden;
`
const HalfWidthDocumentContainer = styled(HalfWidthWrapper)`
  width: 80%;
  height: 80vh;
`

const StyledTitleInput = styled.input`
  height: 30px;
  font-size: 24px;
  //font-weight: bold;
  background-color: transparent;
  cursor: text;
  border: 1px solid ${colorPalette.mainGreen};
  border-radius: 22px;
  outline: none;
  padding: 1rem;
  margin: 1rem;
  width: 80%;
`
