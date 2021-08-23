import fetchCountries from "./fetchCountries.js"
import { refs } from './refs';
import cardTemplate from './card.hbs';
import listTemplate from './list.hbs';
import debounce from 'lodash.debounce';
import { alert, Stack, defaultModules } from '../../node_modules/@pnotify/core/dist/PNotify.js';

const { defaults } = require('../../node_modules/@pnotify/core');
const myStack = new Stack({
    dir1: 'down',
    firstpos1: 25,
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

refs.input.addEventListener('input', debounce(onSearch, 500));

function clearMarkup() {
    refs.cardContainer.innerHTML='';
    refs.listContainer.innerHTML = '';
    myAlert('');
};

function onSearch(e) {
    clearMarkup();
    const searchQuery = refs.input.value;
    fetchCountries(searchQuery)
        .then(data => createCardMarkup(data))
};

function renderCardMarkup(data) {
    const cardMarkup = data.map(cardTemplate);
    refs.cardContainer.insertAdjacentHTML('beforeend', cardMarkup);
};

function renderListMarkup(data) {
    const listMarkup = data.map(listTemplate).join('');
    refs.listContainer.insertAdjacentHTML('beforeend', listMarkup);
};

function createCardMarkup(data) {
    if (data.status === 404) {
        return myAlert('Ничего не нашлось!');
    } else {
        if (data.length === 1) {
            return renderCardMarkup(data);
        } else {
            if (data.length <= 10) {
                myAlert('Вот что нашлось...');
                return renderListMarkup(data);
            } else {
                return myAlert('Ого, тут слишком много! Сделай, пожалуйста, более специфичный запрос.');
                }
            }
        }
};
