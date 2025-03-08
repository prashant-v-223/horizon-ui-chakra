import { Box, SimpleGrid } from "@chakra-ui/react";
import ComplexTable from "views/admin/dataTables/components/ComplexTable";
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Settings() {
  const [data, setData] = useState([]);

  // Fetching the product data from the API
  useEffect(() => {
    const fetchData = async () => {
      let headersList = {
        Accept: "*/*",
        "Content-Type": "application/json",
        Authorization: "Bearer YOUR_AUTH_TOKEN", // Replace with your actual token
      };

      const reqOptions = {
        url: "https://b-e-production.up.railway.app/api/v1/products",
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

  // Chakra Color Mode
  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }} mt="40px">
      <SimpleGrid mt="10px" spacing={{ base: "20px", xl: "20px" }}>
        <ComplexTable
          columnsData={[
            {
              Header: "NAME",
              accessor: "name",
            },
            {
              Header: "Price",
              accessor: "price",
            },
            {
              Header: "Discount (%)",
              accessor: "discountPercent",
            },
            {
              Header: "Description",
              accessor: "description",
              Cell: ({ value }) => (
                <div
                  dangerouslySetInnerHTML={{ __html: value }} // Render HTML description
                />
              ),
            },
            {
              Header: "Created At",
              accessor: "createdAt",
              Cell: ({ value }) => formatDate(value), // Format the date
            },
            {
              Header: "Images",
              accessor: "images",
              Cell: ({ row }) => {
                const images = [
                  row.original.image1,
                  row.original.image2,
                  row.original.image3,
                  row.original.image4,
                  row.original.image5,
                ];

                return (
                  <div style={{ display: "flex", flexWrap: "wrap" }}>
                    {images.map((image, index) => {
                      // Only render images if the URL exists
                      return image ? (
                        <img
                          key={index}
                          src={image}
                          alt={`Product Image ${index + 1}`}
                          style={{
                            width: "50px",
                            height: "50px",
                            margin: "5px",
                            objectFit: "cover",
                            borderRadius: "5px",
                          }}
                        />
                      ) : null;
                    })}
                  </div>
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
