import { format, addDays } from 'date-fns';

export function getTravelDate(offsetDays: number = 15) {
  const targetDate = addDays(new Date(), offsetDays);

  return {
    formatted: format(targetDate, 'dd-MM-yyyy'),
    day: format(targetDate, 'd'), 
    monthYear: format(targetDate, 'MMMM yyyy'), 
  };
}
