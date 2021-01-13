import MarkdownRenderingBlock from '../MarkdownRenderingBlock';
import CommentListBlock from '../CommentListBlock';
import MarkdownEditorBlock from '../MarkdownEditorBlock';

export default function AnswerSection({ data }) {
  return (
    <>
      {data.answers.map((element) => {
        return (
          <>
            <div className="content">
              <MarkdownRenderingBlock content={element.answerBody.content} />
            </div>

            {/* <CommentListBlock commentList={element.answerBody.comments} /> */}
            <MarkdownEditorBlock
              contentType={'comment'}
              bindingID={element._id}
            />
          </>
        );
      })}
      <MarkdownEditorBlock
        className="answerWrite"
        contentType={'answer'}
        bindingID={'question의 url'}
      />
    </>
  );
}
