import React, { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import MainWrapper from '../../wrappers/MainWrapper'
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

import * as d3 from 'd3'
import axios from 'axios'
import { saveAs } from 'file-saver'
import Canvg, { presets } from 'canvg'
import html2canvas from 'html2canvas'

import {
  finishDocuEdit,
  selectNode,
  readTechtree,
  updateTechtree,
  deleteTechtree,
  changeTechtreeTitle,
  changeDocument,
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
  const { loading, isSavingTechtree } = useSelector((state) => {
    return {
      loading: state.techtree.loading,
      isSavingTechtree: state.techtree.isSavingTechtree,
    }
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
        <DoubleSideLayout>
          <TechtreeThumbnailCard>
            <TechtreeInfo>
              {techtreeData.author.firebaseUid === userID ? (
                <div>
                  <StyledTitleInput
                    value={techtreeTitle}
                    placeholder="트리의 주제를 적어주세요!"
                    onChange={onChangeTechtreeTitle}
                  ></StyledTitleInput>
                </div>
              ) : (
                <>
                  <div>{techtreeTitle} - </div>

                  <div>
                    <Link to={`/user/${techtreeData.author.firebaseUid}`}>
                      {techtreeData.author.displayName}
                    </Link>
                  </div>
                </>
              )}
            </TechtreeInfo>
            <TechtreeThumbnailBlock>
              <TechtreeMap
                techtreeTitle={techtreeTitle}
                techtreeID={techtreeID}
              />
            </TechtreeThumbnailBlock>

            <div>
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
                <Button onClick={onClickTechtreeCommit}>변경사항 저장</Button>
              ) : (
                ''
              )}
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
            </div>
          </TechtreeThumbnailCard>

          <HalfWidthWrapper>
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
                <h2>{selectedNode.name}</h2>
                <MarkdownRenderer text={selectedNode.body} />
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
                          window.scrollTo(0, 0)
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
                          window.scrollTo(0, 0)
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
          </HalfWidthWrapper>
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

var testURL =
  'data:image/jpg;base64,/9j/4QAYRXhpZgAASUkqAAgAAAAAAAAAAAAAAP/sABFEdWNreQABAAQAAAA8AAD/4QMraHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjMtYzAxMSA2Ni4xNDU2NjEsIDIwMTIvMDIvMDYtMTQ6NTY6MjcgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDUzYgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjBFREY3NzQ5NkQ3MjExRTNCN0JEREQ0M0M0RDE5NUVFIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjBFREY3NzRBNkQ3MjExRTNCN0JEREQ0M0M0RDE5NUVFIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6MEVERjc3NDc2RDcyMTFFM0I3QkRERDQzQzREMTk1RUUiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6MEVERjc3NDg2RDcyMTFFM0I3QkRERDQzQzREMTk1RUUiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7/7gAOQWRvYmUAZMAAAAAB/9sAhAAGBAQEBQQGBQUGCQYFBgkLCAYG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'
