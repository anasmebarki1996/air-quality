import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { IPosition } from '../interfaces/position.interface';
import { IQualityPollution } from '../interfaces/quality-pollution.interface';
import { QualityPollutionSchema } from './quality-pollution.schema';

export type PositionDocument = Position & Document;

@Schema()
export class Position implements IPosition {
  @Prop({ required: true })
  longitude: number;

  @Prop({ required: true })
  latitude: number;

  @Prop({ type: [QualityPollutionSchema] })
  qualityPollutionHistory: IQualityPollution[];
}

export const PositionSchema = SchemaFactory.createForClass(Position);
