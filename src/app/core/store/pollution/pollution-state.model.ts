import { Pollution } from '../../models/pollution.model';

export interface PollutionStateModel {
  pollutions: Pollution[];
  selectedPollution: Pollution | null;
  loading: boolean;
  error: string | null;
}
