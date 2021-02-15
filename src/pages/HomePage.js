import { MainWrapperInTheHomePage } from '../wrappers/MainWrapper'

import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'

export default function HomePage() {
  const isClient = typeof window === 'object'
  function getSize() {
    return {
      width: isClient ? window.innerWidth : undefined,
      height: isClient ? window.innerHeight : undefined,
    }
  }
  const [windowSize, setWindowSize] = useState(getSize)

  useEffect(() => {
    if (!isClient) {
      return false
    }

    function handleResize() {
      setWindowSize(getSize())
    }
    console.log('windowSize:', windowSize)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <MainWrapperInTheHomePage>
      <BlockWrapper>
        {windowSize.width > 1024 ? <DesktopBlocks></DesktopBlocks> : ''}
        {1024 > windowSize.width && windowSize.width > 650 ? (
          <TabletBlocks></TabletBlocks>
        ) : (
          ''
        )}
        {650 > windowSize.width ? <MobileBlocks></MobileBlocks> : ''}
      </BlockWrapper>
    </MainWrapperInTheHomePage>
  )
}
function DesktopBlocks() {
  return (
    <>
      <WidthOneBlock>
        <Link to={`/board/test1`}>test1</Link>
      </WidthOneBlock>
      <WidthOneBlock>
        <Link to={`/board/test2`}>test2</Link>
      </WidthOneBlock>
      <WidthOneBlock>
        <Link to={`/board/physics`}>physics</Link>
      </WidthOneBlock>

      <WidthOneBlock>
        <Link to={`/board/mathematics`}>mathematics</Link>
      </WidthOneBlock>

      <WidthOneBlock>
        {' '}
        <Link to={`/board/comtuter science`}>comtuter science</Link>
      </WidthOneBlock>
      <WidthOneBlock>economics</WidthOneBlock>

      <WidthOneBlock>7</WidthOneBlock>
      <WidthThreeBlock>foresty와 함께</WidthThreeBlock>
      <WidthOneBlock>9</WidthOneBlock>
      <WidthOneBlock>10</WidthOneBlock>

      <WidthOneBlock>11</WidthOneBlock>
      <WidthOneBlock>12</WidthOneBlock>
      <WidthThreeBlock>지식의 나무를 심어보세요</WidthThreeBlock>
      <WidthOneBlock>14</WidthOneBlock>
      <WidthOneBlock>15</WidthOneBlock>
      <WidthOneBlock>16</WidthOneBlock>
      <WidthOneBlock>17</WidthOneBlock>
      <WidthOneBlock>18</WidthOneBlock>
      <WidthOneBlock>19</WidthOneBlock>
      <WidthOneBlock>20</WidthOneBlock>
    </>
  )
}

export const BlockWrapper = styled.div`
  display: grid;
  grid-gap: 25px;
  align-items: center; // 내부요소들 세로중앙정렬
  justify-items: center; // 가로 중앙정렬
  grid-auto-columns: minmax(125px, auto);
  grid-auto-rows: minmax(125px, auto);

  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
  @media (max-width: 1440px) {
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
  }
  @media (max-width: 1024px) {
    grid-template-columns: 1fr 1fr 1fr 1fr;
  }
  @media (max-width: 650px) {
    grid-template-columns: 1fr 1fr 1fr;
  }
`
export const WidthOneBlock = styled.div`
  grid-row-start: span 1;
  grid-column-start: span 1;

  width: 100%;
  height: 100%;
  background-color: #999999;
`
export const WidthThreeBlock = styled.div`
  grid-row-start: span 1;
  grid-column-start: span 3;

  width: 100%;
  height: 100%;
  background-color: #999999;
`

function TabletBlocks() {
  return (
    <>
      <WidthOneBlock>1</WidthOneBlock>
      <WidthOneBlock>2</WidthOneBlock>
      <WidthOneBlock>3</WidthOneBlock>
      <WidthOneBlock>4</WidthOneBlock>

      <WidthThreeBlock>5</WidthThreeBlock>
      <WidthOneBlock>6</WidthOneBlock>

      <WidthOneBlock>7</WidthOneBlock>
      <WidthThreeBlock>8</WidthThreeBlock>

      <WidthOneBlock>9</WidthOneBlock>
      <WidthOneBlock>10</WidthOneBlock>
      <WidthOneBlock>11</WidthOneBlock>
      <WidthOneBlock>12</WidthOneBlock>
      <WidthOneBlock>12</WidthOneBlock>

      <WidthOneBlock>14</WidthOneBlock>
      <WidthOneBlock>15</WidthOneBlock>
      <WidthOneBlock>16</WidthOneBlock>
      <WidthOneBlock>17</WidthOneBlock>
      <WidthOneBlock>18</WidthOneBlock>
      <WidthOneBlock>19</WidthOneBlock>
      <WidthOneBlock>20</WidthOneBlock>
    </>
  )
}

function MobileBlocks() {
  return (
    <>
      <WidthOneBlock>1</WidthOneBlock>
      <WidthOneBlock>2</WidthOneBlock>
      <WidthOneBlock>3</WidthOneBlock>

      <WidthThreeBlock>4</WidthThreeBlock>

      <WidthThreeBlock>5</WidthThreeBlock>

      <WidthOneBlock>6</WidthOneBlock>
      <WidthOneBlock>7</WidthOneBlock>
      <WidthOneBlock>8</WidthOneBlock>

      <WidthOneBlock>9</WidthOneBlock>
      <WidthOneBlock>10</WidthOneBlock>
      <WidthOneBlock>11</WidthOneBlock>
      <WidthOneBlock>12</WidthOneBlock>
      <WidthOneBlock>12</WidthOneBlock>

      <WidthOneBlock>14</WidthOneBlock>
      <WidthOneBlock>15</WidthOneBlock>
      <WidthOneBlock>16</WidthOneBlock>
      <WidthOneBlock>17</WidthOneBlock>
      <WidthOneBlock>18</WidthOneBlock>
      <WidthOneBlock>19</WidthOneBlock>
      <WidthOneBlock>20</WidthOneBlock>
    </>
  )
}
