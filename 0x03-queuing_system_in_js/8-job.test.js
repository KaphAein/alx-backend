#!/usr/bin/yarn dev
import { expect } from 'chai';
import { createQueue } from 'kue';
import { createPushNotificationsJobs } from './8-job'; // Adjust path as needed

describe('createPushNotificationsJobs', () => {
  let queue;

  beforeEach(() => {
    // Create a queue and enable test mode (no job processing)
    queue = createQueue();
    queue.testMode = true;
  });

  afterEach(() => {
    // Clear the queue and disable test mode after each test
    queue.testMode = false;
    queue.shutdown();
  });

  it('should throw an error if jobs is not an array', () => {
    // Test case where jobs is not an array
    expect(() => createPushNotificationsJobs('not an array', queue)).to.throw('Jobs is not an array');
  });

  it('should create jobs in the queue when valid jobs are passed', () => {
    // Valid jobs array
    const jobs = [
      { phoneNumber: '4153518780', message: 'This is the code 1234 to verify your account' },
      { phoneNumber: '4153518781', message: 'This is the code 4562 to verify your account' },
    ];

    // Call the function to create jobs
    createPushNotificationsJobs(jobs, queue);

    // Validate that jobs are added to the queue
    expect(queue.testMode.jobs).to.have.lengthOf(2);
    expect(queue.testMode.jobs[0].data.phoneNumber).to.equal('4153518780');
    expect(queue.testMode.jobs[1].data.phoneNumber).to.equal('4153518781');
  });

  it('should log job creation, completion, failure, and progress', (done) => {
    // Create a new job
    const jobs = [
      { phoneNumber: '4153518743', message: 'This is the code 4321 to verify your account' },
    ];

    // Use spy to monitor console logs
    const consoleSpy = sinon.spy(console, 'log');

    createPushNotificationsJobs(jobs, queue);

    // Use setTimeout to give time for the job to be processed
    setTimeout(() => {
      // Validate the console log outputs
      expect(consoleSpy.calledWith('Notification job created: 1')).to.be.true;
      expect(consoleSpy.calledWith('Notification job 1 0% complete')).to.be.true;

      // Simulate job completion and check logs
      queue.testMode.jobs[0].emit('complete');
      expect(consoleSpy.calledWith('Notification job 1 completed')).to.be.true;

      // Simulate job failure for the blacklisted number and check logs
      queue.testMode.jobs[0].emit('failed', new Error('Phone number 4153518780 is blacklisted'));
      expect(consoleSpy.calledWith('Notification job 1 failed: Phone number 4153518780 is blacklisted')).to.be.true;

      // Restore the original console.log
      consoleSpy.restore();
      done();
    }, 100);
  });
});
