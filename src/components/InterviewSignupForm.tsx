import { useState } from 'react';
import { Box, Button, VStack, useToast } from '@chakra-ui/react';
import ChakaraTimeRangeSelector from './TimeRangeSelector/ChakaraTimeRangeSelector';
import MobileTimeRangeSelector from './TimeRangeSelector/MobileTimeRangeSelector';
import { motion, AnimatePresence } from 'framer-motion';
import ConfirmInterviewSignupStep from './ConfirmInterviewSignupStep';
import { signupCurrentUserForInterviewPool } from '../services/interview';
import { InterviewAvailability } from '../types';
import { devPrint } from './utils/RandomUtils';
import { useAuth } from '../hooks/useAuth';
import { formatDate, getThisUpcomingSunday } from '../localization';

interface InterviewSignupFormProps {
  title: string;
  availability: boolean[][];
  onChange: (newAvailability: boolean[][]) => void;
  dayLabels?: string[];
  timeLabels?: string[];
}

const InterviewSignupForm: React.FC<InterviewSignupFormProps> = ({
  title,
  availability,
  onChange,
  dayLabels,
  timeLabels,
}) => {
  const { member } = useAuth();
  const toast = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const steps = ['Availability', 'Confirmation'];

  const isMobile = window.innerWidth < 768;
  devPrint('isMobile', isMobile);

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const handlePrev = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleConfirm = async () => {
    if (!member) {
      alert('You must be logged in to sign up for an interview');
      return;
    }

    const interviewAvailability: InterviewAvailability = {
      userId: member.id,
      availability: availability,
    };

    try {
      await signupCurrentUserForInterviewPool(interviewAvailability);
      toast({
        title: 'Successfully signed up for an interview',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      devPrint('Error signing up for interview:', error);
      toast({
        title: 'Error signing up for interview',
        description: 'Please try again later',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const renderStep = (step: number) => {
    switch (step) {
      case 0:
        return isMobile ? (
          <MobileTimeRangeSelector
            title={title}
            availability={availability}
            onChange={onChange}
            dayLabels={dayLabels}
            timeLabels={timeLabels}
          />
        ) : (
          <ChakaraTimeRangeSelector
            title={title}
            availability={availability}
            onChange={onChange}
            dayLabels={dayLabels}
            timeLabels={timeLabels}
          />
        );
      case 1:
        return (
          <ConfirmInterviewSignupStep
            weekOf={formatDate(getThisUpcomingSunday())}
            _handleConfirm={handleConfirm}
          />
        );
      default:
        return null;
    }
  };

  return (
    <VStack spacing={6} align="stretch">
      <Box
        position="relative"
        height="500px"
        overflowY={currentStep === 0 ? 'auto' : 'hidden'}
      >
        <AnimatePresence initial={false}>
          <motion.div
            key={currentStep}
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
            }}
          >
            {renderStep(currentStep)}
          </motion.div>
        </AnimatePresence>
      </Box>
      <Box display="flex" justifyContent="space-between">
        <Button
          onClick={handlePrev}
          isDisabled={currentStep === 0}
          colorScheme="brand"
        >
          Previous
        </Button>
        <Button
          colorScheme="brand"
          onClick={
            currentStep === steps.length - 1 ? handleConfirm : handleNext
          }
        >
          {currentStep === steps.length - 1 ? 'Submit' : 'Next'}
        </Button>
      </Box>
    </VStack>
  );
};

export default InterviewSignupForm;
