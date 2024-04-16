// Chakra imports
import {
  Box,
  Button,
  Flex,
  Icon,
  Spinner,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import Card from "components/card/Card.js";
// Custom components
import BarChart from "components/charts/BarChart";
import React, { useEffect, useState } from "react";
import {
  barChartDataConsumption,
  barChartOptionsConsumption,
} from "variables/charts";
import { MdBarChart } from "react-icons/md";
import { getLastWeeksDates } from "variables/LastWeeksDates";
import io from "socket.io-client";

export default function WeeklyRevenue(props) {
  const { ...rest } = props;
  const [data, setdata] = useState(null);
  const socket = io("https://api.sirglobal.org");
  useEffect(() => {
    getLastWeeksDates(socket, handleSettings);
    return () => {
      socket.disconnect();
    };
  }, [socket]);
  const handleSettings = (settings) => {
    // Handle the settings data here
    setdata(settings);
  };
  // Chakra Color Mode
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const iconColor = useColorModeValue("brand.500", "white");
  const bgButton = useColorModeValue("secondaryGray.300", "whiteAlpha.100");
  const bgHover = useColorModeValue(
    { bg: "secondaryGray.400" },
    { bg: "whiteAlpha.50" }
  );
  const bgFocus = useColorModeValue(
    { bg: "secondaryGray.300" },
    { bg: "whiteAlpha.100" }
  );
  function updateXAxisCategories(newCategories) {
    // Clone the options object to avoid mutating the original object
    const updatedOptions = { ...barChartOptionsConsumption };

    // Update the categories of the x-axis
    updatedOptions.xaxis.categories = newCategories;

    // Return the updated options
    return updatedOptions;
  }

  console.log("rest", rest);
  return (
    <Card align='center' direction='column' w='100%' {...rest}>
      {data?.Last10WeeksDates == undefined ?
        <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
          <Spinner color="red.500" />
        </Box>
        : <>
          <Flex align='center' w='100%' px='15px' py='10px'>
            <Text
              me='auto'
              color={textColor}
              fontSize='xl'
              fontWeight='700'
              lineHeight='100%'>
              Weekly Revenue
            </Text>
            <Button
              align='center'
              justifyContent='center'
              bg={bgButton}
              _hover={bgHover}
              _focus={bgFocus}
              _active={bgFocus}
              w='37px'
              h='37px'
              lineHeight='100%'
              borderRadius='10px'
              {...rest}>
              <Icon as={MdBarChart} color={iconColor} w='24px' h='24px' />
            </Button>
          </Flex>
          <Box h='240px' mt='auto'>
            <BarChart
              chartData={[
                {
                  name: "stakings",
                  data: data?.weeklyStakingmodal,
                },
                {
                  name: "withdrawals",
                  data: data?.weeklyWithdrawals,
                },
              ]}
              chartOptions={updateXAxisCategories(data?.Last10WeeksDates)}
            />
          </Box>
        </>}
    </Card>
  );
}
