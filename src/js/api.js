import axios from 'axios';
const apiKey = '39897013-b9056c5f3289706b4cdfee7b6';
const perPage = 40;
export async function fetchImages(query, page) {
  try {
    const response = await axios.get(
      `https://pixabay.com/api/?key=${apiKey}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${perPage}&page=${page}`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching images:', error);
    throw error;
  }
}
