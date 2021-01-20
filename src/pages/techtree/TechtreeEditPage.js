import TechtreeEditor from '../../components/techtree/TechtreeEditor'
import MarkdownEditorBlock from '../../components/MarkdownEditorBlock'
import MarkdownRenderingBlock from '../../components/MarkdownRenderingBlock'
import React, { useDebugValue, useEffect } from 'react'
import MainLayout from '../../components/layout/MainLayout'
import HalfWidthContainer from '../../components/layout/HalfWidthContainer'
//import '../../styles/page/HomePage.scss'
import { dummyTechtree } from '../../lib/dummyTechtree'
import { useState, useCallback } from 'react'
import styled from 'styled-components'
import { useSelector, useDispatch } from 'react-redux'
import { editDocument, finishEdit } from '../../redux/techtree'
import { select } from 'd3'

export default function HomePage() {
  const { selectedNode } = useSelector((state) => {
    return { selectedNode: state.techtree.selectedNode }
  })
  const [content, setContent] = useState('')
  const { isEditingDocument, isEditingTechtree } = useSelector((state) => {
    return {
      isEditingDocument: state.techtree.isEditingDocument,
      isEditingTechtree: state.techtree.isEditingTechtree,
    }
  })
  useEffect(() => {
    setContent(selectedNode.body)
  }, [selectedNode])

  const dispatch = useDispatch()

  const onChangeContent = useCallback(
    (value) => {
      setContent(value)
    },
    [content]
  )

  return (
    <MainLayout>
      <TechtreeEditor techtreeData={dummyTechtree.cs} category={'cs'} />

      <HalfWidthContainer>
        <SideMarkdownSection
          className="techtreeMarkdownSection"
          style={{ display: 'none' }}
        >
          {isEditingDocument ? (
            <MarkdownEditorBlock
              contentProps={content}
              onChangeContentProps={onChangeContent}
              width="42vw"
              height="350px"
            />
          ) : (
            <MarkdownRenderingBlock content={content} />
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
          dispatch(finishEdit())
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
