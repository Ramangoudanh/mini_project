import express from 'express';
import { addComplaint, getMyComplaints ,getAllComplaints,getComplaints} from '../controllers/user.complaintconroller.js';
const router = express.Router();

router.post('/addcomplaint', addComplaint);
router.post('/getmycomplaints', getMyComplaints);
router.get('/getAllComplaints',getAllComplaints);
router.get('/getComplaints',getMyComplaints);
export default router;