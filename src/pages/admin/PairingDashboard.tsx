import { useEffect, useState } from "react";
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
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Switch,
} from "@chakra-ui/react";
import api from "../../services/api";
import { InterviewPoolStatus } from "../../types";
import { getInterviewPoolStatus } from "../../services/interview";
import { ArrowBackIcon, SpinnerIcon } from "@chakra-ui/icons";
import { Link } from "react-router-dom";
import { devPrint } from "../../components/utils/RandomUtils";

const PairingDashboard = () => {
  const [loading, setLoading] = useState(false);
  const [signal, setSignal] = useState(false);
  const [response, setResponse] = useState("");
  const [forceCurrentWeek, setForceCurrentWeek] = useState(false);

  const [signupData, setSignUpData] = useState<InterviewPoolStatus>();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  function getPoolData(forceCurrentWeek: boolean = false) {
    setLoading(true);
    getInterviewPoolStatus(forceCurrentWeek)
      .then((res) => {
        devPrint(res);
        if (res) {
          setSignUpData(res);
        }
      })
      .catch((error) => {
        devPrint(error);
        toast({
          title: "Error",
          description: "Failed to fetch pool status",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }

  useEffect(() => {
    getPoolData(false);
  }, []);

  const handleToggle = () => {
    setLoading(true);
    api
      .post("/interview/pair/", {
        signal: !signal,
        force_current_week: forceCurrentWeek,
      })
      .then((res) => {
        setResponse(res.data);
        setSignal(!signal);
        getPoolData(forceCurrentWeek);
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

  const handleForceCurrentWeekToggle = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newValue = e.target.checked;
    setForceCurrentWeek(newValue);
    getPoolData(newValue);
  };

  return (
    <Container maxW="container.md" py={8}>
      <Button
        as={Link}
        to="/admin"
        colorScheme="blue"
        leftIcon={<ArrowBackIcon />}
        w="fit-content"
        mb="16px"
      >
        Go Back
      </Button>
      <VStack spacing={6} align="stretch">
        <Box borderWidth={1} borderRadius="lg" p={6} boxShadow="md">
          <VStack spacing={4} align="stretch">
            <Heading size="lg">Pair Interview Pool Dashboard</Heading>
            <Text>Manage the pair interview pool status</Text>

            <HStack justifyContent="space-between">
              <Text fontWeight="medium">Pair Interview Pool</Text>
            </HStack>
            <Text>
              {signupData?.nextCutoff && (
                <>Next cutoff: {signupData.nextCutoff.toLocaleString()} PST</>
              )}
            </Text>
            <Text>
              {signupData?.previousCutoff && (
                <>
                  Previous cutoff: {signupData.previousCutoff.toLocaleString()}
                  PST
                </>
              )}
            </Text>
            <Text fontWeight="medium">
              {signupData?.numberSignUp || 0} member signup:
            </Text>
            <Code>{JSON.stringify(signupData?.members, null, 2)}</Code>

            <Switch
              isChecked={forceCurrentWeek}
              onChange={handleForceCurrentWeekToggle}
            >
              Force Current Week
            </Switch>

            <Button
              onClick={onOpen}
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

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirm Action</ModalHeader>
          <ModalBody>
            Are you sure you want to toggle the pair interview pool status?
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleToggle}>
              Yes
            </Button>
            <Button variant="ghost" onClick={onClose}>
              No
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default PairingDashboard;
