import { useState } from "react";
import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  useToast,
  Code,
} from "@chakra-ui/react";
import { SpinnerIcon } from "@chakra-ui/icons";
import api from "../../services/api";

const PairingDashboard = () => {
  const [loading, setLoading] = useState(false);
  const [signal, setSignal] = useState(false);
  const [response, setResponse] = useState("");
  const toast = useToast();

  const handleToggle = () => {
    setLoading(true);
    setSignal(!signal);
    api
      .post("/interview/pair/", { signal: !signal })
      .then((res) => {
        setResponse(res.data);
        toast({
          title: "Success",
          description: "Pair interview pool status updated",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      })
      .catch((error) => {
        setResponse(JSON.stringify(error));
        toast({
          title: "Error",
          description: "Failed to update pair interview pool status",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Container maxW="container.md" py={8}>
      <VStack spacing={6} align="stretch">
        <Box borderWidth={1} borderRadius="lg" p={6} boxShadow="md">
          <VStack spacing={4} align="stretch">
            <Heading size="lg">Pair Interview Pool Dashboard</Heading>
            <Text>Manage the pair interview pool status</Text>

            <HStack justifyContent="space-between">
              <Text fontWeight="medium">Pair Interview Pool</Text>
            </HStack>

            <Button
              onClick={handleToggle}
              isLoading={loading}
              loadingText="Processing"
              spinnerPlacement="start"
              colorScheme={signal ? "red" : "green"}
            >
              {loading ? <SpinnerIcon mr={2} /> : null}
              Pair Interview Pool
            </Button>

            {response && (
              <Box borderWidth={1} borderRadius="md" p={4} bg="gray.50">
                <Text fontWeight="bold" mb={2}>
                  Response:
                </Text>
                <Code display="block" whiteSpace="pre-wrap">
                  {JSON.stringify(response, null, 2)}
                </Code>
              </Box>
            )}
          </VStack>
        </Box>
      </VStack>
    </Container>
  );
};

export default PairingDashboard;
