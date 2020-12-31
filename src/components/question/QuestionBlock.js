import { Link } from 'react-router-dom';

export default function QuestionBlock({ title, questionID }) {
  return (
    <div>
      <Link to={`/question/detail/${questionID}`}>{title}</Link>
    </div>
  );
}
