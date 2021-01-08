import React from 'react'
import * as d3 from 'd3'
import techTreeStyles from '../../styles/Techtree.module.css'
import constellationStyles from '../../styles/techtree/Constellation.module.css'

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
      <div ref={containerRef} className={techTreeStyles.container}></div>
    </>
  )
}

function runForceGraph(container, techtreeData, category, nodeHoverTooltip) {
  // linksData 대신, 객체 전체를 받아야지 이게 어느 과목인지도 확인할 수 있음.

  //const containerRect = container.getBoundingClientRect();
  const height = 900 //containerRect.height;
  const width = 900 //containerRect.width;

  let xScale = d3.scaleLinear().domain([0, width]).range([0, width])
  let yScale = d3.scaleLinear().domain([0, height]).range([0, height])

  const nodeRadius = 30

  const links = techtreeData.links.map((d) => Object.assign({}, d))

  function selectRank(rank, techtreeData, width, height) {
    const selectedArray = []
    techtreeData.nodes.map((d) => {
      if (d.group === rank) {
        selectedArray.push({ ...d })
      }
    })

    const stepArea = (width / selectedArray.length) * 0.5

    return selectedArray.map((d, index) => {
      return {
        ...d,
        x: -0.5 * width + (2 * index + 1) * stepArea + (Math.random() - Math.random()) * 10,
        y: (-0.5 + (2 * rank - 1) / 8) * height + (Math.random() - Math.random()) * 10,
        r: nodeRadius,
      }
    })
  }

  const rank1Array = selectRank(1, techtreeData, width, height)
  const rank2Array = selectRank(2, techtreeData, width, height)
  const rank3Array = selectRank(3, techtreeData, width, height)
  const rank4Array = selectRank(4, techtreeData, width, height)

  const nodes = [...rank1Array, ...rank2Array, ...rank3Array, ...rank4Array]

  const svg = d3
    .select(container)
    .append('svg')
    .attr('viewBox', [-width / 2, -height / 2, width, height])

  svg.style('background', `url("${process.env.PUBLIC_URL}/images/night.jpeg") no-repeat`)

  const orbitColor = '#FFCC01' //'#FFFF56' //

  //const planetColorSet = ['#D4CDC5', '#99CC31', '#027FFF', '#FF7701', '#00bebe']
  function randomColor() {
    const planetColorSet = [
      '#027FFF',
      '#00bebe',
      '#66b7ce',
      'rgb(0, 170, 170)',
      'rgb(0, 140, 190)',
      'rgb(0, 190, 170)',
    ]
    return planetColorSet[Math.floor(Math.random() * planetColorSet.length - 0.00001)]
  }
  function getRandomTwinkleColor() {
    const twinkleColorSet = ['#a6b8ff', '#f4ccbf', '#66b7ce', '#aaccff', '#ffc8ee', '#a4aaff']
    return twinkleColorSet[Math.floor(Math.random() * twinkleColorSet.length - 0.00001)]
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
    .attr('fill', randomColor())
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
    .attr('stroke', randomColor())
    .attr('stroke-opacity', 0.6)
    .attr('stroke-width', 2)
    .attr('marker-end', 'url(#arrowhead)')

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
      return d.x
    })
    .attr('cy', (d) => {
      return d.y
    })
    .attr('class', (d) => {
      return `node${d.id} ${constellationStyles.star} twinkleStar1`
    })
    .style('cursor', 'pointer')
    .transition()
    .duration(20000)
    .delay(20000)
  //.style('fill', '#a6b8ff')
  //.style('-webkit-animation', 'twinkle 0.5s alternate infinite')
  //.style('animation', 'twinkle 0.5s alternate infinite')
  //.style('-webkit-animation-delay', '1.61404s')
  //.style('animation-delay', '1.61404s')

  const label = svg
    .append('g')
    .attr('class', 'labels')
    .selectAll('text')
    .data(nodes)
    .enter()
    .append('text')
    .attr('text-anchor', 'middle')
    .attr('dominant-baseline', 'central')
    .attr('class', (d) => {
      return `label${d.id}`
    })
    .text((d) => {
      return d.label
    })
    .style('font-weight', 'bold')
    .style('fill', '#fff')
    .style('cursor', 'pointer')

  const drag = () => {
    const dragstarted = (d) => {
      d.fx = d.x
      d.fy = d.y
    }

    const dragged = (d) => {
      d.fx = d3.event.x
      d.fy = d3.event.y
    }

    const dragended = (d) => {
      d.fx = null
      d.fy = null
    }

    return d3.drag().on('start', dragstarted).on('drag', dragged).on('end', dragended)
  }

  node
    .on('mouseover', (d) => {
      addTooltip(nodeHoverTooltip, d, d3.event.pageX, d3.event.pageY)
      fadeExceptSelected(d)
    })
    .on('mouseout', (d) => {
      recoverOpacity()
    })
  //.call(drag())

  label
    .on('mouseover', (d) => {
      addTooltip(nodeHoverTooltip, d, d3.event.pageX, d3.event.pageY)
      fadeExceptSelected(d)
    })
    .on('mouseout', (d) => {
      recoverOpacity()
    })

  const tooltip = d3.select(container).append('div')

  const addTooltip = (hoverTooltip, node, x, y) => {
    tooltip
      .html(hoverTooltip(node))
      .attr('class', 'tooltip')
      .style('left', `${x - 40}px`)
      .style('top', `${y - 120}px`)
      .style('opacity', '0.85')
  }

  function recoverOpacity() {
    tooltip.style('opacity', 0)
    node.style('opacity', '1')
    link.style('opacity', '1')
    label.style('opacity', '1')
  }

  function fadeExceptSelected(selectedNode) {
    node.style('opacity', '0.1')
    link.style('opacity', '0.1')
    label.style('opacity', '0.1')

    links.map((linkElement, index) => {
      if (linkElement.source === selectedNode.id) {
        svg.select(`circle.node${selectedNode.id}`).style('opacity', '1')
        svg.select(`circle.node${linkElement.target}`).style('opacity', '1')

        svg.select(`text.label${selectedNode.id}`).style('opacity', '1')
        svg.select(`text.label${linkElement.target}`).style('opacity', '1')

        svg.select(`line.link${index}`).style('opacity', '1')
      } else if (linkElement.target === selectedNode.id) {
        svg.select(`circle.node${selectedNode.id}`).style('opacity', '1')
        svg.select(`circle.node${linkElement.source}`).style('opacity', '1')
        svg.select(`text.label${selectedNode.id}`).style('opacity', '1')
        svg.select(`text.label${linkElement.source}`).style('opacity', '1')

        svg.select(`line.link${index}`).style('opacity', '1')
      } else {
        svg.select(`circle.node${selectedNode.id}`).style('opacity', '1')
        svg.select(`text.label${selectedNode.id}`).style('opacity', '1')
      }
    })
  }

  function objectPositionUpdate() {
    label.attr('x', (d) => d.x).attr('y', (d) => d.y)
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
  objectPositionUpdate()

  return {
    destroy: () => {
      //simulation.stop();
    },
    nodes: () => {
      return svg.node()
    },
  }
}