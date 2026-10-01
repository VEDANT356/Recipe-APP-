import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const [favorites, setFavorites] = useState([]);

  const categories = [
    "All",
    "Chicken",
    "Beef",
    "Seafood",
    "Vegetarian",
    "Pasta",
    "Dessert",
  ];

  const fetchRandomRecipes = async () => {
    try {
      setLoading(true);

      const recipeList = [];

      for (let i = 0; i < 6; i++) {
        const response = await fetch(
          "https://www.themealdb.com/api/json/v1/1/random.php"
        );

        const data = await response.json();

        if (data.meals) {
          recipeList.push(data.meals[0]);
        }
      }

      setRecipes(recipeList);
    } catch (error) {
      console.error("Error fetching recipes:", error);
      setRecipes([]);
    } finally {
      setLoading(false);
    }
  };


  const searchRecipes = async () => {
    if (!search.trim()) {
      fetchRandomRecipes();
      return;
    }

    try {
      setLoading(true);
      setActiveCategory("All");

      const response = await fetch(
        `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(
          search
        )}`
      );

      const data = await response.json();

      setRecipes(data.meals || []);
    } catch (error) {
      console.error("Error searching recipes:", error);
      setRecipes([]);
    } finally {
      setLoading(false);
    }
  };

  const getRecipeDetails = async (id) => {
    try {
      setModalLoading(true);

      const response = await fetch(
        `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
      );

      const data = await response.json();

      setSelectedRecipe(data.meals ? data.meals[0] : null);
    } catch (error) {
      console.error("Error fetching recipe details:", error);
      setSelectedRecipe(null);
    } finally {
      setModalLoading(false);
    }
  };


  const toggleFavorite = (recipe) => {
    setFavorites((prev) => {
      const alreadyFavorite = prev.some(
        (item) => item.idMeal === recipe.idMeal
      );

      if (alreadyFavorite) {
        return prev.filter((item) => item.idMeal !== recipe.idMeal);
      }

      return [...prev, recipe];
    });
  };


  useEffect(() => {
    fetchRandomRecipes();
  }, []);


  const filteredRecipes =
    activeCategory === "All"
      ? recipes
      : recipes.filter((recipe) =>
          recipe.strCategory
            ?.toLowerCase()
            .includes(activeCategory.toLowerCase())
        );

  return (
    <div className="app">


      <nav className="navbar">
        <div className="logo">
          <span>♨</span> Recipe <b>App</b>
        </div>

        <div className="search-box">
          <input
            type="text"
            placeholder="Search for a recipe..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                searchRecipes();
              }
            }}
          />

          <button onClick={searchRecipes}>Search</button>
        </div>

        <div className="favorites">
          <span>♡</span>
          Favorites

          {favorites.length > 0 && (
            <strong>{favorites.length}</strong>
          )}
        </div>
      </nav>


      <main>


        <section className="hero">
          <p className="eyebrow">GOOD FOOD • GOOD MOOD</p>

          <h1>
            Discover <span>Delicious</span> Recipes
          </h1>

          <p className="subtitle">
            Find your favorite recipes and explore something new.
          </p>
        </section>



        <div className="categories">
          {categories.map((category) => (
            <button
              key={category}
              className={
                activeCategory === category ? "active" : ""
              }
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>



        {loading ? (
          <div className="loading">
            <div className="spinner"></div>

            <p>Loading delicious recipes...</p>
          </div>
        ) : filteredRecipes.length ===
          0 ? (
          <div className="empty-state">
            <h2>No recipes found</h2>

            <p>
              Try searching for a different recipe or category.
            </p>

            <button onClick={fetchRandomRecipes}>
              Try Again
            </button>
          </div>
        ) : (
          <div className="recipe-grid">
            {filteredRecipes.map((recipe) => {
              const isFavorite = favorites.some(
                (item) => item.idMeal === recipe.idMeal
              );

              return (
                <article
                  className="recipe-card"
                  key={recipe.idMeal}
                >

                  <div className="image-wrapper">
                    <img
                      src={recipe.strMealThumb}
                      alt={recipe.strMeal}
                    />

                    <button
                      className={`heart ${
                        isFavorite ? "liked" : ""
                      }`}
                      onClick={() => toggleFavorite(recipe)}
                      aria-label={
                        isFavorite
                          ? "Remove from favorites"
                          : "Add to favorites"
                      }
                    >
                      {isFavorite ? "♥" : "♡"}
                    </button>
                  </div>


                  <div className="recipe-content">
                    <h2>{recipe.strMeal}</h2>

                    <div className="meta">
                      <span>
                        ◉ {recipe.strArea || "World"}
                      </span>

                      <span>
                        ✦ {recipe.strCategory || "Recipe"}
                      </span>
                    </div>

                    <button
                      className="get-recipe"
                      onClick={() =>
                        getRecipeDetails(recipe.idMeal)
                      }
                    >
                      Get Recipe →
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>

      {selectedRecipe && (
        <div
          className="modal-overlay"
          onClick={() => setSelectedRecipe(null)}
        >
          <div
            className="recipe-modal"
            onClick={(e) => e.stopPropagation()}
          >

            <button
              className="close-modal"
              onClick={() => setSelectedRecipe(null)}
              aria-label="Close recipe"
            >
              ×
            </button>


            {modalLoading ? (
              <div className="modal-loading">
                Loading recipe...
              </div>
            ) : (
              <>


                <img
                  className="modal-image"
                  src={selectedRecipe.strMealThumb}
                  alt={selectedRecipe.strMeal}
                />

                <div className="modal-content">

                  <p className="modal-category">
                    {selectedRecipe.strArea || "World"} •{" "}
                    {selectedRecipe.strCategory || "Recipe"}
                  </p>


                  <h2>{selectedRecipe.strMeal}</h2>

                  <section>
                    <h3>Ingredients</h3>

                    <div className="ingredients-list">
                      {Array.from({ length: 20 }).map(
                        (_, index) => {
                          const ingredient =
                            selectedRecipe[
                              `strIngredient${index + 1}`
                            ];

                          const measure =
                            selectedRecipe[
                              `strMeasure${index + 1}`
                            ];

                          if (!ingredient?.trim()) {
                            return null;
                          }

                          return (
                            <div
                              className="ingredient"
                              key={index}
                            >
                              <span>{ingredient}</span>

                              <span>
                                {measure || ""}
                              </span>
                            </div>
                          );
                        }
                      )}
                    </div>
                  </section>


                  <section>
                    <h3>Instructions</h3>

                    <p className="instructions">
                      {selectedRecipe.strInstructions}
                    </p>
                  </section>


                  {selectedRecipe.strYoutube && (
                    <a
                      className="youtube-button"
                      href={selectedRecipe.strYoutube}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Watch Recipe Video
                    </a>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;