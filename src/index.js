import Notiflix from 'notiflix';
import { BASE_URL } from './api/web_api';
import { getPicture } from './api/web_api';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
//Открытие модального окна с опциями через библиотеку SimpleLightbox
const lightbox = new SimpleLightbox('.gallery a');

import './css/styles.css';
const inputEl = document.querySelector('#search-form');
const pictureContainerEl = document.querySelector('.js-picture-container');
const loadMoreBtn = document.querySelector('.load-more');
export let page;

inputEl.addEventListener('submit', onSubmit);
let inputSearch = '';

async function onSubmit(event) {
  event.preventDefault();
  page = 1;
  cleanMarkup();
  changeClassIshidden(loadMoreBtn, true);
  inputSearch = event.target[0].value;
  console.log(inputSearch);
  if (!inputSearch) {
    Notiflix.Notify.failure('Enter reqwest');
    return;
  }
  const data = await buildMarkup(inputSearch);
  if (!data) {
    return;
  }
  createMarkup(data);

  lightbox.refresh();
}

function createMarkup(data) {
  const markup = data.hits
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `<div class="photo-card">
  <a href="${largeImageURL}">
  <img src="${webformatURL}" alt="${tags}" loading="lazy"class="card-img" />
  </a>
  <div class="info">
    <p class="info-item">
      <b>Likes:</b><span>${likes}</span>
    </p>
    <p class="info-item">
      <b>Views ${views}</b>
    </p>
    <p class="info-item">
      <b>Comments: ${comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads: ${downloads}</b>
    </p>
</div>
</div>`;
      }
    )
    .join('');
  pictureContainerEl.innerHTML = markup;
}

async function buildMarkup(input) {
  try {
    const picturesArray = await getPicture(input);
    const totalPictureQuantity = picturesArray.totalHits;
    const totalPicturePages = totalPictureQuantity / 40;
    const quantityPicturesOnPage = picturesArray.hits.length;
    if (totalPictureQuantity === 0 && page === 1) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }
    if (totalPictureQuantity > 40 && page === 1) {
      changeClassIshidden(loadMoreBtn, false);
      loadMoreBtn.addEventListener('click', onClickLoadMoreBtn);
      Notiflix.Notify.success(
        'Hooray! We found ' + totalPictureQuantity + ' images.'
      );
    }
    if (Math.floor(totalPicturePages) === page) {
      Notiflix.Notify.info(
        `We're sorry, but you've reached the end of search results.`
      );
      changeClassIshidden(loadMoreBtn, true);
    }
    return picturesArray;
  } catch (error) {
    Notiflix.Notify.failure(error.message);
  }
}

function cleanMarkup() {
  pictureContainerEl.innerHTML = '';
}
function changeClassIshidden(el, value) {
  if (value) {
    el.classList.add('is-hidden');
  } else el.classList.remove('is-hidden');
}

function onClickLoadMoreBtn(event) {
  page += 1;
  buildMarkup(inputSearch);
}
