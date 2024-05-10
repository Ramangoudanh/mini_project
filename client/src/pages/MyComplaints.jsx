import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Catgorical from './Catgorical';
import Status from './Status';
export default function MyComplaints() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [complaintList, setComplaintList] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const { currentUser } = useSelector((state) => state.user);
  const isAdmin = currentUser.username === 'ramangoudanh'; 
  const [selectedFilter, setSelectedFilter] = useState(''); 

  useEffect(() => {
  

    
    const fetchData = async () => {
          if (!currentUser) return;

      try {
        let response;
        if (isAdmin) {
          response = await fetch('https://mini-project-fo4m.onrender.com/api/complaint/getComplaints');
        } else {
          response = await fetch('http://localhost:3000/api/complaint/getmycomplaints', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ uuid: currentUser.uuid }),
          });
        }

        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }

        const data = await response.json();

        // Set complaints based on the response data
        if (isAdmin) {
          setComplaintList(data);
        } else {
          setComplaintList(data['the complaint list of a user']);
          console.log(data['the complaint list of a user']);
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to fetch data. Please try again later.');
        setLoading(false);
      }
    };

    fetchData();
  }, [currentUser]);

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
    switch(status) {
      case "Resolved":
        return "bg-green-500";
      case "Pending":
        return "bg-yellow-500";
      case "Closed":
        return "bg-red-500";
      default:
        return ""; // Return default color class or handle the case where status is not recognized
    }
  }

 

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto relative">
    <div className="flex items-center justify-between mb-4 border-b border-gray-300 pb-">
      <h2 className="text-xl font-semibold text-gray-900 2">Complaints</h2>
      {/* Filter dropdown */}
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
          <option value="">default</option>
        </select>
      </div>
    </div>

    {/* Cards */}
    
    {/* Legend */}
  <div className="container mx-auto relative">
    {selectedFilter === 'status' ? (
      <Status />
    ) : selectedFilter === 'category' ? (
      <Catgorical/>
    ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-2">
        {complaintList &&
          complaintList.map((complaint, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md p-4 cursor-pointer relative"
              onClick={() => isAdmin && openModal(complaint)}
            >
              {/* Status Circle */}
              <span
                className={`absolute top-2 right-2 inline-block h-4 w-4 rounded-full ${getStatusColor(
                  complaint.status
                )}`}
              ></span>

              <p className="text-gray-600 mb-2">Title: {complaint.title}</p>
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
    )}
  </div>
  <div className="absolute bottom-4 mt-4 right-4 z-10 flex flex-row items-center space-x-4">
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
        <span className="text-sm">Closed</span>
      </div>
    </div>



    
  

    {/* Modal for complaint details and status change */}
    {selectedComplaint && (
      <div id="default-modal" tabIndex="-1" aria-hidden="true" className="fixed inset-0 overflow-y-auto overflow-x-hidden z-50 flex items-center justify-center">
        <div className="relative p-4 w-full max-w-2xl max-h-full">
          <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                {selectedComplaint.title}
              </h3>
              <button type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" onClick={closeModal}>
                <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
            </div>
            <div className="p-4 md:p-5 space-y-4">
              <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                {selectedComplaint.complaint}
              </p>
            </div>
            <div className="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
              <label htmlFor="status" className="block mr-4">Change Status:</label>
              <select id="status" value={newStatus} onChange={handleStatusChange} className="border rounded-md py-2 px-3">
                <option value="">Select Status</option>
                <option value="Resolved">Resolved</option>
                <option value="Pending">Pending</option>
                <option value="Closed">Closed</option>
              </select>
              <button type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" onClick={handleStatusUpdate}>Update Status</button>
            </div>
          </div>
        </div>
      </div>
    )}
  </div>
  );
}
