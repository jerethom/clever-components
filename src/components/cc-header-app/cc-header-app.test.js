import { testAccessibility } from '../../../test/helpers/accessibility.js';
import { getStories } from '../../../test/helpers/stories.js';
import * as storiesModule from './cc-header-app.stories.js';

const storiesToTest = getStories(storiesModule);

describe(`Component: ${storiesModule.default.component}`, function () {
  testAccessibility(storiesToTest, ['color-contrast']);
});
