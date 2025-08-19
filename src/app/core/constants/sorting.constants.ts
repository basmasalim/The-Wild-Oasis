import { SortingOptions } from '../enum/sorting.enum';

export const SORTING_OPTIONS = [
  {
    label: 'Sort by date (recent first)',
    value: SortingOptions.DateRecentFirst,
  },
  {
    label: 'Sort by date (earlier first)',
    value: SortingOptions.DateEarlierFirst,
  },
  {
    label: 'Sort by amount (high first)',
    value: SortingOptions.AmountHighFirst,
  },
  { label: 'Sort by amount (low first)', value: SortingOptions.AmountLowFirst },
];
