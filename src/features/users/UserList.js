import { List } from "antd";
import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { selectAllUsers } from "./redux/usersSlice";

const UserList = () => {
  const users = useSelector(selectAllUsers);

  return (
    <section>
      <List
        style={{ backgroundColor: "white" }}
        bordered
        header={<div>Users</div>}
        dataSource={users}
        renderItem={(user) => (
          <List.Item key={user.id}>
            <Link to={`/user/${user.id}`}>{user.name}</Link>
          </List.Item>
        )}
      />
    </section>
  );
};

export default UserList;
