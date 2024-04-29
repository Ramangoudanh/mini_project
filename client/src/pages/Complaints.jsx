import { useSelector } from 'react-redux';
import React, { useState, useRef,useEffect } from "react";
import {
    getDownloadURL,
    getStorage,
    ref,
    uploadBytesResumable,
  } from 'firebase/storage';
  import { app } from '../firebase';
  import { Box } from "@mui/material";
  import ComplaintsPieChart from '../components/Chart';
  import BarChart from '../components/barChart';
  import ProChart from '../components/proChart';
  import { Card, CardContent, Typography } from '@mui/material';
export default function EmailForm() {

  const [senderEmail, setSenderEmail] = useState('');
  const [receiverEmail, setReceiverEmail] = useState('');
  const [title, setTitle] = useState('');
  const [complaint, setComplaint] = useState('');
  const [category, setCategory] = useState('');
  const { currentUser } = useSelector((state) => state.user);
  const fileRef = useRef(null);
  const [image, setImage] = useState(null);
  const [link,setLink] =useState('www.google.com');

  useEffect(() => {
    if (image) {
      handleFileUpload(image);
    }
    console.log(currentUser)
  }, [image]);
  const handleFileUpload = async (image) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + image.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, image);
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        
      },
      (error) => {
        
      },
      (snapshot) => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setLink(downloadURL)
        );
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Here you can handle form submission, for example, sending the data to an API
    
    const formData = {
     uuid: currentUser.uuid,
      senderEmail,
      complaint,
      title,
      complaint_proof:link,
      issue_category:category
  };

  try {
      const response = await fetch("https://mini-project-fo4m.onrender.com/api/complaint/addcomplaint", {
          method: "POST",
          headers: {
              "Content-Type": "application/json"
          },
          body: JSON.stringify(formData)
      });

      if (!response.ok) {
          throw new Error("Failed to submit complaint.");
      }

      console.log("Complaint submitted successfully!");
      // You might want to do something after a successful submission, like showing a success message to the user.
  } catch (error) {
      console.error("Error submitting complaint:", error.message);
      // Handle the error, perhaps show an error message to the user.
  }

    console.log({
      senderEmail,
      receiverEmail,
      title,
      complaint,
      category
    });
  };

 

const isAdmin = currentUser.username === 'ramangoudanh'; 

return (
  <div>
    {isAdmin ? (
      <div>
 <div className="flex">
 <div className="w-1/2 h-1/2rounded-lg  mt-8 shadow-md">
   <Card variant="outlined" style={{ marginBottom: '20px' }}>
     <CardContent>
       <Typography variant="h6" gutterBottom>
         Complaints Pie Chart
       </Typography>
       <div style={{ height: '40vh' }}>
       <BarChart /> 
       </div>
     </CardContent>
   </Card>
 </div>
 <div className="w-1/2 h-1/2rounded-lg ml-3 mt-8 shadow-md">
   <Card variant="outlined">
     <CardContent>
       <Typography variant="h6" gutterBottom>
         Bar Chart
       </Typography>
       <div style={{ height: '40vh', width: '100%' }}>
       <ProChart />
       </div>
     </CardContent>
   </Card>
 </div>
</div>

<div className="w-auto h-1/2  mt-8 p-6 bg-white rounded-lg shadow-md">
 <Typography variant="h6" gutterBottom>
   My Responsive Pie Chart
 </Typography>
 <div style={{ height: '40vh', width: '100%' }}>
 <ComplaintsPieChart />
 </div>
</div>
</div>
    ) : (
      <div className="max-w-md mt-5 mx-auto bg-blue-100 shadow-md rounded-lg overflow-hidden">
      <div className="p-6">
        <h2 className="text-2xl font-semibold mb-4">Compose Email</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="title"
              id="title"
              className="w-full border rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
              placeholder="Enter title of complaint"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="complaint" className="block text-sm font-medium text-gray-700 mb-1">Complaint</label>
            <textarea
              id="complaint"
              className="w-full border rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
              rows="4"
              placeholder="Enter your complaint"
              value={complaint}
              onChange={(e) => setComplaint(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              id="category"
              className="w-full border rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="">Select a category</option>
              <option value="Technical">Technical</option>
              <option value="Customer Service">Customer Service</option>
              <option value="Billing">Billing</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <input
              type='file'
              ref={fileRef}
              accept='image/*'
              onChange={(e) => setImage(e.target.files[0])}
            />
          </div>
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600">Send Email</button>
        </form>
      </div>
    </div>
    )}
  </div>
);
}