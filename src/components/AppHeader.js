import {
  CameraOutlined,
  EditOutlined,
  HomeOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Button, Menu } from "antd";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { increaseCount, selectCount } from "../features/posts/redux/postsSlice";
import Header from "./Header";

const AppHeader = () => {
  const count = useSelector(selectCount);
  const dispatch = useDispatch();

  const [current, setCurrent] = useState("home");

  const onClick = (e) => {
    setCurrent(e.key);
  };

  const items = [
    {
      label: <Link to="/">Home</Link>,
      key: "home",
      icon: <HomeOutlined />,
    },
    {
      label: <Link to="post">New Post</Link>,
      key: "post",
      icon: <EditOutlined />,
    },
    {
      label: <Link to="user">Users</Link>,
      key: "user",
      icon: <UserOutlined />,
    },
    {
      label: <Link to="images">Images</Link>,
      key: "images",
      icon: <CameraOutlined />,
    },
    {
      label: (
        <Button
          onClick={() => {
            dispatch(increaseCount());
          }}
        >
          {count}
        </Button>
      ),
      key: "count",
    },
  ];

  return (
    <Header title="Redux & Storybook Test Blog">
      <Menu
        onClick={onClick}
        selectedKeys={[current]}
        mode="horizontal"
        items={items}
      />
    </Header>
  );
};

export default AppHeader;
