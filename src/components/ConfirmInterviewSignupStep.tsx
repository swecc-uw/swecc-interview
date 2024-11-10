import { Box, Text, VStack } from '@chakra-ui/react';

interface ConfirmInterviewSignupStepProps {
  weekOf: string;
  _handleConfirm: () => void;
}

const ConfirmInterviewSignupStep: React.FC<ConfirmInterviewSignupStepProps> = ({
  weekOf,
  _handleConfirm,
}) => {
  return (
    <VStack>
      <Box p={4} height="80%">
        <Text mt={50} fontSize="30px">
          You are signing up for a mock interview for the week of{' '}
          <em>{weekOf}</em>. Please confirm that you are available for the times
          selected. We take no shows <em>very</em> seriously and will ban you
          from the platform if you do not show up.
        </Text>
      </Box>
    </VStack>
  );
};

export default ConfirmInterviewSignupStep;
