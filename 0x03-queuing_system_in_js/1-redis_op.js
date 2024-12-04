import { createClient, print } from 'redis';

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

// Function to set a new school
function setNewSchool(schoolName, value) {
  client.set(schoolName, value, print); // Use redis.print to log the confirmation
}

// Function to display the value of a school
function displaySchoolValue(schoolName) {
  client.get(schoolName, (err, reply) => {
    if (err) {
      console.error(`Error retrieving value: ${err.message}`);
    } else {
      console.log(reply);
    }
  });
}

// Call the functions as specified
displaySchoolValue('Holberton');
setNewSchool('HolbertonSanFrancisco', '100');
displaySchoolValue('HolbertonSanFrancisco');
