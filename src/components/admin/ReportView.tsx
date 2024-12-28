import React from 'react';

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
} from '@chakra-ui/react';
import { resolveName } from '../utils/RandomUtils';
import { ReportStatusView } from './ReportStatusView';
import { ReportTypeView } from './ReportTypeView';
import { Link } from 'react-router-dom';
import { ReportObjectView } from './ReportObjectView';

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
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

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
            <HStack>
              <Text fontWeight="semibold">Reason:</Text>
              <Text>{reason}</Text>
            </HStack>
            <ReportObjectView type={type} object={associatedObject!} />
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
