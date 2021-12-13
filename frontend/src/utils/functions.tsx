export function formatTimestamp(timeInMs: number) {
  const formatter = new Intl.DateTimeFormat('default', {
    minute: 'numeric',
    second: 'numeric'
  });

  const date = new Date(timeInMs);

  return formatter.format(date);
}
