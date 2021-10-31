const schedule = require("node-schedule");
const { remindOfPendingTasks } = require("../../services/reminder/reminder-service");

async function taskReminder() {
  schedule.scheduleJob(
    process.env.REMINDER_INTERVAL || "0/5 * * * *", 
    async () => {
    try {
      await remindOfPendingTasks();
    } catch (error) {
      console.log(error);
    }
  });
}

module.exports = { taskReminder };