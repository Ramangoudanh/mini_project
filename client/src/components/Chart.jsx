import React, { useEffect, useState } from 'react';

import { PieChart } from '@mui/x-charts';

const ComplaintsPieChart = () => {
    const [chartData, setChartData] = useState({ labels: [], data: [] });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('https://mini-project-fo4m.onrender.com/api/complaint/getAllComplaints'); // Assuming your API endpoint is '/api/complaints'
                const data = await response.json();
                setChartData(data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: '20px' }}>
            <h2>Complaints Pie Chart</h2>
            <div style={{ width: '400px', height: '200px' }}>
                <PieChart
                    series={[
                        {
                            data: chartData.labels.map((label, index) => ({
                                id: index,
                                value: chartData.data[index],
                                label: label
                            }))
                        }
                    ]}
                    width={400}
                    height={200}
                />
            </div>
        </div>
    );
    
    
};

export default ComplaintsPieChart;
