import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import isToday from "dayjs/plugin/isToday";
import isYesterday from "dayjs/plugin/isYesterday";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";

// Extend dayjs with plugins
dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isToday);
dayjs.extend(isYesterday);
dayjs.extend(isSameOrBefore);

// Utility functions using dayjs
export const getTimeSince = (date: string | Date | dayjs.Dayjs | undefined) => {
  if (!date) return "";
  return dayjs(date).fromNow();
};

export const formatTime = (date: string | Date | dayjs.Dayjs | undefined) => {
  if (!date) return "";
  return dayjs(date).format("HH:mm");
};

export const calculateAge = (birthDate: string | Date | dayjs.Dayjs) => {
  const birth = dayjs(birthDate);
  const now = dayjs();

  if (!birth.isValid()) return "Invalid date";

  const years = now.diff(birth, "year");
  const months = now.diff(birth, "month") % 12;
  const days = now.diff(birth, "day") % 30;

  if (years > 0) {
    if (months > 0) {
      return `${years} year${years > 1 ? "s" : ""} ${months} month${
        months > 1 ? "s" : ""
      }`;
    }
    return `${years} year${years > 1 ? "s" : ""}`;
  } else if (months > 0) {
    if (days > 0) {
      return `${months} month${months > 1 ? "s" : ""} ${days} day${
        days > 1 ? "s" : ""
      }`;
    }
    return `${months} month${months > 1 ? "s" : ""}`;
  } else {
    return `${days} day${days > 1 ? "s" : ""}`;
  }
};

export const formatDurationInMinutes = (durationInMinutes: number) => {
  const hours = Math.floor(durationInMinutes / 60);
  const minutes = durationInMinutes % 60;

  if (hours > 0) {
    if (hours === 1) {
      return `${hours}hr ${minutes}mins`;
    }

    return `${hours}hrs ${minutes}mins`;
  }

  if (minutes === 1) {
    return `${minutes}min`;
  }

  return `${minutes}mins`;
};

export const formatDuration = (
  startTime: string | Date | dayjs.Dayjs,
  endTime: string | Date | dayjs.Dayjs
) => {
  const start = dayjs(startTime);
  const end = dayjs(endTime);

  if (!start.isValid() || !end.isValid()) {
    return "Invalid duration";
  }

  const diff = end.diff(start, "minute");

  if (diff < 0) {
    return "Invalid duration";
  }

  const hours = Math.floor(diff / 60);
  const minutes = diff % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
};

export const getTodayString = () => {
  return dayjs().format("YYYY-MM-DD");
};

export const getDateString = (date: string | Date | dayjs.Dayjs) => {
  return dayjs(date).format("YYYY-MM-DD");
};

export const getNow = () => {
  return dayjs();
};

export const getWeekAgo = () => {
  return dayjs().subtract(7, "day");
};

export const getTwoHoursAgo = () => {
  return dayjs().subtract(2, "hour");
};

export const getTodayStart = () => {
  return dayjs().startOf("day");
};

export const getTodayEnd = () => {
  return dayjs().endOf("day");
};

export const getYesterday = () => {
  return dayjs().subtract(1, "day");
};

export const getTomorrow = () => {
  return dayjs().add(1, "day");
};

export const formatDateForDisplay = (date: string | Date | dayjs.Dayjs) => {
  const dayjsDate = dayjs(date);

  if (dayjsDate.isToday()) {
    return "Today";
  } else if (dayjsDate.isYesterday()) {
    return "Yesterday";
  } else {
    return dayjsDate.format("MMM D, YYYY");
  }
};

export const generateId = () => {
  return dayjs().valueOf().toString();
};

export const getStartOfDay = (date: string | Date | dayjs.Dayjs) => {
  return dayjs(date).startOf("day");
};

export const getEndOfDay = (date: string | Date | dayjs.Dayjs) => {
  return dayjs(date).endOf("day");
};

export default dayjs;
