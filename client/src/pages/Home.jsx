import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PieChart } from '@mui/x-charts';

export default function Home() {
    const [complaintsData, setComplaintsData] = useState([]);

    useEffect(() => {
      // Fetch complaints data from your API
      const fetchData = async () => {
        try {
          const response = await axios.get('/api/complaints/getAllComplaints'); // Assuming your API endpoint is '/api/complaints'
          setComplaintsData(response.data.complaints);
        } catch (error) {
          console.error('Error fetching complaints:', error);
        }
      };
  
      fetchData();
    }, []); // Fetch data only once when the component mounts
  
    // Process data to prepare for pie chart
    const prepareDataForPieChart = () => {
      // Count occurrences of each issue category
      const categoryCounts = complaintsData.reduce((counts, complaint) => {
        counts[complaint.issue_category] = (counts[complaint.issue_category] || 0) + 1;
        return counts;
      }, {});
  
      // Convert counts object to array of objects
      const pieChartData = Object.keys(categoryCounts).map(category => ({
        category,
        value: categoryCounts[category],
      }));
  
      return pieChartData;
    };
  
    return (
      <div>
        <h2>Complaints by Category</h2>
        <PieChart
          data={prepareDataForPieChart()}
          innerRadius={0.5} // Adjust as needed
          outerRadius={0.8} // Adjust as needed
          seriesField="category"
          angleField="value"
          label={{ type: 'inner', offset: '-50%' }} // Adjust label position
          legend={{ position: 'bottom' }} // Adjust legend position
        />
      </div>
    );
}