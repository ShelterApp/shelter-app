export const searchByName = (query: string, list) => {
  let updatedList = list;
  updatedList = updatedList.filter(({ name, description }) =>
  name.concat(description).toLowerCase().search(query.toLowerCase()) !== -1);

  return updatedList;
};
