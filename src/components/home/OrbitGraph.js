import React from 'react'
import * as d3 from 'd3'
import styles from '../../styles/Techtree.module.css'
import techTreeStyles from '../../styles/Techtree.module.css'
import constellationStyles from '../../styles/techtree/Constellation.module.css'

import { line } from 'd3'

export default function ForceGraph({ techtreeData, category }) {
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
  }, [])

  return (
    <>
      <div class={constellationStyles.stars}></div>
      <div class={constellationStyles.twinkling}></div>
      <div className={techTreeStyles.container}>
        <div ref={containerRef} className={techTreeStyles.constellation}></div>
      </div>
    </>
  )
}

function runForceGraph(container, techtreeData, category, nodeHoverTooltip) {
  // linksData 대신, 객체 전체를 받아야지 이게 어느 과목인지도 확인할 수 있음.

  const orbitRadius1 = 0
  const orbitRadius2 = 150
  const orbitRadius3 = 250
  const orbitRadius4 = 350

  let globalTimer = 0

  const height = 900 //containerRect.height;
  const width = 900 //containerRect.width;

  let xScale = d3.scaleLinear().domain([0, width]).range([0, width])
  let yScale = d3.scaleLinear().domain([0, height]).range([0, height])

  const nodeRadius = 20

  const links = techtreeData.links.map((d) => Object.assign({}, d))

  function selectRank(rank, techtreeData, orbitRadius) {
    const selectedArray = []
    techtreeData.nodes.map((d) => {
      if (d.group === rank) {
        selectedArray.push({
          ...d,
          r: nodeRadius,
          R: orbitRadius * (1 + 0.2 * (Math.random() - Math.random())),
          phi0: Math.ceil(Math.random() * 360),
          speed: Math.random() * 0.8 * 0.001 + 0.0005,
        })
      }
    })

    return selectedArray
  }

  const rank1Array = selectRank(1, techtreeData, orbitRadius1)
  const rank2Array = selectRank(2, techtreeData, orbitRadius2)
  const rank3Array = selectRank(3, techtreeData, orbitRadius3)
  const rank4Array = selectRank(4, techtreeData, orbitRadius4)

  const nodes = [...rank1Array, ...rank2Array, ...rank3Array, ...rank4Array]

  const svg = d3
    .select(container)
    .append('svg')
    .attr('viewBox', [-width / 2, -height / 2, width, height])
  //svg.style('background', `url("${process.env.PUBLIC_URL}/images/space.png") no-repeat`)

  const orbitColor = '#FFCC01' // '#FFFF56'

  function randomColor() {
    const planetColorSet = ['#D4CDC5'] //, '#99CC31', '#027FFF', '#FF7701']
    return planetColorSet[Math.floor(Math.random() * planetColorSet.length - 0.00001)]
  }

  svg
    .append('defs')
    .append('marker')
    .attr('id', 'arrowhead')
    .attr('viewBox', '-0 -5 10 10') //the bound of the SVG viewport for the current SVG fragment. defines a coordinate system 10 wide and 10 high starting on (0,-5)
    .attr('refX', 23) // x coordinate for the reference point of the marker. If circle is bigger, this need to be bigger.
    .attr('refY', 0)
    .attr('orient', 'auto')
    .attr('markerWidth', 10)
    .attr('markerHeight', 10)
    .attr('xoverflow', 'visible')
    .append('svg:path')
    .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
    .attr('fill', orbitColor)
    .style('stroke', 'none')
    .attr('stroke-width', 1)
    .attr('id', 'vis')

  // dom 요소들 선언

  //const orbit = svg.append('g').attr('class', 'orbit') //.style('opacity', '0')
  //orbit.append('circle').attr('r', orbitRadius2).attr('fill', 'none').attr('stroke', orbitColor)
  //orbit.append('circle').attr('r', orbitRadius3).attr('fill', 'none').attr('stroke', orbitColor)
  //orbit.append('circle').attr('r', orbitRadius4).attr('fill', 'none').attr('stroke', orbitColor)

  const link = svg
    .append('g')
    .selectAll('line')
    .data(links)
    .join('line')
    .attr('class', (d, index) => {
      return `link${index}`
    })
    .attr('stroke', orbitColor)
    .attr('stroke-opacity', 0.6)
    .attr('stroke-width', 2)
    .attr('marker-end', 'url(#arrowhead)')
    .style('opacity', '0')
  const trail = svg
    .append('g')
    .attr('class', 'trail')
    .selectAll('path')
    .data(nodes)
    .join('path')
    .attr('class', (d) => {
      return `trail${d.id}`
    })
    .style('fill', (d) => {
      return 'none'
    })
    .style('stroke', (d) => {
      return randomColor()
    })
    .style('stroke-width', (d) => {
      return '2'
    })
    .style('opacity', '0.8')
  const node = svg
    .append('g')
    //.attr('stroke-width', 2)
    .selectAll('circle')
    .data(nodes)
    .join('circle')

  node
    .attr('r', (d) => {
      return d.r
    })
    .attr('cx', (d) => {
      return d.R
    })
    .attr('cy', (d) => {
      return 0
    })
    .attr('class', (d) => {
      return `node${d.id}`
    })
    .attr('fill', (d) => {
      switch (d.group) {
        case 1:
          return orbitColor
        case 2:
          return randomColor()
        case 3:
          return randomColor()
        case 4:
          return randomColor()
        default:
          return '#356EC3'
      }
    })
  //.attr('stroke', '#fff')

  node
    .on('mouseover', (d) => {
      clearInterval(timeFlies)
      addTooltip(nodeHoverTooltip, d, d3.event.pageX, d3.event.pageY)
      fadeExceptSelected(d)
      node.style('cursor', 'pointer')
    })
    .on('mouseout', (d) => {
      timeFlies = setInterval(() => {
        objectPositionUpdate()
        globalTimer = globalTimer + 40
      }, 40)
      tooltip.style('opacity', 0)
      node.style('opacity', '1')
      //orbit.style('opacity', '1')
      link.style('opacity', '0')
      trail.style('opacity', '1')
    })

  // 이벤트 관련 함수들
  const tooltip = d3.select(container).append('div')

  const addTooltip = (hoverTooltip, node, x, y) => {
    tooltip
      .html(hoverTooltip(node))
      .attr('class', 'tooltip')
      .style('left', `${x - 40}px`)
      .style('top', `${y - 120}px`)
      .style('opacity', '0.85')
  }

  function fadeExceptSelected(selectedNode) {
    node.style('opacity', '0.2')
    //orbit.style('opacity', '0.2')
    trail.style('opacity', '0.2')

    links.map((linkElement, index) => {
      if (linkElement.source === selectedNode.id) {
        svg.select(`circle.node${selectedNode.id}`).style('opacity', '1')
        svg.select(`circle.node${linkElement.target}`).style('opacity', '1')

        svg.select(`line.link${index}`).style('opacity', '1')
      } else if (linkElement.target === selectedNode.id) {
        svg.select(`circle.node${selectedNode.id}`).style('opacity', '1')
        svg.select(`circle.node${linkElement.source}`).style('opacity', '1')

        svg.select(`line.link${index}`).style('opacity', '1')
      } else {
        svg.select(`circle.node${selectedNode.id}`).style('opacity', '1')
      }
    })
  }

  function calculateTrailEnd(trailStartX, trailStartY, objSpeed) {
    const radius = Math.sqrt(trailStartX * trailStartX + trailStartY * trailStartY)
    if (!radius) {
      return [0, 0]
    }
    if (trailStartY >= 0) {
      const rootAngle = Math.acos(trailStartX / radius)

      const finalAngle = rootAngle - 0.5 * Math.abs(objSpeed) * 1000
      const trailEndX = radius * Math.cos(finalAngle)
      const trailEndY = radius * Math.sin(finalAngle)
      console.log('rootAngle: ', rootAngle)

      return [trailEndX, trailEndY]
    } else {
      // 음의 각도일때.

      const rootAngle = 2 * Math.PI - Math.acos(trailStartX / radius)

      const finalAngle = rootAngle - 0.5 * Math.abs(objSpeed) * 1000
      const trailEndX = radius * Math.cos(finalAngle)
      const trailEndY = radius * Math.sin(finalAngle)
      console.log('rootAngle: ', rootAngle)

      return [trailEndX, trailEndY]
    }
  }

  function objectPositionUpdate() {
    node
      .attr('cx', (d) => d.R * Math.cos(d.phi0 + globalTimer * d.speed))
      .attr('cy', (d) => d.R * Math.sin(d.phi0 + globalTimer * d.speed))

    trail.attr('d', (d) => {
      const trailStartX = container.querySelector(`circle.node${d.id}`).getAttribute('cx')
      const trailStartY = container.querySelector(`circle.node${d.id}`).getAttribute('cy')
      const objSpeed = d.speed
      const trailEndPosition = calculateTrailEnd(trailStartX, trailStartY, objSpeed) // return [endX, endY]
      const deltaX = trailEndPosition[0] - trailStartX
      const deltaY = trailEndPosition[1] - trailStartY
      return `M ${trailStartX} ${trailStartY} A ${d.R} ${d.R} 0 0 0 ${trailEndPosition[0]} ${trailEndPosition[1]}`
    })

    link
      .attr('x1', (d) => {
        return container.querySelector(`circle.node${d.source}`).getAttribute('cx')
      })
      .attr('y1', (d) => {
        return container.querySelector(`circle.node${d.source}`).getAttribute('cy')
      })
      .attr('x2', (d) => {
        return container.querySelector(`circle.node${d.target}`).getAttribute('cx')
      })
      .attr('y2', (d) => {
        return container.querySelector(`circle.node${d.target}`).getAttribute('cy')
      })
  }

  let timeFlies = setInterval(() => {
    objectPositionUpdate()
    globalTimer = globalTimer + 40
  }, 40)

  return {
    destroy: () => {
      //simulation.stop();
    },
    nodes: () => {
      return svg.node()
    },
  }
}
