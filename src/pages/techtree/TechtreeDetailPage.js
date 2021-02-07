import React, { useEffect, useState, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import MainWrapper from '../../wrappers/MainWrapper'
import MarkdownEditor from '../../components/MarkdownEditor'
import MarkdownRenderer from '../../components/MarkdownRenderer'
import TechtreeMap from '../../components/TechtreeMap'
import { Spinner } from '../../components/Spinner'
import { Button } from '../../components/Button'

import styled from 'styled-components'

import {
  finishDocuEdit,
  selectNode,
  readTechtree,
  updateTechtree,
  deleteTechtree,
} from '../../redux/techtree'
import { returnPreviousNodeList, returnNextNodeList } from '../../lib/functions'

export default function TechtreeDetailPage({ match }) {
  const dispatch = useDispatch()

  const { loginState, userID } = useSelector((state) => {
    return { loginState: state.auth.loginState, userID: state.auth.userID }
  })
  const { loading } = useSelector((state) => {
    return { loading: state.techtree.loading }
  })

  const { selectedNode, previousNodeList, nextNodeList } = useSelector(
    (state) => {
      return {
        selectedNode: state.techtree.selectedNode,
        previousNodeList: state.techtree.previousNodeList,
        nextNodeList: state.techtree.nextNodeList,
      }
    }
  )

  const { techtreeData, nodeList, linkList } = useSelector((state) => {
    return {
      techtreeData: state.techtree.techtreeData,
      nodeList: state.techtree.nodeList,
      linkList: state.techtree.linkList,
    }
  })

  const { techtreeID } = match.params

  const [isEditingDocument, setIsEditingDocument] = useState(false)
  const [techtreeTitle, setTechtreeTitle] = useState('')
  const [documentTitle, setDocumentTitle] = useState('')
  const [documentText, setDocumentText] = useState('')

  useEffect(() => {
    // 맨 첫 로딩때 서버에서 테크트리 데이터 가져오는 용도.
    // dispatch 를 통해 redux 상태에 해당 테크트리 데이터를 셋팅한다.
    dispatch(readTechtree(techtreeID))
  }, [dispatch])

  useEffect(() => {
    setTechtreeTitle(techtreeData.title)
    setDocumentTitle(selectedNode.name)
    setDocumentText(selectedNode.body)
  }, [selectedNode, techtreeData])

  const onChangeDocumentTitle = useCallback(
    (e) => {
      e.preventDefault()
      setDocumentTitle(e.target.value)
    },
    [documentTitle]
  )

  const onChangeTechtreeTitle = useCallback((e) => {
    e.preventDefault()
    setTechtreeTitle(e.target.value)
  }, [])

  const onFinishEdit = useCallback(() => {
    // 여기서 dispatch 로 리덕스에서 api 통신하자.
    // 서버에다가 수정사항을 보내고, 클라이언트 쪽 상태에 저장된
    // techtree 정보를 업데이트 하자.
    // 결국은 selectedNode 랑 그런걸 전부 리덕스 스테이트로 해야하네..
    dispatch(
      finishDocuEdit(
        selectedNode.id,
        documentTitle,
        documentText,
        nodeList,
        linkList,
        techtreeData._id
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

  const onClickTechtreeCommit = useCallback(
    (e) => {
      e.preventDefault()
      dispatch(updateTechtree(nodeList, linkList, techtreeID, techtreeTitle))
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
        <DoubleSideLayout>
          {techtreeData.author.firebaseUid === userID ? (
            <div>
              <StyledTitleInput
                value={techtreeTitle}
                placeholder="테크트리의 주제를 적어주세요"
                onChange={onChangeTechtreeTitle}
              ></StyledTitleInput>
            </div>
          ) : (
            <div>
              <h2>{techtreeTitle}</h2>
            </div>
          )}

          <div></div>
          <div>
            <TechtreeMap
              techtreeTitle={techtreeTitle}
              techtreeID={techtreeID}
            />
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
              <Button onClick={onClickTechtreeCommit}>테크트리 commit</Button>
            ) : (
              ''
            )}
          </div>
          <div>
            {isEditingDocument ? (
              <>
                <StyledTitleInput
                  value={documentTitle}
                  onChange={onChangeDocumentTitle}
                />
                <MarkdownEditor
                  bindingText={documentText}
                  bindingSetter={setDocumentText}
                />
              </>
            ) : (
              <>
                <h2>{documentTitle}</h2>
                <MarkdownRenderer text={documentText} />
                <br />
                <div>
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
                            selectNode(
                              newPreviousNodeList,
                              newNextNodeList,
                              node
                            )
                          )
                        }}
                      >
                        {node?.name}
                      </Button>
                    )
                  })}
                </div>
                <br />
                <div>
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
                            selectNode(
                              newPreviousNodeList,
                              newNextNodeList,
                              node
                            )
                          )
                        }}
                      >
                        {node?.name}
                      </Button>
                    )
                  })}
                </div>
              </>
            )}
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
        </DoubleSideLayout>
      </MainWrapper>
    )
  }
}

function PreviousNodeButtonList({ linkList, nodeList, previousNodeList }) {
  const dispatch = useDispatch()
  const PreviousNodeButtonList = previousNodeList.map((node) => {
    return (
      <button
        onClick={() => {
          const newPreviousNodeList = returnPreviousNodeList(
            linkList,
            nodeList,
            node
          )
          const newNextNodeList = returnNextNodeList(linkList, nodeList, node)
          dispatch(selectNode(newPreviousNodeList, newNextNodeList, node))
        }}
      >
        {node?.name}
      </button>
    )
  })
  return <PreviousNodeButtonList></PreviousNodeButtonList>
}

function NextNodeButtonList({ linkList, nodeList, nextNodeList }) {
  const dispatch = useDispatch()
  {
    nextNodeList.forEach((node) => {
      return (
        <button
          onClick={() => {
            const newPreviousNodeList = returnPreviousNodeList(
              linkList,
              nodeList,
              node
            )
            const newNextNodeList = returnNextNodeList(linkList, nodeList, node)
            dispatch(selectNode(newPreviousNodeList, newNextNodeList, node))
          }}
        >
          {node?.name}
        </button>
      )
    })
  }
}

const DoubleSideLayout = styled.div`
  display: grid;
  justify-items: center; // 가로축에서 중앙정렬
  grid-template-columns: 1fr 1fr;
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
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
