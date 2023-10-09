import axios from 'axios';

export async function fetchPhotos(url) {
  const response = await axios.get(url);
  return response.data;
}
