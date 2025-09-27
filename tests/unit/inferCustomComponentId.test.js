// Unit tests for inferCustomComponentIdFromAttributes function
import { describe, it, expect } from "vitest";
import { inferCustomComponentIdFromAttributes } from "../../src/utils/testIdUtils.js";

describe("inferCustomComponentIdFromAttributes", () => {
	it("should use label attribute when available", () => {
		const mockNode = global.createMockNode("Button", { label: "Submit Form" });
		const result = inferCustomComponentIdFromAttributes(mockNode, "Button");
		expect(result).toBe("submit-form");
	});

	it("should use placeholder attribute when label is not available", () => {
		const mockNode = global.createMockNode("Input", {
			placeholder: "Enter your name",
		});
		const result = inferCustomComponentIdFromAttributes(mockNode, "Input");
		expect(result).toBe("enter-your-name");
	});

	it("should use title attribute when label and placeholder are not available", () => {
		const mockNode = global.createMockNode("Card", { title: "User Profile" });
		const result = inferCustomComponentIdFromAttributes(mockNode, "Card");
		expect(result).toBe("user-profile");
	});

	it("should use name attribute when other attributes are not available", () => {
		const mockNode = global.createMockNode("Field", { name: "email" });
		const result = inferCustomComponentIdFromAttributes(mockNode, "Field");
		expect(result).toBe("email");
	});

	it("should fall back to component name when no attributes are available", () => {
		const mockNode = global.createMockNode("Button", {});
		const result = inferCustomComponentIdFromAttributes(mockNode, "Button");
		expect(result).toBe("button");
	});

	it("should prioritize label over other attributes", () => {
		const mockNode = global.createMockNode("Input", {
			label: "Email Address",
			placeholder: "Enter email",
			title: "Email Field",
			name: "email",
		});
		const result = inferCustomComponentIdFromAttributes(mockNode, "Input");
		expect(result).toBe("email-address");
	});

	it("should handle attributes with special characters", () => {
		const mockNode = global.createMockNode("Button", {
			label: "Save & Continue",
		});
		const result = inferCustomComponentIdFromAttributes(mockNode, "Button");
		expect(result).toBe("save-continue");
	});

	it("should handle empty attribute values", () => {
		const mockNode = global.createMockNode("Button", { label: "" });
		const result = inferCustomComponentIdFromAttributes(mockNode, "Button");
		expect(result).toBe("button");
	});

	it("should handle null attribute values", () => {
		const mockNode = global.createMockNode("Button", { label: null });
		const result = inferCustomComponentIdFromAttributes(mockNode, "Button");
		expect(result).toBe("button");
	});

	it("should handle component names with special characters", () => {
		const mockNode = global.createMockNode("CustomButton", {});
		const result = inferCustomComponentIdFromAttributes(
			mockNode,
			"CustomButton"
		);
		expect(result).toBe("custombutton");
	});

	it("should handle very long attribute values", () => {
		const longLabel =
			"This is a very long label that should be properly converted to a slug";
		const mockNode = global.createMockNode("Button", { label: longLabel });
		const result = inferCustomComponentIdFromAttributes(mockNode, "Button");
		expect(result).toBe(
			"this-is-a-very-long-label-that-should-be-properly-converted-to-a-slug"
		);
	});
});
