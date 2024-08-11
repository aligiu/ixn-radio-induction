import fuzzysort from 'fuzzysort';

// Function to strip HTML tags from a string
export function stripHtmlTags(html) {
  if (!html) {
    return html;
  }
  const noTags = html.replace(/<\/?[^>]+(>|$)/g, ' ');
  const noTagsAndTrim = noTags.replace(/ +/g, ' ').trim(); // convert multiple spaces to one space and trim start and ends
  return noTagsAndTrim;
}

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
  return str.replace(/[^a-zA-Z0-9]/g, '');
}

// Function to get surrounding text around a fuzzy search query
export function getSurroundingText(longString, query, boundaryWindowSize = 30) {
  const cleanQuery = removeNonAlphanumeric(query);

  // Perform the fuzzy search using fuzzysort
  const result = fuzzysort.single(cleanQuery, longString);
  const matchIndices = result ? result._indexes : [];

  // If no matches, return the full text with boundaries
  if (matchIndices.length === 0) {
    return {
      matchedText: '',
      prefix: longString.substring(0, boundaryWindowSize),
      suffix: longString.substring(longString.length - boundaryWindowSize),
    };
  }

  // Calculate the start and end of the surrounding text
  const matchStart = Math.min(...matchIndices);
  const matchEnd = findLastConsecutive(matchIndices, matchStart) + 1; // Adjust end index to include the last match
  const surroundingStart = Math.max(matchStart - boundaryWindowSize, 0);
  const surroundingEnd = Math.min(matchEnd + boundaryWindowSize, longString.length);

  const prefixAtBorder = surroundingStart === 0;
  const suffixAtBorder = surroundingEnd === longString.length;

  const prefix = `${prefixAtBorder ? '' : '...'}${longString.substring(surroundingStart, matchStart)}`;
  const matchedText = longString.substring(matchStart, matchEnd); // Adjust to include up to matchEnd
  const suffix = `${longString.substring(matchEnd, surroundingEnd)}${suffixAtBorder ? '' : '...'}`;

  return { matchedText, prefix, suffix };
}

// Helper function to find the last consecutive index in an array
function findLastConsecutive(array, start) {
  if (!Array.isArray(array)) {
    throw new TypeError('Input must be an array');
  }

  const startIndex = array.indexOf(start);

  if (startIndex === -1) return null;

  let lastConsecutive = start;
  for (let i = startIndex + 1; i < array.length; i++) {
    if (array[i] === lastConsecutive + 1) {
      lastConsecutive = array[i];
    } else {
      break;
    }
  }

  return lastConsecutive;
}
