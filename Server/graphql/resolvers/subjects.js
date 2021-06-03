const Subject = require('../../models/Subject');
const checkAuth = require("../../utils/check-auth")
module.exports = {
    Query: {
        async getSubjects(_, args, context){
            const user = checkAuth(context);
            try {
                const subjects = await Subject.find();
                return subjects;
            } catch (err) {
                throw new Error(err);
            }
        },
        async getSubject(parent, {subjectId}, context, info){
            try{
                const subject = await Subject.findById(subjectId);
                if(subject){
                    return subject;
                }
                else{
                    throw new Error("Subject not found");
                }
            } catch (err){
                throw new Error(err);
            }
        }
    },
    Mutation: {
        async createSubject(parent, args, context, info){
            //Validate data
            if(args.name==="" || args.color===""){
                throw new Error("All fields are required");
            }
            //Save
            const newSubject = new Subject({
                name: args.name,
                color: args.color,
                active: true,
                createdAt: new Date().toISOString()
            });
            const response = await newSubject.save();
            return{
                ...response._doc,
                id: response._id
            }
        },
    }
}