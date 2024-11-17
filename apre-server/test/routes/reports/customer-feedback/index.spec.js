/**
 * Author: Professor Krasso
 * Date: 10 September 2024
 * File: index.spec.js
 * Description: Test the customer feedback API
 */

// Require the modules
const request = require('supertest');
const app = require('../../../../src/app');
const { mongo } = require('../../../../src/utils/mongo');


jest.mock('../../../../src/utils/mongo');

// Test the customer feedback API
describe('Apre Customer Feedback API', () => {
  beforeEach(() => {
    mongo.mockClear();
  });

  // Test the channel-rating-by-month endpoint
  it('should fetch average customer feedback ratings by channel for a specified month', async () => {
    mongo.mockImplementation(async (callback) => {
      const db = {
        collection: jest.fn().mockReturnThis(),
        aggregate: jest.fn().mockReturnValue({
          toArray: jest.fn().mockResolvedValue([
            {
              channels: ['Email', 'Phone'],
              ratingAvg: [4.5, 3.8]
            }
          ])
        })
      };
      await callback(db);
    });

    const response = await request(app).get('/api/reports/customer-feedback/channel-rating-by-month?month=1'); // Send a GET request to the channel-rating-by-month endpoint

    // Expect a 200 status code
    expect(response.status).toBe(200);

    // Expect the response body to match the expected data
    expect(response.body).toEqual([
      {
        channels: ['Email', 'Phone'],
        ratingAvg: [4.5, 3.8]
      }
    ]);
  });

  // Test the channel-rating-by-month endpoint with missing parameters
  it('should return 400 if the month parameter is missing', async () => {
    const response = await request(app).get('/api/reports/customer-feedback/channel-rating-by-month'); // Send a GET request to the channel-rating-by-month endpoint with missing month
    expect(response.status).toBe(400); // Expect a 400 status code

    // Expect the response body to match the expected data
    expect(response.body).toEqual({
      message: 'month and channel are required',
      status: 400,
      type: 'error'
    });
  });

  // Test the channel-rating-by-month endpoint with an invalid month
  it('should return 404 for an invalid endpoint', async () => {
    // Send a GET request to an invalid endpoint
    const response = await request(app).get('/api/reports/customer-feedback/invalid-endpoint');
    expect(response.status).toBe(404); // Expect a 404 status code

    // Expect the response body to match the expected data
    expect(response.body).toEqual({
      message: 'Not Found',
      status: 404,
      type: 'error'
    });
  });
});

describe('Customer Feedback by Year API', () => {

  //attempting to solve the open handle issue
  let timer;


  beforeEach(() => {
    mongo.mockClear();
    timer = setTimeout(() => {}, 1000);
  });

  afterEach(() => {
    clearTimeout(timer);
  })
  //Test for an empty array with no provided data
  it('should return 200 with an empty array if no customer feedback is found', async () => {
    // Mock the MongoDB implementation
    mongo.mockImplementation(async (callback) => {
      const db = {
        collection: jest.fn().mockReturnThis(),
        distinct: jest.fn().mockResolvedValue([])
      };
      await callback(db);
    });

    // Make a request to the endpoint
    const response = await request(app).get('/api/reports/customer-feedback/customer-feedback-by-year?year=2023');

    expect(response.status).toBe(200); // Expect a 200 status code
    expect(response.body).toEqual([]); // Expect the response body to match the expected data
  });


  //Test for a 400 status code when missing parameter
  it('should return 400 for a missing parameter', async () => {
    //send the request to endpoint without year
    const response = await request(app).get('/api/reports/customer-feedback/customer-feedback-by-year');

    //Expect response
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: 'Year Required',
      status: 400,
      type: 'error'
    });
  });

  //Test for a 404 error with an invalid endpoint
  it('should return 404 for invalid endpoint', async () => {
    //send the request to an invalid endpoint
    const response = await request(app).get('/api/reports/customer-feedback/customer-feedback-byy-year?year=2023');

    //Expected response
    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      message: 'Not Found',
      status: 404,
      type: 'error'
    });
  });
});