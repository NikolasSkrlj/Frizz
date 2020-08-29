export const isEmpty = (object) => {
  for (let i in object) {
    return true;
  }
  return false;
};
