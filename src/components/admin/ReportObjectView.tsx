import React from 'react';
import {
  Member,
  ReportObject,
  ReportType,
  TechnicalQuestion,
} from '../../types';
import { ReportedMember } from './ReportedMember';
import { ReportedQuestion } from './ReportedQuestion';

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
    default:
      return <></>;
  }
};
