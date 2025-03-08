import {
  Avatar,
  Box,
  Flex,
  FormLabel,
  Icon,
  Select,
  SimpleGrid,
  Spinner,
  useColorModeValue,
} from "@chakra-ui/react";
// Assets
import Usa from "assets/img/dashboards/usa.png";
// Custom components
import MiniCalendar from "components/calendar/MiniCalendar";
import MiniStatistics from "components/card/MiniStatistics";
import IconBox from "components/icons/IconBox";
import React, { useEffect } from "react";
import { useState } from "react";
import {
  MdAddTask,
  MdAttachMoney,
  MdBarChart,
  MdFileCopy,
} from "react-icons/md";
import ComplexTable from "views/admin/default/components/ComplexTable";
import DailyTraffic from "views/admin/default/components/DailyTraffic";
import PieCard from "views/admin/default/components/PieCard";
import Tasks from "views/admin/default/components/Tasks";
import TotalSpent from "views/admin/default/components/TotalSpent";
import WeeklyRevenue from "views/admin/default/components/WeeklyRevenue";
import {
  columnsDataCheck,
  columnsDataComplex,
} from "views/admin/default/variables/columnsData";
import tableDataCheck from "views/admin/default/variables/tableDataCheck.json";
import tableDataComplex from "views/admin/default/variables/tableDataComplex.json";

import io from "socket.io-client";
export default function UserReports() {
  // Chakra Color Mode
  const [data, setdata] = useState(null);
  const [loading, setloading] = useState(false);
  useEffect(() => {
    const socket = io("https://api.sirglobal.org");

    socket.on("connection", () => {
      console.log("Connected to Socket.io server");
    });

    socket.on("weeklyData", (data) => {
      console.log("Received weeklyWithdrawals:", data);
        localStorage.setItem("deshbord", JSON.stringify(data));
        setdata(data);
        setloading(!false);
    });

    // Clean up the connection when component unmounts
    return () => {
      socket.disconnect();
    };
  }, []);
  const brandColor = useColorModeValue("brand.500", "white");
  const boxBg = useColorModeValue("secondaryGray.300", "whiteAlpha.100");
  console.log("data", data);
  return !loading ? (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <Spinner color="red.500" />
    </Box>
  ) : (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <SimpleGrid
        columns={{ base: 1, md: 2, lg: 3, "2xl": 6 }}
        gap="20px"
        mb="20px"
      >
        <MiniStatistics
          startContent={
            <IconBox
              w="56px"
              h="56px"
              bg={boxBg}
              icon={
                <Icon w="32px" h="32px" as={MdBarChart} color={brandColor} />
              }
            />
          }
          name="Total investment"
          value={"$" + data.totalStaking?.totalStaking1?.toFixed(2) || 0}
        />
        <MiniStatistics
          startContent={
            <IconBox
              w="56px"
              h="56px"
              bg={boxBg}
              icon={
                <Icon w="32px" h="32px" as={MdAttachMoney} color={brandColor} />
              }
            />
          }
          name="this month investment"
          value={"$" + data.getLast6Months[0].data[5].toFixed(2) || 0}
        />
        <MiniStatistics
          startContent={
            <IconBox
              w="56px"
              h="56px"
              bg={boxBg}
              icon={
                <Icon w="32px" h="32px" as={MdBarChart} color={brandColor} />
              }
            />
          }
          name="Total withdrawal"
          value={"$" + data.totalStaking.totalWithdrawal.toFixed(2) || 0}
        />
        <MiniStatistics
          startContent={
            <IconBox
              w="56px"
              h="56px"
              bg={boxBg}
              icon={
                <Icon w="32px" h="32px" as={MdAttachMoney} color={brandColor} />
              }
            />
          }
          name="this month withdrawal"
          value={"$" + data.getLast6Months[1].data[5] || 0}
        />
        <MiniStatistics
          endContent={
            <Flex me="-20px" mt="10px">
              <FormLabel htmlFor="balance">
                <Avatar src={Usa} />
              </FormLabel>
            </Flex>
          }
          name="Live price"
          value={
            "$" +
              data?.usdtPrice?.toFixed(2) +
              "          " +
              `   (₹ ${data?.usdtPriceinr?.toFixed(2)})` || 0
          }
        />
        <MiniStatistics
          startContent={
            <IconBox
              w="56px"
              h="56px"
              bg="linear-gradient(90deg, #4481EB 0%, #04BEFE 100%)"
              icon={<Icon w="28px" h="28px" as={MdAddTask} color="white" />}
            />
          }
          name="Total active users"
          value={data?.Usermodaldata1}
        />
      </SimpleGrid>

      <SimpleGrid columns={{ base: 1, md: 2, xl: 2 }} gap="20px" mb="20px">
        <TotalSpent
          totalStaking1={data.totalStaking.totalStaking1.toFixed(2)}
          thismonthtotalStaking1={data.getLast6Months[0].data[5].toFixed(2)}
        />
        <WeeklyRevenue />
      </SimpleGrid>
      <SimpleGrid columns={{ base: 1, md: 1, xl: 2 }} gap="20px" mb="20px">
        <ComplexTable
          columnsData={[
            {
              Header: "NAME",
              accessor: "Fullname",
            },
            {
              Header: "NAME",
              accessor: "PhoneNumber",
            },
            {
              Header: "NAME",
              accessor: "mystack",
            },
            {
              Header: "DATE",
              accessor: "createdAt",
            },
          ]}
          tableData={data?.UsersStakedToday}
          name={"Today Active User"}
        />{" "}
        <SimpleGrid columns={{ base: 1, md: 2, xl: 2 }} gap="20px">
          <DailyTraffic />
          <PieCard />
        </SimpleGrid>
      </SimpleGrid>
      <SimpleGrid columns={{ base: 1, md: 1, xl: 2 }} gap="20px" mb="20px">
        <ComplexTable
          columnsData={[
            {
              Header: "sername",
              accessor: "userName",
            },
            {
              Header: "NAME",
              accessor: "Fullname",
            },
            {
              Header: "NAME",
              accessor: "newRank",
            },
            {
              Header: "DATE",
              accessor: "createdAt",
            },
          ]}
          tableData={data?.newRankAchievements || []}
          name={"Today New Rank Achievements"}
        />
        <SimpleGrid columns={{ base: 1, md: 2, xl: 2 }} gap="20px">
          <Tasks />
          <MiniCalendar h="100%" minW="100%" selectRange={false} />
        </SimpleGrid>
      </SimpleGrid>
    </Box>
  );
}
