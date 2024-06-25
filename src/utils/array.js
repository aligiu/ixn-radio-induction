// array is represented in this format where next_id, prev_id is in correct order (indeed points to next/prev elements)
// but id/next_id/prev_id might not be monotonic
// [
//     {
//       id: int pk of record,  
//       ...
//       next_id: int,
//       prev_id: int,
//     },
//     ...
//   ]

// arrayOrdering is used for rendering, since using .map()
// next_id, prev_id is used for storage, since SQL record storage should not depend on order

// TODO: refactor to only use next_id and prev_id, and have dedicated sort method to get the linked list into array format

// splice https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/splice

function getArrayIndexById(array, id) {
    index = 0
    while (index < array.length) {
        if (array[index][id] === id) {
            return index
        }
        index++
    }
    throw new Error(`Id ${id} not found in array`)
}

function getUnusedIdFromArray(array) {
    let maxId = -1
    for (item of array) {
        if (item.id > maxId) {
            maxId = item.id
        }
    }
    return maxId + 1  // + 1 to ensure larger than max, hence unused
}

function insertAtIndex(array, index, object) {
    // Eg if array is [1, 2, 3] and insert value 5 into index 1
    // Then result is [1, 5, 2, 3]
    // If want to insert at last pos, simply do insertAtIndex(array, array.length)
    if (index < 0 || index > array.length) {
        throw new Error(`Index ${index} out of range (length is ${array.length})`)
    }

    object.id = getUnusedIdFromArray(array)  // O(n)
    const prev_id = array[index].prev_id
    const next_id = array[index].next_id
    let prev = null;
    let next = null;
    
    if (prev_id !== null) {
        prev = array[getArrayIndexById(array, prev_id)]  // O(n)
        prev.next_id = object.id
    }
    if (next_id !== null) {
        next = array[getArrayIndexById(array, next_id)]  // O(n)
        next.prev_id = object.id
    }
    object.prev_id = prev_id
    object.next_id = next_id

    array.splice(index, 0, object)
}

function deleteAtIndex(array, index) {
    // Eg if linked list is [1, 2, 3] and insert value 5 into index 1
    // Then result is [1, 5, 2, 3]
    // If want to insert at last pos, simply do insertAtIndex(array, array.length)

    if (index < 0 || index >= array.length) {
        throw new Error(`Index ${index} out of range (length is ${array.length})`)
    }

    const prev_id = array[index].prev_id
    const next_id = array[index].next_id
    if (prev_id !== null) {
        const prev = array[getArrayIndexById(array, prev_id)]  // O(n)
        prev.next_id = next_id
    } 
    if (next_id !== null) {
        const next = array[getArrayIndexById(array, next_id)]  // O(n)
        next.prev_id = prev_id
    }

    array.splice(index, 1)
}







// insertion eg
// -- Assume new article details are (new_id, new_title, new_description, new_content)
// -- Insert new article
// INSERT INTO Articles (id, title, description, content, next_id, prev_id)
// VALUES (new_id, new_title, new_description, new_content, B.id, A.id);

// -- Update Article A to point to the new article
// UPDATE Articles SET next_id = new_id WHERE id = A.id;

// -- Update Article B to point to the new article
// UPDATE Articles SET prev_id = new_id WHERE id = B.id;
