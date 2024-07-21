export function getAddedContent(contentToEdit, content) {
  const contentMap = new Map(content.map((item) => [item.id, item]));
  return contentToEdit.filter((item) => !contentMap.has(item.id));
}

export function getDeletedContent(contentToEdit, content) {
  const contentToEditMap = new Map(
    contentToEdit.map((item) => [item.id, item])
  );
  return content.filter((item) => !contentToEditMap.has(item.id));
}

export function getModifiedContent(contentToEdit, content) {
  const contentMap = new Map(content.map((item) => [item.id, item]));
  return contentToEdit.filter((item) => {
    if (!contentMap.has(item.id)) {
      return false;
    }
    const originalItem = contentMap.get(item.id);
    console.log(
      "title *",
      item.title,
      originalItem.title,
      item.title !== originalItem.title
    );
    console.log(
      "description *",
      item.description,
      originalItem.description,
      item.description !== originalItem.description
    );
    console.log(
      "content *",
      item.content,
      originalItem.content,
      item.content !== originalItem.content
    );
    console.log(
      "secret *",
      item.secret,
      originalItem.secret,
      item.secret !== originalItem.secret
    );
    return (
      item.title !== originalItem.title ||
      item.description !== originalItem.description ||
      item.content !== originalItem.content ||
      item.secret !== originalItem.secret
    );
  });
}

export function getRearrangedContent(contentToEdit, content) {
  const contentMap = new Map(content.map((item) => [item.id, item]));
  return contentToEdit.filter((item) => {
    if (!contentMap.has(item.id)) return false;
    const originalItem = contentMap.get(item.id);
    return (
      item.nextId !== originalItem.nextId || item.prevId !== originalItem.prevId
    );
  });
}

export function extractTitles(items) {
  return items.map((item) => item.title);
}
