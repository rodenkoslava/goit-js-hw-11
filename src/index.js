import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';
import { refs } from './js/refs';
import { urlInfo } from './js/config';
import updatePage from './js/update-page';
import { fetchPhotos } from './js/axios';
import { makeURL, increaseCurrentPage } from './js/make-url';
import { createMarkup } from './js/markup-creator';
import { slowlyScroll } from './js/slowly-scroll';
import { showLoader, hideLoader } from './js/loader-status';

const lightbox = new SimpleLightbox('.gallery a');

let totalPage = 1;
let isLoading = false;

console.log('currentPage:', urlInfo.currentPage, 'totalPage:', totalPage);

refs.formRef.addEventListener('submit', handleSubmit);
addEventListener('scroll', onScroll);

async function handleSubmit(e) {
  e.preventDefault();
  updatePage(e, refs.galleryWrapperRef);

  urlInfo.currentPage = 1;

  urlInfo.category = refs.inputRef.value.trim();
  if (urlInfo.category === '') {
    return Notiflix.Notify.failure('Please, enter something');
  }

  removeEventListener('scroll', onScroll);

  try {
    const valueQuery = await fetchPhotos(makeURL());

    if (valueQuery.hits.length === 0) {
      return Notiflix.Notify.info(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }

    totalPage = Math.ceil(valueQuery.totalHits / 40);
    createMarkup(valueQuery, refs.galleryWrapperRef);

    increaseCurrentPage();

    slowlyScroll();
    lightbox.refresh();

    if (urlInfo.currentPage <= totalPage) {
      addEventListener('scroll', onScroll);
    }
  } catch (error) {
    console.log(error);

    if (error.response && error.response.status === 400) {
      console.log('Error 400: ', error.response.data);
      Notiflix.Notify.failure('Invalid request. Please check your input.');
    } else {
      Notiflix.Notify.failure('An error occurred. Please try again later.');
    }
  }
}

async function onScroll() {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

  if (
    scrollTop + clientHeight >= scrollHeight &&
    !isLoading &&
    urlInfo.currentPage <= totalPage
  ) {
    showLoader();
    isLoading = true;

    try {
      const valueQuery = await fetchPhotos(makeURL());

      if (valueQuery.hits.length > 0) {
        createMarkup(valueQuery, refs.galleryWrapperRef);

        increaseCurrentPage();

        slowlyScroll();
        lightbox.refresh();
      } else {
        removeEventListener('scroll', onScroll);
      }
    } catch (error) {
      console.log(error);

      if (error.response && error.response.status === 400) {
        console.log('Error 400: ', error.response.data);
        Notiflix.Notify.failure('Invalid request. Please check your input.');
      } else {
        Notiflix.Notify.failure('An error occurred. Please try again later.');
      }
    } finally {
      hideLoader();
      isLoading = false;
    }
  }
}
