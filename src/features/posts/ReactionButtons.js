import { Space } from "antd";
import { useDispatch } from "react-redux";
import { reactionAdded } from "./redux/postsSlice";
import { Button } from "../../components/Button";

const reactionEmoji = {
  heart: "♡",
  lol: "LOL",
  what: "WTF",
};

const Reactions = ({ post }) => {
  const dispatch = useDispatch();

  const reactionButtons = Object.entries(reactionEmoji).map(([name, btn]) => {
    return (
      <Button
        size="small"
        key={name}
        label={`${btn} ${post.reactions[name]}`}
        onClick={() =>
          dispatch(reactionAdded({ postId: post.id, reaction: name }))
        }
      />
    );
  });

  return <Space>{reactionButtons}</Space>;
};
export default Reactions;
