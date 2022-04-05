const getIndexOfItemById = (items, id: string) => {
  let i = 0;
  for (; i < items.length; i += 1) {
    if (id === items[i].id) {
      return i;
    }
  }

  return -1;
};

export {
  getIndexOfItemById,
};
