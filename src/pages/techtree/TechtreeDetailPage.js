import React, { useEffect, useState, useCallback } from 'react'
import { Link, useHistory } from 'react-router-dom'
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
} from '../../redux/techtree'
import { returnPreviousNodeList, returnNextNodeList } from '../../lib/functions'
import { boxShadow, colorPalette, fontSize } from '../../lib/constants'

export default function TechtreeDetailPage({ match }) {
  const dispatch = useDispatch()
  const history = useHistory()
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

  const { reduxThumbnailURL } = useSelector((state) => {
    return { reduxThumbnailURL: state.techtree.tempThumbnailURL }
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
  }, [dispatch])

  useEffect(() => {
    setDocumentTitle(selectedNode.name)
    setDocumentText(selectedNode.body)
  }, [selectedNode])

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
  }, [dispatch, nodeList, linkList, techtreeID, techtreeData, userID])

  const onChangeNodeColor = useCallback(
    (selectedColor) => {
      // 새로운 테크트리 데이터 객체를 만들어서 인자로 건내줘야 하나.
      const coloredNode = { ...selectedNode, fillColor: selectedColor }
      dispatch(changeNodeColor(nodeList, coloredNode))
    },
    [nodeList, selectedNode]
  )

  if (loading) {
    return (
      <MainWrapper>
        <Spinner />
      </MainWrapper>
    )
  } else if (!loading) {
    return (
      <MainWrapper>
        <TreePageHeader>
          Tree
          {isLiked ? (
            <LikeButton
              onClick={() => {
                if (loginState) {
                  dispatch(likeTree(techtreeID))
                  setIsLiked(false)
                  setLocalTreeLike(localTreeLike - 1)
                } else {
                  alert('Login is required!')
                }
              }}
            >
              <img
                src={LikeSproutGreen}
                style={{ width: '20px', height: '20px' }}
              />
              <span style={{ color: '#6d9b7b' }}>{localTreeLike}</span> likes
            </LikeButton>
          ) : (
            <LikeButton
              onClick={() => {
                if (loginState) {
                  dispatch(likeTree(techtreeID))
                  setIsLiked(true)
                  setLocalTreeLike(localTreeLike + 1)
                } else {
                  alert('Login is required!')
                }
              }}
            >
              <img
                src={LikeSproutGray}
                style={{ width: '20px', height: '20px' }}
              />
              <span style={{ color: '#6d9b7b' }}>{localTreeLike}</span> likes
            </LikeButton>
          )}
        </TreePageHeader>
        <TreeTitleArea>
          {treeAuthor?.firebaseUid === userID ? (
            <TitleInput
              value={techtreeTitle}
              placeholder="Title Of The Tree..."
              onChange={onChangeTechtreeTitle}
              maxLength="60"
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
        </TreeTitleArea>
        <DoubleSideLayout>
          {isEditingDocument ? (
            <HalfWidthDocumentContainer>
              <Preview>Doc Preview</Preview>
              <MarkdownRenderer text={documentText} />
            </HalfWidthDocumentContainer>
          ) : (
            <HalfWidthContainer>
              <TreeEditorArea>
                <TechtreeMap />
              </TreeEditorArea>

              <TreeEditButtonArea>
                <DefaultButton onClick={onClickForkTree}>
                  Fork This Tree
                </DefaultButton>
                <DefaultButton>
                  <a href={dataStr} download={`${techtreeData.title}.json`}>
                    Download Tree
                  </a>
                </DefaultButton>

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
            </HalfWidthContainer>
          )}

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
                    <DefaultButton onClick={onFinishEdit}>
                      수정완료
                    </DefaultButton>
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
            )}
          </HalfWidthDocumentContainer>
        </DoubleSideLayout>
      </MainWrapper>
    )
  }
}

export const TreePageHeader = styled.div`
  width: inherit;
  padding-left: 10px;
  display: grid;
  //border: 1px solid ${colorPalette.mainGreen};
  font-size: ${fontSize.xlarge};
  color: ${colorPalette.gray7};
  font-weight: bold;
  margin: 1rem;
  color: ${colorPalette.gray7};
`

export const TreeTitleArea = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  width: 100%;
  justify-items: space-between;
  align-items: center;
`

export const StyledDisplayName = styled(StyledTitle)`
  font-size: ${fontSize.small};
`

export const TreeEditorArea = styled.div``

export const TreeEditButtonArea = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
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
  display: grid;
  padding: 10px;
  justify-content: space-between;
  grid-template-columns: 2fr 1fr;
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
