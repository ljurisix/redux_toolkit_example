import { Image, List, Space } from "antd";
import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Button } from "../../components/Button";
import { selectAllImages } from "./redux/imageSlice";

const ImageList = () => {
  const images = useSelector(selectAllImages);

  return (
    <section>
      <Space>
        <Link to={`addImage`}>
          <Button primary label={"New Img"} />
        </Link>
      </Space>

      <List
        grid={{
          gutter: 16,
          column: 3,
        }}
        dataSource={images.images}
        renderItem={(img) => (
          <List.Item key={img.id}>
            <Space direction="vertical" width={"auto"}>
              <Image preview={false} src={img.url} />
              <Link to={`/images/${img.id}`}>{img.title}</Link>
            </Space>
          </List.Item>
        )}
      />
    </section>
  );
};

export default ImageList;
