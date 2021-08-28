export default class LoadMoreBtn {
    constructor({selector, hidden = false}) {
        this.refs = this.getRefs(selector);
        hidden && this.hide();
        // if (hidden) { this.hide() };
    }
    getRefs(selector) {
        const refs = {};
        refs.button = document.querySelector(selector);
        refs.label = document.querySelector('.btn__label');
        refs.spinner = document.querySelector('.btn__spinner');
        // refs.input = document.querySelector('.search-form__input');
        
        return refs;
    }
    enable() {
        this.refs.button.disabled = false;
        this.refs.label.textContent = "Load more";
        this.refs.button.classList.remove('spinner-on');
        // this.refs.input.classList.remove('spinner-on');
        // this.refs.spinner.classList.add('is-hidden');
    }
    disable() {
        this.refs.button.disabled = true;
        this.refs.label.textContent = "loading...";
        this.refs.button.classList.add('spinner-on');
        // this.refs.input.classList.add('spinner-on');
        // this.refs.spinner.classList.remove('is-hidden');
    }
    show() {
        this.refs.button.classList.remove('is-hidden');
    }
    hide() {
        this.refs.button.classList.add('is-hidden');
    }
}