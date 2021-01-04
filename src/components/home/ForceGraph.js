import React from 'react';
import * as d3 from 'd3';
import styles from '../../styles/Techtree.module.css';

export default function ForceGraph({ techtreeData, category }) {
  const containerRef = React.useRef(null);

  const nodeHoverTooltip = (node) => {
    return `<div>     
      <p><b>${node.name}</b></p>
      <p>최근 5년<br />마일리지 커트라인<br />${node.recentMileage}</p>
    </div>`;
  };

  React.useEffect(() => {
    let destroyFn;

    if (containerRef.current) {
      const { destroy } = runForceGraph(
        containerRef.current,
        techtreeData,
        category,
        nodeHoverTooltip
      );
      destroyFn = destroy;
    }

    return destroyFn;
  }, []);

  return <div ref={containerRef} className={styles.container} />;
}

function runForceGraph(container, techtreeData, category, nodeHoverTooltip) {
  // linksData 대신, 객체 전체를 받아야지 이게 어느 과목인지도 확인할 수 있음.
  const links = techtreeData.links.map((d) => Object.assign({}, d));
  const nodes = techtreeData.nodes.map((d) => Object.assign({}, d));

  const containerRect = container.getBoundingClientRect();
  const height = 1000; //containerRect.height;
  const width = 900; //containerRect.width;

  let xScale = d3.scaleLinear().domain([0, width]).range([0, width]);
  let yScale = d3.scaleLinear().domain([0, height]).range([0, height]);

  //const circleColor = () => { return "#fff"; };
  //const circleFill = "#fff"
  const circleSelctedFill = '#00bebe';
  // 학년별로 색깔을 달리하면, 애초에 테크트리를 제시하는 의미가 없잖아.
  // 내가 3학년인데 고체물리 들어도 되나? 이런걸 보고싶은건데.
  function getRandom00BEBE() {
    const colorSet1 = ['#66b7ce', '#6771dc', '#a367db', '#db67ce', '#00bebe'];
    const colorSet2 = [
      '#66b7ce',
      '#00bebe',
      'rgb(0, 170, 170)',
      'rgb(0, 140, 190)',
      'rgb(0, 190, 170)',
    ];
    const randomFactor = Math.floor(Math.random() * 5 - 0.001);
    return colorSet2[randomFactor];
    //return linear-gradient(135deg, orange 60%, cyan)
    //return rgb(randomFactor, 165+randomFactor, 165+randomFactor)
  }
  const circleStrokeColor1 = getRandom00BEBE(); //"#94D7FF"
  const circleStrokeColor2 = getRandom00BEBE(); //"#5DE87C"
  const circleStrokeColor3 = getRandom00BEBE(); //"#FFF872"
  const circleStrokeColor4 = getRandom00BEBE(); //"#FF669A"

  const drag = (simulation) => {
    const dragstarted = (d) => {
      if (!d3.event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    };

    const dragged = (d) => {
      d.fx = d3.event.x;
      d.fy = d3.event.y;
    };

    const dragended = (d) => {
      if (!d3.event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    };

    return d3
      .drag()
      .on('start', dragstarted)
      .on('drag', dragged)
      .on('end', dragended);
  };

  const simulation = d3
    .forceSimulation(nodes)
    .force(
      'link',
      d3.forceLink(links).id((d) => d.id)
    )
    .force('charge', d3.forceManyBody().strength(-1050))
    .force('link', d3.forceLink(links).distance(200))
    .force('x', d3.forceX())
    .force('y', d3.forceY());

  var zoom = d3.zoom().scaleExtent([0.3, 8]).on('zoom', zoomed);

  const svg = d3
    .select(container)
    .call(zoom)
    .append('svg')
    .attr('viewBox', [-width / 2, -height / 3, width, height * 0.75]);

  var x2 = xScale.copy(); // reference.
  var y2 = yScale.copy();

  function zoomed() {
    xScale = d3.event.transform.rescaleX(x2);
    yScale = d3.event.transform.rescaleY(y2);
    tick();
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
    .attr('id', 'vis');

  const link = svg
    .append('g')
    .attr('stroke', '#999')
    .attr('stroke-opacity', 0.6)
    .selectAll('line')
    .data(links)
    .join('line')
    .attr('class', (d) => {
      return `link${d.index}`;
    })
    .attr('stroke-width', 2)
    .attr('marker-end', 'url(#arrowhead)');

  const node = svg
    .append('g')
    .attr('stroke-width', 2)
    .selectAll('circle')
    .data(nodes)
    .join('circle')
    //.attr('class',(d)=>{return `${d.name}`})
    .attr('class', (d) => {
      return `node${d.index}`;
    })
    .attr('r', 30)
    .style('fill', function (d) {
      return getRandom00BEBE();
    })
    .style('stroke', '#fff')
    .call(drag(simulation));

  function matchColorForGroup(d) {
    switch (d.group) {
      case 1:
        return circleStrokeColor1;
      case 2:
        return circleStrokeColor2;
      case 3:
        return circleStrokeColor3;
      case 4:
        return circleStrokeColor4;
      default:
        return '#00bebe';
    }
  }

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
      return d.index;
    })
    //.attr("class", )
    .text((d) => {
      return d.label;
    })
    .style('font-weight', 'bold')
    .style('fill', '#fff')
    .call(drag(simulation));

  // Add the tooltip element to the graph
  const tooltip = d3.select(container).append('div');

  const addTooltip = (hoverTooltip, node, x, y) => {
    //  tooltip // tooltip is just div. how add transition?
    //  .transition()
    //    .duration(200)
    tooltip
      .html(hoverTooltip(node))
      .attr('class', 'tooltip')
      .style('left', `${x + 40}px`)
      .style('top', `${y - 120}px`)
      .style('opacity', 0.99);
  };

  const removeTooltip = () => {
    tooltip
      //  .transition()
      //  .duration(200)
      .style('opacity', 0);
  };

  node
    .on('mouseover', (d) => {
      addTooltip(nodeHoverTooltip, d, d3.event.pageX, d3.event.pageY);
      fadeExceptSelected(d);
      node.style('cursor', 'pointer');
    })
    .on('mouseout', (d) => {
      removeTooltip();
      node.style('opacity', '1');
      link.style('opacity', '1');
      //  container.querySelectorAll('circle').forEach((element)=>{
      //  element.style.fill=matchColorForGroup(element)
      //  })
    })
    .on('click', () => {
      window.location.href = `/subjects/${category}`;
    });

  label
    .on('mouseover', (d) => {
      addTooltip(nodeHoverTooltip, d, d3.event.pageX, d3.event.pageY);
      fadeExceptSelected(d);
      label.style('cursor', 'pointer');
    })
    .on('mouseout', () => {
      removeTooltip();
      node.style('opacity', '1');
      link.style('opacity', '1');
    })
    .on('click', () => {
      window.location.href = `/subjects/${category}`;
    });

  function fadeExceptSelected(selectedNode) {
    node.style('opacity', '0.2');
    link.style('opacity', '0.1');
    //const displayedNodes = []
    //const displayedLinks = []

    links.map((linkElement) => {
      // linkElement 에 source, target은 node 객체 값이 들어가있음.
      if (linkElement.source.id === selectedNode.id) {
        //selectedNode.style("opacity" ,"0.1")
        container.querySelector(
          `circle.node${linkElement.target.id}`
        ).style.opacity = '1';
        container.querySelector(`circle.node${selectedNode.id}`).style.opacity =
          '1';
        container.querySelector(`line.link${linkElement.index}`).style.opacity =
          '1';
        //displayedLinks.push(linkElement)
        //displayedNodes.push(nodes[linkElement.target.id])
        //console.log("to: ",nodes[linkElement.target.id])
      } else if (linkElement.target.id === selectedNode.id) {
        container.querySelector(
          `circle.node${linkElement.source.id}`
        ).style.opacity = '1';
        container.querySelector(`circle.node${selectedNode.id}`).style.opacity =
          '1';
        container.querySelector(`line.link${linkElement.index}`).style.opacity =
          '1';
        //displayedLinks.push(linkElement)
        //displayedNodes.push(nodes[linkElement.source.id])
        //console.log("from: ",nodes[linkElement.source.id])
      } else {
        container.querySelector(`circle.node${selectedNode.id}`).style.opacity =
          '1';
      }
      //console.log(displayedNodes)
      //displayedNodes.map((element)=>{
      //container.querySelector(`circle.${node.name}`).style.opacity="0.1"
      //node.select(element).style('opacity',"1")
      //})

      // 전부다 투명하게 만들고 나머지 투명도를 복귀하는건 안됨.
      // 자신이 보여줄것 제외하고 그외 나머지를 투명하게 하는식으로 해야지
      // dom 트리상의 문제가 없음.
      //node.select(`circle.${selectedNode.name}`).style('opacity',1)
    });
  }

  function tick() {
    //update link positions
    link
      .attr('x1', function (d) {
        return xScale(d.source.x);
      })
      .attr('y1', function (d) {
        return yScale(d.source.y);
      })
      .attr('x2', function (d) {
        return xScale(d.target.x);
      })
      .attr('y2', function (d) {
        return yScale(d.target.y);
      });

    // update node positions
    node.attr('cx', (d) => xScale(d.x)).attr('cy', (d) => yScale(d.y));

    // update label positions
    label.attr('x', (d) => xScale(d.x)).attr('y', (d) => yScale(d.y));
  }

  simulation.on('tick', tick);

  return {
    destroy: () => {
      simulation.stop();
    },
    nodes: () => {
      return svg.node();
    },
  };
}
