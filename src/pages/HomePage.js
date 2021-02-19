import MainWrapperDefault from '../wrappers/MainWrapper'
import {
  TreePageHeader,
  TreeTitleArea,
  StyledDisplayName,
  TreeEditorArea,
  TreeEditButtonArea,
  DocuWrapper,
  DocuHeaderArea,
  DocuBodyArea,
  NodeButtonArea,
  PrevNodeArea,
  NextNodeArea,
  HalfWidthContainer,
  HalfWidthDocumentContainer,
  EditDocuButtonArea,
} from '../pages/techtree/TechtreeDetailPage'
import DoubleSideLayout from '../wrappers/DoubleSideLayout'
import MarkdownEditor from '../components/MarkdownEditor'
import MarkdownRenderer from '../components/MarkdownRenderer'
import { HalfWidthWrapper } from '../wrappers/HalfWidthWrapper'
import TreeMapDemo from '../components/TreeMapDemo'
import { Spinner } from '../components/Spinner'
import { DefaultButton } from '../components/Button'
import {
  TitleInput,
  TitleBottomLine,
  StyledTitle,
} from '../components/TitleInput'
import Loader from 'react-loader-spinner'
import MainIcon from '../assets/MainIcon.png'
import CountUp from 'react-countup'

import React, { useState, useEffect, useCallback } from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { setUserPlace } from '../redux/auth'
import {
  boxShadow,
  colorPalette,
  hoverAction,
  fontSize,
} from '../lib/constants'
import { shuffleArray, getRandomNumberInArray } from '../lib/functions'
import {
  selectNode,
  readTechtree,
  updateTechtree,
  deleteTechtree,
  changeTreeTitle,
  startEditDocu,
  finishEditDocu,
} from '../redux/demo'
import { editTechtree, finishTechtreeEdit } from '../redux/techtree'
import { returnPreviousNodeList, returnNextNodeList } from '../lib/functions'

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
  '교육대',
  '글로벌인재',
  '연계전공',
  '약학',
])

export default function HomePage() {
  const dispatch = useDispatch()
  const { treeSum } = useSelector((state) => {
    return { treeSum: state.techtree.treeSum }
  })
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
      <HomePageHeader>
        <div>
          <img src={MainIcon} height="101px" />
          <div>Foresty와 함께 지식의 숲을 가꿔나가요.</div>

          <div>지금까지 Foresty에 심어진 나무</div>
          <TreeSumText>
            {treeSum ? <CountUp end={treeSum} duration={2.5} /> : ''}
          </TreeSumText>
        </div>
      </HomePageHeader>
      <DemoTree />
      <HomePageSection>
        같은 전공으로 묶이는 커뮤니티를 통해 정보를 공유할 수 있어요
      </HomePageSection>
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

export const HomePageSection = styled.div`
  display: grid;
  font-size: ${fontSize.medium};
  line-height: ${fontSize.xlarge};
  text-align: center;
  text-decoration: none solid rgb(53, 53, 53);
  height: 475px;
  align-items: center;
`

export const HomePageHeader = styled(HomePageSection)``

export const TreeSumText = styled.div`
  font-size: ${fontSize.xxlarge};
  font-weight: 500;
  color: ${colorPalette.cyan6};
  line-height: 42px;
`

function DemoTree() {
  const dispatch = useDispatch()
  const {
    techtreeTitle,
    nodeList,
    linkList,
    selectedNode,
    previousNodeList,
    nextNodeList,
  } = useSelector((state) => {
    return {
      techtreeTitle: state.demo.demoTitle,
      nodeList: state.demo.demoNodeList,
      linkList: state.demo.demoLinkList,
      selectedNode: state.demo.selectedNode,
      previousNodeList: state.demo.previousNodeList,
      nextNodeList: state.demo.nextNodeList,
    }
  })

  const { isEditingTechtree, techtreeData } = useSelector((state) => {
    return {
      isEditingTechtree: state.techtree.isEditingTechtree,
      techtreeData: state.techtree.techtreeData,
    }
  })

  const [documentTitle, setDocumentTitle] = useState('')
  const [documentText, setDocumentText] = useState('')

  const [isEditingDocument, setIsEditingDocument] = useState(false)

  useEffect(() => {
    setDocumentTitle(selectedNode.name)
    setDocumentText(selectedNode.body)
  }, [selectedNode, dispatch])

  const onChangeDocumentTitle = useCallback(
    (e) => {
      e.preventDefault()
      setDocumentTitle(e.target.value)
    },
    [documentTitle]
  )

  const onChangeTechtreeTitle = useCallback((e) => {
    e.preventDefault()
    dispatch(changeTreeTitle(e.target.value))
  }, [])

  const onFinishDocuEdit = useCallback(() => {
    dispatch(
      finishEditDocu(
        selectedNode.id,
        documentTitle,
        documentText,
        nodeList,
        linkList,
        techtreeData
      )
    )
    setIsEditingDocument(false)
  }, [
    isEditingDocument,
    selectedNode,
    documentTitle,
    documentText,
    nodeList,
    linkList,
    techtreeData,
  ])

  const onClickTechtreeEdit = useCallback(() => {
    if (isEditingTechtree) {
      dispatch(finishTechtreeEdit())
    } else {
      dispatch(editTechtree())
    }
  }, [dispatch, isEditingTechtree])

  const onClickTechtreeCommit = useCallback(
    async (e) => {
      e.preventDefault()

      //dispatch(updateTechtree(nodeList, linkList, techtreeTitle))
    },
    [dispatch, nodeList, linkList, techtreeTitle]
  )

  return (
    <>
      <DoubleSideLayout>
        <HalfWidthContainer>
          <TreeTitleArea>
            <TitleInput
              value={techtreeTitle}
              placeholder="트리의 주제를 적어주세요!"
              onChange={onChangeTechtreeTitle}
              maxLength="30"
            />
          </TreeTitleArea>
          <TreeEditorArea>
            <TreeMapDemo />
          </TreeEditorArea>

          <TreeEditButtonArea>
            <DefaultButton
              onClick={() => {
                const deleteOK = window.confirm(`트리 전체가 삭제됩니다!`)
                if (deleteOK) {
                  //alert('')
                } else {
                  return
                }
              }}
            >
              트리 전체 삭제
            </DefaultButton>

            <DefaultButton onClick={onClickTechtreeEdit}>
              수정모드
            </DefaultButton>

            <DefaultButton onClick={onClickTechtreeCommit}>
              변경사항 저장
            </DefaultButton>
          </TreeEditButtonArea>
        </HalfWidthContainer>

        <HalfWidthDocumentContainer>
          <DocuWrapper id="docuWrapper">
            <DocuHeaderArea>
              <div className="docuTitle">
                {isEditingDocument ? (
                  <div>
                    <TitleInput
                      value={documentTitle}
                      onChange={onChangeDocumentTitle}
                    />
                  </div>
                ) : (
                  <StyledTitle>{selectedNode.name}</StyledTitle>
                )}
              </div>

              <EditDocuButtonArea>
                {isEditingDocument ? (
                  <DefaultButton onClick={onFinishDocuEdit}>
                    수정완료
                  </DefaultButton>
                ) : (
                  ''
                )}

                {typeof selectedNode.id !== 'undefined' &&
                !isEditingDocument ? (
                  <DefaultButton
                    onClick={() => {
                      setIsEditingDocument(true)
                    }}
                  >
                    문서 수정
                  </DefaultButton>
                ) : (
                  ''
                )}
              </EditDocuButtonArea>
            </DocuHeaderArea>
            <TitleBottomLine />
            <DocuBodyArea>
              {isEditingDocument ? (
                <MarkdownEditor
                  bindingText={documentText}
                  bindingSetter={setDocumentText}
                  width="100%"
                />
              ) : (
                <MarkdownRenderer text={selectedNode.body} />
              )}
            </DocuBodyArea>
          </DocuWrapper>
          <NodeButtonArea>
            <PrevNodeArea>
              {previousNodeList.length > 0 ? <div>이전 노드</div> : ''}
              {previousNodeList.map((node, idx) => {
                return (
                  <div key={idx}>
                    <DefaultButton
                      onClick={() => {
                        const newPreviousNodeList = returnPreviousNodeList(
                          linkList,
                          nodeList,
                          node
                        )
                        const newNextNodeList = returnNextNodeList(
                          linkList,
                          nodeList,
                          node
                        )
                        dispatch(
                          selectNode(newPreviousNodeList, newNextNodeList, node)
                        )
                        const offsetElement = document.getElementById(
                          'docuWrapper'
                        )
                        const clientRect = offsetElement.getBoundingClientRect()
                        const relativeTop = clientRect.top
                        const scrolledTopLength = window.pageYOffset
                        const absoluteYPosition =
                          scrolledTopLength + relativeTop
                        window.scrollTo(0, absoluteYPosition - 80)
                      }}
                    >
                      {node?.name}
                    </DefaultButton>
                  </div>
                )
              })}
            </PrevNodeArea>
            <NextNodeArea>
              {nextNodeList.length > 0 ? <div>다음 노드</div> : ''}
              {nextNodeList.map((node, idx) => {
                return (
                  <div key={idx}>
                    <DefaultButton
                      onClick={() => {
                        const newPreviousNodeList = returnPreviousNodeList(
                          linkList,
                          nodeList,
                          node
                        )
                        const newNextNodeList = returnNextNodeList(
                          linkList,
                          nodeList,
                          node
                        )
                        dispatch(
                          selectNode(newPreviousNodeList, newNextNodeList, node)
                        )
                        const offsetElement = document.getElementById(
                          'docuWrapper'
                        )
                        const clientRect = offsetElement.getBoundingClientRect()
                        const relativeTop = clientRect.top
                        const scrolledTopLength = window.pageYOffset
                        const absoluteYPosition =
                          scrolledTopLength + relativeTop
                        window.scrollTo(0, absoluteYPosition - 80)
                      }}
                    >
                      {node?.name}
                    </DefaultButton>
                  </div>
                )
              })}
            </NextNodeArea>
          </NodeButtonArea>
        </HalfWidthDocumentContainer>
      </DoubleSideLayout>
      <br />
    </>
  )
}

function OneBlock({ color, name }) {
  return (
    <WidthOneBlock
      style={{
        backgroundColor: color,
        color: '#ffffff',
        fontWeight: 500,
        fontSize: fontSize.xlarge,
      }}
    >
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
    <WidthThreeBlock
      style={{
        backgroundColor: color,
        color: colorPalette.gray7,
        fontSize: fontSize.xlarge,
        fontWeight: 500,
      }}
    >
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
      <OneBlock color={colorPalette.mainGreen} name={nameSet[0]}></OneBlock>
      <OneBlock color={colorPalette.mainGreen} name={nameSet[1]}></OneBlock>
      <OneBlock color={colorPalette.mainGreen} name={nameSet[2]}></OneBlock>
      <OneBlock color={colorPalette.mainGreen} name={nameSet[3]}></OneBlock>
      <OneBlock color={colorPalette.mainGreen} name={nameSet[4]}></OneBlock>
      <OneBlock color={colorPalette.mainGreen} name={nameSet[5]}></OneBlock>
      <OneBlock color={colorPalette.mainGreen} name={nameSet[6]}></OneBlock>
      <ThreeBlock
        color={colorPalette.gray0}
        name={'Foresty와 함께'}
      ></ThreeBlock>
      <OneBlock color={colorPalette.mainGreen} name={nameSet[7]}></OneBlock>
      <OneBlock color={colorPalette.mainGreen} name={nameSet[8]}></OneBlock>

      <OneBlock color={colorPalette.mainGreen} name={nameSet[9]}></OneBlock>
      <OneBlock color={colorPalette.mainGreen} name={nameSet[10]}></OneBlock>
      <ThreeBlock
        color={colorPalette.gray0}
        name={'지식의 숲을 가꿔보세요'}
      ></ThreeBlock>
      <OneBlock color={colorPalette.mainGreen} name={nameSet[11]}></OneBlock>
      <OneBlock color={colorPalette.mainGreen} name={nameSet[12]}></OneBlock>
      <OneBlock color={colorPalette.mainGreen} name={nameSet[13]}></OneBlock>
      <OneBlock color={colorPalette.mainGreen} name={nameSet[14]}></OneBlock>
      <OneBlock color={colorPalette.mainGreen} name={nameSet[15]}></OneBlock>
      <OneBlock color={colorPalette.mainGreen} name={nameSet[16]}></OneBlock>
      <OneBlock color={colorPalette.mainGreen} name={nameSet[17]}></OneBlock>
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
  border-radius: 35px;
  text-align: center;
  display: grid;
  align-items: center;
  width: 100%;
  //height: auto;
  aspect-ratio: 1/1; // 모바일에서는 작동을 안해!
  box-shadow: ${boxShadow.default};
  &:hover {
    ${hoverAction}
  }
`
export const WidthThreeBlock = styled.div`
  grid-row-start: span 1;
  grid-column-start: span 3;
  text-align: center;
  border-radius: 35px;
  display: grid;
  align-items: center;
  width: 100%;
  height: 100%;
  box-shadow: ${boxShadow.default};
  &:hover {
    ${hoverAction}
  }
`

function TabletBlocks() {
  return (
    <>
      <OneBlock color={colorPalette.mainGreen} name={nameSet[0]}></OneBlock>
      <OneBlock color={colorPalette.mainGreen} name={nameSet[1]}></OneBlock>
      <OneBlock color={colorPalette.mainGreen} name={nameSet[2]}></OneBlock>
      <OneBlock color={colorPalette.mainGreen} name={nameSet[3]}></OneBlock>

      <ThreeBlock
        color={colorPalette.gray0}
        name={'Foresty와 함께'}
      ></ThreeBlock>
      <OneBlock color={colorPalette.mainGreen} name={nameSet[4]}></OneBlock>

      <OneBlock color={colorPalette.mainGreen} name={nameSet[5]}></OneBlock>
      <ThreeBlock
        color={colorPalette.gray0}
        name={'지식의 숲을 가꿔보세요'}
      ></ThreeBlock>

      <OneBlock color={colorPalette.mainGreen} name={nameSet[6]}></OneBlock>
      <OneBlock color={colorPalette.mainGreen} name={nameSet[7]}></OneBlock>
      <OneBlock color={colorPalette.mainGreen} name={nameSet[8]}></OneBlock>
      <OneBlock color={colorPalette.mainGreen} name={nameSet[9]}></OneBlock>

      <OneBlock color={colorPalette.mainGreen} name={nameSet[10]}></OneBlock>
      <OneBlock color={colorPalette.mainGreen} name={nameSet[11]}></OneBlock>
      <OneBlock color={colorPalette.mainGreen} name={nameSet[12]}></OneBlock>
      <OneBlock color={colorPalette.mainGreen} name={nameSet[13]}></OneBlock>

      <OneBlock color={colorPalette.mainGreen} name={nameSet[14]}></OneBlock>
      <OneBlock color={colorPalette.mainGreen} name={nameSet[15]}></OneBlock>
      <OneBlock color={colorPalette.mainGreen} name={nameSet[16]}></OneBlock>
      <OneBlock color={colorPalette.mainGreen} name={nameSet[17]}></OneBlock>
    </>
  )
}

function MobileBlocks() {
  return (
    <>
      <OneBlock color={colorPalette.mainGreen} name={nameSet[0]}></OneBlock>
      <OneBlock color={colorPalette.mainGreen} name={nameSet[1]}></OneBlock>
      <OneBlock color={colorPalette.mainGreen} name={nameSet[2]}></OneBlock>

      <ThreeBlock
        color={colorPalette.gray0}
        name={'Foresty와 함께'}
      ></ThreeBlock>

      <ThreeBlock
        color={colorPalette.gray0}
        name={'지식의 숲을 가꿔보세요'}
      ></ThreeBlock>

      <OneBlock color={colorPalette.mainGreen} name={nameSet[3]}></OneBlock>
      <OneBlock color={colorPalette.mainGreen} name={nameSet[4]}></OneBlock>
      <OneBlock color={colorPalette.mainGreen} name={nameSet[5]}></OneBlock>

      <OneBlock color={colorPalette.mainGreen} name={nameSet[6]}></OneBlock>
      <OneBlock color={colorPalette.mainGreen} name={nameSet[7]}></OneBlock>
      <OneBlock color={colorPalette.mainGreen} name={nameSet[8]}></OneBlock>

      <OneBlock color={colorPalette.mainGreen} name={nameSet[9]}></OneBlock>
      <OneBlock color={colorPalette.mainGreen} name={nameSet[10]}></OneBlock>
      <OneBlock color={colorPalette.mainGreen} name={nameSet[11]}></OneBlock>

      <OneBlock color={colorPalette.mainGreen} name={nameSet[12]}></OneBlock>
      <OneBlock color={colorPalette.mainGreen} name={nameSet[13]}></OneBlock>
      <OneBlock color={colorPalette.mainGreen} name={nameSet[14]}></OneBlock>

      <OneBlock color={colorPalette.mainGreen} name={nameSet[15]}></OneBlock>
      <OneBlock color={colorPalette.mainGreen} name={nameSet[16]}></OneBlock>
      <OneBlock color={colorPalette.mainGreen} name={nameSet[17]}></OneBlock>
    </>
  )
}
