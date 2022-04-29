import '../../src/profile/cc-ssh-key-list.js';
import { makeStory, storyWait } from '../lib/make-story.js';
import { enhanceStoriesNames } from '../lib/story-names.js';

const DUMMY_KEY_1 = {
  name: 'Work laptop',
  key: 'ssh-ed25519 ACABC3NzaCxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxltMkfjBkNv',
  fingerprint: 'SHA256:tk3u9yxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxlTIKLk',
};
const DUMMY_KEY_2 = {
  name: 'Work PC',
  key: 'ssh-ed25519 ACABC3NzaCxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxlwpoXHGeZj',
  fingerprint: 'SHA256:nfIaqPxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx57zFs',
};
const DUMMY_KEY_3 = {
  name: 'Macbook Air Pro',
  key: 'ssh-ed25519 AAAAC3NzaCxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxecauQzp2VC',
  fingerprint: '00:03:xx:xx:xx:xx:xx:xx:xx:xx:xx:xx:xx:xx:7f:62',
};

export default {
  title: '🛠 Profile/<cc-ssh-key-list>',
  component: 'cc-ssh-key-list',
};

const conf = {
  component: 'cc-ssh-key-list',
};

export const defaultStory = makeStory(conf, {
  items: [
    {
      keys: [
        DUMMY_KEY_1,
      ],
      keysThirdParties: [
        DUMMY_KEY_2,
      ],
    },
  ],
});

export const emptyStory = makeStory(conf);

export const dataLoadedWithMultipleItems = makeStory(conf, {
  items: [
    {
      keys: [
        DUMMY_KEY_1,
        DUMMY_KEY_2,
        DUMMY_KEY_3,
      ],
      keysThirdParties: [
        DUMMY_KEY_1,
        DUMMY_KEY_2,
        DUMMY_KEY_3,
      ],
    },
  ],
});

export const dataLoadedWithLongNames = makeStory(conf, {
  items: [
    {
      keys: [
        {
          ...DUMMY_KEY_1,
          name: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vel erat euismod, egestas turpis eget, facilisis ante. Etiam ac pharetra nibh. Nulla facilisi.',
        },
        {
          ...DUMMY_KEY_2,
          name: 'LoremipsumdolorsitametconsecteturadipiscingelitSedvelerateuismodegestasturpisegetfacilisisanteEtiamacpharetranibhNullafacilisi',
        },
      ],
      keysThirdParties: [
        {
          ...DUMMY_KEY_1,
          name: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vel erat euismod, egestas turpis eget, facilisis ante. Etiam ac pharetra nibh. Nulla facilisi.',
        },
        {
          ...DUMMY_KEY_2,
          name: 'LoremipsumdolorsitametconsecteturadipiscingelitSedvelerateuismodegestasturpisegetfacilisisanteEtiamacpharetranibhNullafacilisi',
        },
      ],
    },
  ],
});

export const dataLoadedWithThirdPartiesUnlinked = makeStory(conf, {
  items: [
    {
      unlinked: true,
      keys: [
        DUMMY_KEY_1,
      ],
    },
  ],
});

export const skeleton = makeStory(conf, {
  items: [
    {
      listing: true,
      listingThirdParties: true,
    },
  ],
});

export const waitingWithAddingPersonalKey = makeStory(conf, {
  items: [
    {
      adding: true,
      newKey: {
        name: DUMMY_KEY_1.name,
        key: DUMMY_KEY_1.key,
      },
      keys: [
        DUMMY_KEY_2,
      ],
      keysThirdParties: [
        DUMMY_KEY_3,
      ],
    },
  ],
});

export const waitingWithDeletingPersonalKey = makeStory(conf, {
  items: [
    {
      deleting: DUMMY_KEY_2.name,
      keys: [
        DUMMY_KEY_1,
        DUMMY_KEY_2,
        DUMMY_KEY_3,
      ],
    },
  ],
});

export const waitingWithImportingThirdPartiesKey = makeStory(conf, {
  items: [
    {
      importing: DUMMY_KEY_3.name,
      keys: [
        DUMMY_KEY_1,
        DUMMY_KEY_2,
      ],
      keysThirdParties: [
        DUMMY_KEY_3,
      ],
    },
  ],
});

export const errorWithWhenListingPersonalKeys = makeStory(conf, {
  items: [
    {
      error: 'loading',
      keysThirdParties: [
        DUMMY_KEY_2,
      ],
    },
  ],
});

export const errorWithWhenListingThirdPartiesKeys = makeStory(conf, {
  items: [
    {
      error: 'loading-third-parties',
      keys: [
        DUMMY_KEY_1,
      ],
    },
  ],
});

export const errorWithWhenNameIsEmpty = makeStory(conf, {
  items: [
    {
      _clientError: 'emptyName',
      newKey: {
        name: '',
        key: DUMMY_KEY_1.key,
      },
      keys: [
        DUMMY_KEY_2,
      ],
      keysThirdParties: [
        DUMMY_KEY_3,
      ],
    },
  ],
});

export const errorWithWhenPublicKeyIsEmpty = makeStory(conf, {
  items: [
    {
      _clientError: 'emptyPublicKey',
      newKey: {
        name: DUMMY_KEY_1.name,
        key: '',
      },
      keys: [
        DUMMY_KEY_2,
      ],
      keysThirdParties: [
        DUMMY_KEY_3,
      ],
    },
  ],
});

export const errorWithWhenAddingNewKey = makeStory(conf, {
  items: [
    {
      error: 'adding',
      newKey: {
        name: DUMMY_KEY_1.name,
        key: DUMMY_KEY_1.key,
      },
      keys: [
        DUMMY_KEY_2,
        DUMMY_KEY_3,
      ],
    },
  ],
});

export const simulationWithAddingKeyWithSuccess = makeStory(conf, {
  items: [
    {
      keys: [
        DUMMY_KEY_2,
      ],
      keysThirdParties: [
        DUMMY_KEY_3,
      ],
    },
  ],
  simulations: [
    storyWait(1000, ([component]) => {
      component.newKey = {
        name: DUMMY_KEY_1.name,
        key: DUMMY_KEY_1.key,
      };
    }),
    storyWait(1500, ([component]) => {
      component.adding = true;
    }),
    storyWait(2000, ([component]) => {
      component.adding = false;
      component.newKey = {
        name: '',
        key: '',
      };
      component.keys = [
        DUMMY_KEY_1,
        DUMMY_KEY_2,
      ];
    }),
  ],
});

export const simulationWithAddingKeyWithError = makeStory(conf, {
  items: [
    {
      keys: [
        DUMMY_KEY_2,
      ],
      keysThirdParties: [
        DUMMY_KEY_3,
      ],
    },
  ],
  simulations: [
    storyWait(1000, ([component]) => {
      component.newKey = {
        name: DUMMY_KEY_1.name,
        key: DUMMY_KEY_1.key,
      };
    }),
    storyWait(1500, ([component]) => {
      component.adding = true;
    }),
    storyWait(2000, ([component]) => {
      component.adding = false;
      component.error = 'adding';
    }),
  ],
});

export const simulationWithDeletingKeyWithSuccess = makeStory(conf, {
  items: [
    {
      keys: [
        DUMMY_KEY_1,
        DUMMY_KEY_2,
      ],
      keysThirdParties: [
        DUMMY_KEY_3,
      ],
    },
  ],
  simulations: [
    storyWait(1000, ([component]) => {
      component.deleting = DUMMY_KEY_2.name;
    }),
    storyWait(1500, ([component]) => {
      component.deleting = null;
      component.keys = [
        DUMMY_KEY_1,
      ];
    }),
  ],
});

export const simulationWithDeletingKeyWithError = makeStory(conf, {
  items: [
    {
      keys: [
        DUMMY_KEY_1,
        DUMMY_KEY_2,
      ],
      keysThirdParties: [
        DUMMY_KEY_3,
      ],
    },
  ],
  simulations: [
    storyWait(1000, ([component]) => {
      component.deleting = DUMMY_KEY_2.name;
    }),
    storyWait(1500, ([component]) => {
      component.deleting = null;
    }),
  ],
});

export const simulationWithImportingThirdPartyKeyWithSuccess = makeStory(conf, {
  items: [
    {
      keys: [
        DUMMY_KEY_1,
      ],
      keysThirdParties: [
        DUMMY_KEY_2,
        DUMMY_KEY_3,
      ],
    },
  ],
  simulations: [
    storyWait(1000, ([component]) => {
      component.importing = DUMMY_KEY_2.name;
    }),
    storyWait(1500, ([component]) => {
      component.importing = null;
      component.keys = [
        DUMMY_KEY_1,
        DUMMY_KEY_2,
      ];
      component.keysThirdParties = [
        DUMMY_KEY_3,
      ];
    }),
  ],
});

export const simulationWithImportingThirdPartyKeyWithError = makeStory(conf, {
  items: [
    {
      keys: [
        DUMMY_KEY_1,
      ],
      keysThirdParties: [
        DUMMY_KEY_2,
        DUMMY_KEY_3,
      ],
    },
  ],
  simulations: [
    storyWait(1000, ([component]) => {
      component.importing = DUMMY_KEY_2.name;
    }),
    storyWait(1500, ([component]) => {
      component.importing = null;
    }),
  ],
});

enhanceStoriesNames({
  defaultStory,
  emptyStory,
  dataLoadedWithMultipleItems,
  dataLoadedWithLongNames,
  dataLoadedWithThirdPartiesUnlinked,
  skeleton,
  waitingWithAddingPersonalKey,
  waitingWithDeletingPersonalKey,
  waitingWithImportingThirdPartiesKey,
  errorWithWhenListingPersonalKeys,
  errorWithWhenListingThirdPartiesKeys,
  errorWithWhenNameIsEmpty,
  errorWithWhenPublicKeyIsEmpty,
  errorWithWhenAddingNewKey,
  simulationWithAddingKeyWithSuccess,
  simulationWithAddingKeyWithError,
  simulationWithDeletingKeyWithSuccess,
  simulationWithDeletingKeyWithError,
  simulationWithImportingThirdPartyKeyWithSuccess,
  simulationWithImportingThirdPartyKeyWithError,
});
