import express from 'express';
import { addComplaint, getMyComplaints, getAllComplaints, getComplaints, updateComplaintStatus,getAllIssueCategories, getComplaintCategories,getComplaintsByCategory, getComplaintStatusData } from '../controllers/user.complaintconroller.js';

const router = express.Router();

router.post('/addcomplaint', addComplaint);
router.post('/getmycomplaints', getMyComplaints);
router.get('/getAllComplaints', getAllComplaints);
router.get('/getComplaints', getComplaints);
router.get('/getComplaintCategories', getComplaintCategories);
router.get('/getComplaintStatusData', getComplaintStatusData); // New route to fetch complaint status data
router.put('/updateComplaintStatus/:id', updateComplaintStatus);
router.get('/getComplaintsByCategory', getComplaintsByCategory);
router.get('/getAllIssueCategories', getAllIssueCategories);
export default router;

