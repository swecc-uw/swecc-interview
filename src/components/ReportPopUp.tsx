import React, { useState } from 'react';
import { ReportBody, ReportType } from '../types';
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  FormControl,
  FormLabel,
  Heading,
  Stack,
  Textarea,
  VStack,
  useToast,
} from '@chakra-ui/react';
import { createReport } from '../services/report';
import { devPrint } from './utils/RandomUtils';
import { CloseIcon } from '@chakra-ui/icons';

interface ReportPopUpProps {
  associatedId: string;
  reporterUserId?: number;
  type: ReportType;
  onClose: () => void;
}

const ReportPopUp: React.FC<ReportPopUpProps> = ({
  associatedId,
  type,
  reporterUserId,
  onClose,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const [formData, setFormData] = useState<ReportBody>({
    associatedId: associatedId,
    reporterUserId: reporterUserId,
    type: type,
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
      const res = await createReport({
        ...formData,
        associatedId,
        reporterUserId,
      });

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
    <Card variant="outline" boxShadow="lg" borderRadius="lg">
      <Button
        position="absolute"
        top={2}
        right={2}
        onClick={onClose}
        variant="ghost"
      >
        <CloseIcon />
      </Button>
      <CardHeader pb={0}>
        <Heading size="md" color="blue.600">
          Submit Report
        </Heading>
      </CardHeader>

      <CardBody maxH="500px">
        <form onSubmit={handleSubmit}>
          <VStack spacing={2} align="stretch">
            <FormControl isRequired isDisabled={isLoading}>
              <FormLabel color="gray.700" fontWeight="medium">
                Report Type
              </FormLabel>
              <Stack direction="row" spacing={4}>
                <Badge
                  colorScheme="red"
                  variant={formData.type === 'interview' ? 'solid' : 'outline'}
                  cursor="pointer"
                  onClick={() =>
                    setFormData({ ...formData, type: 'interview' })
                  }
                >
                  Interview
                </Badge>
                <Badge
                  colorScheme="red"
                  variant={formData.type === 'question' ? 'solid' : 'outline'}
                  cursor="pointer"
                  onClick={() => setFormData({ ...formData, type: 'question' })}
                >
                  Question
                </Badge>
              </Stack>
              <Divider my={4} />

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
  );
};

export default ReportPopUp;
