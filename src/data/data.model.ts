import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { COINGECKO_URL } from 'src/constants';

@Injectable()
export class DataModel {

  private lastBitcoinPrice: number;

  // Fetch the latest Bitcoin price in USD  
  async fetchBitcoinPrice(): Promise<number> {
    try {
      const response = await axios.get(COINGECKO_URL.BITCOIN_URL);
      this.lastBitcoinPrice = response.data.bitcoin.usd;
      return this.lastBitcoinPrice;  // Bitcoin price in USD
    } catch (error) {
      console.error('Error fetching Bitcoin price:', error);
      return this.lastBitcoinPrice || 0;  // Return last price in case of an error
    }
  }
}



