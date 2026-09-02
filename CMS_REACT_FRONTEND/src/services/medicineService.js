import api from "./api";

export const getMedicines = () => {
  return api.get(`medicine-master/medicines/`);
};
