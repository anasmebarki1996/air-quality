import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { Connection } from 'mongoose';
import { DatabaseService } from '../src/database/database.service';
import { HttpService } from '@nestjs/axios';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let dbConnection: Connection;
  let httpServer: any;

  const httpServiceMock = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(HttpService)
      .useValue(httpServiceMock)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    dbConnection = moduleFixture
      .get<DatabaseService>(DatabaseService)
      .getDbHandle();
    httpServer = app.getHttpServer();
  });

  describe('Get air quality of position', () => {
    afterEach(async () => {
      await dbConnection.collection('positions').deleteMany({});
    });

    it('Cannot get air quality of this position', async () => {
      httpServiceMock.get.mockImplementation(() => ({
        toPromise: () =>
          Promise.resolve({
            data: {
              status: 'error',
            },
          }),
      }));

      const response = await request(httpServer).get(
        '/position/air-quality?latitude=1&longitude=1',
      );

      expect(response.status).toBe(400);
    });

    it('Get air quality of this position successfully', async () => {
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

      const response: any = await request(httpServer).get(
        '/position/air-quality?latitude=1&longitude=1',
      );

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        Result: {
          Pollution: {
            aqius: 5,
          },
        },
      });
    });
  });
});
