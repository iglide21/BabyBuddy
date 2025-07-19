const getEventsForBaby = async (babyId: string, date?: string) => {
  const params = new URLSearchParams({ babyId });

  if (date) {
    params.append("date", date);
  }

  const response = await fetch(`/api/events?${params.toString()}`);
  return response.json();
};

export { getEventsForBaby };
