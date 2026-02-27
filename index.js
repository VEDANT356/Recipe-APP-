const searchBox = document.querySelector('.searchBox');
const searchBtn = document.querySelector('.searchBtn');
const recipeContainer = document.querySelector('.recipe-container');
const recipeDetailContent = document.querySelector('.recipe-detail-content')
const recipeCloseBtn = document.querySelector('.recipe-close-btn');
const form = document.querySelector('form');

const fetchRecipes = async (query) => {
    recipeContainer.innerHTML ="<h2>Fetching recipes....</h2>";
    const data =  await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`)
    const response =  await data.json();

    recipeContainer.innerHTML ="";
    response.meals.forEach(meal =>{
        const recipeDiv = document.createElement("div");
        recipeDiv.classList.add("recipe");
        recipeDiv.innerHTML = `
        <img src ="${meal.strMealThumb}">
        <h3>${meal.strMeal}</h3>
        <p><span>${meal.strArea}</span>Dish</p>
        <p>Belongs to <span>${meal.strCategory}</span> Category</p>
        `
        const button =document.createElement('button');
        button.textContent = "Get Recipe";

        recipeDiv.appendChild(button);

        button.addEventListener('click', ()=>{
            openRecipePopup(meal);
        });
        recipeContainer.appendChild(recipeDiv);
    });
};

const fetchIngredients = (meal) => {
    let ingredients ="";
    for(let i = 1; i <= 20; i++) {
        const ingredient = meal[`strIngredient${i}`];
        const measure = meal[`strMeasure${i}`];
        if (ingredient && ingredient.trim() !== "") {
            ingredients += `<li>${ingredient} - ${measure}</li>`;
        }
        else{
            break;
        }
    }
    return ingredients;
}
const openRecipePopup =(meal) => {
    recipeDetailContent.innerHTML =`
    <h2 class="recipeName">${meal.strMeal}</h2>
    <h3> ingredient:</h3>
    <ul class="IngredientList">${fetchIngredients(meal)}</ul>
    <div>
        <h3>Instructions:</h3>
        <p class="recipeInstructions">${meal.strInstructions}</p>
    </div>
    `
    recipeDetailContent.parentElement.style.display ="block";
}

recipeCloseBtn.addEventListener("click", () => {
    recipeDetailContent.parentElement.style.display = "none";
});

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const searchInput = searchBox.value.trim();
    fetchRecipes(searchInput);
});