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

interface Section {
  title: string;
  blocks: Block[];
}

export interface Meta {
  favicon: string;
  copyRightYear: string;
}

export interface DashboardConfig {
  meta: Meta;
  title: string;
  theme: string;
  clock: boolean;
  sections: Section[];
  inlineCss?: string;
  clockJs?: string;
  searchJs?: string;
}