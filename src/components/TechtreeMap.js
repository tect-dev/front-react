import React from 'react'
import * as d3 from 'd3'
import { uid } from 'uid'

import { boxShadow, colorPalette, fontSize } from '../lib/constants'
import styled from 'styled-components'
import grayX from '../assets/xCircle.svg'

import { returnPreviousNodeList, returnNextNodeList } from '../lib/functions'
import {
  selectNode,
  createNode,
  createLink,
  deleteNode,
  deleteLink,
  updateThumbnail,
} from '../redux/techtree'
import { useDispatch, useSelector } from 'react-redux'
import { reduxStore } from '../index'

const TechtreeThumbnailBlock = styled.div`
  border-radius: 3px;
  border: 1px solid ${colorPalette.gray3};
  background-color: #ffffff;
  box-shadow: ${boxShadow.default};
`

const MapWidth = 1200
const MapHeight = 700

const TreeMap = React.memo(function TechtreeMap() {
  const dispatch = useDispatch()
  const containerRef = React.useRef(null)

  const { treeData } = useSelector((state) => {
    return {
      treeData: state.techtree.techtreeData,
    }
  })

  React.useEffect(() => {
    if (containerRef.current) {
      initGraph(containerRef.current)
    }
  }, [containerRef])
  React.useEffect(() => {
    updateGraph(containerRef.current, dispatch)
    // node 색깔변경시 새로 그려주기 위해 treeData 항목을 deps 에 넣음.
  }, [containerRef, dispatch, treeData])

  return (
    <>
      <TechtreeThumbnailBlock ref={containerRef} />
    </>
  )
})

function initGraph(container) {
  const linkWidth = '2.5px'
  const linkColor = `${colorPalette.gray3}`
  const width = MapWidth
  const height = MapHeight

  const svg = d3
    .select(container)
    .append('svg')
    .attr('id', 'techtreeContainer')
    .attr('viewBox', `0 0 ${width} ${height}`)

  // 마우스 드래그할때 나타나는 임시 라인 만들어두기.
  svg
    .append('g')
    .append('line')
    .attr('class', 'tempLine')
    .style('stroke', linkColor)
    .style('stroke-width', linkWidth)
    .attr('marker-end', 'url(#temp-end-arrow)')
    .style('opacity', '0')
    .attr('display', 'none')

  svg.append('g').attr('class', 'links')
  svg.append('g').attr('class', 'nodes')
  svg.append('g').attr('class', 'labels')
}

// reduxStore 이용해서 id 랑 매칭시키는거 제대로 작동 안할때가 많음.

// 그래프가 갱신될때 호출되는 함수
function updateGraph(container, dispatch) {
  const nodeRadius = 20

  const selectedColor = colorPalette.green2
  const selectedNodeStrokeWidth = '8px'

  const labelSize = fontSize.medium
  const deleteButtonLength = 15

  const linkWidth = '2.5px'
  const linkColor = `${colorPalette.gray3}`

  const width = MapWidth
  //const height = 700

  const offsetElement = document.getElementById('techtreeContainer')
  const clientRect = offsetElement.getBoundingClientRect()
  const relativeTop = clientRect.top
  const relativeLeft = clientRect.left
  const scrolledTopLength = window.pageYOffset
  const absoluteYPosition = scrolledTopLength + relativeTop
  const absoluteXPosition = relativeLeft

  let nodeList = reduxStore.getState().techtree.nodeList
  let linkList = reduxStore.getState().techtree.linkList

  let tempThumbnailURL = reduxStore.getState().techtree.techtreeData.thumbnail
  let tempPairingNodes = {
    startNodeID: null,
    startX: null,
    startY: null,
    endNodeID: null,
    id: null,
    endX: null,
    endY: null,
  }

  const treeAuthor = reduxStore.getState().techtree.treeAuthor

  reduxStore.subscribe(initNode)
  //reduxStore.subscribe(updateLink)

  reduxStore.subscribe(changeTreeThumbnail)

  reduxStore.subscribe(toggleEdit)
  //reduxStore.subscribe(updateLink)
  // 리덕스 스토어가 갱신될때마다 node랑 link 둘다 업데이트하면 무한호출로 에러발생.

  const svg = d3.select(container).select('svg')

  // 화살표 마커
  svg
    .append('svg:defs')
    .append('svg:marker')
    .attr('id', 'end-arrow')
    .attr('viewBox', '0 -5 10 10')
    .attr('refX', nodeRadius * 1.1)
    .attr('markerWidth', 6)
    .attr('markerHeight', nodeRadius * 1.5)
    .attr('orient', 'auto')
    .append('svg:path')
    .attr('d', 'M0,-5L10,0L0,5')
    .attr('fill', linkColor)

  // tempLine만을 위한 화살표 마커
  svg
    .append('svg:defs')
    .append('svg:marker')
    .attr('id', 'temp-end-arrow')
    .attr('viewBox', '0 -5 10 10')
    .attr('refX', 9)
    .attr('markerWidth', 6)
    .attr('markerHeight', nodeRadius * 1.5)
    .attr('orient', 'auto')
    .append('svg:path')
    .attr('d', 'M0,-5L10,0L0,5')
    .attr('fill', linkColor)

  const linkGroup = svg.select('.links')
  const nodeGroup = svg.select('.nodes')
  const labelGroup = svg.select('.labels')

  const techtreeID = reduxStore.getState().techtree.techtreeData._id

  function initLink() {
    // clear all dom in linkGroup
    linkGroup.selectAll('*').remove()

    // create new line dom in linkGroup
    const createdLinkGroup = linkGroup
      .selectAll('line')
      .data(linkList)
      .join('line')
      .attr('x1', (d) => d.startX)
      .attr('y1', (d) => d.startY)
      .attr('x2', (d) => d.endX)
      .attr('y2', (d) => d.endY)
      .attr('class', (d) => d.id)
      .style('stroke', linkColor)
      .style('stroke-width', linkWidth)
      .attr('marker-end', 'url(#end-arrow)')

    if (reduxStore.getState().techtree.isEditingTechtree) {
      createdLinkGroup
        .transition()
        .duration(150)
        .ease(d3.easeLinear)
        .on('start', function repeat() {
          d3.active(this)
            .attr('cx', (d) => {
              return d.x - 0.7
            })
            .transition()
            .duration(150)
            .ease(d3.easeLinear)
            .attr('cx', (d) => {
              return d.x + 0.7
            })
            .transition()
            .duration(150)
            .ease(d3.easeLinear)
            .on('start', repeat)
        })
    }

    // create link delete button in linkGroup
    linkGroup
      .selectAll('image')
      .data(linkList)
      .join('image')
      .attr('href', grayX)
      .attr('width', deleteButtonLength)
      .attr('height', deleteButtonLength)
      //.attr('src', xCircle)
      .style('fill', 'black')
      .attr('x', (link) => {
        return (link.startX + link.endX) / 2
      })
      .attr('y', (link) => {
        return (link.startY + link.endY) / 2
      })
      .attr('class', (d) => {
        return `delete${d.id}`
      })
      .on('click', async (link) => {
        const deleteOK = window.confirm('Delete Connection?')
        if (deleteOK) {
          await dispatch(deleteLink(nodeList, linkList, techtreeID, link))
          await updateLink()
          await changeTreeThumbnail()
          await dispatch(updateThumbnail(techtreeID, tempThumbnailURL))
        } else {
          return
        }
      })
      .attr('display', () => {
        if (reduxStore.getState().techtree.isEditingTechtree) {
          return 'inline'
        } else {
          return 'none'
        }
      })

      .style('cursor', 'pointer')
  }

  // 노드 생성
  function initNode() {
    nodeGroup.selectAll('*').remove()
    const createdNodeGroup = nodeGroup
      .selectAll('circle')
      .data(nodeList)
      .join('circle')
      .attr('r', (d) => nodeRadius)
      .style('fill', (d) => d.fillColor)
      .style('stroke', (d) => {
        if (d.id === reduxStore.getState().techtree.selectedNode.id) {
          return selectedColor
        } else {
          return
        }
      })
      .attr('cx', (d) => {
        return d.x
      })
      .attr('cy', (d) => {
        return d.y
      })
      .attr('class', (d) => {
        return d.id
      })
      .style('cursor', 'pointer')

      .on('click', (d) => {
        const previousNodeList = returnPreviousNodeList(linkList, nodeList, d)
        const nextNodeList = returnNextNodeList(linkList, nodeList, d)
        dispatch(selectNode(previousNodeList, nextNodeList, d))
      })

    if (reduxStore.getState().techtree.isEditingTechtree) {
      // drag node
      createdNodeGroup
        .call(
          d3
            .drag()
            .on('start', (d) => {
              d3.select(this).raise().classed('active', true)
            })
            .on('drag', (node) => {
              const newLinkList = linkList.map((link) => {
                if (link.startNodeID === node.id) {
                  return { ...link, startX: d3.event.x, startY: d3.event.y }
                } else if (link.endNodeID === node.id) {
                  return { ...link, endX: d3.event.x, endY: d3.event.y }
                } else {
                  return link
                }
              })
              linkList = newLinkList
              initLink()
              d3.select(this).attr('cx', d3.event.x).attr('cy', d3.event.y)
              node.x = d3.event.x
              node.y = d3.event.y
              initNode()
              initLabel()
            })
            .on('end', async (node) => {
              d3.select(this).classed('active', false)
              node.x = d3.event.x
              node.y = d3.event.y

              await dispatch(createLink(nodeList, linkList, techtreeID))
              await updateNode()
              await updateLink()
              await changeTreeThumbnail()
              await dispatch(updateThumbnail(techtreeID, tempThumbnailURL))
            })
        )
        .attr('cx', (d) => {
          return d.x
        })
        .transition()
        .duration(130)
        .ease(d3.easeLinear)
        .on('start', function repeat() {
          d3.active(this)
            .attr('cx', (d) => {
              return d.x - 1
            })
            .transition()
            .duration(130)
            .ease(d3.easeLinear)
            .attr('cx', (d) => {
              return d.x + 1
            })
            .transition()
            .duration(130)
            .ease(d3.easeLinear)
            .on('start', repeat)
        })
    } else {
      // connect nodes by link
      createdNodeGroup
        .call(
          d3
            .drag()
            .on('start', (d) => {
              if (
                treeAuthor?.firebaseUid === reduxStore.getState().auth.userID
              ) {
                svg
                  .select('g')
                  .select('.tempLine')
                  .attr('x1', d.x)
                  .attr('y1', d.y)
                svg
                  .select('g')
                  .select('.tempLine')
                  .attr('x2', d3.event.x)
                  .attr('y2', d3.event.y)
                svg
                  .select('g')
                  .select('.tempLine')
                  .style('opacity', '1')
                  .attr('display', 'inline')
                tempPairingNodes.startNodeID = d.id
                tempPairingNodes.startX = d.x
                tempPairingNodes.startY = d.y
              }
            })
            .on('drag', (node) => {
              if (
                d3.select('.tempLine').attr('x1') > 1 &&
                d3.select('.tempLine').attr('y1') > 1 &&
                d3.select('.tempLine').style('opacity') != 0
              ) {
                svg
                  .select('g')
                  .select('.tempLine')
                  .attr('x2', d3.event.x)
                  .attr('y2', d3.event.y)
                initLink()
                initNode()
                initLabel()
              }
            })
            .on('end', async (startNode) => {
              const pointerX = d3.event.x
              const pointerY = d3.event.y
              nodeList.map(async (node) => {
                if (
                  (node.x - pointerX) * (node.x - pointerX) +
                    (node.y - pointerY) * (node.y - pointerY) <
                  nodeRadius * nodeRadius
                ) {
                  tempPairingNodes.endNodeID = node.id
                  tempPairingNodes.endX = node.x
                  tempPairingNodes.endY = node.y

                  // 연결된 노드를 데이터에 반영
                  if (
                    tempPairingNodes.startNodeID !==
                      tempPairingNodes.endNodeID &&
                    tempPairingNodes.startX !== tempPairingNodes.endX &&
                    tempPairingNodes.startY !== tempPairingNodes.endY &&
                    !linkList.find(
                      (element) =>
                        element.startNodeID === tempPairingNodes.startNodeID &&
                        element.endNodeID === tempPairingNodes.endNodeID
                    ) &&
                    d3.select('.tempLine').attr('x1') > 1 &&
                    d3.select('.tempLine').attr('y1') > 1 &&
                    d3.select('.tempLine').style('opacity') != 0
                  ) {
                    tempPairingNodes.id = `link${uid(20)}`
                    linkList.push({ ...tempPairingNodes })

                    await dispatch(createLink(nodeList, linkList, techtreeID))
                    await updateLink()
                    await changeTreeThumbnail()
                    await dispatch(
                      updateThumbnail(techtreeID, tempThumbnailURL)
                    )
                    svg.select('.tempLine').style('opacity', '0')
                  }
                  svg
                    .select('g')
                    .select('.tempLine')
                    .attr('x1', 0)
                    .attr('y1', 0)
                    .attr('x2', 0)
                    .attr('y2', 0)
                  tempPairingNodes = {}
                }
              })
              svg.select('g').select('.tempLine').attr('x1', 0).attr('y1', 0)
              svg.select('.tempLine').style('opacity', '0')
            })
        )
        .style('stroke-width', 0)
        .transition()
        .duration(500)
        .ease(d3.easeLinear)
        .style('stroke-width', selectedNodeStrokeWidth)
    }

    // 노드 삭제용 버튼 만들기
    nodeGroup
      .selectAll('image')
      .data(nodeList)
      .join('image')
      .attr('href', grayX)
      .attr('width', deleteButtonLength)
      .attr('height', deleteButtonLength)
      .style('fill', (d) => d.fillColor)
      .attr('x', (d) => {
        return d.x - nodeRadius * 1.7
      })
      .attr('y', (d) => {
        return d.y - nodeRadius * 1.7
      })
      .attr('class', (d) => {
        return d.id
      })
      .attr('display', () => {
        if (reduxStore.getState().techtree.isEditingTechtree) {
          return 'inline'
        } else {
          return 'none'
        }
      })
      .on('click', async (d) => {
        const deleteOK = window.confirm(`Delete ${d.name} Node?`)
        if (deleteOK) {
          await dispatch(deleteNode(nodeList, linkList, techtreeID, d))
          await updateNode()
          await updateLink()
          await changeTreeThumbnail()
          await dispatch(updateThumbnail(techtreeID, tempThumbnailURL))
        } else {
          return
        }
      })
      .on('touch', async (d) => {
        const deleteOK = window.confirm(`Delete ${d.name} Node?`)
        if (deleteOK) {
          await dispatch(deleteNode(nodeList, linkList, techtreeID, d))
          await updateNode()
          await updateLink()
          await changeTreeThumbnail()
          await dispatch(updateThumbnail(techtreeID, tempThumbnailURL))
        } else {
          return
        }
      })
      .style('cursor', 'pointer')
  }

  function initLabel() {
    labelGroup.selectAll('*').remove()
    labelGroup
      .selectAll('text')
      .data(nodeList)
      .join('text')
      .attr('x', (d) => {
        return d.x
      })
      .attr('y', (d) => {
        return d.y + nodeRadius * 2
      })
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'central')
      .attr('class', (d) => d.id)
      .text((d) => {
        return d.name
      })
      .style('font-size', labelSize)
      .style('user-select', 'none')
      .style(
        'text-shadow',
        '1px 1px 1px #ffffff'
        //'-3px 0 #F2F1F6, 0 3px #F2F1F6, 3px 0 #F2F1F6, 0 -3px #F2F1F6'
      )
  }

  svg.on('dblclick', async () => {
    if (treeAuthor?.firebaseUid === reduxStore.getState().auth.userID) {
      const ratioFactor = width / clientRect.width
      const createdNode = {
        id: `node${uid(20)}`,
        name: 'New Node',
        x: d3.event.offsetX * ratioFactor,
        y: d3.event.offsetY * ratioFactor,
        radius: nodeRadius,
        body: 'New Document',
        hashtags: [],
        fillColor: '#69bc69',
        parentNodeID: [],
        childNodeID: [],
      }
      nodeList = [...nodeList, createdNode]
      await reduxStore.dispatch(createNode(nodeList, linkList, techtreeID))
      await updateNode()
      await changeTreeThumbnail()
      await dispatch(updateThumbnail(techtreeID, tempThumbnailURL))
    }
  })
  if (reduxStore.getState().techtree.isEditingTechtree) {
  } else {
    svg
      .on('mousemove', (d) => {
        svg
          .select('g')
          .select('.tempLine')
          .attr('x2', d3.event.pageX - absoluteXPosition)
          .attr('y2', d3.event.pageY - absoluteYPosition)
      })
      .on('mouseup', (d) => {
        svg.select('g').select('.tempLine').attr('x1', 0).attr('y1', 0)
        svg.select('.tempLine').style('opacity', '0')
      })
  }

  initLink()
  initNode()
  initLabel()

  function updateNode() {
    nodeList = reduxStore.getState().techtree.nodeList
    initNode()
    initLabel()
  }

  function updateLink() {
    linkList = reduxStore.getState().techtree.linkList
    initLink()
    tempPairingNodes = {}
  }

  function toggleEdit() {
    if (reduxStore.getState().techtree.isEditingTechtree) {
      nodeGroup.selectAll('image').attr('display', 'inline')
      linkGroup.selectAll('image').attr('display', 'inline')
    } else {
      nodeGroup.selectAll('image').attr('display', 'none')
      linkGroup.selectAll('image').attr('display', 'none')
    }
  }

  function changeTreeThumbnail() {
    const svgDOM = document.getElementById('techtreeContainer')
    if (svgDOM) {
      const source = new XMLSerializer().serializeToString(svgDOM)
      var decoded = unescape(encodeURIComponent(source))
      // Now we can use btoa to convert the svg to base64
      const base64 = btoa(decoded)
      const thumbnailURL = `data:image/svg+xml;base64,${base64}`
      tempThumbnailURL = thumbnailURL
    }
  }
}

export default TreeMap
