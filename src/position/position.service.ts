import { BadRequestException, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { queryDTO } from './dto/query.dto';
import { InjectModel } from '@nestjs/mongoose';
import { PositionDocument } from './schemas/position.schema';
import { Model } from 'mongoose';

@Injectable()
export class PositionService {
  constructor(
    @InjectModel('Positions')
    readonly positionModel: Model<PositionDocument>,
    private readonly httpService: HttpService,
  ) {}

  async create(latitude: number, longitude: number) {
    const createdAt = new Date();
    createdAt.setSeconds(0, 0);
    const response: any = await this.calculateAQI(latitude, longitude);

    if (response?.status !== 'success') {
      throw new BadRequestException('Position not found');
    }

    const pollution = { ...response.data.current.pollution, time: createdAt };
    const position = await this.positionModel.findOne({
      latitude,
      longitude,
    });

    // when we create or update we are waiting for the functions to be finished
    // because we don't return the result
    if (position) {
      const qualityPollutionHistory = position.qualityPollutionHistory;
      qualityPollutionHistory.push(pollution);
      position.qualityPollutionHistory = qualityPollutionHistory;
      await position.save();
    } else {
      await this.positionModel.create({
        latitude,
        longitude,
        qualityPollutionHistory: [pollution],
      });
    }
  }

  async findPosition(query: queryDTO) {
    const response: any = await this.calculateAQI(
      query.latitude,
      query.longitude,
    );

    if (response.status !== 'success') {
      throw new BadRequestException('Position not found');
    }
    const pollution = response.data.current.pollution;

    return {
      Result: {
        Pollution: pollution,
      },
    };
  }

  async mostPollutedTimeZone(latitude: number, longitude: number) {
    const result = await this.positionModel.aggregate([
      { $match: { latitude: latitude, longitude: longitude } },
      {
        $addFields: {
          mostPolluted: {
            $reduce: {
              input: '$qualityPollutionHistory',
              initialValue: { aqius: 0 },
              in: {
                $cond: [
                  { $gte: ['$$this.aqius', '$$value.aqius'] },
                  '$$this',
                  '$$value',
                ],
              },
            },
          },
        },
      },
      {
        $project: { _id: 0, mostPolluted: 1 },
      },
    ]);

    if (!result.length) {
      return null;
    }

    return result[0].mostPolluted;
  }

  private async calculateAQI(latitude: number, longitude: number) {
    try {
      const API_KEY = '659ad33c-131c-4d52-8aa5-e80ee47f2b04';
      const response: any = await this.httpService
        .get(
          `http://api.airvisual.com/v2/nearest_city?lat=${latitude}&lon=${longitude}&key=${API_KEY}`,
        )
        .toPromise();

      return response.data;
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Air Quality API Error');
    }
  }
}
