import { useEffect, useState } from 'react';
import {
  Input,
  Select,
  Spinner,
  Text,
  VStack,
  Box,
  Heading,
  Collapse,
  Button,
  useToast,
  HStack,
} from '@chakra-ui/react';
import { getAllReport } from '../../services/report';
import { Report, ReportType } from '../../types';
import { devPrint } from '../../components/utils/RandomUtils';

const ReportDashboard = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [filterType, setFilterType] = useState<ReportType | ''>('');
  const [filterUserId, setFilterUserId] = useState<number | ''>('');
  const [expandedReportId, setExpandedReportId] = useState<string | null>(null);
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

  const filteredReports = reports.filter((report) => {
    return (
      (filterType === '' || report.type === filterType) &&
      (filterUserId === '' || report.reporterUserId === filterUserId) &&
      report.reason.toLowerCase().includes(searchKeyword.toLowerCase())
    );
  });

  return (
    <VStack spacing={6} align="stretch">
      <Box borderWidth={1} borderRadius="lg" p={6} boxShadow="md">
        <VStack spacing={4} align="stretch">
          <Heading size="lg">Report Dashboard</Heading>
          <Input
            placeholder="Search by reason"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
          />
          <Select
            placeholder="Filter by category"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as ReportType)}
          >
            <option value="interview">Interview</option>
            <option value="question">Question</option>
          </Select>
          <Input
            placeholder="Filter by user ID"
            value={filterUserId}
            onChange={(e) =>
              setFilterUserId(e.target.value ? parseInt(e.target.value) : '')
            }
          />
          {loading ? (
            <Spinner />
          ) : (
            filteredReports.map((report) => (
              <Box
                key={report.reportId}
                borderWidth={1}
                borderRadius="lg"
                p={4}
                boxShadow="md"
              >
                <HStack justify={'space-between'}>
                  <Text fontWeight="bold">{report.reason}</Text>
                  <Button
                    onClick={() =>
                      setExpandedReportId(
                        expandedReportId === report.reportId
                          ? null
                          : report.reportId
                      )
                    }
                  >
                    {expandedReportId === report.reportId
                      ? 'Hide Details'
                      : 'View Details'}
                  </Button>
                </HStack>
                <Collapse
                  unmountOnExit
                  in={expandedReportId === report.reportId ? true : false}
                >
                  <Box mt={4} bg="gray.50" p={4} borderRadius="md">
                    <VStack align="stretch" spacing={2}>
                      <HStack justify={'space-between'}>
                        <Text>
                          <a href={`/directory/${report.reporterUserId}`}>
                            <strong>From user: </strong>
                            {report.reporterUserId}
                          </a>
                        </Text>
                        <Button
                          as="a"
                          href={`/directory/${report.reporterUserId}`}
                          colorScheme="blue"
                        >
                          Go to User
                        </Button>
                      </HStack>
                      <Text>
                        <strong>Type:</strong> {report.type}
                      </Text>
                      <Text>
                        <strong>Status:</strong> {report.status}
                      </Text>
                      <Text>
                        <strong>Created:</strong> {report.created}
                      </Text>
                      <Text>
                        <strong>Updated:</strong> {report.updated}
                      </Text>
                      <Text>
                        <strong>Admin Notes:</strong> {report.adminNotes}
                      </Text>
                    </VStack>
                  </Box>
                </Collapse>
              </Box>
            ))
          )}
        </VStack>
      </Box>
    </VStack>
  );
};

export default ReportDashboard;