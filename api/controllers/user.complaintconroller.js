import Complaint from '../models/user.complaintmodel.js';
import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import contactEmail from '../nodemailersetup.js';
import axios from 'axios';
export const addComplaint=async(req,res)=>{
    const {uuid,complaint,complaint_proof,issue_category,title}=req.body;
    try{
    let mycomplaint=Complaint()
    let user=await User.findOne({uuid})
    let non_hashed_complaint_id=uuid+uuidv4()
    const saltrounds=10;
    //first generate salt
    let salt=await bcrypt.genSalt(saltrounds);
    let complaint_id=await bcrypt.hash(non_hashed_complaint_id,salt);
    user.previous_complaints.push(non_hashed_complaint_id);
    await user.save();
   // mycomplaint.uuid=uuid;
    let complaint_to_be_added=complaint;
    if(complaint.length>100){
        try {
            let response = await axios.post('http://127.0.0.1:5000/getSummary', {
                message: complaint
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
    
            let data = response.data;
         //   complaint = data.summary;
            complaint_to_be_added=data.summary;
        } catch (e) {
            console.log("Error:", e);
        }
    }
    mycomplaint.complaint=complaint_to_be_added;
    mycomplaint.complaint_proof=complaint_proof;
    mycomplaint.issue_category=issue_category;
    mycomplaint.complaint_id=complaint_id;
    mycomplaint.title=title;

    await mycomplaint.save();
    //send the email now
    const mail = {
        from: "ComplaintBox",
        to: "msanjay1907@gmail.com",
        subject: `Complaint Reagarding ${issue_category}`,
        html: `
            <p>Complaint: ${complaint_to_be_added}</p>
            <p>Proof:${complaint_proof}</p>
            `,
    };
  await contactEmail.sendMail(mail, (error) => {
    if (error) {
      res.json(error);
    } else {
    res.status(201).json({"message":non_hashed_complaint_id})
    }
  });
    
    }catch(e){
        console.log(e);
        res.status(400).json({"message":"something went wrong"})
    }
}
export const getMyComplaints= async(req,res)=>{
    const {uuid}=req.body;
    let user=await User.findOne({uuid})
    let complaints=user.previous_complaints;
    let newlist=[]
    let complaint=await Complaint.find({});
    console.log(complaint,complaints);
    for(let i =0;i<complaints.length;i++){
        for(let j=0;j<complaint.length;j++){
            let result=await bcrypt.compare(complaints[i],complaint[j].complaint_id);
            
            if(result){
                let comp={'complaint_id':complaints[i],'complaint':complaint[j].complaint,'title':complaint[j].title,'complaint_proof':complaint[j].complaint_proof,'issue_category':complaint[j].issue_category,'status':complaint[j].status}
                newlist.push(comp);
            }
        }
    }
    console.log({"the complaint list of a user":newlist})
    res.status(201).json({"the complaint list of a user":newlist})
}

export const getComplaints = async (req, res) => {
    try {
        const allComplaints = await Complaint.find({});
       console.log(allComplaints);
        res.status(200).json(allComplaints);
    } catch (error) {
        console.error('Error fetching complaints:', error);
        res.status(500).json({ error: 'An error occurred while fetching complaints' });
    }
};
function generateColors(count) {
    const colors = [];
    const hueIncrement = 360 / count;
    let hue = 0;
    for (let i = 0; i < count; i++) {
        const color = `hsl(${hue}, 70%, 50%)`;
        colors.push(color);
        hue += hueIncrement;
    }
    return colors;
}


export const getAllComplaints = async (req, res) => {
    try {
        // Fetch all complaints
        const allComplaints = await Complaint.find({});

        // Count the number of complaints per issue category
        const counts = {};
        allComplaints.forEach(complaint => {
            counts[complaint.issue_category] = (counts[complaint.issue_category] || 0) + 1;
        });

        // Generate different colors for each category
        const colors = generateColors(Object.keys(counts).length);

        // Convert counts object into array of objects
        const responseData = Object.keys(counts).map((key, index) => ({
            id: key, // Use label as id
            label: key,
            value: counts[key],
            color: colors[index], // Assign color
        }));

        // Send the data back to the client
        res.status(200).json(responseData);
    } catch (error) {
        console.error('Error fetching complaints:', error);
        res.status(500).json({ error: 'An error occurred while fetching complaints' });
    }
};


export const updateComplaintStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        // Find the complaint by ID
        const complaint = await Complaint.findById(id);
        if (!complaint) {
            return res.status(404).json({ error: 'Complaint not found' });
        }

        // Update the status
        complaint.status = status;
        complaint.title = complaint.title;
        await complaint.save();

        // Send the updated complaint back to the client
        res.status(200).json({ message: 'Complaint status updated successfully', complaint });
    } catch (error) {
        console.error('Error updating complaint status:', error);
        res.status(500).json({ error: 'An error occurred while updating complaint status' });
    }
};

export const getComplaintCategories = async (req, res) => {
    try {
      // Fetch distinct categories
      const categories = await Complaint.distinct('issue_category');
    
      // Initialize an array to store aggregated data
      const data = [];
  
      // Iterate over each category
      for (const category of categories) {
        // Fetch complaints for the current category
        const complaints = await Complaint.find({ issue_category: category });
        // Count resolved, pending, and closed complaints for the current category
        let resolved = 0;
        let pending = 0;
        let closed = 0;
        for (const complaint of complaints) {
          if (complaint.status === 'Resolved') {
            resolved++;
          } else if (complaint.status === 'Pending') {
            pending++;
          } else if (complaint.status === 'Closed') {
            closed++;
          }
        }
  
        // Generate random colors for demonstration purposes
        const resolveColor = getRandomColor();
        const pendingColor = getRandomColor();
        const closedColor = getRandomColor();
  
        // Add the aggregated data to the result array
        data.push({
          _id: category,
          resolved,
          pending,
          closed,
          resolveColor,
          pendingColor,
          closedColor,
        });
      }
  
      // Send the aggregated data back to the client
      res.status(200).json(data);
    } catch (error) {
      console.error('Error fetching complaint categories:', error);
      res.status(500).json({ error: 'An error occurred while fetching complaint categories' });
    }
  };
  
  // Function to generate a random color
  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };
  
  
// In controllers/user.complaintcontroller.js

export const getComplaintStatusData = async (req, res) => {
    try {
        // Fetch all complaints
        const allComplaints = await Complaint.find({});

        // Count complaints for each status category
        const statusCounts = {};
        allComplaints.forEach(complaint => {
            const status = complaint.status;
            if (statusCounts[status]) {
                statusCounts[status]++;
            } else {
                statusCounts[status] = 1;
            }
        });

        // Define random colors for each status category
        const getRandomColor = () => {
            const colors = ['#800080', '#008000', '#FFA500']; // Purple, Green, Orange
            return colors[Math.floor(Math.random() * colors.length)];
        };

        // Construct the response array of objects
        const statusList = Object.keys(statusCounts).map(status => ({
            id: status,
            label: status,
            value: statusCounts[status],
            color: getRandomColor()
        }));

        res.json(statusList);
    } catch (error) {
        console.error('Error generating complaint status data:', error);
        res.status(500).json({ error: 'An error occurred while generating complaint status data' });
    }
};

export const getComplaintsByCategory = async (req, res) => {
    try {
        // Fetch all complaints
        const allComplaints = await Complaint.find({});

        // Initialize an object to store complaints by category
        const complaintsByCategory = {};

        // Iterate over each complaint
        allComplaints.forEach(complaint => {
            const category = complaint.issue_category;

            // If the category doesn't exist in the object, initialize it with an empty array
            if (!complaintsByCategory[category]) {
                complaintsByCategory[category] = [];
            }

            // Add the complaint to the array corresponding to its category
            complaintsByCategory[category].push(complaint);
        });

        // Send the object array back to the client
        res.status(200).json(complaintsByCategory);
    } catch (error) {
        console.error('Error fetching complaints by category:', error);
        res.status(500).json({ error: 'An error occurred while fetching complaints by category' });
    }
};

export const getAllIssueCategories = async (req, res) => {
    try {
        // Fetch distinct issue categories from the Complaint collection
        const categories = await Complaint.distinct('issue_category');
        
        // Send the array of issue categories back to the client
        res.status(200).json(categories);
    } catch (error) {
        console.error('Error fetching issue categories:', error);
        res.status(500).json({ error: 'An error occurred while fetching issue categories' });
    }
};

export const getComplaintsByStatus = async (req, res) => {
    try {
        // Fetch all complaints
        const allComplaints = await Complaint.find({});

        // Initialize an object to store complaints by category
        const complaintsByStatus = {};

        // Iterate over each complaint
        allComplaints.forEach(complaint => {
            const status = complaint.status;

            // If the category doesn't exist in the object, initialize it with an empty array
            if (!complaintsByStatus[status]) {
                complaintsByStatus[status] = [];
            }

            // Add the complaint to the array corresponding to its category
            complaintsByStatus[status].push(complaint);
        });

        // Send the object array back to the client
        res.status(200).json(complaintsByStatus);
    } catch (error) {
        console.error('Error fetching complaints by category:', error);
        res.status(500).json({ error: 'An error occurred while fetching complaints by category' });
    }
};

  