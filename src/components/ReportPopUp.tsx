import React, { useState } from 'react';
import { ReportBody } from '../types';
import {
  Badge,
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  FormControl,
  FormLabel,
  Heading,
  Stack,
  Text,
  Textarea,
  VStack,
  useToast,
} from '@chakra-ui/react';
import { createReport } from '../services/report';
import { devPrint } from './utils/RandomUtils';

interface ReportPopUpProps {
  associatedId: string;
  reporterUserId: number | undefined;
  onClose: () => void;
}

const ReportPopUp: React.FC<ReportPopUpProps> = ({
  associatedId,
  reporterUserId,
  onClose,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const [formData, setFormData] = useState<ReportBody>({
    associatedId: associatedId,
    reporterUserId: reporterUserId,
    type: 'interview',
    reason: '',
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await createReport(formData);

      toast({
        title: 'Report submitted successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      devPrint(res);
    } catch (err) {
      devPrint(err);
      toast({
        title: 'Error submitting report',
        description: 'Please try again later',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box p={4} maxH="800px" mx="auto" boxSize={'xl'}>
      <Card variant="outline" boxShadow="lg" borderRadius="lg">
        <CardHeader pb={0}>
          <Heading size="md" color="blue.600">
            Submit Report
          </Heading>
        </CardHeader>

        <CardBody maxH="500px">
          <form onSubmit={handleSubmit}>
            <VStack spacing={2} align="stretch">
              <Stack spacing={4}>
                <FormControl>
                  <FormLabel color="gray.700" fontWeight="medium">
                    Associated ID
                  </FormLabel>
                  <Box
                    p={3}
                    bg="gray.50"
                    borderRadius="md"
                    border="1px"
                    borderColor="gray.200"
                  >
                    <Text color="gray.700" fontSize="md">
                      {associatedId}
                    </Text>
                  </Box>
                </FormControl>

                <FormControl>
                  <FormLabel color="gray.700" fontWeight="medium">
                    Reporter User ID
                  </FormLabel>
                  <Box
                    p={3}
                    bg="gray.50"
                    borderRadius="md"
                    border="1px"
                    borderColor="gray.200"
                  >
                    <Badge colorScheme="blue" fontSize="md">
                      {reporterUserId}
                    </Badge>
                  </Box>
                </FormControl>
              </Stack>

              <Divider />

              <FormControl isRequired isDisabled={isLoading}>
                <FormLabel color="gray.700" fontWeight="medium">
                  Reason for Report
                </FormLabel>
                <Textarea
                  value={formData.reason}
                  onChange={handleChange}
                  placeholder="Please provide detailed information about your report..."
                  size="lg"
                  minH="150px"
                  name="reason"
                  id="reason"
                  bg="white"
                  border="1px"
                  borderColor="gray.300"
                  _hover={{
                    borderColor: 'blue.400',
                  }}
                  _focus={{
                    borderColor: 'blue.500',
                    boxShadow: '0 0 0 1px var(--chakra-colors-blue-500)',
                  }}
                />
              </FormControl>

              <Button
                type="submit"
                colorScheme="blue"
                size="lg"
                width="full"
                mt={4}
                fontWeight="medium"
                isLoading={isLoading}
                loadingText="Submitting..."
                _hover={{
                  transform: 'translateY(-1px)',
                  boxShadow: 'lg',
                }}
                transition="all 0.2s"
              >
                Submit Report
              </Button>
              <Button variant="ghost" onClick={onClose}>
                Cancel
              </Button>
            </VStack>
          </form>
        </CardBody>
      </Card>
    </Box>
  );
};

export default ReportPopUp;
