import { Form, Input, Select, Tag } from "antd";
import { useForm } from "antd/es/form/Form";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/Button";
import { createImage } from "./redux/imageSlice";

// https://cdn.discordapp.com/attachments/836229177082118207/1080439582329417818/d8hdwmv-9b51005d-8d16-4f8a-bf4a-4b460389e630.png

const ImageForm = () => {
  const dispatch = useDispatch();

  const { TextArea } = Input;

  const [form] = useForm();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState([]);

  const [addRequestStatus, setAddRequestStatus] = useState("idle");

  const canSave =
    [title, url, description].every(Boolean) && addRequestStatus === "idle";

  const options = [
    { value: "magenta" },
    { value: "red" },
    { value: "volcano" },
    { value: "orange" },
    { value: "gold" },
    { value: "lime" },
    { value: "green" },
    { value: "cyan" },
    { value: "blue" },
    { value: "geekblue" },
    { value: "purple" },
  ];

  const handleChange = (value) => {
    setTags(value);
  };

  const tagRender = (props) => {
    const { label, value, closable, onClose } = props;
    const onPreventMouseDown = (event) => {
      event.preventDefault();
      event.stopPropagation();
    };
    return (
      <Tag
        color={value}
        onMouseDown={onPreventMouseDown}
        closable={closable}
        onClose={onClose}
        style={{
          marginRight: 3,
        }}
      >
        {label}
      </Tag>
    );
  };

  const onFinish = () => {
    try {
      setAddRequestStatus("pending");
      // unwrap() returns a NEW promise that contains the action payload (if fulfilled) OR an error (if rejected)!
      dispatch(createImage({ title, description, url, tags })).unwrap();

      // reset state values
      setTitle("");
      setUrl("");
      form.resetFields();
      navigate("/images");
    } catch (err) {
      console.error("Failed to save!", err);
    } finally {
      setAddRequestStatus("idle");
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const onTitleChanged = (e) => setTitle(e.target.value);
  const onUrlChanged = (e) => setUrl(e.target.value);
  const onDescriptionChanged = (e) => setDescription(e.target.value);

  return (
    <section>
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
          label="Image Title"
          rules={[{ required: true, message: "Please input image title!" }]}
        >
          <Input value={title} onChange={onTitleChanged} />
        </Form.Item>

        <Form.Item
          label="Description"
          name="description"
          rules={[
            { required: true, message: "Please input image description!" },
          ]}
        >
          <TextArea
            rows={3}
            value={description}
            onChange={onDescriptionChanged}
          />
        </Form.Item>

        <Form.Item
          label="Image URL"
          rules={[{ required: true, message: "Please input image URL!" }]}
        >
          <Input value={url} onChange={onUrlChanged} />
        </Form.Item>

        <Form.Item label="Tags">
          <Select
            mode="multiple"
            showArrow
            tagRender={tagRender}
            onChange={handleChange}
            style={{
              width: "100%",
            }}
            options={options}
          />
        </Form.Item>

        <Form.Item>
          <Button
            disabled={!canSave}
            primary
            onClick={onFinish}
            label={"Submit"}
          />
        </Form.Item>
      </Form>
    </section>
  );
};

export default ImageForm;
