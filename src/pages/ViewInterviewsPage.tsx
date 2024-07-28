import React, { useEffect, useState } from 'react'
import { Box, Heading, VStack, useToast } from '@chakra-ui/react'
import { Interview } from '../types'
import { InterviewPreview } from '../components/InterviewPreview'
import { getInterviewsForUser } from '../services/mock/interview'
import { useMember } from '../context/MemberContex'

export const ViewInterviewsPage: React.FC = () => {
  const [interviews, setInterviews] = useState<Interview[]>([])
  const { member } = useMember()
  const toast = useToast()

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        if (member) {
          const fetchedInterviews = await getInterviewsForUser(
            member.user.id.toString()
          )
          setInterviews(fetchedInterviews)
        }
      } catch (error) {
        toast({
          title: 'Error fetching interviews',
          description: 'Please try again later.',
          status: 'error',
          duration: 5000,
          isClosable: true
        })
      }
    }

    fetchInterviews()
  }, [member, toast])

  return (
    <Box maxWidth='800px' margin='auto' p={4}>
      <Heading mb={6}>My Interviews</Heading>
      <VStack spacing={4} align='stretch'>
        {interviews.map(interview => (
          <InterviewPreview key={interview.interviewId} interview={interview} />
        ))}
      </VStack>
    </Box>
  )
}
