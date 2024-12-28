import {
  useBreakpointValue,
  Tooltip,
  GridItem,
  Box,
  Grid,
} from '@chakra-ui/react';
import { useMemo } from 'react';
import { useHeatmapColor } from '../hooks/useHeatmapColor';
import { DAY, formatDate } from '../localization';
import { RawSignup } from '../types';

const DayGrid: React.FC<{
  signups: RawSignup[];
  daysDisplayed: number;
  cellSize?: number;
  onSelectDay: (timestamp: number) => void;
  selectedDay: number;
}> = ({ signups, daysDisplayed, cellSize = 32, onSelectDay, selectedDay }) => {
  const gridGap = useBreakpointValue({ base: '8px', md: '16px' });
  const processedData = useMemo(() => {
    const now = Date.now();
    const startDate = now - daysDisplayed * DAY;
    const buckets = new Map<number, number>();

    signups.forEach(({ timestamp }) => {
      if (timestamp >= startDate && timestamp <= now) {
        const dayStart = Math.floor(timestamp / DAY) * DAY;
        buckets.set(dayStart, (buckets.get(dayStart) || 0) + 1);
      }
    });

    const maxCount = Math.max(...buckets.values(), 1);
    return { buckets, maxCount };
  }, [signups, daysDisplayed]);

  const getColor = useHeatmapColor(processedData.maxCount);

  const days = useMemo(() => {
    const now = Date.now();
    return Array.from({ length: daysDisplayed }, (_, i) => {
      const timestamp = Math.floor((now - i * DAY) / DAY) * DAY;
      return { timestamp, count: processedData.buckets.get(timestamp) || 0 };
    }).reverse();
  }, [processedData.buckets, daysDisplayed]);

  return (
    <Box>
      <Grid
        templateColumns={`repeat(7, ${cellSize}px)`}
        autoRows={`${cellSize}px`}
        gap={gridGap}
        bg="white"
        p={[2, 4]}
        borderRadius="lg"
      >
        {days.map((day) => (
          <Tooltip
            key={day.timestamp}
            label={`${day.count} signups on ${formatDate(
              day.timestamp,
              false,
              true
            )}`}
            hasArrow
          >
            <GridItem
              w={`${cellSize}px`}
              h={`${cellSize}px`}
              bg={getColor(day.count)}
              borderRadius="md"
              transition="all 0.2s"
              cursor="pointer"
              onClick={() => onSelectDay(day.timestamp)}
              outline={day.timestamp === selectedDay ? '2px solid' : 'none'}
              outlineColor="blue.500"
            />
          </Tooltip>
        ))}
      </Grid>
    </Box>
  );
};

export default DayGrid;
