import { useTheme } from "@mui/material";
import { ResponsiveBar } from "@nivo/bar";
import { tokens } from "../theme";
import { useEffect, useState } from "react";


const BarChart = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [complaintCategories, setComplaintCategories] = useState([]);

  useEffect(() => {
    const fetchComplaintCategories = async () => {
      try {
        const response = await fetch("https://mini-project-fo4m.onrender.com/api/complaint/getComplaintCategories");
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        setComplaintCategories(data); // Use data directly instead of dat.data
        console.log(data); // Log data after setting it
      } catch (error) {
        console.error("Error fetching complaint categories:", error);
      }
    };
  
    fetchComplaintCategories();
  }, []);

  return (
    <ResponsiveBar
      data={complaintCategories}
      theme={{
        // Theme customization
        axis: {
          domain: {
            line: {
              stroke: colors.grey[100],
            },
          },
          legend: {
            text: {
              fill: colors.grey[100],
            },
          },
          ticks: {
            line: {
              stroke: colors.grey[100],
              strokeWidth: 1,
            },
            text: {
              fill: colors.grey[100],
            },
          },
        },
        legends: {
          text: {
            fill: colors.grey[100],
          },
        },
      }}
      keys={["resolved", "pending", "closed"]}
      indexBy="_id"
      margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
      padding={0.3}
      valueScale={{ type: "linear" }}
      indexScale={{ type: "band", round: true }}
      colors={{ scheme: "nivo" }}
      axisTop={null}
      axisRight={null}
      axisBottom={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: "Issue Category",
        legendPosition: "middle",
        legendOffset: 32,
      }}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: "Complaint Count",
        legendPosition: "middle",
        legendOffset: -40,
      }}
     
      labelSkipWidth={12}
      labelSkipHeight={12}
      labelTextColor={{
        from: "color",
        modifiers: [["darker", 1.6]],
      }}
      legends={[
        {
          dataFrom: "keys",
          anchor: "bottom-right",
          direction: "column",
          justify: false,
          translateX: 120,
          translateY: 0,
          itemsSpacing: 2,
          itemWidth: 100,
          itemHeight: 20,
          itemDirection: "left-to-right",
          itemOpacity: 0.85,
          symbolSize: 20,
          effects: [
            {
              on: "hover",
              style: {
                itemOpacity: 1,
              },
            },
          ],
        },
      ]}
      role="application"
      barAriaLabel={function (e) {
        return e.id + ": " + e.formattedValue + " in issue category: " + e.indexValue;
      }}
    />
  );
};

export default BarChart;
