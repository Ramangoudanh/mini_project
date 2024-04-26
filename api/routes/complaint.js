import express from 'express';
import { addComplaint, getMyComplaints, getAllComplaints, getComplaints, updateComplaintStatus, getComplaintCategories } from '../controllers/user.complaintconroller.js';

const router = express.Router();

router.post('/addcomplaint', addComplaint);
router.post('/getmycomplaints', getMyComplaints);
router.get('/getAllComplaints', getAllComplaints);
router.get('/getComplaints', getComplaints);
router.get('/getComplaintCategories', getComplaintCategories); // New route to fetch complaint categories
router.put('/updateComplaintStatus/:id', updateComplaintStatus);

export default router;

