import React, { useState } from 'react'
import { Box, Button, Heading, VStack, useColorModeValue, useTheme } from '@chakra-ui/react'
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

  const theme = useTheme()
  const bgColor = useColorModeValue('white', 'gray.800')
  const textColor = useColorModeValue('gray.800', 'white')
  const borderColor = useColorModeValue('gray.200', 'gray.600')
  const selectedColor = useColorModeValue(theme.colors.teal[500], theme.colors.teal[200])
  const unselectedColor = useColorModeValue(theme.colors.gray[100], theme.colors.gray[700])

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
            selectedColor={selectedColor}
            unselectedColor={unselectedColor}
            titleStyle={{ color: textColor, fontSize: theme.fontSizes.xl, fontWeight: 'bold' }}
            boxStyle={{ borderColor: borderColor, borderWidth: '1px', borderRadius: theme.radii.lg, padding: theme.space[4] }}
            gridStyle={{ gap: theme.space[1] }}
            dayLabelStyle={{ color: textColor, fontSize: theme.fontSizes.sm, fontWeight: 'medium' }}
            timeLabelStyle={{ color: textColor, fontSize: theme.fontSizes.xs }}
            timeSlotStyle={{
              borderRadius: theme.radii.sm,
              transition: 'background-color 0.2s',
              cursor: 'pointer',
              ':hover': {
                backgroundColor: useColorModeValue(theme.colors.gray[200], theme.colors.gray[600])
              }
            }}
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
    <VStack spacing={6} align='stretch' bg={bgColor} p={6} borderRadius="lg">
      <Heading as='h1' size='xl' textAlign='center' mb={6} color={textColor}>
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
          onClick={currentStep === steps.length - 1 ? handleConfirm : handleNext}
          colorScheme="teal"
        >
          {currentStep === steps.length - 1 ? 'Submit' : 'Next'}
        </Button>
      </Box>
    </VStack>
  )
}

export default InterviewSignupForm