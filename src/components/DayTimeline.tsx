import { useState, useMemo } from 'react';
import { useHeatmapColor } from '../hooks/useHeatmapColor';
import { DAY, TEN_MINUTES, formatDate } from '../localization';
import { RawSignup } from '../types';
import {
  Box,
  Text,
  HStack,
  Tooltip,
  useBreakpointValue,
} from '@chakra-ui/react';

const INCREMENTS_PER_DAY = 144;

const timestampForBucketStart = (bucket: number) => bucket * TEN_MINUTES;

const SignupsDetails: React.FC<{
  signups: RawSignup[];
  bucketIdx: number;
  startTime: number;
}> = ({ signups, bucketIdx, startTime }) => {
  const bucketStart = timestampForBucketStart(bucketIdx) + startTime;
  const bucketEnd = timestampForBucketStart(bucketIdx + 1) + startTime;

  const signupsInBucket = signups.filter(
    ({ timestamp }) => timestamp >= bucketStart && timestamp < bucketEnd
  );
  return (
    <Box>
      {signupsInBucket.map(({ timestamp, username, user_id }) => (
        <Text key={`${timestamp}-${user_id}`} fontSize="sm">
          {formatDate(timestamp, true, true)} - {username} ({user_id})
        </Text>
      ))}
    </Box>
  );
};

const DayTimeline: React.FC<{
  signups: RawSignup[];
  selectedDay: number;
  height: number;
}> = ({ signups, selectedDay, height }) => {
  const barWidth = useBreakpointValue({ base: '4px', md: '6px' });
  const [selectedBucket, setSelectedBucket] = useState<number>();

  const processedData = useMemo(() => {
    const dayStart = Math.floor(selectedDay / DAY) * DAY;
    const dayEnd = dayStart + DAY;

    const buckets = new Array(INCREMENTS_PER_DAY).fill(0);

    signups.forEach(({ timestamp }) => {
      if (timestamp >= dayStart && timestamp < dayEnd) {
        const index = Math.floor((timestamp - dayStart) / TEN_MINUTES);
        buckets[index]++;
      }
    });

    const maxCount = Math.max(...buckets, 1);
    return { buckets, maxCount };
  }, [signups, selectedDay]);

  const getColor = useHeatmapColor(processedData.maxCount);
  return (
    <Box
      bg="white"
      borderRadius="lg"
      p={[2, 4]}
      width="100%"
      height="fit-content"
    >
      <Text fontSize={['xs', 'sm']} mb={[2, 4]}>
        {formatDate(new Date(selectedDay), false, true)}
      </Text>
      <Box position="relative" height={`${height}px`}>
        <HStack spacing={0} height="100%">
          {processedData.buckets.map((count, i) => (
            <Tooltip
              key={i}
              label={`${Math.round(count)} signups at ${formatDate(
                timestampForBucketStart(i) + selectedDay,
                true,
                true
              )}`}
              hasArrow
            >
              <Box
                width={barWidth}
                height="100%"
                bg={getColor(count)}
                transition="all 0.2s"
                _hover={{ transform: 'scaleY(1.1)', zIndex: 1 }}
                cursor="pointer"
                onClick={() => setSelectedBucket(i)}
                outline={selectedBucket === i ? '2px solid' : 'none'}
              />
            </Tooltip>
          ))}
        </HStack>
      </Box>
      {selectedBucket && (
        <Box mt={4}>
          <SignupsDetails
            signups={signups}
            bucketIdx={selectedBucket}
            startTime={selectedDay}
          />
        </Box>
      )}
    </Box>
  );
};

export default DayTimeline;
