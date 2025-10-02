// Real-world scenario tests for the require-testid rule
// These tests use complete React components that developers actually write in production
import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { RuleTester } from "eslint";
import rule from "../../src/rules/require-testid.js";

const ruleTester = new RuleTester({
	languageOptions: {
		ecmaVersion: 2020,
		sourceType: "module",
		parserOptions: {
			ecmaFeatures: {
				jsx: true,
			},
		},
	},
});

describe("Real-world Scenarios", () => {
	const __filename = fileURLToPath(import.meta.url);
	const __dirname = path.dirname(__filename);
	const readFixture = (name) =>
		fs
			.readFileSync(
				path.resolve(__dirname, "../fixtures/real-world", name),
				"utf8"
			)
			.replace(/\r\n/g, "\n");
	describe("Login Form Component", () => {
		ruleTester.run("require-testid", rule, {
			valid: [
				// Complete login form with all required test IDs
				{
					code: `
            function LoginForm() {
              const [email, setEmail] = useState('');
              const [password, setPassword] = useState('');
              const [rememberMe, setRememberMe] = useState(false);
              
              return (
                <form data-testid="login-form" onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input 
                      data-testid="email-input"
                      type="email" 
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required 
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input 
                      data-testid="password-input"
                      type="password" 
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required 
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>
                      <input 
                        data-testid="remember-me-checkbox"
                        type="checkbox" 
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                      />
                      Remember me
                    </label>
                  </div>
                  
                  <button 
                    data-testid="submit-button"
                    type="submit"
                    disabled={!email || !password}
                  >
                    Sign In
                  </button>
                  
                  <a 
                    data-testid="forgot-password-link"
                    href="/forgot-password"
                    className="forgot-link"
                  >
                    Forgot your password?
                  </a>
                </form>
              );
            }
          `,
					filename: "LoginForm.jsx",
				},
			],
			invalid: [
				// Login form missing test IDs - should trigger errors
				{
					code: `
            function LoginForm() {
              const [email, setEmail] = useState('');
              const [password, setPassword] = useState('');
              const [rememberMe, setRememberMe] = useState(false);
              
              return (
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input 
                      type="email" 
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required 
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input 
                      type="password" 
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required 
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>
                      <input 
                        type="checkbox" 
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                      />
                      Remember me
                    </label>
                  </div>
                  
                  <button 
                    type="submit"
                    disabled={!email || !password}
                  >
                    Sign In
                  </button>
                  
                  <a 
                    href="/forgot-password"
                    className="forgot-link"
                  >
                    Forgot your password?
                  </a>
                </form>
              );
            }
          `,
					filename: "LoginForm.jsx",
					errors: [
						{
							messageId: "missingTestId",
							data: {
								element: "form",
								suggestedId:
									"login-form-email-password-remember-me-sign-in-forgot-your-password-form",
							},
						},
						{
							messageId: "missingTestId",
							data: { element: "input", suggestedId: "login-form-email-input" },
						},
						{
							messageId: "missingTestId",
							data: {
								element: "input",
								suggestedId: "login-form-password-input",
							},
						},
						{
							messageId: "missingTestId",
							data: {
								element: "input",
								suggestedId: "login-form-checkbox-input",
							},
						},
						{
							messageId: "missingTestId",
							data: {
								element: "button",
								suggestedId: "login-form-sign-in-button",
							},
						},
						{
							messageId: "missingTestId",
							data: {
								element: "a",
								suggestedId: "login-form-forgot-password-a",
							},
						},
					],
					output: `
            function LoginForm() {
              const [email, setEmail] = useState('');
              const [password, setPassword] = useState('');
              const [rememberMe, setRememberMe] = useState(false);
              
              return (
                <form data-testid="login-form-email-password-remember-me-sign-in-forgot-your-password-form" onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input data-testid="login-form-email-input" 
                      type="email" 
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required 
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input data-testid="login-form-password-input" 
                      type="password" 
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required 
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>
                      <input data-testid="login-form-checkbox-input" 
                        type="checkbox" 
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                      />
                      Remember me
                    </label>
                  </div>
                  
                  <button data-testid="login-form-sign-in-button" 
                    type="submit"
                    disabled={!email || !password}
                  >
                    Sign In
                  </button>
                  
                  <a data-testid="login-form-forgot-password-a" 
                    href="/forgot-password"
                    className="forgot-link"
                  >
                    Forgot your password?
                  </a>
                </form>
              );
            }
          `,
				},
			],
		});
	});

	describe("Navigation Menu Component", () => {
		ruleTester.run("require-testid", rule, {
			valid: [
				// Complete navigation with all required test IDs
				{
					code: `
            function Navigation() {
              const [isMenuOpen, setIsMenuOpen] = useState(false);
              const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
              
              return (
                <nav data-testid="main-navigation" className="navbar">
                  <div className="nav-brand">
                    <a data-testid="logo-link" href="/">
                      <img src="/logo.png" alt="Company Logo" />
                    </a>
                  </div>
                  
                  <div className="nav-links">
                    <a data-testid="home-link" href="/">Home</a>
                    <a data-testid="products-link" href="/products">Products</a>
                    <a data-testid="about-link" href="/about">About</a>
                    <a data-testid="contact-link" href="/contact">Contact</a>
                  </div>
                  
                  <div className="nav-actions">
                    <div className="search-container">
                      <input 
                        data-testid="search-input"
                        type="text" 
                        placeholder="Search products..."
                        className="search-input"
                      />
                      <button data-testid="search-button" className="search-btn">
                        <SearchIcon />
                      </button>
                    </div>
                    
                    <div className="user-menu">
                      <button 
                        data-testid="user-menu-button"
                        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                        className="user-btn"
                      >
                        <UserIcon />
                      </button>
                      {isUserMenuOpen && (
                        <div data-testid="user-dropdown" className="user-dropdown">
                          <a data-testid="profile-link" href="/profile">Profile</a>
                          <a data-testid="settings-link" href="/settings">Settings</a>
                          <button data-testid="logout-button" onClick={handleLogout}>
                            Logout
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <button 
                    data-testid="mobile-menu-button"
                    className="mobile-menu-btn"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                  >
                    <MenuIcon />
                  </button>
                </nav>
              );
            }
          `,
					filename: "Navigation.jsx",
				},
			],
			invalid: [
				// Navigation missing test IDs - should trigger errors
				{
					code: readFixture("navigation.invalid.jsx"),
					filename: "Navigation.jsx",
					errors: [
						{
							messageId: "missingTestId",
							data: { element: "a", suggestedId: "navigation--a" },
						},
						{
							messageId: "missingTestId",
							data: { element: "a", suggestedId: "navigation--a" },
						},
						{
							messageId: "missingTestId",
							data: { element: "a", suggestedId: "navigation-products-a" },
						},
						{
							messageId: "missingTestId",
							data: { element: "a", suggestedId: "navigation-about-a" },
						},
						{
							messageId: "missingTestId",
							data: { element: "a", suggestedId: "navigation-contact-a" },
						},
						{
							messageId: "missingTestId",
							data: { element: "input", suggestedId: "navigation-text-input" },
						},
						{
							messageId: "missingTestId",
							data: {
								element: "button",
								suggestedId: "navigation-button-button",
							},
						},
						{
							messageId: "missingTestId",
							data: {
								element: "button",
								suggestedId: "navigation-click-button",
							},
						},
						{
							messageId: "missingTestId",
							data: { element: "a", suggestedId: "navigation-profile-a" },
						},
						{
							messageId: "missingTestId",
							data: { element: "a", suggestedId: "navigation-settings-a" },
						},
						{
							messageId: "missingTestId",
							data: {
								element: "button",
								suggestedId: "navigation-logout-button",
							},
						},
						{
							messageId: "missingTestId",
							data: {
								element: "button",
								suggestedId: "navigation-click-button",
							},
						},
					],
					output: readFixture("navigation.invalid.fixed.jsx"),
				},
			],
		});
	});

	describe("Data Table Component", () => {
		ruleTester.run("require-testid", rule, {
			valid: [
				// Complete data table with all required test IDs
				{
					code: `
            function UserTable({ users, onEdit, onDelete, onView }) {
              const [sortField, setSortField] = useState('name');
              const [sortDirection, setSortDirection] = useState('asc');
              const [filter, setFilter] = useState('');
              
              return (
                <div data-testid="user-table-container" className="table-container">
                  <div className="table-header">
                    <h2 data-testid="table-title">Users</h2>
                    <div className="table-controls">
                      <input 
                        data-testid="filter-input"
                        type="text" 
                        placeholder="Filter users..."
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                      />
                      <select 
                        data-testid="sort-select"
                        value={sortField}
                        onChange={(e) => setSortField(e.target.value)}
                      >
                        <option value="name">Name</option>
                        <option value="email">Email</option>
                        <option value="role">Role</option>
                      </select>
                      <button 
                        data-testid="sort-direction-button"
                        onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
                      >
                        {sortDirection === 'asc' ? '↑' : '↓'}
                      </button>
                    </div>
                  </div>
                  
                  <table data-testid="user-table" className="data-table">
                    <thead>
                      <tr>
                        <th data-testid="name-header">Name</th>
                        <th data-testid="email-header">Email</th>
                        <th data-testid="role-header">Role</th>
                        <th data-testid="actions-header">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map(user => (
                        <tr key={user.id} data-testid={\`user-row-\${user.id}\`}>
                          <td data-testid={\`user-name-\${user.id}\`}>{user.name}</td>
                          <td data-testid={\`user-email-\${user.id}\`}>{user.email}</td>
                          <td data-testid={\`user-role-\${user.id}\`}>{user.role}</td>
                          <td data-testid={\`user-actions-\${user.id}\`}>
                            <button 
                              data-testid={\`edit-button-\${user.id}\`}
                              onClick={() => onEdit(user)}
                              className="btn-edit"
                            >
                              Edit
                            </button>
                            <button 
                              data-testid={\`delete-button-\${user.id}\`}
                              onClick={() => onDelete(user.id)}
                              className="btn-delete"
                            >
                              Delete
                            </button>
                            <button 
                              data-testid={\`view-button-\${user.id}\`}
                              onClick={() => onView(user)}
                              className="btn-view"
                            >
                              View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  
                  <div className="table-footer">
                    <div className="pagination">
                      <button data-testid="prev-page-button" disabled={currentPage === 1}>
                        Previous
                      </button>
                      <span data-testid="page-info">
                        Page {currentPage} of {totalPages}
                      </span>
                      <button data-testid="next-page-button" disabled={currentPage === totalPages}>
                        Next
                      </button>
                    </div>
                  </div>
                </div>
              );
            }
          `,
					filename: "UserTable.jsx",
				},
			],
			invalid: [
				// Data table missing test IDs - should trigger errors
				{
					code: readFixture("data-table.invalid.jsx"),
					filename: "UserTable.jsx",
					errors: [
						{
							messageId: "missingTestId",
							data: { element: "input", suggestedId: "user-table-text-input" },
						},
						{
							messageId: "missingTestId",
							data: { element: "select", suggestedId: "user-table-select" },
						},
						{
							messageId: "missingTestId",
							data: {
								element: "button",
								suggestedId: "user-table-click-button",
							},
						},
						{
							messageId: "missingTestId",
							data: {
								element: "button",
								suggestedId: "user-table-click-button",
							},
						},
						{
							messageId: "missingTestId",
							data: {
								element: "button",
								suggestedId: "user-table-click-button",
							},
						},
						{
							messageId: "missingTestId",
							data: {
								element: "button",
								suggestedId: "user-table-click-button",
							},
						},
						{
							messageId: "missingTestId",
							data: {
								element: "button",
								suggestedId: "user-table-click-button",
							},
						},
						{
							messageId: "missingTestId",
							data: {
								element: "button",
								suggestedId: "user-table-click-button",
							},
						},
					],
					output: readFixture("data-table.invalid.fixed.jsx"),
				},
			],
		});
	});

	describe("Modal Dialog Component", () => {
		ruleTester.run("require-testid", rule, {
			valid: [
				// Complete modal with all required test IDs
				{
					code: `
            function ConfirmDialog({ isOpen, onClose, onConfirm, title, message }) {
              if (!isOpen) return null;
              
              return (
                <div data-testid="modal-backdrop" className="modal-backdrop" onClick={onClose}>
                  <div data-testid="modal-dialog" className="modal-dialog" onClick={(e) => e.stopPropagation()}>
                    <div className="modal-header">
                      <h3 data-testid="modal-title">{title}</h3>
                      <button 
                        data-testid="modal-close-button"
                        className="modal-close"
                        onClick={onClose}
                      >
                        ×
                      </button>
                    </div>
                    
                    <div className="modal-body">
                      <p data-testid="modal-message">{message}</p>
                    </div>
                    
                    <div className="modal-footer">
                      <button 
                        data-testid="modal-cancel-button"
                        className="btn-cancel"
                        onClick={onClose}
                      >
                        Cancel
                      </button>
                      <button 
                        data-testid="modal-confirm-button"
                        className="btn-confirm"
                        onClick={onConfirm}
                      >
                        Confirm
                      </button>
                    </div>
                  </div>
                </div>
              );
            }
          `,
					filename: "ConfirmDialog.jsx",
				},
			],
			invalid: [
				// Modal missing test IDs - should trigger errors
				{
					code: readFixture("modal.invalid.jsx"),
					filename: "ConfirmDialog.jsx",
					errors: [
						{
							messageId: "missingTestId",
							data: { element: "div", suggestedId: "confirm-dialog-click-div" },
						},
						{
							messageId: "missingTestId",
							data: { element: "div", suggestedId: "confirm-dialog-click-div" },
						},
						{
							messageId: "missingTestId",
							data: {
								element: "button",
								suggestedId: "confirm-dialog-click-button",
							},
						},
						{
							messageId: "missingTestId",
							data: {
								element: "button",
								suggestedId: "confirm-dialog-click-button",
							},
						},
						{
							messageId: "missingTestId",
							data: {
								element: "button",
								suggestedId: "confirm-dialog-click-button",
							},
						},
					],
					output: readFixture("modal.invalid.fixed.jsx"),
				},
			],
		});
	});

	describe("Search Interface Component", () => {
		ruleTester.run("require-testid", rule, {
			valid: [
				// Complete search interface with all required test IDs
				{
					code: `
            function SearchPage({ onSearch, onFilter, onSort }) {
              const [query, setQuery] = useState('');
              const [category, setCategory] = useState('all');
              const [sortBy, setSortBy] = useState('relevance');
              
              return (
                <div data-testid="search-page-container" className="search-page">
                  <div className="search-header">
                    <h1 data-testid="search-title">Search Products</h1>
                    <div className="search-form">
                      <input 
                        data-testid="search-query-input"
                        type="text" 
                        placeholder="Search for products..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                      />
                      <button 
                        data-testid="search-submit-button"
                        onClick={() => onSearch(query)}
                        className="search-btn"
                      >
                        Search
                      </button>
                    </div>
                  </div>
                  
                  <div className="search-filters">
                    <div className="filter-group">
                      <label data-testid="category-label">Category:</label>
                      <select 
                        data-testid="category-select"
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
                      <label data-testid="sort-label">Sort by:</label>
                      <select 
                        data-testid="sort-select"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                      >
                        <option value="relevance">Relevance</option>
                        <option value="price-low">Price: Low to High</option>
                        <option value="price-high">Price: High to Low</option>
                        <option value="newest">Newest</option>
                      </select>
                    </div>
                    
                    <button 
                      data-testid="apply-filters-button"
                      onClick={() => onFilter({ category, sortBy })}
                      className="apply-filters-btn"
                    >
                      Apply Filters
                    </button>
                  </div>
                  
                  <div className="search-results">
                    <div className="results-header">
                      <span data-testid="results-count">Found 0 results</span>
                      <div className="view-options">
                        <button data-testid="grid-view-button" className="view-btn active">
                          Grid
                        </button>
                        <button data-testid="list-view-button" className="view-btn">
                          List
                        </button>
                      </div>
                    </div>
                    
                    <div className="results-grid">
                      {/* Product cards would go here */}
                    </div>
                  </div>
                </div>
              );
            }
          `,
					filename: "SearchPage.jsx",
				},
			],
			invalid: [
				// Search interface missing test IDs - should trigger errors
				{
					code: readFixture("search.invalid.jsx"),
					filename: "SearchPage.jsx",
					errors: [
						{
							messageId: "missingTestId",
							data: { element: "input", suggestedId: "search-page-text-input" },
						},
						{
							messageId: "missingTestId",
							data: {
								element: "button",
								suggestedId: "search-page-click-button",
							},
						},
						{
							messageId: "missingTestId",
							data: { element: "select", suggestedId: "search-page-select" },
						},
						{
							messageId: "missingTestId",
							data: { element: "select", suggestedId: "search-page-select" },
						},
						{
							messageId: "missingTestId",
							data: {
								element: "button",
								suggestedId: "search-page-click-button",
							},
						},
						{
							messageId: "missingTestId",
							data: {
								element: "button",
								suggestedId: "search-page-click-button",
							},
						},
						{
							messageId: "missingTestId",
							data: {
								element: "button",
								suggestedId: "search-page-click-button",
							},
						},
					],
					output: readFixture("search.invalid.fixed.jsx"),
				},
			],
		});
	});
});
