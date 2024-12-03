import { createClient } from 'redis';

// Create a Redis client
const client = createClient();

// Event: Successful connection
client.on('connect', () => {
  console.log('Redis client connected to the server');
});

// Event: Connection error
client.on('error', (err) => {
  console.log(`Redis client not connected to the server: ${err.message}`);
});

// Attempt to connect to the Redis server
client.connect();
