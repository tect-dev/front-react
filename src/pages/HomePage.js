import MainWrapper from '../wrappers/MainWrapper'

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
    <MainWrapper>
      <BlockWrapper>
        {windowSize.width > 1024 ? <DesktopBlocks></DesktopBlocks> : ''}
        {1024 > windowSize.width && windowSize.width > 650 ? (
          <TabletBlocks></TabletBlocks>
        ) : (
          ''
        )}
        {650 > windowSize.width ? <MobileBlocks></MobileBlocks> : ''}
      </BlockWrapper>
    </MainWrapper>
  )
}
function DesktopBlocks() {
  return (
    <>
      <Link to={`/board/test1`}>
        <WidthOneBlock>test1</WidthOneBlock>
      </Link>
      <Link to={`/board/test2`}>
        <WidthOneBlock>test2</WidthOneBlock>
      </Link>
      <WidthOneBlock>3</WidthOneBlock>
      <WidthOneBlock>4</WidthOneBlock>
      <WidthOneBlock>5</WidthOneBlock>
      <WidthOneBlock>6</WidthOneBlock>

      <WidthOneBlock>7</WidthOneBlock>
      <WidthThreeBlock>8</WidthThreeBlock>
      <WidthOneBlock>9</WidthOneBlock>
      <WidthOneBlock>10</WidthOneBlock>

      <WidthOneBlock>11</WidthOneBlock>
      <WidthOneBlock>12</WidthOneBlock>
      <WidthThreeBlock>13</WidthThreeBlock>
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
  width: 100%;
  background-color: #999999;
`
export const WidthThreeBlock = styled.div`
  grid-column-start: span 3;
  width: 100%;
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
