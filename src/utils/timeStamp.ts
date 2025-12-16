export const timeStamp = (): string => {
  const now = new Date();

  const date = now
    .toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
    .replaceAll('.', '-');

  const time = now
    .toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    })
    .replaceAll(':', '-');
  return `${date} ${time}`;
};
