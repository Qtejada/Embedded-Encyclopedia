// @ts-check
import {themes as prismThemes} from 'prism-react-renderer';
import remarkImageDimensions from './scripts/remark-image-dimensions.mjs';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Hardware Encyclopedia',
  tagline: 'Interactive EE Reference — from Passives to PCB Layout',
  favicon: 'img/favicon.svg',

  future: {
    v4: true,
  },

  url: 'https://qtejada.github.io',
  baseUrl: '/Embedded-Encyclopedia/',

  organizationName: 'Qtejada',
  projectName: 'Embedded-Encyclopedia',
  trailingSlash: false,

  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  themes: [
    [
      '@easyops-cn/docusaurus-search-local',
      /** @type {import("@easyops-cn/docusaurus-search-local").PluginOptions} */
      ({
        hashed: true,
        indexDocs: true,
        indexBlog: false,
        docsRouteBasePath: '/docs',
        highlightSearchTermsOnTargetPage: true,
        searchResultLimits: 8,
        searchBarShortcutHint: true,
      }),
    ],
  ],

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: './sidebars.js',
          routeBasePath: 'docs',
          remarkPlugins: [[remarkImageDimensions, {staticDir: './static'}]],
        },
        blog: false,
        theme: {
          customCss: ['./src/css/custom.css', './src/css/field-guide.css'],
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      image: 'img/docusaurus-social-card.jpg',
      colorMode: {
        defaultMode: 'light',
        disableSwitch: false,
        respectPrefersColorScheme: false,
      },
      navbar: {
        title: 'Hardware Encyclopedia',
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'tutorialSidebar',
            position: 'left',
            label: 'Reference',
          },
          {
            href: 'https://github.com/Qtejada/Embedded-Encyclopedia',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        links: [
          {
            title: 'Sections',
            items: [
              { label: 'Foundations', to: '/docs/Foundations' },
              { label: 'Discrete Components', to: '/docs/Discrete-Components/Passives/Resistors' },
              { label: 'Power', to: '/docs/Power/Entry Protection/fuses' },
            ],
          },
          {
            title: 'More Sections',
            items: [
              { label: 'Signal Modulation', to: '/docs/Signal-Modulation/Amplifiers/op-amps' },
              { label: 'Digital Interfaces', to: '/docs/Digital-Interfaces/DigitalGeneral' },
              { label: 'PCB Layout', to: '/docs/PCB-Layout/Overview' },
            ],
          },
          {
            title: 'Links',
            items: [
              {
                label: 'GitHub',
                href: 'https://github.com/Qtejada/Embedded-Encyclopedia',
              },
            ],
          },
        ],
        copyright: `Hardware Encyclopedia · Built by Quincy Tejada · ${new Date().getFullYear()}`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
        additionalLanguages: ['c', 'cpp', 'python', 'bash'],
      },
    }),
};

export default config;
