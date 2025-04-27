import {DashboardConfig} from "./interface";

export enum LookupItemType {
  LINK = 'link',
  SEARCH_FIELD = 'search-field',
}

export interface LookupItem {
  title: string;
  href: string;
  context: string;
  type: LookupItemType;
}

export function generateLookupTable(dashboardConfig: DashboardConfig) {

  if (dashboardConfig.liveSearch) {
    let lookup: LookupItem[] = [];

    dashboardConfig.sections.forEach(section => {
      section.blocks.forEach(block => {
        block.links?.forEach(link => {
          lookup.push({
            type: LookupItemType.LINK,
            title: link.title,
            href: link.href,
            context: `${section.title} > ${block.title}`,
          });

          block.searchFields?.forEach(searchField => {
            lookup.push({
              type: LookupItemType.SEARCH_FIELD,
              title: searchField.title,
              href: searchField.href,
              context: `${section.title} > ${block.title}`,
            });
          });

          block.groups?.forEach(group => {
            group.links?.forEach(groupLink => {
              lookup.push({
                type: LookupItemType.LINK,
                title: groupLink.title,
                href: groupLink.href,
                context: `${section.title} > ${block.title} > ${group.title}`,
              });
            });

            group.searchFields?.forEach(searchField => {
              lookup.push({
                type: LookupItemType.SEARCH_FIELD,
                title: searchField.title,
                href: searchField.href,
                context: `${section.title} > ${block.title} > ${group.title}`,
              });
            });
          });
        });
      });
    });

    return lookup;
  }
}

