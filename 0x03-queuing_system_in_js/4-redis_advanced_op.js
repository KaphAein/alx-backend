#!/usr/bin/yarn dev
import { createClient, print } from 'redis';

const client = createClient();

// Event: Successful connection
client.on('connect', () => {
  console.log('Redis client connected to the server');
});

// Event: Connection error
client.on('error', (err) => {
  console.log(`Redis client not connected to the server: ${err.message}`);
});

// Function to create the hash
const createHash = () => {
  client.hset('HolbertonSchools', 'Portland', 50, print);
  client.hset('HolbertonSchools', 'Seattle', 80, print);
  client.hset('HolbertonSchools', 'New York', 20, print);
  client.hset('HolbertonSchools', 'Bogota', 20, print);
  client.hset('HolbertonSchools', 'Cali', 40, print);
  client.hset('HolbertonSchools', 'Paris', 2, print);
};

// Function to display the hash
const displayHash = () => {
  client.hgetall('HolbertonSchools', (err, result) => {
    if (err) {
      console.error(`Error fetching hash: ${err.message}`);
    } else {
      console.log(result);
    }
  });
};

// Execute the operations
client.on('connect', () => {
  createHash();
  displayHash();
});
