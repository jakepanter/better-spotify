const timestampFormatter = new Intl.DateTimeFormat('en-US', {
  minute: 'numeric',
  second: 'numeric',
});
export function formatTimestamp(timeInMs: number) {
  const date = new Date(timeInMs);
  return timestampFormatter.format(date);
}

const relativeFormatter = new Intl.RelativeTimeFormat('en-US', {
  numeric: 'always',
});
export function formatTimeDiff(target: number, now: number) {
  const timestamp = (now - target) / 1000;

  if (timestamp >= 31536000) return relativeFormatter.format(Math.ceil(-timestamp / 31536000), 'year');
  if (timestamp >= 2592000) return relativeFormatter.format(Math.ceil(-timestamp / 2592000), 'month');
  if (timestamp >= 604800) return relativeFormatter.format(Math.ceil(-timestamp / 604800), 'week');
  if (timestamp >= 86400) return relativeFormatter.format(Math.ceil(-timestamp / 86400), 'day');
  if (timestamp >= 3600) return relativeFormatter.format(Math.ceil(-timestamp / 3600), 'hour');
  if (timestamp >= 60) return relativeFormatter.format(Math.ceil(-timestamp / 60), 'minute');
  return relativeFormatter.format(Math.ceil(-timestamp), 'second');
}
