import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import { fetchImages } from './api';
import { updateGallery } from './gallery';
const selectors = {
  formEl: document.querySelector('.search-form'),
  loadMoreBtn: document.querySelector('.load-more'),
};
let currentPage = 1;
let currentQuery = '';
const lightbox = new SimpleLightbox('.gallery a', {});
async function loadMoreImages() {
  currentPage += 1;
  try {
    const data = await fetchImages(currentQuery, currentPage);
    if (data.hits.length === 0) {
      selectors.loadMoreBtn.style.display = 'none';
      Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
    } else {
      updateGallery(data);
      smoothScrollToGallery();
    }
  } catch (error) {
    console.error('Error loading more images:', error);
  }
}
function smoothScrollToGallery() {
  const gallery = document.querySelector('.gallery');
  if (gallery) {
    const cardHeight = gallery.firstElementChild
      ? gallery.firstElementChild.clientHeight
      : 0;
    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });
  }
}
selectors.formEl.addEventListener('submit', async event => {
  event.preventDefault();
  currentPage = 1;
  currentQuery = event.target.searchQuery.value;
  selectors.loadMoreBtn.style.display = 'none';
  document.querySelector('.gallery').innerHTML = '';
  try {
    const data = await fetchImages(currentQuery, currentPage);
    updateGallery(data);
    if (data.hits.length > 0) {
      selectors.loadMoreBtn.style.display = 'block';
    }
  } catch (error) {
    console.error('Error searching for images:', error);
  }
});
selectors.loadMoreBtn.addEventListener('click', loadMoreImages);
