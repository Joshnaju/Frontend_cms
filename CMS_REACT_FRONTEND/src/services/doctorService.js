import api from "./api";

export const getAppointments = (date, status) => {
  return api.get("doctor/appointments/", {
    params: {
      date: date,
      status: status,
    },
  });
};

export const createConsultation = (data) => {
  return api.post("doctor/consultations/", data);
};

export const getAppointment = (appointmentId) => {
  return api.get(`doctor/appointments/${appointmentId}/`);
};
