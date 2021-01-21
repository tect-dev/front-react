import React from 'react'
import * as d3 from 'd3'
import { useSelector } from 'react-redux'
import { reduxStore } from '../../index.js'
import { selectNode } from '../../redux/techtree'
import { uid } from 'uid'
import { select } from 'd3'
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
  const navbarHeight = 80
  let nodeList = techtreeData.nodeList
  const linkList = [{ sourceID: '1', target: '2', left: false, right: true }]

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
  const linkGroup = svg.append('g').attr('class', 'links')
  const labelGroup = svg.append('g').attr('class', 'labels')

  function initGraph() {
    labelGroup
      .selectAll('line')
      .data(linkList)
      .join('line')
      .style('stroke', '#999999')
      .style('stroke-width', '2px')

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
        return d.y - navbarHeight // 80 is upper navbar height
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
        linkGroup
          .select('.tempLine')
          .attr('x1', d.x)
          .attr('y1', d.y - navbarHeight)
          .style('opacity', '1')
      })

      .on('mouseup', (d) => {
        console.log('이 노드에서 마우스 업이 수행됨:', d)
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
    //.style('cursor', 'pointer')

    svg
      .append('svg:defs')
      .append('svg:marker')
      .attr('id', 'end-arrow')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 6)
      .attr('markerWidth', 3)
      .attr('markerHeight', 3)
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

    // 마우스 드래그할때 나타나는 임시 라인 생성
    linkGroup
      .append('line')
      .attr('class', 'tempLine')
      .style('stroke', '#999999')
      .style('opacity', '0')
  }

  initGraph()
  //dragHandler(svg.selectAll('circle'))

  svg
    .on('mousemove', (d) => {
      linkGroup
        .select('.tempLine')
        .attr('x2', d3.event.x)
        .attr('y2', d3.event.y - navbarHeight)
    })
    .on('mouseup', (d) => {
      console.log('이 노드에서 마우스 업이 수행됨:', d)
      linkGroup.select('.tempLine').style('opacity', '0')
    })

    .on('dblclick', () => {
      nodeList = [
        ...nodeList,
        {
          id: uid(24),
          name: '새로운 노드',
          x: d3.event.x,
          y: d3.event.y,
          radius: nodeRadius,
          body: '새로운 노드 body',
          tag: '프론트엔드',
          fillColor: 'blue',
          parentNodeID: ['1'],
          childNodeID: ['2'],
        },
      ]

      initGraph()

      console.log('svg background double clicked!')
    })

  //svg.on('click', () => {
  //  //d3.select('.techtreeMarkdownEditor').style('display', 'none')
  //  console.log('노드 또는 svg 배경이 클릭됨:')
  //})

  return {
    destroy: () => {},
    nodes: () => {
      return svg.node()
    },
  }
}
