import React, { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Button,
  Select,
  useDisclosure,
  HStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useToast,
  Textarea,
} from '@chakra-ui/react';
import { TechnicalQuestion, Topic } from '../../types';
import {
  createNewTopic,
  createTechnicalQuestion,
  getTopics,
  updateTechnicalQuestion,
} from '../../services/question';
import { Field, FieldProps, Form, Formik } from 'formik';

interface TechnicalQuestionCreateEditProps {
  questionDetails?: Partial<TechnicalQuestion>;
}

const TechnicalQuestionCreateEdit: React.FC<
  TechnicalQuestionCreateEditProps
> = ({ questionDetails = {} }) => {
  const [question, setQuestion] =
    useState<Partial<TechnicalQuestion>>(questionDetails);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const [isUpdate, setIsUpdate] = useState<boolean>(
    questionDetails.questionId !== undefined
  );

  const saveQuestion = isUpdate
    ? updateTechnicalQuestion
    : createTechnicalQuestion;

  const onSave = (question: Partial<TechnicalQuestion>) => {
    saveQuestion(question)
      .then((question) => {
        toast({
          title: `Question ${isUpdate ? 'updated' : 'created'} successfully`,
          status: 'success',
          duration: 2000,
        });
        setQuestion(question);
        setIsUpdate(true);
      })
      .catch((error) => {
        toast({
          title: `Error ${isUpdate ? 'updating' : 'creating'} question`,
          description: JSON.stringify(error),
          status: 'error',
          duration: 2000,
        });
      });
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setQuestion((prevQuestion) => ({
      ...prevQuestion,
      [name]: value,
    }));
  };

  const createTopic = async (topic: string) => {
    try {
      setIsLoading(true);
      const newTopic = await createNewTopic(topic);
      setTopics((topics) => [...topics, newTopic]);
      onClose();
      toast({
        title: `Topic created.`,
        status: 'success',
        duration: 9000,
        isClosable: true,
      });
      setIsLoading(false);
    } catch {
      toast({
        title: `Error creating topic`,
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
      setIsLoading(false);
    }
  };

  const handleSave = () => {
    onSave(question);
  };

  useEffect(() => {
    setIsLoading(true);
    getTopics()
      .then((values) => setTopics(values))
      .catch()
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create new topic</ModalHeader>
          <ModalCloseButton />
          <Formik
            initialValues={{ topic: '' }}
            onSubmit={(values) => {
              createTopic(values.topic);
            }}
          >
            <Form>
              <ModalBody>
                <FormControl>
                  <FormLabel colorScheme="brand">Topic name</FormLabel>
                  <Field name="topic">
                    {({ field }: FieldProps) => (
                      <Input
                        {...field}
                        placeholder="Enter the topic name"
                        disabled={isLoading}
                      />
                    )}
                  </Field>
                </FormControl>
              </ModalBody>

              <ModalFooter>
                <Button colorScheme="blue" mr={3} type="submit">
                  Save
                </Button>
                <Button variant="ghost" onClick={onClose}>
                  Cancel
                </Button>
              </ModalFooter>
            </Form>
          </Formik>
        </ModalContent>
      </Modal>

      <Box p={8} borderRadius="xl" boxShadow="lg">
        <VStack spacing={6}>
          <FormControl>
            <FormLabel colorScheme="brand">Question title</FormLabel>
            <Input
              colorScheme="brand"
              name="title"
              value={question.title || ''}
              onChange={handleChange}
              placeholder="Enter the question title"
            />
          </FormControl>

          <FormControl>
            <FormLabel colorScheme="brand">Topic</FormLabel>
            <HStack>
              <Select
                placeholder="Select option"
                value={question.topic || ''}
                onChange={handleChange}
                name="topic"
              >
                {topics.map(({ topicId, name }) => (
                  <option key={topicId} value={topicId}>
                    {name}
                  </option>
                ))}
              </Select>
              <Button onClick={onOpen} colorScheme="teal">
                Create New
              </Button>
            </HStack>
          </FormControl>

          <FormControl>
            <FormLabel colorScheme="brand">Prompt</FormLabel>
            <Textarea
              colorScheme="brand"
              name="prompt"
              value={question.prompt || ''}
              onChange={handleChange}
              placeholder="Enter the prompt"
            />
          </FormControl>

          <FormControl>
            <FormLabel colorScheme="brand">Solution</FormLabel>
            <Textarea
              colorScheme="brand"
              name="solution"
              value={question.solution || ''}
              onChange={handleChange}
              placeholder="Enter the solution"
            />
          </FormControl>

          <FormControl>
            <FormLabel colorScheme="brand">Follow ups</FormLabel>
            <Textarea
              colorScheme="brand"
              name="followUps"
              value={question.followUps || ''}
              onChange={handleChange}
              placeholder="Enter the follow ups"
            />
          </FormControl>

          <FormControl>
            <FormLabel colorScheme="brand">Source</FormLabel>
            <Input
              colorScheme="brand"
              name="source"
              value={question.source || ''}
              onChange={handleChange}
              placeholder="Enter the source URL"
            />
          </FormControl>
          <Button colorScheme="brand" onClick={handleSave}>
            Save Changes
          </Button>
        </VStack>
      </Box>
    </>
  );
};

export default TechnicalQuestionCreateEdit;
