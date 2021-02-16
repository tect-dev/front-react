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
import { Button } from '../../components/Button'

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
import { colorPalette, mediaSize } from '../../lib/constants'

const documentWrapper = styled.div`
  width: 39vw;
  ${mediaSize.small} {
    width: 95vw;
  }
`

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
      //d3.select('body')
      //  .append('img')
      //  .attr('src', imgSource)
      //  .attr('width', 300)
      //  .attr('height', 300)
      //  .attr('alt', 'thumbnail')

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
        <TreePageHeader>
          여기에 툴팁같은걸 띄우는것도 괜찮겠네. 변경사항 저장중 인디케이터도
          띄우고.
          {isSavingTechtree ? (
            <Loader
              type="Grid"
              color={colorPalette.teal5}
              height={20}
              width={20}
            />
          ) : (
            ''
          )}
        </TreePageHeader>
        <DoubleSideLayout>
          <HalfWidthContainer>
            <TreeTitleArea>
              {techtreeData.author.firebaseUid === userID ? (
                
                  <StyledTitleInput
                    value={techtreeTitle}
                    placeholder="트리의 주제를 적어주세요!"
                    onChange={onChangeTechtreeTitle}
                  />
                
              ) : (
                <div>
                  {techtreeTitle} -
                  <Link to={`/user/${techtreeData.author.firebaseUid}`}>
                    {techtreeData.author.displayName}
                  </Link>
                </div>
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
                <Button
                  onClick={() => {
                    const deleteOK = window.confirm(`정말 삭제하시나요?`)
                    if (deleteOK) {
                      dispatch(deleteTechtree(techtreeData._id))
                    } else {
                      return
                    }
                  }}
                >
                  테크트리 전체 삭제
                </Button>
              ) : (
                ''
              )}
              {!isEditingDocument &&
              userID === techtreeData.author?.firebaseUid ? (
                <Button onClick={onClickTechtreeEdit}>수정모드</Button>
              ) : (
                ''
              )}
              {!isEditingDocument &&
              userID === techtreeData.author?.firebaseUid ? (
                <Button onClick={onClickTechtreeCommit}>변경사항 저장</Button>
              ) : (
                ''
              )}
            </TreeEditButtonArea>
          </HalfWidthContainer>

          <HalfWidthContainer>
            <DocuHeaderArea>
              <div className="docuTitle">
                {isEditingDocument ? (
                  <StyledTitleInput
                    value={documentTitle}
                    onChange={onChangeDocumentTitle}
                  />
                ) : (
                  <h2>{selectedNode.name}</h2>
                )}
              </div>

              <div className="editDocu">
                {isEditingDocument ? (
                  <Button onClick={onFinishEdit}>수정완료</Button>
                ) : (
                  ''
                )}
                {typeof selectedNode.id !== 'undefined' &&
                !isEditingDocument &&
                userID === techtreeData.author?.firebaseUid ? (
                  <Button
                    onClick={() => {
                      setIsEditingDocument(true)
                    }}
                  >
                    문서 수정
                  </Button>
                ) : (
                  ''
                )}
              </div>
            </DocuHeaderArea>

            <DocuBodyArea>
              {isEditingDocument ? (
                <MarkdownEditor
                  bindingText={documentText}
                  bindingSetter={setDocumentText}
                />
              ) : (
                <MarkdownRenderer text={selectedNode.body} />
              )}
            </DocuBodyArea>

            <div className="nodeRelation">
              <PrevNodeArea>
                {previousNodeList.length > 0 ? <div>이전 노드</div> : ''}
                {previousNodeList.map((node) => {
                  return (
                    <Button
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
                          selectNode(newPreviousNodeList, newNextNodeList, node)
                        )
                        window.scrollTo(0, 0)
                      }}
                    >
                      {node?.name}
                    </Button>
                  )
                })}
              </PrevNodeArea>
              <NextNodeArea>
                {nextNodeList.length > 0 ? <div>다음 노드</div> : ''}
                {nextNodeList.map((node) => {
                  return (
                    <Button
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
                          selectNode(newPreviousNodeList, newNextNodeList, node)
                        )
                        window.scrollTo(0, 0)
                      }}
                    >
                      {node?.name}
                    </Button>
                  )
                })}
              </NextNodeArea>
            </div>
          </HalfWidthContainer>
        </DoubleSideLayout>
      </MainWrapper>
    )
  }
}

const TreePageHeader = styled.div``

const TreeTitleArea = styled.div``

const TreeEditorArea = styled.div``

const TreeEditButtonArea = styled.div`
`

const DocuHeaderArea = styled.div`
`

const DocuBodyArea = styled.div`
`

const PrevNodeArea = styled.div``

const NextNodeArea = styled.div``

const HalfWidthContainer = styled(HalfWidthWrapper)`
  overflow: visible;
  // overflow: hidden;
`

const StyledTitleInput = styled.input`
  height: 60px;
  font-size: 30px;
  font-weight: bold;
  cursor: text;
  border: none;
  outline: none;
  padding: 0.2rem;
  width: 42vw;
`
