import express from 'express';
import { addComplaint, getMyComplaints } from '../controllers/user.complaintconroller.js';
const router = express.Router();

router.post('/addcomplaint', addComplaint);
router.post('/getmycomplaints', getMyComplaints);
export default router;