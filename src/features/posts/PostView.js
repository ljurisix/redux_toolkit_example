import { Empty, Space, Typography } from "antd";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import Card from "../../components/Card";
import ImagePreview from "../images/ImagePreview";
import Meta from "./Meta";
import Reactions from "./ReactionButtons";
import { selectPostById } from "./redux/postsSlice";

const PostView = () => {
  const { postId } = useParams();

  const { Text } = Typography;

  const post = useSelector((state) => selectPostById(state, Number(postId)));

  if (!post) {
    return (
      <Space>
        <Empty />
      </Space>
    );
  }

  return (
    <Card title={post.title}>
      <Space direction="vertical" size={16}>
        <Text>{post.body}</Text>
        {post.imgId ? <ImagePreview imgId={post.imgId} /> : <></>}

        <Link to={`/post/edit/${post.id}`}>Edit Post</Link>
        <Meta userId={post.userId} timestamp={post.date} />
        <Reactions post={post} />
      </Space>
    </Card>
  );
};

export default PostView;
