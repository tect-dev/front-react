import React, { useState } from 'react'
import "../styles/Pagination.scss"

import QuestionBlock from './question/QuestionBlock'

export const Pagination = ({ data, total }) => {

  // total 인자를 백엔드에서 받기 전까지 임시로 사용
  !total ? total=data.length : console.log("")

  const [ nowPage, setNowPage ] = useState(1)
  // page당 어느 정도의 게시물을 보여줄 것인가
  const [ perPage, setPerPage ] = useState(3)

  // pagination에서 최초와 끝을 제외한 나머지 pageBtn을
  // 얼마나 보여줄 것인가.
  const [ btnShowNum, setBtnShowNum ] =useState(3)
  const [ pageBtns, setPageBtns ] = useState(
    [...Array(Math.ceil( total / perPage )).keys()]
  )

  const PageBtn = ({ element }) => {
    return(
      <li key={element}
      className={`page-btn ${element+1===nowPage ? 'present' : ''}`}
      onClick={()=>setNowPage(element + 1)}
      >
        {element + 1}
      </li>
    )
  }

  const showPageBtns = () => {
    return (
      pageBtns.map((element, index) => {
        return(
          <>
            {nowPage < (element + 2) - btnShowNum && element===pageBtns[pageBtns.length -1]
              ? "..."
              : ""}

            {(index===pageBtns[0] | index===pageBtns[pageBtns.length - 1])
            ? <PageBtn element={element} key={index}/>
            :  element >= (nowPage - 1) - (btnShowNum / 2) & element <= (nowPage - 1) + (btnShowNum / 2)
              ? <PageBtn element={element} key={index}/>
              : null}

            {nowPage > (pageBtns[0] + 2) && index===pageBtns[0]
              ? "..."
              : ""}

          </>
        )
      })
    )
  }

  return (
    <>
      {data
        ? data.map((element, index) => {
          if(  perPage * (nowPage - 1) <= index 
                && index < perPage * nowPage) {
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
              pageBtns.length > btnShowNum
              ?
              <>
                {<li key='prev-pageBtn'
                  className="page-btn" onClick={()=>{
                    if(nowPage != 1){
                      setNowPage(nowPage - 1)
                    }
                  }}>
                    {"<<"}
                </li>}

                {showPageBtns()}

                {<li key='next-pageBtn'
                  className="page-btn" onClick={()=>{
                    if(nowPage != Math.ceil( total / perPage )){
                      console.log(nowPage)
                      setNowPage(nowPage + 1)
                    }
                  }}>
                    {">>"}
                </li>}
              </>
              : showPageBtns()
            }
          </ul>
        </nav>
    </>
  )
}
