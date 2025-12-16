export class Search {
    constructor(api) {
        this.api = api;
        this.searchInput = document.getElementById('searchInput');
        this.debounceTimer = null;
        this.onSearchCallback = null;
        
        this.init();
    }
    
    init() {
        this.searchInput.addEventListener('input', (e) => {
            this.debounceSearch(e.target.value);
        });
    }
    
    debounceSearch(query) {
        clearTimeout(this.debounceTimer);
        
        this.debounceTimer = setTimeout(() => {
            if (this.onSearchCallback) {
                this.onSearchCallback(query);
            }
        }, 300);
    }
    
    clear() {
        this.searchInput.value = '';
    }
    
    onSearch(callback) {
        this.onSearchCallback = callback;
    }
}
