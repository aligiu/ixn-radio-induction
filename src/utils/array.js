// array is represented in this format where nextId, prevId is in correct order (indeed points to next/prev elements)
// but id/nextId/prevId might not be monotonic
// [
//     {
//       id: int pk of record,  
//       ...
//       nextId: int,
//       prevId: int,
//     },
//     ...
//   ]

// arrayOrdering is used for rendering, since using .map()
// nextId, prevId is used for storage, since SQL record storage should not depend on order

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
    const prevId = array[index].prevId
    const nextId = array[index].nextId
    let prev = null;
    let next = null;
    
    if (prevId !== null) {
        prev = array[getArrayIndexById(array, prevId)]  // O(n)
        prev.nextId = object.id
    }
    if (nextId !== null) {
        next = array[getArrayIndexById(array, nextId)]  // O(n)
        next.prevId = object.id
    }
    object.prevId = prevId
    object.nextId = nextId

    array.splice(index, 0, object)
}

function deleteAtIndex(array, index) {
    // Eg if linked list is [1, 2, 3] and insert value 5 into index 1
    // Then result is [1, 5, 2, 3]
    // If want to insert at last pos, simply do insertAtIndex(array, array.length)

    if (index < 0 || index >= array.length) {
        throw new Error(`Index ${index} out of range (length is ${array.length})`)
    }

    const prevId = array[index].prevId
    const nextId = array[index].nextId
    if (prevId !== null) {
        const prev = array[getArrayIndexById(array, prevId)]  // O(n)
        prev.nextId = nextId
    } 
    if (nextId !== null) {
        const next = array[getArrayIndexById(array, nextId)]  // O(n)
        next.prevId = prevId
    }

    array.splice(index, 1)
}







// insertion eg
// -- Assume new article details are (new_id, new_title, new_description, new_content)
// -- Insert new article
// INSERT INTO Articles (id, title, description, content, nextId, prevId)
// VALUES (new_id, new_title, new_description, new_content, B.id, A.id);

// -- Update Article A to point to the new article
// UPDATE Articles SET nextId = new_id WHERE id = A.id;

// -- Update Article B to point to the new article
// UPDATE Articles SET prevId = new_id WHERE id = B.id;
