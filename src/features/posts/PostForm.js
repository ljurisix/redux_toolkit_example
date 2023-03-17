import { Form, Input, Select, Typography } from "antd";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/Button";
import { selectAllImages } from "../images/redux/imageSlice";
import { selectAllUsers } from "../users/redux/usersSlice";
import { createPost } from "./redux/postsSlice";

const AddPostForm = () => {
  const dispatch = useDispatch();

  const { TextArea } = Input;
  const { Option } = Select;
  const { Title } = Typography;

  const navigate = useNavigate();

  const [form] = Form.useForm();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [userId, setUserId] = useState("");
  const [imgId, setImgId] = useState("");

  const [addRequestStatus, setAddRequestStatus] = useState("idle");

  const users = useSelector(selectAllUsers);
  const images = useSelector(selectAllImages);

  const onTitleChanged = (e) => setTitle(e.target.value);
  const onContentChanged = (e) => setContent(e.target.value);

  // if all states exist and reqStatus is idle
  const canSave =
    [title, content, userId].every(Boolean) && addRequestStatus === "idle";

  const onFinish = () => {
    if (canSave) {
      try {
        setAddRequestStatus("pending");
        // unwrap() returns a NEW promise that contains the action payload (if fulfilled) OR an error (if rejected)!
        dispatch(createPost({ title, body: content, userId, imgId })).unwrap();

        // reset state values
        setTitle("");
        setContent("");
        setUserId("");
        form.resetFields();
        navigate("/");
      } catch (err) {
        console.error("Failed to save!", err);
      } finally {
        setAddRequestStatus("idle");
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

  return (
    <div
      style={{
        marginTop: "1em",
      }}
    >
      <Title>New Post</Title>
      <Form
        form={form}
        name="basic"
        initialValues={{ remember: true }}
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

        <Form.Item label="Pick image" name="imgId">
          <Select value={imgId} onChange={(value) => setImgId(value)}>
            {imgOptions}
          </Select>
        </Form.Item>

        <Form.Item>
          <Button
            disabled={!canSave}
            primary
            onClick={onFinish}
            label="Submit"
          />
        </Form.Item>
      </Form>
    </div>
  );
};
export default AddPostForm;
