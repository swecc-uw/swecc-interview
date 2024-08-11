import { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  VStack,
  Text,
  InputGroup,
  InputRightElement,
  IconButton,
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';

interface AuthFormProps {
  isLogin: boolean;
  username: string;
  password: string;
  confirmPassword?: string;
  discordUsername?: string;
  error: string;
  successMessage: string;
  onUsernameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onConfirmPasswordChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDiscordUsernameChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

const AuthForm: React.FC<AuthFormProps> = ({
  isLogin,
  username,
  password,
  confirmPassword,
  discordUsername,
  error,
  successMessage,
  onUsernameChange,
  onPasswordChange,
  onConfirmPasswordChange,
  onDiscordUsernameChange,
  onSubmit,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form onSubmit={onSubmit}>
      <VStack spacing={4}>
        <FormControl isRequired>
          <FormLabel>Username</FormLabel>
          <Input
            type="text"
            value={username}
            onChange={onUsernameChange}
            placeholder="Enter your username"
          />
        </FormControl>
        {!isLogin && (
          <FormControl isRequired>
            <FormLabel>Discord Username</FormLabel>
            <Input
              type="text"
              value={discordUsername}
              onChange={onDiscordUsernameChange}
              placeholder="Enter your Discord username"
            />
          </FormControl>
        )}
        <FormControl isRequired>
          <FormLabel>Password</FormLabel>
          <InputGroup>
            <Input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={onPasswordChange}
              placeholder="Enter your password"
            />
            <InputRightElement>
              <IconButton
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                onClick={() => setShowPassword(!showPassword)}
                variant="ghost"
              />
            </InputRightElement>
          </InputGroup>
        </FormControl>
        {!isLogin && (
          <FormControl isRequired>
            <FormLabel>Confirm Password</FormLabel>
            <Input
              type="password"
              value={confirmPassword}
              onChange={onConfirmPasswordChange}
              placeholder="Confirm your password"
            />
          </FormControl>
        )}
        {error && <Text color="red.500">{error}</Text>}
        {successMessage && <Text color="green.500">{successMessage}</Text>}
        <Button type="submit" colorScheme="blue" width="full">
          {isLogin ? 'Login' : 'Register'}
        </Button>
      </VStack>
    </form>
  );
};

export default AuthForm;
