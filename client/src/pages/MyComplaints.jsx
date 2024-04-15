import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

export default function MyComplaints() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [complaintList, setComplaintList] = useState([]);
  const { currentUser } = useSelector((state) => state.user);
  const isAdmin = currentUser.username === 'ramangoudanh';  
  useEffect(() => {
    const fetchData = async () => {
      if (!currentUser) return;
    
      try {
        let endpoint = '/api/complaint/getMyComplaints';
        let requestOptions = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ uuid: currentUser.uuid }),
        };
    
        // Check if current user is an admin
        if (isAdmin) {
          endpoint = '/api/complaint/getComplaints';
          requestOptions = { method: 'GET' }; // No need to send user ID for admin
        }
    
        const response = await fetch(endpoint, requestOptions);
    
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
    
        const data = await response.json();
        
        // If admin, set all complaints, else set user's complaints
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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto py-8">
      <h2 className="text-2xl font-bold mb-4">Complaint List</h2>
      <div className="overflow-x-auto">
        <table className="table-auto w-full">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2">Complaint</th>
              <th className="px-4 py-2">Complaint Proof</th>
              <th className="px-4 py-2">Issue Category</th>
            </tr>
          </thead>
          <tbody>
            {complaintList && complaintList.map((complaint, index) => (
              <tr key={index} className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}>
                <td className="border px-4 py-2">{complaint.complaint}</td>
                <td className="border px-4 py-2"><a href={complaint.complaint_proof} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{complaint.complaint_proof}</a></td>
                <td className="border px-4 py-2">{complaint.issue_category}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}