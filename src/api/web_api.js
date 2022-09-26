import axios from 'axios';

const API_KEY = '30131532-b39fadf9a6636e24080a2757a';
const BASE_URL = 'https://pixabay.com/api/?key=' + API_KEY + '&q=';
const options = '&image_type=photo&orientation=horizontal&safesearch=true&';
const perPage = 40;
import { page } from '../index';
export async function getPicture(input) {
  try {
    const response = await axios.get(
      BASE_URL +
        encodeURIComponent(input) +
        options +
        '&page=' +
        page +
        '&per_page=' +
        perPage
    );
    return response.data;
  } catch (error) {
    throw new Error(error);
  }
}
