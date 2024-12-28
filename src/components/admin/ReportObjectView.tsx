import React from 'react';
import {
  HydratedInterview,
  Member,
  ReportObject,
  ReportType,
  TechnicalQuestion,
} from '../../types';
import { ReportedMember } from './ReportedMember';
import { ReportedQuestion } from './ReportedQuestion';
import { ReportedInterview } from './ReportedInterview';

interface Props {
  type: ReportType;
  object: ReportObject;
}

export const ReportObjectView: React.FC<Props> = ({ type, object }) => {
  switch (type) {
    case ReportType.Member:
      return <ReportedMember member={object as Member} />;
    case ReportType.Question:
      return <ReportedQuestion question={object as TechnicalQuestion} />;
    case ReportType.Interview:
      return <ReportedInterview interview={object as HydratedInterview} />;
    default:
      return <></>;
  }
};
