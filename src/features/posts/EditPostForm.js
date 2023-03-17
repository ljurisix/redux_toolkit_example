import { Empty, Form, Input, Select, Space, Typography } from "antd";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../../components/Button";
import { selectAllImages } from "../images/redux/imageSlice";
import { selectAllUsers } from "../users/redux/usersSlice";
import { deletePost, selectPostById, updatePost } from "./redux/postsSlice";

const EditPostForm = () => {
  const { postId } = useParams();
  const navigate = useNavigate();

  const { TextArea } = Input;
  const { Option } = Select;
  const { Title } = Typography;

  const post = useSelector((state) => selectPostById(state, Number(postId)));
  const users = useSelector(selectAllUsers);
  const images = useSelector(selectAllImages);

  const [form] = Form.useForm();
  const [title, setTitle] = useState(post?.title);
  const [content, setContent] = useState(post?.body);
  const [userId, setUserId] = useState(post?.userId);
  const [imgId, setImgId] = useState("");

  const [requestStatus, setRequestStatus] = useState("idle");

  const dispatch = useDispatch();

  if (!post) {
    return (
      <section>
        <Empty />
      </section>
    );
  }

  const onTitleChanged = (e) => setTitle(e.target.value);
  const onContentChanged = (e) => setContent(e.target.value);

  const canSave =
    [title, content, userId].every(Boolean) && requestStatus === "idle";

  const onFinish = () => {
    if (canSave) {
      try {
        setRequestStatus("pending");
        // dispatch without date, date is updated in slice
        dispatch(
          updatePost({
            id: post.id,
            title,
            body: content,
            userId,
            imgId,
            reactions: post.reactions,
          })
        ).unwrap();

        // empty states
        setTitle("");
        setContent("");
        setUserId("");
        form.resetFields();
        navigate(`/post/${postId}`);
      } catch (err) {
        console.error("Failed to save!", err);
      } finally {
        setRequestStatus("idle");
      }
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const userOptions = users.map((user) => (
    <Option key={user.id} value={user.id}>
      {user.name}
    </Option>
  ));

  const imgOptions = images.images.map((img) => (
    <Option key={img.id} value={img.id}>
      {img.title}
    </Option>
  ));

  const onDelete = () => {
    try {
      setRequestStatus("pending");
      dispatch(deletePost({ id: post.id })).unwrap();

      setTitle("");
      setContent("");
      setUserId("");
      form.resetFields();
      navigate("/");
    } catch (err) {
      console.error("Failed to delete!", err);
    } finally {
      setRequestStatus("idle");
    }
  };

  return (
    <section>
      <Title>Edit Post</Title>
      <Form
        form={form}
        name="basic"
        initialValues={{
          title: title,
          content: content,
          author: userId,
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        layout="vertical"
        style={{
          marginTop: "2em",
        }}
      >
        <Form.Item
          label="Title"
          name="title"
          rules={[{ required: true, message: "Please input post title!" }]}
        >
          <Input value={title} onChange={onTitleChanged} />
        </Form.Item>
        <Form.Item
          label="Content"
          name="content"
          rules={[{ required: true, message: "Please input post content!" }]}
        >
          <TextArea rows={3} value={content} onChange={onContentChanged} />
        </Form.Item>

        <Form.Item
          label="Author"
          name="author"
          rules={[{ required: true, message: "Please select post author!" }]}
        >
          <Select value={userId} onChange={(value) => setUserId(value)}>
            {userOptions}
          </Select>
        </Form.Item>

        <Form.Item label="Pick existing image" name="imgId">
          <Select value={imgId} onChange={(value) => setImgId(value)}>
            {imgOptions}
          </Select>
        </Form.Item>

        <Form.Item>
          <Space>
            <Button
              disabled={!canSave}
              primary
              htmlType="submit"
              onClick={onFinish}
              label={"Submit"}
            />
            <Button danger onClick={onDelete} label="Delete Post" />
          </Space>
        </Form.Item>
      </Form>
    </section>
  );
};

export default EditPostForm;
