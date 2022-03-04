import '../../src/overview/cc-tile-metrics.js';
import '../../src/overview/cc-tile-metrics.smart.js';
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
  { },
  { style: 'width: 380px' },
  { style: 'width: 540px' },
];

const ONE_HOUR = 60 * 60 * 1000;
export function fakeMetricData (numberOfPoints, usedPercent, linearIncrease = false) {
  return Array
    .from({ length: numberOfPoints })
    .map((_, index) => {
      const randomFactor = Math.random() / 5 + 1;
      const increase = (linearIncrease) ? (index + 2) / 100 : 0;
      return {
        usedPercent: usedPercent * randomFactor + increase,
        totalValue: 1,
      };
    });
}

function now () {
  return new Date().getTime();
}

export function addTimestamp (array) {
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
      cpuData: addTimestamp(fakeMetricData(24, 0.25)),
      ramData: addTimestamp(fakeMetricData(24, 0.161)),
    })),
});

export const highValues = makeStory(conf, {
  items:
    baseItems.map((item) => ({
      ...item,
      cpuData: addTimestamp([
        ...fakeMetricData(12, 0.6),
        ...fakeMetricData(12, 0.8),
      ]),
      ramData: addTimestamp([
        ...fakeMetricData(12, 0.5),
        ...fakeMetricData(12, 0.820),
      ]),
    })),
});

export const pics = makeStory(conf, {
  items:
    baseItems.map((item) => ({
      ...item,
      cpuData: addTimestamp(fakeMetricData(24, 0.25)),
      ramData: addTimestamp([
        ...fakeMetricData(10, 0.25),
        ...fakeMetricData(1, 0.25 / 4),
        ...fakeMetricData(2, 0.80),
        ...fakeMetricData(1, 0.25 / 4),
        ...fakeMetricData(10, 0.25),
      ]),
    })),
});

export const linearIncrease = makeStory(conf, {
  items:
    baseItems.map((item) => ({
      ...item,
      cpuData: addTimestamp(fakeMetricData(24, 0.25, true)),
      ramData: addTimestamp([
        ...fakeMetricData(24, 0.10, true),
      ]),
    })),
});

export const scaleUp = makeStory(conf, {
  items:
    baseItems.map((item) => ({
      ...item,
      cpuData: addTimestamp(fakeMetricData(24, 0.4)),
      ramData: addTimestamp([
        ...fakeMetricData(12, 0.5),
        ...fakeMetricData(12, 0.5 / 4),
      ]),
    })),
});

export const scaleDown = makeStory(conf, {
  items:
    baseItems.map((item) => ({
      ...item,
      cpuData: addTimestamp(fakeMetricData(24, 0.3)),
      ramData: addTimestamp([
        ...fakeMetricData(12, 0.161),
        ...fakeMetricData(12, 0.161 * 2),
      ]),
    })),
});

export const multipleScaleUp = makeStory(conf, {
  items:
    baseItems.map((item) => ({
      ...item,
      cpuData: addTimestamp(fakeMetricData(24, 0.6)),
      ramData: addTimestamp([
        ...fakeMetricData(8, 0.8),
        ...fakeMetricData(8, 0.8 / 2),
        ...fakeMetricData(8, 0.8 / 4),
      ]),
    })),
});

export const multipleScaleDown = makeStory(conf, {
  items:
    baseItems.map((item) => ({
      ...item,
      cpuData: addTimestamp(fakeMetricData(24, 0.378)),
      ramData: addTimestamp([
        ...fakeMetricData(8, 0.8 / 4),
        ...fakeMetricData(8, 0.8 / 2),
        ...fakeMetricData(8, 0.8),
      ]),
    })),
});

export const bigScaleUp = makeStory(conf, {
  items:
    baseItems.map((item) => ({
      ...item,
      cpuData: addTimestamp(fakeMetricData(24, 0.25)),
      ramData: addTimestamp([
        ...fakeMetricData(12, 0.8),
        ...fakeMetricData(12, 0.8 / 8),
      ]),
    })),
});

export const bigScaleDown = makeStory(conf, {
  items:
    baseItems.map((item) => ({
      ...item,
      cpuData: addTimestamp(fakeMetricData(24, 0.223)),
      ramData: addTimestamp([
        ...fakeMetricData(12, 0.10),
        ...fakeMetricData(12, 0.10 * 8),
      ]),
    })),
});

export const appDown = makeStory(conf, {
  items:
    baseItems.map((item) => ({
      ...item,
      cpuData: addTimestamp([
        ...fakeMetricData(6, 0.223),
        ...fakeMetricData(6, 0),
        ...fakeMetricData(12, 0.223),
      ]),
      ramData: addTimestamp([
        ...fakeMetricData(6, 0.10),
        ...fakeMetricData(6, 0),
        ...fakeMetricData(12, 0.10 * 8),
      ]),
    })),
});

export const skeleton = makeStory(conf, {
  items: baseItems,
});

export const empty = makeStory(conf, {
  items: [{ cpuData: [], ramData: [] }],
});

export const error = makeStory(conf, {
  items: [{ error: true }],
});

export const simulationsWithData = makeStory(conf, {
  items: baseItems,
  simulations: [
    storyWait(2000, ([componentSmall, componentMedium, componentBig]) => {
      componentSmall.cpuData = addTimestamp(fakeMetricData(24, 0.223));
      componentSmall.ramData = addTimestamp([
        ...fakeMetricData(12, 0.10),
        ...fakeMetricData(12, 0.10 * 8),
      ]);
      componentMedium.cpuData = addTimestamp(fakeMetricData(24, 0.223));
      componentMedium.ramData = addTimestamp([
        ...fakeMetricData(12, 0.10),
        ...fakeMetricData(12, 0.10 * 8),
      ]);
      componentBig.cpuData = addTimestamp(fakeMetricData(24, 0.223));
      componentBig.ramData = addTimestamp([
        ...fakeMetricData(12, 0.10),
        ...fakeMetricData(12, 0.10 * 8),
      ]);
    }),
  ],
});

export const simulationsWithError = makeStory(conf, {
  items: baseItems,
  simulations: [
    storyWait(2000, ([componentSmall, componentMedium, componentBig]) => {
      componentSmall.error = true;
      componentMedium.error = true;
      componentBig.error = true;
    }),
  ],
});

enhanceStoriesNames({
  defaultStory,
  linearIncrease,
  skeleton,
  empty,
  error,
  simulationsWithData,
  simulationsWithError,
});
