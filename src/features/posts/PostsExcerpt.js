import { Space, Typography } from "antd";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Card from "../../components/Card";
import Meta from "./Meta";
import Reactions from "./ReactionButtons";
import { selectPostById } from "./redux/postsSlice";

const { Text } = Typography;

const PostsExcerpt = ({ postId }) => {
  const post = useSelector((state) => selectPostById(state, postId));
  return (
    <Card
      title={post.title}
      children={
        <Space direction="vertical" size={16}>
          <Space>
            <Text>{post.body.substring(0, 50)}...</Text>
            <Link to={`post/${post.id}`}>View Post</Link>
          </Space>

          <Meta userId={post.userId} timestamp={post.date} />
          <Reactions post={post} />
        </Space>
      }
    />
  );
};
export default PostsExcerpt;
