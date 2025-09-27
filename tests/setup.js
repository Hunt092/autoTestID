// Vitest setup file
// Global test setup
import { beforeEach, vi } from "vitest";

beforeEach(() => {
	vi.clearAllMocks();
});

// Global test utilities
global.createMockNode = (tagName, attributes = {}, children = []) => ({
	type: "JSXElement",
	openingElement: {
		name: { name: tagName },
		attributes: Object.entries(attributes).map(([name, value]) => ({
			name: { name },
			value: { value, type: "Literal" },
		})),
	},
	children,
});

global.createMockContext = (filename = "TestComponent.jsx", options = {}) => ({
	getFilename: jest.fn(() => filename),
	options: [options],
	report: jest.fn(),
	getSourceCode: jest.fn(),
});
