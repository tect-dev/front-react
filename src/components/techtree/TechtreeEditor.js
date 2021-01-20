import React from 'react'
import * as d3 from 'd3'
import { useSelector } from 'react-redux'
import { reduxStore } from '../../index.js'
import { selectNode } from '../../redux/techtree'
//import ReactDOM from 'react-dom'

export default React.memo(function TechtreeEditor() {
  const containerRef = React.useRef(null)
  const { techtreeData } = useSelector((state) => {
    return { techtreeData: state.techtree.techtreeData }
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

        nodeHoverTooltip
      )
      destroyFn = destroy
    }

    return destroyFn
  }, [techtreeData])

  return <div ref={containerRef} />
})

function runForceGraph(container, techtreeData, nodeHoverTooltip) {
  // linksData 대신, 객체 전체를 받아야지 이게 어느 과목인지도 확인할 수 있음.
  const nodeRadius = 15
  let nodeList = techtreeData.nodeList

  const height = 1000 //containerRect.height;
  const width = 600 //containerRect.width;

  const svg = d3
    .select(container)
    .append('svg')
    .attr('height', height)
    .attr('width', width)
    .style('border', '1px solid #00bebe')
  //.attr('viewBox', [0, 0, width, height])

  const nodeGroup = svg.append('g').attr('class', 'nodes')
  const labelGroup = svg.append('g').attr('class', 'labels')

  function initGraph() {
    nodeGroup
      .selectAll('circle')
      .data(nodeList)
      .join('circle')
      .attr('r', (d) => {
        return d.radius
      })
      .style('stroke', 'red')
      .style('fill', '#00bebe')
      .attr('cx', (d) => {
        return d.x
      })
      .attr('cy', (d) => {
        return d.y - 80 // 80 is upper navbar height
      })
      .style('class', (d) => {
        return d.id
      })
      .on('click', (d) => {
        // 노드가 생성될때 함께 이벤트를 달아줘야지 d 객체를 이용할 수 있다.
        console.log('노드가 클릭됨: ', d)
        // 여기서 노드 객체 d를 외부로 보내려면 어떻게 해야할까.
        //console.log('리덕스 스토어:', reduxStore.getState())
        reduxStore.dispatch(selectNode(d))
        d3.select('.techtreeMarkdownSection').style('display', 'block')
      })

    labelGroup
      .selectAll('text')
      .data(nodeList)
      .enter()
      .append('text')
      .attr('x', (d) => {
        return d.x
      })
      .attr('y', (d) => {
        return d.y - 80
      })
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'central')
      .text((d) => {
        return d.name
      })
  }

  initGraph()

  svg.on('dblclick', () => {
    nodeList = [
      ...nodeList,
      {
        id: 100,
        name: '새로운 노드',
        x: d3.event.pageX,
        y: d3.event.pageY,
        radius: nodeRadius,
        body: '새로운 노드 body',
        tag: '프론트엔드',
        fillColor: 'blue',
      },
    ]

    initGraph()

    console.log('svg background double clicked!')
  })

  //svg.on('click', () => {
  //  //d3.select('.techtreeMarkdownEditor').style('display', 'none')
  //  console.log('노드 또는 svg 배경이 클릭됨:')
  //})

  nodeGroup.on('mousedown', (d) => {
    console.log('노드에서 마우스다운 이벤트 실행됨:')
  })

  return {
    destroy: () => {},
    nodes: () => {
      return svg.node()
    },
  }
}
