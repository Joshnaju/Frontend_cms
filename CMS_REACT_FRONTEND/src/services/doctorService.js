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

export const getConsultationByAppointment = (appointmentId) => {
  return api.get(`doctor/consultations/by-appointment/${appointmentId}/`);
};

export const getMedicalHistoryByAppointment = (appointmentId) => {
  return api.get(
    `/doctor/consultations/history-by-appointment/${appointmentId}/`,
  );
};

export const getConsultedPatients = async () => {
  const response = await api.get("/doctor/consultations/patients/");
  return response.data;
};

export const getDoctorPatient = async (patientId) => {
  const response = await api.get(`doctor/consultations/patients/${patientId}/`);
  return response.data;
};
