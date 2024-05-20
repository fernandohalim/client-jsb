export function DateFormatShort(dateTimeString) {
  const date = new Date(dateTimeString);

  const options = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  };

  const dateTimeFormatter = new Intl.DateTimeFormat("id-ID", options);
  const formattedDate = dateTimeFormatter.format(date);

  const [day, month, year] = formattedDate.split('/');

  return `${day}/${month}/${year}`;
}
