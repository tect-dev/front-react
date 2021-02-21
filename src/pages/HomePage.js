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
import HomeImage from '../assets/HomeImage.png'
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
import departments from '../lib/yonseiDepartments.json'

const colorSet = [colorPalette.teal1, colorPalette.green1, colorPalette.lime1]

const nameSet = [
  '자연대',
  '공대',
  '문과대',
  '상경대',
  '경영대',
  '생과대',
  '생명대',
  '사과대',
  '신과대',
  '음대',
  '간호대',
  '의대',
  '치대',
  '언더우드',
  '교육대',
  '글로벌인재',
  '연계전공',
  '약학',
] //shuffleArray()

const catchPraise1 = 'With '
const catchPraise2 = 'Grow Your Forest'
const catchPraise3 = 'Community By Your Major'
const catchPraise4 = 'Foresty 의 전공별 게시판'
const catchPraise5 =
  '같은 전공끼리 모이는 커뮤니티를 통해 다양한 정보를 공유해 보세요.'

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
  const [isPopup, setIsPopUp] = useState(false)
  const [selectedDepts, setselectedDepts] = useState(null)

  const onSetIsPopUp = useCallback((param) => {
    setIsPopUp(param)
  })
  const onSetselectedDepts = useCallback((param) => {
    setselectedDepts(param)
  })

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
          <br />
          <div>
            <br />
            <div>Foresty와 함께 지식의 숲을 가꿔나가요.</div>
            <br />
            <div>지금까지 Foresty에 심어진 나무</div>
            <br />
            <TreeSumText>
              {treeSum ? <CountUp end={treeSum} duration={2.5} /> : ''}
            </TreeSumText>
          </div>
        </div>
      </HomePageHeader>
      <DemoTree />
      <HomePageSection>
        <HomePageMiddle>
          <MiddleSectionTextArea>
            <BigText>{catchPraise3}</BigText>
            <LargeBoldText>{catchPraise4}</LargeBoldText>
            <br />
            <br />
            <br />
            <div style={{ fontSize: `${fontSize.xsmall}` }}>{catchPraise5}</div>
          </MiddleSectionTextArea>
          <div>
            <img
              style={{ width: '100%', objectFit: 'cover' }}
              src={HomeImage}
            />
          </div>
        </HomePageMiddle>
      </HomePageSection>
      <BlockWrapper>
        {windowSize.width > 1024 ? (
          <DesktopBlocks
            onSetIsPopUp={setIsPopUp}
            onSetselectedDepts={onSetselectedDepts}
          />
        ) : (
          ''
        )}
        {1024 > windowSize.width && windowSize.width > 650 ? (
          <TabletBlocks
            onSetIsPopUp={setIsPopUp}
            onSetselectedDepts={onSetselectedDepts}
          />
        ) : (
          ''
        )}
        {650 > windowSize.width ? (
          <MobileBlocks
            onSetIsPopUp={setIsPopUp}
            onSetselectedDepts={onSetselectedDepts}
          />
        ) : (
          ''
        )}
      </BlockWrapper>

      {/* popup modal에 대한 코드 시작 */}
      <PopupWrapper
        isPopup={isPopup}
        onClick={(e) => {
          setIsPopUp(false)
          setselectedDepts(null)
        }}
      >
        <PopupGridContainer
          onClick={(e) => {
            e.preventDefault()
          }}
        >
          {selectedDepts?.map((dept) => {
            return (
              <PopupDept
                onClick={(e) => {
                  e.preventDefault()
                }}
              >
                <Link
                  style={{
                    cursor: 'pointer',
                    display: 'grid',
                    boxSizing: 'border-box',
                    padding: '20px 10px',
                    placeItems: 'center',
                    width: '100%',
                    height: '100%',
                  }}
                  to={`/board/${dept}?page=1`}
                >
                  {dept}
                </Link>
              </PopupDept>
            )
          })}
        </PopupGridContainer>
      </PopupWrapper>
    </MainWrapperDefault>
  )
}

export const HomePageSection = styled.div`
  display: grid;
  font-size: ${fontSize.medium};
  line-height: ${fontSize.xlarge};
  text-align: center;
  text-decoration: none solid rgb(53, 53, 53);
  height: 575px;
  align-items: center;
`

export const HomePageHeader = styled(HomePageSection)``

export const HomePageMiddle = styled(HomePageSection)`
  grid-template-columns: 1fr 1fr;
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`

export const MiddleSectionTextArea = styled.div`
  text-align: left;
  @media (max-width: 768px) {
    text-align: center;
  }
`

export const BigText = styled.div`
  font-size: 40px;
  line-height: 45px;
  font-weight: 900;
  margin-top: 2rem;
  margin-bottom: 0.5rem;
`

export const LargeBoldText = styled.div`
  all: unset;
  font-weight: bold;
  color: ${colorPalette.mainGreen};

  font-size: ${fontSize.large};
`

export const TreeSumText = styled.div`
  font-size: ${fontSize.xxlarge};
  font-weight: 500;
  color: ${colorPalette.teal6};
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

function OneBlock({ color, name, setIsPopUp, setselectedDepts }) {
  return (
    <WidthOneBlock
      style={{
        backgroundColor: color,
        color: '#ffffff',
        fontWeight: 500,
        fontSize: fontSize.xlarge,
        cursor: 'pointer',
      }}
      onClick={() => {
        setIsPopUp(true)
        setselectedDepts(departments[name])
      }}
    >
      {name}
      {/* <Link
        to={`/board/${name}`}
        style={{
          width: '100%',
          height: '100%',
          display: 'grid',
          alignItems: 'center',
        }}
      >
        
      </Link> */}
    </WidthOneBlock>
  )
}

function ThreeBlock({ color, name, name2 }) {
  return (
    <WidthThreeBlock
      style={{
        backgroundColor: color,
        color: colorPalette.gray7,
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
        <div style={{ display: `inline` }}>
          <span>{name}</span>

          <span style={{ fontWeight: '700' }}>{name2}</span>
        </div>
      </Link>
    </WidthThreeBlock>
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
  border-radius: 15px;
  text-align: center;
  display: grid;
  align-items: center;
  width: 100%;
  height: 100%;
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
  border-radius: 15px;
  display: grid;
  align-items: center;
  width: 100%;
  height: 100%;
  font-size: 40px;
  box-shadow: ${boxShadow.default};
  &:hover {
    ${hoverAction}
  }
`

function DesktopBlocks({ onSetIsPopUp, onSetselectedDepts }) {
  return (
    <>
      <OneBlock
        color={colorPalette.mainGreen}
        name={nameSet[0]}
        setIsPopUp={onSetIsPopUp}
        setselectedDepts={onSetselectedDepts}
      ></OneBlock>
      <OneBlock
        color={colorPalette.mainGreen}
        name={nameSet[1]}
        setIsPopUp={onSetIsPopUp}
        setselectedDepts={onSetselectedDepts}
      ></OneBlock>
      <OneBlock
        color={colorPalette.mainGreen}
        name={nameSet[2]}
        setIsPopUp={onSetIsPopUp}
        setselectedDepts={onSetselectedDepts}
      ></OneBlock>
      <OneBlock
        color={colorPalette.mainGreen}
        name={nameSet[3]}
        setIsPopUp={onSetIsPopUp}
        setselectedDepts={onSetselectedDepts}
      ></OneBlock>
      <OneBlock
        color={colorPalette.mainGreen}
        name={nameSet[4]}
        setIsPopUp={onSetIsPopUp}
        setselectedDepts={onSetselectedDepts}
      ></OneBlock>
      <OneBlock
        color={colorPalette.mainGreen}
        name={nameSet[5]}
        setIsPopUp={onSetIsPopUp}
        setselectedDepts={onSetselectedDepts}
      ></OneBlock>
      <OneBlock
        color={colorPalette.mainGreen}
        name={nameSet[6]}
        setIsPopUp={onSetIsPopUp}
        setselectedDepts={onSetselectedDepts}
      ></OneBlock>
      <ThreeBlock
        color={colorPalette.gray0}
        name={catchPraise1}
        name2={'Foresty'}
      ></ThreeBlock>
      <OneBlock
        color={colorPalette.mainGreen}
        name={nameSet[7]}
        setIsPopUp={onSetIsPopUp}
        setselectedDepts={onSetselectedDepts}
      ></OneBlock>
      <OneBlock
        color={colorPalette.mainGreen}
        name={nameSet[8]}
        setIsPopUp={onSetIsPopUp}
        setselectedDepts={onSetselectedDepts}
      ></OneBlock>

      <OneBlock
        color={colorPalette.mainGreen}
        name={nameSet[9]}
        setIsPopUp={onSetIsPopUp}
        setselectedDepts={onSetselectedDepts}
      ></OneBlock>
      <OneBlock
        color={colorPalette.mainGreen}
        name={nameSet[10]}
        setIsPopUp={onSetIsPopUp}
        setselectedDepts={onSetselectedDepts}
      ></OneBlock>
      <ThreeBlock color={colorPalette.gray0} name={catchPraise2}></ThreeBlock>
      <OneBlock
        color={colorPalette.mainGreen}
        name={nameSet[11]}
        setIsPopUp={onSetIsPopUp}
        setselectedDepts={onSetselectedDepts}
      ></OneBlock>
      <OneBlock
        color={colorPalette.mainGreen}
        name={nameSet[12]}
        setIsPopUp={onSetIsPopUp}
        setselectedDepts={onSetselectedDepts}
      ></OneBlock>
      <OneBlock
        color={colorPalette.mainGreen}
        name={nameSet[13]}
        setIsPopUp={onSetIsPopUp}
        setselectedDepts={onSetselectedDepts}
      ></OneBlock>
      <OneBlock
        color={colorPalette.mainGreen}
        name={nameSet[14]}
        setIsPopUp={onSetIsPopUp}
        setselectedDepts={onSetselectedDepts}
      ></OneBlock>
      <OneBlock
        color={colorPalette.mainGreen}
        name={nameSet[15]}
        setIsPopUp={onSetIsPopUp}
        setselectedDepts={onSetselectedDepts}
      ></OneBlock>
      <OneBlock
        color={colorPalette.mainGreen}
        name={nameSet[16]}
        setIsPopUp={onSetIsPopUp}
        setselectedDepts={onSetselectedDepts}
      ></OneBlock>
      <OneBlock
        color={colorPalette.mainGreen}
        name={nameSet[17]}
        setIsPopUp={onSetIsPopUp}
        setselectedDepts={onSetselectedDepts}
      ></OneBlock>
    </>
  )
}

function TabletBlocks({ onSetIsPopUp, onSetselectedDepts }) {
  return (
    <>
      <OneBlock
        color={colorPalette.mainGreen}
        name={nameSet[0]}
        setIsPopUp={onSetIsPopUp}
        setselectedDepts={onSetselectedDepts}
      ></OneBlock>
      <OneBlock
        color={colorPalette.mainGreen}
        name={nameSet[1]}
        setIsPopUp={onSetIsPopUp}
        setselectedDepts={onSetselectedDepts}
      ></OneBlock>
      <OneBlock
        color={colorPalette.mainGreen}
        name={nameSet[2]}
        setIsPopUp={onSetIsPopUp}
        setselectedDepts={onSetselectedDepts}
      ></OneBlock>
      <OneBlock
        color={colorPalette.mainGreen}
        name={nameSet[3]}
        setIsPopUp={onSetIsPopUp}
        setselectedDepts={onSetselectedDepts}
      ></OneBlock>

      <ThreeBlock
        color={colorPalette.gray0}
        name={catchPraise1}
        name2={'Foresty'}
      ></ThreeBlock>
      <OneBlock
        color={colorPalette.mainGreen}
        name={nameSet[4]}
        setIsPopUp={onSetIsPopUp}
        setselectedDepts={onSetselectedDepts}
      ></OneBlock>

      <OneBlock
        color={colorPalette.mainGreen}
        name={nameSet[5]}
        setIsPopUp={onSetIsPopUp}
        setselectedDepts={onSetselectedDepts}
      ></OneBlock>
      <ThreeBlock color={colorPalette.gray0} name={catchPraise2}></ThreeBlock>

      <OneBlock
        color={colorPalette.mainGreen}
        name={nameSet[6]}
        setIsPopUp={onSetIsPopUp}
        setselectedDepts={onSetselectedDepts}
      ></OneBlock>
      <OneBlock
        color={colorPalette.mainGreen}
        name={nameSet[7]}
        setIsPopUp={onSetIsPopUp}
        setselectedDepts={onSetselectedDepts}
      ></OneBlock>
      <OneBlock
        color={colorPalette.mainGreen}
        name={nameSet[8]}
        setIsPopUp={onSetIsPopUp}
        setselectedDepts={onSetselectedDepts}
      ></OneBlock>
      <OneBlock
        color={colorPalette.mainGreen}
        name={nameSet[9]}
        setIsPopUp={onSetIsPopUp}
        setselectedDepts={onSetselectedDepts}
      ></OneBlock>

      <OneBlock
        color={colorPalette.mainGreen}
        name={nameSet[10]}
        setIsPopUp={onSetIsPopUp}
        setselectedDepts={onSetselectedDepts}
      ></OneBlock>
      <OneBlock
        color={colorPalette.mainGreen}
        name={nameSet[11]}
        setIsPopUp={onSetIsPopUp}
        setselectedDepts={onSetselectedDepts}
      ></OneBlock>
      <OneBlock
        color={colorPalette.mainGreen}
        name={nameSet[12]}
        setIsPopUp={onSetIsPopUp}
        setselectedDepts={onSetselectedDepts}
      ></OneBlock>
      <OneBlock
        color={colorPalette.mainGreen}
        name={nameSet[13]}
        setIsPopUp={onSetIsPopUp}
        setselectedDepts={onSetselectedDepts}
      ></OneBlock>

      <OneBlock
        color={colorPalette.mainGreen}
        name={nameSet[14]}
        setIsPopUp={onSetIsPopUp}
        setselectedDepts={onSetselectedDepts}
      ></OneBlock>
      <OneBlock
        color={colorPalette.mainGreen}
        name={nameSet[15]}
        setIsPopUp={onSetIsPopUp}
        setselectedDepts={onSetselectedDepts}
      ></OneBlock>
      <OneBlock
        color={colorPalette.mainGreen}
        name={nameSet[16]}
        setIsPopUp={onSetIsPopUp}
        setselectedDepts={onSetselectedDepts}
      ></OneBlock>
      <OneBlock
        color={colorPalette.mainGreen}
        name={nameSet[17]}
        setIsPopUp={onSetIsPopUp}
        setselectedDepts={onSetselectedDepts}
      ></OneBlock>
    </>
  )
}

function MobileBlocks({ onSetIsPopUp, onSetselectedDepts }) {
  return (
    <>
      <OneBlock
        color={colorPalette.mainGreen}
        name={nameSet[0]}
        setIsPopUp={onSetIsPopUp}
        setselectedDepts={onSetselectedDepts}
      ></OneBlock>
      <OneBlock
        color={colorPalette.mainGreen}
        name={nameSet[1]}
        setIsPopUp={onSetIsPopUp}
        setselectedDepts={onSetselectedDepts}
      ></OneBlock>
      <OneBlock
        color={colorPalette.mainGreen}
        name={nameSet[2]}
        setIsPopUp={onSetIsPopUp}
        setselectedDepts={onSetselectedDepts}
      ></OneBlock>

      <ThreeBlock
        color={colorPalette.gray0}
        name={catchPraise1}
        name2={'Foresty'}
      ></ThreeBlock>

      <ThreeBlock color={colorPalette.gray0} name={catchPraise2}></ThreeBlock>

      <OneBlock
        color={colorPalette.mainGreen}
        name={nameSet[3]}
        setIsPopUp={onSetIsPopUp}
        setselectedDepts={onSetselectedDepts}
      ></OneBlock>
      <OneBlock
        color={colorPalette.mainGreen}
        name={nameSet[4]}
        setIsPopUp={onSetIsPopUp}
        setselectedDepts={onSetselectedDepts}
      ></OneBlock>
      <OneBlock
        color={colorPalette.mainGreen}
        name={nameSet[5]}
        setIsPopUp={onSetIsPopUp}
        setselectedDepts={onSetselectedDepts}
      ></OneBlock>

      <OneBlock
        color={colorPalette.mainGreen}
        name={nameSet[6]}
        setIsPopUp={onSetIsPopUp}
        setselectedDepts={onSetselectedDepts}
      ></OneBlock>
      <OneBlock
        color={colorPalette.mainGreen}
        name={nameSet[7]}
        setIsPopUp={onSetIsPopUp}
        setselectedDepts={onSetselectedDepts}
      ></OneBlock>
      <OneBlock
        color={colorPalette.mainGreen}
        name={nameSet[8]}
        setIsPopUp={onSetIsPopUp}
        setselectedDepts={onSetselectedDepts}
      ></OneBlock>

      <OneBlock
        color={colorPalette.mainGreen}
        name={nameSet[9]}
        setIsPopUp={onSetIsPopUp}
        setselectedDepts={onSetselectedDepts}
      ></OneBlock>
      <OneBlock
        color={colorPalette.mainGreen}
        name={nameSet[10]}
        setIsPopUp={onSetIsPopUp}
        setselectedDepts={onSetselectedDepts}
      ></OneBlock>
      <OneBlock
        color={colorPalette.mainGreen}
        name={nameSet[11]}
        setIsPopUp={onSetIsPopUp}
        setselectedDepts={onSetselectedDepts}
      ></OneBlock>

      <OneBlock
        color={colorPalette.mainGreen}
        name={nameSet[12]}
        setIsPopUp={onSetIsPopUp}
        setselectedDepts={onSetselectedDepts}
      ></OneBlock>
      <OneBlock
        color={colorPalette.mainGreen}
        name={nameSet[13]}
        setIsPopUp={onSetIsPopUp}
        setselectedDepts={onSetselectedDepts}
      ></OneBlock>
      <OneBlock
        color={colorPalette.mainGreen}
        name={nameSet[14]}
        setIsPopUp={onSetIsPopUp}
        setselectedDepts={onSetselectedDepts}
      ></OneBlock>

      <OneBlock
        color={colorPalette.mainGreen}
        name={nameSet[15]}
        setIsPopUp={onSetIsPopUp}
        setselectedDepts={onSetselectedDepts}
      ></OneBlock>
      <OneBlock
        color={colorPalette.mainGreen}
        name={nameSet[16]}
        setIsPopUp={onSetIsPopUp}
        setselectedDepts={onSetselectedDepts}
      ></OneBlock>
      <OneBlock
        color={colorPalette.mainGreen}
        name={nameSet[17]}
        setIsPopUp={onSetIsPopUp}
        setselectedDepts={onSetselectedDepts}
      ></OneBlock>
    </>
  )
}

// popup

const PopupWrapper = styled.div`
  display: ${(props) => {
    return props.isPopup ? 'grid' : 'none'
  }};
  position: fixed;
  place-items: center;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.2);
  left: 0;
  top: 0;
`

const PopupGridContainer = styled.div`
  width: 70vw;
  display: grid;
  align-items: center;
  grid-gap: 10px;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
`

const PopupDept = styled.div`
  border-radius: 35px;
  color: white;
  font-weight: bold;
  background: ${colorPalette.mainGreen};
`
