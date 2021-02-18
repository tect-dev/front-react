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

import React, { useState, useEffect, useCallback } from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { setUserPlace } from '../redux/auth'
import { boxShadow, colorPalette, hoverAction } from '../lib/constants'
import { shuffleArray, getRandomNumberInArray } from '../lib/functions'
import {
  finishDocuEdit,
  selectNode,
  readTechtree,
  updateTechtree,
  deleteTechtree,
  changeTechtreeTitle,
  editTechtree,
  finishTechtreeEdit,
} from '../redux/techtree'
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
      <DemoTree />

      <TreePageHeader>지금까지 심어진 지식의 나무 ... 그루</TreePageHeader>
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
    dispatch(changeTechtreeTitle(e.target.value))
  }, [])

  const onFinishDocuEdit = useCallback(() => {
    dispatch(
      finishDocuEdit(
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

      dispatch(updateTechtree(nodeList, linkList, techtreeTitle))
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
                const deleteOK = window.confirm(`정말 삭제하시나요?`)
                if (deleteOK) {
                  alert('사용자 데모라 삭제되지 않아요.')
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
          <DocuWrapper>
            <DocuHeaderArea>
              <div className="docuTitle">
                {isEditingDocument ? (
                  <TitleInput
                    value={documentTitle}
                    onChange={onChangeDocumentTitle}
                  />
                ) : (
                  <StyledTitle>{selectedNode.name}</StyledTitle>
                )}
              </div>

              <div className="editDocu">
                {isEditingDocument ? (
                  <DefaultButton onClick={onFinishDocuEdit}>
                    수정완료
                  </DefaultButton>
                ) : (
                  ''
                )}

                <DefaultButton
                  onClick={() => {
                    setIsEditingDocument(true)
                  }}
                >
                  문서 수정
                </DefaultButton>
              </div>
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
              {previousNodeList.map((node) => {
                return (
                  <div>
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
                        window.scrollTo(0, 0)
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
              {nextNodeList.map((node) => {
                return (
                  <div>
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
                        window.scrollTo(0, 0)
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
