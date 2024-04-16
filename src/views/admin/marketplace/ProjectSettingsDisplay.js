import React, { useEffect, useState } from "react";
import {
    Box,
    Heading,
    List,
    ListItem,
    Text,
    Button,
    Input,
    Spinner,
    Alert,
    AlertIcon,
} from "@chakra-ui/react";
import io from "socket.io-client";

const ProjectSettingsDisplay = () => {
    const [editedSettings, setEditedSettings] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);
    const socket = io("https://api.sirglobal.org");

    useEffect(() => {
        socket.on("getSettings", (settings) => {
            console.log("settings11", settings);
            setEditedSettings(settings?.data);
        });
        // Clean up the connection when component unmounts
        return () => {
            socket.disconnect();
        };
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedSettings((prevSettings) => ({
            ...prevSettings,
            [name]: value,
        }));
    };

    const handleSave = async () => {
        try {
            let headersList = {
                "Accept": "*/*",
                "Content-Type": "application/json"
            }

            let bodyContent = JSON.stringify({
                "updatedSetting": editedSettings
            });

            let response = await fetch("https://api.sirglobal.org/de", {
                method: "POST",
                body: bodyContent,
                headers: headersList
            });

            let data = await response.text();
            console.log(data);
            setSuccessMessage("Event emitted successfully!");
            setErrorMessage(null); // Clear any previous error message
        } catch (error) {
            console.error("Error emitting event:", error);
            setErrorMessage("Failed to emit event. Please try again later.");
            setSuccessMessage(null); // Clear any previous success message
        }
    };


    if (!editedSettings) return <Spinner color="red.500" />;

    return (
        <Box>
            {successMessage && (
                <Alert status="success" mb="4">
                    <AlertIcon />
                    {successMessage}
                </Alert>
            )}
            {errorMessage && (
                <Alert status="error" mb="4">
                    <AlertIcon />
                    {errorMessage}
                </Alert>
            )}
            <List spacing={4} m={4}>
                <ListItem>
                    <Text fontWeight="bold">SCB Total Level Distribution:</Text>
                    <Input
                        type="number"
                        name="scbtotallevaldistribution"
                        value={editedSettings.scbtotallevaldistribution}
                        onChange={handleInputChange}
                    />
                </ListItem>
                <ListItem>
                    <Text fontWeight="bold">SCB Percentage:</Text>
                    <Input
                        type="text"
                        name="ccbtPercentage"
                        value={editedSettings.ccbtPercentage}
                        onChange={handleInputChange}
                    />
                </ListItem>
                <ListItem>
                    <Text fontWeight="bold">CCB Total Level Distribution:</Text>
                    <Input
                        type="number"
                        name="ccbtotallevaldistribution"
                        value={editedSettings.ccbtotallevaldistribution}
                        onChange={handleInputChange}
                    />
                </ListItem>
                <ListItem>
                    <Text fontWeight="bold">CCB Percentage:</Text>
                    <Input
                        type="text"
                        name="scbtPercentage"
                        value={editedSettings.scbtPercentage}
                        onChange={handleInputChange}
                    />
                </ListItem>
                <ListItem>
                    <Text fontWeight="bold">Reff Percentage:</Text>
                    <Input
                        type="number"
                        name="reffPercentage"
                        value={editedSettings.reffPercentage}
                        onChange={handleInputChange}
                    />
                </ListItem>
            </List>
            <Button onClick={handleSave}>Save</Button>
        </Box>
    );
};

export default ProjectSettingsDisplay;
