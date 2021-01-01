import { Link } from 'react-router-dom';

export default function QuestionBlock({ title, questionUID }) {
  return (
    <div>
      <Link to={`/question/detail/${questionUID}`}>{title}</Link>
    </div>
  );
}
