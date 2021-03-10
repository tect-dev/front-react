import React, { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import MainWrapper from '../../wrappers/MainWrapper'
import DoubleSideLayout from '../../wrappers/DoubleSideLayout'
import MarkdownEditor from '../../components/MarkdownEditor'
import MarkdownRenderer from '../../components/MarkdownRenderer'
import { HalfWidthWrapper } from '../../wrappers/HalfWidthWrapper'
import { Preview } from '../board/WritePage'
import TechtreeMap from '../../components/TechtreeMap'
import { Spinner } from '../../components/Spinner'
import {
  DangerButton,
  DefaultButton,
  LikeButton,
} from '../../components/Button'

import {
  TitleInput,
  TitleBottomLine,
  StyledTitle,
} from '../../components/TitleInput'
import Loader from 'react-loader-spinner'
import LikeSproutGray from '../../assets/LikeSproutGray.svg'
import LikeSproutGreen from '../../assets/LikeSproutGreen.svg'

import styled from 'styled-components'

import { authService } from '../../lib/firebase'
import {
  finishDocuEdit,
  selectNode,
  readTechtree,
  updateTechtree,
  deleteTechtree,
  changeTechtreeTitle,
  editTechtree,
  finishTechtreeEdit,
  likeTree,
  forkTree,
  changeNodeColor,
  unselectNode,
  openUserGuide,
} from '../../redux/techtree'
import { returnPreviousNodeList, returnNextNodeList } from '../../lib/functions'
import {
  boxShadow,
  colorPalette,
  fontSize,
  hoverAction,
} from '../../lib/constants'
import Modal from 'react-modal'
import translationText from '../../lib/translation.json'

const userGuideName = translationText.en.userGuide.name
const userGuideBody = translationText.en.userGuide.body

const rightHalfModal = {
  overlay: {
    background: 'none',
  },
  content: {
    left: '45%',
    top: '15%',
    //left: '50%',
    right: '5%',
    //bottom: 'auto',
    // marginRight: '-50%',
    //transform: 'translate(-50%, -50%)',
  },
}

const fullModal = {
  overlay: {
    background: 'none',
  },
  content: {
    left: '15%',
    top: '15%',
    //left: '50%',
    right: '15%',
    //bottom: 'auto',
    // marginRight: '-50%',
    //transform: 'translate(-50%, -50%)',
  },
}

Modal.setAppElement(document.getElementById('root'))

export default function TechtreeDetailPage({ match }) {
  const dispatch = useDispatch()

  const isClient = typeof window === 'object'
  const [windowSize, setWindowSize] = useState(getSize)
  function getSize() {
    return {
      width: isClient ? window.innerWidth : undefined,
      height: isClient ? window.innerHeight : undefined,
    }
  }
  useEffect(() => {
    if (!isClient) {
      return false
    }
    function handleResize() {
      setWindowSize(getSize())
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [getSize, isClient])

  const { techtreeID } = match.params

  const { loginState, userID } = useSelector((state) => {
    return { loginState: state.auth.loginState, userID: state.auth.userID }
  })
  const {
    loading,
    isSavingTechtree,
    isEditingTechtree,
    treeAuthor,
  } = useSelector((state) => {
    return {
      loading: state.techtree.loading,
      isSavingTechtree: state.techtree.isSavingTechtree,
      isEditingTechtree: state.techtree.isEditingTechtree,
      treeAuthor: state.techtree.treeAuthor,
    }
  })

  const { selectedNode, previousNodeList, nextNodeList } = useSelector(
    (state) => {
      return {
        selectedNode: state.techtree.selectedNode,
        previousNodeList: state.techtree.previousNodeList,
        nextNodeList: state.techtree.nextNodeList,
      }
    }
  )

  const {
    techtreeData,
    nodeList,
    linkList,
    techtreeTitle,
    treeLikeUsers,
  } = useSelector((state) => {
    return {
      techtreeData: state.techtree.techtreeData,
      nodeList: state.techtree.nodeList,
      linkList: state.techtree.linkList,
      techtreeTitle: state.techtree.techtreeTitle,
      treeLikeUsers: state.techtree.treeLikeUsers,
    }
  })

  const [documentTitle, setDocumentTitle] = useState('')
  const [documentText, setDocumentText] = useState('')
  const [isEditingDocument, setIsEditingDocument] = useState(false)

  const [localTreeLike, setLocalTreeLike] = useState()
  const [isLiked, setIsLiked] = useState(false)
  const [dataStr, setDataStr] = useState(
    'data:text/json;charset=utf-8,' +
      encodeURIComponent(
        JSON.stringify({
          title: techtreeData.title,
          nodeList: nodeList,
          linkList: linkList,
        })
      )
  )

  useEffect(() => {
    authService.currentUser?.reload()
    dispatch(readTechtree(techtreeID))
    window.scrollTo(0, 0)
  }, [dispatch, techtreeID])

  useEffect(() => {
    setDocumentTitle(selectedNode.name)
    setDocumentText(selectedNode.body)
    if (typeof selectedNode.id !== 'undefined') {
      setModalOpend(true)
    }
  }, [selectedNode])

  const openUserGuideModal = useCallback(() => {
    dispatch(openUserGuide())
    setDocumentTitle(userGuideName)
    setDocumentText(userGuideBody)
    setModalOpend(true)
  }, [dispatch])

  useEffect(() => {
    const tempData = { title: techtreeData.title, linkList: linkList }
    nodeList.forEach((ele, index) => {
      tempData[`node${index}`] = ele
    })
    setDataStr(
      'data:text/json;charset=utf-8,' +
        encodeURIComponent(JSON.stringify(tempData))
    )
  }, [techtreeData, nodeList, linkList])

  useEffect(() => {
    setLocalTreeLike(techtreeData.like)
    if (
      treeLikeUsers?.find((ele) => {
        return ele === userID
      })
    ) {
      setIsLiked(true)
    } else {
      setIsLiked(false)
    }
  }, [techtreeData, userID, treeLikeUsers])

  const onChangeDocumentTitle = useCallback((e) => {
    e.preventDefault()
    setDocumentTitle(e.target.value)
  }, [])

  const onChangeTechtreeTitle = useCallback((e) => {
    e.preventDefault()
    dispatch(changeTechtreeTitle(e.target.value))
  }, [])

  const onFinishEdit = useCallback(() => {
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
    selectedNode,
    documentTitle,
    documentText,
    nodeList,
    linkList,
    techtreeData,
    dispatch,
  ])

  const onClickTechtreeEdit = useCallback(() => {
    if (isEditingTechtree) {
      dispatch(finishTechtreeEdit())
    } else {
      dispatch(editTechtree())
    }
  }, [dispatch, isEditingTechtree])

  const onClickTechtreeCommit = useCallback(async () => {
    //e.preventDefault()
    const svgDOM = document.getElementById('techtreeContainer')
    const source = new XMLSerializer().serializeToString(svgDOM)
    var decoded = unescape(encodeURIComponent(source))
    // Now we can use btoa to convert the svg to base64
    const base64 = btoa(decoded)
    const thumbnailURL = `data:image/svg+xml;base64,${base64}`
    dispatch(
      updateTechtree(
        nodeList,
        linkList,
        techtreeID,
        techtreeTitle,
        thumbnailURL
      )
    )
  }, [dispatch, nodeList, linkList, techtreeID, techtreeTitle])

  const onClickForkTree = useCallback(() => {
    const svgDOM = document.getElementById('techtreeContainer')
    const source = new XMLSerializer().serializeToString(svgDOM)
    var decoded = unescape(encodeURIComponent(source))
    // Now we can use btoa to convert the svg to base64
    const base64 = btoa(decoded)
    const thumbnailURL = `data:image/svg+xml;base64,${base64}`
    dispatch(forkTree(techtreeData, nodeList, linkList, userID, thumbnailURL))
  }, [dispatch, nodeList, linkList, techtreeData, userID])

  const [changedColor, setChangedColor] = useState()
  const onChangeNodeColor = useCallback(
    (selectedColor) => {
      // 새로운 테크트리 데이터 객체를 만들어서 인자로 건내줘야 하나.
      setChangedColor(selectedColor)
      const coloredNode = { ...selectedNode, fillColor: selectedColor }
      dispatch(changeNodeColor(nodeList, coloredNode))
    },
    [dispatch, nodeList, selectedNode]
  )

  const [searchValue, setSearchValue] = useState('')
  const [searchResultList, setSearchResultList] = useState([])
  const searchInTree = useCallback(
    (e) => {
      setSearchResultList()
      if (e.code === 'Enter' && searchValue !== '') {
        const searchedTextRegex = new RegExp(searchValue.toLowerCase())
        const tempResult1 = nodeList.map((ele) => {
          if (searchedTextRegex.test(ele.name.toLowerCase())) {
            const trimmed = { ...ele, body: `${ele.body.substr(0, 50)}...` }
            return trimmed
          } else if (searchedTextRegex.test(ele.body.toLowerCase())) {
            const cutNumber = ele.body
              .toLowerCase()
              .search(searchValue.toLowerCase())

            const trimmed = {
              ...ele,
              body:
                '...' +
                ele.body.substring(cutNumber - 30, cutNumber) +
                ele.body.substring(cutNumber, cutNumber + 30) +
                '...',
            }

            return trimmed
          } else {
            return null
          }
        })
        const tempResult = tempResult1.filter((ele) => {
          return ele !== null
        })
        setSearchResultList(tempResult)
      }
    },
    [nodeList, searchValue, searchResultList]
  )

  const [modalOpend, setModalOpend] = useState(false)

  const NodeModal = () => {
    return (
      <Modal
        isOpen={modalOpend}
        //onAfterOpen={}

        style={rightHalfModal}
        contentLabel="Example Modal"
      >
        {!isEditingDocument ? (
          <DefaultButton
            onClick={() => {
              setModalOpend(false)
              dispatch(unselectNode())
            }}
          >
            close
          </DefaultButton>
        ) : null}

        <HalfWidthDocumentContainer>
          <DocuWrapper id="docuWrapper">
            <DocuHeaderArea>
              <div className="docuTitle">
                {isEditingDocument ? (
                  <TitleInput
                    value={documentTitle}
                    onChange={onChangeDocumentTitle}
                  />
                ) : (
                  <StyledTitle>{documentTitle}</StyledTitle>
                )}
              </div>

              <EditDocuButtonArea>
                {isEditingDocument ? (
                  <DefaultButton onClick={onFinishEdit}>done</DefaultButton>
                ) : (
                  ''
                )}
                {typeof selectedNode.id !== 'undefined' &&
                !isEditingDocument &&
                userID === treeAuthor?.firebaseUid ? (
                  <DefaultButton
                    onClick={() => {
                      setIsEditingDocument(true)
                    }}
                  >
                    Edit
                  </DefaultButton>
                ) : (
                  ''
                )}
              </EditDocuButtonArea>
            </DocuHeaderArea>
            {typeof selectedNode.id !== 'undefined' &&
            isEditingDocument &&
            userID === treeAuthor?.firebaseUid ? (
              <NodeColorButtonArea>
                <NodeColorButton
                  style={{ background: colorPalette.red7 }}
                  onClick={() => {
                    onChangeNodeColor(colorPalette.red7)
                  }}
                ></NodeColorButton>
                <NodeColorButton
                  style={{ background: colorPalette.yellow5 }}
                  onClick={() => {
                    onChangeNodeColor(colorPalette.yellow5)
                  }}
                ></NodeColorButton>
                <NodeColorButton
                  style={{ background: colorPalette.green5 }}
                  onClick={() => {
                    onChangeNodeColor(colorPalette.green5)
                  }}
                ></NodeColorButton>
                <NodeColorButton
                  style={{ background: colorPalette.blue5 }}
                  onClick={() => {
                    onChangeNodeColor(colorPalette.blue5)
                  }}
                ></NodeColorButton>
                <NodeColorButton
                  style={{ background: colorPalette.violet5 }}
                  onClick={() => {
                    onChangeNodeColor(colorPalette.violet5)
                  }}
                ></NodeColorButton>
              </NodeColorButtonArea>
            ) : null}
            <TitleBottomLine />
            <DocuBodyArea>
              {isEditingDocument ? (
                <MarkdownEditor
                  bindingText={documentText}
                  bindingSetter={setDocumentText}
                  width="100%"
                />
              ) : (
                <MarkdownRenderer text={documentText} />
              )}
            </DocuBodyArea>
          </DocuWrapper>
          {isEditingDocument ? null : (
            <NodeButtonArea>
              <PrevNodeArea>
                {previousNodeList.length > 0 ? <div>Previous</div> : ''}
                {previousNodeList.map((node, index) => {
                  return (
                    <div key={index}>
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
                            selectNode(
                              newPreviousNodeList,
                              newNextNodeList,
                              node
                            )
                          )
                          const offsetElement = document.getElementById(
                            'docuWrapper'
                          )
                          // const clientRect = offsetElement.getBoundingClientRect()
                          // const relativeTop = clientRect.top
                          // const scrolledTopLength = window.pageYOffset
                          // const absoluteYPosition =
                          //   scrolledTopLength + relativeTop
                          //window.scrollTo(0, absoluteYPosition - 80)
                        }}
                      >
                        {node?.name}
                      </DefaultButton>
                    </div>
                  )
                })}
              </PrevNodeArea>
              <NextNodeArea>
                {nextNodeList.length > 0 ? <div>Next</div> : ''}
                {nextNodeList.map((node, index) => {
                  return (
                    <div key={index}>
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
                            selectNode(
                              newPreviousNodeList,
                              newNextNodeList,
                              node
                            )
                          )
                          const offsetElement = document.getElementById(
                            'docuWrapper'
                          )
                          //const clientRect = offsetElement.getBoundingClientRect()
                          //const relativeTop = clientRect.top
                          //const scrolledTopLength = window.pageYOffset
                          //const absoluteYPosition =
                          //  scrolledTopLength + relativeTop
                          // window.scrollTo(0, absoluteYPosition - 80)
                        }}
                      >
                        {node?.name}
                      </DefaultButton>
                    </div>
                  )
                })}
              </NextNodeArea>
            </NodeButtonArea>
          )}
        </HalfWidthDocumentContainer>
      </Modal>
    )
  }

  if (loading) {
    return (
      <MainWrapper>
        <Spinner />
      </MainWrapper>
    )
  } else if (!loading) {
    return (
      <MainWrapper>
        {!isEditingDocument ? <NodeModal /> : null}
        {!isEditingDocument ? (
          <>
            <TreeTitleArea>
              <div>
                {treeAuthor?.firebaseUid === userID ? (
                  <TitleInput
                    value={techtreeTitle}
                    placeholder="Title Of The Tree..."
                    onChange={onChangeTechtreeTitle}
                    maxLength="60"
                    size="60"
                  />
                ) : (
                  <>
                    <StyledTitle>{techtreeTitle}</StyledTitle>

                    <StyledDisplayName>
                      <Link to={`/forest/${treeAuthor?.firebaseUid}`}>
                        {treeAuthor?.displayName}
                      </Link>
                    </StyledDisplayName>
                  </>
                )}
              </div>
              <DefaultButton onClick={openUserGuideModal}>
                How To Use It?
              </DefaultButton>
            </TreeTitleArea>

            <TechtreeMap />

            <TreeEditButtonArea>
              <DefaultButton>
                <a href={dataStr} download={`${techtreeData.title}.json`}>
                  Download Tree
                </a>
              </DefaultButton>
              {loginState ? (
                <DefaultButton onClick={onClickForkTree}>
                  Fork This Tree
                </DefaultButton>
              ) : null}

              {!isEditingDocument &&
              userID === treeAuthor?.firebaseUid &&
              !isEditingTechtree ? (
                <DefaultButton onClick={onClickTechtreeEdit}>
                  Edit Tree
                </DefaultButton>
              ) : (
                ''
              )}
              {!isEditingDocument &&
              userID === treeAuthor?.firebaseUid &&
              isEditingTechtree ? (
                <DefaultButton onClick={onClickTechtreeEdit}>
                  Done
                </DefaultButton>
              ) : (
                ''
              )}

              {!isEditingDocument &&
              !isSavingTechtree &&
              userID === treeAuthor?.firebaseUid ? (
                <DefaultButton onClick={onClickTechtreeCommit}>
                  Save Changes
                </DefaultButton>
              ) : (
                ''
              )}
              {isSavingTechtree ? (
                <div>
                  <Loader
                    type="Grid"
                    color={colorPalette.teal5}
                    height={20}
                    width={20}
                  />
                </div>
              ) : (
                ''
              )}
              {!isEditingDocument && userID === treeAuthor?.firebaseUid ? (
                <DangerButton
                  onClick={() => {
                    const deleteOK = window.confirm(`YOU REALLY DELETE ALL?`)
                    if (deleteOK) {
                      dispatch(deleteTechtree(techtreeData?._id))
                    } else {
                      return
                    }
                  }}
                >
                  Delete All
                </DangerButton>
              ) : (
                ''
              )}
            </TreeEditButtonArea>
            <SearchArea>
              <div style={{ display: 'inline-flex' }}>
                <StyledSearchInput
                  placeholder="Search In Tree..."
                  value={searchValue}
                  type="search"
                  onKeyPress={(e) => {
                    searchInTree(e)
                  }}
                  onChange={(e) => {
                    setSearchValue(e.target.value)
                  }}
                />
              </div>

              {searchValue === '' ? (
                ''
              ) : (
                <div>
                  {searchResultList?.map((ele, idx) => {
                    return (
                      <SearchNodeCard
                        key={idx}
                        onClick={() => {
                          const previousNodeList = returnPreviousNodeList(
                            linkList,
                            nodeList,
                            nodeList.find((origin) => {
                              return ele.id === origin.id
                            })
                          )
                          const nextNodeList = returnNextNodeList(
                            linkList,
                            nodeList,
                            nodeList.find((origin) => {
                              return ele.id === origin.id
                            })
                          )
                          dispatch(
                            selectNode(
                              previousNodeList,
                              nextNodeList,
                              nodeList.find((origin) => {
                                return ele.id === origin.id
                              })
                            )
                          )
                        }}
                      >
                        <div style={{ display: 'flex', marginBottom: '10px' }}>
                          {' '}
                          <NodeColorSymbol
                            style={{ background: ele.fillColor }}
                          ></NodeColorSymbol>
                          <div>{ele.name}</div>
                        </div>
                        <div>{ele.body}</div>
                      </SearchNodeCard>
                    )
                  })}
                </div>
              )}
            </SearchArea>
          </>
        ) : null}
        {isEditingDocument ? (
          <DoubleSideLayout>
            <HalfWidthDocumentContainer>
              <Preview style={{ color: changedColor }}>Doc Preview</Preview>
              <MarkdownRenderer text={documentText} />
            </HalfWidthDocumentContainer>

            <HalfWidthDocumentContainer>
              <DocuWrapper id="docuWrapper">
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

                  <EditDocuButtonArea>
                    {isEditingDocument ? (
                      <DefaultButton onClick={onFinishEdit}>done</DefaultButton>
                    ) : (
                      ''
                    )}
                    {typeof selectedNode.id !== 'undefined' &&
                    !isEditingDocument &&
                    userID === treeAuthor?.firebaseUid ? (
                      <DefaultButton
                        onClick={() => {
                          setIsEditingDocument(true)
                        }}
                      >
                        Edit
                      </DefaultButton>
                    ) : (
                      ''
                    )}
                  </EditDocuButtonArea>
                </DocuHeaderArea>
                {typeof selectedNode.id !== 'undefined' &&
                isEditingDocument &&
                userID === treeAuthor?.firebaseUid ? (
                  <NodeColorButtonArea>
                    <NodeColorButton
                      style={{ background: colorPalette.red7 }}
                      onClick={() => {
                        onChangeNodeColor(colorPalette.red7)
                      }}
                    ></NodeColorButton>
                    <NodeColorButton
                      style={{ background: colorPalette.yellow5 }}
                      onClick={() => {
                        onChangeNodeColor(colorPalette.yellow5)
                      }}
                    ></NodeColorButton>
                    <NodeColorButton
                      style={{ background: colorPalette.green5 }}
                      onClick={() => {
                        onChangeNodeColor(colorPalette.green5)
                      }}
                    ></NodeColorButton>
                    <NodeColorButton
                      style={{ background: colorPalette.blue5 }}
                      onClick={() => {
                        onChangeNodeColor(colorPalette.blue5)
                      }}
                    ></NodeColorButton>
                    <NodeColorButton
                      style={{ background: colorPalette.violet5 }}
                      onClick={() => {
                        onChangeNodeColor(colorPalette.violet5)
                      }}
                    ></NodeColorButton>
                  </NodeColorButtonArea>
                ) : null}
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
              {isEditingDocument ? null : (
                <NodeButtonArea>
                  <PrevNodeArea>
                    {previousNodeList.length > 0 ? <div>Previous</div> : ''}
                    {previousNodeList.map((node, index) => {
                      return (
                        <div key={index}>
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
                                selectNode(
                                  newPreviousNodeList,
                                  newNextNodeList,
                                  node
                                )
                              )
                              const offsetElement = document.getElementById(
                                'docuWrapper'
                              )
                              const clientRect = offsetElement.getBoundingClientRect()
                              const relativeTop = clientRect.top
                              const scrolledTopLength = window.pageYOffset
                              const absoluteYPosition =
                                scrolledTopLength + relativeTop
                              //window.scrollTo(0, absoluteYPosition - 80)
                            }}
                          >
                            {node?.name}
                          </DefaultButton>
                        </div>
                      )
                    })}
                  </PrevNodeArea>
                  <NextNodeArea>
                    {nextNodeList.length > 0 ? <div>Next</div> : ''}
                    {nextNodeList.map((node, index) => {
                      return (
                        <div key={index}>
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
                                selectNode(
                                  newPreviousNodeList,
                                  newNextNodeList,
                                  node
                                )
                              )
                              const offsetElement = document.getElementById(
                                'docuWrapper'
                              )
                              //   const clientRect = offsetElement.getBoundingClientRect()
                              //   const relativeTop = clientRect.top
                              //   const scrolledTopLength = window.pageYOffset
                              //   const absoluteYPosition =
                              //     scrolledTopLength + relativeTop
                              // window.scrollTo(0, absoluteYPosition - 80)
                            }}
                          >
                            {node?.name}
                          </DefaultButton>
                        </div>
                      )
                    })}
                  </NextNodeArea>
                </NodeButtonArea>
              )}
            </HalfWidthDocumentContainer>
          </DoubleSideLayout>
        ) : null}
      </MainWrapper>
    )
  }
}

export const TreePageHeader = styled.div`
  width: inherit;
  padding-left: 10px;
  display: flex;
  justify-content: space-between;
  //border: 1px solid ${colorPalette.mainGreen};
  font-size: ${fontSize.xlarge};
  color: ${colorPalette.gray7};
  font-weight: bold;
  margin: 1rem;
  color: ${colorPalette.gray7};
`

export const TreeTitleArea = styled.div`
  display: flex;
  //grid-template-columns: 2fr 1fr;
  width: 100%;
  justify-content: space-between;
  align-items: center;
`

export const StyledDisplayName = styled(StyledTitle)`
  font-size: ${fontSize.small};
`

export const TreeEditorArea = styled.div``

export const TreeEditButtonArea = styled.div`
  display: flex;
  //grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
  justify-content: space-between;
  justify-items: center;
  padding: 20px;
`

export const DocuWrapper = styled.div`
  border-radius: 3px;
  background: #ffffff;
  border: 0.5px solid ${colorPalette.gray3};
  box-sizing: border-box;
  padding: 10px;
  box-shadow: ${boxShadow.default};
`

export const DocuHeaderArea = styled.div`
  display: flex;
  padding: 10px;
  width: 90%;
  justify-content: space-between;
`

export const NodeColorButtonArea = styled.div`
  padding-left: 15px;
  padding-right: 15px;
  padding-bottom: 10px;
`

export const NodeColorButton = styled.button`
  width: 30px;
  height: 30px;
  border-radius: 15px;
  border: none;
  margin-left: 3px;
  margin-right: 3px;
`

export const EditDocuButtonArea = styled.div`
  display: inline;
`

export const DocuBodyArea = styled.div`
  padding-left: 1rem;
  padding-right: 1rem;
  padding-bottom: 1rem;
`

export const NodeButtonArea = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 20px;

  justify-content: space-between;
  padding: 20px;
  font-size: ${fontSize.small};
`

export const PrevNodeArea = styled.div``

export const NextNodeArea = styled.div``

export const HalfWidthContainer = styled.div`
  overflow: visible;
  width: 100%;
  //@media (max-width: 650px) {
  //  overflow-x: scroll;
  //}
`

export const HalfWidthDocumentContainer = styled(HalfWidthWrapper)`
  width: 100%;
  height: 90vh;
  @media (max-width: 650px) {
    height: auto;
  }
  overflow-y: scroll;
`

export const SearchArea = styled.div`
  padding-bottom: 10px;
`

export const StyledSearchInput = styled(TitleInput)``

export const NodeColorSymbol = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 15px;
  border: none;
  margin-left: 10px;
  margin-right: 10px;
`

export const SearchNodeCard = styled.div`
  background: #ffffff;
  //display: flex;
  cursor: pointer;
  padding: 10px;
  margin-top: 5px;
  margin-bottom: 5px;
  border: 1px solid ${colorPalette.gray2};
  box-shadow: ${boxShadow.default};
  &:hover {
    ${hoverAction};
  }
`
