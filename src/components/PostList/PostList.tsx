import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Post } from "../../types/post";
import css from "./PostList.module.css";
import { deletePost } from "../../services/postService";
import Loader from "../Loader/Loader";
import toast from "react-hot-toast";

interface PostListProps {
  posts: Post[];
  toggleModal: () => void;
  toggleEditPost: (post: Post) => void;
  searchQuery: string;
  page: number;
}

export default function PostList({
  posts,
  toggleModal,
  toggleEditPost,
  searchQuery,
  page,
}: PostListProps) {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation<void, Error, number>({
    mutationFn: (id: number) => deletePost(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts", searchQuery, page] });
      toast.success("Post deleted successfully!");
    },
    onError: () => {
      toast.error("Failed to delete post.");
    },
  });

  if (posts.length === 0)
    return (
      <p className={css.empty}>
        {searchQuery
          ? `No posts for "${searchQuery}". Create one to get started!`
          : "No posts yet. Create one to get started!"}
      </p>
    );

  return (
    <>
      {deleteMutation.isPending && <Loader />}
      <ul className={css.list}>
        {posts.map((post) => (
          <li className={css.listItem} key={post.id}>
            <h2 className={css.title}>{post.title}</h2>
            <p className={css.content}>{post.body}</p>
            <div className={css.footer}>
              <button
                className={css.edit}
                onClick={() => {
                  toggleModal();
                  toggleEditPost(post);
                }}
              >
                Edit
              </button>
              <button
                className={css.delete}
                onClick={() => deleteMutation.mutate(post.id)}
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? "Deleting..." : "Delete"}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
