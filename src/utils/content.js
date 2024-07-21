import { SERVER_API_BASE, PROTOCOL } from "../config/paths";
import { fetchWithJWT } from "../utils/auth";
import { overwriteContent } from "../db/queries";

function formatDateToCustomFormat(date) {
  `formats the date string to be 2024-07-15 21:52:47
    instead of 2024-07-19T21:47:51.235Z`;

  const pad = (num) => String(num).padStart(2, "0");
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1); // Months are zero-indexed
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

export function updateTimestamps(data) {
  const currentTimestamp = formatDateToCustomFormat(new Date());
  return data.map((item) => ({
    ...item,
    timestamp: currentTimestamp,
  }));
}

export async function overwriteContentWithRemote(db) {
  const route = "/content/latest";
  const response = await fetchWithJWT(
    `${PROTOCOL}://${SERVER_API_BASE}${route}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  console.log("doneee");
  if (!response.ok) {
    throw new Error("Error fetching remote content");
  }
  const latestContent = await response.json();

  console.log("latestContent ***", latestContent);
  await overwriteContent(db, latestContent);
}
