import '../../src/profile/cc-ssh-key-list.js';
import '../../src/profile/cc-ssh-key-list.smart.js';
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
      personalKeysModel: {
        keys: [
          DUMMY_KEY_1,
        ],
      },
      githubKeysModel: {
        keys: [
          DUMMY_KEY_2,
        ],
      },
    },
  ],
});

export const emptyStory = makeStory(conf, {
  items: [
    {
      personalKeysModel: {
        keys: [],
      },
      githubKeysModel: {
        keys: [],
      },
    },
  ],
});

export const dataLoadedWithMultipleItems = makeStory(conf, {
  items: [
    {
      personalKeysModel: {
        keys: [
          DUMMY_KEY_1,
          DUMMY_KEY_2,
          DUMMY_KEY_3,
        ],
      },
      githubKeysModel: {
        keys: [
          DUMMY_KEY_1,
          DUMMY_KEY_2,
          DUMMY_KEY_3,
        ],
      },
    },
  ],
});

export const dataLoadedWithLongNames = makeStory(conf, {
  items: [
    {
      personalKeysModel: {
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
      },
      githubKeysModel: {
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
      },
    },
  ],
});

export const dataLoadedWithGithubUnlinked = makeStory(conf, {
  items: [
    {
      personalKeysModel: {
        keys: [
          DUMMY_KEY_1,
        ],
      },
      githubKeysModel: {
        state: 'unlinked',
      },
    },
  ],
});

export const skeleton = makeStory(conf, {
  items: [
    {
      personalKeysModel: {
        state: 'loading',
      },
      githubKeysModel: {
        state: 'loading',
      },
    },
  ],
});

export const waitingWithAddingPersonalKey = makeStory(conf, {
  items: [
    {
      createFormModel: {
        inputName: {
          value: DUMMY_KEY_1.name,
        },
        inputKey: {
          value: DUMMY_KEY_1.key,
        },
        state: 'saving',
      },
      personalKeysModel: {
        keys: [
          DUMMY_KEY_2,
        ],
      },
      githubKeysModel: {
        keys: [
          DUMMY_KEY_3,
        ],
      },
    },
  ],
});

export const waitingWithDeletingPersonalKey = makeStory(conf, {
  items: [
    {
      personalKeysModel: {
        keys: [
          DUMMY_KEY_1,
          {
            ...DUMMY_KEY_2,
            processing: true,
          },
          DUMMY_KEY_3,
        ],
      },
      githubKeysModel: {
        keys: [],
      }
    },
  ],
});

export const waitingWithImportingGithubKey = makeStory(conf, {
  items: [
    {
      personalKeysModel: {
        keys: [
          DUMMY_KEY_1,
          DUMMY_KEY_2,
        ],
      },
      githubKeysModel: {
        keys: [
          {
            ...DUMMY_KEY_3,
            processing: true,
          },
        ],
      },
    },
  ],
});

export const errorWithWhenListingPersonalKeys = makeStory(conf, {
  items: [
    {
      personalKeysModel: {
        state: 'error',
      },
      githubKeysModel: {
        keys: [
          DUMMY_KEY_2,
        ],
      },
    },
  ],
});

export const errorWithWhenListingGithubKeys = makeStory(conf, {
  items: [
    {
      personalKeysModel: {
        keys: [
          DUMMY_KEY_1,
        ],
      },
      githubKeysModel: {
        state: 'error',
      },
    },
  ],
});

export const errorWithWhenNameIsEmpty = makeStory(conf, {
  items: [
    {
      createFormModel: {
        inputName: {
          value: '',
          error: 'required',
        },
        inputKey: {
          value: DUMMY_KEY_1.key,
        },
      },
      personalKeysModel: {
        keys: [
          DUMMY_KEY_2,
        ],
      },
      githubKeysModel: {
        keys: [
          DUMMY_KEY_3,
        ],
      },
    },
  ],
});

export const errorWithWhenPublicKeyIsEmpty = makeStory(conf, {
  items: [
    {
      createFormModel: {
        inputName: {
          value: DUMMY_KEY_1.name,
        },
        inputKey: {
          value: '',
          error: 'required',
        },
      },
      personalKeysModel: {
        keys: [
          DUMMY_KEY_2,
        ],
      },
      githubKeysModel: {
        keys: [
          DUMMY_KEY_3,
        ],
      },
    },
  ],
});

export const errorWithWhenAllInputsAreEmpty = makeStory(conf, {
  items: [
    {
      createFormModel: {
        inputName: {
          value: '',
          error: 'required',
        },
        inputKey: {
          value: '',
          error: 'required',
        },
      },
      personalKeysModel: {
        keys: [
          DUMMY_KEY_2,
        ],
      },
      githubKeysModel: {
        keys: [
          DUMMY_KEY_3,
        ],
      },
    },
  ],
});

export const errorWithWhenAddingNewKey = makeStory(conf, {
  items: [
    {
      createFormModel: {
        inputName: {
          value: DUMMY_KEY_1.name,
        },
        inputKey: {
          value: DUMMY_KEY_1.key,
        },
        state: 'error',
      },
      personalKeysModel: {
        keys: [
          DUMMY_KEY_2,
          DUMMY_KEY_3,
        ],
      },
    },
  ],
});

export const simulationWithAddingKeyWithSuccess = makeStory(conf, {
  items: [
    {
      createFormModel: {
        inputName: {
          value: '',
        },
        inputKey: {
          value: '',
        }
      },
      personalKeysModel: {
        keys: [
          DUMMY_KEY_2,
        ],
      },
      githubKeysModel: {
        keys: [
          DUMMY_KEY_3,
        ],
      },
    },
  ],
  simulations: [
    storyWait(1000, ([component]) => {
      component.createFormModel = {
        inputName: {
          value: DUMMY_KEY_1.name,
        },
        inputKey: {
          value: DUMMY_KEY_1.key,
        },
      };
    }),
    storyWait(1500, ([component]) => {
      component.createFormModel.state = 'saving';
      component.requestUpdate();
    }),
    storyWait(2000, ([component]) => {
      component.createFormModel = {
        inputName: {
          value: '',
        },
        inputKey: {
          value: '',
        },
        state: 'ready',
      };
      component.personalKeysModel = {
        keys: [
          DUMMY_KEY_1,
          DUMMY_KEY_2,
        ],
      };
    }),
  ],
});

export const simulationWithAddingKeyWithError = makeStory(conf, {
  items: [
    {
      createFormModel: {
        inputName: {
          value: '',
        },
        inputKey: {
          value: '',
        }
      },
      personalKeysModel: {
        keys: [
          DUMMY_KEY_2,
        ],
      },
      githubKeysModel: {
        keys: [
          DUMMY_KEY_3,
        ],
      },
    },
  ],
  simulations: [
    storyWait(1000, ([component]) => {
      component.createFormModel = {
        inputName: {
          value: DUMMY_KEY_1.name,
        },
        inputKey: {
          value: DUMMY_KEY_1.key,
        },
      };
    }),
    storyWait(1500, ([component]) => {
      component.createFormModel = {
        ...component.createFormModel,
        state: 'saving',
      };
    }),
    storyWait(2000, ([component]) => {
      component.createFormModel = {
        ...component.createFormModel,
        state: 'error',
      };
    }),
  ],
});

export const simulationWithDeletingKeyWithSuccess = makeStory(conf, {
  items: [
    {
      personalKeysModel: {
        keys: [
          DUMMY_KEY_1,
          DUMMY_KEY_2,
        ],
      },
      githubKeysModel: {
        keys: [
          DUMMY_KEY_3,
        ],
      },
    },
  ],
  simulations: [
    storyWait(1000, ([component]) => {
      component.personalKeysModel.keys[1] = {
        ...component.personalKeysModel.keys[1],
        processing: true,
      };
      component.requestUpdate();
    }),
    storyWait(1500, ([component]) => {
      component.personalKeysModel.keys = [ DUMMY_KEY_1 ];
      component.requestUpdate();
    }),
  ],
});

export const simulationWithDeletingKeyWithError = makeStory(conf, {
  items: [
    {
      personalKeysModel: {
        keys: [
          DUMMY_KEY_1,
          DUMMY_KEY_2,
        ],
      },
      githubKeysModel: {
        keys: [
          DUMMY_KEY_3,
        ],
      },
    },
  ],
  simulations: [
    storyWait(1000, ([component]) => {
      component.personalKeysModel.keys[1] = {
        ...component.personalKeysModel.keys[1],
        processing: true,
      };
      component.requestUpdate();
    }),
    storyWait(1500, ([component]) => {
      component.personalKeysModel.keys[1] = {
        ...component.personalKeysModel.keys[1],
        processing: false,
      };
      component.requestUpdate();
    }),
  ],
});

export const simulationWithImportingGithubKeyWithSuccess = makeStory(conf, {
  items: [
    {
      personalKeysModel: {
        keys: [
          DUMMY_KEY_1,
        ],
      },
      githubKeysModel: {
        keys: [
          DUMMY_KEY_2,
          DUMMY_KEY_3,
        ],
      },
    },
  ],
  simulations: [
    storyWait(1000, ([component]) => {
      component.githubKeysModel = {
        ...component.githubKeysModel,
        keys: [
          {
            ...DUMMY_KEY_2,
            processing: true,
          },
          DUMMY_KEY_3,
        ],
      };
    }),
    storyWait(1500, ([component]) => {
      component.personalKeysModel = {
        keys: [
          DUMMY_KEY_1,
          DUMMY_KEY_2,
        ],
      };
      component.githubKeysModel = {
        keys: [
          DUMMY_KEY_3,
        ],
      };
    }),
  ],
});

export const simulationWithImportingGithubKeyWithError = makeStory(conf, {
  items: [
    {
      personalKeysModel: {
        keys: [
          DUMMY_KEY_1,
        ],
      },
      githubKeysModel: {
        keys: [
          DUMMY_KEY_2,
          DUMMY_KEY_3,
        ],
      },
    },
  ],
  simulations: [
    storyWait(1000, ([component]) => {
      component.githubKeysModel = {
        ...component.githubKeysModel,
        keys: [
          {
            ...DUMMY_KEY_2,
            processing: true,
          },
          DUMMY_KEY_3,
        ],
      };
    }),
    storyWait(1500, ([component]) => {
      component.githubKeysModel = {
        ...component.githubKeysModel,
        keys: [
          {
            ...DUMMY_KEY_2,
            processing: false,
          },
          DUMMY_KEY_3,
        ],
      };
    }),
  ],
});

enhanceStoriesNames({
  defaultStory,
  emptyStory,
  dataLoadedWithMultipleItems,
  dataLoadedWithLongNames,
  dataLoadedWithGithubUnlinked,
  skeleton,
  waitingWithAddingPersonalKey,
  waitingWithDeletingPersonalKey,
  waitingWithImportingGithubKey,
  errorWithWhenListingPersonalKeys,
  errorWithWhenListingGithubKeys,
  errorWithWhenNameIsEmpty,
  errorWithWhenPublicKeyIsEmpty,
  errorWithWhenAllInputsAreEmpty,
  errorWithWhenAddingNewKey,
  simulationWithAddingKeyWithSuccess,
  simulationWithAddingKeyWithError,
  simulationWithDeletingKeyWithSuccess,
  simulationWithDeletingKeyWithError,
  simulationWithImportingGithubKeyWithSuccess,
  simulationWithImportingGithubKeyWithError,
});
