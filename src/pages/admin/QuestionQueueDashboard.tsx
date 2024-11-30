import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  VStack,
  HStack,
  Box,
  Heading,
  Text,
  Spinner,
  Center,
  Button,
  Badge,
  Card,
  CardHeader,
  CardBody,
  Grid,
  GridItem,
  useToast,
  IconButton,
  Switch,
  FormControl,
  FormLabel,
  Tooltip,
} from '@chakra-ui/react';
import {
  getTechnicalQuestions,
  updateTechnicalQuestionQueue,
  getTechnicalQuestionQueue,
  getBehavioralQuestionQueue,
  updateBehavioralQuestionQueue,
  getBehavioralQuestions,
} from '../../services/question';
import {
  BaseQuestion,
  Question,
  QuestionType,
  TechnicalQuestion,
} from '../../types';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { formatDate } from '../../localization';

interface UseQuestionQueueProps {
  questionType: QuestionType;
}

interface UseQuestionQueue<T> {
  questions: T[];
  queuedQuestionIds: string[];
  loading: boolean;
  isEditMode: boolean;
  isDirty: boolean;
  draggedQuestion: T | null;
  setIsEditMode: (value: boolean) => void;
  setDraggedQuestion: (question: T | null) => void;
  handleSaveQueue: () => Promise<void>;
  moveQuestion: (questionId: string, direction: 'up' | 'down') => void;
  addToQueue: (questionId: string, index?: number) => void;
  removeFromQueue: (questionId: string) => void;
}

function useQuestionQueue<T extends BaseQuestion>({
  questionType,
}: UseQuestionQueueProps): UseQuestionQueue<T> {
  const [questions, setQuestions] = useState<T[]>([]);
  const [queuedQuestionIds, setQueuedQuestionIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [draggedQuestion, setDraggedQuestion] = useState<T | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const toast = useToast();

  const getQuestions = useCallback(() => {
    return questionType === QuestionType.Technical
      ? getTechnicalQuestions()
      : getBehavioralQuestions();
  }, [questionType]);

  const getQueue = useCallback(() => {
    return questionType === QuestionType.Technical
      ? getTechnicalQuestionQueue()
      : getBehavioralQuestionQueue();
  }, [questionType]);

  const updateQueue = useCallback(
    (ids: string[]) => {
      return questionType === QuestionType.Technical
        ? updateTechnicalQuestionQueue(ids)
        : updateBehavioralQuestionQueue(ids);
    },
    [questionType]
  );

  const loadData = async () => {
    try {
      setLoading(true);
      const [fetchedQuestions, queue] = await Promise.all([
        getQuestions(),
        getQueue(),
      ]);

      setQuestions(fetchedQuestions as unknown as T[]);
      setQueuedQuestionIds(queue);
      setLoading(false);
    } catch (error) {
      toast({
        title: 'Failed to load data',
        status: 'error',
        duration: 3000,
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [questionType]);

  const handleSaveQueue = async () => {
    try {
      await updateQueue(queuedQuestionIds);
      setIsDirty(false);
      await loadData();
      toast({
        title: 'Queue updated successfully',
        status: 'success',
        duration: 2000,
      });
    } catch (err) {
      toast({
        title: 'Failed to update queue',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const moveQuestion = (questionId: string, direction: 'up' | 'down') => {
    const currentIndex = queuedQuestionIds.indexOf(questionId);
    if (currentIndex === -1) return;

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= queuedQuestionIds.length) return;

    const newOrder = [...queuedQuestionIds];
    [newOrder[currentIndex], newOrder[newIndex]] = [
      newOrder[newIndex],
      newOrder[currentIndex],
    ];
    setQueuedQuestionIds(newOrder);
    setIsDirty(true);
  };

  const addToQueue = (questionId: string, index?: number) => {
    if (!queuedQuestionIds.includes(questionId)) {
      const newQueuedIds = [...queuedQuestionIds];
      if (typeof index === 'number') {
        newQueuedIds.splice(index, 0, questionId);
      } else {
        newQueuedIds.push(questionId);
      }
      setQueuedQuestionIds(newQueuedIds);
      setIsDirty(true);
      toast({
        title: 'Question added to queue',
        status: 'success',
        duration: 1000,
      });
    }
  };

  const removeFromQueue = (questionId: string) => {
    setQueuedQuestionIds((current) =>
      current.filter((id) => id !== questionId)
    );
    setIsDirty(true);
    toast({
      title: 'Question removed from queue',
      status: 'success',
      duration: 1000,
    });
  };

  return {
    questions,
    queuedQuestionIds,
    loading,
    isEditMode,
    isDirty,
    draggedQuestion,
    setIsEditMode,
    setDraggedQuestion,
    handleSaveQueue,
    moveQuestion,
    addToQueue,
    removeFromQueue,
  };
}

interface QuestionCardProps<T extends BaseQuestion> {
  question: T;
  queueIndex?: number;
  isEditMode: boolean;
  queuedQuestionIdsLength: number;
  onDragStart: (question: T) => void;
  onDragOver: (e: React.DragEvent, index?: number) => void;
  onDrop: (e: React.DragEvent, index?: number) => void;
  onAdd: (questionId: string) => void;
  onMove: (questionId: string, direction: 'up' | 'down') => void;
  onRemove: (questionId: string) => void;
}

function QuestionCard<T extends BaseQuestion>({
  question,
  queueIndex,
  isEditMode,
  queuedQuestionIdsLength,
  onDragStart,
  onDragOver,
  onDrop,
  onAdd,
  onMove,
  onRemove,
}: QuestionCardProps<T>) {
  const getTitle = () => {
    if ('title' in question) {
      return (question as unknown as TechnicalQuestion).title;
    }
    return question.prompt.substring(0, 100) + '...';
  };

  return (
    <Card
      draggable={isEditMode}
      onDragStart={() => onDragStart(question)}
      w="full"
      variant="outline"
      _hover={
        isEditMode
          ? {
              shadow: 'md',
              cursor: typeof queueIndex === 'undefined' ? 'pointer' : 'grab',
            }
          : undefined
      }
      transition="all 0.2s"
      onDragOver={(e) => onDragOver(e, queueIndex)}
      onDrop={(e) => onDrop(e, queueIndex)}
      onClick={() => {
        if (isEditMode && typeof queueIndex === 'undefined') {
          onAdd(question.questionId);
        }
      }}
    >
      <CardHeader>
        <HStack justify="space-between">
          <Heading size="sm" noOfLines={2}>
            {getTitle()}
          </Heading>
          <HStack>
            {isEditMode && typeof queueIndex === 'number' && (
              <>
                <Tooltip label="Move Up">
                  <IconButton
                    aria-label="Move Up"
                    icon={<Text>↑</Text>}
                    size="sm"
                    isDisabled={queueIndex === 0}
                    onClick={(e) => {
                      e.stopPropagation();
                      onMove(question.questionId, 'up');
                    }}
                  />
                </Tooltip>
                <Tooltip label="Move Down">
                  <IconButton
                    aria-label="Move Down"
                    icon={<Text>↓</Text>}
                    size="sm"
                    isDisabled={queueIndex === queuedQuestionIdsLength - 1}
                    onClick={(e) => {
                      e.stopPropagation();
                      onMove(question.questionId, 'down');
                    }}
                  />
                </Tooltip>
                <Tooltip label="Remove from Queue">
                  <IconButton
                    aria-label="Remove"
                    icon={<Text>×</Text>}
                    size="sm"
                    colorScheme="red"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemove(question.questionId);
                    }}
                  />
                </Tooltip>
              </>
            )}
          </HStack>
        </HStack>
      </CardHeader>
      <CardBody pt={0}>
        <HStack spacing={2} wrap="wrap">
          {'topicName' in question && (
            <Badge colorScheme="blue">
              {(question as unknown as TechnicalQuestion).topicName}
            </Badge>
          )}
          <Badge colorScheme="gray">{formatDate(question.created)}</Badge>
          {typeof queueIndex === 'number' && (
            <Badge colorScheme="green">#{queueIndex + 1} in queue</Badge>
          )}
          {isEditMode && typeof queueIndex === 'undefined' && (
            <Badge colorScheme="purple">Click to add to queue</Badge>
          )}
        </HStack>
      </CardBody>
    </Card>
  );
}

interface QuestionQueueDashboardProps {
  questionType: QuestionType;
}

function QuestionQueueDashboard({ questionType }: QuestionQueueDashboardProps) {
  const {
    questions,
    queuedQuestionIds,
    loading,
    isEditMode,
    isDirty,
    draggedQuestion,
    setIsEditMode,
    setDraggedQuestion,
    handleSaveQueue,
    moveQuestion,
    addToQueue,
    removeFromQueue,
  } = useQuestionQueue<Question>({ questionType });

  const handleDragOver = (e: React.DragEvent, _index?: number) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, index?: number) => {
    e.preventDefault();
    if (!draggedQuestion) return;
    addToQueue(draggedQuestion.questionId, index);
    setDraggedQuestion(null);
  };

  if (loading) {
    return (
      <Center h="100vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  return (
    <Box p={6}>
      <VStack spacing={6} align="stretch">
        <Button
          as={Link}
          to="/admin"
          colorScheme="blue"
          leftIcon={<ArrowBackIcon />}
          w="fit-content"
          mb="16px"
        >
          Go Back
        </Button>
        <HStack justify="space-between">
          <Heading size="lg">
            {questionType === QuestionType.Technical
              ? QuestionType.Technical
              : QuestionType.Behavioral}{' '}
            Question Queue
          </Heading>
          <HStack spacing={4}>
            <FormControl display="flex" alignItems="center">
              <FormLabel htmlFor="edit-mode" mb="0">
                Edit Mode
              </FormLabel>
              <Switch
                id="edit-mode"
                isChecked={isEditMode}
                onChange={(e) => setIsEditMode(e.target.checked)}
              />
            </FormControl>
            {isEditMode && (
              <Button
                colorScheme="blue"
                isDisabled={!isDirty}
                onClick={handleSaveQueue}
              >
                Save Changes
              </Button>
            )}
            <Button
              as={Link}
              to={`/questions/${questionType}/create`}
              colorScheme="green"
              leftIcon={<Text>+</Text>}
            >
              Create Question
            </Button>
          </HStack>
        </HStack>

        {isEditMode ? (
          <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={6}>
            <GridItem>
              <VStack align="stretch" spacing={4}>
                <Heading size="md">Available Questions</Heading>
                <Text color="gray.600">
                  Click or drag questions to add them to the queue
                </Text>
                <VStack align="stretch" spacing={4}>
                  {questions
                    .filter((q) => !queuedQuestionIds.includes(q.questionId))
                    .map((question) => (
                      <QuestionCard
                        key={question.questionId}
                        question={question}
                        isEditMode={isEditMode}
                        queuedQuestionIdsLength={queuedQuestionIds.length}
                        onDragStart={setDraggedQuestion}
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                        onAdd={addToQueue}
                        onMove={moveQuestion}
                        onRemove={removeFromQueue}
                      />
                    ))}
                </VStack>
              </VStack>
            </GridItem>

            <GridItem>
              <VStack
                align="stretch"
                spacing={4}
                p={4}
                border="2px"
                borderStyle="dashed"
                borderColor="gray.200"
                borderRadius="lg"
                minH="200px"
                bg={draggedQuestion ? 'gray.50' : 'transparent'}
                transition="all 0.2s"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                <Heading size="md">Queue</Heading>
                {queuedQuestionIds.length === 0 ? (
                  <Center h="150px">
                    <Text color="gray.500">
                      Drag or click questions to add them to the queue
                    </Text>
                  </Center>
                ) : (
                  <VStack align="stretch" spacing={4}>
                    {queuedQuestionIds.map((id, index) => {
                      const question = questions.find(
                        (q) => q.questionId === id
                      );
                      if (!question) return null;
                      return (
                        <QuestionCard
                          key={question.questionId}
                          question={question}
                          queueIndex={index}
                          isEditMode={isEditMode}
                          queuedQuestionIdsLength={queuedQuestionIds.length}
                          onDragStart={setDraggedQuestion}
                          onDragOver={handleDragOver}
                          onDrop={handleDrop}
                          onAdd={addToQueue}
                          onMove={moveQuestion}
                          onRemove={removeFromQueue}
                        />
                      );
                    })}
                  </VStack>
                )}
              </VStack>
            </GridItem>
          </Grid>
        ) : (
          <VStack align="stretch" spacing={4}>
            <Heading size="md">Current Queue</Heading>
            {queuedQuestionIds.length === 0 ? (
              <Center
                h="150px"
                border="1px"
                borderColor="gray.200"
                borderRadius="lg"
              >
                <Text color="gray.500">No questions in the queue</Text>
              </Center>
            ) : (
              <VStack align="stretch" spacing={4}>
                {queuedQuestionIds.map((id, index) => {
                  const question = questions.find((q) => q.questionId === id);
                  if (!question) return null;
                  return (
                    <QuestionCard
                      key={question.questionId}
                      question={question}
                      queueIndex={index}
                      isEditMode={isEditMode}
                      queuedQuestionIdsLength={queuedQuestionIds.length}
                      onDragStart={setDraggedQuestion}
                      onDragOver={handleDragOver}
                      onDrop={handleDrop}
                      onAdd={addToQueue}
                      onMove={moveQuestion}
                      onRemove={removeFromQueue}
                    />
                  );
                })}
              </VStack>
            )}
          </VStack>
        )}
      </VStack>
    </Box>
  );
}

export default QuestionQueueDashboard;
