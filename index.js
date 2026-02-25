const searchBox = document.querySelector('.searchBox');
const searchBtn = document.querySelector('.searchBtn');
const recipeContainer = document.querySelector('.recipe-container');
const form = document.querySelector('form');

form.addEventListener('submit', (e) => {
    e.preventDefault();   // page reload stop
    console.log("Searching for:", searchBox.value);
});