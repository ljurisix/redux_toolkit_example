import { Typography } from "antd";
import moment from "moment";
import { useSelector } from "react-redux";
import { selectUserById } from "../users/redux/usersSlice";

const Meta = ({ userId, timestamp }) => {
  const { Text } = Typography;
  
  //const users = useSelector(selectAllUsers);
  const author = useSelector((state) => selectUserById(state, Number(userId)));
  
  let ago = "";
  if (timestamp) {
    ago = moment(timestamp).fromNow();
  }
  return (
    <Text type="secondary">
      | {author ? author.name : "Unknown author"}, {ago}
    </Text>
  );
};
export default Meta;
