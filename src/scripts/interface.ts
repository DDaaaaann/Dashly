// Define types for configuration structure

interface Link {
  title: string;
  href: string;
}

interface SearchField {
  title: string;
  parameter: string;
  href: string;
}

interface Group {
  title: string;
  links?: Link[];
  searchFields?: SearchField[];
}

interface Block {
  title: string;
  links?: Link[];
  searchFields?: SearchField[];
  groups?: Group[];
}

export interface Section {
  title?: string;
  blocks: Block[];
}

export interface Meta {
  favicon: string;
  copyRightYear: string;
}

export interface Alert {
  id?: string;
  title: string;
  message: string;
  type?: 'info' | 'warning'
  cron: string;
  durationMinutes?: number;
  enabled?: boolean;
}

export interface DashboardConfig {
  meta: Meta;
  sections: Section[];
  theme: string;
  title?: string;
  defaultTitle: boolean;
  clock?: boolean;
  liveSearch?: boolean;
  alerts?: Alert[];
  inlineCss?: string;
  bundleJs?: string;
}
