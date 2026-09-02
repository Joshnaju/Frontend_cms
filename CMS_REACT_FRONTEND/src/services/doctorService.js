import api from "./api";

export const getAppointments = (date, status) => {
  return api.get("doctor/appointments/", {
    params: {
      date: date,
      status: status,
    },
  });
};
