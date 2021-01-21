import React from 'react'
import * as d3 from 'd3'
import { useSelector } from 'react-redux'
import { reduxStore } from '../../index.js'
import { selectNode, createNode, createLink } from '../../redux/techtree'
import { uid } from 'uid'
import { select, some } from 'd3'
//import ReactDOM from 'react-dom'

export default React.memo(function TechtreeEditor() {
  const containerRef = React.useRef(null)
  const { techtreeData, nodeList, linkList } = useSelector((state) => {
    return {
      techtreeData: state.techtree.techtreeData,
      nodeList: state.techtree.techtreeData.nodeList,
      linkList: state.techtree.techtreeData.linkList,
    }
  })

  const nodeHoverTooltip = (node) => {
    return `<div>     
      <p><b>${node.name}</b></p>
      <p>최근 5년<br />마일리지 커트라인<br />${node.recentMileage}</p>
    </div>`
  }

  React.useEffect(() => {
    let destroyFn

    if (containerRef.current) {
      const { destroy } = runForceGraph(
        containerRef.current,
        techtreeData,
        nodeList,
        linkList,
        nodeHoverTooltip
      )
      destroyFn = destroy
    }

    return destroyFn
  }, [techtreeData])

  return <div ref={containerRef} />
})

function runForceGraph(
  container,
  techtreeData,
  originalNodeList,
  originalLinkList,
  nodeHoverTooltip
) {
  // 데이터 저장 원칙 : navbar 높이때문에 Y좌표는 보정이 필요함.
  // 하지만 보정을 가한 좌표를 저장하지 않는다. 순수한 좌표를 저장해야함.
  // 그 좌표에 대해 렌더링하는 시점에만 보정을 가한다.
  // 그래야지 navbar 높이가 변해도 문제없이 렌더링 할 수 있음.

  const nodeRadius = 15
  const marginX = 8
  const navbarHeight = 85
  const linkWidth = '2.5px'
  const linkColor = '#000000'
  let tempPairingNodes = {
    startNodeID: null,
    startX: null,
    startY: null,
    endNodeID: null,
    endX: null,
    endY: null,
  }

  let nodeList = originalNodeList
  let linkList = originalLinkList

  const height = 1000 //containerRect.height;
  const width = 600 //containerRect.width;

  const svg = d3
    .select(container)
    .append('svg')
    .attr('height', height)
    .attr('width', width)
    .style('border', '1px solid #00bebe')
  //.attr('viewBox', [0, 0, width, height])

  // 마우스 드래그할때 나타나는 임시 라인 만들어두기.
  svg
    .append('g')
    .append('line')
    .attr('class', 'tempLine')
    .style('stroke', linkColor)
    .style('stroke-width', linkWidth)
    .attr('marker-end', 'url(#end-arrow)')
    .style('opacity', '0')

  const linkGroup = svg.append('g').attr('class', 'links')
  const nodeGroup = svg.append('g').attr('class', 'nodes')
  const labelGroup = svg.append('g').attr('class', 'labels')

  function returnSomeIDObject(someArray, id) {
    return someArray.find((element) => {
      return element.id === id
    })
  }

  function initGraph() {
    linkGroup
      .selectAll('line')
      .data(linkList)
      .join('line')
      .attr('x1', (d) => d.startX)
      .attr('y1', (d) => d.startY - navbarHeight)
      .attr('x2', (d) => d.endX)
      .attr('y2', (d) => d.endY - navbarHeight)
      .style('stroke', linkColor)
      .style('stroke-width', linkWidth)
      .attr('marker-end', 'url(#end-arrow)')

    nodeGroup
      .selectAll('circle')
      .data(nodeList)
      .join('circle')
      .attr('r', (d) => d.radius)
      //.style('stroke', 'red')
      .style('fill', (d) => d.fillColor)
      .attr('cx', (d) => {
        return d.x
      })
      .attr('cy', (d) => {
        return d.y - navbarHeight // 80 is upper navbar height
      })
      .style('class', (d) => {
        return d.id
      })
      .on('click', (d) => {
        // 노드가 생성될때 이벤트를 달아줘야지 d 객체를 이용할 수 있다.
        reduxStore.dispatch(selectNode(d))
        d3.select('.techtreeMarkdownSection').style('display', 'block')
      })
      .on('mousedown', (d) => {
        svg
          .select('.tempLine')
          .attr('x1', d.x)
          .attr('y1', d.y - navbarHeight)
          .style('opacity', '1')
        tempPairingNodes.startNodeID = d.id
        tempPairingNodes.startX = d.x
        tempPairingNodes.startY = d.y
      })
      .on('mouseup', (d) => {
        console.log('이 노드에서 마우스 업이 수행됨:', d)
        tempPairingNodes.endNodeID = d.id
        tempPairingNodes.endX = d.x
        tempPairingNodes.endY = d.y
        // 연결된 노드를 데이터에 반영

        linkList.push({ ...tempPairingNodes })
        //console.log('노드가 서로 연결됨:', tempPairingNodes)
        //console.log('링크 리스트에 새 링크가 추가됨:', linkList)

        // 데이터에 반영됐으면 임시 페어링을 초기화.
        tempPairingNodes = {}
        //console.log('노드 페어링 초기화:', tempPairingNodes)
        //console.log(':', linkList)
      })
      .style('cursor', 'pointer')

    labelGroup
      .selectAll('text')
      .data(nodeList)
      .join('text')
      .attr('x', (d) => {
        return d.x
      })
      .attr('y', (d) => {
        return d.y - navbarHeight + nodeRadius * 2
      })
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'central')
      .text((d) => {
        return d.name
      })
      .style('user-select', 'none')
      .style('background-color', '#ffffff')

    svg
      .append('svg:defs')
      .append('svg:marker')
      .attr('id', 'end-arrow')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', nodeRadius * 1.3)
      .attr('markerWidth', 6)
      .attr('markerHeight', nodeRadius * 1.5)
      .attr('orient', 'auto')
      .append('svg:path')
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('fill', '#000')

    svg
      .append('svg:defs')
      .append('svg:marker')
      .attr('id', 'start-arrow')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 4)
      .attr('markerWidth', 3)
      .attr('markerHeight', 3)
      .attr('orient', 'auto')
      .append('svg:path')
      .attr('d', 'M10,-5L0,0L10,5')
      .attr('fill', '#000')

    console.log('그래프가 초기화됨')
  }

  function updateLink() {
    linkGroup
      .selectAll('line')
      .data(linkList)
      .join('line')
      .attr('x1', (d) => d.startX)
      .attr('y1', (d) => d.startY - navbarHeight)
      .attr('x2', (d) => d.endX)
      .attr('y2', (d) => d.endY - navbarHeight)
      .style('stroke', linkColor)
      .style('stroke-width', linkWidth)
      .attr('marker-end', 'url(#end-arrow)')

    reduxStore.dispatch(createLink(linkList))

    console.log('링크가 갱신됨')
  }

  function updateNode() {
    nodeGroup
      .selectAll('circle')
      .data(nodeList)
      .join('circle')
      .attr('r', (d) => {
        return d.radius
      })
      //.style('stroke', 'red')
      .style('fill', (d) => d.fillColor)
      .attr('cx', (d) => {
        return d.x
      })
      .attr('cy', (d) => {
        return d.y - navbarHeight
      })
      .style('class', (d) => {
        return d.id
      })
      .on('click', (d) => {
        // 노드가 생성될때 함께 이벤트를 달아줘야지 d 객체를 이용할 수 있다.
        //console.log('노드가 클릭됨: ', d)
        reduxStore.dispatch(selectNode(d))
        d3.select('.techtreeMarkdownSection').style('display', 'block')
      })
      .on('mousedown', (d) => {
        svg
          .select('.tempLine')
          .attr('x1', d.x)
          .attr('y1', d.y - navbarHeight)
          .style('opacity', '1')
        tempPairingNodes.startNodeID = d.id
        tempPairingNodes.startX = d.x
        tempPairingNodes.startY = d.y
      })
      .on('mouseup', async (d) => {
        console.log('이 노드에서 마우스 업이 수행됨:', d)
        tempPairingNodes.endNodeID = d.id
        tempPairingNodes.endX = d.x
        tempPairingNodes.endY = d.y
        // 연결된 노드를 데이터에 반영
        if (tempPairingNodes.startNodeID !== tempPairingNodes.endNodeID) {
          await linkList.push({ ...tempPairingNodes })
          console.log('노드가 서로 연결됨:', tempPairingNodes)
          console.log('링크 리스트에 새 링크가 추가됨:', linkList)
          updateLink()
        }

        // 데이터에 반영됐으면 임시 페어링을 초기화.
        tempPairingNodes = {}
        console.log('노드 페어링 초기화:', tempPairingNodes)
      })
      .style('cursor', 'pointer')

    labelGroup
      .selectAll('text')
      .data(nodeList)
      .enter()
      .append('text')
      .attr('x', (d) => {
        return d.x
      })
      .attr('y', (d) => {
        return d.y - navbarHeight + nodeRadius * 2
      })
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'central')
      .text((d) => {
        return d.name
      })
      .style('user-select', 'none')
    reduxStore.dispatch(createNode(nodeList))
    console.log('노드가 갱신됨.')
  }

  svg
    .on('mousemove', (d) => {
      svg
        .select('.tempLine')
        .attr('x2', d3.event.pageX - marginX)
        .attr('y2', d3.event.pageY - navbarHeight)
    })
    .on('mouseup', (d) => {
      svg.select('.tempLine').style('opacity', '0')

      //updateLink()
    })
    .on('dblclick', () => {
      const createdNode = {
        id: uid(24),
        name: '새로운 노드',
        x: d3.event.pageX,
        y: d3.event.pageY,
        radius: nodeRadius,
        body: '새로운 노드 body',
        tag: '프론트엔드',
        fillColor: '#00bebe',
        parentNodeID: ['1'],
        childNodeID: ['2'],
      }
      nodeList = [...nodeList, createdNode]

      updateNode()
    })

  initGraph()

  return {
    destroy: () => {},
    nodes: () => {
      return svg.node()
    },
  }
}
