import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PieChart } from '@mui/x-charts';

export default function Home() {
  const [complaintsData, setComplaintsData] = useState([]);

  useEffect(() => {
      fetchData();
  }, []);

  const fetchData = async () => {
      try {
          const response = await fetch('/api/complaint/getAllComplaints');
          console.log(response);
          setComplaintsData(response.complaints.allComplaints);
      } catch (error) {
          console.error('Error fetching complaints:', error);
      }
  };

  const getChartData = () => {
      const counts = complaintsData.reduce((acc, complaint) => {
          acc[complaint.issue_category] = (acc[complaint.issue_category] || 0) + 1;
          return acc;
      }, {});

      const chartData = Object.entries(counts).map(([issue_category, count]) => ({
          issue_category,
          count
      }));

      return chartData;
  };

  return (
    <div>
        <h2>All Complaints</h2>
        <div style={{ height: 400, width: '100%' }}>
            {complaintsData.length > 0 ? (
                <PieChart
                    data={getChartData()}
                    innerRadius={0.6}
                    outerRadius={0.8}
                    dataKey="value"
                    angleKey="name"
                    label
                    legend
                />
            ) : (
                <p>No complaints data available</p>
            )}
        </div>
    </div>
);
}