const { sendMail } = require("../email/email-sender");
const { getTasksToRemind } = require("../task/task-service");
const { getUserTaskOwner } = require("../user/user-service");
var format = require("date-format");

async function remindOfPendingTasks() {
  // To send an email uncomment next section
  const tasks = await getTasksToRemind();
  for(const task of tasks) {
    const formattedDate = format("dd-MM-yyyy hh:mm", new Date(task.deadline));
    const userOwner = await getUserTaskOwner(task.user);
    await sendMail(userOwner.email, "test", {
      taskName: task.assignment,
      userName: userOwner.name + " " + userOwner.lastName,
      deadline: formattedDate,
      clientOrigin: process.env.CLIENT_ORIGIN,
      urlViewRequest: "www.google.com"
    });
    task.active = false;
    await task.save();
  }
  console.log("Sistema de recordatorio funcionando!");
}

module.exports = { remindOfPendingTasks };