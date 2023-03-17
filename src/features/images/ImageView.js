import { Image, Space, Tag, Typography } from "antd";
import React from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { selectImageById } from "./redux/imageSlice";

const ImageView = () => {
  const { imgId } = useParams();
  const { Title, Text } = Typography;

  const img = useSelector((state) => selectImageById(state, Number(imgId)));
  return (
    <section className="imageSection">
      <Image preview={false} src={img.url} />
      <Title>{img.title}</Title>
      {img.tags ? (
        <Space>
          {img.tags.map((tag) => (
            <Tag key={tag} color={tag}>
              {tag}
            </Tag>
          ))}
        </Space>
      ) : (
        <></>
      )}

      <Text>{img.description}</Text>
    </section>
  );
};

export default ImageView;
