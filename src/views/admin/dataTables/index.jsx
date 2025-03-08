import { Box, SimpleGrid } from "@chakra-ui/react";
import ComplexTable from "views/admin/dataTables/components/ComplexTable";
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Settings() {
  const [data, setData] = useState([]);

  // Fetching the order data from the API
  useEffect(() => {
    const fetchData = async () => {
      let headersList = {
        Accept: "*/*",
        "Content-Type": "application/json",
        Authorization: "Bearer YOUR_AUTH_TOKEN", // Replace with your actual token
      };

      const reqOptions = {
        url: "https://b-e-production.up.railway.app/api/v1/orders", // URL changed to orders endpoint
        method: "GET",
        headers: headersList,
      };

      try {
        const response = await axios.request(reqOptions);
        setData(response.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Function to format the date for readability
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(); // Adjust this based on the desired format
  };

  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }} mt="40px">
      <SimpleGrid mt="10px" spacing={{ base: "20px", xl: "20px" }}>
        <ComplexTable
          columnsData={[
            {
              Header: "Customer ID",
              accessor: "customer", // Assuming customer is an object with its own ID
              Cell: ({ value }) => value.$oid, // Extracting the ObjectId
            },
            {
              Header: "Payment Type",
              accessor: "paymentType",
            },
            {
              Header: "Delivery Type",
              accessor: "deliveryType",
            },
            {
              Header: "Created At",
              accessor: "createdAt",
              Cell: ({ value }) => formatDate(value), // Format the date
            },
            {
              Header: "Updated At",
              accessor: "updatedAt",
              Cell: ({ value }) => formatDate(value), // Format the date
            },
            {
              Header: "Products",
              accessor: "products",
              Cell: ({ value }) => {
                // Displaying the list of products, if any
                return value.length ? (
                  <ul>
                    {value.map((product, index) => (
                      <li key={index}>{product}</li> // Assuming products are just strings
                    ))}
                  </ul>
                ) : (
                  "No products"
                );
              },
            },
          ]}
          tableData={data}
        />
      </SimpleGrid>
    </Box>
  );
}
