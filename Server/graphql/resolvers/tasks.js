const Task = require("../../models/Task");
const checkAuth = require("../../utils/check-auth");

module.exports = {
  Query: {
    async getTasks(parent, args, context) {
      const user = checkAuth(context);
      try {
        const tasks = await Task.find();
        return tasks;
      } catch (err) {
        throw new Error(err);
      }
    },
    async getTask(parent, { id }, context, info) {
      const user = checkAuth(context);
      try {
        const task = await Task.findById(id);
        if (task) {
          return task;
        } else {
          throw new Error("Task not found");
        }
      } catch (err) {
        throw new Error(err);
      }
    },
  },
  Mutation: {
    async createTask(
      parent,
      { subjectId, assignment, description, deadline },
      context,
      info
    ) {
      //Validate data
      if (assignment === "" || description === "") {
        throw new Error("All fields are required");
      }
      //Save
      const newTask = new Task({
        assignment: assignment,
        description: description,
        deadline: deadline,
        active: true,
        subject: subjectId,
      });
      const response = await newTask.save();
      return {
        ...response._doc,
        id: response._id,
      };
    },
  },
};
