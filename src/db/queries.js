// getAllContentSorted
// getAllContentUnsorted
// sortContent

export async function getRootContent(db, table) {
  const roots = await db.getAllAsync(`
    SELECT *
    FROM ${table} 
    WHERE prevId IS NULL;`);
    if (roots.length === 0) {
      throw new Error("No root found, as there are no records with NULL prevId!");
    }
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

  // console.log(allContent);

  return allContent;
}

export async function overwriteTargetWithSource(db, target, source) {
  // Clear the target
  await db.execAsync(`DELETE FROM ${target}`);

  // Copy data from source to target
  await db.execAsync(`
    INSERT INTO ${target}
    SELECT *
    FROM ${source}
  `);

  console.log("Content copied to ${target} successfully.");
}


// not working
// const query = `
//   UPDATE ContentToEdit
//   SET ${field} = ?
//   WHERE id = ?;
// `;
// await db.execAsync(query, [newValue, id]);
  
export async function updateFieldById_ContentToEdit(db, id, field, newValue) {
  try {

    const statement = await db.prepareAsync(`
      UPDATE ContentToEdit
      SET ${field} = $newValue
      WHERE id = $id;
    `);

    await statement.executeAsync({
      $id: id,
      $newValue: newValue,
    });

    console.log(`attempted updating ${id} ${field} to ${newValue}`)

    const newContent = await getAllContentSorted(db, "ContentToEdit");
    // console.log("newContent ***", newContent);
  } catch (error) {
    console.log(
      `Unable to update ${field} of ContentToEdit table to the new value of ${newValue}`
    );
    console.error(error);
  }
}


export async function overwriteContentToEdit(db, contentToEditJson) {
  try {
    // Clear the ContentToEdit table
    await db.execAsync(`DELETE FROM ContentToEdit`);


    // console.log("contentToEditJson", contentToEditJson)

    const insertStatement = await db.prepareAsync(`
      INSERT INTO ContentToEdit (id, title, description, content, nextId, prevId)
      VALUES ($id, $title, $description, $content, $nextId, $prevId)
    `);
    

    await contentToEditJson.forEach(row => {
      insertStatement.executeAsync({
        $id: row.id,
        $title: row.title,
        $description: row.description,
        $content: row.content,
        $nextId: row.nextId,
        $prevId: row.prevId,
      });
    });

    console.log("ContentToEdit table overwritten successfully.");
    console.log("*** ContentToEdit start")
    const sortedContent = await getAllContentSorted(db, "ContentToEdit")
    sortedContent.forEach((item, i) => {
      console.log(`i, prevId, id, nextId ${i}, ${item.prevId}, ${item.id}, ${item.nextId}   (${item.title})`);
    });
    console.log("*** ContentToEdit end")
    
  } catch (error) {
    console.error("Error overwriting ContentToEdit table:", error);
    throw error;
  }
}