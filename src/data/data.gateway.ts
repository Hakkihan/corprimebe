import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Inject } from '@nestjs/common';
import { DataService } from './data.service';
import { Subscription } from 'rxjs';
import { SOCKET_EVENTS } from '../constants';  // Import the constants

@WebSocketGateway({
  namespace: '/data',
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
  },
  transports: ['websocket'],
  pingInterval: 20000,
  pingTimeout: 5000,
})
export class DataGateway {
  @WebSocketServer()
  server: Server;

  private randomNumberSubscription: Subscription;
  private bitcoinPriceSubscription: Subscription;

  constructor(
    @Inject(DataService) private dataService: DataService,
  ) {
  }

  handleConnection(client: Socket): void {
    console.log('Client connected:', client.id);
    client.emit('message', 'Welcome to the data WebSocket gateway!');
    client.on(SOCKET_EVENTS.SUBSCRIBE_RANDOM_NUMBER, () => {
      console.log('subscribeRandomNumber event received');
    });
    client.on(SOCKET_EVENTS.SUBSCRIBE_BITCOIN_PRICE, () => {
      console.log('subscribeRandomNumber event received');
    });
  }

  handleDisconnect(client: Socket): void {
    console.log('Client disconnected:', client.id);
    this.unsubscribeFromRandomNumber(client);
    this.unsubscribeFromBitcoinPrice(client);
  }

  onModuleDestroy(client: Socket): void {
    console.log('Cleaning up resources...');
    this.unsubscribeFromRandomNumber(client);
    this.unsubscribeFromBitcoinPrice(client);
  }

  @SubscribeMessage(SOCKET_EVENTS.SUBSCRIBE_RANDOM_NUMBER)
  handleSubscribeToRandomNumber(client: Socket): void {
    console.log('Client subscribed to random numbers:', client.id);

    this.randomNumberSubscription = this.dataService
      .getRandomNumber()
      .subscribe((randomNumber) => {
        client.emit('randomNumber', randomNumber);
      });
  }

  @SubscribeMessage(SOCKET_EVENTS.SUBSCRIBE_BITCOIN_PRICE)
  handleSubscribeToBitcoinPrice(client: Socket): void {
    console.log('Client subscribed to Bitcoin price:', client.id);

    // Subscribe to the Bitcoin price stream
    this.bitcoinPriceSubscription = this.dataService
      .getBitcoinPrice()
      .subscribe((price) => {
        client.emit('bitcoinPrice', price);
      });
  }

  @SubscribeMessage(SOCKET_EVENTS.UNSUBSCRIBE_RANDOM_NUMBER)
  unsubscribeFromRandomNumber(client: Socket): void {
    console.log('Client unsubscribed from random numbers:', client.id);
    if (this.randomNumberSubscription) {
      this.randomNumberSubscription.unsubscribe();
    }
  }

  @SubscribeMessage(SOCKET_EVENTS.UNSUBSCRIBE_BITCOIN_PRICE)
  unsubscribeFromBitcoinPrice(client: Socket): void {
    console.log('Client unsubscribed from Bitcoin price:', client.id);
    if (this.bitcoinPriceSubscription) {
      this.bitcoinPriceSubscription.unsubscribe();
    }
  }


}
