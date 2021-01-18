import { Link } from 'react-router-dom'
import '../../styles/question/QuestionBlock.scss'

export default function QuestionBlock({ question }) {
  const summaryContent = question.questionBody.content.substr(0, 200)
  //console.log(summaryContent);
  return (
    <Link className="questionBlock" to={`/question/${question._id}`}>
      <div className="questionBlock-head">
        {/* 1000만 미만의 포인트에 대해서는 PC 버전이 깨지지 않음.✭ */}
        {/*<div className="questionBlock-points"> ✭ 1,000,000</div>*/}
        <div className="answerNum-container">
          {question?.answerList?.length | 0}
        </div>
        <div>Answers</div>
      </div>
      <div className="questionBlock-main">
        <div className="questionBlock-main-upside">
          <div className="questionBlock-title">
            {question.questionBody.title}
          </div>
          <div className="questionBlock-content">{summaryContent}...</div>
        </div>
        <div className="questionBlock-main-downside">
          {question.questionBody.hashtags.map((element, index) => {
            return (
              <div className="questionBlock-hashtag" key={index}>
                {element}
              </div>
            )
          })}
        </div>
      </div>
    </Link>
  )
}
