import { testAccessibility } from '../../../test/helpers/accessibility.js';
import { getStories } from '../../../test/helpers/stories.js';
import * as storiesModule from './cc-action-dispatcher.stories.js';

const storiesToTest = getStories(storiesModule);

describe(`Component: ${storiesModule.default.component}`, function () {
  testAccessibility(storiesToTest);
});
