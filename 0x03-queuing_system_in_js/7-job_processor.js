#!/usr/bin/yarn dev
import { createQueue } from 'kue';

// Blacklisted phone numbers
const blacklistedNumbers = ['4153518780', '4153518781'];

// Function to send notification
const sendNotification = (phoneNumber, message, job, done) => {
  // Start tracking progress at 0%
  job.progress(0, 100);

  // Check if the phone number is blacklisted
  if (blacklistedNumbers.includes(phoneNumber)) {
    // Fail the job if phone number is blacklisted
    job.failed(new Error(`Phone number ${phoneNumber} is blacklisted`));
    return done(new Error(`Phone number ${phoneNumber} is blacklisted`));
  }

  // Otherwise, track the progress to 50%
  job.progress(50, 100);
  
  // Log the notification being sent
  console.log(`Sending notification to ${phoneNumber}, with message: ${message}`);

  // Simulate some more processing time and mark job as completed
  setTimeout(() => {
    done(); // Mark the job as done (completed)
  }, 1000); // Simulate a small delay before finishing the job
};

// Create the Kue queue
const queue = createQueue();

// Process jobs in the 'push_notification_code_2' queue
queue.process('push_notification_code_2', 2, (job, done) => {
  // Call the sendNotification function for each job
  sendNotification(job.data.phoneNumber, job.data.message, job, done);
});

// Example array of jobs
const jobs = [
  { phoneNumber: '4153518780', message: 'This is the code 1234 to verify your account' },
  { phoneNumber: '4153518781', message: 'This is the code 4562 to verify your account' },
  { phoneNumber: '4153518743', message: 'This is the code 4321 to verify your account' },
  { phoneNumber: '4153538781', message: 'This is the code 4562 to verify your account' },
  { phoneNumber: '4153118782', message: 'This is the code 4321 to verify your account' },
  { phoneNumber: '4153718781', message: 'This is the code 4562 to verify your account' },
  { phoneNumber: '4159518782', message: 'This is the code 4321 to verify your account' },
  { phoneNumber: '4158718781', message: 'This is the code 4562 to verify your account' },
  { phoneNumber: '4153818782', message: 'This is the code 4321 to verify your account' },
  { phoneNumber: '4154318781', message: 'This is the code 4562 to verify your account' },
  { phoneNumber: '4151218782', message: 'This is the code 4321 to verify your account' }
];

// Create jobs and add them to the queue
jobs.forEach((jobData) => {
  const job = queue.create('push_notification_code_2', jobData)
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

  job.save();
});
