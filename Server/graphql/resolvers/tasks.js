const { each } = require("lodash");
const Task = require("../../models/Task");
const checkAuth = require("../../utils/check-auth");
// import dateFormat from "dateformat";
var format = require("date-format");
import { setDaysMonthsNameToSpanish } from "../../utils/dates/dateFormat-names";


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

    async getMyCurrentTasks(_, args, context) {
      const user = checkAuth(context);
      try {
        const tasks = await Task.find({
          user: user.id,
          subject: args.subjectId,
        });
        let tasksAux = tasks;
        let tasksAux2 = tasks.ToJSON();
        tasksAux2.map((task) => {
          console.log(format("hh:mm:ss.SSS", task.deadline));
          task.deadline = "gfofjsedijosen" 
          return task;
        });
        // each(tasksAux, function(task) {
        //   console.log(format("hh:mm:ss.SSS", task.deadline));
        //   task = {
        //     ...task,
        //   }
        //   task.deadline = format("hh:mm:ss.SSS", task.deadline) 
        //   return task;
        // });
        tasksAux2[0].deadline = "fsenuiofs";
        return tasksAux;
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
