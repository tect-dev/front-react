import React, { useEffect, useState, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import MainWrapper from '../../wrappers/MainWrapper'
import MarkdownEditor from '../../components/MarkdownEditor'
import MarkdownRenderer from '../../components/MarkdownRenderer'
import TechtreeMap from '../../components/TechtreeMap'

import styled from 'styled-components'

import { finishDocuEdit, selectNode, readTechtree } from '../../redux/techtree'
import { returnPreviousNodeList, returnNextNodeList } from '../../lib/functions'

export default function TechtreeDetailPage({ match }) {
  const dispatch = useDispatch()

  const { loginState, userID } = useSelector((state) => {
    return { loginState: state.auth.loginState, userID: state.auth.userID }
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

  const { techtreeID } = match.params

  const [isEditingDocument, setIsEditingDocument] = useState(false)

  const [documentTitle, setDocumentTitle] = useState('')
  const [documentText, setDocumentText] = useState('')

  useEffect(() => {
    // 맨 첫 로딩때 서버에서 테크트리 데이터 가져오는 용도.
    // dispatch 를 통해 redux 상태에 해당 테크트리 데이터를 셋팅한다.
    dispatch(readTechtree(techtreeID))
  }, [dispatch])

  useEffect(() => {
    setDocumentTitle(selectedNode.name)
    setDocumentText(selectedNode.body)
  }, [selectedNode])

  const onChangeDocumentTitle = useCallback(
    (e) => {
      e.preventDefault()
      setDocumentTitle(e.target.value)
    },
    [documentTitle]
  )

  const onFinishEdit = useCallback(() => {
    // 여기서 dispatch 로 리덕스에서 api 통신하자.
    // 서버에다가 수정사항을 보내고, 클라이언트 쪽 상태에 저장된
    // techtree 정보를 업데이트 하자.
    // 결국은 selectedNode 랑 그런걸 전부 리덕스 스테이트로 해야하네..
    dispatch(finishDocuEdit(selectedNode.id, documentTitle, documentText))
    setIsEditingDocument(false)
  }, [isEditingDocument, selectedNode, documentTitle, documentText])

  return (
    <MainWrapper>
      <DoubleSideLayout>
        <div>
          <TechtreeMap techtreeTitle={techtreeTitle} techtreeID={techtreeID} />
        </div>
        <div>
          {isEditingDocument ? (
            <>
              <input value={documentTitle} onChange={onChangeDocumentTitle} />
              <MarkdownEditor
                bindingText={documentText}
                bindingSetter={setDocumentText}
              />
            </>
          ) : (
            <>
              <div>{documentTitle}</div>
              <MarkdownRenderer text={documentText} />
              {previousNodeList.length !== 0 ? <div>앞선 노드</div> : ''}
              {previousNodeList.map((node) => {
                return (
                  <button
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
                    }}
                  >
                    {node?.name}
                  </button>
                )
              })}
              {nextNodeList.length !== 0 ? <div>다음 노드</div> : ''}
              {nextNodeList.map((node) => {
                return (
                  <button
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
                    }}
                  >
                    {node?.name}
                  </button>
                )
              })}
            </>
          )}
          {isEditingDocument ? (
            <button onClick={onFinishEdit}>수정완료</button>
          ) : (
            ''
          )}
          {!isEditingDocument && userID === techtreeData.author?.firebaseUid ? (
            <button
              onClick={() => {
                setIsEditingDocument(true)
              }}
            >
              문서 수정
            </button>
          ) : (
            ''
          )}
        </div>
      </DoubleSideLayout>
    </MainWrapper>
  )
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
