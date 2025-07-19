const getEventsForBaby = async (babyId: string) => {
  const response = await fetch(`/api/events?babyId=${babyId}`);
  return response.json();
};

export { getEventsForBaby };
