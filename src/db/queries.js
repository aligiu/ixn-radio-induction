// getAllContentSorted
// getAllContentUnsorted
// sortContent

export async function getRootContent(db, table) {
  const roots = await db.getAllAsync(`
    SELECT *
    FROM ${table} 
    WHERE prevId IS NULL;`);
  if (roots.length !== 1) {
    throw new Error("More than one record with NULL prevId found!");
  }
  return roots[0]; // there should only be one root
}

export async function getTailContent(db, table) {
  const tails = await db.getAllAsync(`
    SELECT *
    FROM ${table} 
    WHERE nextId IS NULL;`);
  if (tails.length !== 1) {
    throw new Error("More than one record with NULL nextId found!");
  }
  return tails[0]; // there should only be one tail
}

export async function getNextContent(db, table, curr_id) {
  const nexts = await db.getAllAsync(`
    SELECT *
    FROM ${table} 
    WHERE prevId IS ${curr_id};`);
  if (nexts.length !== 1) {
    throw new Error(
      "More than one record with prevId == id of current record!"
    );
  }
  return nexts[0]; // there should only be one next
}

export async function getPrevContent(db, table, curr_id) {
  const prevs = await db.getAllAsync(`
    SELECT *
    FROM ${table} 
    WHERE nextId IS ${curr_id};`);
  if (prevs.length !== 1) {
    throw new Error(
      "More than one record with nextId == id of current record!"
    );
  }
  return prevs[0]; // there should only be one prev
}

export async function getAllContentSorted(db, table) {
  `returns content as an array of objects
  [
    {
      id: int pk of record,  
      title: "Ashford and St Peter's",
      description: "A comprehensive overview of services and specialties offered.",
      content: "html string...",
      nextId: int,
      prevId: int,
    },
    ...
  ]`;
  allContent = [];
  n = (await db.getFirstAsync(`SELECT COUNT(*) AS n FROM ${table}`))["n"];
  if (n === 0) {
    return [];
  }
  root = await getRootContent(db, table);
  allContent.push(root);

  while (allContent.length < n) {
    prev = allContent[allContent.length - 1];
    curr = await getNextContent(db, table, prev.id);
    allContent.push(curr);
  }

  console.log(allContent);

  return allContent;
}


export async function copyContentToContentToEdit(db) {
  // Clear the ContentToEdit table
  await db.execAsync(`DELETE FROM ContentToEdit`);

  // Copy content from Content to ContentToEdit
  await db.execAsync(`
    INSERT INTO ContentToEdit
    SELECT *
    FROM Content
  `);

  console.log("Content copied to ContentToEdit successfully.");
}