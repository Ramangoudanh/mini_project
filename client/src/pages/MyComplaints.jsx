import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import Categorical from './Catgorical';
import Status from './Status';
import { FiInfo } from 'react-icons/fi'; // Import info icon from react-icons
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../firebase';

export default function MyComplaints() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [complaintList, setComplaintList] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const { currentUser } = useSelector((state) => state.user);
  const isAdmin = currentUser.username === 'ramangoudanh';
  const [selectedFilter, setSelectedFilter] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('');
  const [path, setPath] = useState(window.location.pathname);
  const [newCurStatus, setNewCurStatus] = useState("");
  const fileRef = useRef(null);
  const [image, setImage] = useState(null);
  const [link,setLink] = useState('www.google.com');

  useEffect(() => {
    if (image) {
      handleFileUpload(image);
    }
    console.log(currentUser);
  }, [image]);

  const handleFileUpload = async (image) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + image.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, image);
    uploadTask.on(
      'state_changed',
      (snapshot) => {},
      (error) => {},
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setLink(downloadURL)
        );
      }
    );
  };

  const handleCurStatusChange = (e) => {
    setNewCurStatus(e.target.value);
  };

  const handleCurStatusUpdate = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/complaint/updateCurStatus', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          _id: selectedComplaint._id,
          curStatus: newCurStatus,
        }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to update status');
      }
  
      const updatedComplaint = await response.json();
      // Update the UI or state with the updated complaint if needed
      console.log('Complaint updated successfully:', updatedComplaint);
      closeModal();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };
  
  
  useEffect(() => {
    setPath(window.location.pathname);
    const currentUrl = path;
    const parts = currentUrl.split("/");
    setCategory(parts[parts.length - 1]);
  }, [path]);

  useEffect(() => {
    const fetchData = async () => {
      if (!currentUser) return;

      try {
        let response;

        if (isAdmin) {
      
          console.log(category, status);
          console.log("entered here");
          
          response = await fetch(`http://localhost:3000/api/complaint/getComplaintsBySpecificCategory`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ category }),
          });
        } else {
          console.log("entered here");
          response = await fetch('http://localhost:3000/api/complaint/getmycomplaints', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ uuid: currentUser.uuid }),
          });
          console.log(response);
        }

        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }

        const data = await response.json();
        console.log(data)
        if (isAdmin) {
          let b = []
          for (let i = 0; i < data.length; i++) {
            if (data[i].issue_category === category) {
              b.push(data[i])
            }
          }
          setComplaintList(b);
        } else {
          setComplaintList(data['the complaint list of a user']);
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to fetch data. Please try again later.');
        setLoading(false);
      }
    };

    fetchData();
  }, [currentUser, category, isAdmin]);

  const openModal = (complaint) => {
    setSelectedComplaint(complaint);
  };

  const closeModal = () => {
    setSelectedComplaint(null);
    setNewStatus('');
  };

  const handleStatusChange = (e) => {
    setNewStatus(e.target.value);
  };

  const handleStatusUpdate = async () => {
    try {
      const response = await fetch(`https://mini-project-fo4m.onrender.com/api/complaint/updateComplaintStatus/${selectedComplaint._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update complaint status');
      }

      const data = await response.json();
      console.log('Complaint status updated successfully:', data);
      closeModal(); // Close modal after successful update
    } catch (error) {
      console.error('Error updating complaint status:', error);
    }
  };

  function getStatusColor(status) {
    switch (status) {
      case "Resolved":
        return "bg-green-500";
      case "Pending":
        return "bg-yellow-500";
      case "Complaint Registered":
        return "bg-red-500";
      default:
        return ""; // Return default color class or handle the case where status is not recognized
    }
  }

  const groupedComplaints = complaintList.reduce((groups, complaint) => {
    const { status } = complaint;
    if (!groups[status]) {
      groups[status] = [];
    }
    groups[status].push(complaint);
    return groups;
  }, {});

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto relative lg:pl-64"> {/* Adjusted padding for large screens */}
      <div className="flex items-center justify-between mb-4 border-b border-gray-300 pb-4">
        <h2 className="text-xl font-semibold text-gray-900">Complaints</h2>
        {/* Filter dropdown */}
        {isAdmin && (
          <div className="flex items-center">
            <span className="mr-2">Filter:</span>
            <select
              className="border rounded-md py-2 px-3"
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
            >
              <option value="">Select Filter</option>
              <option value="category">Category</option>
              <option value="status">Status</option>
              <option value="">Default</option>
            </select>
          </div>
        )}
      </div>

      {/* Cards */}
      <div className="flex-col gap-4 mx-auto relative">
        {selectedFilter === 'status' ? (
          <Status />
        ) : selectedFilter === 'category' ? (
          <Categorical />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-2">
          {Object.keys(groupedComplaints)
            .sort((a, b) => {
              const order = ["Complaint Registered", "Pending", "Resolved"];
              return order.indexOf(a) - order.indexOf(b);
            })
            .map((status, index) => (
              <div key={index} className="flex flex-col gap-4">
                <h2 className="text-lg font-bold">{status}</h2>
                {groupedComplaints[status].map((complaint, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-lg shadow-md p-4 relative"
                  >
                    {/* Status Circle */}
                    <span
                      className={`absolute top-2 right-2 inline-block h-4 w-4 rounded-full ${getStatusColor(complaint.status)}`}
                    ></span>
                    
                    {/* Info Icon */}
                    {(
                      <button
                        className="absolute bottom-2 right-2 p-1 text-blue-500 hover:text-blue-700"
                        onClick={() => openModal(complaint)}
                      >
                        <FiInfo size={20} />
                      </button>
                    )}
        
                    <p className="text-gray-600 mb-2">
                      Title: {complaint.title || 'No Title'}
                    </p>
                    {complaint.complaint_proof && (
                      <a
                        href={complaint.complaint_proof}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        View Complaint Proof
                      </a>
                    )}
                    <p className="text-gray-700 mt-2">Status: {complaint.status}</p>
                  </div>
                ))}
              </div>
            ))}
        </div>
        
        )}
      </div>

      {/* Legend */}
      <div className="fixed bottom-4 right-4 z-10 flex flex-row items-center space-x-4">
        <div className="flex items-center space-x-2">
          <span className="inline-block h-4 w-4 rounded-full bg-green-500"></span>
          <span className="text-sm">Resolved</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="inline-block h-4 w-4 rounded-full bg-yellow-500"></span>
          <span className="text-sm">Pending</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="inline-block h-4 w-4 rounded-full bg-red-500"></span>
          <span className="text-sm">Complaint Registered</span>
        </div>
      </div>

      {/* Modal for complaint details and status change */}
      {selectedComplaint && (
 <div
 id="default-modal"
 tabIndex="-1"
 aria-hidden="true"
 className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-gray-900 bg-opacity-50"
>
 <div className="relative w-full max-w-2xl max-h-full p-4">
   <div className="relative bg-gradient-to-r bg-black rounded-lg shadow-lg">
     <div className="flex items-center justify-between p-4 border-b rounded-t md:p-5 border-gray-200">
       <h3 className="text-xl font-semibold text-white">
         {selectedComplaint.title}
       </h3>
       <button
         type="button"
         className="text-white bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex items-center justify-center"
         onClick={closeModal}
       >
         <svg
           className="w-4 h-4"
           aria-hidden="true"
           xmlns="http://www.w3.org/2000/svg"
           fill="none"
           viewBox="0 0 14 14"
         >
           <path
             stroke="currentColor"
             strokeLinecap="round"
             strokeLinejoin="round"
             strokeWidth="2"
             d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
           />
         </svg>
         <span className="sr-only">Close modal</span>
       </button>
     </div>
     <div className="p-4 space-y-4 md:p-5">
     <p className="text-base leading-relaxed text-gray-200">
         Complaint ID: <span>{selectedComplaint.complaint_id}</span>
       </p>
       <p className="text-base leading-relaxed text-gray-200">
         Email: xxxxx@gmail.com
       </p>
       <p className="text-base leading-relaxed text-gray-200">
         {selectedComplaint.complaint}
       </p>
       <p className="text-base leading-relaxed text-gray-200">
         Registered On: {selectedComplaint.date}
       </p>
       <p className="text-base leading-relaxed text-gray-200">
         Remarks: {selectedComplaint.curStatus}
       </p>
       <p className="text-base leading-relaxed text-gray-200">
         Last Update: {selectedComplaint.lastupdate}
       </p>
     </div>
     {isAdmin && (
       <div className="p-4 border-t border-gray-200 rounded-b md:p-5">
         <div className="flex flex-wrap items-center space-x-4 mb-4">
           <label htmlFor="status" className="block text-sm font-medium text-gray-200">
             Change Status:
           </label>
           <select
             id="status"
             value={newStatus}
             onChange={handleStatusChange}
             className="border rounded-md py-2 px-3 text-gray-700"
           >
             <option value="">Select Status</option>
             <option value="Resolved">Resolved</option>
             <option value="Pending">Pending</option>
             <option value="Closed">Closed</option>
           </select>
           <button
             type="button"
             className="ml-4 text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5"
             onClick={() => fileRef.current.click()}
           >
             Attach Proof
           </button>
           <input
             type="file"
             ref={fileRef}
             accept="image/*"
             hidden
             required
             onChange={(e) => setImage(e.target.files[0])}
           />
         </div>
         <div className="flex flex-wrap items-center space-x-4">
           <label htmlFor="curStatus" className="block text-sm font-medium text-gray-200">
             Change Current Status:
           </label>
           <input
             type="text"
             id="curStatus"
             value={newCurStatus}
             onChange={handleCurStatusChange}
             className="border rounded-md py-2 px-3 text-gray-700"
             placeholder="Enter Current Status"
           />
           <button
             type="button"
             className="ml-4 text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5"
             onClick={handleCurStatusUpdate}
           >
             Update Status
           </button>
           <div className="flex flex-wrap items-center space-x-4 mb-4 mt-3">
           <label htmlFor="status" className="block text-sm font-medium text-gray-200">
            Select Category
           </label>
           <select
             id="status"
             value={newStatus}
             onChange={handleStatusChange}
             className="border rounded-md py-2 px-3 text-gray-700"
           >
             <option value="">Select Category</option>
             <option value="Billing">Billing</option>
             <option value="Hostel">Hostel</option>
             <option value="House Keeping">HouseKeeping</option>
             <option value="Other">Other</option>
             <option value="Technical">Technical</option>
           </select>
           <button
             type="button"
             className="ml-4 text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5"
             //onClick={handleCurStatusUpdate}
           >
             Send Email
           </button>
         </div>
         
         </div>
       </div>
     )}
   </div>
 </div>
</div>



)}

    </div>
  );
}
 