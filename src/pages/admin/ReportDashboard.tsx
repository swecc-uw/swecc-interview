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
import { Link } from 'react-router-dom';
import { formatDate } from '../../localization';

const ReportDashboard = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [filterType, setFilterType] = useState<ReportType>();
  const [filterUserId, setFilterUserId] = useState<number>();
  const [expandedReportId, setExpandedReportId] = useState<string>();
  const toast = useToast();

  useEffect(() => {
    setLoading(true);
    getAllReport()
      .then((res) => {
        setReports(res);
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
      })
      .finally(() => {
        setLoading(false);
      });
  }, [toast]);

  const filteredReports = reports.filter((report) => {
    return (
      (!filterType || report.type === filterType) &&
      (!filterUserId || report.reporterUserId === filterUserId) &&
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
              setFilterUserId(
                e.target.value ? parseInt(e.target.value) : undefined
              )
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
                <HStack justify="space-between">
                  <Text fontWeight="bold">{report.reason}</Text>
                  <Button
                    onClick={() =>
                      setExpandedReportId((prev) =>
                        prev === report.reportId ? undefined : report.reportId
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
                  in={expandedReportId === report.reportId}
                >
                  <Box mt={4} bg="gray.50" p={4} borderRadius="md">
                    <VStack align="stretch" spacing={2}>
                      <HStack justify="space-between">
                        <Text>
                          <Link to={`/directory/${report.reporterUserId}`}>
                            <strong>From user: </strong>
                            {report.reporterUserId}
                          </Link>
                        </Text>
                        <Button
                          as={Link}
                          to={`/directory/${report.reporterUserId}`}
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
                        <strong>Created:</strong> {formatDate(report.created)}
                      </Text>
                      <Text>
                        <strong>Updated:</strong> {formatDate(report.updated)}
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
