// getAllContentSorted
// getAllContentUnsorted
// sortContent

// CAUTION: sqlite can handle table names as parameters in ${} form
// but not value parameters in ${} as they will be misunderstood as column names
// Must use prepared statements for values

// Eg

// The following will fail

// n = await db.getFirstAsync(
//   `SELECT COUNT(*) AS n FROM FileOps WHERE folderId=${folderId} AND fileName=${fileName}`
// )

// Instead, use prepared statements to handle value parameters:

// const getCountStatement = await db.prepareAsync(`
//   SELECT COUNT(*) AS n FROM FileOps
//   WHERE folderId=$folderId AND fileName=$fileName;
// `);
// res = await getCountStatement.executeAsync({
//   $folderId: folderId,
//   $fileName: fileName,
// });
// n = (await res.getFirstAsync())["n"];

import { setSchema } from "./setSchema";

export async function getRootContent(db, table) {
  await setSchema(db);
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
  await setSchema(db);
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
  await setSchema(db);
  const nexts = await db.getAllAsync(`
    SELECT *
    FROM ${table} 
    WHERE prevId IS ${curr_id};`);
  if (nexts.length > 1) {
    throw new Error(
      "More than one record with prevId == id of current record!"
    );
  }
  return nexts[0]; // there should only be one next
}

export async function getPrevContent(db, table, curr_id) {
  await setSchema(db);
  const prevs = await db.getAllAsync(`
    SELECT *
    FROM ${table} 
    WHERE nextId IS ${curr_id};`);
  if (prevs.length > 1) {
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
      id: int (pk),  
      title: String,
      description: String,
      content: String,
      nextId: int,
      prevId: int,
      secret: String;
    },
    ...
  ]`;
  await setSchema(db);
  const allContent = [];
  n = (await db.getFirstAsync(`SELECT COUNT(*) AS n FROM ${table}`))["n"];
  if (n === 0) {
    return [];
  }
  root = await getRootContent(db, table);
  allContent.push(root);
  // console.log("root", root)
  // console.log("rootNext", await getNextContent(db, "Content", root.id))

  while (allContent.length < n) {
    prev = allContent[allContent.length - 1];
    curr = await getNextContent(db, table, prev.id);
    // console.log("curr", curr)
    allContent.push(curr);
  }

  // console.log(allContent);

  return allContent;
}

export async function getAllContent(db, table) {
  await setSchema(db);
  const content = await db.getAllAsync(`
    SELECT *
    FROM ${table}`);
  return content; // there should only be one root
}

export async function overwriteTargetWithSource(db, target, source) {
  await setSchema(db);

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
    console.log(`Modifying field ${field} to newValue of ${newValue}`);

    const statement = await db.prepareAsync(`
      UPDATE ContentToEdit
      SET ${field} = $newValue
      WHERE id = $id;
    `);

    await statement.executeAsync({
      $id: id,
      $newValue: newValue,
    });

    console.log(`attempted updating ${id} ${field} to ${newValue}`);

    const newContent = await getAllContentSorted(db, "ContentToEdit");
    console.log("newContent ***", newContent);
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
      INSERT INTO ContentToEdit (id, title, description, content, nextId, prevId, secret)
      VALUES ($id, $title, $description, $content, $nextId, $prevId, $secret)
    `);

    await contentToEditJson.forEach((datapoint) => {
      insertStatement.executeAsync({
        $id: datapoint.id,
        $title: datapoint.title,
        $description: datapoint.description,
        $content: datapoint.content,
        $nextId: datapoint.nextId,
        $prevId: datapoint.prevId,
        $secret: datapoint.secret ? datapoint.secret : null,
      });
    });

    console.log("ContentToEdit table overwritten successfully.");
    console.log("*** ContentToEdit start");
    const sortedContent = await getAllContentSorted(db, "ContentToEdit");
    sortedContent.forEach((item, i) => {
      console.log(
        `i, prevId, id, nextId ${i}, ${item.prevId}, ${item.id}, ${item.nextId}   (${item.title})`
      );
    });
    console.log("*** ContentToEdit end");
  } catch (error) {
    console.error("Error overwriting ContentToEdit table:", error);
    throw error;
  }
}

export async function overwriteContent(db, contentData) {
  try {
    // set schema if not already existing
    await setSchema(db);

    // Delete existing Content data for overwrite
    await db.execAsync(`DELETE FROM Content`);

    // Insert data for Content (prepared statement can take parameters)
    const statement = await db.prepareAsync(`
      INSERT INTO Content (id, title, description, content, nextId, prevId, secret)
      VALUES ($id, $title, $description, $content, $nextId, $prevId, $secret);
    `);

    await Promise.all(
      contentData.map((datapoint, index) => {
        statement.executeAsync({
          $id: datapoint.id,
          $title: datapoint.title,
          $description: datapoint.description,
          $content: datapoint.content,
          $nextId: datapoint.nextId,
          $prevId: datapoint.prevId,
          $secret: datapoint.secret ? datapoint.secret : null,
        });
      })
    );

    await statement.finalizeAsync();

    // Confirm success
    console.log(`Content data has been updated in ${db.databaseName}`);

    // Iterate over the results and print fields in the same row
    const results = await db.getAllAsync("SELECT * FROM Content;");
    for (let i = 0; i < results.length; i++) {
      const row = results[i];
      console.log(
        `Row ${i + 1}: ID: ${row.id}, Title: ${row.title}, Description: ${
          row.description
        }, Content: ${row.content}, Next ID: ${row.nextId}, Previous ID: ${
          row.prevId
        }, Timestamp: ${row.timestamp}, Secret:${row.secret},
        `
      );
    }
    console.log("All updated content data printed.");
  } catch (error) {
    console.error("Error updating content data: ", error);
  }
}

export async function removeOpInFileOps(db, folderId, fileName) {
  const deleteStatement = await db.prepareAsync(`
    DELETE FROM FileOps
    WHERE folderId=$folderId AND fileName=$fileName;
  `);

  await deleteStatement.executeAsync({
    $folderId: folderId,
    $fileName: fileName,
  });

  const fileOps = await db.getAllAsync(`
    SELECT * FROM FileOps;
  `);

  console.log("fileOps DB:", fileOps);
}

export async function includeOpInFileOps(
  db,
  folderId,
  fileName,
  uri,
  operation
) {
  `
  uri points to local files for add operations and are not needed for delete operations
  `;
  try {
    await removeOpInFileOps(db, folderId, fileName);

    const insertStatement = await db.prepareAsync(`
      INSERT INTO FileOps (folderId, fileName, operation, uri)
      VALUES ($folderId, $fileName, $operation, $uri);
    `);

    insertStatement.executeAsync({
      $folderId: folderId,
      $fileName: fileName,
      $operation: operation,
      $uri: uri,
    });

    const fileOps = await db.getAllAsync(`
      SELECT * FROM FileOps;
    `);

    console.log("fileOps DB:", fileOps);

    console.log(
      `Included ${operation} operation for ${fileName} in FileOps successfully.`
    );
  } catch (error) {
    console.error(
      `Error including ${operation} operation for ${fileName} in FileOps.`,
      error
    );
    throw error;
  }
}

export async function getFileOps(db) {
  const fileOps = await db.getAllAsync(`
      SELECT * FROM FileOps;
    `);
  return fileOps;
}

export async function deleteAllFileOps(db) {
  await db.execAsync(`
      DELETE FROM FileOps;
    `);
}

export async function addOpAlreadyExists(db, folderId, fileName) {
  const getCountStatement = await db.prepareAsync(`
    SELECT COUNT(*) AS n FROM FileOps 
    WHERE folderId=$folderId AND fileName=$fileName AND operation='add';
  `);

  res = await getCountStatement.executeAsync({
    $folderId: folderId,
    $fileName: fileName,
  });

  n = (await res.getFirstAsync())["n"];

  console.log("n: ", n);

  return n > 0;
}
