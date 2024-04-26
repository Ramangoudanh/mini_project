import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

export default function MyComplaints() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [complaintList, setComplaintList] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const { currentUser } = useSelector((state) => state.user);
  const isAdmin = currentUser.username === 'ramangoudanh';  

  useEffect(() => {
    const fetchData = async () => {
      if (!currentUser) return;

      try {
        let response;
        if (isAdmin) {
          response = await fetch('http://localhost:3000/api/complaint/getComplaints');
        } else {
          response = await fetch('http://localhost:3000/api/complaint/getMyComplaints', {
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
      const response = await fetch(`http://localhost:3000/api/complaint/updateComplaintStatus/${selectedComplaint._id}`, {
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
  

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return  (
    <div className="container mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {complaintList && complaintList.map((complaint, index) => (
<div key={index} className="bg-white rounded-lg shadow-md p-4 cursor-pointer" onClick={() => isAdmin && openModal(complaint)}>

            <p className="text-gray-600 mb-2">Title: {complaint.title}</p>
            {complaint.complaint_proof && (
                <a href={complaint.complaint_proof} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">View Complaint Proof</a>
              )}
            <p className="text-gray-700 mt-2">Status: {complaint.status}</p>
          </div>
        ))}
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
