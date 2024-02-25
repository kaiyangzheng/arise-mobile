import DateTimePicker from '@react-native-community/datetimepicker';

type DatetimePickerProps = {
  date: Date;
  setDate: React.Dispatch<React.SetStateAction<Date>>;
}

export default function DatetimePicker({ date, setDate }: DatetimePickerProps) {
  return (
    <>
      <DateTimePicker
        display="spinner"
        value={date}
        mode="time"
        onChange={(event, selectedDate) => {
          const currentDate = selectedDate || date;
          setDate(currentDate);
        }}
      />
    </>
  )
}
