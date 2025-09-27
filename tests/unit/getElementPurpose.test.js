// Unit tests for getElementPurpose function
import { describe, it, expect } from "vitest";
import { getElementPurpose } from "../../src/utils/testIdUtils.js";

describe("getElementPurpose", () => {
	it("should extract purpose from name attribute", () => {
		const mockNode = global.createMockNode("input", { name: "email" });
		const result = getElementPurpose(mockNode, "input");
		expect(result).toBe("email");
	});

	it("should extract purpose from type attribute", () => {
		const mockNode = global.createMockNode("input", { type: "password" });
		const result = getElementPurpose(mockNode, "input");
		expect(result).toBe("password");
	});

	it("should extract purpose from href attribute", () => {
		const mockNode = global.createMockNode("a", { href: "/dashboard" });
		const result = getElementPurpose(mockNode, "a");
		expect(result).toBe("dashboard");
	});

	it("should extract purpose from event handlers", () => {
		const mockNode = global.createMockNode("button", {
			onClick: "handleSubmit",
		});
		const result = getElementPurpose(mockNode, "button");
		expect(result).toBe("click");
	});

	it("should extract purpose from button text content", () => {
		const mockNode = {
			type: "JSXElement",
			openingElement: { name: { name: "button" }, attributes: [] },
			children: [{ type: "JSXText", value: " Submit " }],
		};
		const result = getElementPurpose(mockNode, "button");
		expect(result).toBe("submit");
	});

	it("should handle custom components with text content", () => {
		const mockNode = {
			type: "JSXElement",
			openingElement: { name: { name: "Button" }, attributes: [] },
			children: [{ type: "JSXText", value: " Save Changes " }],
		};
		const result = getElementPurpose(mockNode, "Button");
		expect(result).toBe("save-changes");
	});

	it("should return default purpose for unknown element types", () => {
		const mockNode = global.createMockNode("div", {});
		const result = getElementPurpose(mockNode, "div");
		expect(result).toBe("container");
	});

	it("should handle complex href values", () => {
		const mockNode = global.createMockNode("a", { href: "/users/123/profile" });
		const result = getElementPurpose(mockNode, "a");
		expect(result).toBe("users-123-profile");
	});

	it("should handle href with hash fragments", () => {
		const mockNode = global.createMockNode("a", { href: "#section1" });
		const result = getElementPurpose(mockNode, "a");
		expect(result).toBe("section1");
	});

	it("should prioritize name attribute over type attribute", () => {
		const mockNode = global.createMockNode("input", {
			name: "username",
			type: "text",
		});
		const result = getElementPurpose(mockNode, "input");
		expect(result).toBe("username");
	});

	it("should handle empty or missing attributes gracefully", () => {
		const mockNode = global.createMockNode("span", {});
		const result = getElementPurpose(mockNode, "span");
		expect(result).toBe("element");
	});
});
