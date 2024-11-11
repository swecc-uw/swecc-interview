import React, { useState } from 'react';
import { VStack } from '@chakra-ui/react';
import { TechnicalQuestion } from '../../types';
import TechnicalQuestionCard from './TechnicalQuestionCard';

interface TechnicalQuestionListProps {
  questions: TechnicalQuestion[];
}

const TechnicalQuestionList: React.FC<TechnicalQuestionListProps> = ({
  questions,
}) => {
  const [expandedQuestionId, setExpandedQuestionId] = useState<string>();

  const toggleExpand = (questionId: string) => {
    setExpandedQuestionId((prevId) =>
      prevId === questionId ? undefined : questionId
    );
  };

  return (
    <VStack className="space-y-4">
      {questions.map((question) => (
        <TechnicalQuestionCard
          key={question.questionId}
          question={question}
          isExpanded={expandedQuestionId === question.questionId}
          onToggleExpand={toggleExpand}
        />
      ))}
    </VStack>
  );
};

export default TechnicalQuestionList;
