import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import PostDetailsClient from './PostDetails.client';
import { fetchPostById } from '@/lib/api';

type PostDetailsProps = {
  params: Promise<{ id: number }>;
};

export async function generateMetadata({ params }: PostDetailsProps) {
  const { id } = await params;
  const post = await fetchPostById(id);

  return {
    title: post.title,
    description: post.body.slice(0, 30),
  };
}

export default async function PostDetails({ params }: PostDetailsProps) {
  const { id } = await params;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['post', id],
    queryFn: () => fetchPostById(id),
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <PostDetailsClient id={id} />
    </HydrationBoundary>
  );
}
