import React from 'react'
import * as d3 from 'd3'
import { uid } from 'uid'

import { colorPalette, fontSize, boxShadow } from '../lib/constants'
import styled from 'styled-components'
import xCircle from '../assets/xCircle.svg'
import grayX from '../assets/xCircle.svg'

import { returnPreviousNodeList, returnNextNodeList } from '../lib/functions'
import {
  selectNode,
  createNode,
  createLink,
  deleteNode,
  deleteLink,
} from '../redux/demo'
import { useDispatch, useSelector } from 'react-redux'
import { reduxStore } from '../index'

const TechtreeThumbnailBlock = styled.div`
  border-radius: 3px;
  border: 1px solid ${colorPalette.gray3};
  background-color: #ffffff;
  box-shadow: ${boxShadow.default};
`

export default React.memo(function TechtreeMap() {
  const dispatch = useDispatch()
  const containerRef = React.useRef(null)

  const {
    selectedNode,
    nodeList,
    linkList,
    loginState,
    isEditingTechtree,
  } = useSelector((state) => {
    return {
      selectedNode: state.demo.selectedNode,
      nodeList: state.demo.demoNodeList,
      linkList: state.demo.demoLinkList,
      loginState: true,
      isEditingTechtree: state.techtree.isEditingTechtree,
    }
  })

  React.useEffect(() => {
    if (containerRef.current) {
      initGraph(containerRef.current, nodeList, linkList)
    }
  }, [])
  React.useEffect(() => {
    updateGraph(containerRef.current, dispatch, isEditingTechtree)
  }, [
    containerRef,
    nodeList,
    linkList,
    dispatch,
    loginState,
    isEditingTechtree,
  ])

  return (
    <>
      <TechtreeThumbnailBlock ref={containerRef} />
    </>
  )
})

function initGraph(container, originalNodeList, originalLinkList) {
  // 데이터 저장 원칙 : navbar 높이때문에 Y좌표는 보정이 필요함.
  // 하지만 보정을 가한 좌표를 저장하지 않는다. 순수한 좌표를 저장해야함.
  // 그 좌표에 대해 렌더링하는 시점에만 보정을 가한다.
  // 그래야지 navbar 높이가 변해도 문제없이 렌더링 할 수 있음.

  const linkWidth = '2.5px'
  const linkColor = `${colorPalette.gray4}`

  const width = 700
  const height = 700

  let nodeList = originalNodeList
  let linkList = originalLinkList

  const svg = d3
    .select(container)
    .append('svg')
    .attr('id', 'techtreeContainer')
    //  .attr('width', width)
    //  .attr('height', height)
    .attr('viewBox', `0 0 ${width} ${height}`)

  //.call(
  //  d3.zoom().on('zoom', function () {
  //    svg.attr('transform', d3.event.transform)
  //  })
  //)

  // 마우스 드래그할때 나타나는 임시 라인 만들어두기.
  svg
    .append('g')
    .append('line')
    .attr('class', 'tempLine')
    .style('stroke', linkColor)
    .style('stroke-width', linkWidth)
    .attr('marker-end', 'url(#end-arrow)')
    .style('opacity', '0')
    .attr('display', 'none')

  const linkGroup = svg.append('g').attr('class', 'links')
  const nodeGroup = svg.append('g').attr('class', 'nodes')
  const labelGroup = svg.append('g').attr('class', 'labels')

  const offsetElement = document.getElementById('techtreeContainer')

  const clientRect = offsetElement.getBoundingClientRect()
  const relativeTop = clientRect.top
  const scrolledTopLength = window.pageYOffset
  const absoluteYPosition = scrolledTopLength + relativeTop
}

// reduxStore 이용해서 id 랑 매칭시키는거 제대로 작동 안할때가 많음.

// 그래프가 갱신될때 호출되는 함수
function updateGraph(container, dispatch, isEditingTechtree) {
  const nodeRadius = 20
  const nodeColor = `${colorPalette.mainGreen}`

  const selectedColor = `${colorPalette.gray9}`
  const selectedNodeStrokeWidth = '2px'

  const labelSize = fontSize.medium
  const width = 700
  const height = 700
  const linkWidth = '2.5px'
  const linkColor = `${colorPalette.gray5}`

  const offsetElement = document.getElementById('techtreeContainer')
  const clientRect = offsetElement.getBoundingClientRect()
  const relativeTop = clientRect.top
  const relativeLeft = clientRect.left
  const scrolledTopLength = window.pageYOffset
  const absoluteYPosition = scrolledTopLength + relativeTop
  const absoluteXPosition = relativeLeft

  let nodeList = reduxStore.getState().demo.demoNodeList
  let linkList = reduxStore.getState().demo.demoLinkList
  let tempPairingNodes = {
    startNodeID: null,
    startX: null,
    startY: null,
    endNodeID: null,
    id: null,
    endX: null,
    endY: null,
  }

  reduxStore.subscribe(updateNode)
  //reduxStore.subscribe(updateLink)
  // 리덕스 스토어가 갱신될때마다 node랑 link 둘다 업데이트하면 무한호출로 에러발생.

  const techtreeData = reduxStore.getState().techtree.techtreeData

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

  const linkGroup = svg.select('.links')
  const nodeGroup = svg.select('.nodes')
  const labelGroup = svg.select('.labels')
  const deleteButtonLength = 17
  const techtreeID = reduxStore.getState().techtree.techtreeData._id

  function initLink() {
    linkGroup.selectAll('*').remove()
    linkGroup
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

    // 링크 삭제용 버튼
    linkGroup
      .selectAll('image')
      //.selectAll('rect')
      .data(linkList)
      .join('image')
      //.join('rect')
      .attr('href', grayX)
      .attr('width', deleteButtonLength)
      .attr('height', deleteButtonLength)
      .attr('src', xCircle)
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
      .attr('display', () => {
        if (reduxStore.getState().techtree.isEditingTechtree) {
          return 'inline'
        } else {
          return 'none'
        }
      })
      .on('click', (link) => {
        const deleteOK = window.confirm('Delete Connection?')
        if (deleteOK) {
          dispatch(deleteLink(nodeList, linkList, techtreeData, link))
        } else {
          return
        }
      })
      .style('cursor', 'pointer')
  }

  // 노드 생성
  function initNode() {
    nodeGroup.selectAll('*').remove()
    if (isEditingTechtree) {
      nodeGroup
        .selectAll('circle')
        .data(nodeList)
        .join('circle')
        .attr('r', (d) => nodeRadius)
        .style('fill', (d) => d.fillColor) // 나중에 d.fillColor 로 변경
        .style('stroke', (d) => {
          if (d.id === reduxStore.getState().demo.selectedNode.id) {
            return selectedColor
          } else {
            return
          }
        })
        .style('stroke-width', selectedNodeStrokeWidth)
        .attr('cx', (d) => {
          return d.x
        })
        .attr('cy', (d) => {
          return d.y
        })
        .attr('class', (d) => {
          return d.id
        })
        .on('click', (d) => {
          const previousNodeList = returnPreviousNodeList(linkList, nodeList, d)
          const nextNodeList = returnNextNodeList(linkList, nodeList, d)
          dispatch(selectNode(previousNodeList, nextNodeList, d))
        })
        .style('cursor', 'pointer')
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
            .on('end', function (node) {
              d3.select(this).classed('active', false)
              node.x = d3.event.x
              node.y = d3.event.y
              updateNode()
              updateLink()
            })
        )
    } else {
      nodeGroup
        .selectAll('circle')
        .data(nodeList)
        .join('circle')
        .attr('r', (d) => nodeRadius)
        .style('fill', (d) => d.fillColor)
        .style('stroke', (d) => {
          if (d.id === reduxStore.getState().demo.selectedNode.id) {
            return selectedColor
          } else {
            return
          }
        })
        .style('stroke-width', selectedNodeStrokeWidth)

        .attr('cx', (d) => {
          return d.x
        })
        .attr('cy', (d) => {
          return d.y
        })
        .attr('class', (d) => {
          return d.id
        })
        .on('click', (d) => {
          const previousNodeList = returnPreviousNodeList(linkList, nodeList, d)
          const nextNodeList = returnNextNodeList(linkList, nodeList, d)
          dispatch(selectNode(previousNodeList, nextNodeList, d))
        })
        .style('cursor', 'pointer')
        .call(
          d3
            .drag()
            .on('start', (d) => {
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
            .on('end', (startNode) => {
              const pointerX = d3.event.x
              const pointerY = d3.event.y
              nodeList.map((node) => {
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
                    updateLink()
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
              //updateNode()
              //updateLink()
              svg.select('g').select('.tempLine').attr('x1', 0).attr('y1', 0)
              svg.select('.tempLine').style('opacity', '0')
            })
        )
    }
    // 노드 삭제용 버튼 만들기
    nodeGroup
      .selectAll('image')
      .data(nodeList)
      .join('image')
      .attr('href', grayX)
      .attr('width', deleteButtonLength)
      .attr('height', deleteButtonLength)
      .style('fill', (d) => nodeColor)
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
      .on('click', (d) => {
        const deleteOK = window.confirm(`Delete ${d.name} Node?`)
        if (deleteOK) {
          dispatch(
            deleteNode(
              nodeList,
              linkList,
              techtreeID,
              d,
              reduxStore.getState().techtree.techtreeData
            )
          )
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

  if (isEditingTechtree) {
    svg.on('dblclick', () => {
      const ratioFactor = width / clientRect.width
      const createdNode = {
        id: `node${uid(20)}`,
        name: 'New Node',
        x: d3.event.offsetX * ratioFactor,
        y: d3.event.offsetY * ratioFactor,
        radius: nodeRadius,
        body: 'New Document',
        hashtags: [],
        fillColor: '#00bebe',
        parentNodeID: [],
        childNodeID: [],
      }
      nodeList = [...nodeList, createdNode]
      reduxStore.dispatch(createNode(nodeList, linkList, techtreeData))
      updateNode()
    })
  } else {
    svg
      .on('dblclick', (e) => {
        const ratioFactor = width / clientRect.width

        const createdNode = {
          id: `node${uid(20)}`,
          name: 'New Node',
          x: d3.event.offsetX * ratioFactor,
          y: d3.event.offsetY * ratioFactor,
          radius: nodeRadius,
          body: 'New Document',
          hashtags: [],
          fillColor: '#00bebe',
          parentNodeID: [],
          childNodeID: [],
        }
        nodeList = [...nodeList, createdNode]
        reduxStore.dispatch(createNode(nodeList, linkList, techtreeData))
        updateNode()
      })
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
    initNode()
    initLabel()
  }

  function updateLink() {
    initLink()
    reduxStore.dispatch(
      createLink(
        nodeList,
        linkList,
        reduxStore.getState().techtree.techtreeData
      )
    )
    tempPairingNodes = {}
  }
}
