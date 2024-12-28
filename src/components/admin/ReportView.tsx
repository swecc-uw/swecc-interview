import React, { useRef } from 'react';
import { Member, Report } from '../../types';
import {
  HStack,
  Box,
  Text,
  Avatar,
  useDisclosure,
  ModalOverlay,
  ModalHeader,
  ModalCloseButton,
  Modal,
  ModalContent,
  ModalBody,
  ModalFooter,
  Button,
  Divider,
  Select,
  VStack,
  useToast,
} from '@chakra-ui/react';
import { resolveName } from '../utils/RandomUtils';
import { ReportStatusView } from './ReportStatusView';
import { ReportTypeView } from './ReportTypeView';
import { Link } from 'react-router-dom';
import { ReportObjectView } from './ReportObjectView';
import { assignAdmin } from '../../services/report';
import { useNavigate } from 'react-router-dom';

type Props = Report & {
  key: React.Key | null | undefined;
  adminList: Member[];
};

export const ReportView: React.FC<Props> = ({
  reason,
  reporter,
  status,
  type,
  associatedObject,
  key,
  assignee,
  adminList,
  reportId,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const assignedAdmin = useRef<HTMLSelectElement>(null);

  const toast = useToast();

  const navigate = useNavigate();

  const save = async () => {
    if (assignedAdmin.current === undefined) {
      return;
    }

    try {
      await assignAdmin(reportId, parseInt(assignedAdmin.current!.value));
      navigate(0);
    } catch (e) {
      const errorMessage = (e as Error).message;

      toast({
        title: 'Error',
        description: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      <Box
        key={key}
        borderWidth={1}
        borderRadius="lg"
        p={4}
        boxShadow="md"
        cursor="pointer"
        onClick={onOpen}
      >
        <HStack justifyContent="space-between">
          <HStack>
            <Text fontWeight="semibold">{reason}</Text>
            <ReportStatusView status={status} />
            <ReportTypeView type={type} />
          </HStack>
          <Avatar
            alignSelf="flex-end"
            name={resolveName(reporter)}
            src={reporter.profilePictureUrl}
          />
        </HStack>
      </Box>
      <Modal size="lg" isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <HStack fontSize="large">
              <Text>
                Report filed by{' '}
                <Link to={`/directory/${reporter.id}`}>
                  @{reporter.username}
                </Link>
              </Text>
              <ReportStatusView status={status} />{' '}
              <ReportTypeView type={type} />
            </HStack>
            <Divider mt={2} />
          </ModalHeader>
          <ModalCloseButton></ModalCloseButton>
          <ModalBody fontSize="medium">
            <VStack alignItems={'flex-start'} gap={3}>
              <HStack>
                <Text fontWeight="semibold">Reason:</Text>
                <Text>{reason}</Text>
              </HStack>
              <ReportObjectView type={type} object={associatedObject!} />
              <HStack>
                <Text fontWeight="semibold">Assignee: </Text>
                <Select
                  placeholder="Assign Admin"
                  defaultValue={assignee}
                  ref={assignedAdmin}
                >
                  {adminList.map((admin, idx) => (
                    <option value={admin.id} key={idx}>
                      {resolveName(admin)}
                    </option>
                  ))}
                </Select>
              </HStack>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button mr={3} onClick={save}>
              Save Changes
            </Button>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
