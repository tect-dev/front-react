import React from 'react'
import * as d3 from 'd3'
import { Link } from 'react-router-dom'
import { StyledTitle } from './TitleInput'
import {
  colorPalette,
  boxShadow,
  hoverAction,
  testURL,
  fontSize,
} from '../lib/constants'
import { isoStringToNaturalLanguage } from '../lib/functions'
import styled from 'styled-components'

export default React.memo(function ({
  nodeList,
  linkList,
  techtreeTitle,
  techtreeID,
  techtreeData,
}) {
  return (
    <TechtreeThumbnailCard>
      <Link to={`/tree/${techtreeID}`}>
        <TechtreeThumbnailBlock>
          <TechtreeThumbnailImage
            src={techtreeData.thumbnail}
            alt="treeThumbnail"
          />
        </TechtreeThumbnailBlock>
        <ThumbnailBottomLine />
        <TreeInfoArea>
          <TreeThumbnailHeader>
            <StyledTitle>{techtreeTitle}</StyledTitle>
            <StyledTitle
              style={{ fontSize: fontSize.xsmall, color: colorPalette.gray7 }}
            >
              {techtreeData.author[0]?.displayName}
            </StyledTitle>
          </TreeThumbnailHeader>
          <TreeThumbnailFooter>
            {isoStringToNaturalLanguage(techtreeData.createdAt).substr(0, 12)}
          </TreeThumbnailFooter>
        </TreeInfoArea>
      </Link>
    </TechtreeThumbnailCard>
  )
})

export const TechtreeThumbnailBlock = styled.div`
  padding: 5px;
`
export const ThumbnailBottomLine = styled.div`
  width: 90%;
  height: 0.5px;
  margin-left: 5px;
  margin-bottom: 5px;
  background: ${colorPalette.gray3};
  border-radius: 1px;
`

export const TechtreeThumbnailImage = styled.img`
  width: 250px;
  height: 250px;
  //height: 250px;
  object-fit: fill;
  border-radius: 3px;
`

export const TreeInfoArea = styled.div`
  padding-left: 1rem;
  padding-right: 1rem;
  padding-bottom: 1rem;
`

export const TreeThumbnailHeader = styled.div`
  padding-top: 1rem;
  padding-bottom: 1rem;
`

export const TreeThumbnailFooter = styled.div`
  text-align: center;
  font-size: ${fontSize.xsmall};
  color: ${colorPalette.gray7};
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
  border-radius: 3px;
  grid-row-start: span 1;
  grid-column-start: span 1;
  display: grid;
  width: 100%;
  height: 375px;
  justify-items: center;
  justify-content: center;
  border: 1px solid ${colorPalette.gray3};
  //align-items: center;
  //width: 290px;
  //height: '300px';
  transition: 0.25s box-shadow ease-in, 0.25s transform ease-in;
  box-shadow: ${boxShadow.default};
  // place-items: center;

  background-color: #ffffff;

  &:hover {
    ${hoverAction}
  }
  //margin: 1rem;
  //overflow: hidden;
  //  display: flex;
  // flex-direction: column;
`

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
  const linkColor = colorPalette.gray5

  const width = `300`
  const height = `300`

  let nodeList = originalNodeList
  let linkList = originalLinkList

  const svg = d3
    .select(container)
    .append('svg')
    .attr('height', height)
    .attr('width', width)
    .attr('id', 'techtreeContainer')
    .attr('viewBox', `${width}/3 ${height}/3 ${width} ${height}`)

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
    .attr('fill', linkColor)

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
