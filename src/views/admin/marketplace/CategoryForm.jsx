import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Textarea,
  Image,
  SimpleGrid,
  useBreakpointValue,
} from "@chakra-ui/react";
import axios from "axios";
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
import ComplexTable from "views/admin/dataTables/components/ComplexTable";

function Settings() {
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
      url: "https://b-e-production.up.railway.app/api/v1/categories",
      method: "GET",
      headers: headersList,
      data: bodyContent,
    };

    let response = await axios.request(reqOptions);
    setData(response.data.data);
  }, []);

  // Chakra Color Mode
  return (
    <Box pt="20">
      <SimpleGrid>
        <ComplexTable
          columnsData={[
            {
              Header: "NAME",
              accessor: "name",
            },

            {
              Header: "description",
              accessor: "description",
            },
            {
              Header: "parent",
              accessor: "parent",
            },
            {
              Header: "images",
              accessor: "images",
            },
            {
              Header: "DATE",
              accessor: "createdAt",
            },
          ]}
          apiEndpoint="https://b-e-production.up.railway.app/api/v1/categories"
          tableData={data}
        />
      </SimpleGrid>
    </Box>
  );
}
const CategoryForm = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image2, setImage2] = useState(null);
  const [parent, setparent] = useState(null);
  const [errors, setErrors] = useState({});

  const handleImageChange = (e, setImage) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!name) newErrors.name = "Product name is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("thumbnailImage", image2); // Ensure image2 is a File object
    {
      parent === "" && formData.append("parent", parent);
    }
    try {
      const response = await axios.post(
        "https://b-e-production.up.railway.app/api/v1/categories",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 201 || response.status === 200) {
        alert("Product added successfully!");
      } else {
        // showToast("error!", "red");
        alert("error!");
      }
    } catch (error) {
      alert("An error occurred. Please check your input and try again.");
      console.error("Error adding product:", error);
    }
  };
  const columns = useBreakpointValue({ base: 1, md: 2 });

  return (
    <>
      <Box
        p={4}
        mt={[180, 100]}
        style={{ background: "#fff", borderRadius: 12 }}
      >
        <form onSubmit={handleSubmit}>
          <SimpleGrid spacing={4}>
            <FormControl id="name" isRequired isInvalid={errors.name}>
              <FormLabel>Category Name</FormLabel>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter product name"
              />
              <FormErrorMessage>{errors.name}</FormErrorMessage>
            </FormControl>

            <FormControl id="thumbnailImage">
              <FormLabel>ThumbnailImage</FormLabel>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageChange(e, setImage2)}
              />
              {image2 && (
                <Box mt={2}>
                  <Image
                    src={URL.createObjectURL(image2)}
                    alt="Image 2 Preview"
                    boxSize="100px"
                    objectFit="cover"
                  />
                </Box>
              )}
            </FormControl>

            <FormControl id="description" gridColumn="span 2">
              <FormLabel>Description</FormLabel>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter  description"
              />
            </FormControl>

            <Button type="submit" colorScheme="teal" width="full">
              Add Category
            </Button>
          </SimpleGrid>
        </form>
      </Box>
      <Settings />
    </>
  );
};

export default CategoryForm;
