import {
  Text,
  useClipboard,
  HStack,
  Tooltip,
  IconButton,
} from '@chakra-ui/react';
import { Check, Copy } from 'lucide-react';

const CopyableText = ({ text }: { text: string }) => {
  const { hasCopied, onCopy } = useClipboard(text);

  return (
    <HStack spacing={2}>
      <Text flex="1">{text}</Text>
      <Tooltip label={hasCopied ? 'Copied!' : 'Copy'} placement="top">
        <IconButton
          aria-label="Copy text"
          icon={hasCopied ? <Check size={14} /> : <Copy size={14} />}
          size="xs"
          variant="ghost"
          onClick={onCopy}
        />
      </Tooltip>
    </HStack>
  );
};

export default CopyableText;
