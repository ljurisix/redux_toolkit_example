import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import ImageForm from "./features/images/ImageForm";
import ImageList from "./features/images/ImageList";
import ImageView from "./features/images/ImageView";
import EditPostForm from "./features/posts/EditPostForm";
import AddPostForm from "./features/posts/PostForm";
import PostsList from "./features/posts/PostsList";
import PostView from "./features/posts/PostView";
import UserList from "./features/users/UserList";
import UserPage from "./features/users/UserPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<PostsList />} />

        <Route path="post">
          <Route index element={<AddPostForm />} />
          <Route path=":postId" element={<PostView />} />
          <Route path="edit/:postId" element={<EditPostForm />} />
        </Route>

        <Route path="user">
          <Route index element={<UserList />} />
          <Route path=":userId" element={<UserPage />} />
        </Route>

        <Route path="images">
          <Route index element={<ImageList />} />
          <Route path=":imgId" element={<ImageView />} />
          <Route path="addImage" element={<ImageForm />} />
        </Route>

        {<Route path="*" element={<Navigate to="/" replace />} />}
      </Route>
    </Routes>
  );
}

export default App;
