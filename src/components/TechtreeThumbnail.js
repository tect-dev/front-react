import React from 'react'
import * as d3 from 'd3'
import { Link } from 'react-router-dom'
import { colorPalette, boxShadow, hoverAction } from '../lib/constants'
import styled from 'styled-components'

export const TechtreeThumbnailBlock = styled.div`
  padding: 1rem;
  display: flex;
  flex: 1;
  flex-direction: column;
  h4 {
    font-size: 1rem;
    margin: 0;
    margin-bottom: 0.25rem;
    line-height: 1.5;
    word-break: break-word;
    color: ${colorPalette.gray9};
  }
  .description-wrapper {
    flex: 1;
  }
  svg {
    object-fit: cover;
  }
`

export const TechtreeInfo = styled.div`
  padding: 0.625rem 1rem;
  border-top: 1px solid ${colorPalette.gray0};
  border-bottom: 1px solid ${colorPalette.gray0};
  display: flex;
  font-size: 0.75rem;
  line-height: 1.5;
  justify-content: space-between;
`

export const TechtreeThumbnailCard = styled.div`
  border-radius: 2px;
  //width: 20rem;
  //height: '300px';
  transition: 0.25s box-shadow ease-in, 0.25s transform ease-in;
  box-shadow: ${boxShadow.default};
  place-items: center;
  background-color: #ffffff;
  &:hover {
    ${hoverAction}
  }
  margin: 1rem;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`

export default React.memo(function ({
  nodeList,
  linkList,
  techtreeTitle,
  techtreeID,
  techtreeData,
}) {
  const containerRef = React.useRef(null)

  React.useEffect(() => {
    if (containerRef.current) {
      runForceGraph(containerRef.current, nodeList, linkList, techtreeID)
    }
  }, [])

  return (
    <TechtreeThumbnailCard>
      <Link to={`/techtree/${techtreeID}`}>
        <TechtreeThumbnailBlock ref={containerRef} className={techtreeID} />
        <TechtreeInfo>
          <div>{techtreeTitle}</div>
          <div>{techtreeData.author.displayName}</div>
        </TechtreeInfo>
      </Link>
    </TechtreeThumbnailCard>
  )
})

function runForceGraph(
  container,
  originalNodeList,
  originalLinkList,
  techtreeID
) {
  // 데이터 저장 원칙 : navbar 높이때문에 Y좌표는 보정이 필요함.
  // 하지만 보정을 가한 좌표를 저장하지 않는다. 순수한 좌표를 저장해야함.
  // 그 좌표에 대해 렌더링하는 시점에만 보정을 가한다.
  // 그래야지 navbar 높이가 변해도 문제없이 렌더링 할 수 있음.

  const nodeRadius = 15
  const linkWidth = '2.5px'
  const linkColor = '#000000'

  const width = `300`
  const height = `300`

  let nodeList = originalNodeList
  let linkList = originalLinkList

  const svg = d3
    .select(container)
    .append('svg')
    .attr('height', height)
    .attr('width', width)
    .attr('viewbox', `${width} ${height} ${width} ${height}`)

  const clientRect = container.getBoundingClientRect()
  const relativeTop = clientRect.top
  const relativeLeft = clientRect.left
  const scrolledTopLength = window.pageYOffset
  const absoluteYPosition = scrolledTopLength + relativeTop
  const absoluteXPostion = relativeLeft

  // 화살표 마커
  svg
    .append('svg:defs')
    .append('svg:marker')
    .attr('id', 'end-arrow')
    .attr('viewBox', '0 -5 10 10')
    .attr('refX', nodeRadius * 2.6)
    .attr('markerWidth', 6)
    .attr('markerHeight', nodeRadius * 1.5)
    .attr('orient', 'auto')
    .append('svg:path')
    .attr('d', 'M0,-5L10,0L0,5')
    .attr('fill', '#000')

  if (nodeList.length === 0) {
    return
  }

  const linkGroup = svg.append('g').attr('class', 'links')
  const nodeGroup = svg.append('g').attr('class', 'nodes')
  const labelGroup = svg.append('g').attr('class', 'labels')

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

  nodeGroup
    .selectAll('circle')
    .data(nodeList)
    .join('circle')
    .attr('r', (d) => d.radius)
    .style('fill', (d) => d.fillColor)
    .attr('cx', (d) => {
      return d.x
    })
    .attr('cy', (d) => {
      return d.y
    })
    .attr('class', (d) => {
      return d.id
    })

  labelGroup
    .selectAll('text')
    .data(nodeList)
    .join('text')
    .attr('x', (d) => {
      return d.x
    })
    .attr('y', (d) => {
      return d.y + nodeRadius * 4
    })
    .attr('text-anchor', 'middle')
    .attr('dominant-baseline', 'central')
    .attr('class', (d) => d.id)
    .text((d) => {
      return d.name
    })
    .style('user-select', 'none')
    .style('background-color', '#ffffff')
    .style(
      'text-shadow',
      '-3px 0 #F2F1F6, 0 3px #F2F1F6, 3px 0 #F2F1F6, 0 -3px #F2F1F6'
    )
}
