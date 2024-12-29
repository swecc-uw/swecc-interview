import { useEffect, useState } from 'react';
import { Member } from '../../types';
import { getAllAdmins } from '../../services/member';
import { useToast } from '@chakra-ui/react';

export const useAdmins = () => {
  const [adminList, setAdminList] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);

  const toast = useToast();

  const fetchData = async () => {
    setIsLoading(true);
    setError(undefined);

    try {
      const data = await getAllAdmins();
      setAdminList(data);
    } catch (e) {
      const errorMessage = (e as Error).message;
      setError(errorMessage);

      toast({
        title: 'Error',
        description: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { isLoading, adminList, error };
};
