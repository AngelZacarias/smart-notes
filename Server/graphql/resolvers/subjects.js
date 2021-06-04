const { Query } = require('mongoose');
const Subject = require('../../models/Subject');

module.exports = {
    Query: {
        async getSubjects(){
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
        async updateSubject(parent, args, context, info){
            //Validate data
            if(args.name==="" || args.color===""){
                throw new Error("All fields are required");
            }
            //Update Data
            const response = await Subject.findByIdAndUpdate(
                args.id,
                {
                    name: args.name,
                    color: args.color,
                    createdAt: new Date(),
                },
                {new: true},
            );
            return{
                ...response._doc,
                id: response._id
            }
        }
    },
    //Resolvers for nested queries
    Task: {
        async subject(parent, args, context, info){
            return await Subject.findById(parent.subject);
        }
    }
}
