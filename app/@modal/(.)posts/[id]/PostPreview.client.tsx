'use client';

import { useQuery } from '@tanstack/react-query';
import Modal from '@/components/Modal/Modal';
import { fetchPostById, fetchUserById } from '@/lib/api';
import { useRouter } from 'next/navigation';

import css from './PostPreview.module.css';
import { User } from '@/types/user';
import { Post } from '@/types/post';
import Loading from '@/app/loading';

type PostPreviewClientProps = {
  id: number;
};

export default function PostPreviewClient({ id }: PostPreviewClientProps) {
  const router = useRouter();

  const { data: post, isLoading: postLoading } = useQuery<Post>({
    queryKey: ['post', id],
    queryFn: () => fetchPostById(id),
  });

  const userId = post?.userId;
  const {
    data: user,
    isLoading: userLoading,
    error: userError,
  } = useQuery<User>({
    queryKey: ['user', userId],
    queryFn: () => fetchUserById(userId!),
    placeholderData: (prev) => prev,
    refetchOnMount: false,
  });

  const handleClose = () => router.back();

  if (postLoading) return <Loading />;
  if (!post) return <p>Failed to load post</p>;

  return (
    <Modal onClose={handleClose}>
      <button className={css.backBtn} onClick={handleClose}>
        ← Back
      </button>
      <div className={css.post}>
        <div className={css.wrapper}>
          <div className={css.header}>
            <h2>{post?.title}</h2>
          </div>

          <p className={css.content}>{post?.body}</p>
        </div>
        <p className={css.user}>
          Author: {userLoading ? 'Loading...' : userError ? 'Unknown' : user?.name}
        </p>
      </div>
    </Modal>
  );
}
