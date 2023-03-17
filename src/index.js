import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import App from "./App";
import { store } from "./app/store";
import { fetchImages } from "./features/images/redux/imageSlice";
import { fetchPosts } from "./features/posts/redux/postsSlice";
import { fetchUsers } from "./features/users/redux/usersSlice";
import "./index.css";

store.dispatch(fetchPosts());
store.dispatch(fetchUsers());
store.dispatch(fetchImages())

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/*" element={<App />} />
        </Routes>
      </Router>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);
