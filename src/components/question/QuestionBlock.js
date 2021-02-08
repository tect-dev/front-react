import { Link } from 'react-router-dom'
import '../../styles/question/QuestionBlock.scss'
import { useSelector, useDispatch } from 'react-redux'
import { readHashtagResults } from '../../redux/readPost'
import styled from 'styled-components'

const Hashtag = styled.div`
  display: inline-flex;
  border-radius: 5px;
  background: #00bebe;
  color: rgba(255, 255, 255, 0.9);
  padding: 2px 2px;
  margin: 2px 2px 0 2px;
  width: inherit;
  z-index: 100;

  &:hover {
    background: #00aabe;
    color: rgba(255, 255, 255, 1);
    transition: all ease-in 0.2s;
  }
`

export default function QuestionBlock({ question }) {
  const dispatch = useDispatch()
  const summaryContent = question?.contentSubstring
    ? question?.contentSubstring
    : question?.content?.substr(0, 200)

  const searchHashtag = (e) => {
    e.preventDefault()
    const hashtag = e.target.innerText
    dispatch(readHashtagResults(hashtag))
  }
  return (
    <Link className="questionBlock" to={`/question/${question?._id}`}>
      <div className="questionBlock-head">
        {/* 1000만 미만의 포인트에 대해서는 PC 버전이 깨지지 않음.✭ */}
        {/*<div className="questionBlock-points"> ✭ 1,000,000</div>*/}
        <div className="answerNum-container">
          {question?.answerSum ? question?.answerSum : 0}
        </div>
        <div>Answers</div>
      </div>
      <div className="questionBlock-main">
        <div className="questionBlock-main-upside">
          <div className="questionBlock-title">{question?.title}</div>
          <div className="questionBlock-content">{summaryContent}...</div>
        </div>
        <div className="questionBlock-main-downside">
          {question?.hashtags?.map((element, index) => {
            return (
              <Hashtag key={index} onClick={searchHashtag}>
                {element}
              </Hashtag>
            )
          })}
        </div>
      </div>
    </Link>
  )
}
