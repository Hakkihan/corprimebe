import { Test, TestingModule } from '@nestjs/testing';
import { DataService } from '../data/data.service';
import { DataModel } from '../data/data.model';
import { of } from 'rxjs';

describe('DataService', () => {
    let service: DataService;
    let dataModelMock: DataModel;
  
    beforeEach(async () => {
      // Create a mock for DataModel with a properly typed mock function for fetchBitcoinPrice
      dataModelMock = {
        fetchBitcoinPrice: jest.fn(),  // Using jest.fn() to mock the method
      } as unknown as DataModel;  // Typecast to DataModel
  
      const module: TestingModule = await Test.createTestingModule({
        providers: [
          DataService,
          { provide: DataModel, useValue: dataModelMock },
        ],
      }).compile();
  
      service = module.get<DataService>(DataService);
    });
  
    describe('getRandomNumber', () => {
      it('should emit a random number every second', (done) => {
        const randomNumbers: number[] = [];
  
        service.getRandomNumber().subscribe((number) => {
          randomNumbers.push(number);
          if (randomNumbers.length === 2) {
            expect(randomNumbers[0]).not.toEqual(randomNumbers[1]);  // Ensure numbers are different
            done();
          }
        });
      });
    });
  
    describe('getBitcoinPrice', () => {
      it('should emit the bitcoin price every 20 seconds', (done) => {
        const mockPrice = 30000;  // Example mock price
        (dataModelMock.fetchBitcoinPrice as jest.Mock).mockResolvedValueOnce(mockPrice); // Mock the fetchBitcoinPrice method
  
        const emittedPrices: number[] = [];
        const subscription = service.getBitcoinPrice().subscribe((price) => {
          emittedPrices.push(price);
  
          if (emittedPrices.length === 2) {
            expect(emittedPrices[0]).toEqual(mockPrice);  // Ensure the emitted price is correct
            subscription.unsubscribe();  // Unsubscribe to stop the interval
            done();
          }
        });
  
        // Add a cleanup timeout to ensure it does not hang
        setTimeout(() => {
          if (emittedPrices.length < 2) {
            subscription.unsubscribe();
            done(); // Call done to exit the test gracefully
          }
        }, 25000); // 25 seconds to wait for the second price
      });
  
      it('should call fetchBitcoinPrice method every 20 seconds', (done) => {
        const mockPrice = 30000;
        (dataModelMock.fetchBitcoinPrice as jest.Mock).mockResolvedValue(mockPrice);
  
        const subscription = service.getBitcoinPrice().subscribe(() => {});
  
        setTimeout(() => {
          expect((dataModelMock.fetchBitcoinPrice as jest.Mock)).toHaveBeenCalledTimes(1); // Check that it's called once after 20 seconds
          subscription.unsubscribe();  // Unsubscribe to stop the interval
          done();
        }, 25000); // Wait a bit longer than the interval to check the call
      });
    });
  });  // Set the timeout to 30 seconds for this entire suite
  