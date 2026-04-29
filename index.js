const searchBox = document.querySelector('.searchBox');
const recipeContainer = document.querySelector('.recipe-container');
const form = document.querySelector('form');


const fetchRecipes = async (query) => {
  recipeContainer.innerHTML = "<h2>Fetching recipes...</h2>";

  try {
    const data = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
    const response = await data.json();

    recipeContainer.innerHTML = "";

    if (!response.meals) {
      recipeContainer.innerHTML = "<h2>No recipes found</h2>";
      return;
    }

    response.meals.forEach(meal => {
      const recipeDiv = document.createElement("div");
      recipeDiv.classList.add("recipe");

      recipeDiv.innerHTML = `
        <img src="${meal.strMealThumb}">
        <h3>${meal.strMeal}</h3>
        <p><span>${meal.strArea}</span> Dish</p>
        <p>Category: <span>${meal.strCategory}</span></p>
      `;

      const button = document.createElement('button');
      button.textContent = "Get Recipe";


      button.addEventListener('click', () => {
        openRecipe(meal);
      });

      recipeDiv.appendChild(button);
      recipeContainer.appendChild(recipeDiv);
    });

  } catch (error) {
    recipeContainer.innerHTML = "<h2>Error fetching recipes</h2>";
  }
};


const fetchIngredients = (meal) => {
  let ingredients = "";

  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];

    if (ingredient && ingredient.trim() !== "") {
      ingredients += `<li>${ingredient} - ${measure}</li>`;
    } else {
      break;
    }
  }

  return ingredients;
};


function openRecipe(meal) {
  document.getElementById("recipeModal").style.display = "flex";

  document.getElementById("recipeTitle").innerText = meal.strMeal;

  // IMPORTANT: use innerHTML (because <li>)
  document.getElementById("recipeIngredients").innerHTML = fetchIngredients(meal);

  document.getElementById("recipeInstructions").innerText = meal.strInstructions;
}


function closeRecipe() {
  document.getElementById("recipeModal").style.display = "none";
}


form.addEventListener('submit', (e) => {
  e.preventDefault();
  const searchInput = searchBox.value.trim();

  if (searchInput === "") {
    recipeContainer.innerHTML = "<h2>Type something to search</h2>";
    return;
  }

  fetchRecipes(searchInput);
});