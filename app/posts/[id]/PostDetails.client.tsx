'use client';

import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';

import { fetchPostById, fetchUserById } from '@/lib/api';

import css from './PostDetails.module.css';
import { User } from '@/types/user';
import { Post } from '@/types/post';
import Loading from '@/app/loading';

interface PostDetailsClientProps {
  id: number;
}

export default function PostDetailsClient({ id }: PostDetailsClientProps) {
  const router = useRouter();

  const {
    data: post,
    isLoading: postLoading,
    error: postError,
  } = useQuery<Post>({
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
    enabled: !!userId,
  });

  const handleClickBack = () => {
    router.back();
  };

  if (postLoading) return <Loading />;
  if (postError) return <p>Failed to load post</p>;

  return (
    <>
      <div className={css.container}>
        <div className={css.item}>
          <button className={css.backBtn} onClick={handleClickBack}>
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
              Author: {userLoading ? <Loading /> : userError ? 'Unknown' : user?.name}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
