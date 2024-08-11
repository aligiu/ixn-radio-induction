import {
  getAddedContent,
  getDeletedContent,
  getModifiedContent,
  getRearrangedContent,
  extractTitles,
} from "./compareContent";

describe("compareContent utilities", () => {
  const originalContent = [
    {
      id: 1,
      title: "Item 1",
      description: "Desc 1",
      content: "Content 1",
      secret: "Username user1, Password pass1",
      nextId: 2,
      prevId: null,
    },
    {
      id: 2,
      title: "Item 2",
      description: "Desc 2",
      content: "Content 2",
      secret: "Username user2, Password pass2",
      nextId: 3,
      prevId: 1,
    },
    {
      id: 3,
      title: "Item 3",
      description: "Desc 3",
      content: "Content 3",
      secret: "",
      nextId: 4,
      prevId: 2,
    },
    {
      id: 4,
      title: "Item 4",
      description: "Desc 4",
      content: "Content 4",
      secret: "",
      nextId: 5,
      prevId: 3,
    },
    {
      id: 5,
      title: "Item 5",
      description: "Desc 5",
      content: "Content 5",
      secret: "",
      nextId: null,
      prevId: 4,
    },
  ];

  const editedContent = [
    {
      id: 1,
      title: "Item 1",
      description: "Desc 1",
      content: "Content 1",
      secret: "Username user1, Password pass1",
      nextId: 2,
      prevId: null,
    }, // Unchanged
    {
      id: 2,
      title: "Item 2",
      description: "Desc 2",
      content: "Content 2",
      secret: "Username user2, Password pass2",
      nextId: 4,
      prevId: 1,
    }, // Rearranged
    {
      id: 3,
      title: "Item 3",
      description: "Desc 3",
      content: "Content 3",
      secret: "New username user3, New password pass3",
      nextId: 6,
      prevId: 4,
    }, // Updated secret and rearranged
    {
      id: 4,
      title: "Item 4",
      description: "Desc 4",
      content: "Content 4 updated",
      secret: "",
      nextId: 3,
      prevId: 2,
    }, // Updated content and rearranged
    // Deleted id 5
    {
      id: 6,
      title: "Item 6",
      description: "Desc 6",
      content: "Content 6",
      secret: "",
      nextId: null,
      prevId: 3,
    }, // Added (but content with id 6 is newly added, so it is not considered a modification)
  ];

  const fileOps = [
    {
      folderId: 6,
      operation: "add",
      fileName: "timetable.jpg",
      uri: "path/to/file",
    },
    {
      folderId: 3,
      operation: "modify",
      fileName: "recording.mp4",
      uri: "path/to/file",
    },
    { folderId: 3, operation: "delete", fileName: "guidelines.pdf", uri: "" },
  ];

  it("should return added content", () => {
    const result = getAddedContent(editedContent, originalContent);
    expect(result).toEqual([
      {
        id: 6,
        title: "Item 6",
        description: "Desc 6",
        content: "Content 6",
        secret: "",
        nextId: null,
        prevId: 3,
      },
    ]);
  });

  it("should return deleted content", () => {
    const result = getDeletedContent(editedContent, originalContent);
    expect(result).toEqual([
      {
        id: 5,
        title: "Item 5",
        description: "Desc 5",
        content: "Content 5",
        secret: "",
        nextId: null,
        prevId: 4,
      },
    ]);
  });

  it("should return modified content", () => {
    const result = getModifiedContent(editedContent, originalContent, fileOps);
    expect(result).toEqual([
      {
        id: 3,
        title: "Item 3",
        description: "Desc 3",
        content: "Content 3",
        secret: "New username user3, New password pass3",
        nextId: 6,
        prevId: 4,
      },
      {
        id: 4,
        title: "Item 4",
        description: "Desc 4",
        content: "Content 4 updated",
        secret: "",
        nextId: 3,
        prevId: 2,
      },
    ]);
  });

  it("should return rearranged content", () => {
    const result = getRearrangedContent(editedContent, originalContent);
    expect(result).toEqual([
      {
        id: 2,
        title: "Item 2",
        description: "Desc 2",
        content: "Content 2",
        secret: "Username user2, Password pass2",
        nextId: 4,
        prevId: 1,
      },
      {
        id: 3,
        title: "Item 3",
        description: "Desc 3",
        content: "Content 3",
        secret: "New username user3, New password pass3",
        nextId: 6,
        prevId: 4,
      },
      {
        id: 4,
        title: "Item 4",
        description: "Desc 4",
        content: "Content 4 updated",
        secret: "",
        nextId: 3,
        prevId: 2,
      },
    ]);
  });

  it("should extract titles", () => {
    const result = extractTitles(editedContent);
    expect(result).toEqual(["Item 1", "Item 2", "Item 3", "Item 4", "Item 6"]);
  });
});
