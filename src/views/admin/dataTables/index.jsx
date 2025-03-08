/*!
  _   _  ___  ____  ___ ________  _   _   _   _ ___   
 | | | |/ _ \|  _ \|_ _|__  / _ \| \ | | | | | |_ _| 
 | |_| | | | | |_) || |  / / | | |  \| | | | | || | 
 |  _  | |_| |  _ < | | / /| |_| | |\  | | |_| || |
 |_| |_|\___/|_| \_\___/____\___/|_| \_|  \___/|___|
                                                                                                                                                                                                                                                                                                                                       
=========================================================
* Horizon UI - v1.1.0
=========================================================

* Product Page: https://www.horizon-ui.com/
* Copyright 2023 Horizon UI (https://www.horizon-ui.com/)

* Designed and Coded by Simmmple

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/

// Chakra imports
import { Box, SimpleGrid } from "@chakra-ui/react";
import ComplexTable from "views/admin/dataTables/components/ComplexTable";
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Settings() {
  const [data, setData] = useState([]);
  useEffect(async () => {
    let headersList = {
      Accept: "*/*",
      "Content-Type": "multipart/form-data",
      Authorization: "Bearer ",
    };

    let formdata = new FormData();

    let bodyContent = formdata;

    let reqOptions = {
      url: "https://b-e-production.up.railway.app/api/v1/products",
      method: "GET",
      headers: headersList,
      data: bodyContent,
    };

    let response = await axios.request(reqOptions);
    setData(response.data.data);
  }, []);

  // Chakra Color Mode
  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }} mt="40px">
      <SimpleGrid
        mt="10px"
        spacing={{ base: "20px", xl: "20px" }}
      >
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
              Header: "discountPercent",
              accessor: "discountPercent",
            },
            {
              Header: "description",
              accessor: "description",
            },
            {
              Header: "DATE",
              accessor: "createdAt",
            },
          ]}
          tableData={data}
        />
      </SimpleGrid>
    </Box>
  );
}
