import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';

@Injectable()
export class HeartbeatService {
    private heartbeatIntervals = new Map<string, NodeJS.Timeout>();
    private clientData = new Map<string, { lastPong: number }>();

    startHeartbeat(client: Socket, timeout = 10000, interval = 1000): void {
        // Initialize client-specific data
        this.clientData.set(client.id, { lastPong: Date.now() });
        console.log('Initial lastPong:', this.clientData.get(client.id)?.lastPong);

        const intervalId = setInterval(() => {
            const clientInfo = this.clientData.get(client.id);
            if (!clientInfo) return; // Client data might have been removed on disconnect

            if (Date.now() - clientInfo.lastPong > timeout) {
                console.log(`Client ${client.id} timed out`);
                client.disconnect();
                this.stopHeartbeat(client);
            } else {
                client.emit('ping', 'ping'); // Send ping to client
            }
        }, interval);

        this.heartbeatIntervals.set(client.id, intervalId);

        client.on('disconnect', () => this.stopHeartbeat(client)); // Clean up on disconnect
    }

    updateHeartbeat(client: Socket): void {
        const clientInfo = this.clientData.get(client.id);
        if (clientInfo) {
            clientInfo.lastPong = Date.now();
            console.log(`Heartbeat updated for client ${client.id} at ${clientInfo.lastPong}`);
        } else {
            console.warn(`No heartbeat data found for client ${client.id}`);
        }
    }

    stopHeartbeat(client: Socket): void {
        const intervalId = this.heartbeatIntervals.get(client.id);
        if (intervalId) {
            clearInterval(intervalId);
            this.heartbeatIntervals.delete(client.id);
        }
        this.clientData.delete(client.id); // Clean up client data
    }
}

