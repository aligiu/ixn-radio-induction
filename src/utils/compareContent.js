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

export function getModifiedContent(contentToEdit, content, fileOps) {
  const contentMap = new Map(content.map((item) => [item.id, item]));

  return contentToEdit.filter((item) => {
    if (!contentMap.has(item.id)) {
      return false;
    }
    const originalItem = contentMap.get(item.id);
    console.log(
      "title mod:",
      item.title,
      originalItem.title,
      item.title !== originalItem.title
    );
    console.log(
      "description mod:",
      item.description,
      originalItem.description,
      item.description !== originalItem.description
    );
    console.log(
      "content mod:",
      item.content,
      originalItem.content,
      item.content !== originalItem.content
    );
    console.log(
      "secret mod:",
      item.secret,
      originalItem.secret,
      item.secret !== originalItem.secret
    );
    return (
      item.title !== originalItem.title ||
      item.description !== originalItem.description ||
      item.content !== originalItem.content ||
      item.secret !== originalItem.secret || 
      (fileOps.filter(f=>f.folderId==item.id).length > 0)  // has either "add" or "delete" op
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
