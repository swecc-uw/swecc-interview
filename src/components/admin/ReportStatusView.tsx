import React from 'react';
import { ReportStatus } from '../../types';
import { Badge } from '@chakra-ui/react';

interface Props {
  status: ReportStatus;
}

export const ReportStatusView: React.FC<Props> = ({ status }) => {
  const getColorScheme = (status: ReportStatus) => {
    switch (status) {
      case ReportStatus.Completed:
        return 'green';
      case ReportStatus.Pending:
        return 'purple';
      case ReportStatus.Resolving:
        return 'blue';
    }
  };

  return (
    <Badge borderRadius="md" colorScheme={getColorScheme(status)}>
      {status}
    </Badge>
  );
};
