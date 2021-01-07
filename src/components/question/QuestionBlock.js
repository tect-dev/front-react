import { Link } from 'react-router-dom';
import '../../styles/question/QuestionBlock.scss'

export default function QuestionBlock({ question }) {
  console.log(question)

  return (
      <Link className="questionBlock" to={`/question/${question.questionID}`}>
        <div className="questionBlock-head">
          {/* 1000만 미만의 포인트에 대해서는 PC 버전이 깨지지 않음.✭ */}
          <div className="questionBlock-points"> ✭ 1,000,000</div>
          <div className="answerNum-container">2</div>
          <div>Answers</div>
        </div>
        <div className="questionBlock-main">
          <div className="questionBlock-main-upside">
            <div className="questionBlock-title">
              {question.title}
            </div>
            <div className="questionBlock-content">
              {question.content}
            </div>
          </div>
          <div className="questionBlock-main-downside">
            <div className="questionBlock-hashtag">
              #예제태그
            </div>
            <div className="questionBlock-hashtag">
              #실험태그ddddddㅇㅇㅇㅇ
            </div>
            <div className="questionBlock-hashtag">
              #가즈아앙아아아아앙
            </div>
          </div>
        </div>
      </Link>
  );
}
