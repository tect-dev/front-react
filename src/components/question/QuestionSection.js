import MarkdownRenderingBlock from '../MarkdownRenderingBlock';
import CommentListBlock from '../CommentListBlock';
import MarkdownEditorBlock from '../MarkdownEditorBlock';

export default function QuestionSection({ data }) {
  return (
    <>
      <div className="title">{data.question.questionBody.title}</div>
      <div className="content">
        <MarkdownRenderingBlock content={data.question.questionBody.content} />
      </div>
      <div className="hashtags">
        {data.question.questionBody.hashtags.map((tag) => {
          return <div>{tag}</div>;
        })}
      </div>
      {/*<CommentListBlock commentList={question.comments} />*/}

      <MarkdownEditorBlock
        className="questionCommentWrtie"
        contentType={'comment'}
        bindingID={data.question._id}
      />
    </>
  );
}
