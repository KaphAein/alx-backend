#!/usr/bin/yarn dev
import { createClient } from 'redis';

// Create a Redis client
const client = createClient();

// Event handler for successful connection
client.on('connect', () => {
  console.log('Redis client connected to the server');
});

// Event handler for errors
client.on('error', (err) => {
  console.log('Redis client not connected to the server:', err.toString());
});

// Subscribe to the "holberton school channel"
client.subscribe('holberton school channel');

// Listen for messages on the subscribed channel
client.on('message', (channel, message) => {
  console.log(message);

  // If the message is "KILL_SERVER", unsubscribe and quit
  if (message === 'KILL_SERVER') {
    client.unsubscribe();
    client.quit();
  }
});
