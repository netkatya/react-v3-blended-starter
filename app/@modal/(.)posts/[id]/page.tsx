import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';

import PostPreviewClient from './PostPreview.client';
import { fetchPostById } from '@/lib/api';

type PostDetailsProps = {
  params: Promise<{ postId: number }>;
};

export default async function PostPreview({ params }: PostDetailsProps) {
  const { postId } = await params;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['post', postId],
    queryFn: () => fetchPostById(postId),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PostPreviewClient postId={postId} />
    </HydrationBoundary>
  );
}
