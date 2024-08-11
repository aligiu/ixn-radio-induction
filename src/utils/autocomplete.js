import fuzzysort from "fuzzysort";

// TODO: test
export function stripHtmlTags(html) {
  if (!html) {
    return html;
  }
  const noTags = html.replace(/<\/?[^>]+(>|$)/g, " ");
  const noTagsAndTrim = noTags.replace(/ +/g, " ").trim(); // convert multiple spaces to one space and trim start and ends
  return noTagsAndTrim;
}

// TODO: test
// Function to add tagFreeContent field to each item in contentData
export function addTagFreeContentAndSecret(contentData) {
  return contentData.map((item) => ({
    ...item,
    tagFreeContent: stripHtmlTags(item.content),
    tagFreeSecret: stripHtmlTags(item.secret),
  }));
}

// TODO: test
export function removeNonAlphanumeric(str) {
  return str.replace(/[^a-zA-Z0-9]/g, "");
}

// TODO: test
export function getSurroundingText(longString, query, boundaryWindowSize = 30) {
  const cleanQuery = removeNonAlphanumeric(query);
  // Perform the fuzzy search using fuzzysort
  const result = fuzzysort.single(cleanQuery, longString);
  const matchIndices = result ? result._indexes : [];

  // Calculate the surrounding text of the first pattern match
  const matchStart = Math.min(...matchIndices);
  const matchEnd = findLastConsecutive(matchIndices, matchStart);
  const surroundingStart = matchStart - boundaryWindowSize;
  const surroundingEnd = matchEnd + boundaryWindowSize;

  const prefixAtBorder = surroundingStart <= 0;
  const suffixAtBorder = surroundingEnd >= longString.length;

  const prefix = `${prefixAtBorder ? "" : "..."}${longString.substring(
    surroundingStart,
    matchStart
  )}`;
  const matchedText = `${longString.substring(matchStart, matchEnd + 1)}`;
  const suffix = `${longString.substring(matchEnd + 1, surroundingEnd + 1)}${
    suffixAtBorder ? "" : "..."
  }`;
  return { matchedText, prefix, suffix };
}

function findLastConsecutive(array, start) {
    if (!Array.isArray(array)) {
      throw new TypeError("Input must be an array");
    }
    // Find the index of the starting point
    const startIndex = array.indexOf(start);
  
    // If the starting point is not found, return null
    if (startIndex === -1) return null;
  
    // Traverse the array from the startIndex
    let lastConsecutive = start;
    for (let i = startIndex + 1; i < array.length; i++) {
      // Check if the current element is consecutive to the lastConsecutive
      if (array[i] === lastConsecutive + 1) {
        lastConsecutive = array[i];
      } else {
        // Break the loop if the sequence is broken
        break;
      }
    }
  
    return lastConsecutive;
  }
  