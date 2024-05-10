// Function to format a date/time difference as a relative time string
function formatTimeAsTimeAgo(timestamp: string): string {
  const current = new Date(); // Current date/time
  const previous = new Date(timestamp); // Date/time to compare against

  const elapsed = current.getTime() - previous.getTime(); // Time difference in milliseconds

  // Calculate time difference in seconds, minutes, hours, days, or weeks
  const seconds = Math.floor(elapsed / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);

  // Determine the appropriate relative time format based on elapsed time
  if (weeks > 0) {
    return `${weeks}w`;
  } else if (days > 0) {
    return `${days}d`;
  } else if (hours > 0) {
    return `${hours}h`;
  } else if (minutes > 0) {
    return `${minutes}m`;
  } else {
    return `${seconds}s`;
  }
}

export default formatTimeAsTimeAgo;
