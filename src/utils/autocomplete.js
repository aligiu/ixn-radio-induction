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
// Function to remove non-alphanumeric characters from a string
export function removeNonAlphanumeric(str) {
  return str.replace(/[^a-zA-Z0-9]/g, "");
}

// Function to get surrounding text around a query using exact match
export function getSurroundingText(longString, query, boundaryWindowSize = 30) {
  const cleanQuery = removeNonAlphanumeric(query);

  // Find the exact match using indexOf
  const matchStart = longString.indexOf(cleanQuery);

  // If no match found, return empty matchedText and just the boundaries
  if (matchStart === -1) {
    const prefix = longString.substring(0, boundaryWindowSize);
    const suffix = longString.substring(
      Math.max(0, longString.length - boundaryWindowSize)
    );
    return {
      matchedText: "",
      prefix: prefix,
      suffix: suffix,
    };
  }

  // Calculate matchEnd based on the length of the cleanQuery
  const matchEnd = matchStart + cleanQuery.length;

  // Extract the exact match
  const matchedText = longString.substring(matchStart, matchEnd);

  // Extend surroundingStart and surroundingEnd to include full words
  const [surroundingStart, surroundingEnd] = [
    extendSurroundingStart(
      longString,
      Math.max(matchStart - boundaryWindowSize, 0)
    ),
    extendSurroundingEnd(
      longString,
      Math.min(matchEnd + boundaryWindowSize, longString.length)
    ),
  ];

  // Get the prefix and suffix
  const prefix = longString.substring(surroundingStart, matchStart);
  const suffix = longString.substring(matchEnd, surroundingEnd);

  // Handle edge cases for prefix and suffix
  const prefixText = surroundingStart === 0 ? prefix : `...${prefix}`;
  const suffixText =
    surroundingEnd === longString.length ? suffix : `${suffix}...`;

  return {
    matchedText,
    prefix: prefixText,
    suffix: suffixText,
  };
}

// Function to extend surroundingStart to include the first letter of the word
function extendSurroundingStart(longString, surroundingStart) {
  while (
    surroundingStart > 0 &&
    /[a-zA-Z0-9]/.test(longString[surroundingStart - 1])
  ) {
    surroundingStart--;
  }
  return surroundingStart;
}

// Function to extend surroundingEnd to include the last letter of the word
function extendSurroundingEnd(longString, surroundingEnd) {
  while (
    surroundingEnd < longString.length &&
    /[a-zA-Z0-9]/.test(longString[surroundingEnd])
  ) {
    surroundingEnd++;
  }
  return surroundingEnd;
}
