import { IQualityPollution } from './quality-pollution.interface';

export interface IPosition {
  _id?: string;
  longitude: number;
  latitude: number;
  qualityPollutionHistory: IQualityPollution[];
}
