#!/usr/bin/yarn dev
import { createQueue } from 'kue';

// Function to create push notification jobs
const createPushNotificationsJobs = (jobs, queue) => {
  // Check if the jobs argument is an array
  if (!Array.isArray(jobs)) {
    throw new Error('Jobs is not an array');
  }

  // Loop through the jobs array to create jobs in the queue
  jobs.forEach((jobData) => {
    const job = queue.create('push_notification_code_3', jobData)
      .on('enqueue', () => {
        console.log(`Notification job created: ${job.id}`);
      })
      .on('complete', () => {
        console.log(`Notification job ${job.id} completed`);
      })
      .on('failed', (err) => {
        console.log(`Notification job ${job.id} failed: ${err.message}`);
      })
      .on('progress', (progress) => {
        console.log(`Notification job ${job.id} ${progress}% complete`);
      });

    // Save the job to the queue
    job.save();
  });
};
