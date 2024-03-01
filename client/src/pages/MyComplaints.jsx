import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

export default function MyComplaints() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [complaintList, setComplaintList] = useState([]);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchData = async () => {
      if (!currentUser) return;

      try {
        const response = await fetch('/api/complaint/getMyComplaints', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ uuid: currentUser.uuid }),
        });
         console.log(response.body)
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }

        const data = await response.json();
        setComplaintList(data['the complaint list of a user']);
        console.log(data['the complaint list of a user'])
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
    <div>
      <h2>Complaint List</h2>
      <table>
        <thead>
          <tr>
            <th>Complaint</th>
            <th>Complaint Proof</th>
            <th>Issue Category</th>
          </tr>
        </thead>
        <tbody>
          {complaintList && complaintList.map((complaints, index) => (
            <tr key={index}>
              <td>{complaints.complaint}</td>
              <td><a href={complaints && complaints.complaint_proof} target="_blank" rel="noopener noreferrer">Proof</a></td>
              <td>{complaints && complaints.issue_category}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
