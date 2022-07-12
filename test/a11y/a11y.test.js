import { fixture, expect } from '@open-wc/testing';
import { modes } from '../../stories/atoms/cc-button.stories.js';

it('passes accessibility test', async () => {
  const el = await fixture(modes({}, {
    globals: {
      locale: {
        name: 'Language',
        description: 'i18n language',
        defaultValue: 'en',
        toolbar: {
          icon: 'globe',
          items: 'en',
        },
      },
    },
  }));
  await expect(el).to.be.accessible();
});

// it('fails without label', async () => {
//   const el = await fixture(html` <div aria-labelledby="test-x"></div> `);
//   await expect(el).not.to.be.accessible();
// });

// it('passes for all rules, ignores attributes test', async () => {
//   const el = await fixture(html` <div aria-labelledby="test-x"></div> `);
//   await expect(el).to.be.accessible({
//     ignoredRules: ['aria-valid-attr-value'],
//   });
// });

// it('fails without alt attribute', async () => {
//   const el = await fixture(html` <img /> `);
//   await expect(el).not.to.be.accessible();
// });

// it('passes without alt attribute becuase img are ignored', async () => {
//   const el = await fixture(html` <img /> `);
//   await expect(el).not.to.be.accessible({
//     ignoredTags: ['img'],
//   });
// });

// it('accepts "done" option', (done) => {
//   fixture(html` <button>some light dom</button> `).then((el) => {
//     expect(el).to.be.accessible({
//       done,
//     });
//   });
// });
