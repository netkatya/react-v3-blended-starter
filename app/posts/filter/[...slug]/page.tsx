import { fetchPosts } from '@/lib/api';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import PostsClient from './Posts.client';

type Props = {
  params: Promise<{ slug?: string[] }>;
};

export async function generateMetadata({ params }: Props) {
  const resolvedParams = await params;
  const userId = resolvedParams.slug?.[0];
  return {
    title: `Posts - ${!userId || userId === 'All' ? 'All Users' : `User ${userId}`}`,
  };
}

export default async function PostsPage({ params }: Props) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug || ['All'];
  const userId = slug[0] === 'All' ? undefined : slug[0];

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['posts', '', 1, userId],
    queryFn: () => fetchPosts({ searchText: '', page: 1, userId }),
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <PostsClient userId={userId ?? 'All'} />
    </HydrationBoundary>
  );
}
