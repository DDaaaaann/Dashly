import fs from 'fs-extra';
import path from 'path';
import yaml from 'yaml';
import { generateLookupTable } from '../../../src/scripts/search';
import { DashboardConfig } from '../../../src/scripts/interface';

const SHARED_THEME_TEMPLATE_PATH = path.join(__dirname, '../../fixtures/theme_shared.yaml');

export const THEMES = [
  'Emerald Tides',
  'Night Owl',
  'Silent Alps',
  'Bright Tangerine',
] as const;

type SearchExpectation = {
  title: string;
  context: string;
};

type ThemeTemplateConfig = Omit<DashboardConfig, 'meta' | 'inlineCss' | 'bundleJs'>;

export function createThemeConfig(theme: string): ThemeTemplateConfig {
  const template = fs.readFileSync(SHARED_THEME_TEMPLATE_PATH, 'utf8');
  const parsedConfig = yaml.parse(template.replaceAll('__THEME__', theme)) as ThemeTemplateConfig;

  parsedConfig.defaultTitle = usesDefaultSectionTitle(theme);

  return parsedConfig;
}

export function getThemeSlug(theme: string) {
  return theme.replaceAll(' ', '-').toLowerCase();
}

export function getExpectedSectionLabels(config: ThemeTemplateConfig) {
  return config.sections.map((section, index) => section.title || `Section ${index + 1}`);
}

export function getExpectedSearchResults(config: ThemeTemplateConfig, searchTerm: string) {
  return generateLookupTable(config as DashboardConfig)
  .map(item => ({
    item,
    score: getLookupItemScore(item, searchTerm),
  }))
  .filter(result => result.score > 0)
  .sort((left, right) => right.score - left.score)
  .slice(0, 8)
  .map(({item}) => toSearchExpectation(item));
}

function usesDefaultSectionTitle(theme: string) {
  return theme === 'Emerald Tides' || theme === 'Silent Alps';
}

function getLookupItemScore(item: ReturnType<typeof generateLookupTable>[number], searchTerm: string) {
  const title = item.title.toLowerCase();
  const section = item.section.toLowerCase();
  const block = item.block.toLowerCase();
  const group = item.group ? item.group.toLowerCase() : '';
  const tokens = searchTerm.toLowerCase().trim().split(/\s+/);

  const allTokensMatch = tokens.every(token =>
      title.split(' ').some(word => word.startsWith(token))
      || (section && section.split(' ').some(word => word.startsWith(token)))
      || block.split(' ').some(word => word.startsWith(token))
      || group.split(' ').some(word => word.startsWith(token))
  );

  if (!allTokensMatch) {
    return 0;
  }

  let score = 0;

  for (const token of tokens) {
    if (title.split(' ').some(word => word.startsWith(token))) {
      score += 4;
    }

    if (section && section.split(' ').some(word => word.startsWith(token))) {
      score += 3;
    }

    if (block.split(' ').some(word => word.startsWith(token))) {
      score += 2;
    }

    if (group.split(' ').some(word => word.startsWith(token))) {
      score += 1;
    }
  }

  return score;
}

function toSearchExpectation(item: ReturnType<typeof generateLookupTable>[number]): SearchExpectation {
  const context = [item.section, item.block, item.group].filter(Boolean).join(' > ');

  return {
    title: item.title,
    context,
  };
}

export function getExpectedAlertStates() {
  return [
    {
      customDate: '2025-03-14T14:30:00',
      assertVisible: [
        {
          title: 'Info Alert 1',
          type: 'warning' as const,
          message: 'This is the first info alert.',
        },
      ],
    },
    {
      customDate: '2025-03-14T15:30:00',
      assertVisible: [],
    },
  ];
}

export function getExpectedSearchFieldResults(config: ThemeTemplateConfig) {
  return getExpectedSearchResults(config, 'title search field')
  .filter(result => result.title.toLowerCase().includes('title search field'));
}

export function getExpectedLinkResults(config: ThemeTemplateConfig) {
  return getExpectedSearchResults(config, 'title link 8')
  .filter(result => result.title === 'Title Link 8');
}
