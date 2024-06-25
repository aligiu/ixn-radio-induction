// getAllContentSorted
// getAllContentUnsorted
// sortContent

async function getRootContent(db) {
  const roots = await db.getAllAsync(`
    SELECT *
    FROM Content 
    WHERE prev_id IS NULL;`);
  if (roots.length !== 1) {
    throw new Error("More than one record with NULL prev_id found!");
  }
  return roots[0]; // there should only be one root
}

async function getTailContent(db) {
  const tails = await db.getAllAsync(`
    SELECT *
    FROM Content 
    WHERE next_id IS NULL;`);
  if (tails.length !== 1) {
    throw new Error("More than one record with NULL next_id found!");
  }
  return tails[0]; // there should only be one tail
}

async function getNextContent(db, curr_id) {
  const nexts = await db.getAllAsync(`
    SELECT *
    FROM Content 
    WHERE prev_id IS ${curr_id};`);
  if (nexts.length !== 1) {
    throw new Error(
      "More than one record with prev_id == id of current record!"
    );
  }
  return nexts[0]; // there should only be one next
}

async function getPrevContent(db, curr_id) {
  const prevs = await db.getAllAsync(`
    SELECT *
    FROM Content 
    WHERE next_id IS ${curr_id};`);
  if (prevs.length !== 1) {
    throw new Error(
      "More than one record with next_id == id of current record!"
    );
  }
  return prevs[0]; // there should only be one prev
}

export async function getAllContentSorted(db) {
  `returns content as an array of objects
  [
    {
      id: int pk of record,  
      title: "Ashford and St Peter's",
      description: "A comprehensive overview of services and specialties offered.",
      content: "html string...",
      next_id: int,
      prev_id: int,
    },
    ...
  ]`;
  allContent = [];
  n = (await db.getFirstAsync(`SELECT COUNT(*) AS n FROM Content`))["n"];
  if (n === 0) {
    return [];
  }
  root = await getRootContent(db);
  allContent.push(root);

  while (allContent.length < n) {
    prev = allContent[allContent.length - 1];
    curr = await getNextContent(db, prev.id);
    allContent.push(curr);
  }

  return allContent;
}

