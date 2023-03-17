import { Spin } from "antd";
import { useSelector } from "react-redux";
import PostsExcerpt from "./PostsExcerpt";
import {
  selectError,
  selectPostIds,
  selectStatus
} from "./redux/postsSlice";

const PostsList = () => {
  const postIds = useSelector(selectPostIds);
  const postStatus = useSelector(selectStatus);
  const error = useSelector(selectError);

  let content;
  if (postStatus === "loading") {
    content = <Spin />;
  } else if (postStatus === "succeeded") {
    // OBSOLETE: sorting is done in entityAdapter in slice
    // const orderedPosts = posts
    //   .slice()
    //   .sort((a, b) => b.date.localeCompare(a.date));
    // content = orderedPosts.map((post) => (
    //   <PostsExcerpt key={post.id} post={post} />
    // ));
    content = postIds.map((postId) => (
      <PostsExcerpt key={postId} postId={postId} />
    ));
  } else if (postStatus === "failed") {
    content = <p>{error}</p>;
  }

  return <section>{content}</section>;
};
export default PostsList;
