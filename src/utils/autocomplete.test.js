import {
  stripHtmlTags,
  addTagFreeContentAndSecret,
  removeNonAlphanumeric,
  getSurroundingText,
} from "./autocomplete";
import fuzzysort from "fuzzysort";

// Mock fuzzysort for testing
jest.mock("fuzzysort", () => ({
  single: jest.fn(),
}));

describe("autocomplete.js functions", () => {
  describe("stripHtmlTags", () => {
    it("should remove HTML tags from a string", () => {
      const htmlString = "<div>Hello <b>World</b></div>";
      const result = stripHtmlTags(htmlString);
      expect(result).toBe("Hello World");
    });

    it("should handle empty strings", () => {
      const htmlString = "";
      const result = stripHtmlTags(htmlString);
      expect(result).toBe("");
    });

    it("should handle strings with only HTML tags", () => {
      const htmlString = "<div><p></p></div>";
      const result = stripHtmlTags(htmlString);
      expect(result).toBe("");
    });

    it("should handle strings with multiple spaces", () => {
      const htmlString = "<div>Hello    <b>World</b></div>";
      const result = stripHtmlTags(htmlString);
      expect(result).toBe("Hello World");
    });
  });

  describe("addTagFreeContentAndSecret", () => {
    it("should add tagFreeContent and tagFreeSecret to each item", () => {
      const contentData = [
        { content: "<p>Hello</p>", secret: "<p>World</p>" },
        { content: "<b>Test</b>", secret: "<i>Secret</i>" },
      ];
      const expected = [
        {
          content: "<p>Hello</p>",
          secret: "<p>World</p>",
          tagFreeContent: "Hello",
          tagFreeSecret: "World",
        },
        {
          content: "<b>Test</b>",
          secret: "<i>Secret</i>",
          tagFreeContent: "Test",
          tagFreeSecret: "Secret",
        },
      ];
      const result = addTagFreeContentAndSecret(contentData);
      expect(result).toEqual(expected);
    });
  });

  describe("removeNonAlphanumeric", () => {
    it("should remove non-alphanumeric characters from a string", () => {
      const str = "Hello, World! 123";
      const result = removeNonAlphanumeric(str);
      expect(result).toBe("HelloWorld123");
    });

    it("should handle empty strings", () => {
      const str = "";
      const result = removeNonAlphanumeric(str);
      expect(result).toBe("");
    });

    it("should handle strings with only non-alphanumeric characters", () => {
      const str = "!@#$%^&*()";
      const result = removeNonAlphanumeric(str);
      expect(result).toBe("");
    });
  });

  describe("getSurroundingText", () => {
    beforeEach(() => {
      fuzzysort.single.mockClear();
    });

    it("should return surrounding text around a query", () => {
      const longString = "The quick brown fox jumps over the lazy dog";
      const query = "fox";
      fuzzysort.single.mockReturnValue({ _indexes: [16, 17, 18, 19, 20] });

      const result = getSurroundingText(longString, query);
      expect(result).toEqual({
        matchedText: "fox",
        prefix: "The quick brown ",
        suffix: " jumps over the lazy dog",
      });
    });

    it("should handle queries not found in the string", () => {
      const longString = "The quick brown fox jumps over the lazy dog";
      const query = "cat";
      fuzzysort.single.mockReturnValue(null);

      const result = getSurroundingText(longString, query);
      expect(result.matchedText).toEqual("");
    });

    it("should handle queries at the beginning and end of the string", () => {
      const longString = "The quick brown fox jumps over the lazy dog";
      const query = "The";
      fuzzysort.single.mockReturnValue({ _indexes: [0, 1, 2, 3] });

      const result = getSurroundingText(longString, query);
      expect(result).toEqual({
        matchedText: "The",
        prefix: "",
        suffix: " quick brown fox jumps over the lazy dog",
      });
    });

    it("should handle large boundary window sizes", () => {
      const longString = "The quick brown fox jumps over the lazy dog";
      const query = "jumps";
      fuzzysort.single.mockReturnValue({ _indexes: [20, 21, 22, 23, 24] });

      const result = getSurroundingText(longString, query, 100);
      expect(result).toEqual({
        matchedText: "jumps",
        prefix: "The quick brown fox ",
        suffix: " over the lazy dog",
      });
    });
  });
});
