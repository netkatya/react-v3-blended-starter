import Modal from "../Modal/Modal";
import PostList from "../PostList/PostList";
import SearchBox from "../SearchBox/SearchBox";
import Pagination from "../Pagination/Pagination";
import css from "./App.module.css";
import { useQuery } from "@tanstack/react-query";
import { fetchPosts, FetchPostsResponse } from "../../services/postService";
import { useDebounce } from "use-debounce";
import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import EditPostForm, { FormValues } from "../EditPostForm/EditPostForm";
import PostForm from "../CreatePostForm/CreatePostForm";
import Loader from "../Loader/Loader";
import ThemeToggle from "../ThemeToggle/ThemeToggle";
import { motion, AnimatePresence } from "framer-motion";
// import {enable, disable} from 'darkreader';


export default function App() {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreatePost, setIsCreatePost] = useState(false);
  const [isEditPost, setIsEditPost] = useState(false);
  const [editedPost, setEditedPost] = useState<FormValues | null>(null);

  const [debouncedSearchQuery] = useDebounce(searchQuery, 300);

  // theme
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    if (isDark) {
      localStorage.setItem("theme", "dark");
      document.body.classList.add('dark-theme');
    } else {
      localStorage.setItem("theme", "light");
      document.body.classList.remove('dark-theme');
    }
  }, [isDark]);


//interesting, but how to customize separate items?
  
// useEffect(() => {
//   if (isDark) {
//     enable({

//     });
//   } else {
//     disable();
//   }

//   return () => {
//     disable();
//   };
// }, [isDark]);

  const { data, isFetching } = useQuery<FetchPostsResponse>({
    queryKey: ["posts", debouncedSearchQuery, page],
    queryFn: () => fetchPosts(debouncedSearchQuery, page),
    // for some reasons keepPreviousData returns error, is it issue of react version? 
    placeholderData: (prev) => prev,
    staleTime: 1000 * 60,
  })

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setPage(1);
  }

  const handlePageChange = (page: number) => setPage(page);
   

  const openCreatePostModal = () => {
    setIsCreatePost(true);
    setIsModalOpen(true);
    setEditedPost(null);
    setIsEditPost(false);
  }

  const openEditPostModal = (post: FormValues) => {
    setIsEditPost(true);
    setEditedPost(post);
    setIsModalOpen(true);
    setIsCreatePost(false);
  }

  const closeModal = () => {
    setIsModalOpen(false);
    setIsCreatePost(false);
    setIsEditPost(false);
    setEditedPost(null);
  }



  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={searchQuery} onChange={ handleSearchChange } />
        { data && data.totalPages > 1 && <Pagination totalPages={data.totalPages} currentPage={page} onPageChange={handlePageChange}/> }
        <button className={css.button} onClick={openCreatePostModal}>Create post</button>
        <ThemeToggle isDark={ isDark } onToggle={()=>setIsDark(!isDark)}/>
      </header>
      {isModalOpen && (<Modal onClose={closeModal}>
        {isCreatePost && <PostForm onCancel={closeModal} searchQuery={ debouncedSearchQuery} page={page} />}
        {isEditPost && editedPost && <EditPostForm initialValues={editedPost} onCancel={closeModal} searchQuery={ debouncedSearchQuery} page={page} />}
      </Modal>)}
      {isFetching && <Loader />}
      {data && data.posts && (
  <AnimatePresence mode="wait">
    <motion.div
      key={page} // важный момент — анимация будет при смене page
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
    >
      <PostList
        posts={data.posts}
        searchQuery={debouncedSearchQuery}
        page={page}
        toggleModal={() => setIsModalOpen(true)}
        toggleEditPost={(post) =>
          openEditPostModal({
            id: post.id,
            title: post.title,
            body: post.body,
          })
        }
      />
    </motion.div>
  </AnimatePresence>
)}
      <Toaster position="top-right" />
    </div>
  );
}
