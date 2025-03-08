import { Box, SimpleGrid, Button } from "@chakra-ui/react";
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

  // Function to handle delete or edit actions
  const handleAction = async (actionType, orderId) => {
    try {
      console.log("actionType, orderId", { actionType, orderId });

      // const url = `https://b-e-production.up.railway.app/api/v1/orders/${orderId}`;

      // if (actionType === "delete") {
      //   response = await axios.delete(url, {
      //     headers: {
      //       Accept: "*/*",
      //       "Content-Type": "application/json",
      //       Authorization: "Bearer YOUR_AUTH_TOKEN", // Replace with your actual token
      //     },
      //   });
      //   // After successful deletion, remove the item from the local data
      //   setData((prevData) => prevData.filter((item) => item.id !== orderId));
      // } else if (actionType === "edit") {
      //   // Example of editing (you can customize this based on your requirements)
      //   response = await axios.put(
      //     url,
      //     { paymentType: "Updated Payment Type" }, // Example update data
      //     {
      //       headers: {
      //         Accept: "*/*",
      //         "Content-Type": "application/json",
      //         Authorization: "Bearer YOUR_AUTH_TOKEN",
      //       },
      //     }
      //   );
      //   // Update the data in state after successful edit (customize as needed)
      //   setData((prevData) =>
      //     prevData.map((item) =>
      //       item.id === orderId
      //         ? { ...item, paymentType: "Updated Payment Type" }
      //         : item
      //     )
      //   );
      // }

      // console.log(`${actionType} successful`, response.data);
    } catch (error) {
      console.error(`${actionType} failed`, error);
    }
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
            {
              Header: "Actions",
              accessor: "id", // Assuming id is available for each row
              Cell: ({ value }) => (
                <div>
                  <Button
                    colorScheme="red"
                    size="sm"
                    onClick={() =>
                      handleAction(
                        "delete",
                        "https://b-e-production.up.railway.app/" + value._id
                      )
                    }
                    mr={2}
                  >
                    Delete1
                  </Button>
                  <Button
                    colorScheme="blue"
                    size="sm"
                    onClick={() => handleAction("edit", value)}
                  >
                    Edit
                  </Button>
                </div>
              ),
            },
          ]}
          tableData={data}
          apiEndpoint="https://b-e-production.up.railway.app/api/v1/orders"
        />
      </SimpleGrid>
    </Box>
  );
}
