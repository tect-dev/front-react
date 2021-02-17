import MainWrapperDefault, {
  MainWrapperInTheHomePage,
} from '../wrappers/MainWrapper'

import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setUserPlace } from '../redux/auth'
import { boxShadow, colorPalette, hoverAction } from '../lib/constants'
import { shuffleArray, getRandomNumberInArray } from '../lib/functions'

const colorSet = [colorPalette.teal1, colorPalette.green1, colorPalette.lime1]

const nameSet = shuffleArray([
  '자연대',
  '공대',
  '문과대',
  '상경대',
  '경영대',
  '생명대',
  '신과대',
  '사과대',
  '생과대',
  '간호대',
  '의대',
  '치대',
  '언더우드',
  '음대',
])

export default function HomePage() {
  const dispatch = useDispatch()
  const isClient = typeof window === 'object'
  function getSize() {
    return {
      width: isClient ? window.innerWidth : undefined,
      height: isClient ? window.innerHeight : undefined,
    }
  }
  const [windowSize, setWindowSize] = useState(getSize)

  useEffect(() => {
    dispatch(setUserPlace('main'))
    if (!isClient) {
      return false
    }

    function handleResize() {
      setWindowSize(getSize())
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <MainWrapperDefault>
      <BlockWrapper>
        {windowSize.width > 1024 ? <DesktopBlocks></DesktopBlocks> : ''}
        {1024 > windowSize.width && windowSize.width > 650 ? (
          <TabletBlocks></TabletBlocks>
        ) : (
          ''
        )}
        {650 > windowSize.width ? <MobileBlocks></MobileBlocks> : ''}
      </BlockWrapper>
    </MainWrapperDefault>
  )
}

function OneBlock({ color, name }) {
  return (
    <WidthOneBlock style={{ backgroundColor: color }}>
      <Link
        to={`/board/${name}`}
        style={{
          width: '100%',
          height: '100%',
          display: 'grid',
          alignItems: 'center',
        }}
      >
        {name}
      </Link>
    </WidthOneBlock>
  )
}

function ThreeBlock({ color, name }) {
  return (
    <WidthThreeBlock style={{ backgroundColor: color }}>
      <Link
        to={`/forest`}
        style={{
          width: '100%',
          height: '100%',
          display: 'grid',
          alignItems: 'center',
        }}
      >
        {name}
      </Link>
    </WidthThreeBlock>
  )
}

function DesktopBlocks() {
  return (
    <>
      <OneBlock
        color={colorSet[getRandomNumberInArray(colorSet.length)]}
        name={nameSet[0]}
      ></OneBlock>
      <OneBlock
        color={colorSet[getRandomNumberInArray(colorSet.length)]}
        name={nameSet[1]}
      ></OneBlock>
      <OneBlock
        color={colorSet[getRandomNumberInArray(colorSet.length)]}
        name={nameSet[2]}
      ></OneBlock>
      <OneBlock
        color={colorSet[getRandomNumberInArray(colorSet.length)]}
        name={nameSet[3]}
      ></OneBlock>
      <OneBlock
        color={colorSet[getRandomNumberInArray(colorSet.length)]}
        name={nameSet[4]}
      ></OneBlock>
      <OneBlock
        color={colorSet[getRandomNumberInArray(colorSet.length)]}
        name={nameSet[5]}
      ></OneBlock>
      <OneBlock
        color={colorSet[getRandomNumberInArray(colorSet.length)]}
        name={nameSet[6]}
      ></OneBlock>
      <ThreeBlock color={'none'} name={'foresty와 함께'}></ThreeBlock>
      <OneBlock
        color={colorSet[getRandomNumberInArray(colorSet.length)]}
        name={nameSet[7]}
      ></OneBlock>
      <OneBlock
        color={colorSet[getRandomNumberInArray(colorSet.length)]}
        name={nameSet[8]}
      ></OneBlock>

      <OneBlock
        color={colorSet[getRandomNumberInArray(colorSet.length)]}
        name={nameSet[9]}
      ></OneBlock>
      <OneBlock
        color={colorSet[getRandomNumberInArray(colorSet.length)]}
        name={nameSet[10]}
      ></OneBlock>
      <ThreeBlock color={'none'} name={'지식의 숲을 가꿔보세요'}></ThreeBlock>
      <OneBlock
        color={colorSet[getRandomNumberInArray(colorSet.length)]}
        name={nameSet[11]}
      ></OneBlock>
      <OneBlock
        color={colorSet[getRandomNumberInArray(colorSet.length)]}
        name={nameSet[12]}
      ></OneBlock>
      <OneBlock
        color={colorSet[getRandomNumberInArray(colorSet.length)]}
        name={nameSet[13]}
      ></OneBlock>
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
  border-radius: 11px;
  text-align: center;
  display: grid;
  align-items: center;
  width: 100%;
  height: 100%;
  box-shadow: ${boxShadow.default};
  &:hover {
    ${hoverAction}
  }
  //background-color: #999999;
`
export const WidthThreeBlock = styled.div`
  grid-row-start: span 1;
  grid-column-start: span 3;
  text-align: center;
  display: grid;
  align-items: center;
  width: 100%;
  height: 100%;
  box-shadow: ${boxShadow.default};
  &:hover {
    ${hoverAction}
  }
  //background-color: #ffffff;
`

function TabletBlocks() {
  return (
    <>
      <OneBlock
        color={colorSet[getRandomNumberInArray(colorSet.length)]}
        name={nameSet[0]}
      ></OneBlock>
      <OneBlock
        color={colorSet[getRandomNumberInArray(colorSet.length)]}
        name={nameSet[1]}
      ></OneBlock>
      <OneBlock
        color={colorSet[getRandomNumberInArray(colorSet.length)]}
        name={nameSet[2]}
      ></OneBlock>
      <OneBlock
        color={colorSet[getRandomNumberInArray(colorSet.length)]}
        name={nameSet[3]}
      ></OneBlock>

      <ThreeBlock color={'none'} name={'foresty와 함께'}></ThreeBlock>
      <OneBlock
        color={colorSet[getRandomNumberInArray(colorSet.length)]}
        name={nameSet[4]}
      ></OneBlock>

      <OneBlock
        color={colorSet[getRandomNumberInArray(colorSet.length)]}
        name={nameSet[5]}
      ></OneBlock>
      <ThreeBlock color={'none'} name={'지식의 숲을 가꿔보세요'}></ThreeBlock>

      <OneBlock
        color={colorSet[getRandomNumberInArray(colorSet.length)]}
        name={nameSet[6]}
      ></OneBlock>
      <OneBlock
        color={colorSet[getRandomNumberInArray(colorSet.length)]}
        name={nameSet[7]}
      ></OneBlock>
      <OneBlock
        color={colorSet[getRandomNumberInArray(colorSet.length)]}
        name={nameSet[8]}
      ></OneBlock>
      <OneBlock
        color={colorSet[getRandomNumberInArray(colorSet.length)]}
        name={nameSet[9]}
      ></OneBlock>

      <OneBlock
        color={colorSet[getRandomNumberInArray(colorSet.length)]}
        name={nameSet[10]}
      ></OneBlock>
      <OneBlock
        color={colorSet[getRandomNumberInArray(colorSet.length)]}
        name={nameSet[11]}
      ></OneBlock>
      <OneBlock
        color={colorSet[getRandomNumberInArray(colorSet.length)]}
        name={nameSet[12]}
      ></OneBlock>
      <OneBlock
        color={colorSet[getRandomNumberInArray(colorSet.length)]}
        name={nameSet[13]}
      ></OneBlock>
    </>
  )
}

function MobileBlocks() {
  return (
    <>
      <OneBlock
        color={colorSet[getRandomNumberInArray(colorSet.length)]}
        name={nameSet[0]}
      ></OneBlock>
      <OneBlock
        color={colorSet[getRandomNumberInArray(colorSet.length)]}
        name={nameSet[1]}
      ></OneBlock>
      <OneBlock
        color={colorSet[getRandomNumberInArray(colorSet.length)]}
        name={nameSet[2]}
      ></OneBlock>

      <ThreeBlock color={'none'} name={'foresty와 함께'}></ThreeBlock>

      <ThreeBlock color={'none'} name={'지식의 숲을 가꿔보세요'}></ThreeBlock>

      <OneBlock
        color={colorSet[getRandomNumberInArray(colorSet.length)]}
        name={nameSet[3]}
      ></OneBlock>
      <OneBlock
        color={colorSet[getRandomNumberInArray(colorSet.length)]}
        name={nameSet[4]}
      ></OneBlock>
      <OneBlock
        color={colorSet[getRandomNumberInArray(colorSet.length)]}
        name={nameSet[5]}
      ></OneBlock>

      <OneBlock
        color={colorSet[getRandomNumberInArray(colorSet.length)]}
        name={nameSet[6]}
      ></OneBlock>
      <OneBlock
        color={colorSet[getRandomNumberInArray(colorSet.length)]}
        name={nameSet[7]}
      ></OneBlock>
      <OneBlock
        color={colorSet[getRandomNumberInArray(colorSet.length)]}
        name={nameSet[8]}
      ></OneBlock>

      <OneBlock
        color={colorSet[getRandomNumberInArray(colorSet.length)]}
        name={nameSet[9]}
      ></OneBlock>
      <OneBlock
        color={colorSet[getRandomNumberInArray(colorSet.length)]}
        name={nameSet[10]}
      ></OneBlock>
      <OneBlock
        color={colorSet[getRandomNumberInArray(colorSet.length)]}
        name={nameSet[11]}
      ></OneBlock>

      <OneBlock
        color={colorSet[getRandomNumberInArray(colorSet.length)]}
        name={nameSet[12]}
      ></OneBlock>
      <OneBlock
        color={colorSet[getRandomNumberInArray(colorSet.length)]}
        name={nameSet[13]}
      ></OneBlock>
    </>
  )
}
