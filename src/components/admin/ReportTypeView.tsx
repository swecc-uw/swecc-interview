import React from 'react';
import { ReportType } from '../../types';
import { Badge } from '@chakra-ui/react';

interface Props {
  type: ReportType;
}

export const ReportTypeView: React.FC<Props> = ({ type }) => {
  const getColorScheme = (type: ReportType) => {
    switch (type) {
      case ReportType.Interview:
        return 'pink';
      case ReportType.Member:
        return 'yellow';
      case ReportType.Question:
        return 'cyan';
    }
  };

  return (
    <Badge borderRadius="md" colorScheme={getColorScheme(type)}>
      {type}
    </Badge>
  );
};
