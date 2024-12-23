import { Injectable } from '@nestjs/common';
import { interval, map, Observable, Observer, of } from 'rxjs';
import { DataModel } from './data.model';

@Injectable()
export class DataService {
  
  constructor(private readonly dataModel: DataModel) {}

  getRandomNumber(): Observable<number> {
    return interval(1000).pipe(
      map(() => Math.floor(Math.random() * 100)) // Generates a random number between 0 and 99
    );
  }

  getBitcoinPrice(): Observable<number> {
    return new Observable<number>((observer: Observer<number>) => {
      const priceEmitter = setInterval(async () => {
        const price = await this.dataModel.fetchBitcoinPrice();  // Use model to fetch price using coinGecko
        observer.next(price);
      }, 20000); // Emit Bitcoin price every 20 seconds

      // Cleanup on unsubscribe
      return () => clearInterval(priceEmitter);
    });
  }
}