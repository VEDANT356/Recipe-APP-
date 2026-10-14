
const categories = [
    "All",
    "Chicken",
    "Beef",
    "Seafood",
    "Vegetarian",
    "Pasta",
    "Dessert",
];

function CategoryFilter({ activeCategory, onCategoryChange }) {
    return (
        <div className="category-filter">
            {categories.map((category) => (
                <button
                    key={category}
                    className={`category-button ${activeCategory === category ? "active" : ""
                        }`}
                    onClick={() => onCategoryChange(category)}
                >
                    {category}
                </button>
            ))}
        </div>
    );
}

export default CategoryFilter;
