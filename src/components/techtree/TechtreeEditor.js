import React from 'react'
import * as d3 from 'd3'
//import ReactDOM from 'react-dom'

export default React.memo(function TechtreeEditor({ techtreeData, category }) {
  const containerRef = React.useRef(null)

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
        category,
        nodeHoverTooltip
      )
      destroyFn = destroy
    }

    return destroyFn
  }, [category, techtreeData])

  return <div ref={containerRef} />
})

function runForceGraph(container, techtreeData, category, nodeHoverTooltip) {
  // linksData 대신, 객체 전체를 받아야지 이게 어느 과목인지도 확인할 수 있음.

  let nodeList = []

  const height = 1000 //containerRect.height;
  const width = 600 //containerRect.width;

  const svg = d3
    .select(container)
    .append('svg')
    .attr('height', height)
    .attr('width', width)
    .style('border', '1px solid #00bebe')
  //.attr('viewBox', [0, 0, width, height])

  const nodeGroup = svg.append('g').attr('class', 'node')
  const labelGroup = svg.append('g').attr('class', 'label')

  svg.on('dblclick', () => {
    nodeList = [
      ...nodeList,
      {
        id: 100,
        name: '추가됨',
        x: d3.event.pageX,
        y: d3.event.pageY,
        radius: 30,
        body: '## 이것은 마크다운.\n테스트를 하자.',
        tag: '프론트엔드',
        fillColor: 'blue',
      },
    ]

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

    labelGroup
      .selectAll('text')
      .data(nodeList)
      .join('text')
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'central')
      .text((d) => {
        return d.name
      })

    console.log('svg background double clicked!')
  })

  svg.on('click', () => {
    //d3.select('.techtreeMarkdownEditor').style('display', 'none')
    console.log('노드 또는 svg 배경이 클릭됨:')
  })

  nodeGroup.on('mousedown', (d) => {
    console.log('노드에서 마우스다운 이벤트 실행됨:')
  })
  nodeGroup.on('click', (d) => {
    console.log('노드가 클릭됨: ', d)
    d3.select('.techtreeMarkdownSection').style('display', 'block')
  })

  return {
    destroy: () => {},
    nodes: () => {
      return svg.node()
    },
  }
}
