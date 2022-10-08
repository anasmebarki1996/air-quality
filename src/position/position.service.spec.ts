import { HttpService } from '@nestjs/axios';
import { BadRequestException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { PositionService } from './position.service';

describe('positionService', () => {
  let positionService: PositionService;

  const positionModelMock = {
    create: jest.fn(),
    findOne: jest.fn(),
    aggregate: jest.fn(),
  };

  const httpServiceMock = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PositionService,
        {
          provide: getModelToken('Positions'),
          useValue: positionModelMock,
        },
        {
          provide: HttpService,
          useValue: httpServiceMock,
        },
      ],
    }).compile();

    positionService = module.get<PositionService>(PositionService);
  });

  it('should be defined', () => {
    expect(positionService).toBeDefined();
  });

  describe('create', () => {
    it('Cannot create a new position', async () => {
      httpServiceMock.get.mockImplementation(() => ({
        toPromise: () =>
          Promise.resolve({
            data: {
              status: 'error',
            },
          }),
      }));

      try {
        await positionService.create(1, 1);
      } catch (error: any) {
        expect(error).toBeInstanceOf(BadRequestException);
      }
    });

    it('Create a position successfully', async () => {
      const createdAt = new Date();
      createdAt.setSeconds(0, 0);

      httpServiceMock.get.mockImplementation(() => ({
        toPromise: () =>
          Promise.resolve({
            data: {
              status: 'success',
              data: {
                current: {
                  pollution: {
                    aqius: 5,
                  },
                },
              },
            },
          }),
      }));

      jest.spyOn(positionModelMock, 'findOne').mockResolvedValue(null);
      jest.spyOn(positionModelMock, 'create').mockResolvedValue({});

      await positionService.create(1, 1);

      expect(positionModelMock.findOne).toBeCalledWith({
        latitude: 1,
        longitude: 1,
      });
      expect(positionModelMock.create).toBeCalledWith({
        latitude: 1,
        longitude: 1,
        qualityPollutionHistory: [{ aqius: 5, time: createdAt }],
      });
    });

    it('Update a position successfully', async () => {
      const createdAt = new Date();
      createdAt.setSeconds(0, 0);

      httpServiceMock.get.mockImplementation(() => ({
        toPromise: () =>
          Promise.resolve({
            data: {
              status: 'success',
              data: {
                current: {
                  pollution: {
                    aqius: 5,
                  },
                },
              },
            },
          }),
      }));

      jest
        .spyOn(positionModelMock, 'findOne')
        .mockResolvedValue({ qualityPollutionHistory: [], save: () => '' });

      await positionService.create(1, 1);

      expect(positionModelMock.findOne).toBeCalledWith({
        latitude: 1,
        longitude: 1,
      });
      // expect(positionModelMock.create).not.toBeCalled();
    });
  });
});
