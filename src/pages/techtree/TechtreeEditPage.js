import TechtreeEditor from '../../components/techtree/TechtreeEditor'
import MarkdownEditorBlock from '../../components/MarkdownEditorBlock'
import MarkdownRenderingBlock from '../../components/MarkdownRenderingBlock'
import React, { useEffect } from 'react'
import MainLayout from '../../components/layout/MainLayout'
import HalfWidthContainer from '../../components/layout/HalfWidthContainer'
//import '../../styles/page/HomePage.scss'
import { dummyTechtree } from '../../lib/dummyTechtree'
import { useState, useCallback } from 'react'
import styled from 'styled-components'
import { useSelector, useDispatch } from 'react-redux'
import { editDocument, finishDocuEdit, selectNode } from '../../redux/techtree'
import { select } from 'd3'
import { returnNextNodeList, returnPreviousNodeList } from '../../lib/functions'

export default function MyTechtreePage() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const {
    techtreeData,
    isEditingDocument,
    isEditingTechtree,
    selectedNode,
    previousNodeList,
    nextNodeList,
  } = useSelector((state) => {
    return {
      techtreeData: state.techtree.techtreeData,
      isEditingDocument: state.techtree.isEditingDocument,
      isEditingTechtree: state.techtree.isEditingTechtree,
      selectedNode: state.techtree.selectedNode,
      previousNodeList: state.techtree.previousNodeList,
      nextNodeList: state.techtree.nextNodeList,
    }
  })
  useEffect(() => {
    setTitle(selectedNode.name)
    setContent(selectedNode.body)
  }, [selectedNode])

  const dispatch = useDispatch()

  const onChangeTitle = useCallback(
    (e) => {
      e.preventDefault()
      setTitle(e.target.value)
    },
    [title]
  )

  const onChangeContent = useCallback(
    (value) => {
      setContent(value)
    },
    [content]
  )

  return (
    <MainLayout>
      <TechtreeEditor techtreeData={techtreeData} selectedNode={selectedNode} />

      <HalfWidthContainer>
        <SideMarkdownSection
          className="techtreeMarkdownSection"
          style={{ display: 'none' }}
        >
          {isEditingDocument ? (
            <>
              <StyledTitleInput
                type="text"
                id="title"
                value={title}
                maxLength="100"
                onChange={onChangeTitle}
                placeholder="title"
              />
              <MarkdownEditorBlock
                contentProps={content}
                onChangeContentProps={onChangeContent}
                width="42vw"
                height="350px"
              />
            </>
          ) : (
            <>
              <div>
                <h3>{title}</h3>
              </div>
              <div>prevNode</div>
              <div>
                {previousNodeList.map((node) => {
                  return (
                    <button
                      onClick={(e) => {
                        const previousNodes = returnPreviousNodeList(
                          techtreeData.linkList,
                          techtreeData.nodeList,
                          node
                        )
                        const nextNodes = returnNextNodeList(
                          techtreeData.linkList,
                          techtreeData.nodeList,
                          node
                        )
                        dispatch(selectNode(previousNodes, nextNodes, node))
                      }}
                    >
                      {node.name}
                    </button>
                  )
                })}
              </div>
              <div>nextNode</div>
              <div>
                {nextNodeList.map((node) => {
                  return (
                    <button
                      onClick={() => {
                        const previousNodes = returnPreviousNodeList(
                          techtreeData.linkList,
                          techtreeData.nodeList,
                          node
                        )
                        const nextNodes = returnNextNodeList(
                          techtreeData.linkList,
                          techtreeData.nodeList,
                          node
                        )
                        dispatch(selectNode(previousNodes, nextNodes, node))
                      }}
                    >
                      {node.name}
                    </button>
                  )
                })}
              </div>
              <MarkdownRenderingBlock content={content} />
            </>
          )}
        </SideMarkdownSection>
      </HalfWidthContainer>
      <button
        onClick={() => {
          dispatch(editDocument())
          console.log('도큐먼트 수정:', isEditingDocument)
        }}
      >
        {' '}
        수정시작
      </button>
      <button
        onClick={() => {
          dispatch(finishDocuEdit(selectedNode.id, title, content))
        }}
      >
        {' '}
        수정끝
      </button>
    </MainLayout>
  )
}

const SideMarkdownSection = styled.div`
  border: '1px solid #00bebe';
`
const StyledTitleInput = styled.input`
  height: 60px;
  font-size: 30px;
  font-weight: bold;
  cursor: text;
  border: none;
  outline: none;
  padding: 0.2rem;
  width: 42vw;
`