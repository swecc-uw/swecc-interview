import React, { useEffect, useState } from 'react';
import { Box, Heading, useToast, VStack } from '@chakra-ui/react';
import { getAllReport } from '../../services/report';
import { Report } from '../../types';
import { devPrint } from '../../components/utils/RandomUtils';

const ReportDashboard = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(false);
  const [signal, setSignal] = useState(false);
  const [response, setResponse] = useState('');
  const toast = useToast();

  useEffect(() => {
    setLoading(true);
    getAllReport()
      .then((res) => {
        setReports(res);
        setLoading(false);
      })
      .catch((error) => {
        devPrint(error);
        toast({
          title: 'Error',
          description: 'Failed to fetch reports',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        setLoading(false);
      });
  }, [toast]);

  return (
    <VStack spacing={6} align="stretch">
      <Box borderWidth={1} borderRadius="lg" p={6} boxShadow="md">
        <VStack spacing={4} align="stretch">
          <Heading size="lg">Report Dashboard</Heading>
        </VStack>
      </Box>
    </VStack>
  );
};

export default ReportDashboard;
