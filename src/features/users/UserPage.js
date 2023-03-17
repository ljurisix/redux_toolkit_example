import { List } from "antd";
import React from "react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { selectPostByUser } from "../posts/redux/postsSlice";
import { selectUserById } from "./redux/usersSlice";

const UserPage = () => {
  const { userId } = useParams();
  
  const user = useSelector((state) => selectUserById(state, Number(userId)));

  const userPosts = useSelector((state) =>
    selectPostByUser(state, Number(userId))
  );

  return (
    <section>
      <List
        bordered
        style={{ backgroundColor: "white" }}
        header={<div>{user.name}</div>}
        dataSource={userPosts}
        renderItem={(post) => (
          <List.Item key={post.id}>
            <Link to={`/post/${post.id}`}>{post.title}</Link>
          </List.Item>
        )}
      />
    </section>
  );
};

export default UserPage;
