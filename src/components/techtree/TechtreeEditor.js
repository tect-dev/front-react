import React from 'react'
import * as d3 from 'd3'
import { useSelector } from 'react-redux'
import { reduxStore } from '../../index.js'
import { selectNode, createNode, createLink } from '../../redux/techtree'
import { uid } from 'uid'
import { colorPalette } from '../../lib/constants'
import { returnPreviousNodeList, returnNextNodeList } from '../../lib/functions'

export default React.memo(function TechtreeEditor({
  techtreeData,
  selectedNode,
}) {
  const containerRef = React.useRef(null)
  const { nodeList, linkList } = useSelector((state) => {
    return {
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
        selectedNode,
        nodeHoverTooltip
      )
      destroyFn = destroy
    }

    return destroyFn
  }, [])

  return <div ref={containerRef} />
})

function runForceGraph(
  container,
  techtreeData,
  originalNodeList,
  originalLinkList,
  selectedNode,
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
    id: null,
    endX: null,
    endY: null,
  }

  let nodeList = originalNodeList
  // let nodeList = reduxStore.getState().techtree.techtreeData.nodeList
  let linkList = originalLinkList

  setInterval(updateNode, 1000) // 이거 렌더링 안됐을때도 이 함수가 계속 실행되는거 에반데;;

  const height = 600 //containerRect.height;
  const width = '50vw' //containerRect.width;
  const selectedNodeHighlightColor = colorPalette.red6

  const svg = d3
    .select(container)
    .append('svg')
    .attr('height', height)
    .attr('width', width)
    .style('border', '1px solid #00bebe')
  //.attr('viewBox', [0, 0, width, height])

  // 화살표 마커
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

  function fadeExceptSelected(selectedNode) {
    nodeGroup.selectAll('circle').style('stroke', 'none')
    //linkGroup.selectAll('line').style('opacity', '0.03')
    //labelGroup.selectAll('text').style('opacity', '0.1')

    linkList.map((linkElement) => {
      if (selectedNode.id === linkElement.startNodeID) {
        nodeGroup
          .select(`circle.${linkElement.endNodeID}`)
          .style('stroke', selectedNodeHighlightColor)
          .style('stroke-width', '2.5px')
        //labelGroup.select(`text.${linkElement.endNodeID}`).style('opacity', '1')
        //linkGroup.select(`line.${linkElement.id}`).style('opacity', '1')
      } else if (selectedNode.id === linkElement.endNodeID) {
        nodeGroup
          .select(`circle.${linkElement.startNodeID}`)
          .style('stroke', selectedNodeHighlightColor)
          .style('stroke-width', '2.5px')
        //labelGroup
        //  .select(`text.${linkElement.startNodeID}`)
        //  .style('opacity', '1')
        //linkGroup.select(`line.${linkElement.id}`).style('opacity', '1')
      } else {
      }
      nodeGroup
        .select(`circle.${selectedNode.id}`)
        .style('stroke', selectedNodeHighlightColor)
        .style('stroke-width', '2.5px')
      //labelGroup.select(`text.${selectedNode.id}`).style('opacity', '1')
    })
  }

  linkGroup
    .selectAll('line')
    .data(linkList)
    .join('line')
    .attr('x1', (d) => d.startX)
    .attr('y1', (d) => d.startY - navbarHeight)
    .attr('x2', (d) => d.endX)
    .attr('y2', (d) => d.endY - navbarHeight)
    .attr('class', (d) => d.id)
    .style('stroke', linkColor)
    .style('stroke-width', linkWidth)
    .attr('marker-end', 'url(#end-arrow)')

  nodeGroup
    .selectAll('circle')
    .data(nodeList)
    .join('circle')
    .attr('r', (d) => d.radius)
    //.style('stroke', selectedNodeHighlightColor)
    .style('fill', (d) => d.fillColor)
    .attr('cx', (d) => {
      return d.x
    })
    .attr('cy', (d) => {
      return d.y - navbarHeight // 80 is upper navbar height
    })
    .attr('class', (d) => {
      return d.id
    })
    .on('click', (d) => {
      // 노드가 생성될때 이벤트를 달아줘야지 d 객체를 이용할 수 있다.
      // 클릭하면, 관련 노드들만 보여지게 할까?
      const previousNodeList = returnPreviousNodeList(linkList, nodeList, d)
      const nextNodeList = returnNextNodeList(linkList, nodeList, d)
      reduxStore.dispatch(selectNode(previousNodeList, nextNodeList, d))
      setTimeout(fadeExceptSelected, 0, d)
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

      if (
        tempPairingNodes.startNodeID !== tempPairingNodes.endNodeID &&
        tempPairingNodes.startX !== tempPairingNodes.endX &&
        tempPairingNodes.startY !== tempPairingNodes.endY &&
        !linkList.find(
          (element) =>
            element.startNodeID === tempPairingNodes.startNodeID &&
            element.endNodeID === tempPairingNodes.endNodeID
        )
      ) {
        tempPairingNodes.id = `link${uid(20)}`
        linkList.push({ ...tempPairingNodes })
        //setTimeout(linkList.push({ ...tempPairingNodes }), 0)
        console.log('노드끼리 연결됨:', tempPairingNodes)
      }

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
    .attr('class', (d) => d.id)
    .text((d) => {
      return d.name
    })
    .style('user-select', 'none')
    .style('background-color', '#ffffff')

  console.log('그래프가 초기화됨')

  function updateLink() {
    linkGroup
      .selectAll('line')
      .data(linkList)
      .join('line')
      .attr('x1', (d) => d.startX)
      .attr('y1', (d) => d.startY - navbarHeight)
      .attr('x2', (d) => d.endX)
      .attr('y2', (d) => d.endY - navbarHeight)
      .attr('class', (d) => d.id)
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
      //.style('stroke', selectedNodeHighlightColor)
      .style('fill', (d) => d.fillColor)
      .attr('cx', (d) => {
        return d.x
      })
      .attr('cy', (d) => {
        return d.y - navbarHeight
      })
      .attr('class', (d) => {
        return d.id
      })
      .on('click', (d) => {
        const previousNodeList = returnPreviousNodeList(linkList, nodeList, d)
        const nextNodeList = returnNextNodeList(linkList, nodeList, d)
        reduxStore.dispatch(selectNode(previousNodeList, nextNodeList, d))
        setTimeout(fadeExceptSelected, 0, d)
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
        if (
          tempPairingNodes.startNodeID !== tempPairingNodes.endNodeID &&
          tempPairingNodes.startX !== tempPairingNodes.endX &&
          tempPairingNodes.startY !== tempPairingNodes.endY &&
          !linkList.find(
            (element) =>
              element.startNodeID === tempPairingNodes.startNodeID &&
              element.endNodeID === tempPairingNodes.endNodeID
          )
        ) {
          tempPairingNodes.id = `link${uid(20)}`
          await linkList.push({ ...tempPairingNodes })
          //setTimeout(linkList.push({ ...tempPairingNodes }), 0)
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
      .join('text')
      .attr('x', (d) => {
        return d.x
      })
      .attr('y', (d) => {
        return d.y - navbarHeight + nodeRadius * 2
      })
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'central')
      .attr('class', (d) => d.id)
      .text((d) => {
        return d.name
      })
      .style('user-select', 'none')

    reduxStore.dispatch(createNode(nodeList))
    console.log('노드가 갱신됨.')
  }

  svg
    .on('click', () => {
      nodeGroup.selectAll('circle').style('stroke', 'none')
    })
    .on('mousemove', (d) => {
      svg
        .select('.tempLine')
        .attr('x2', d3.event.pageX - marginX)
        .attr('y2', d3.event.pageY - navbarHeight)
    })
    .on('mouseup', (d) => {
      svg.select('.tempLine').style('opacity', '0')
    })
    .on('dblclick', () => {
      const createdNode = {
        id: `node${uid(20)}`,
        name: '새로운 노드',
        x: d3.event.pageX,
        y: d3.event.pageY,
        radius: nodeRadius,
        body: '새로운 내용',
        tag: '프론트엔드',
        fillColor: '#00bebe',
        parentNodeID: [],
        childNodeID: [],
      }
      nodeList = [...nodeList, createdNode]
      updateNode()
    })

  return {
    destroy: () => {
      // destroy 함수가 없어서, 예전것이 날아가지 않고 반복 렌더링 되는건가?
    },
    nodes: () => {
      return svg.node()
    },
  }
}
