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
  schedule: Schedule;
  enabled?: boolean;
}

// export interface Schedule {
//   frequency: 'daily' | 'weekly' | 'monthly' | 'yearly' | 'hourly' | 'minutely' | 'secondly';
//   interval?: number;
//   dayOfWeek?: Array<'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'>;
//   dayOfMonth?: number;
//   position?: number;
//   time?: string;
//   durationMinutes?: number;
// }

type Frequency = 'daily' | 'weekly' | 'monthly';

interface Schedule {

  frequency: Frequency;

  time?: string;

  daysOfWeek?: string[];

  daysOfMonth?: number[];

  position?: number;

  durationMinutes?: number;
}

// type Schedule =
//   | { frequency: 'daily'; time: string }
//   | { frequency: 'weekly'; dayOfWeek: number; time?: string }
//   | { frequency: 'monthly'; dayOfMonth: number; time?: string }
//   | { frequency: 'monthly'; dayOfWeek: number; position?: number; time?: string}


// type Recurrence =
//     | { type: "weekly"; weekday: number; time: string }
//     | { type: "monthly"; day: number; time: string }
//     | { type: "monthly-weekday"; weekday: number; position: number; time: string }
//
//
// type Schedule = {
//   recurrence: Recurrence
//   durationMinutes: number
// }

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
