
function RecipeCard({ recipe, isFavorite, onToggleFavorite, onGetRecipe }) {
    return (
        <article className="recipe-card">
            <div className="image-wrapper">
                <img src={recipe.strMealThumb} alt={recipe.strMeal} />

                <button
                    className={`heart ${isFavorite ? "liked" : ""}`}
                    onClick={() => onToggleFavorite(recipe)}
                    aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
                >
                    {isFavorite ? "♥" : "♡"}
                </button>
            </div>

            <div className="recipe-content">
                <h2>{recipe.strMeal}</h2>

                <div className="meta">
                    <span>◉ {recipe.strArea || "World"}</span>
                    <span>✦ {recipe.strCategory || "Recipe"}</span>
                </div>

                <button
                    className="get-recipe"
                    onClick={() => onGetRecipe(recipe.idMeal)}
                >
                    Get Recipe →
                </button>
            </div>
        </article>
    );
}

export default RecipeCard;
