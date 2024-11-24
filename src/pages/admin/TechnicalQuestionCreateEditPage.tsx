import { TechnicalQuestion } from '../../types';
import {
  Box,
  Container,
  Heading,
  VStack,
  HStack,
  Spinner,
  Button,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { devPrint } from '../../components/utils/RandomUtils';
import QuestionCreateEdit from '../../components/admin/TechnicalQuestionCreateEdit';
import { getTechnicalQuestion } from '../../services/question';
import { Link, useParams } from 'react-router-dom';
import { ArrowBackIcon } from '@chakra-ui/icons';

const TechnicalQuestionCreateEditPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [question, setQuestion] = useState<TechnicalQuestion>();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      setIsLoading(true);
      getTechnicalQuestion(id)
        .then((question) => {
          setQuestion(question);
        })
        .catch((err) => {
          devPrint('Failed to get question:', err);
        })
        .finally(() => setIsLoading(false));
    }
  }, [id]);

  return (
    <Container maxW="container.lg" py={8}>
      <Button
        as={Link}
        to="/questions/technical"
        colorScheme="blue"
        leftIcon={<ArrowBackIcon />}
        w="fit-content"
      >
        Back to Questions
      </Button>
      <Box p={6}>
        <VStack spacing={4} align="stretch">
          <HStack spacing={4}>
            <Heading as="h1" size="lg" flex="1">
              Create Question
            </Heading>
          </HStack>
          {isLoading ? (
            <Spinner />
          ) : (
            <QuestionCreateEdit questionDetails={question} />
          )}
        </VStack>
      </Box>
    </Container>
  );
};

export default TechnicalQuestionCreateEditPage;
