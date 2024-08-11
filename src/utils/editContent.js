// TODO: test
export function getContentById(data, id) {
  console.log("data is: ", data);
  for (let d of data) {
    if (d.id === id) {
      return d;
    }
  }
  throw new Error(`No record with id = ${id}!`);
}

// TODO: test
export function getPrevContentById(data, id) {
  const currentRecord = getContentById(data, id);
  if (currentRecord.prevId === null) {
    return null; // Return null if the record is the root
  }
  return getContentById(data, currentRecord.prevId);
}

// TODO: test
export function getNextContentById(data, id) {
  const currentRecord = getContentById(data, id);
  if (currentRecord.nextId === null) {
    return null; // Return null if the record is the tail
  }
  return getContentById(data, currentRecord.nextId);
}

// TODO: test
export function getMaxNumPlusOne(nums) {
  // Finds the max number + 1
  let maxFound = 0;
  for (const num of nums) {
    maxFound = Math.max(maxFound, num);
  }
  return maxFound + 1;
}
