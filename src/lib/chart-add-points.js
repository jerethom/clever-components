const ONE_HOUR = 60 * 60;
const ONE_HOUR_MS = 60 * 60 * 1000;

export function roundHour (ts) {
  return ts - (ts % ONE_HOUR_MS);
}

export function addMissingPoints (points) {

  const fPoints = points.map(([timestamp, usedPercent]) => ({ timestamp, usedPercent: usedPercent / 100 }));

  if (points.length === 24) {
    return fPoints;
  }

  const now = new Date().getTime();
  const end = roundHour(now);
  const start = roundHour(now - ONE_HOUR_MS * 24);
  const firstTs = fPoints[0].timestamp;
  const lastTs = fPoints[fPoints.length - 1].timestamp;

  const arr = [];

  if (firstTs !== start / 1000) {
    arr.push(...generateMissing(start / 1000, firstTs - ONE_HOUR));
  }

  fPoints.forEach(({ timestamp, usedPercent }, index) => {
    if (arr.length === 24) {
      return;
    }
    const nextPoint = fPoints?.[index + 1]?.timestamp ?? 0;
    if (timestamp + ONE_HOUR !== nextPoint && nextPoint !== 0) {
      arr.push(...generateMissing(timestamp, nextPoint));
    }
    else {
      arr.push({ timestamp, usedPercent: parseFloat(usedPercent) });
    }

  });

  if (lastTs !== end / 1000 && arr.length < 24) {
    arr.push(...generateMissing(lastTs, end / 1000));
  }

  return arr;
}

function generateMissing (startTs, end) {
  const missingHours = (end - startTs) / 3600;
  console.log('missingHours', missingHours - 1);
  const arr = [];
  for (let i = 0; i < missingHours; i++) {
    arr.push({ timestamp: startTs + (ONE_HOUR * (i + 1)), usedPercent: 0 });
  }
  return arr;
}
