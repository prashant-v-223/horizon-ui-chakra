import {
  Flex,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
  Button,
} from "@chakra-ui/react";
import React, { useMemo } from "react";
import { useGlobalFilter, usePagination, useSortBy, useTable } from "react-table";
import axios from "axios";

// Custom components
import Card from "components/card/Card";
import Menu from "components/menu/MainMenu";

export default function CheckTable(props) {
  const { columnsData, tableData, name, apiEndpoint } = props;

  const columns = useMemo(() => columnsData, [columnsData]);
  const data = useMemo(() => tableData, [tableData]);

  const tableInstance = useTable(
    {
      columns,
      data,
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    initialState,
  } = tableInstance;

  initialState.pageSize = 50;

  const textColor = useColorModeValue("secondaryGray.900", "white");
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");

  // API call for action (like deleting a product)
  const handleAction = async (actionType, productId) => {
    try {
      let response;

      console.log("actionType", apiEndpoint);
      console.log("actionType", productId);


      if (actionType === "delete") {
        // Make DELETE API call
        response = await axios.delete(`${apiEndpoint}/${productId}`);
      } else if (actionType === "edit") {
        // Handle the edit logic here (just an example)
        response = await axios.put(`${apiEndpoint}/${productId}`, {
          // Sample data to be edited
          name: "Updated Product",
        });
      }

      window.location.reload();
      console.log(`${actionType} successful`, response.data);
      // Here you can also update your tableData state if necessary
    } catch (error) {
      console.error(`${actionType} failed`, error);
    }
  };

  return (
    <Card
      direction="column"
      w="100%"
      px="0px"
      overflowX={{ sm: "scroll", lg: "hidden" }}
    >
      <Flex px="25px" justify="space-between" align="center">
        <Text color={textColor} fontSize="22px" fontWeight="700" lineHeight="100%">
          {name}
        </Text>
        <Menu />
      </Flex>

      <Table {...getTableProps()} variant="simple" color="gray.500" mb="24px">
        <Thead>
          {headerGroups.map((headerGroup, index) => (
            <Tr {...headerGroup.getHeaderGroupProps()} key={index}>
              {headerGroup.headers.map((column, index) => (
                <Th
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  pe="10px"
                  key={index}
                  borderColor={borderColor}
                >
                  <Flex
                    justify="space-between"
                    align="center"
                    fontSize={{ sm: "10px", lg: "12px" }}
                    color="gray.400"
                  >
                    {column.render("Header")}
                  </Flex>
                </Th>
              ))}
              {/* Add a column for action buttons */}
              <Th borderColor={borderColor} pe="10px">
                <Flex justify="center" align="center" fontSize="12px">
                  Actions
                </Flex>
              </Th>
            </Tr>
          ))}
        </Thead>

        <Tbody {...getTableBodyProps()}>
          {page.map((row, index) => {
            prepareRow(row);
            return (
              <Tr {...row.getRowProps()} key={index}>
                {row.cells.map((cell, index) => {
                  const data = cell?.value;

                  if (cell.column.id === "images") {
                    const images = [
                      row.original.image1,
                      row.original.image2,
                      row.original.image3,
                      row.original.image4,
                      row.original.image5,
                      row.original.thumbnailImage,
                    ];

                    return (
                      <Td
                        {...cell?.getCellProps()}
                        key={index}
                        fontSize={{ sm: "14px" }}
                        minW={{ sm: "150px", md: "200px", lg: "auto" }}
                        borderColor="transparent"
                      >
                        <div style={{ display: "flex", flexWrap: "wrap" }}>
                          {images.map((image, imageIndex) => {
                            if (image) {
                              return (
                                <img
                                  key={imageIndex}
                                  src={image}
                                  alt={`Product Image ${imageIndex + 1}`}
                                  style={{
                                    width: "50px",
                                    height: "50px",
                                    margin: "5px",
                                    objectFit: "cover",
                                    borderRadius: "5px",
                                  }}
                                />
                              );
                            }
                            return null;
                          })}
                        </div>
                      </Td>
                    );
                  }

                  return (
                    <Td
                      {...cell?.getCellProps()}
                      key={index}
                      fontSize={{ sm: "14px" }}
                      minW={{ sm: "150px", md: "200px", lg: "auto" }}
                      borderColor="transparent"
                    >
                      {data}
                    </Td>
                  );
                })}

                {/* Add action buttons */}
                <Td borderColor="transparent" textAlign="center">
                  <Button
                    colorScheme="red"
                    size="sm"
                    onClick={() => handleAction("delete", row.original._id)}
                    mr={2}
                  >
                    Delete
                  </Button>
                  {/* <Button
                    colorScheme="blue"
                    size="sm"
                    onClick={() => handleAction("edit", row.original._id)}
                  >
                    Edit
                  </Button> */}
                </Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </Card>
  );
}
