import Modal from "../Modal/Modal";
import PostList from "../PostList/PostList";
import SearchBox from "../SearchBox/SearchBox";
import Pagination from "../Pagination/Pagination";

import css from "./App.module.css";
import { useQuery } from "@tanstack/react-query";
import { fetchPosts, FetchPostsResponse } from "../../services/postService";
import { useDebounce } from "use-debounce";
import { useState } from "react";
import { Toaster } from "react-hot-toast";
import EditPostForm, { FormValues } from "../EditPostForm/EditPostForm";
import PostForm from "../CreatePostForm/CreatePostForm";

export default function App() {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"create" | "edit" | null>(null);
  const [editPostData, setEditPostData] = useState<FormValues | null>(null);

  const [debouncedSearchQuery] = useDebounce(searchQuery, 300);


  const { data, isFetching, isError, error } = useQuery<FetchPostsResponse>({
    queryKey: ["posts", debouncedSearchQuery, page],
    queryFn: () => fetchPosts(debouncedSearchQuery, page),
    placeholderData: (prev) => prev,
  })

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setPage(1);
  }

  const handlePageChange = (selectedPage: number) => {
    setPage(selectedPage);
  } 

  const openCreatePostModal = () => {
    setModalType("create");
    setIsModalOpen(true);
  }

  const openEditPostModal = (post: FormValues) => {
    setEditPostData(post);
    setModalType("edit");
    setIsModalOpen(true);
  }

  const closeModal = () => {
    setIsModalOpen(false);
    setModalType(null);
    setEditPostData(null);
  }



  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox />
        { data && data.totalPages > 1 && <Pagination totalPages={data.totalPages} currentPage={page} onPageChange={handlePageChange}/> }
        <button className={css.button} onClick={openCreatePostModal}>Create post</button>
      </header>
      {isModalOpen && (<Modal onClose={closeModal}>
        {modalType === "create" && <PostForm onCancel={closeModal} />}
        {modalType === "edit" && editPostData && <EditPostForm initialValues={editPostData} onCancel={closeModal} />}
      </Modal>)}
      <PostList />
      <Toaster position="top-right" />
    </div>
  );
}
