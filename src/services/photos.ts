import axios from "axios";
import type { Photo } from "../types/photo";


const API_KEY = import.meta.env.VITE_API_KEY;
axios.defaults.baseURL = "https://api.pexels.com/v1/";
axios.defaults.headers.common["Authorization"] = API_KEY;
axios.defaults.params = {
  orientation: "landscape",
};

export const getPhotos = async (query: string, page: number = 1): Promise<Photo[]> => {
  const response = await axios.get('search', {
    params: {
      query,
      page,
    }
  });

  return response.data.photos;
};
