const Task = require("../../models/Task");

Date.prototype.addHours = function(h) {
  this.setHours(this.getHours() + h);
  return this;
}

async function getTasksToRemind() {
  const now = new Date();
  const nowPlusHour = new Date().addHours(24);
  const tasksToRemind = await Task.find({
    $and: [
      { deadline: { $gte: now } },
      { deadline: { $lte: nowPlusHour } },
      { active: true }
    ]
  });
  console.log(tasksToRemind);
  return tasksToRemind;
}

module.exports = { getTasksToRemind }