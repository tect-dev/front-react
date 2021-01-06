import React from 'react'
import * as d3 from 'd3'
import { forceAttract } from 'd3-force-attract'
import { forceCluster } from 'd3-force-cluster'
import styles from '../../styles/Techtree.module.css'

export default function ClusteredForceGraph({ techtreeData, category }) {
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
  //const links = techtreeData.links.map((d) => Object.assign({}, d));
  const m = 4 // number of distinct clusters
  const maxRadius = 36
  const minimumRadius = 12
  let clusters = new Array(m)
  const nodes = techtreeData.nodes.map((d) => {
    const i = Math.floor(Math.random() * m) // = 0~3
    const r = Math.sqrt(((i + 1) / m) * -Math.log(Math.random())) * maxRadius + minimumRadius

    const newD = {
      ...d,
      cluster: d.group,
      radius: r,
      x: Math.cos((i / m) * 2 * Math.PI) * 200 + width / 2 + Math.random(),
      y: Math.sin((i / m) * 2 * Math.PI) * 200 + width / 2 + Math.random(),
    }
    if (!clusters[i] || r > clusters[i].radius) clusters[i] = newD
    return newD
  })

  var width = 960,
    height = 500,
    padding = 1.5, // separation between same-color nodes
    clusterPadding = 6 // separation between different-color nodes

  var n = 200 // total number of nodes

  var color = d3.scaleSequential(d3.interpolateRainbow).domain(d3.range(m))

  // The largest node for each cluster.

  //var nodes = d3.range(n).map(function () {
  //  var i = Math.floor(Math.random() * m), // = 0~3
  //    r = Math.sqrt(((i + 1) / m) * -Math.log(Math.random())) * maxRadius,
  //    d = {
  //      cluster: i,
  //      radius: r,
  //      x: Math.cos((i / m) * 2 * Math.PI) * 200 + width / 2 + Math.random(),
  //      y: Math.sin((i / m) * 2 * Math.PI) * 200 + height / 2 + Math.random(),
  //    }
  //  if (!clusters[i] || r > clusters[i].radius) clusters[i] = d
  //  return d
  //})

  var simulation = d3
    .forceSimulation()
    // keep entire simulation balanced around screen center
    .force('center', d3.forceCenter(width / 2, height / 2))

    // pull toward center
    .force(
      'attract',

      forceAttract()
        .target([width / 2, height / 2])
        .strength(0.01)
    )

    // cluster by section
    .force(
      'cluster',
      forceCluster()
        .centers(function (d) {
          return clusters[d.cluster]
        })
        .strength(0.5)
        .centerInertia(0.1)
    )

    // apply collision with padding
    .force(
      'collide',
      d3
        .forceCollide(function (d) {
          return d.radius + padding
        })
        .strength(0)
    )

    .on('tick', layoutTick)
    .nodes(nodes)

  var svg = d3.select(container).append('svg').attr('width', width).attr('height', height)

  var node = svg
    .selectAll('circle')
    .data(nodes)
    .enter()
    .append('circle')
    .style('fill', function (d) {
      return color(d.cluster / 10)
    })
    .call(d3.drag().on('start', dragstarted).on('drag', dragged).on('end', dragended))

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
      return d.id
    })
    .text((d) => {
      return d.name
    })
    .style('font-weight', 'bold')
    .style('fill', '#fff')
    .call(d3.drag().on('start', dragstarted).on('drag', dragged).on('end', dragended))

  function dragstarted(d) {
    if (!d3.event.active) simulation.alphaTarget(0.3).restart()
    d.fx = d.x
    d.fy = d.y
  }

  function dragged(d) {
    d.fx = d3.event.x
    d.fy = d3.event.y
  }

  function dragended(d) {
    if (!d3.event.active) simulation.alphaTarget(0)
    d.fx = null
    d.fy = null
  }

  // ramp up collision strength to provide smooth transition
  var transitionTime = 3000
  var t = d3.timer(function (elapsed) {
    var dt = elapsed / transitionTime
    simulation.force('collide').strength(Math.pow(dt, 2) * 0.7)
    if (dt >= 1.0) t.stop()
  })

  function layoutTick(e) {
    node
      .attr('cx', function (d) {
        return d.x
      })
      .attr('cy', function (d) {
        return d.y
      })
      .attr('r', function (d) {
        return d.radius
      })

    // update label positions
    label.attr('x', (d) => d.x).attr('y', (d) => d.y)
  }
  return {
    destroy: () => {
      //  simulation.stop();
    },
    nodes: () => {
      return svg.node()
    },
  }
}
