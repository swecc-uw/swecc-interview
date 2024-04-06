import styled from 'styled-components'

type TimeSelectorProps = {
  startDate: Date
  numDays: number
  startTime: number
  endTime: number
  availability: boolean[][]
  setAvailability: (availability: boolean[][]) => void
}

const TimeSelectorContainer = styled.div`
  display: flex;
  justify-content: center; /* Center the Day columns horizontally */
  gap: 5px;
`

const DayColumn = styled.div`
  display: grid;
  grid-template-rows: repeat(
    auto-fill,
    minmax(30px, 1fr)
  ); /* Each time slot takes 1 fraction of the available space */
`

const TimeSlot = styled.div`
  cursor: pointer;
  padding: 5px;
  border-radius: 5px;
  margin: 2px;
`

const AvailableTimeSlot = styled(TimeSlot)`
  background-color: lightgreen;
  color: black;
`

const TimeSelector: React.FC<TimeSelectorProps> = ({
  startDate,
  numDays,
  startTime,
  endTime,
  availability,
  setAvailability
}: TimeSelectorProps) => {
  const timeLabels = Array.from(
    { length: endTime - startTime + 1 },
    (_, i) => `${startTime + i}:00`
  )

  const toggleAvailability = (dayIndex: number, hourIndex: number) => {
    const updatedAvailability = [...availability]
    updatedAvailability[dayIndex][hourIndex] =
      !updatedAvailability[dayIndex][hourIndex]
    setAvailability(updatedAvailability)
  }

  const dayAbr = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const renderTimeSlots = () => {
    const timeSlots: JSX.Element[] = []

    for (let i = 0; i < numDays; i++) {
      const dayAvailability = availability[i]
      const daySlots: JSX.Element[] = []

      for (let j = startTime; j <= endTime; j++) {
        const available = dayAvailability ? dayAvailability[j] : false
        const SlotComponent = available ? AvailableTimeSlot : TimeSlot

        daySlots.push(
          <SlotComponent
            key={`day-${i}-hour-${j}`}
            onClick={() => {
              toggleAvailability(i, j)
            }}
          >
            {timeLabels[j - startTime]}
          </SlotComponent>
        )
      }

      timeSlots.push(
        <DayColumn key={`day-${i}`}>
          <div>{dayAbr[(startDate.getDay() + i) % 7]}</div>
          {daySlots}
        </DayColumn>
      )
    }

    return timeSlots
  }

  return <TimeSelectorContainer>{renderTimeSlots()}</TimeSelectorContainer>
}

export default TimeSelector
