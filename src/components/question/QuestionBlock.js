import { Link } from 'react-router-dom';
import '../../styles/question/QuestionBlock.scss'

export default function QuestionBlock({ title, questionUID }) {
  return (
    <div className="questionBlock">
      <Link to={`/question/${questionUID}`}>{title}</Link>
    </div>
  );
}
