const prependZero = (value: number) => (value < 10 ? `0${value}` : value);

const toMinutes = (s?: number | null): string => {
  const seconds = Math.floor(s || 0);

  if (!seconds || seconds < 1) return "0:00";

  if (seconds < 60) {
    return `0:${prependZero(seconds)}`;
  }

  if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60);
    const remainder = seconds % 60;

    return `${minutes}:${prependZero(remainder)}`;
  }

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainder = Math.floor((seconds % 3600) % 60);

  return `${hours}:${prependZero(minutes)}:${prependZero(remainder)}`;
};

export default toMinutes;
