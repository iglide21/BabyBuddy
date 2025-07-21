const getBabies = async (userId: string) => {
  const response = await fetch(`/api/babies?userId=${userId}`);
  return response.json();
};

export { getBabies };
