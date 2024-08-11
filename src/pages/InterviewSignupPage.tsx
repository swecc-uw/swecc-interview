import React, { useState } from "react";
import { Container, Box } from "@chakra-ui/react";
import InterviewSignupForm from "../components/InterviewSignupForm";

const InterviewSignupPage: React.FC = () => {
  const [availability, setAvailability] = useState<boolean[][]>(
    Array.from({ length: 7 }, () => Array.from({ length: 48 }, () => false))
  );

  const handleAvailabilityChange = (newAvailability: boolean[][]) => {
    setAvailability(newAvailability);
  };

  return (
    <Container maxW="container.lg" py={8}>
      <Box borderRadius="lg" boxShadow="md" p={6}>
        <InterviewSignupForm
          title="Select Your Availability for the following week..."
          availability={availability}
          onChange={handleAvailabilityChange}
          // dayLabels={dayLabels}
          // timeLabels={timeLabels}
        />
      </Box>
    </Container>
  );
};

export default InterviewSignupPage;
