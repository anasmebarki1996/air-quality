import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { IQualityPollution } from '../interfaces/quality-pollution.interface';

export type QualityPollutionDocument = QualityPollution & Document;

@Schema()
export class QualityPollution implements IQualityPollution {
  @Prop({ required: true })
  time: Date;

  @Prop({ required: true })
  aqius: number;

  @Prop({ required: true })
  mainus: string;

  @Prop({ required: true })
  aqicn: number;

  @Prop({ required: true })
  maincn: string;
}

export const QualityPollutionSchema =
  SchemaFactory.createForClass(QualityPollution);
