import './cc-badge.js';
import { makeStory } from '../../stories/lib/make-story.js';
import { enhanceStoriesNames } from '../../stories/lib/story-names.js';

const infoSvg = new URL('../../assets/info.svg', import.meta.url);
const warningSvg = new URL('../../assets/warning.svg', import.meta.url);
const errorSvg = new URL('../../assets/error.svg', import.meta.url);
const tickSvg = new URL('../../assets/tick.svg', import.meta.url);
const badgeSvg = new URL('../../assets/badge-white.svg', import.meta.url);

const baseItems = [
  {
    intent: 'info',
    weight: 'dimmed',
    innerHTML: 'this is info',
  },
  {
    intent: 'success',
    weight: 'dimmed',
    innerHTML: 'this is success',
  },
  {
    intent: 'danger',
    weight: 'dimmed',
    innerHTML: 'this is danger',
  },
  {
    intent: 'warning',
    weight: 'dimmed',
    innerHTML: 'this is warning',
  },
  {
    intent: 'neutral',
    weight: 'dimmed',
    innerHTML: 'this is neutral',
  },
];

const iconsItems = [
  {
    intent: 'info',
    weight: 'dimmed',
    innerHTML: 'this is info',
    iconSrc: infoSvg,
    iconAlt: 'Info',
  },
  {
    intent: 'success',
    weight: 'outlined',
    innerHTML: 'this is success',
    iconSrc: tickSvg,
    iconAlt: 'Success',
  },
  {
    intent: 'danger',
    weight: 'outlined',
    innerHTML: 'this is danger',
    iconSrc: errorSvg,
    iconAlt: 'Error',
  },
  {
    intent: 'warning',
    weight: 'strong',
    innerHTML: 'this is warning',
    iconSrc: warningSvg,
    iconAlt: 'Warning',
  },
  {
    intent: 'neutral',
    weight: 'strong',
    innerHTML: 'this is neutral',
    iconSrc: badgeSvg,
  },
];

const circleItems = [
  {
    intent: 'info',
    weight: 'dimmed',
    innerHTML: '1',
    circle: true,
  },
  {
    intent: 'success',
    weight: 'outlined',
    innerHTML: '2',
    circle: true,
  },
  {
    intent: 'danger',
    weight: 'outlined',
    innerHTML: '10',
    circle: true,
  },
  {
    intent: 'warning',
    weight: 'strong',
    innerHTML: '5',
    circle: true,
  },
  {
    intent: 'neutral',
    weight: 'strong',
    innerHTML: '1',
    circle: true,
  },
];

export default {
  title: '🧬 Atoms/<cc-badge>',
  component: 'cc-badge',
};

const conf = {
  component: 'cc-badge',
  displayMode: 'flex-wrap',
};

export const dimmed = makeStory(conf, {
  items: baseItems,
});

export const dimmedWithSkeleton = makeStory(conf, {
  items: baseItems.map((badge) => ({ ...badge, skeleton: true })),
});

export const outlined = makeStory(conf, {
  items: baseItems.map((badge) => ({ ...badge, weight: 'outlined' })),
});

export const outlinedWithSkeleton = makeStory(conf, {
  items: baseItems.map((badge) => ({ ...badge, weight: 'outlined', skeleton: true })),
});

export const strong = makeStory(conf, {
  items: baseItems.map((badge) => ({ ...badge, weight: 'strong' })),
});

export const strongWithSkeleton = makeStory(conf, {
  items: baseItems.map((badge) => ({ ...badge, weight: 'strong', skeleton: true })),
});

export const icons = makeStory(conf, {
  items: iconsItems,
});

export const iconsWithSkeleton = makeStory(conf, {
  items: iconsItems.map((badge) => ({ ...badge, skeleton: true })),
});

export const circleWithNumber = makeStory(conf, {
  items: circleItems,
});

export const circleWithNumberWithSkeleton = makeStory(conf, {
  items: circleItems.map((badge) => ({ ...badge, skeleton: true })),
});

enhanceStoriesNames({
  dimmed,
  dimmedWithSkeleton,
  outlined,
  outlinedWithSkeleton,
  strong,
  strongWithSkeleton,
  icons,
  iconsWithSkeleton,
  circleWithNumber,
  circleWithNumberWithSkeleton,
});
