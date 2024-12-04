#!/usr/bin/yarn dev
import { createQueue } from 'kue';

// Initialize the queue
const queue = createQueue();

// Job data to be added to the queue
const jobData = {
  phoneNumber: '07045679939',
  message: 'Account registered',
};

// Create and configure the job
const job = queue
  .create('push_notification_code', jobData)
  .on('enqueue', () => console.log(`Notification job created: ${job.id}`))
  .on('complete', () => console.log('Notification job completed'))
  .on('failed', (errorMessage) => console.log(`Notification job failed: ${errorMessage}`));

// Save the job to the queue
job.save((err) => {
  if (err) {
    console.error('Error saving job:', err);
  }
});
