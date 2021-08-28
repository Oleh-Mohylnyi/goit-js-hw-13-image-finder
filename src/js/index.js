

import ApiService from "./apiService.js"
import LoadMoreBtn from "./loadMoreBtn.js"
import { refs } from './refs'
import galleryTemplate from './galleryTemplate.hbs'
import debounce from 'lodash.debounce'
import { alert, Stack, defaultModules } from '../../node_modules/@pnotify/core/dist/PNotify.js';
import '../../node_modules/basiclightbox/dist/basicLightbox.min.css'
import * as basicLightbox from 'basiclightbox';

const { defaults } = require('../../node_modules/@pnotify/core');
const myStack = new Stack({
    dir1: 'down',
    firstpos1: 26,
    maxOpen: 1,
    maxStrategy: 'close',
    maxClosureCausesWait: false,
    push: 'top',
});
defaults.stack = myStack;
function myAlert(textAlert) {
    return alert({ text: textAlert }
    );
};




let instance = basicLightbox.create(
   ``
);
function onModal(e) {
    if (e.target.src !== undefined) {
        // e.stopPropagation();
        createModalMarkup (e.target.dataset.largeimageurl);
        instance.show();
        }
};
function createModalMarkup(url) {
    instance = basicLightbox.create(
        `<div class="modal">
          <img src="${url}https://pixabay.com/get/g3c8f025fcc4585ab317192c7b0aeff70663bdc515bb5216a696f0c6dce3f8e01adcd047e17c3d0dc1ef63f3b6f34f1a54edbd3c4200aae4f1d16cbe384bb618d_1280.jpg" alt="" max-width="50%"/>
        </div>`
    );
}
function onKeyboard(event) {
    if (event.key === "Escape") {
        instance.close();
    } 
};



const apiService = new ApiService();
const loadMoreBtn = new LoadMoreBtn({
    selector: '[data-action="load-more"]',
    hidden: true,
});



refs.galleryContainer.addEventListener('click', onModal);
window.addEventListener('keydown', onKeyboard);
refs.inputForm.addEventListener('keydown', onSearch);
loadMoreBtn.refs.button.addEventListener('click', onSearchMore);
refs.checkboxAutoscroll.addEventListener('change', () => {
   if (refs.checkboxAutoscroll.checked) {
        onAutoScroll(refs.buttonLoadMore);
    } 
});


function onSearch(e) {
    if (e.keyCode === 13) {
        e.preventDefault();
        loadMoreBtn.show();
        loadMoreBtn.disable();
        getSettings()
        apiService.fetchData()
        .then(data => {
            clearMarkup();
            if (data.length === 0) {
                myAlert('Nothing was found');
                loadMoreBtn.hide();
            } else {
                createGallery(data)
            }            
        });
    }
};

function createGallery(data) {
    if (data.length < 12) {
        renderGalleryMarkup(data);
        myAlert('it is all');
        loadMoreBtn.hide();
    } else {
        renderGalleryMarkup(data);
        myAlert('');
        loadMoreBtn.enable();
    }
};

function clearMarkup() {
    refs.galleryContainer.innerHTML = ''
};

function onSearchMore() {
    loadMoreBtn.disable();
    apiService.fetchData()
        .then(data => {
            createGallery(data)
            // onScrollInto(refs.buttonLoadMore);
        });
};

function renderGalleryMarkup(data) {
    const galleryMarkup = data.map(galleryTemplate).join('');
    refs.galleryContainer.insertAdjacentHTML('beforeend', galleryMarkup);
};

function onAutoScroll(target) {
    const optionsObserver = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    }
    const observer = new IntersectionObserver(scrollGallery, optionsObserver);
    observer.observe(target);
};

function scrollGallery() {
    if (refs.checkboxAutoscroll.checked) {
        onSearchMore()
    }
}

// function onScrollInto(element) {
//     element.scrollIntoView({
//                 behavior: 'smooth',
//                 block: 'end',
//             });
// };

function getSettings() {
    apiService.searchQuery = refs.inputForm.value;
    apiService.resetPageNumber();

    const imageTypeSettings = new FormData(refs.serchForm);
    for (const entry of imageTypeSettings) {
        if (entry[0] === "image_type") {
            apiService.imageType = entry[1];
        } else {
            if (entry[0] === "orientation_type") {
                apiService.orientationType = entry[1];
            }
        }
    };
};