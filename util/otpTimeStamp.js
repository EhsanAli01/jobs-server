function isWithinFiveMinutes(timestamp) {
  const now = Date.now();
  const inputTime = new Date(timestamp).getTime();
  const diffInMilliseconds = now - inputTime;
  const diffInMinutes = diffInMilliseconds / (1000 * 60);

  return diffInMinutes >= 0 && diffInMinutes <= 5;
}

module.exports = isWithinFiveMinutes;
