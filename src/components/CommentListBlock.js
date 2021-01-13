import MarkdownRenderingBlock from './MarkdownRenderingBlock';

export default function CommentListBlock({ commentList }) {
  return (
    <>
      {commentList.map((comment, index) => {
        return (
          <div key={index}>
            <div>{comment.authorNickname}</div>
            <MarkdownRenderingBlock content={comment.content} />
          </div>
        );
      })}
    </>
  );
}
