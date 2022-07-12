import { CcIcon } from '../../src/icons/cc-icon.js';
import { CcIconProvider } from '../../src/icons/cc-icon-provider.js';
import {
  ancientGateFill,
  bankFill,
  communityFill,
  homeGearFill,
  hotelFill,
} from '../../remix-icons.esm.js';
import { makeStory } from '../lib/make-story.js';
import { enhanceStoriesNames } from '../lib/story-names.js';

// configure icon provider
const completeSet = [ // should be generated with npm task & imported
  ancientGateFill,
  bankFill,
  communityFill,
  homeGearFill,
  hotelFill,
]
const iconProvider = new CcIconProvider();
if (CcIcon.getProvider() == null) {
  CcIcon.setProvider(iconProvider);
}
iconProvider.addIcons(completeSet);

// story
export default {
  title: '🛠 Icon/<cc-icon>',
  component: 'cc-icon',
};

const conf = {
  component: 'cc-icon',
  // language=CSS
  css: `
    .wrapper {
      display: flex;
      align-items: center;
      padding: 0.5em;
      font-size: 1.5em;
      gap: 0 1em;
    }
  `,
};

export const defaultStory = makeStory(conf, {
  dom: (container) => {
    container.innerHTML = `
    <div class="wrapper">
      <cc-icon size="xl" name="ancientGateFill"></cc-icon>
      Hello world!
    </div>
    <div class="wrapper">
      <cc-icon size="xl" name="bankFill"></cc-icon>
      Hello world!
    </div>
    <div class="wrapper">
      <cc-icon size="xl" name="communityFill"></cc-icon>
      Hello world!
    </div>
    <div class="wrapper" style="color: red;">
      <cc-icon size="xl" name="homeGearFill"></cc-icon>
      Hello world!
      <span style="font-size: 0.75em; color: initial; font-family: monospace;">{ color: red; }</span>
    </div>
    <div class="wrapper" style="color: red; --color: blue;">
      <cc-icon size="xl" name="hotelFill"></cc-icon>
      Hello world!
      <span style="font-size: 0.75em; color: initial; font-family: monospace;">{ color: red; --color: blue; }</span>
    </div>
    `;
  },
});

export const sizeStory = makeStory(conf, {
  dom: (container) => {
    container.innerHTML = `
    <div class="wrapper">
      <cc-icon size="xs" name="ancientGateFill"></cc-icon>
      size="xs"
    </div>
    <div class="wrapper">
      <cc-icon size="sm" name="bankFill"></cc-icon>
      size="sm"
    </div>
    <div class="wrapper">
      <cc-icon size="md" name="communityFill"></cc-icon>
      size="md"
    </div>
    <div class="wrapper">
      <cc-icon size="lg" name="homeGearFill"></cc-icon>
      size="lg"
    </div>
    <div class="wrapper">
      <cc-icon size="xl" name="hotelFill"></cc-icon>
      size="xl"
    </div>
    <div class="wrapper">
      <cc-icon size="md" name="hotelFill" style="--size: 64px;"></cc-icon>
      --size: 64px;
    </div>
    `;
  },
});

export const slottedSvgStory = makeStory(conf, {
  dom: (container) => {
    container.innerHTML = `
      <cc-icon size="md">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path d="M11.5 2a9.5 9.5 0 0 1 9.5 9.5 9.46 9.46 0 0 1-1.003 4.254l2.463 2.464a1 1 0 0 1 0 1.414l-2.828 2.828a1 1 0 0 1-1.414 0l-2.464-2.463A9.46 9.46 0 0 1 11.5 21a9.5 9.5 0 0 1 0-19zm5.303 13.388l-1.414 1.414 3.536 3.535 1.414-1.414-3.536-3.535zm1.864-6.105l-9.384 9.384c.7.216 1.445.333 2.217.333a7.48 7.48 0 0 0 2.74-.516l-.972-.974a1 1 0 0 1 0-1.414l2.828-2.828a1 1 0 0 1 1.414 0l.974.972A7.48 7.48 0 0 0 19 11.5c0-.772-.117-1.516-.333-2.217zM11.5 4a7.5 7.5 0 0 0-4.136 13.757L17.757 7.364A7.493 7.493 0 0 0 11.5 4z"/></svg>
      </cc-icon>
      <cc-icon size="lg" style="color: red;">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path d="M11.5 2a9.5 9.5 0 0 1 9.5 9.5 9.46 9.46 0 0 1-1.003 4.254l2.463 2.464a1 1 0 0 1 0 1.414l-2.828 2.828a1 1 0 0 1-1.414 0l-2.464-2.463A9.46 9.46 0 0 1 11.5 21a9.5 9.5 0 0 1 0-19zm5.303 13.388l-1.414 1.414 3.536 3.535 1.414-1.414-3.536-3.535zm1.864-6.105l-9.384 9.384c.7.216 1.445.333 2.217.333a7.48 7.48 0 0 0 2.74-.516l-.972-.974a1 1 0 0 1 0-1.414l2.828-2.828a1 1 0 0 1 1.414 0l.974.972A7.48 7.48 0 0 0 19 11.5c0-.772-.117-1.516-.333-2.217zM11.5 4a7.5 7.5 0 0 0-4.136 13.757L17.757 7.364A7.493 7.493 0 0 0 11.5 4z"/></svg>
      </cc-icon>
      <cc-icon size="xl" style="--color: blue;">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path d="M11.5 2a9.5 9.5 0 0 1 9.5 9.5 9.46 9.46 0 0 1-1.003 4.254l2.463 2.464a1 1 0 0 1 0 1.414l-2.828 2.828a1 1 0 0 1-1.414 0l-2.464-2.463A9.46 9.46 0 0 1 11.5 21a9.5 9.5 0 0 1 0-19zm5.303 13.388l-1.414 1.414 3.536 3.535 1.414-1.414-3.536-3.535zm1.864-6.105l-9.384 9.384c.7.216 1.445.333 2.217.333a7.48 7.48 0 0 0 2.74-.516l-.972-.974a1 1 0 0 1 0-1.414l2.828-2.828a1 1 0 0 1 1.414 0l.974.972A7.48 7.48 0 0 0 19 11.5c0-.772-.117-1.516-.333-2.217zM11.5 4a7.5 7.5 0 0 0-4.136 13.757L17.757 7.364A7.493 7.493 0 0 0 11.5 4z"/></svg>
      </cc-icon>
    `;
  },
});

enhanceStoriesNames({
  defaultStory,
  sizeStory,
  slottedSvgStory,
});
