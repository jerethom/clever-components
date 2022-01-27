import '../../src/overview/cc-tile-metrics.js';
import { makeStory, storyWait } from '../lib/make-story.js';
import { enhanceStoriesNames } from '../lib/story-names.js';

export default {
  title: '🛠 Overview/<cc-tile-metrics>',
  component: 'cc-tile-metrics',
};

const conf = {
  component: 'cc-tile-metrics',
  // language=CSS
  css: `cc-tile-metrics {
      margin-bottom: 1rem;
  }`,
};

const baseItems = [
  { style: 'width: 275px' },
  { style: 'width: 380px' },
  { style: 'width: 540px' },
];

const ONE_HOUR = 60 * 60 * 1000;
function fakeMetricData (numberOfPoints, totalValue, usedPercent, linearIncrease = false) {
  return Array
    .from({ length: numberOfPoints })
    .map((_, index) => {
      const randomFactor = Math.random() / 5 + 1;
      const increase = (linearIncrease) ? (index + 2) / 100 : 0;
      return {
        usedPercent: usedPercent * randomFactor + increase,
        totalValue,
      };
    });
}

function now () {
  return new Date().getTime();
}

function addTimestamp (array) {
  const startTs = now();
  return array.map((item, index) => {
    return {
      ...item,
      timestamp: startTs + index * ONE_HOUR,
    };
  });
}

export const defaultStory = makeStory(conf, {
  items:
    baseItems.map((item) => ({
      ...item,
      cpuData: addTimestamp(fakeMetricData(24, 1, 0.25)),
      ramData: addTimestamp(fakeMetricData(24, 8227708928, 0.161)),
    })),
});

export const pics = makeStory(conf, {
  items:
    baseItems.map((item) => ({
      ...item,
      cpuData: addTimestamp(fakeMetricData(24, 1, 0.25)),
      ramData: addTimestamp([
        ...fakeMetricData(10, 2 * 1024 ** 3, 0.25),
        ...fakeMetricData(1, 8 * 1024 ** 3, 0.25 / 4),
        ...fakeMetricData(2, 8 * 1024 ** 3, 0.80),
        ...fakeMetricData(1, 8 * 1024 ** 3, 0.25 / 4),
        ...fakeMetricData(10, 2 * 1024 ** 3, 0.25),
      ]),
    })),
});

export const linearIncrease = makeStory(conf, {
  items:
    baseItems.map((item) => ({
      ...item,
      cpuData: addTimestamp(fakeMetricData(24, 1, 0.25, true)),
      ramData: addTimestamp([
        ...fakeMetricData(24, 2 * 1024 ** 3, 0.25, true),
      ]),
    })),
});

export const scaleUp = makeStory(conf, {
  items:
    baseItems.map((item) => ({
      ...item,
      cpuData: addTimestamp(fakeMetricData(24, 1, 0.4)),
      ramData: addTimestamp([
        ...fakeMetricData(12, 2 * 1024 ** 3, 0.5),
        ...fakeMetricData(12, 8 * 1024 ** 3, 0.5 / 4),
      ]),
    })),
});

export const scaleDown = makeStory(conf, {
  items:
    baseItems.map((item) => ({
      ...item,
      cpuData: addTimestamp(fakeMetricData(24, 1, 0.3)),
      ramData: addTimestamp([
        ...fakeMetricData(12, 8227708928, 0.161),
        ...fakeMetricData(12, 8227708928 / 2, 0.161 * 2),
      ]),
    })),
});

export const multipleScaleUp = makeStory(conf, {
  items:
    baseItems.map((item) => ({
      ...item,
      cpuData: addTimestamp(fakeMetricData(24, 1, 0.6)),
      ramData: addTimestamp([
        ...fakeMetricData(8, 2 * 1024 ** 3, 0.8),
        ...fakeMetricData(8, 4 * 1024 ** 3, 0.8 / 2),
        ...fakeMetricData(8, 8 * 1024 ** 3, 0.8 / 4),
      ]),
    })),
});

export const multipleScaleDown = makeStory(conf, {
  items:
    baseItems.map((item) => ({
      ...item,
      cpuData: addTimestamp(fakeMetricData(24, 1, 0.37)),
      ramData: addTimestamp([
        ...fakeMetricData(8, 8 * 1024 ** 3, 0.8 / 4),
        ...fakeMetricData(8, 4 * 1024 ** 3, 0.8 / 2),
        ...fakeMetricData(8, 2 * 1024 ** 3, 0.8),
      ]),
    })),
});

export const bigScaleUp = makeStory(conf, {
  items:
    baseItems.map((item) => ({
      ...item,
      cpuData: addTimestamp(fakeMetricData(24, 1, 0.25)),
      ramData: addTimestamp([
        ...fakeMetricData(12, 2 * 1024 ** 3, 0.8),
        ...fakeMetricData(12, 16 * 1024 ** 3, 0.8 / 8),
      ]),
    })),
});

export const bigScaleDown = makeStory(conf, {
  items:
    baseItems.map((item) => ({
      ...item,
      cpuData: addTimestamp(fakeMetricData(24, 1, 0.223)),
      ramData: addTimestamp([
        ...fakeMetricData(12, 16 * 1024 ** 3, 0.10),
        ...fakeMetricData(12, 2 * 1024 ** 3, 0.10 * 8),
      ]),
    })),
});
export const skeleton = makeStory(conf, {
  items: [{}],
});

export const empty = makeStory(conf, {
  items: [{ three: [] }],
});

export const error = makeStory(conf, {
  items: [{ error: true }],
});

export const simulations = makeStory(conf, {
  items: [{}, {}],
  simulations: [
    storyWait(2000, ([component, componentError]) => {
      component.three = [{ foo: 42 }];
      componentError.error = true;
    }),
    storyWait(1000, ([component]) => {
      component.three = [{ foo: 42 }, { foo: 43 }];
    }),
  ],
});

enhanceStoriesNames({
  defaultStory,
  linearIncrease,
  skeleton,
  empty,
  error,
  simulations,
});
