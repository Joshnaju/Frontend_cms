import api from "./api";

export const getLabTests = () => {
  return api.get(`lab-master/lab-tests/`);
};
