import { useEffect, useState } from 'react';
import {
  Input,
  Select,
  Spinner,
  VStack,
  Box,
  Heading,
  useToast,
} from '@chakra-ui/react';
import { getAllReport } from '../../services/report';
import { Report, ReportType } from '../../types';
import { devPrint } from '../../components/utils/RandomUtils';
import { ReportView } from '../../components/admin/ReportView';
import { useAdmins } from '../../hooks/admin/useAdmins';

const ReportDashboard = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [filterType, setFilterType] = useState<ReportType>();
  const [filterUserId, setFilterUserId] = useState<number>();
  const toast = useToast();

  const { isLoading: adminLoading, adminList } = useAdmins();

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
      (!filterUserId || report.reporter.id === filterUserId) &&
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
            <option value="member">Member</option>
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
          {loading || adminLoading ? (
            <Spinner />
          ) : (
            filteredReports.map((report) => (
              <ReportView
                adminList={adminList}
                key={report.reportId}
                {...report}
              />
            ))
          )}
        </VStack>
      </Box>
    </VStack>
  );
};

export default ReportDashboard;
