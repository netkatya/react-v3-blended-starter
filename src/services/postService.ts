import axios from "axios";
import type { Post } from "../types/post";


const BASE_URL = "https://jsonplaceholder.typicode.com/posts";

export interface FetchPostsResponse {
    posts: Post[];
    totalPages: number;
}

export const fetchPosts = async (searchText: string, page = 1, perPage = 12): Promise<FetchPostsResponse> => {
    const params: Record<string, string|number> = {
        _page: page,
        _limit: perPage,
    }
    if (searchText.trim() !== '') {
        params.q = searchText; 
    }
    
    const response = await axios.get<Post[]>(BASE_URL, { params });
    
    const totalCount = Number(response.headers["x-total-count"] ?? 0);
    const totalPages =Math.ceil(totalCount/perPage)
    return {
        posts: response.data,
        totalPages,
     };
};

export const createPost = async (newPost: { title: string; body: string; userId: number }):Promise<Post> => {
    const response = await axios.post<Post>(BASE_URL, newPost);
    return response.data;
};

export const editPost = async (id:number, newDataPost: { title: string; body: string }): Promise<Post> => {
    const response = await axios.patch<Post>(`${BASE_URL}/${id}`, newDataPost);
    return response.data;

};

export const deletePost = async (postId: number): Promise<void> => {
    await axios.delete(`${BASE_URL}/${postId}`);
};
