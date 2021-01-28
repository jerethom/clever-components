import '../../src/pricing/cc-pricing-table.js';
import { makeStory } from '../lib/make-story.js';
import { enhanceStoriesNames } from '../lib/story-names.js';

export default {
  title: '🛠 pricing/<cc-pricing-table>',
  component: 'cc-pricing-table',
};

const conf = {
  component: 'cc-pricing-table',
  // language=CSS
  css: `cc-pricing-table {
        margin-bottom: 1rem;
    }`,
};

// TODO: split into 2 variables
const baseItems = {
  postgres: {
    items: [
      {
        id: 'plan_f14478be-b59a-4f64-870c-6887c561492d',
        name: 'XS Small Space',
        price: {
          daily: 17.5,
          monthly: 17.5,
        },
        features: [
          {
            name: 'Backups',
            code: 'backup',
            typeSlug: 'object',
            value: 'Daily - 7 Retained',
            featureValue: '',
          },
          {
            name: 'Max DB size',
            code: 'max-db-size',
            typeSlug: 'bytes',
            value: '5 GB',
            featureValue: 5368709120,
          },
          {
            name: 'Metrics',
            code: 'metrics',
            typeSlug: 'boolean',
            value: 'Yes',
            featureValue: true,
          },
          {
            name: 'PostGIS',
            code: 'postgis',
            typeSlug: 'boolean',
            value: 'Yes',
            featureValue: true,
          },
          {
            name: 'Type',
            code: 'type-shared',
            typeSlug: 'boolean-shared',
            value: 'Dedicated',
            featureValue: false,
          },
          {
            name: 'vCPUS',
            code: 'cpu',
            typeSlug: 'number',
            value: '1',
            featureValue: 1,
          },
          {
            name: 'Logs',
            code: 'logs',
            typeSlug: 'boolean',
            value: 'Yes',
            featureValue: true,
          },
          {
            name: 'Max connection limit',
            code: 'connection-limit',
            typeSlug: 'number',
            value: '75',
            featureValue: 75,
          },
          {
            name: 'Memory',
            code: 'memory',
            typeSlug: 'bytes',
            value: '1 GB',
            featureValue: 1073741824,
          },
          {
            name: 'Migration Tool',
            code: 'migration',
            typeSlug: 'boolean',
            value: 'Yes',
            featureValue: true,
          },
        ],
      },
      {
        id: 'plan_c32d00fb-6c06-48a9-a0a3-9d808937ec68',
        name: 'XXS Small Space',
        price: {
          daily: 5.25,
          monthly: 5.25,
        },
        features: [
          {
            name: 'Backups',
            code: 'backup',
            typeSlug: 'object',
            value: 'Daily - 7 Retained',
            featureValue: '',
          },
          {
            name: 'Logs',
            code: 'logs',
            typeSlug: 'boolean',
            value: 'Yes',
            featureValue: true,
          },
          {
            name: 'Max DB size',
            code: 'max-db-size',
            typeSlug: 'bytes',
            value: '1 GB',
            featureValue: 1073741824,

          },
          {
            name: 'Migration Tool',
            code: 'migration',
            typeSlug: 'boolean',
            value: 'Yes',
            featureValue: true,
          },
          {
            name: 'PostGIS',
            code: 'postgis',
            typeSlug: 'boolean',
            value: 'Yes',
            featureValue: true,

          },
          {
            name: 'Type',
            code: 'type-shared',
            typeSlug: 'boolean-shared',
            value: 'Dedicated',
            featureValue: false,
          },
          {
            name: 'vCPUS',
            code: 'cpu',
            typeSlug: 'number',
            value: '1',
            featureValue: 1,
          },
          {
            name: 'Max connection limit',
            code: 'connection-limit',
            typeSlug: 'number',
            value: '45',
            featureValue: 45,
          },
          {
            name: 'Metrics',
            code: 'metrics',
            typeSlug: 'boolean',
            value: 'Yes',
            featureValue: true,
          },
          {
            name: 'Memory',
            code: 'memory',
            typeSlug: 'bytes',
            value: '512 MB',
            featureValue: 536870912,
          },
        ],
      },
      {
        id: 'plan_9b4505e7-ac36-4caa-ac7d-9e11b6a26b15',
        name: 'XL Small Space',
        price: {
          daily: 328,
          monthly: 328,
        },
        features: [
          {
            name: 'Max DB size',
            code: 'max-db-size',
            typeSlug: 'bytes',
            value: '80 GB',
            featureValue: 85899345920,
          },
          {
            name: 'vCPUS',
            code: 'cpu',
            typeSlug: 'number',
            value: '8',
            featureValue: 8,
          },
          {
            name: 'Max connection limit',
            code: 'connection-limit',
            typeSlug: 'number',
            value: '750',
            featureValue: 750,
          },
          {
            name: 'Memory',
            code: 'memory',
            typeSlug: 'bytes',
            value: '16 GB',
            featureValue: 17179869184,
          },
          {
            name: 'Backups',
            code: 'backup',
            typeSlug: 'object',
            value: 'Daily - 7 Retained',
            featureValue: '',
          },
          {
            name: 'Metrics',
            code: 'metrics',
            typeSlug: 'boolean',
            value: 'Yes',
            featureValue: true,
          },
          {
            name: 'PostGIS',
            code: 'postgis',
            typeSlug: 'boolean',
            value: 'Yes',
            featureValue: true,
          },
          {
            name: 'Type',
            code: 'type-shared',
            typeSlug: 'boolean-shared',
            value: 'Dedicated',
            featureValue: false,
          },
          {
            name: 'Logs',
            code: 'logs',
            typeSlug: 'boolean',
            value: 'Yes',
            featureValue: true,
          },
          {
            name: 'Migration Tool',
            code: 'migration',
            typeSlug: 'boolean',
            value: 'Yes',
            featureValue: true,
          },
        ],
      },
    ],
    features: [
      {
        name: 'vCPUS',
        code: 'cpu',
        type: 'NUMBER',
      },
      {
        name: 'Type',
        code: 'type-shared',
        type: 'NUMBER',
      },
      {
        name: 'Migration Tool',
        code: 'migration',
        type: 'NUMBER',
      },
      {
        name: 'Logs',
        code: 'logs',
        type: 'NUMBER',
      },
      {
        name: 'Memory',
        code: 'memory',
        type: 'FILESIZE',
      },
      {
        name: 'PostGIS',
        code: 'postgis',
        type: 'NUMBER',
      },
      {
        name: 'Max connection limit',
        code: 'connection-limit',
        type: 'NUMBER',
      },
      {
        name: 'Max DB size',
        code: 'max-db-size',
        type: 'FILESIZE',
      },
      {
        name: 'Backups',
        code: 'backup',
        type: 'NUMBER',
      },
      {
        name: 'Metrics',
        code: 'metrics',
        type: 'NUMBER',
      },
    ],
  },
  redis: {
    items: [
      {
        id: 'plan_964e2ebf-5606-471f-8ec7-7f79264015d9',
        name: 'S',
        price: {
          daily: 8.67,
          monthly: 8.67,
        },
        features: [
          {
            name: 'Connection limit',
            code: 'connection-limit',
            typeSlug: 'number',
            value: '100',
            featureValue: 180,
          },
          {
            name: 'Databases',
            code: 'database',
            typeSlug: 'number',
            value: '100',
            featureValue: 100,
          },
          {
            name: 'Size',
            code: 'disk-size',
            typeSlug: 'bytes',
            value: '100MB',
            featureValue: 104857600,
          },
          {
            name: 'Isolation',
            code: 'isolation',
            typeSlug: 'boolean-shared',
            value: 'Dedicated',
            featureValue: false,
          },
          {
            name: 'Type',
            code: 'type-shared',
            typeSlug: 'boolean-shared',
            value: 'Dedicated',
            featureValue: false,
          },
          {
            name: 'CPU',
            code: 'cpu',
            typeSlug: 'number',
            value: '1 vCPU',
            featureValue: 1,
          },
        ],
      },
      {
        id: 'plan_24b6f0ca-18b8-44af-a9aa-9618a288048a',
        name: 'XXL',
        price: {
          daily: 190.71,
          monthly: 190.71,
        },
        features: [
          {
            name: 'Connection limit',
            code: 'connection-limit',
            typeSlug: 'number',
            value: '500',
            featureValue: 500,
          },
          {
            name: 'Databases',
            code: 'database',
            typeSlug: 'number',
            value: '100',
            featureValue: 100,
          },
          {
            name: 'Isolation',
            code: 'isolation',
            typeSlug: 'boolean-shared',
            value: 'Dedicated',
            featureValue: false,
          },
          {
            name: 'Size',
            code: 'disk-size',
            typeSlug: 'bytes',
            value: '2500MB',
            featureValue: 2684354560,
          },
          {
            name: 'Type',
            code: 'type-shared',
            typeSlug: 'boolean-shared',
            value: 'Dedicated',
            featureValue: false,
          },
          {
            name: 'CPU',
            code: 'cpu',
            typeSlug: 'number',
            value: '2 vCPUs',
            featureValue: 2,
          },
        ],
      },
      {
        id: 'plan_524805d6-d1e2-470b-a849-1e689c1958ca',
        name: 'XL',
        price: {
          daily: 78.08,
          monthly: 78.08,
        },
        features: [
          {
            name: 'Isolation',
            code: 'isolation',
            typeSlug: 'boolean-shared',
            value: 'Dedicated',
            featureValue: false,
          },
          {
            name: 'Connection limit',
            code: 'connection-limit',
            typeSlug: 'number',
            value: '500',
            featureValue: 500,
          },
          {
            name: 'Databases',
            code: 'database',
            typeSlug: 'number',
            value: '100',
            featureValue: 100,
          },
          {
            name: 'Size',
            code: 'disk-size',
            typeSlug: 'bytes',
            value: '1000MB',
            featureValue: 1048576000,
          },
          {
            name: 'Type',
            code: 'type-shared',
            typeSlug: 'boolean-shared',
            value: 'Dedicated',
            featureValue: false,
          },
          {
            name: 'CPU',
            code: 'cpu',
            typeSlug: 'number',
            value: '1 vCPU',
            featureValue: 1,
          },
        ],
      },
    ],
    features: [
      {
        name: 'Isolation',
        code: 'isolation',
      },
      {
        name: 'Type',
        code: 'type-shared',
      },
      {
        name: 'Databases',
        code: 'database',
      },
      {
        name: 'CPU',
        code: 'cpu',
      },
      {
        name: 'Connection limit',
        code: 'connection-limit',
      },
      {
        name: 'Size',
        code: 'disk-size',
      },
    ],
  },
};

export const defaultStory = makeStory(conf, {
  items: [
    {
      items: [
        {
          id: 'plan_f14478be-b59a-4f64-870c-6887c561492d',
          name: 'XS Small Space',
          price: {
            daily: 17.5,
            monthly: 17.5,
          },
          features: [
            {
              name: 'Backups',
              code: 'backup',
              typeSlug: 'object',
              value: 'Daily - 7 Retained',
              featureValue: '',
            },
            {
              name: 'Max DB size',
              code: 'max-db-size',
              typeSlug: 'bytes',
              value: '5 GB',
              featureValue: 5368709120,
            },
            {
              name: 'Metrics',
              code: 'metrics',
              typeSlug: 'boolean',
              value: 'Yes',
              featureValue: true,
            },
            {
              name: 'PostGIS',
              code: 'postgis',
              typeSlug: 'boolean',
              value: 'Yes',
              featureValue: true,
            },
            {
              name: 'Type',
              code: 'type-shared',
              typeSlug: 'boolean-shared',
              value: 'Dedicated',
              featureValue: false,
            },
            {
              name: 'vCPUS',
              code: 'cpu',
              typeSlug: 'number',
              value: '1',
              featureValue: 1,
            },
            {
              name: 'Logs',
              code: 'logs',
              typeSlug: 'boolean',
              value: 'Yes',
              featureValue: true,
            },
            {
              name: 'Max connection limit',
              code: 'connection-limit',
              typeSlug: 'number',
              value: '75',
              featureValue: 75,
            },
            {
              name: 'Memory',
              code: 'memory',
              typeSlug: 'bytes',
              value: '1 GB',
              featureValue: 1073741824,
            },
            {
              name: 'Migration Tool',
              code: 'migration',
              typeSlug: 'boolean',
              value: 'Yes',
              featureValue: true,
            },
          ],
        },
        {
          id: 'plan_c32d00fb-6c06-48a9-a0a3-9d808937ec68',
          name: 'XXS Small Space',
          price: {
            daily: 5.25,
            monthly: 5.25,
          },
          features: [
            {
              name: 'Backups',
              code: 'backup',
              typeSlug: 'object',
              value: 'Daily - 7 Retained',
              featureValue: '',
            },
            {
              name: 'Logs',
              code: 'logs',
              typeSlug: 'boolean',
              value: 'Yes',
              featureValue: true,
            },
            {
              name: 'Max DB size',
              code: 'max-db-size',
              typeSlug: 'bytes',
              value: '1 GB',
              featureValue: 1073741824,

            },
            {
              name: 'Migration Tool',
              code: 'migration',
              typeSlug: 'boolean',
              value: 'Yes',
              featureValue: true,
            },
            {
              name: 'PostGIS',
              code: 'postgis',
              typeSlug: 'boolean',
              value: 'Yes',
              featureValue: true,

            },
            {
              name: 'Type',
              code: 'type-shared',
              typeSlug: 'boolean-shared',
              value: 'Dedicated',
              featureValue: false,
            },
            {
              name: 'vCPUS',
              code: 'cpu',
              typeSlug: 'number',
              value: '1',
              featureValue: 1,
            },
            {
              name: 'Max connection limit',
              code: 'connection-limit',
              typeSlug: 'number',
              value: '45',
              featureValue: 45,
            },
            {
              name: 'Metrics',
              code: 'metrics',
              typeSlug: 'boolean',
              value: 'Yes',
              featureValue: true,
            },
            {
              name: 'Memory',
              code: 'memory',
              typeSlug: 'bytes',
              value: '512 MB',
              featureValue: 536870912,
            },
          ],
        },
        {
          id: 'plan_9b4505e7-ac36-4caa-ac7d-9e11b6a26b15',
          name: 'XL Small Space',
          price: {
            daily: 328,
            monthly: 328,
          },
          features: [
            {
              name: 'Max DB size',
              code: 'max-db-size',
              typeSlug: 'bytes',
              value: '80 GB',
              featureValue: 85899345920,
            },
            {
              name: 'vCPUS',
              code: 'cpu',
              typeSlug: 'number',
              value: '8',
              featureValue: 8,
            },
            {
              name: 'Max connection limit',
              code: 'connection-limit',
              typeSlug: 'number',
              value: '750',
              featureValue: 750,
            },
            {
              name: 'Memory',
              code: 'memory',
              typeSlug: 'bytes',
              value: '16 GB',
              featureValue: 17179869184,
            },
            {
              name: 'Backups',
              code: 'backup',
              typeSlug: 'object',
              value: 'Daily - 7 Retained',
              featureValue: '',
            },
            {
              name: 'Metrics',
              code: 'metrics',
              typeSlug: 'boolean',
              value: 'Yes',
              featureValue: true,
            },
            {
              name: 'PostGIS',
              code: 'postgis',
              typeSlug: 'boolean',
              value: 'Yes',
              featureValue: true,
            },
            {
              name: 'Type',
              code: 'type-shared',
              typeSlug: 'boolean-shared',
              value: 'Dedicated',
              featureValue: false,
            },
            {
              name: 'Logs',
              code: 'logs',
              typeSlug: 'boolean',
              value: 'Yes',
              featureValue: true,
            },
            {
              name: 'Migration Tool',
              code: 'migration',
              typeSlug: 'boolean',
              value: 'Yes',
              featureValue: true,
            },
          ],
        },
      ],
      features: [
        {
          name: 'vCPUS',
          code: 'cpu',
          type: 'NUMBER',
        },
        {
          name: 'Type',
          code: 'type-shared',
          type: 'NUMBER',
        },
        {
          name: 'Migration Tool',
          code: 'migration',
          type: 'NUMBER',
        },
        {
          name: 'Logs',
          code: 'logs',
          type: 'NUMBER',
        },
        {
          name: 'Memory',
          code: 'memory',
          type: 'FILESIZE',
        },
        {
          name: 'PostGIS',
          code: 'postgis',
          type: 'NUMBER',
        },
        {
          name: 'Max connection limit',
          code: 'connection-limit',
          type: 'NUMBER',
        },
        {
          name: 'Max DB size',
          code: 'max-db-size',
          type: 'FILESIZE',
        },
        {
          name: 'Backups',
          code: 'backup',
          type: 'NUMBER',
        },
        {
          name: 'Metrics',
          code: 'metrics',
          type: 'NUMBER',
        },
      ],
    },
  ],
});

export const dataLoadedWithRuby = makeStory(conf, {
  items: [
    {
      items: [
        {
          name: 'pico',
          price_id: 'apps.pico',
          price: {
            daily: 0.1073883162,
            monthly: 0.1073883162,
          },
          features: [
            {
              name: 'Memory',
              code: 'memory',
              typeSlug: 'bytes',
              featureValue: 268435456,
            },
            {
              name: 'CPUS',
              code: 'cpu',
              typeSlug: 'number',
              featureValue: 1,
            },
          ],
        },
        {
          name: 'nano',
          price_id: 'apps.nano',
          price: {
            daily: 0.1431844215,
            monthly: 0.1431844215,
          },
          features: [
            {
              name: 'Memory',
              code: 'memory',
              typeSlug: 'bytes',
              featureValue: 536870912,
            },
            {
              name: 'CPUS',
              code: 'cpu',
              typeSlug: 'number',
              featureValue: 1,
            },
          ],
        },
        {
          name: 'XS',
          price: {
            daily: 0.3436,
            monthly: 0.3436,
          },
          price_id: 'apps.XS',
          features: [
            {
              name: 'Memory',
              code: 'memory',
              typeSlug: 'bytes',
              featureValue: 1073741824,
            },
            {
              name: 'CPUS',
              code: 'cpu',
              typeSlug: 'number',
              featureValue: 1,
            },
          ],
        },
        {
          name: 'S',
          price: {
            daily: 0.6873,
            monthly: 0.6873,
          },
          price_id: 'apps.S',
          features: [
            {
              name: 'Memory',
              code: 'memory',
              typeSlug: 'bytes',
              featureValue: 2147483648,
            },
            {
              name: 'CPUS',
              code: 'cpu',
              typeSlug: 'number',
              featureValue: 2,
            },
          ],
        },
        {
          name: 'M',
          price: {
            daily: 1.7182,
            monthly: 1.7182,
          },
          price_id: 'apps.M',
          features: [
            {
              name: 'Memory',
              code: 'memory',
              typeSlug: 'bytes',
              featureValue: 4294967296,
            },
            {
              name: 'CPUS',
              code: 'cpu',
              typeSlug: 'number',
              featureValue: 4,
            },
          ],
        },
        {
          name: 'L',
          price: {
            daily: 3.4364,
            monthly: 3.4364,
          },
          price_id: 'apps.L',
          features: [
            {
              name: 'Memory',
              code: 'memory',
              typeSlug: 'bytes',
              featureValue: 8589934592,
            },
            {
              name: 'CPUS',
              code: 'cpu',
              typeSlug: 'number',
              featureValue: 6,
            },
          ],
        },
        {
          name: 'XL',
          price: {
            daily: 6.8729,
            monthly: 6.8729,
          },
          price_id: 'apps.XL',
          features: [
            {
              name: 'Memory',
              code: 'memory',
              typeSlug: 'bytes',
              featureValue: 17179869184,
            },
            {
              name: 'CPUS',
              code: 'cpu',
              typeSlug: 'number',
              featureValue: 8,
            },
          ],
        },
        {
          name: '2XL',
          price: {
            daily: 13.7458,
            monthly: 13.7458,
          },
          price_id: 'apps.2XL',
          features: [
            {
              name: 'Memory',
              code: 'memory',
              typeSlug: 'bytes',
              featureValue: 25769803776,
            },
            {
              name: 'CPUS',
              code: 'cpu',
              typeSlug: 'number',
              featureValue: 12,
            },
          ],
        },
        {
          name: '3XL',
          price: {
            daily: 27.4915,
            monthly: 27.4915,
          },
          price_id: 'apps.3XL',
          features: [
            {
              name: 'Memory',
              code: 'memory',
              typeSlug: 'bytes',
              featureValue: 34359738368,
            },
            {
              name: 'CPUS',
              code: 'cpu',
              typeSlug: 'number',
              featureValue: 16,
            },
          ],
        },
      ],
      features: [
        {
          name: 'Memory',
          code: 'memory',
        },
        {
          name: 'CPU',
          code: 'cpu',
        },
      ],
    },
  ],
});

export const dataLoadedWithPostgres = makeStory(conf, {
  items: [
    {
      items: [
        {
          id: 'plan_f14478be-b59a-4f64-870c-6887c561492d',
          name: 'XS Small Space',
          price: {
            daily: 17.5,
            monthly: 17.5,
          },
          features: [
            {
              name: 'Backups',
              code: 'backup',
              typeSlug: 'object',
              value: 'Daily - 7 Retained',
              featureValue: '',
            },
            {
              name: 'Max DB size',
              code: 'max-db-size',
              typeSlug: 'bytes',
              value: '5 GB',
              featureValue: 5368709120,
            },
            {
              name: 'Metrics',
              code: 'metrics',
              typeSlug: 'boolean',
              value: 'Yes',
              featureValue: true,
            },
            {
              name: 'PostGIS',
              code: 'postgis',
              typeSlug: 'boolean',
              value: 'Yes',
              featureValue: true,
            },
            {
              name: 'Type',
              code: 'type-shared',
              typeSlug: 'boolean-shared',
              value: 'Dedicated',
              featureValue: false,
            },
            {
              name: 'vCPUS',
              code: 'cpu',
              typeSlug: 'number',
              value: '1',
              featureValue: 1,
            },
            {
              name: 'Logs',
              code: 'logs',
              typeSlug: 'boolean',
              value: 'Yes',
              featureValue: true,
            },
            {
              name: 'Max connection limit',
              code: 'connection-limit',
              typeSlug: 'number',
              value: '75',
              featureValue: 75,
            },
            {
              name: 'Memory',
              code: 'memory',
              typeSlug: 'bytes',
              value: '1 GB',
              featureValue: 1073741824,
            },
            {
              name: 'Migration Tool',
              code: 'migration',
              typeSlug: 'boolean',
              value: 'Yes',
              featureValue: true,
            },
          ],
        },
        {
          id: 'plan_c32d00fb-6c06-48a9-a0a3-9d808937ec68',
          name: 'XXS Small Space',
          price: {
            daily: 5.25,
            monthly: 5.25,
          },
          features: [
            {
              name: 'Backups',
              code: 'backup',
              typeSlug: 'object',
              value: 'Daily - 7 Retained',
              featureValue: '',
            },
            {
              name: 'Logs',
              code: 'logs',
              typeSlug: 'boolean',
              value: 'Yes',
              featureValue: true,
            },
            {
              name: 'Max DB size',
              code: 'max-db-size',
              typeSlug: 'bytes',
              value: '1 GB',
              featureValue: 1073741824,

            },
            {
              name: 'Migration Tool',
              code: 'migration',
              typeSlug: 'boolean',
              value: 'Yes',
              featureValue: true,
            },
            {
              name: 'PostGIS',
              code: 'postgis',
              typeSlug: 'boolean',
              value: 'Yes',
              featureValue: true,

            },
            {
              name: 'Type',
              code: 'type-shared',
              typeSlug: 'boolean-shared',
              value: 'Dedicated',
              featureValue: false,
            },
            {
              name: 'vCPUS',
              code: 'cpu',
              typeSlug: 'number',
              value: '1',
              featureValue: 1,
            },
            {
              name: 'Max connection limit',
              code: 'connection-limit',
              typeSlug: 'number',
              value: '45',
              featureValue: 45,
            },
            {
              name: 'Metrics',
              code: 'metrics',
              typeSlug: 'boolean',
              value: 'Yes',
              featureValue: true,
            },
            {
              name: 'Memory',
              code: 'memory',
              typeSlug: 'bytes',
              value: '512 MB',
              featureValue: 536870912,
            },
          ],
        },
        {
          id: 'plan_9b4505e7-ac36-4caa-ac7d-9e11b6a26b15',
          name: 'XL Small Space',
          price: {
            daily: 328,
            monthly: 328,
          },
          features: [
            {
              name: 'Max DB size',
              code: 'max-db-size',
              typeSlug: 'bytes',
              value: '80 GB',
              featureValue: 85899345920,
            },
            {
              name: 'vCPUS',
              code: 'cpu',
              typeSlug: 'number',
              value: '8',
              featureValue: 8,
            },
            {
              name: 'Max connection limit',
              code: 'connection-limit',
              typeSlug: 'number',
              value: '750',
              featureValue: 750,
            },
            {
              name: 'Memory',
              code: 'memory',
              typeSlug: 'bytes',
              value: '16 GB',
              featureValue: 17179869184,
            },
            {
              name: 'Backups',
              code: 'backup',
              typeSlug: 'object',
              value: 'Daily - 7 Retained',
              featureValue: '',
            },
            {
              name: 'Metrics',
              code: 'metrics',
              typeSlug: 'boolean',
              value: 'Yes',
              featureValue: true,
            },
            {
              name: 'PostGIS',
              code: 'postgis',
              typeSlug: 'boolean',
              value: 'Yes',
              featureValue: true,
            },
            {
              name: 'Type',
              code: 'type-shared',
              typeSlug: 'boolean-shared',
              value: 'Dedicated',
              featureValue: false,
            },
            {
              name: 'Logs',
              code: 'logs',
              typeSlug: 'boolean',
              value: 'Yes',
              featureValue: true,
            },
            {
              name: 'Migration Tool',
              code: 'migration',
              typeSlug: 'boolean',
              value: 'Yes',
              featureValue: true,
            },
          ],
        },
      ],
      features: [
        {
          name: 'vCPUS',
          code: 'cpu',
          type: 'NUMBER',
        },
        {
          name: 'Type',
          code: 'type-shared',
          type: 'NUMBER',
        },
        {
          name: 'Migration Tool',
          code: 'migration',
          type: 'NUMBER',
        },
        {
          name: 'Logs',
          code: 'logs',
          type: 'NUMBER',
        },
        {
          name: 'Memory',
          code: 'memory',
          type: 'FILESIZE',
        },
        {
          name: 'PostGIS',
          code: 'postgis',
          type: 'NUMBER',
        },
        {
          name: 'Max connection limit',
          code: 'connection-limit',
          type: 'NUMBER',
        },
        {
          name: 'Max DB size',
          code: 'max-db-size',
          type: 'FILESIZE',
        },
        {
          name: 'Backups',
          code: 'backup',
          type: 'NUMBER',
        },
        {
          name: 'Metrics',
          code: 'metrics',
          type: 'NUMBER',
        },
      ],
    },
  ],
});

export const dataLoadedWithRedis = makeStory(conf, {
  items: [
    {
      items: [
        {
          id: 'plan_964e2ebf-5606-471f-8ec7-7f79264015d9',
          name: 'S',
          price: {
            daily: 8.67,
            monthly: 8.67,
          },
          features: [
            {
              name: 'Connection limit',
              code: 'connection-limit',
              typeSlug: 'number',
              value: '100',
              featureValue: 180,
            },
            {
              name: 'Databases',
              code: 'database',
              typeSlug: 'number',
              value: '100',
              featureValue: 100,
            },
            {
              name: 'Size',
              code: 'disk-size',
              typeSlug: 'bytes',
              value: '100MB',
              featureValue: 104857600,
            },
            {
              name: 'Isolation',
              code: 'isolation',
              typeSlug: 'boolean-shared',
              value: 'Dedicated',
              featureValue: false,
            },
            {
              name: 'Type',
              code: 'type-shared',
              typeSlug: 'boolean-shared',
              value: 'Dedicated',
              featureValue: false,
            },
            {
              name: 'CPU',
              code: 'cpu',
              typeSlug: 'number',
              value: '1 vCPU',
              featureValue: 1,
            },
          ],
        },
        {
          id: 'plan_24b6f0ca-18b8-44af-a9aa-9618a288048a',
          name: 'XXL',
          price: {
            daily: 190.71,
            monthly: 190.71,
          },
          features: [
            {
              name: 'Connection limit',
              code: 'connection-limit',
              typeSlug: 'number',
              value: '500',
              featureValue: 500,
            },
            {
              name: 'Databases',
              code: 'database',
              typeSlug: 'number',
              value: '100',
              featureValue: 100,
            },
            {
              name: 'Isolation',
              code: 'isolation',
              typeSlug: 'boolean-shared',
              value: 'Dedicated',
              featureValue: false,
            },
            {
              name: 'Size',
              code: 'disk-size',
              typeSlug: 'bytes',
              value: '2500MB',
              featureValue: 2684354560,
            },
            {
              name: 'Type',
              code: 'type-shared',
              typeSlug: 'boolean-shared',
              value: 'Dedicated',
              featureValue: false,
            },
            {
              name: 'CPU',
              code: 'cpu',
              typeSlug: 'number',
              value: '2 vCPUs',
              featureValue: 2,
            },
          ],
        },
        {
          id: 'plan_524805d6-d1e2-470b-a849-1e689c1958ca',
          name: 'XL',
          price: {
            daily: 78.08,
            monthly: 78.08,
          },
          features: [
            {
              name: 'Isolation',
              code: 'isolation',
              typeSlug: 'boolean-shared',
              value: 'Dedicated',
              featureValue: false,
            },
            {
              name: 'Connection limit',
              code: 'connection-limit',
              typeSlug: 'number',
              value: '500',
              featureValue: 500,
            },
            {
              name: 'Databases',
              code: 'database',
              typeSlug: 'number',
              value: '100',
              featureValue: 100,
            },
            {
              name: 'Size',
              code: 'disk-size',
              typeSlug: 'bytes',
              value: '1000MB',
              featureValue: 1048576000,
            },
            {
              name: 'Type',
              code: 'type-shared',
              typeSlug: 'boolean-shared',
              value: 'Dedicated',
              featureValue: false,
            },
            {
              name: 'CPU',
              code: 'cpu',
              typeSlug: 'number',
              value: '1 vCPU',
              featureValue: 1,
            },
          ],
        },
      ],
      features: [
        {
          name: 'Isolation',
          code: 'isolation',
        },
        {
          name: 'Type',
          code: 'type-shared',
        },
        {
          name: 'Databases',
          code: 'database',
        },
        {
          name: 'CPU',
          code: 'cpu',
        },
        {
          name: 'Connection limit',
          code: 'connection-limit',
        },
        {
          name: 'Size',
          code: 'disk-size',
        },
      ],
    },
  ],
});

// Right now, because of how we're using this component, we don't need:
// * skeleton/waiting state
// * emtpy state
// * error state

enhanceStoriesNames({
  defaultStory,
    dataLoadedWithRuby,
  dataLoadedWithPostgres,
  dataLoadedWithRedis,
});
