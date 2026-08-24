import cron from 'node-cron';

/**
 * Schedule a cron job
 * @description This function schedules a cron job using the node-cron library.
 * It takes a cron time string and a callback function as parameters.
 * The cron time string should be in the format accepted by node-cron.
 * The callback function will be executed when the cron job is triggered.
 * 
 * @param {*} cronTime 
 * @param {*} callback 
 * @returns 
 */
export function scheduleCronJob(cronTime, callback) {
    return cron.schedule(cronTime, callback);
}