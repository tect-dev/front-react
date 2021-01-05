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

  //const orbitRadius1 = 0;
  //const orbitRadius2 = 80;
  //const orbitRadius3 = 160;
  //const orbitRadius4 = 240;

  const nodes = techtreeData.nodes.map((d) => {
    switch (d.group) {
      case 1:
        return {
          ...d,
          r: 10,
          R: 0,
          phi0: 0, //Math.ceil(Math.random() * 360),
          speed: Math.random() * 5,
        };
      case 2:
        return {
          ...d,
          r: 10,
          R: 80,
          phi0: 0, //Math.ceil(Math.random() * 360),
          speed: Math.random() * 5,
        };
      case 3:
        return {
          ...d,
          r: 10,
          R: 160,
          phi0: 0, //Math.ceil(Math.random() * 360),
          speed: Math.random() * 5,
        };
      case 4:
        return {
          ...d,
          r: 10,
          R: 240,
          phi0: 0, //Math.ceil(Math.random() * 360),
          speed: Math.random() * 5,
        };
      default:
        return {
          ...d,
          r: 10,
          R: 300,
          phi0: 0, //Math.ceil(Math.random() * 360),
          speed: Math.random() * 5,
        };
    }
  });

  //const containerRect = container.getBoundingClientRect();
  const height = 1000; //containerRect.height;
  const width = 900; //containerRect.width;
  const t0 = Date.now();

  let xScale = d3.scaleLinear().domain([0, width]).range([0, width]);
  let yScale = d3.scaleLinear().domain([0, height]).range([0, height]);

  const svg = d3
    .select(container)
    .append('svg')
    .attr('viewBox', [-width / 2, -height / 3, width, height * 0.75]);

  svg
    .append('circle')
    .attr('r', 80)
    .attr('fill', 'none')
    .attr('stroke', '#999');
  svg
    .append('circle')
    .attr('r', 160)
    .attr('fill', 'none')
    .attr('stroke', '#999');
  svg
    .append('circle')
    .attr('r', 240)
    .attr('fill', 'none')
    .attr('stroke', '#999');

  const node = svg
    .append('g')
    .attr('stroke-width', 2)
    .selectAll('circle')
    .data(nodes)
    .join('circle')
    .attr('r', (d) => {
      return d.r;
    })
    .attr('cx', (d) => {
      return d.R;
    })
    .attr('cy', (d) => {
      return 0;
    })
    .attr('class', (d) => {
      return d.name;
    })
    .attr('transform', (d) => {
      const delta = Date.now() - t0;
      return `rotate(${d.phi0 + delta * d.speed * 0.002})`;
    })
    .on('mouseover', (d) => {
      clearInterval(timeFlies);
    })
    .on('mouseout', (d) => {
      timeFlies = setInterval(() => {
        const delta = Date.now() - t0;
        node.attr('transform', (d) => {
          return `rotate(${d.phi0 + delta * d.speed * 0.002})`;
        });
      }, 40);
    });

  function tick() {
    // update node positions
    node.attr('cx', (d) => xScale(d.x)).attr('cy', (d) => yScale(d.y));
  }

  let timeFlies = setInterval(() => {
    const delta = Date.now() - t0;
    node.attr('transform', (d) => {
      return `rotate(${d.phi0 + delta * d.speed * 0.002})`;
    });
  }, 40);

  return {
    destroy: () => {
      //simulation.stop();
    },
    nodes: () => {
      return svg.node();
    },
  };
}
