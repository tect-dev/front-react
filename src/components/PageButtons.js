import React, { useState, useCallback } from 'react'
import { useHistory } from 'react-router-dom'
import { DefaultButton, SelectedButton } from './Button'

const PageButtons = ({ pageNumber, treePerPage, postSum, routingString }) => {
  const [pageNum, setPageNum] = useState(parseInt(pageNumber, 10))
  const history = useHistory()
  const pageMaxNumber = Math.floor(postSum / treePerPage) + 1
  const pageArray = []
  for (let i = 0; i < pageMaxNumber; i++) {
    pageArray.push(i + 1)
  }

  const movePage = useCallback(
    (ele) => {
      setPageNum(ele)
      history.push(`/${routingString}?page=${ele}`)
    },
    [history, routingString]
  )

  return (
    <div style={{ display: 'inline' }}>
      {pageArray.map((ele, idx) => {
        // 1번이랑 마지막은 무조건 렌더링을 해야함.
        // 최소 5개는 렌더링 해야함.
        // pageNumber -2, -1, 0 , +1, +2 를 렌더링하고 +3에선 ...을 반환하고 이후 마지막것만 렌더링.
        // 그러나 pageNumber 가 3보다 작다면 1~5를 렌더링한다.

        if (ele === 1) {
          if (pageNum === ele) {
            return (
              <SelectedButton
                key={idx}
                onClick={() => {
                  movePage(ele)
                }}
              >
                {ele}
              </SelectedButton>
            )
          } else {
            return (
              <DefaultButton
                key={idx}
                onClick={() => {
                  movePage(ele)
                }}
              >
                {ele}
              </DefaultButton>
            )
          }
        } else if (ele === pageMaxNumber) {
          if (pageNum === ele) {
            return (
              <SelectedButton
                key={idx}
                onClick={() => {
                  movePage(ele)
                }}
              >
                {ele}
              </SelectedButton>
            )
          } else {
            return (
              <DefaultButton
                key={idx}
                onClick={() => {
                  movePage(ele)
                }}
              >
                {ele}
              </DefaultButton>
            )
          }
        } else {
          if (ele === pageNum) {
            return (
              <SelectedButton
                key={idx}
                onClick={() => {
                  movePage(ele)
                }}
              >
                {ele}
              </SelectedButton>
            )
          } else if (ele < pageNum + 3 && pageNum - 3 < ele) {
            return (
              <DefaultButton
                key={idx}
                onClick={() => {
                  movePage(ele)
                }}
              >
                {ele}
              </DefaultButton>
            )
          } else if (ele === pageNum - 3) {
            return <span key={idx}>...</span>
          } else if (ele === pageNum + 3) {
            return <span key={idx}>...</span>
          } else {
            return
          }
        }
      })}
    </div>
  )
}

export default React.memo(PageButtons)
