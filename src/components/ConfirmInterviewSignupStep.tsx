import { Box, Text, VStack } from '@chakra-ui/react'

interface ConfirmInterviewSignupStepProps {
  weekOf: string
  handleConfirm: () => void
}

const ConfirmInterviewSignupStep: React.FC<ConfirmInterviewSignupStepProps> = ({
  weekOf,
  handleConfirm
}) => {
  return (
    <VStack spacing={4} align='stretch'>
      <Box bg='white' p={4} height='80%'>
        <Text fontSize='40px'>
          You are signing up for a mock interview for the week of{' '}
          <em>{weekOf}</em>. Please confirm that you are available for the times
          selected. We take no shows <em>very</em> seriously and will ban you
          from the platform if you do not show up.
        </Text>
      </Box>
    </VStack>
  )
}

export default ConfirmInterviewSignupStep
