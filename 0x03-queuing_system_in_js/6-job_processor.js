#!/usr/bin/yarn dev
import { createQueue } from 'kue';

// Create a queue to manage the push notifications
const queue = createQueue();

// Function to send notification
const sendNotification = (phoneNumber, message) => {
  console.log(`Sending notification to ${phoneNumber} with message: ${message}`);
};

// Process the jobs in the queue
queue.process('push_notification_code', (job, done) => {
  try {
    // Send the notification using job data
    sendNotification(job.data.phoneNumber, job.data.message);
    
    // Mark job as done
    done();
  } catch (error) {
    // In case of an error, log and fail the job
    console.error('Error processing job:', error);
    done(error);
  }
});
