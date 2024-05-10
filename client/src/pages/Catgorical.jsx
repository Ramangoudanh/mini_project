import React, { useEffect, useState } from 'react';

function Catgorical() {
  const [complaintsByCategory, setComplaintsByCategory] = useState({});
  const [selectedFilter, setSelectedFilter] = useState('');

  useEffect(() => {
    fetchComplaintsByCategory();
  }, []);

  const fetchComplaintsByCategory = async () => {
    try {
      const response = await fetch('https://mini-project-fo4m.onrender.com/api/complaint/getComplaintsByCategory');
      if (response.ok) {
        const data = await response.json();
        setComplaintsByCategory(data);
      } else {
        console.error('Error fetching complaints by category:', response.status);
      }
    } catch (error) {
      console.error('Error fetching complaints by category:', error);
    }
  };

  function getStatusColor(status) {
    switch (status) {
      case 'Resolved':
        return 'bg-green-500';
      case 'Pending':
        return 'bg-yellow-500';
      case 'Closed':
        return 'bg-red-500';
      default:
        return ''; // Return default color class or handle the case where status is not recognized
    }
  }

  return (
    <div className="container mx-auto p-4">
      {/* Filter dropdown 
      <div className="flex items-center justify-end mb-4">
        <label className="mr-2">Filter by:</label>
        <select
          className="border rounded-md py-2 px-3"
          value={selectedFilter}
          onChange={(e) => setSelectedFilter(e.target.value)}
        >
          <option value="">Select Filter</option>
          <option value="category">Category</option>
          <option value="status">Status</option>
        </select>
      </div>*/}

      {/* Complaints list */}
      {Object.keys(complaintsByCategory).map((category, index) => (
        <div key={index}>
          <h2 className="text-2xl font-bold mt-4 mb-2">{category}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {complaintsByCategory[category].map((complaint, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-4 cursor-pointer relative">
                {/* Status Circle */}
                <span className={`absolute top-2 right-2 inline-block h-4 w-4 rounded-full ${getStatusColor(complaint.status)}`}></span>

                <p className="text-gray-600 mb-2">Title: {complaint.title}</p>
                {complaint.complaint_proof && (
                  <a href={complaint.complaint_proof} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">View Complaint Proof</a>
                )}
                <p className="text-gray-700 mt-2">Status: {complaint.status}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default Catgorical;
