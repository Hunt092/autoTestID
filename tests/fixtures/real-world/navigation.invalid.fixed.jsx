function Navigation() {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

	return (
		<nav className="navbar">
			<div className="nav-brand">
				<a data-testid="navigation--a" href="/">
					<img src="/logo.png" alt="Company Logo" />
				</a>
			</div>

			<div className="nav-links">
				<a data-testid="navigation--a" href="/">Home</a>
				<a data-testid="navigation-products-a" href="/products">Products</a>
				<a data-testid="navigation-about-a" href="/about">About</a>
				<a data-testid="navigation-contact-a" href="/contact">Contact</a>
			</div>

			<div className="nav-actions">
				<div className="search-container">
					<input data-testid="navigation-text-input"
						type="text"
						placeholder="Search products..."
						className="search-input"
					/>
					<button data-testid="navigation-button-button" className="search-btn">
						<SearchIcon />
					</button>
				</div>

				<div className="user-menu">
					<button data-testid="navigation-click-button"
						onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
						className="user-btn"
					>
						<UserIcon />
					</button>
					{isUserMenuOpen && (
						<div className="user-dropdown">
							<a data-testid="navigation-profile-a" href="/profile">Profile</a>
							<a data-testid="navigation-settings-a" href="/settings">Settings</a>
							<button data-testid="navigation-logout-button" onClick={handleLogout}>Logout</button>
						</div>
					)}
				</div>
			</div>

			<button data-testid="navigation-click-button"
				className="mobile-menu-btn"
				onClick={() => setIsMenuOpen(!isMenuOpen)}
			>
				<MenuIcon />
			</button>
		</nav>
	);
}
