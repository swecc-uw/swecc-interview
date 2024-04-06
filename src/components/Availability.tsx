import {useEffect, useState} from 'react';
import styled from 'styled-components';
import TimeSelector from './TimeSelector';
import {hntotime, timetohn, getNextMonday} from '../utils/time';
import {Button, DropdownText} from '../shared';

const Container = styled.div`
  text-align: center;
  margin: 0 auto;
`;

const OptionsContainer = styled.div`
  margin: 0 auto;
`;

const OptionRow = styled.div`
  margin: 20px;
`;

const TimeLabel = styled.label`
  // margin-bottom: 10px;
`;

const UnsavedChangesWarning = styled.div`
  margin-top: 20px;
  font-size: 0.5em;
  color: lightcoral;
`;

type AvailabilityProps = {
	uid: string | undefined;
};

const Availability = ({uid}: AvailabilityProps) => {
	const [startTime, setStartTime] = useState(7);
	const [endTime, setEndTime] = useState(17);
	const [availability, setAvailability] = useState<boolean[][]>([]);
	const [changedSinceSave, setChangedSinceSave] = useState(false);
	const numDays = 7;
	const today = new Date();
	const nextMonday = getNextMonday(today);

	useEffect(() => {
		// if (!uid)
		const availabilityString = localStorage.getItem(`availability-${uid}`);
		if (availabilityString) {
			setAvailability(
				JSON.parse(availabilityString).map((day: number[]) =>
					day.map(hour => hour === 1),
				),
			);
		} else {
			setAvailability(
				Array.from({length: numDays}, () => Array(24).fill(false)),
			);
		}

		setChangedSinceSave(false);
	}, []);

	const handleStartTimeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const t: string = e.target.value;
		setStartTime(timetohn(t));
	};

	const handleEndTimeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const t: string = e.target.value;
		setEndTime(timetohn(t));
	};

	const handleSave = () => {
		if (!uid) return;
		localStorage.setItem(
			`availability-${uid}`,
			JSON.stringify(availability.map(day => day.map(hour => (hour ? 1 : 0)))),
		);
		setChangedSinceSave(false);
	};

	const renderOptions = () => {
		const hours = Array.from({length: 24}, (_, i) => i);

		return (
			<OptionsContainer>
				<OptionRow>
					<TimeLabel>Starting from </TimeLabel>
					<DropdownText
						value={hntotime(startTime)}
						onChange={handleStartTimeChange}
					>
						{hours.map(hour => (
							<option key={hour} value={`${hour}:00`}>{`${hour}:00`}</option>
						))}
					</DropdownText>
				</OptionRow>
				<OptionRow>
					<TimeLabel>and going until </TimeLabel>
					<DropdownText
						value={hntotime(endTime)}
						onChange={handleEndTimeChange}
					>
						{hours.map(hour => (
							<option key={hour} value={`${hour}:00`}>{`${hour}:00`}</option>
						))}
					</DropdownText>
				</OptionRow>
			</OptionsContainer>
		);
	};

	const setAvailabilityWrapper = (availability: boolean[][]) => {
		setChangedSinceSave(true);
		setAvailability(availability);
	};

	return (
		<Container>
			<h2>Enter Availability</h2>
			{renderOptions()}
			<TimeSelector
				startDate={nextMonday}
				numDays={numDays}
				startTime={startTime}
				endTime={endTime}
				availability={availability}
				setAvailability={setAvailabilityWrapper}
			/>

			<div>
				{changedSinceSave && (
					<UnsavedChangesWarning>Unsaved changes</UnsavedChangesWarning>
				)}
				<Button onClick={handleSave}>Save</Button>
			</div>
		</Container>
	);
};

export default Availability;
