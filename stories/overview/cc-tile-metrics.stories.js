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

export const defaultStory = makeStory(conf, {
  items:
    baseItems.map((item) => ({
      ...item,
      cpuData: [
        { label: 1628516642000000, value: 67.809205 },
        { label: 1628516582000000, value: 52.734481 },
        { label: 1628516522000000, value: 60.746737 },
        { label: 1628516462000000, value: 55.748121 },
        { label: 1628516402000000, value: 67.783902 },
        { label: 1628516282000000, value: 58.821264 },
        { label: 1628516342000000, value: 67.794774 },
      ],
      ramData: [
        { label: 1628516642000000, value: 67.809205 },
        { label: 1628516582000000, value: 52.734481 },
        { label: 1628516522000000, value: 60.746737 },
        { label: 1628516462000000, value: 55.748121 },
        { label: 1628516402000000, value: 67.783902 },
        { label: 1628516342000000, value: 67.794774 },
        { label: 1628516282000000, value: 58.821264 },
      ],
    })),
});

export const flatLines = makeStory(conf, {
  items:
    baseItems.map((item) => ({
      ...item,
      cpuData: [
        { label: 1628516642000000, value: 55.748121 },
        { label: 1628516582000000, value: 55.748121 },
        { label: 1628516522000000, value: 55.748121 },
        { label: 1628516462000000, value: 55.748121 },
        { label: 1628516402000000, value: 55.748121 },
        { label: 1628516282000000, value: 55.748121 },
        { label: 1628516342000000, value: 55.748121 },
      ],
      ramData: [
        { label: 1628516642000000, value: 55.748121 },
        { label: 1628516582000000, value: 55.748121 },
        { label: 1628516522000000, value: 55.748121 },
        { label: 1628516462000000, value: 55.748121 },
        { label: 1628516402000000, value: 55.748121 },
        { label: 1628516342000000, value: 55.748121 },
        { label: 1628516282000000, value: 55.748121 },
      ],
    })),
});

export const linearIncrease = makeStory(conf, {
  items:
    baseItems.map((item) => ({
      ...item,
      cpuData: [
        { label: 1628516642000000, value: 0 },
        { label: 1628516582000000, value: 10 },
        { label: 1628516522000000, value: 20 },
        { label: 1628516462000000, value: 30 },
        { label: 1628516402000000, value: 40 },
        { label: 1628516282000000, value: 50 },
        { label: 1628516342000000, value: 60 },
      ],
      ramData: [
        { label: 1628516582000000, value: 10 },
        { label: 1628516522000000, value: 20 },
        { label: 1628516462000000, value: 30 },
        { label: 1628516402000000, value: 40 },
        { label: 1628516282000000, value: 50 },
        { label: 1628516342000000, value: 60 },
        { label: 1628516342000000, value: 70 },
      ],
    })),
});

export const pics = makeStory(conf, {
  items:
    baseItems.map((item) => ({
      ...item,
      cpuData: [
        { label: 1628516642000000, value: 67.809205 },
        { label: 1628516582000000, value: 20.734481 },
        { label: 1628516522000000, value: 50.746737 },
        { label: 1628516462000000, value: 10.748121 },
        { label: 1628516402000000, value: 90.783902 },
        { label: 1628516282000000, value: 30.821264 },
        { label: 1628516342000000, value: 76.794774 },
      ],
      ramData: [
        { label: 1628516642000000, value: 67.809205 },
        { label: 1628516582000000, value: 20.734481 },
        { label: 1628516522000000, value: 50.746737 },
        { label: 1628516462000000, value: 10.748121 },
        { label: 1628516402000000, value: 90.783902 },
        { label: 1628516282000000, value: 30.821264 },
        { label: 1628516342000000, value: 76.794774 },
      ],
    })),
});

// If your component contains remote data,
// you'll need a "skeleton screen" while the user's waiting for the data.
export const skeleton = makeStory(conf, {
  items: [{}],
});

// If your component contains remote data,
// don't forget the case where there is no data (ex: empty lists...).
export const empty = makeStory(conf, {
  items: [{ three: [] }],
});

// If your component contains remote data,
// don't forget the case where you have loading errors.
// If you have other kind of errors (ex: saving errors...).
// You need to name your stories with the `errorWith` prefix.
export const error = makeStory(conf, {
  items: [{ error: true }],
});

// If your component contains remote data,
// try to present all the possible data combination.
// You need to name your stories with the `dataLoadedWith` prefix.
// Don't forget edge cases (ex: small/huge strings, small/huge lists...).
export const dataLoadedWithFoo = makeStory(conf, {
  items: [
    { one: 'Foo', three: [{ foo: 42 }] },
  ],
});

// If your component can trigger updates/deletes remote data,
// don't forget the case where the user's waiting for an operation to complete.
export const waiting = makeStory(conf, {
  items: [
    { one: 'Foo', three: [{ foo: 42 }], waiting: true },
  ],
});

// If your component contains remote data,
// it will have several state transitions (ex: loading => error, loading => loaded, loaded => saving...).
// When transitioning from one state to another, we try to prevent the display from "jumping" or "blinking" too much.
// Using "simulations", you can simulate several steps in time to present how your component behaves when it goes through different states.
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
  flatLines,
  linearIncrease,
  skeleton,
  empty,
  error,
  dataLoadedWithFoo,
  waiting,
  simulations,
});
