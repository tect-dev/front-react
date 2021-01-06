import React from 'react'
import * as d3 from 'd3'
import styles from '../../styles/Techtree.module.css'
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

  return <div ref={containerRef} className={styles.container} />
}

function runForceGraph(container, techtreeData, category, nodeHoverTooltip) {
  // linksData 대신, 객체 전체를 받아야지 이게 어느 과목인지도 확인할 수 있음.

  const nodeRadius = 20
  const orbitRadius1 = 0
  const orbitRadius2 = 120
  const orbitRadius3 = 200
  const orbitRadius4 = 280
  const links = techtreeData.links.map((d) => Object.assign({}, d))
  const nodes = techtreeData.nodes.map((d) => {
    switch (d.group) {
      case 1:
        return {
          ...d,
          r: 30,
          R: 0,
          phi0: Math.ceil(Math.random() * 360),
          speed: Math.random() * 1 * 0.0001,
        }
      case 2:
        return {
          ...d,
          r: nodeRadius,
          R: orbitRadius2,
          phi0: Math.ceil(Math.random() * 360),
          speed: Math.random() * 1 * 0.0001,
        }
      case 3:
        return {
          ...d,
          r: nodeRadius,
          R: orbitRadius3,
          phi0: Math.ceil(Math.random() * 360),
          speed: Math.random() * 1 * 0.0001,
        }
      case 4:
        return {
          ...d,
          r: nodeRadius,
          R: orbitRadius4,
          phi0: Math.ceil(Math.random() * 360),
          speed: Math.random() * 1 * 0.0001,
        }
      default:
        return {
          ...d,
          r: 10,
          R: 300,
          phi0: 0, //Math.ceil(Math.random() * 360),
          speed: Math.random() * 5 * 0.0001,
        }
    }
  })

  //const containerRect = container.getBoundingClientRect();
  const height = 1000 //containerRect.height;
  const width = 900 //containerRect.width;
  let globalTimer = 0

  let xScale = d3.scaleLinear().domain([0, width]).range([0, width])
  let yScale = d3.scaleLinear().domain([0, height]).range([0, height])

  const svg = d3
    .select(container)
    .append('svg')
    .attr('viewBox', [-width / 2, -height / 3, width, height * 0.75])
    .style('background-color', 'black')

  const orbit = svg.append('g').attr('class', 'orbit')

  orbit.append('circle').attr('r', orbitRadius2).attr('fill', 'none').attr('stroke', '#FFCC01')
  orbit.append('circle').attr('r', orbitRadius3).attr('fill', 'none').attr('stroke', '#FFCC01')
  orbit.append('circle').attr('r', orbitRadius4).attr('fill', 'none').attr('stroke', '#FFCC01')

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
          return '#FFCC01'
        case 2:
          return 'rgb(150,154,50)'
        case 3:
          return 'rgb(100,100,100)'
        case 4:
          return 'rgb(53,100,154)'
        default:
          return '#356EC3'
      }
    })
    .attr('stroke', '#fff')

  node
    .on('mouseover', (d) => {
      clearInterval(timeFlies)
      addTooltip(nodeHoverTooltip, d, d3.event.pageX, d3.event.pageY)
      fadeExceptSelected(d)
      node.style('cursor', 'pointer')
    })
    .on('mouseout', (d) => {
      timeFlies = setInterval(() => {
        //const delta = Date.now() - t0

        node.attr('transform', (d) => {
          return `rotate(${d.phi0 + globalTimer * d.speed})`
        })
        node
          .attr('cx', (d) => d.R * Math.cos(d.phi0 + globalTimer * d.speed))
          .attr('cy', (d) => d.R * Math.sin(d.phi0 + globalTimer * d.speed))
        globalTimer = globalTimer + 40
      }, 40)
      tooltip.style('opacity', 0)
      node.style('opacity', '1')
      orbit.style('opacity', '1')
      link.style('opacity', '0')
    })

  const tooltip = d3.select(container).append('div')

  const addTooltip = (hoverTooltip, node, x, y) => {
    tooltip
      .html(hoverTooltip(node))
      .attr('class', 'tooltip')
      .style('left', `${x - 40}px`)
      .style('top', `${y - 120}px`)
      .style('opacity', 0.99)
  }

  function fadeExceptSelected(selectedNode) {
    node.style('opacity', '0.2')
    orbit.style('opacity', '0.5')

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
    .attr('fill', '#999')
    .style('stroke', 'none')
    .attr('stroke-width', 1)
    .attr('id', 'vis')

  const link = svg
    .append('g')
    .selectAll('line')
    .data(links)
    .join('line')
    .attr('class', (d, index) => {
      return `link${index}`
    })
    .attr('stroke', '#999')
    .attr('stroke-opacity', 0.6)
    .attr('stroke-width', 2)
    .attr('marker-end', 'url(#arrowhead)')
    .style('opacity', '0')

  let timeFlies = setInterval(() => {
    node.attr('transform', (d) => {
      return `rotate(${d.phi0 + globalTimer * d.speed})`
    })
    node
      .attr('cx', (d) => d.R * Math.cos(d.phi0 + globalTimer * d.speed))
      .attr('cy', (d) => d.R * Math.sin(d.phi0 + globalTimer * d.speed))

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
