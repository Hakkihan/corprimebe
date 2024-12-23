<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

# Data WebSocket Gateway

![CircleCI](https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456)

## Overview

This project is a WebSocket-based application built using **NestJS** and **Socket.IO**. It allows clients to subscribe to real-time data streams for random numbers and Bitcoin prices, with updates sent at regular intervals.

### Features:
- **Real-time random number generation**: Clients can subscribe to receive random numbers at regular intervals.
- **Bitcoin price updates**: Clients can subscribe to receive live Bitcoin price data fetched from an external API.
- **WebSocket communication**: The app uses WebSocket to deliver real-time updates to subscribed clients.

### Architecture:
- **Gateway**: Handles WebSocket connections and messages between clients and the backend.
- **Service**: Contains the logic for generating random numbers and fetching Bitcoin price data.
- **Model**: Manages the data and interactions with external APIs or databases.

## Technologies
- **NestJS**: A framework for building scalable and maintainable server-side applications.
- **Socket.IO**: A library for real-time, bidirectional communication between the server and client.
- **RxJS**: Used for reactive programming and managing streams of data.
- **TypeScript**: For strong typing and better development experience.

---

## Installation and Setup

### Prerequisites:
- **Node.js** (version 16 or higher)
- **npm** (Node Package Manager) or **yarn**

### Steps to Run Locally:

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-username/your-repository-name.git
Install Dependencies: Navigate to the project directory and install dependencies:

Simply npm install and then npm run dev should do the trick

subscribeRandomNumber: Client subscribes to the random number stream.
subscribeBitcoinPrice: Client subscribes to the Bitcoin price stream.
unsubscribeRandomNumber: Client unsubscribes from the random number stream.
unsubscribeBitcoinPrice: Client unsubscribes from the Bitcoin price stream.
Notes
Error Handling: In case of errors (e.g., network issues), the server will log messages and continue providing the last known data.
Scalability: This architecture can be scaled horizontally to handle more clients by using Redis or other message brokers for Pub/Sub functionality.
