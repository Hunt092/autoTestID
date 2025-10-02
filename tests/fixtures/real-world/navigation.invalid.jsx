function Navigation() {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

	return (
		<nav className="navbar">
			<div className="nav-brand">
				<a href="/">
					<img src="/logo.png" alt="Company Logo" />
				</a>
			</div>

			<div className="nav-links">
				<a href="/">Home</a>
				<a href="/products">Products</a>
				<a href="/about">About</a>
				<a href="/contact">Contact</a>
			</div>

			<div className="nav-actions">
				<div className="search-container">
					<input
						type="text"
						placeholder="Search products..."
						className="search-input"
					/>
					<button className="search-btn">
						<SearchIcon />
					</button>
				</div>

				<div className="user-menu">
					<button
						onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
						className="user-btn"
					>
						<UserIcon />
					</button>
					{isUserMenuOpen && (
						<div className="user-dropdown">
							<a href="/profile">Profile</a>
							<a href="/settings">Settings</a>
							<button onClick={handleLogout}>Logout</button>
						</div>
					)}
				</div>
			</div>

			<button
				className="mobile-menu-btn"
				onClick={() => setIsMenuOpen(!isMenuOpen)}
			>
				<MenuIcon />
			</button>
		</nav>
	);
}
