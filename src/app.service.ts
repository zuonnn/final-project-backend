import { Injectable, OnModuleInit } from '@nestjs/common';
import mongoose from 'mongoose';
import * as os from 'os';

@Injectable()
export class AppService implements OnModuleInit {
    private readonly _SECONDS = 5000;
    private readonly CONNECTIONS_PER_CORES = 5;

    onModuleInit() {
        // this.checkOverload();
    }

    checkOverload() {
        setInterval(() => {
            const numConnections = mongoose.connections.length;
            const numCores = os.cpus().length;
            const memoryUsage = process.memoryUsage().rss;
            const maxConnections = numCores * this.CONNECTIONS_PER_CORES * 80 / 100;

            console.log(`Memory usage: ${memoryUsage / 1024 / 1024} MB`);
            console.log(`Active connections: ${numConnections}`);

            if (numConnections > maxConnections ) {
                console.log(`Connection overload detected`);
            }
        }, this._SECONDS); // Check every 5 seconds
    }
}
