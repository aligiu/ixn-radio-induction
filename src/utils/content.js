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
