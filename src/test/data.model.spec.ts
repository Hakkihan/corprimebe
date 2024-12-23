import { Test, TestingModule } from '@nestjs/testing';
import { DataModel } from '../data/data.model'; // Adjust the path if needed
import axios from 'axios';
import { COINGECKO_URL } from '../constants';

jest.mock('axios'); // Mock axios

describe('DataModel', () => {
  let dataModel: DataModel;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DataModel],
    }).compile();

    dataModel = module.get<DataModel>(DataModel);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(dataModel).toBeDefined();
  });

  it('should fetch the Bitcoin price successfully', async () => {
    const mockPrice = 50000; // Mocked Bitcoin price
    axios.get = jest.fn().mockResolvedValue({ data: { bitcoin: { usd: mockPrice } } });

    const price = await dataModel.fetchBitcoinPrice();
    expect(price).toBe(mockPrice);
    expect(axios.get).toHaveBeenCalledWith(COINGECKO_URL.BITCOIN_URL);
  });

  it('should return the last Bitcoin price if fetching fails', async () => {
    const mockLastPrice = 45000;
    dataModel['lastBitcoinPrice'] = mockLastPrice; // Set the last known price
    axios.get = jest.fn().mockRejectedValue(new Error('API error'));

    const price = await dataModel.fetchBitcoinPrice();
    expect(price).toBe(mockLastPrice); // Should return the last price since the fetch failed
    expect(axios.get).toHaveBeenCalledWith(COINGECKO_URL.BITCOIN_URL);
  });

  it('should return 0 if there is no last known price and fetch fails', async () => {
    axios.get = jest.fn().mockRejectedValue(new Error('API error'));

    const price = await dataModel.fetchBitcoinPrice();
    expect(price).toBe(0); // Should return 0 since the fetch failed and there's no last known price
  });
});
