

import ApiService from "./apiService.js"
import LoadMoreBtn from "./loadMoreBtn.js"
import { refs } from './refs'
import listTemplate from './list.hbs'
import debounce from 'lodash.debounce'
import { alert, Stack, defaultModules } from '../../node_modules/@pnotify/core/dist/PNotify.js';

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



import '../../node_modules/basiclightbox/dist/basicLightbox.min.css'
import * as basicLightbox from 'basiclightbox';
let currentLargeImageURL = '';
const instance = basicLightbox.create(
   `<div class="modal">
        <img src="${currentLargeImageURL}" alt="" />
    </div>`
);

refs.listContainer.addEventListener('click', onModal);

function onModal(e) {
    if (e.target.src === undefined) {
        return
        }
        // e.stopPropagation();
        currentLargeImageURL = e.target.dataset.largeimageurl;

        instance.show();
};

// const element = document.getElementById('my-element-selector');
// element.scrollIntoView({
//   behavior: 'smooth',
//   block: 'end',
// });

const apiService = new ApiService();
const loadMoreBtn = new LoadMoreBtn({
    selector: '[data-action="load-more"]',
    hidden: true,
});

refs.inputForm.addEventListener('keydown', onSearch);
loadMoreBtn.refs.button.addEventListener('click', onSearchMore);

function clearMarkup() {
    refs.listContainer.innerHTML = ''
};


function onSearch(e) {
    if (e.keyCode === 13) {
        e.preventDefault();
        loadMoreBtn.show();
        loadMoreBtn.disable();
        // const searchQuery = e.currentTargget.elements.query.value;
        apiService.searchQuery = refs.inputForm.value;
        apiService.resetPageNumber();
        apiService.fetchData()
        .then(data => {
            clearMarkup();
            if (data.length === 0) {
                myAlert('Nothing was found');
                loadMoreBtn.hide();
            } else {
                if (data.length < 12) {
                renderListMarkup(data);
                myAlert('it is all');
                loadMoreBtn.hide();
                } else {
                    renderListMarkup(data);
                    myAlert('');
                    loadMoreBtn.enable();
                    }
                }
            
            });
    }
};

function onSearchMore() {
    loadMoreBtn.disable();
    apiService.fetchData()
        .then(data => {
            renderListMarkup(data)
            loadMoreBtn.enable();
            refs.buttonLoadMore.scrollIntoView({
                behavior: 'smooth',
                block: 'end',
            });
        });
};

function renderListMarkup(data) {
    const listMarkup = data.map(listTemplate).join('');
    refs.listContainer.insertAdjacentHTML('beforeend', listMarkup);
};
