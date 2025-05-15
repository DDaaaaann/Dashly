import { DashboardConfig, Section } from "./interface";

export enum LookupItemType {
  LINK = 'link',
  SEARCH_FIELD = 'search-field',
}

export interface LookupItem {
  title: string;
  href: string;
  section: string;
  block: string;
  group?: string;
  type: LookupItemType;
}

function determineSectionTitle(section: Section, dashboardConfig: DashboardConfig, index: number) {
  return section.title || (dashboardConfig.defaultTitle ? `Section ${index + 1}` : '');
}

export function generateLookupTable(dashboardConfig: DashboardConfig) {
  const lookup: LookupItem[] = [];

  dashboardConfig.sections.forEach((section, index) => {
    section.blocks.forEach(block => {
      block.links?.forEach(link => {
        lookup.push({
          type: LookupItemType.LINK,
          title: link.title,
          href: link.href,
          section: determineSectionTitle(section, dashboardConfig, index),
          block: block.title,
        });
      });
      block.searchFields?.forEach(searchField => {
        lookup.push({
          type: LookupItemType.SEARCH_FIELD,
          title: searchField.title,
          href: searchField.href,
          section: determineSectionTitle(section, dashboardConfig, index),
          block: block.title,
        });
      });

      block.groups?.forEach(group => {
        group.links?.forEach(groupLink => {
          lookup.push({
            type: LookupItemType.LINK,
            title: groupLink.title,
            href: groupLink.href,
            section: determineSectionTitle(section, dashboardConfig, index),
            block: block.title,
            group: group.title,
          });
        });

        group.searchFields?.forEach(searchField => {
          lookup.push({
            type: LookupItemType.SEARCH_FIELD,
            title: searchField.title,
            href: searchField.href,
            section: determineSectionTitle(section, dashboardConfig, index),
            block: block.title,
            group: group.title,
          });
        });
      });
    });
  });

  return lookup;
}

