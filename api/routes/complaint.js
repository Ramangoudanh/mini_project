import express from 'express';
import { 
  addComplaint, 
  getMyComplaints, 
  getAllComplaints, 
  getComplaints, 
  updateComplaintStatus, 
  getAllIssueCategories, 
  getComplaintCategories, 
  getComplaintsByCategory, 
  getComplaintStatusData, 
  getComplaintsByStatus, 
  getComplaintsBySpecificCategory, 
  updateCurStatus // Import the new controller function
} from '../controllers/user.complaintconroller.js'; // Corrected typo in filename

const router = express.Router();

router.post('/addcomplaint', addComplaint);
router.post('/getmycomplaints', getMyComplaints);
router.get('/getAllComplaints', getAllComplaints);
router.get('/getComplaints', getComplaints);
router.get('/getComplaintCategories', getComplaintCategories);
router.get('/getComplaintStatusData', getComplaintStatusData); // Route to fetch complaint status data
router.put('/updateComplaintStatus/:id', updateComplaintStatus);
router.get('/getComplaintsByCategory', getComplaintsByCategory);
router.get('/getAllIssueCategories', getAllIssueCategories);
router.get('/getComplaintsByStatus', getComplaintsByStatus);
router.post('/getComplaintsBySpecificCategory', getComplaintsBySpecificCategory);
router.post('/updateCurStatus', updateCurStatus); // New route to update curStatus

export default router;


