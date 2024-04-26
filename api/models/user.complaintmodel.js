import mongoose from 'mongoose';
const ComplaintSchema=mongoose.Schema({
// "uuid":{
//     type:String,
//     required:true,
// },
title: {
    type: String,
    //required: true,
},
complaint:{
    type:String,
    required:true,
},
complaint_proof:{
    type:String,
},
issue_category:{
    type:String,
    required:true,
},
complaint_id:{
    type:String,
    required:true,
    unique:true
},
status:{
    type:String,
    required:true,
    default:"Complaint Registered"
}
})
const Complaint=mongoose.model("Complaint",ComplaintSchema);
export default Complaint;