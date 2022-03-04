import { expect } from '@bundled-es-modules/chai';
import { addMissingPoints, roundHour } from '../src/lib/chart-add-points.js';
// import { fakeMetricData } from '../stories/overview/cc-tile-metrics.stories.js';

const ONE_HOUR = 3600;
function addTimestampFrom(ts, array) {
  const startTs = ts;
  return array.map((usedPercent, index) => {
    return [startTs + index * ONE_HOUR, ...usedPercent];
  });
}
const ONE_HOUR_MS = 60 * 60 * 1000;
function magicTs (startHour) {
  const now = new Date().getTime();
  const start = roundHour(now - ONE_HOUR_MS * 24);
  return (startHour >= 0 || startHour <= 24)
    ? (start + (ONE_HOUR_MS * startHour)) / 1000
    : start / 1000;
}

function fakeMetricData (numberOfPoints, usedPercent, linearIncrease = false) {
  return Array
    .from({ length: numberOfPoints })
    .map((_, index) => {
      const randomFactor = Math.random() / 5 + 1;
      const increase = (linearIncrease) ? (index + 2) / 100 : 0;
      return [usedPercent * randomFactor + increase];
    });
}

const START_DOWN = addTimestampFrom(
  magicTs(5),
  fakeMetricData(20, 24),
);

const MIDDLE_DOWN = addTimestampFrom(
  magicTs(3),
  [
    ...fakeMetricData(10, 24),
    ...fakeMetricData(4, 0),
    ...fakeMetricData(8, 30),
  ]);

const END_DOWN = addTimestampFrom(
  magicTs(0),
  fakeMetricData(12, 24),
);

describe('ChartMissingPointsGenerator', () => {

  describe('foobar', () => {

    it('start down', () => {
      console.log('START_DOWN', START_DOWN);
      console.log('START_DOWN_AMP', addMissingPoints(START_DOWN));
      expect(addMissingPoints(START_DOWN)).to.equal(0);
    });

    it('middle down', () => {
      console.log('MIDDLE_DOWN', MIDDLE_DOWN);
      console.log('MIDDLE_DOWN_AMP', addMissingPoints(MIDDLE_DOWN));
      expect(addMissingPoints(MIDDLE_DOWN)).to.equal(0);

    });

    it('end down', () => {
      console.log('END_DOWN', END_DOWN);
      console.log('END_DOWN_AMP', addMissingPoints(END_DOWN));
      expect(addMissingPoints(END_DOWN)).to.equal(0);
    });
  });


});
