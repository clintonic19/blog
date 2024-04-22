// alert("Welcome")

// Search bar
document.addEventListener('DOMContentLoaded', function() {
    const allSearchButtons = document.querySelectorAll('.searchBtn');  
    const searchBar = document.querySelector('.searchBar');  
    const searchInput = document.getElementById('searchInput');  
    const searchClose = document.getElementById('searchClose');  

    for(let i = 0; i < allSearchButtons.length; i++) {
        allSearchButtons[i].addEventListener('click', function() {
            searchBar.style.visibility = 'visible';
            searchBar.classList.add('open');
            this.setAttribute('aria-expanded', 'true');
            searchInput.focus();
        });
    };
    
    // Close search bar
    searchClose.addEventListener('click', function() {
        searchBar.style.visibility = 'hidden';
        searchBar.classList.remove('open');
        this.setAttribute('aria-expanded', 'false');
    });
  });