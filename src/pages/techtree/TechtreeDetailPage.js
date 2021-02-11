import React, { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import MainWrapper from '../../wrappers/MainWrapper'
import MarkdownEditor from '../../components/MarkdownEditor'
import MarkdownRenderer from '../../components/MarkdownRenderer'
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

  const { techtreeID } = match.params

  const [isEditingDocument, setIsEditingDocument] = useState(false)

  useEffect(() => {
    dispatch(readTechtree(techtreeID))
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
      /*
      const doctype =
        '<?xml version="1.0" standalone="no"?>' +
        '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">'

      const svgDOM = d3.select('#techtreeContainer')
      console.log('svgDOM: ', svgDOM)
      const source = new XMLSerializer().serializeToString(svgDOM.node())
      const blob = new Blob([doctype + source], {
        type: 'image/svg+xml;charset=utf-8',
      })
      const url = window.URL.createObjectURL(blob)

      console.log('블롭: ', blob)
      console.log('유알엘: ', url)

      d3.select('body').append('canvas').attr('id', 'pngdataurl')
      //.style('opacity', 0)

      var img1 = d3
        .select('#pngdataurl')
        .append('img')
        .attr('width', 300)
        .attr('height', 300)
        .node()
      img1.src = url

      var canvas = document.querySelector('canvas')
      var context = canvas.getContext('2d')

      var image = new Image()
      image.src = url
      image.onload = function () {
        context.drawImage(image, 0, 0)
        var canvasdata = canvas.toDataURL('image/png')

        var pngimg = '<img src="' + canvasdata + '">'
        d3.select('#pngdataurl').html(pngimg)

        var a = document.createElement('a')
        //a.download = 'sample.png'
        //a.href = canvasdata
        //a.click()
      }
*/

      //   var blobBin = atob(canvasData.split(',')[1])
      //   //console.log('블롭 바이너리: ', canvasData.split(',')[1])
      //   var array = []
      //   for (var i = 0; i < blobBin.length; i++) {
      //     array.push(blobBin.charCodeAt(i))
      //   }
      //   var file = new Blob([new Uint8Array(array)], { type: 'image/png' })
      //   // Initialize Canvas
      //   context.clearRect(0, 0, canvas.width, canvas.height)
      //   function blobToFile(theBlob, fileName) {
      //     //A Blob() is almost a File() - it's just missing the two properties below which we will add
      //     theBlob.lastModifiedDate = new Date()
      //     theBlob.name = fileName
      //
      //     return theBlob
      //   }

      //let formData = new FormData()
      // formData.append('image', file)
      //const res = await axios({
      //  url: `${process.env.REACT_APP_BACKEND_URL}/image`,
      //  method: 'POST',
      //  data: formData,
      //  processData: false, // data 파라미터 강제 string 변환 방지!!
      //  contentType: false, // application/x-www-form-urlencoded; 방지!!
      //})
      //const imageUrl = res.data
      //console.log('이미지 유알엘: ', imageUrl)

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
