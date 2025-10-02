/**
 * Utility functions for test ID generation
 * These functions are extracted to make them testable
 *
 * @fileoverview Test ID generation utilities for ESLint plugin
 * @author Yash Chavan (Hunt092)
 * @version 1.0.0
 */

/**
 * @typedef {Object} JSXElement
 * @property {Object} openingElement - The opening JSX element
 * @property {Object} openingElement.name - Element name
 * @property {string} openingElement.name.name - Tag name
 * @property {Array} openingElement.attributes - Element attributes
 * @property {Array} [children] - Child elements
 */

/**
 * @typedef {Object} JSXAttribute
 * @property {Object} name - Attribute name
 * @property {string} name.name - Attribute name string
 * @property {Object} [value] - Attribute value
 * @property {string} [value.value] - Literal value
 * @property {string} [value.raw] - Raw value string
 * @property {string} value.type - Value type ('Literal', 'JSXExpressionContainer', etc.)
 */

/**
 * Generate a test ID based on the element and context
 * @param {JSXElement} node - The JSX element node
 * @param {string} elementType - The element type (button, input, etc.)
 * @param {string} filename - The source file name
 * @param {string} pattern - The test ID pattern template
 * @param {string[]} [customComponents] - List of custom components
 * @returns {string} Generated test ID
 */
export function generateTestId(
	node,
	elementType,
	filename,
	pattern,
	customComponents
) {
	// Extract page name from filename
	const pageName = getPageNameFromFile(filename);

	// Get element purpose from props or content
	const purpose = getElementPurpose(node, elementType);

	// For common components, try to get context from parent component
	const context = getElementContext(node, filename, customComponents || []);

	// Generate test ID based on pattern
	return pattern
		.replace("{page}", pageName)
		.replace("{purpose}", purpose)
		.replace("{element}", elementType)
		.replace("{context}", context);
}

/**
 * Extract page name from file path
 * @param {string} filename - The file path
 * @returns {string} Kebab-case page name
 */
export function getPageNameFromFile(filename) {
	// Extract component/page name from file path
	const pathParts = filename.split("/");
	const fileName = pathParts[pathParts.length - 1];
	const componentName = fileName.replace(/\.(jsx?|tsx?)$/, "");

	//handle empty filename
	if (!componentName) return "";

	// Convert PascalCase to kebab-case
	return (
		componentName
			// First, handle consecutive uppercase letters (acronyms)
			// Insert hyphen before uppercase letter that follows another uppercase letter
			// but only if the next character is lowercase (end of acronym)
			.replace(/([A-Z])([A-Z][a-z])/g, "$1-$2")
			// Then handle normal word boundaries (lowercase to uppercase)
			.replace(/([a-z])([A-Z])/g, "$1-$2")
			.toLowerCase()
	);
}

/**
 * Determine element purpose from props or content
 * @param {JSXElement} node - The JSX element node
 * @param {string} elementType - The element type
 * @returns {string} Element purpose (submit, email, etc.)
 */
export function getElementPurpose(node, elementType) {
	const openingElement = node.openingElement;

	// Check for common attributes that indicate purpose
	const nameAttr = openingElement.attributes.find(
		(attr) => attr.name && attr.name.name === "name"
	);
	if (nameAttr && nameAttr.value) {
		return nameAttr.value.value || nameAttr.value.raw?.replace(/['"]/g, "");
	}

	// Check for type attribute (for inputs and buttons)
	const typeAttr = openingElement.attributes.find(
		(attr) => attr.name && attr.name.name === "type"
	);
	if (typeAttr && typeAttr.value && elementType !== "button") {
		const typeValue =
			typeAttr.value.value || typeAttr.value.raw?.replace(/['"]/g, "");
		if (typeValue) {
			return typeValue;
		}
	}

	// Check for href attribute (for links)
	const hrefAttr = openingElement.attributes.find(
		(attr) => attr.name && attr.name.name === "href"
	);
	if (hrefAttr && hrefAttr.value) {
		const hrefValue =
			hrefAttr.value.value || hrefAttr.value.raw?.replace(/['"]/g, "");
		if (hrefValue) {
			return hrefValue.replace(/[/#]/g, "-").replace(/^-/, "");
		}
	}

	// Check for onClick or other event handlers
	const eventAttr = openingElement.attributes.find(
		(attr) => attr.name && attr.name.name.startsWith("on")
	);
	// Special case: For divs, prioritize event handlers over text content
	if (elementType === "div" && eventAttr) {
		return eventAttr.name.name.replace("on", "").toLowerCase();
	}
	// Try to get purpose from text content first (highest priority)
	if (node.children.length > 0) {
		const textContent = getTextContent(node);
		if (textContent) {
			return textContent
				.toLowerCase()
				.replace(/[^a-z0-9]/g, "-")
				.replace(/-+/g, "-")
				.replace(/^-|-$/g, "");
		}
	}

	// Fall back to event handlers if no text content
	if (eventAttr) {
		return eventAttr.name.name.replace("on", "").toLowerCase();
	}

	// Default purpose based on element type
	const defaultPurposes = {
		button: "button",
		input: "input",
		select: "select",
		textarea: "textarea",
		a: "link",
		form: "form",
		div: "container",
	};

	return defaultPurposes[elementType] || "element";
}

/**
 * Get element context for better test ID generation
 * @param {JSXElement} node - The JSX element node
 * @param {string} filename - The source file name
 * @param {string[]} [customComponents] - List of custom components
 * @returns {string} Element context string
 */
export function getElementContext(node, filename, customComponents) {
	// Check if this is a common component usage
	const isCommonComponent = isCommonComponentUsage(
		node,
		customComponents || []
	);

	if (isCommonComponent) {
		// For common components, use the parent component context
		const parentContext = getParentComponentContext(node, filename);
		return parentContext;
	}

	return "";
}

/**
 * Check if this is a common component usage (Button, Card, etc.)
 * @param {JSXElement} node - The JSX element node
 * @param {string[]} customComponents - List of custom components
 * @returns {boolean} True if it's a common component
 */
export function isCommonComponentUsage(node, customComponents) {
	const tagName = node.openingElement.name.name;
	return customComponents.includes(tagName);
}

/**
 * Get parent component context for common component usage
 * @param {JSXElement} node - The JSX element node
 * @param {string} filename - The source file name
 * @returns {string} Parent component context
 */
export function getParentComponentContext(node, filename) {
	// Try to find the parent component by looking up the AST
	// For now, we'll use the file context and element purpose
	const pageName = getPageNameFromFile(filename);
	const purpose = getElementPurpose(node, node.openingElement.name.name);

	// Create a more specific context
	return `${pageName}-${purpose}`;
}

/**
 * Extract text content from JSX element
 * @param {JSXElement} node - The JSX element node
 * @returns {string} Extracted text content
 */
export function getTextContent(node) {
	if (!node.children) return "";

	return node.children
		.map((child) => {
			if (child.type === "JSXText") {
				return child.value.trim();
			} else if (child.type === "JSXElement") {
				return getTextContent(child);
			}
			return "";
		})
		.join(" ")
		.trim();
}

/**
 * Infer custom component ID from attributes
 * @param {JSXElement} node - The JSX element node
 * @param {string} componentName - The component name
 * @returns {string} Inferred component ID
 */
export function inferCustomComponentIdFromAttributes(node, componentName) {
	// Try common attributes that might indicate purpose
	const label = getJSXAttributeLiteral(node, "label");
	const placeholder = getJSXAttributeLiteral(node, "placeholder");
	const title = getJSXAttributeLiteral(node, "title");
	const name = getJSXAttributeLiteral(node, "name");

	const base =
		label || placeholder || title || name || componentName.toLowerCase();
	return toSlug(base);
}

/**
 * Get JSX attribute literal value
 * @param {JSXElement} node - The JSX element node
 * @param {string} attrName - The attribute name
 * @returns {string} Attribute literal value
 */
export function getJSXAttributeLiteral(node, attrName) {
	const attr = node.openingElement.attributes.find(
		(a) => a.name && a.name.name === attrName
	);
	if (!attr || !attr.value) return "";
	if (attr.value.type === "Literal") return String(attr.value.value || "");
	if (
		attr.value.type === "JSXExpressionContainer" &&
		attr.value.expression.type === "Literal"
	) {
		return String(attr.value.expression.value || "");
	}
	return "";
}

/**
 * Convert text to slug format
 * @param {string} text - The text to convert
 * @returns {string} Slug-formatted text
 */
export function toSlug(text) {
	return String(text)
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/(^-|-$)/g, "");
}
