const keyApi = '23100345-a1985f2d3b70e4240f74cca05';
const baseUrl = 'https://pixabay.com/api/';


export default class ApiService {
    constructor() {
        this.searchQuery = '';
        this.pageNumber = 1;
        this.imageType = 'photo';
        let orientationType = 'horizontal';
    }

    fetchData() {
            
            return fetch(`${baseUrl}?image_type=${this.imageType}&orientation=${this.orientationType}&q=${this.searchQuery}&page=${this.pageNumber}&per_page=12&key=${keyApi}`)
                .then(response => response.json())
                .then(data => {
                    console.log(data.hits)
                    this.incrementPageNumber();
                    return data.hits;
        })
    }

    incrementPageNumber() {
        this.pageNumber += 1;
    }
    resetPageNumber() {
        this.pageNumber = 1;
    }

    // get query() {return this.searchQuery;}
    // set query(newQuery) {this.searchQuery = newQuery;}
}
