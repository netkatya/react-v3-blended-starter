import Modal from "../Modal/Modal";
import PostList from "../PostList/PostList";
import SearchBox from "../SearchBox/SearchBox";
import Pagination from "../Pagination/Pagination";

import css from "./App.module.css";

export default function App() {
  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox />
        {/* <Pagination /> */}
        <button className={css.button}>Create post</button>
      </header>
      {/* <Modal>{<CreatePostForm/> <EditPostForm />}</Modal> */}
      <PostList />
    </div>
  );
}
