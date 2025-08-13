import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Post } from "../../types/post";
import css from "./PostList.module.css";
import { deletePost } from "../../services/postService";
import Loader from "../Loader/Loader";


interface PostListProps{
  posts?: Post[];
  onEdit?: (post: Post) => void;
}

export default function PostList({ posts=[], onEdit }: PostListProps) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn:(id: number) => deletePost(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['posts']
      });
    }
  })

  if (posts.length === 0) return <p className="css.empty">No posts yet. Create one to get started!</p>;

  return (
    <>
    {mutation.isPending && (<Loader />)}
    <ul className={css.list}>
        {posts.map((post) => (
          <li className={css.listItem} key={post.id}>
            <h2 className={css.title}>{ post.title }</h2>
            <p className={css.content}>{ post.body }</p>
        <div className={css.footer}>
              <button className={css.edit} onClick={()=>onEdit && onEdit(post)}>Edit</button>
              <button className={css.delete} onClick={()=>mutation.mutate(post.id)}>Delete</button>
        </div>
      </li>
        ))}
    </ul>
    </>
  );
}
