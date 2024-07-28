import React, { useState } from 'react'
import { Box, Button, Heading, VStack } from '@chakra-ui/react'
import TimeRangeSelector from './TimeRangeSelector/TimeRangeSelector'
import { motion, AnimatePresence } from 'framer-motion'
import ConfirmInterviewSignupStep from './ConfirmInterviewSignupStep'

const getNextSunday = () => {
  const today = new Date()
  const day = today.getDay()
  return new Date(today.setDate(today.getDate() + 7 - day))
}

interface InterviewSignupFormProps {
  title: string
  availability: boolean[][]
  onChange: (newAvailability: boolean[][]) => void
  dayLabels?: string[] | undefined
  timeLabels?: string[] | undefined
}

const InterviewSignupForm: React.FC<InterviewSignupFormProps> = ({
  title,
  availability,
  onChange,
  dayLabels,
  timeLabels
}) => {
  const [currentStep, setCurrentStep] = useState(0)
  const steps = ['Availability', 'Confirmation']

  const handleNext = () => {
    setCurrentStep(prev => Math.min(prev + 1, steps.length - 1))
  }

  const handlePrev = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0))
  }

  const handleConfirm = () => {
    // Implement the actual signup logic here
  }

  const renderStep = (step: number) => {
    switch (step) {
      case 0:
        return (
          <TimeRangeSelector
            title={title}
            availability={availability}
            onChange={onChange}
            dayLabels={dayLabels}
            timeLabels={timeLabels}
          />
        )
      case 1:
        return (
          <ConfirmInterviewSignupStep
            weekOf={getNextSunday().toLocaleDateString()}
            handleConfirm={handleConfirm}
          />
        )
      default:
        return null
    }
  }

  return (
    <VStack spacing={6} align='stretch'>
      <Heading as='h1' size='xl' textAlign='center' mb={6}>
        {steps[currentStep]}
      </Heading>
      <Box
        position='relative'
        height='500px'
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
              height: '100%'
            }}
          >
            {renderStep(currentStep)}
          </motion.div>
        </AnimatePresence>
      </Box>
      <Box display='flex' justifyContent='space-between'>
        <Button onClick={handlePrev} isDisabled={currentStep === 0}>
          Previous
        </Button>
        <Button
          onClick={
            currentStep === steps.length - 1 ? handleConfirm : handleNext
          }
        >
          {currentStep === steps.length - 1 ? 'Submit' : 'Next'}
        </Button>
      </Box>
    </VStack>
  )
}

export default InterviewSignupForm
