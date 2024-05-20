export function DateFormat(dateTimeString) {
  const date = new Date(dateTimeString);

  const options = {
    year: "numeric",
    month: "long",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZoneName: "short",
    localeMatcher: "best fit",
  };

  const dateTimeFormatter = new Intl.DateTimeFormat("id-ID", options);
  return dateTimeFormatter.format(date);
}
