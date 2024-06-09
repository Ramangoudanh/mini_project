import mongoose from 'mongoose';

const ComplaintSchema = new mongoose.Schema({
  // "uuid":{
  //     type:String,
  //     required:true,
  // },
  title: {
    type: String,
    // required: true,
  },
  complaint: {
    type: String,
    required: true,
  },
  complaint_proof: {
    type: String,
  },
  issue_category: {
    type: String,
    required: true,
  },
  complaint_id: {
    type: String,
    required: true,
    unique: true,
  },
  status: {
    type: String,
    required: true,
    default: "Complaint Registered",
  },
  statusProof:{
    type:String,
    required:true,
    default:"www.google.com"
  },
  curStatus: {
    type: String,
    required: true,
    default: "Complaint taken",
  },
  lastupdate: {
    type: Date,
    default: Date.now,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const Complaint = mongoose.model("Complaint", ComplaintSchema);
export default Complaint;
