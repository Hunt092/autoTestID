function SearchPage({ onSearch, onFilter, onSort }) {
	const [query, setQuery] = useState("");
	const [category, setCategory] = useState("all");
	const [sortBy, setSortBy] = useState("relevance");

	return (
		<div className="search-page">
			<div className="search-header">
				<h1>Search Products</h1>
				<div className="search-form">
					<input data-testid="search-page-text-input"
						type="text"
						placeholder="Search for products..."
						value={query}
						onChange={(e) => setQuery(e.target.value)}
					/>
					<button data-testid="search-page-search-button" onClick={() => onSearch(query)} className="search-btn">
						Search
					</button>
				</div>
			</div>

			<div className="search-filters">
				<div className="filter-group">
					<label>Category:</label>
					<select data-testid="search-page-all-categories-electronics-clothing-books-select"
						value={category}
						onChange={(e) => setCategory(e.target.value)}
					>
						<option value="all">All Categories</option>
						<option value="electronics">Electronics</option>
						<option value="clothing">Clothing</option>
						<option value="books">Books</option>
					</select>
				</div>

				<div className="filter-group">
					<label>Sort by:</label>
					<select data-testid="search-page-relevance-price-low-to-high-price-high-to-low-newest-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
						<option value="relevance">Relevance</option>
						<option value="price-low">Price: Low to High</option>
						<option value="price-high">Price: High to Low</option>
						<option value="newest">Newest</option>
					</select>
				</div>

				<button data-testid="search-page-apply-filters-button"
					onClick={() => onFilter({ category, sortBy })}
					className="apply-filters-btn"
				>
					Apply Filters
				</button>
			</div>

			<div className="search-results">
				<div className="results-header">
					<span>Found 0 results</span>
					<div className="view-options">
						<button data-testid="search-page-grid-button" className="view-btn active">Grid</button>
						<button data-testid="search-page-list-button" className="view-btn">List</button>
					</div>
				</div>

				<div className="results-grid">{/* Product cards would go here */}</div>
			</div>
		</div>
	);
}
