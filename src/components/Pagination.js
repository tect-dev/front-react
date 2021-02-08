import React, { useState, useEffect } from 'react'
import { useHistory, useLocation, useParams } from 'react-router-dom'
import '../styles/Pagination.scss'

import QuestionBlock from './question/QuestionBlock'

export const Pagination = ({ data, total }) => {
  const history = useHistory()
  // total 인자를 백엔드에서 받기 전까지 임시로 사용
  !total ? (total = data.length) : (()=>{})()

  const pathname = useLocation().pathname

  // query 방식 삭제
  const { page } = useParams()
  // const [nowPage, setNowPage] = useState(page)
  let nowPage = typeof(page) === 'number' ? page : parseInt(page)

  // page당 어느 정도의 게시물을 보여줄 것인가
  const [perPage, setPerPage] = useState(5)

  // pagination에서 최초와 끝을 제외한 나머지 pageBtn을
  // 얼마나 보여줄 것인가.
  const [btnShowNum, setBtnShowNum] = useState(3)
  const [pageBtns, setPageBtns] = useState([
    ...Array(Math.ceil(total / perPage)).keys(),
  ])

  useEffect(()=>{
    return
  })
  const PageBtn = ({ element }) => {
    const arr = pathname.split('/')
    arr.pop()
    const basePath = arr.join("/")
    return (
      <li
        key={element}
        className={`page-btn ${element + 1 == nowPage ? 'present' : ''}`}
        onClick={() => {
          history.push({
            pathname: `${basePath}/${element + 1}`
          })
          nowPage = element + 1
          // setNowPage(element + 1)
        }}
      >
        {element + 1}
      </li>
    )
  }

  const showPageBtns = () => {
    return pageBtns.map((element, index) => {
      return (
        <>
          {nowPage < element + 2 - btnShowNum &&
          element === pageBtns[pageBtns.length - 1]
            ? '...'
            : ''}

          {(index === pageBtns[0]) |
          (index === pageBtns[pageBtns.length - 1]) ? (
            <PageBtn element={element} key={index} />
          ) : (element >= nowPage - 1 - btnShowNum / 2) &
            (element <= nowPage - 1 + btnShowNum / 2) ? (
            <PageBtn element={element} key={index} />
          ) : null}

          {nowPage > pageBtns[0] + 2 && index === pageBtns[0] ? '...' : ''}
        </>
      )
    })
  }

  return (
    <>
      {data
        ? data.map((element, index) => {
            if (perPage * (nowPage - 1) <= index && index < perPage * nowPage) {
              return (
                <div key={index}>
                  <QuestionBlock question={element} />
                </div>
              )
            } else {
              return null
            }
          })
        : ''}

      <nav className="pagination-nav">
        <ul className="page-list">
          {
            // n개가 넘어가면 ellipsis로 1에서 마지막까지 표시
            pageBtns.length > btnShowNum ? (
              <>
                {
                  <li
                    key="prev-pageBtn"
                    className="page-btn"
                    onClick={() => {
                      const arr = pathname.split('/')
                      arr.pop()
                      const basePath = arr.join("/")
                      if (nowPage != 1) {
                        nowPage = nowPage - 1
                        // setNowPage(nowPage - 1)
                        history.push({
                          pathname: `${basePath}/${nowPage}`
                        })
                      }
                    }}
                  >
                    {'<'}
                  </li>
                }

                {showPageBtns()}

                {
                  <li
                    key="next-pageBtn"
                    className="page-btn"
                    onClick={() => {
                      const arr = pathname.split('/')
                      arr.pop()
                      const basePath = arr.join("/")
                      if (nowPage != Math.ceil(total / perPage)) {
                        
                        nowPage = nowPage + 1
                        
                        // setNowPage(nowPage + 1)
                        history.push({
                          pathname: `${basePath}/${nowPage}`
                        })
                      }
                    }}
                  >
                    {'>'}
                  </li>
                }
              </>
            ) : (
              showPageBtns()
            )
          }
        </ul>
      </nav>
    </>
  )
}
