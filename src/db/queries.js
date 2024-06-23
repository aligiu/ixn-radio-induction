export async function getAllContent(db) {
  `returns content as an array of objects
  [
    {
      title: "Ashford and St Peter's",
      description:
        "A comprehensive overview of services and specialties offered.",
      content: {"...": "..."}
    },
    ...
  ]`
  const allContentString = (await db.getFirstAsync(
    "SELECT json_string FROM Content"
  ))["json_string"];    
  const allContent = JSON.parse(allContentString)
  console.log(allContent)
  return allContent
}
