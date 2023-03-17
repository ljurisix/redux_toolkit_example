import { Image } from "antd";
import React from "react";
import { useSelector } from "react-redux";
import { selectImageById } from "./redux/imageSlice";

const ImagePreview = ({ imgId }) => {
  const img = useSelector((state) => selectImageById(state, Number(imgId)));

  return <Image width={200} src={img.url} />;
};

export default ImagePreview;
