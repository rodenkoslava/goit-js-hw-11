import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import { fetchImages } from './api';
const lightbox = new SimpleLightbox('.gallery a', {});
export function updateGallery(images) {
  const gallery = document.querySelector('.gallery');
  const cards = images.hits.map(image => createImageCard(image));
  gallery.insertAdjacentHTML('beforeend', cards.join(''));
  if (images.totalHits === 0) {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  } else {
    Notiflix.Notify.success(`Hooray! We found ${images.totalHits} images.`);
  }
  lightbox.refresh();
}
function createImageCard(image) {
  const {
    webformatURL,
    largeImageURL,
    tags,
    likes,
    views,
    comments,
    downloads,
  } = image;
  return `
    <div class="photo-card">
      <a href="${largeImageURL}" target="_blank">
        <img src="${webformatURL}" alt="${tags}" loading="lazy" style="width: 100%; height: 300px;" />
      </a>
      <div class="info">
        <p class="info-item">
          <b>Likes:</b> ${likes}
        </p>
        <p class="info-item">
          <b>Views:</b> ${views}
        </p>
        <p class="info-item">
          <b>Comments:</b> ${comments}
        </p>
        <p class="info-item">
          <b>Downloads:</b> ${downloads}
        </p>
      </div>
    </div>`;
}
