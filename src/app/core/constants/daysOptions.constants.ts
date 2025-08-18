import { Home } from "../enum/home.enum";
import { Idayoptions } from "../interfaces/idayoptions";

export const DAYSOPTIONS_CONSTANTS:Idayoptions[] = [
  { label: 'Last 7 days', value: Home.LAST7  },
  { label: 'Last 30 days', value: Home.LAST30 },
  { label: 'Last 90 days', value: Home.LAST90 },
];
