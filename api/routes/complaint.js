import express from 'express';
import { addComplaint, getMyComplaints ,getAllComplaints} from '../controllers/user.complaintconroller.js';
const router = express.Router();

router.post('/addcomplaint', addComplaint);
router.post('/getmycomplaints', getMyComplaints);
router.get('/getAllComplaints',getAllComplaints)
export default router;