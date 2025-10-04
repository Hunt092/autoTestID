// Integration tests for basic rule behavior
import { describe } from "vitest";
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

describe("Basic Rule Behavior", () => {
	describe("Valid Cases - Should NOT trigger errors", () => {
		ruleTester.run("require-testid", rule, {
			valid: [
				// Elements with existing data-testid
				'<button data-testid="submit-button">Submit</button>',
				'<input data-testid="email-input" type="email" />',
				'<a data-testid="home-link" href="/">Home</a>',
				'<select data-testid="country-select">Options</select>',
				'<textarea data-testid="comment-textarea">Comment</textarea>',
				'<form data-testid="login-form">Form content</form>',

				// Non-interactive elements (should be allowed)
				"<div>Just text content</div>",
				"<span>No interaction</span>",
				"<p>Paragraph text</p>",
				"<h1>Heading</h1>",
				'<img src="image.jpg" alt="Image" />',

				// Divs without interactive props (should be allowed)
				'<div className="container">Content</div>',
				'<div style={{color: "red"}}>Styled content</div>',
				'<div id="wrapper">Wrapper content</div>',

				// Custom components with dataTestId prop
				{
					code: '<Button dataTestId="primary-button">Click</Button>',
					options: [{ customComponents: ["Button"] }],
				},
				{
					code: '<Card dataTestId="user-card">Content</Card>',
					options: [{ customComponents: ["Card"] }],
				},
			],
			invalid: [],
		});
	});

	describe("Invalid Cases - Should trigger errors", () => {
		ruleTester.run("require-testid", rule, {
			valid: [],
			invalid: [
				// Interactive buttons without data-testid
				{
					code: "<button onClick={handleClick}>Submit</button>",
					filename: "LoginPage.jsx",
					errors: [{ messageId: "missingTestId" }],
					output:
						'<button data-testid="login-page-submit-button" onClick={handleClick}>Submit</button>',
				},
				{
					code: '<button type="submit">Submit Form</button>',
					filename: "ContactForm.jsx",
					errors: [{ messageId: "missingTestId" }],
					output:
						'<button data-testid="contact-form-submit-form-button" type="submit">Submit Form</button>',
				},

				// Interactive inputs without data-testid
				{
					code: '<input type="email" name="email" />',
					filename: "SignupPage.jsx",
					errors: [{ messageId: "missingTestId" }],
					output:
						'<input data-testid="signup-page-email-input" type="email" name="email" />',
				},
				{
					code: '<input type="password" placeholder="Password" />',
					filename: "LoginPage.jsx",
					errors: [{ messageId: "missingTestId" }],
					output:
						'<input data-testid="login-page-password-input" type="password" placeholder="Password" />',
				},

				// Links without data-testid
				{
					code: '<a href="/dashboard">Dashboard</a>',
					filename: "Navigation.jsx",
					errors: [{ messageId: "missingTestId" }],
					output:
						'<a data-testid="navigation-dashboard-a" href="/dashboard">Dashboard</a>',
				},
				{
					code: '<a href="#section1">Go to Section</a>',
					filename: "HomePage.jsx",
					errors: [{ messageId: "missingTestId" }],
					output:
						'<a data-testid="home-page-section1-a" href="#section1">Go to Section</a>',
				},

				// Interactive divs without data-testid
				{
					code: "<div onClick={handleClick}>Clickable div</div>",
					filename: "InteractiveComponent.jsx",
					errors: [{ messageId: "missingTestId" }],
					output:
						'<div data-testid="interactive-component-click-div" onClick={handleClick}>Clickable div</div>',
				},
				{
					code: "<div onMouseOver={handleHover}>Hoverable div</div>",
					filename: "HoverComponent.jsx",
					errors: [{ messageId: "missingTestId" }],
					output:
						'<div data-testid="hover-component-mouseover-div" onMouseOver={handleHover}>Hoverable div</div>',
				},

				// Custom components without dataTestId prop
				{
					code: "<Button onClick={handleClick}>Submit</Button>",
					filename: "ActionButton.jsx",
					options: [{ customComponents: ["Button"] }],
					errors: [{ messageId: "missingTestId" }],
					output:
						'<Button dataTestId="action-button-submit-Button" onClick={handleClick}>Submit</Button>',
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

	describe("Error Message Validation", () => {
		ruleTester.run("require-testid", rule, {
			valid: [],
			invalid: [
				{
					code: "<button>Submit</button>",
					filename: "TestComponent.jsx",
					errors: [
						{
							messageId: "missingTestId",
							data: {
								element: "button",
								suggestedId: "test-component-submit-button",
							},
						},
					],
					output:
						'<button data-testid="test-component-submit-button">Submit</button>',
				},
			],
		});
	});
});
