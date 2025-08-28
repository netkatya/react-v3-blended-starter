import axios, { AxiosResponse } from 'axios';
import { Post } from '@/types/post';
import { User } from '@/types/user';

axios.defaults.baseURL = 'https://jsonplaceholder.typicode.com';

export type FetchPostsResponse = Post[];

export const fetchPosts = async ({
  searchText,
  page,
  userId,
}: {
  searchText: string;
  page: number;
  userId?: string;
}): Promise<{ posts: Post[]; totalCount: number }> => {
  const response = await axios.get<FetchPostsResponse>('/posts', {
    params: {
      userId,
      ...(searchText !== '' && { q: searchText }),
      _page: page,
      _limit: 8,
    },
  });
  const totalCount = Number(response.headers['x-total-count']);
  return { posts: response.data, totalCount };
};

interface NewPostContent {
  title: string;
  body: string;
}

interface EditedPost {
  id: number;
  title: string;
  body: string;
}

export const createPost = async (newPost: NewPostContent): Promise<Post> => {
  const response = await axios.post<Post>('/posts', newPost);
  return response.data;
};

export const editPost = async (newDataPost: EditedPost): Promise<Post> => {
  const response = await axios.patch<Post>(`/posts/${newDataPost.id}`, newDataPost);
  return response.data;
};

export const deletePost = async (postId: number): Promise<Post> => {
  const response = await axios.delete<Post>(`/posts/${postId}`);
  return response.data;
};

export const fetchPostById = async (postId: number): Promise<Post> => {
  const response: AxiosResponse<Post> = await axios.get(`/posts/${postId}`);
  return response.data;
};

export const fetchUsers = async (): Promise<User[]> => {
  const response: AxiosResponse<User[]> = await axios.get(`/users`);
  return response.data;
};

export const fetchUserById = async (userId: number): Promise<User> => {
  const response: AxiosResponse<User> = await axios.get(`/users/${userId}`);
  return response.data;
};
