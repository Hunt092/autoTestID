// Integration tests for configuration options
import { describe, it, expect } from "vitest";
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

describe("Configuration Tests", () => {
	describe("Custom Elements Configuration", () => {
		ruleTester.run("require-testid", rule, {
			valid: [
				// Elements NOT in custom list should be allowed
				{
					code: "<span>Text content</span>",
					options: [{ elements: ["button", "input"] }], // span not in elements
				},
				{
					code: "<p>Paragraph text</p>",
					options: [{ elements: ["button", "input", "a"] }], // p not in elements
				},
				{
					code: "<h1>Heading</h1>",
					options: [{ elements: ["button", "input"] }], // h1 not in elements
				},
				// Elements IN custom list should still work with data-testid
				{
					code: '<button data-testid="submit-button">Submit</button>',
					options: [{ elements: ["button", "input"] }],
				},
			],
			invalid: [
				// Elements IN custom list should trigger errors
				{
					code: "<button onClick={handleClick}>Click</button>",
					filename: "TestComponent.jsx",
					options: [{ elements: ["button", "input"] }],
					errors: [{ messageId: "missingTestId" }],
					output:
						'<button data-testid="test-component-click-button" onClick={handleClick}>Click</button>',
				},
				{
					code: "<input type='email' />",
					filename: "FormComponent.jsx",
					options: [{ elements: ["button", "input"] }],
					errors: [{ messageId: "missingTestId" }],
					output:
						"<input data-testid=\"form-component-email-input\" type='email' />",
				},
			],
		});
	});

	describe("Custom Components Configuration", () => {
		ruleTester.run("require-testid", rule, {
			valid: [
				// Components NOT in custom list should be allowed
				{
					code: "<Button onClick={handleClick}>Click</Button>",
					options: [{ customComponents: [] }], // No custom components
				},
				{
					code: "<Card>Content</Card>",
					options: [{ customComponents: ["Button"] }], // Card not in list
				},
				// Components IN custom list should work with dataTestId
				{
					code: '<Button dataTestId="primary-button">Click</Button>',
					options: [{ customComponents: ["Button"] }],
				},
			],
			invalid: [
				// Components IN custom list should trigger errors
				{
					code: "<Button onClick={handleClick}>Click</Button>",
					filename: "ActionButton.jsx",
					options: [{ customComponents: ["Button"] }],
					errors: [{ messageId: "missingTestId" }],
					output:
						'<Button dataTestId="action-button-click-Button" onClick={handleClick}>Click</Button>',
				},
				{
					code: "<Card>User Profile</Card>",
					filename: "ProfileCard.jsx",
					options: [{ customComponents: ["Card"] }],
					errors: [{ messageId: "missingTestId" }],
					output:
						'<Card dataTestId="profile-card-user-profile-Card">User Profile</Card>',
				},
			],
		});
	});

	describe("Exclude Patterns Configuration", () => {
		ruleTester.run("require-testid", rule, {
			valid: [
				// Files matching exclude patterns should be ignored
				{
					code: "<button onClick={handleClick}>Submit</button>",
					filename: "Component.test.jsx",
					options: [{ exclude: ["*.test.jsx"] }],
				},
				{
					code: "<button onClick={handleClick}>Submit</button>",
					filename: "Component.spec.jsx",
					options: [{ exclude: ["*.spec.jsx"] }],
				},
				{
					code: "<button onClick={handleClick}>Submit</button>",
					filename: "stories/Component.stories.jsx",
					options: [{ exclude: ["*.stories.jsx"] }],
				},
				{
					code: "<button onClick={handleClick}>Submit</button>",
					filename: "tests/Component.test.jsx",
					options: [{ exclude: ["tests/*"] }],
				},
			],
			invalid: [
				// Files NOT matching exclude patterns should trigger errors
				{
					code: "<button onClick={handleClick}>Submit</button>",
					filename: "Component.jsx",
					options: [{ exclude: ["*.test.jsx"] }],
					errors: [{ messageId: "missingTestId" }],
					output:
						'<button data-testid="component-submit-button" onClick={handleClick}>Submit</button>',
				},
				{
					code: "<button onClick={handleClick}>Submit</button>",
					filename: "src/Component.jsx",
					options: [{ exclude: ["*.test.jsx", "*.spec.jsx"] }],
					errors: [{ messageId: "missingTestId" }],
					output:
						'<button data-testid="component-submit-button" onClick={handleClick}>Submit</button>',
				},
			],
		});
	});

	describe("Custom Patterns Configuration", () => {
		ruleTester.run("require-testid", rule, {
			valid: [],
			invalid: [
				// Test different pattern formats
				{
					code: "<button onClick={handleClick}>Submit</button>",
					filename: "LoginPage.jsx",
					options: [{ pattern: "{element}-{purpose}-{page}" }],
					errors: [{ messageId: "missingTestId" }],
					output:
						'<button data-testid="button-submit-login-page" onClick={handleClick}>Submit</button>',
				},
				{
					code: "<input type='email' name='email' />",
					filename: "SignupForm.jsx",
					options: [{ pattern: "{purpose}-{element}" }],
					errors: [{ messageId: "missingTestId" }],
					output:
						"<input data-testid=\"email-input\" type='email' name='email' />",
				},
				{
					code: '<a href="/dashboard">Dashboard</a>',
					filename: "Navigation.jsx",
					options: [{ pattern: "{element}-{page}" }],
					errors: [{ messageId: "missingTestId" }],
					output:
						'<a data-testid="a-navigation" href="/dashboard">Dashboard</a>',
				},
				{
					code: "<button onClick={handleClick}>Submit</button>",
					filename: "UserProfile.jsx",
					options: [{ pattern: "test-{page}-{element}-{purpose}" }],
					errors: [{ messageId: "missingTestId" }],
					output:
						'<button data-testid="test-user-profile-button-submit" onClick={handleClick}>Submit</button>',
				},
			],
		});
	});

	describe("Combined Configuration", () => {
		ruleTester.run("require-testid", rule, {
			valid: [
				// Test multiple options working together
				{
					code: "<span>Text content</span>",
					filename: "Component.test.jsx",
					options: [
						{
							elements: ["button", "input"],
							customComponents: ["Button"],
							exclude: ["**/*.test.jsx"],
							pattern: "{element}-{purpose}",
						},
					],
				},
				{
					code: '<button data-testid="submit-button">Submit</button>',
					filename: "Component.jsx",
					options: [
						{
							elements: ["button", "input"],
							customComponents: ["Button"],
							exclude: ["**/*.test.jsx"],
							pattern: "{element}-{purpose}",
						},
					],
				},
			],
			invalid: [
				// Test multiple options working together
				{
					code: "<button onClick={handleClick}>Submit</button>",
					filename: "LoginPage.jsx",
					options: [
						{
							elements: ["button", "input"],
							customComponents: ["Button"],
							exclude: ["**/*.test.jsx"],
							pattern: "{element}-{purpose}",
						},
					],
					errors: [{ messageId: "missingTestId" }],
					output:
						'<button data-testid="button-submit" onClick={handleClick}>Submit</button>',
				},
				{
					code: "<Button onClick={handleClick}>Submit</Button>",
					filename: "ActionButton.jsx",
					options: [
						{
							elements: ["button", "input"],
							customComponents: ["Button"],
							exclude: ["**/*.test.jsx"],
							pattern: "{element}-{purpose}",
						},
					],
					errors: [{ messageId: "missingTestId" }],
					output:
						'<Button dataTestId="Button-submit" onClick={handleClick}>Submit</Button>',
				},
			],
		});
	});

	describe("Edge Cases Configuration", () => {
		ruleTester.run("require-testid", rule, {
			valid: [
				// Empty configuration should use defaults
				{
					code: "<span>Text content</span>",
					options: [{}], // Empty options object
				},
				// Partial configuration should work
				{
					code: "<span>Text content</span>",
					options: [{ elements: ["button"] }], // Only elements specified
				},
			],
			invalid: [],
		});
	});
});
