import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Button,
  VStack,
  HStack,
  Input,
  Text,
  Card,
  CardBody,
  CardHeader,
  Heading,
  useColorModeValue,
} from '@chakra-ui/react';
import { Terminal, Trash } from 'lucide-react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { Link } from 'react-router-dom';
import api from '../../services/api';

type CommandResponse = {
  success?: boolean;
  output?: string;
  error?: string;
};

type HistoryEntry = {
  type: 'input' | 'output' | 'error';
  content: string;
  timestamp: string;
};

type ParsedCommand = {
  command: string;
  args: string[];
  kwargs: Record<string, string | boolean>;
};

export default function AdminTerminalPage() {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [currentInput, setCurrentInput] = useState<string>('');
  const [historyPosition, setHistoryPosition] = useState<number>();
  const [loading, setLoading] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  const promptColor = useColorModeValue('blue.500', 'blue.300');
  const outputBg = useColorModeValue('gray.50', 'gray.800');
  const errorColor = useColorModeValue('red.500', 'red.300');

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
      inputRef.current?.focus();
    }
  }, [history]);

  const parseCommand = (input: string): ParsedCommand => {
    const parts = input.trim().split(/\s+/); // split on all whitespace not just single
    const command = parts[0];
    const args: string[] = [];
    const kwargs: Record<string, string | boolean> = {};

    for (let i = 1; i < parts.length; i++) {
      const part = parts[i];
      if (part.startsWith('--')) {
        const [key, value] = part.slice(2).split('=');
        if (value !== undefined) {
          kwargs[key] = value;
        } else if (i + 1 < parts.length && !parts[i + 1].startsWith('-')) {
          kwargs[key] = parts[i + 1];
          i++;
        } else {
          kwargs[key] = true;
        }
      } else if (part.startsWith('-')) {
        kwargs[part.slice(1)] = true;
      } else {
        args.push(part);
      }
    }

    return { command, args, kwargs };
  };

  const executeCommand = async (input: string): Promise<void> => {
    setLoading(true);
    try {
      const { command, args, kwargs } = parseCommand(input);

      setHistory((prev) => [
        ...prev,
        {
          type: 'input',
          content: input,
          timestamp: new Date().toISOString(),
        },
      ]);

      if (command === 'clear') {
        setHistory([]);
        setLoading(false);
        return;
      } else if (command === 'help') {
        const helpRes = await api.get<{
          available_commands: { name: string; description: string }[];
        }>('/admin/command/');

        if (helpRes.data['available_commands']) {
          setHistory((prev) => [
            ...prev,
            {
              type: 'output',
              content: helpRes.data.available_commands
                .map((c) => `${c.name}: ${c.description}`)
                .join('\n'),
              timestamp: new Date().toISOString(),
            },
          ]);
        }
        setLoading(false);
        return;
      }

      const response = await api.post<CommandResponse>('/admin/command/', {
        command,
        args,
        kwargs,
      });

      if (response.data.error)
        setHistory((prev) => [
          ...prev,
          {
            type: 'error',
            content: response.data.error || 'An unknown error occurred',
            timestamp: new Date().toISOString(),
          },
        ]);

      if (response.data.output)
        setHistory((prev) => [
          ...prev,
          {
            type: 'output',
            content: response.data.output || '',
            timestamp: new Date().toISOString(),
          },
        ]);
    } catch (error) {
      setHistory((prev) => [
        ...prev,
        {
          type: 'error',
          content:
            error instanceof Error
              ? error.message
              : 'An unknown error occurred',
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    const inputHistory = history.filter((h) => h.type === 'input');

    if (e.key === 'Enter' && currentInput.trim() && !loading) {
      e.preventDefault();
      executeCommand(currentInput);
      setCurrentInput('');
      setHistoryPosition(undefined);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (inputHistory.length === 0) return;

      const newPosition =
        historyPosition === undefined
          ? 0
          : Math.min(historyPosition + 1, inputHistory.length - 1);

      setHistoryPosition(newPosition);
      setCurrentInput(
        inputHistory[inputHistory.length - 1 - newPosition].content
      );
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyPosition === undefined) return;

      if (historyPosition === 0) {
        setHistoryPosition(undefined);
        setCurrentInput('');
      } else {
        const newPosition = historyPosition - 1;
        setHistoryPosition(newPosition);
        setCurrentInput(
          inputHistory[inputHistory.length - 1 - newPosition].content
        );
      }
    }
  };

  const clearHistory = () => {
    setHistory([]);
    setHistoryPosition(undefined);
  };

  return (
    <Box p={4}>
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
          <Heading size="lg">Management Console</Heading>
          {history.length > 0 && (
            <Button
              leftIcon={<Trash size={16} />}
              variant="ghost"
              colorScheme="red"
              size="sm"
              onClick={clearHistory}
            >
              Clear History
            </Button>
          )}
        </HStack>

        <Card>
          <CardHeader>
            <HStack>
              <Terminal size={20} />
            </HStack>
          </CardHeader>
          <CardBody>
            <Box
              ref={terminalRef}
              height="500px"
              overflowY="auto"
              fontFamily="mono"
              fontSize="sm"
              bg={outputBg}
              p={4}
              borderRadius="md"
            >
              <VStack align="stretch" spacing={2}>
                {history.map((entry, i) => (
                  <Box key={i}>
                    {entry.type === 'input' ? (
                      <Text color={promptColor}>$ {entry.content}</Text>
                    ) : entry.type === 'error' ? (
                      <Text color={errorColor}>{entry.content}</Text>
                    ) : (
                      <Text color="gray.700" whiteSpace="pre-wrap">
                        {entry.content}
                      </Text>
                    )}
                  </Box>
                ))}
              </VStack>

              <HStack mt={2}>
                <Text color={promptColor}>$</Text>
                <Input
                  ref={inputRef}
                  value={currentInput}
                  onChange={(e) => setCurrentInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  variant="unstyled"
                  placeholder="Enter command..."
                  spellCheck={false}
                  disabled={loading}
                  _disabled={{ opacity: 0.7 }}
                  _focus={{ outline: 'none' }}
                />
              </HStack>
            </Box>
          </CardBody>
        </Card>
      </VStack>
    </Box>
  );
}
