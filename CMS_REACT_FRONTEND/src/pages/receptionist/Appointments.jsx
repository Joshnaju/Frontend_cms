import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import api from "../../services/api";

function Appointments() {
  const location = useLocation();
  const [selectedAction, setSelectedAction] = useState(null);

  const [appointments, setAppointments] = useState([]);
  const [filterDate, setFilterDate] = useState("");
  const [appointmentTypeFilter, setAppointmentTypeFilter] =
    useState("ALL");
  const [message, setMessage] = useState("");

  // =====================================================
  // BOOKING STATES
  // =====================================================

  const [searchType, setSearchType] = useState("patient_id");
  const [searchValue, setSearchValue] = useState("");
  const [patient, setPatient] = useState(null);
  const [patientSearchResults, setPatientSearchResults] =
    useState([]);

  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] =
    useState("");

  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState("");

  const [appointmentType, setAppointmentType] =
    useState("WALK_IN");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");

  const [availableSlots, setAvailableSlots] = useState([]);
  const [slotMessage, setSlotMessage] = useState("");
  const [loadingSlot, setLoadingSlot] = useState(false);

  const [paymentStatus, setPaymentStatus] = useState("UNPAID");
  const [feePreview, setFeePreview] = useState(null);

  const [bookingResult, setBookingResult] = useState(null);
  const [showBookingSuccess, setShowBookingSuccess] =
    useState(false);

  // =====================================================
  // EDIT APPOINTMENT STATES
  // =====================================================

  const [editingAppointment, setEditingAppointment] =
    useState(null);

  const [editDate, setEditDate] = useState("");
  const [editTime, setEditTime] = useState("");

  const [editAvailableSlots, setEditAvailableSlots] =
    useState([]);

  const [loadingEditSlots, setLoadingEditSlots] =
    useState(false);

  const [editSlotMessage, setEditSlotMessage] = useState("");

  // =====================================================
  // DATE / TIME HELPERS
  // =====================================================

  const formatDate = (date) => {
    const year = date.getFullYear();

    const month = String(
      date.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
      date.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const getToday = () => {
    return formatDate(new Date());
  };

  const getTomorrow = () => {
    const date = new Date();

    date.setDate(
      date.getDate() + 1
    );

    return formatDate(date);
  };

  const getDayAfterTomorrow = () => {
    const date = new Date();

    date.setDate(
      date.getDate() + 2
    );

    return formatDate(date);
  };

  const formatTime = (time) => {
    if (!time) {
      return "-";
    }

    return time.slice(0, 5);
  };

  const formatAppointmentType = (type) => {
    if (type === "WALK_IN") {
      return "Walk-in";
    }

    if (type === "PRIOR_BOOKING") {
      return "Prior Booking";
    }

    return type;
  };

  // =====================================================
  // API ERROR HELPER
  // =====================================================

  const getApiErrorMessage = (
    error,
    fallback = "Something went wrong."
  ) => {
    const data = error.response?.data;

    if (!data) {
      return fallback;
    }

    if (typeof data === "string") {
      return data;
    }

    if (data.detail) {
      return Array.isArray(data.detail)
        ? data.detail.join(" ")
        : data.detail;
    }

    const messages = [];

    Object.values(data).forEach((value) => {
      if (Array.isArray(value)) {
        messages.push(...value);
      } else if (
        typeof value === "string"
      ) {
        messages.push(value);
      } else if (
        value &&
        typeof value === "object"
      ) {
        Object.values(value).forEach(
          (nestedValue) => {
            if (
              Array.isArray(nestedValue)
            ) {
              messages.push(
                ...nestedValue
              );
            } else if (
              typeof nestedValue ===
              "string"
            ) {
              messages.push(
                nestedValue
              );
            }
          }
        );
      }
    });

    return messages.length > 0
      ? messages.join(" ")
      : fallback;
  };

  // =====================================================
  // DEPARTMENTS
  // =====================================================

  const fetchDepartments = async () => {
    try {
      const response = await api.get(
        "receptionist/departments/"
      );

      setDepartments(response.data);
    } catch (error) {
      console.error(
        "Error fetching departments:",
        error
      );

      setMessage(
        "Unable to load departments."
      );
    }
  };

  // =====================================================
  // APPOINTMENTS
  // =====================================================

  const fetchAppointments = async (
    viewType = null,
    date = "",
    type = "ALL"
  ) => {
    try {
      setMessage("");

      const params = {};

      if (viewType) {
        params.view = viewType;
      }

      if (date) {
        params.date = date;
      }

      if (type !== "ALL") {
        params.appointment_type = type;
      }

      const response = await api.get(
        "receptionist/appointments/",
        {
          params,
        }
      );

      /*
       * IMPORTANT:
       * Do NOT filter using patient.is_active here.
       *
       * Existing appointments belonging to patients
       * who later become inactive must remain visible.
       */

      setAppointments(response.data);
    } catch (error) {
      console.error(
        "Error fetching appointments:",
        error
      );

      setAppointments([]);

      setMessage(
        "Unable to load appointments."
      );
    }
  };


  // =====================================================
  // SIDEBAR RESET
  // =====================================================

  useEffect(() => {
    if (location.state?.resetSection) {
      setSelectedAction(null);

      setAppointments([]);
      setFilterDate("");
      setAppointmentTypeFilter("ALL");
      setMessage("");

      setEditingAppointment(null);
      setEditDate("");
      setEditTime("");
      setEditAvailableSlots([]);
      setEditSlotMessage("");

      setSearchType("patient_id");
      setSearchValue("");
      setPatient(null);
      setPatientSearchResults([]);

      setSelectedDepartment("");
      setDoctors([]);
      setSelectedDoctor("");

      setAppointmentType("WALK_IN");
      setAppointmentDate("");
      setAppointmentTime("");

      setAvailableSlots([]);
      setSlotMessage("");
      setLoadingSlot(false);

      setPaymentStatus("UNPAID");
      setFeePreview(null);

      setBookingResult(null);
      setShowBookingSuccess(false);
    }
  }, [location.state?.resetKey]);

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    fetchDepartments();
  }, []);

  useEffect(() => {
    if (selectedAction === "book") {
      setAppointmentType("WALK_IN");
      setAppointmentDate(getToday());
    }

    if (selectedAction === "view") {
      setFilterDate("");
      setAppointmentTypeFilter("ALL");

      fetchAppointments("upcoming");
    }

    if (selectedAction === "log") {
      setFilterDate("");
      setAppointmentTypeFilter("ALL");

      fetchAppointments("log");
    }
  }, [selectedAction]);

  // =====================================================
  // SEARCH PATIENT
  // =====================================================

  const handleSearchPatient = async () => {
    if (!searchValue.trim()) {
      setMessage(
        searchType === "patient_id"
          ? "Please enter a Patient ID."
          : searchType === "patient_name"
          ? "Please enter a Patient Name."
          : "Please enter a Mobile Number."
      );

      return;
    }

    try {
      setMessage("");

      setPatient(null);
      setPatientSearchResults([]);

      setSelectedDepartment("");
      setSelectedDoctor("");
      setDoctors([]);

      setAppointmentTime("");
      setAvailableSlots([]);
      setSlotMessage("");

      setFeePreview(null);

      setBookingResult(null);
      setShowBookingSuccess(false);

      const response = await api.get(
        "receptionist/patients/",
        {
          params: {
            [searchType]:
              searchValue.trim(),
          },
        }
      );

      if (
        response.data.length === 0
      ) {
        setMessage(
          "Patient not found."
        );

        return;
      }

      if (
        searchType === "patient_id"
      ) {
        const foundPatient =
          response.data[0];

        if (!foundPatient.is_active) {
          setPatientSearchResults(
            response.data
          );

          setMessage(
            "This patient is inactive and cannot book an appointment."
          );

          return;
        }

        setPatient(foundPatient);

        return;
      }

      setPatientSearchResults(
        response.data
      );
    } catch (error) {
      console.error(
        "Error searching patient:",
        error
      );

      setMessage(
        "Unable to search patient."
      );
    }
  };

  const handleSelectPatient = (
    selectedPatient
  ) => {
    /*
     * Inactive patients cannot make NEW appointments.
     * Existing appointments remain untouched.
     */

    if (!selectedPatient.is_active) {
      setMessage(
        "This patient is inactive and cannot book an appointment."
      );

      return;
    }

    setPatient(selectedPatient);
    setPatientSearchResults([]);
    setMessage("");

    setSelectedDepartment("");
    setSelectedDoctor("");
    setDoctors([]);

    setAppointmentTime("");
    setAvailableSlots([]);
    setSlotMessage("");

    setFeePreview(null);
  };

  // =====================================================
  // DEPARTMENT CHANGE
  // =====================================================

  const handleDepartmentChange = async (
    e
  ) => {
    const departmentId =
      e.target.value;

    setSelectedDepartment(
      departmentId
    );

    setSelectedDoctor("");
    setDoctors([]);

    setAppointmentTime("");
    setAvailableSlots([]);
    setSlotMessage("");

    setFeePreview(null);

    setBookingResult(null);
    setShowBookingSuccess(false);

    if (!departmentId) {
      return;
    }

    try {
      setMessage("");

      const response = await api.get(
        "receptionist/doctors/",
        {
          params: {
            department:
              departmentId,
          },
        }
      );

      setDoctors(response.data);

      if (
        response.data.length === 0
      ) {
        setMessage(
          "No doctors available in this department."
        );
      }
    } catch (error) {
      console.error(
        "Error fetching doctors:",
        error
      );

      setMessage(
        "Unable to load doctors."
      );
    }
  };

  const selectedDoctorDetails =
    doctors.find(
      (doctor) =>
        String(doctor.id) ===
        String(selectedDoctor)
    );

  const selectedDepartmentDetails =
    departments.find(
      (department) =>
        String(department.id) ===
        String(selectedDepartment)
    );

  // =====================================================
  // FEE PREVIEW
  // =====================================================

  const fetchFeePreview = async (
    patientId,
    doctorId
  ) => {
    if (!patientId || !doctorId) {
      setFeePreview(null);

      return;
    }

    try {
      const response = await api.get(
        "receptionist/fee-preview/",
        {
          params: {
            patient: patientId,
            doctor: doctorId,
          },
        }
      );

      setFeePreview(response.data);
    } catch (error) {
      console.error(
        "Error fetching fee preview:",
        error
      );

      setFeePreview(null);
    }
  };

  // =====================================================
  // WALK-IN NEXT SLOT
  // =====================================================

  const fetchNextSlot = async (
    doctorId,
    selectedDate
  ) => {
    if (
      !doctorId ||
      !selectedDate
    ) {
      setAppointmentTime("");

      return;
    }

    try {
      setLoadingSlot(true);

      setAppointmentTime("");
      setAvailableSlots([]);
      setSlotMessage("");

      const response = await api.get(
        "receptionist/next-slot/",
        {
          params: {
            doctor: doctorId,
            date: selectedDate,
          },
        }
      );

      if (
        response.data.next_slot
      ) {
        const slot = formatTime(
          response.data.next_slot
        );

        setAppointmentTime(slot);

        setSlotMessage(
          `Next available slot: ${slot}`
        );
      } else {
        setAppointmentTime("");

        setSlotMessage(
          response.data.message ||
            "All appointment slots are filled."
        );
      }
    } catch (error) {
      console.error(
        "Error fetching next slot:",
        error
      );

      setAppointmentTime("");

      setSlotMessage(
        "Unable to get the next appointment slot."
      );
    } finally {
      setLoadingSlot(false);
    }
  };

  // =====================================================
  // PRIOR BOOKING AVAILABLE SLOTS
  // =====================================================

  const fetchAvailableSlots = async (
    doctorId,
    selectedDate
  ) => {
    if (
      !doctorId ||
      !selectedDate
    ) {
      setAvailableSlots([]);
      setAppointmentTime("");

      return;
    }

    try {
      setLoadingSlot(true);

      setAvailableSlots([]);
      setAppointmentTime("");
      setSlotMessage("");

      const response = await api.get(
        "receptionist/available-slots/",
        {
          params: {
            doctor: doctorId,
            date: selectedDate,
          },
        }
      );

      const slots =
        response.data.available_slots ||
        [];

      setAvailableSlots(slots);

      if (slots.length === 0) {
        setSlotMessage(
          response.data.message ||
            "All appointment slots are filled."
        );
      } else {
        setSlotMessage(
          "Select any available appointment time."
        );
      }
    } catch (error) {
      console.error(
        "Error fetching available slots:",
        error
      );

      setAvailableSlots([]);
      setAppointmentTime("");

      setSlotMessage(
        "Unable to load available appointment slots."
      );
    } finally {
      setLoadingSlot(false);
    }
  };

  // =====================================================
  // DOCTOR CHANGE
  // =====================================================

  const handleDoctorChange = async (
    e
  ) => {
    const doctorId =
      e.target.value;

    setSelectedDoctor(
      doctorId
    );

    setAppointmentTime("");
    setAvailableSlots([]);
    setSlotMessage("");

    setBookingResult(null);
    setShowBookingSuccess(false);

    setFeePreview(null);

    if (
      doctorId &&
      patient
    ) {
      await fetchFeePreview(
        patient.id,
        doctorId
      );
    }

    if (
      !doctorId ||
      !appointmentDate
    ) {
      return;
    }

    if (
      appointmentType ===
      "WALK_IN"
    ) {
      await fetchNextSlot(
        doctorId,
        appointmentDate
      );
    } else {
      await fetchAvailableSlots(
        doctorId,
        appointmentDate
      );
    }
  };

  // =====================================================
  // APPOINTMENT TYPE
  // =====================================================

  const handleAppointmentTypeChange =
    async (e) => {
      const type =
        e.target.value;

      setAppointmentType(type);

      setAppointmentTime("");
      setAvailableSlots([]);
      setSlotMessage("");

      setBookingResult(null);
      setShowBookingSuccess(false);

      if (
        type === "WALK_IN"
      ) {
        const today =
          getToday();

        setAppointmentDate(today);

        if (selectedDoctor) {
          await fetchNextSlot(
            selectedDoctor,
            today
          );
        }
      } else {
        setAppointmentDate("");
      }
    };

  // =====================================================
  // PRIOR BOOKING DATE
  // =====================================================

  const handlePriorDateChange =
    async (e) => {
      const selectedDate =
        e.target.value;

      setAppointmentDate(
        selectedDate
      );

      setAppointmentTime("");
      setAvailableSlots([]);
      setSlotMessage("");

      setBookingResult(null);
      setShowBookingSuccess(false);

      if (
        selectedDoctor &&
        selectedDate
      ) {
        await fetchAvailableSlots(
          selectedDoctor,
          selectedDate
        );
      }
    };

  // =====================================================
  // BOOK APPOINTMENT
  // =====================================================

  const handleBookAppointment =
    async (e) => {
      e.preventDefault();

      setMessage("");
      setBookingResult(null);
      setShowBookingSuccess(false);

      if (!patient) {
        setMessage(
          "Please search and select a patient first."
        );

        return;
      }

      if (!patient.is_active) {
        setMessage(
          "This patient is inactive and cannot book an appointment."
        );

        return;
      }

      if (!selectedDepartment) {
        setMessage(
          "Please select a department."
        );

        return;
      }

      if (!selectedDoctor) {
        setMessage(
          "Please select a doctor."
        );

        return;
      }

      if (!appointmentDate) {
        setMessage(
          "Please select an appointment date."
        );

        return;
      }

      /*
       * Payment check intentionally comes BEFORE
       * appointment-time validation.
       */

      if (
        paymentStatus !== "PAID"
      ) {
        setMessage(
          "Booking is not done (payment not done)."
        );

        return;
      }

      if (!appointmentTime) {
        setMessage(
          slotMessage ||
            "Please select an available appointment time."
        );

        return;
      }

      try {
        const response =
          await api.post(
            "receptionist/paid-booking/",
            {
              patient:
                patient.id,

              doctor:
                Number(
                  selectedDoctor
                ),

              appointment_type:
                appointmentType,

              appointment_date:
                appointmentDate,

              appointment_time:
                appointmentTime,

              payment_status:
                paymentStatus,
            }
          );

        setBookingResult(
          response.data
        );

        setMessage("");

        setShowBookingSuccess(
          true
        );
      } catch (error) {
        console.error(
          "Error booking appointment:",
          error
        );

        setMessage(
          getApiErrorMessage(
            error,
            "Unable to book appointment."
          )
        );

        if (
          selectedDoctor &&
          appointmentDate
        ) {
          if (
            appointmentType ===
            "WALK_IN"
          ) {
            await fetchNextSlot(
              selectedDoctor,
              appointmentDate
            );
          } else {
            await fetchAvailableSlots(
              selectedDoctor,
              appointmentDate
            );
          }
        }
      }
    };

  // =====================================================
  // CURRENT LIST REFRESH
  // =====================================================

  const refreshCurrentAppointmentList =
    async (
      dateOverride = filterDate,
      typeOverride =
        appointmentTypeFilter
    ) => {
      const viewType =
        selectedAction === "log"
          ? "log"
          : "upcoming";

      await fetchAppointments(
        viewType,
        dateOverride,
        typeOverride
      );
    };

  // =====================================================
  // DATE FILTER
  // =====================================================

  const handleDateFilter =
    async () => {
      if (!filterDate) {
        setMessage(
          "Please select a date."
        );

        return;
      }

      await refreshCurrentAppointmentList();
    };

  const clearFilter =
    async () => {
      setFilterDate("");
      setMessage("");

      await refreshCurrentAppointmentList(
        "",
        appointmentTypeFilter
      );
    };

  // =====================================================
  // TYPE FILTER
  // =====================================================

  const handleTypeFilterChange =
    async (type) => {
      setAppointmentTypeFilter(
        type
      );

      await refreshCurrentAppointmentList(
        filterDate,
        type
      );
    };

  // =====================================================
  // CANCEL
  // =====================================================

  const handleCancelAppointment =
    async (appointmentId) => {
      const confirmed =
        window.confirm(
          "Are you sure you want to cancel this appointment?"
        );

      if (!confirmed) {
        return;
      }

      try {
        setMessage("");

        await api.patch(
          `receptionist/appointments/${appointmentId}/`,
          {
            status:
              "CANCELLED",
          }
        );

        setMessage(
          "Appointment cancelled successfully."
        );

        await refreshCurrentAppointmentList();
      } catch (error) {
        console.error(
          "Error cancelling appointment:",
          error
        );

        setMessage(
          getApiErrorMessage(
            error,
            "Unable to cancel appointment."
          )
        );
      }
    };

  // =====================================================
  // EDIT AVAILABLE SLOTS
  // =====================================================

  const fetchEditSlots = async (
    doctorId,
    date,
    appointmentId
  ) => {
    if (
      !doctorId ||
      !date
    ) {
      setEditAvailableSlots([]);

      return;
    }

    try {
      setLoadingEditSlots(true);

      setEditSlotMessage("");

      const response = await api.get(
        "receptionist/available-slots/",
        {
          params: {
            doctor: doctorId,
            date,
            appointment:
              appointmentId,
          },
        }
      );

      const slots =
        response.data.available_slots ||
        [];

      setEditAvailableSlots(
        slots
      );

      if (
        slots.length === 0
      ) {
        setEditSlotMessage(
          "No available appointment slots for this date."
        );
      }
    } catch (error) {
      console.error(
        "Error loading edit slots:",
        error
      );

      setEditAvailableSlots([]);

      setEditSlotMessage(
        "Unable to load available slots."
      );
    } finally {
      setLoadingEditSlots(false);
    }
  };

  // =====================================================
  // EDIT APPOINTMENT
  // =====================================================

  const handleEditAppointment =
    async (appointment) => {
      setMessage("");

      setEditingAppointment(
        appointment
      );

      setEditDate(
        appointment.appointment_date
      );

      setEditTime(
        formatTime(
          appointment.appointment_time
        )
      );

      setEditAvailableSlots([]);
      setEditSlotMessage("");

      await fetchEditSlots(
        appointment.doctor,
        appointment.appointment_date,
        appointment.id
      );
    };

  const handleEditDateChange =
    async (e) => {
      const date =
        e.target.value;

      setEditDate(date);

      setEditTime("");

      setEditAvailableSlots([]);
      setEditSlotMessage("");

      if (
        editingAppointment &&
        date
      ) {
        await fetchEditSlots(
          editingAppointment.doctor,
          date,
          editingAppointment.id
        );
      }
    };

  const handleUpdateAppointment =
    async (e) => {
      e.preventDefault();

      if (!editingAppointment) {
        return;
      }

      if (!editDate) {
        setMessage(
          "Please select an appointment date."
        );

        return;
      }

      if (!editTime) {
        setMessage(
          "Please select an available appointment time."
        );

        return;
      }

      try {
        setMessage("");

        await api.patch(
          `receptionist/appointments/${editingAppointment.id}/`,
          {
            appointment_date:
              editDate,

            appointment_time:
              editTime,
          }
        );

        setEditingAppointment(
          null
        );

        setEditAvailableSlots(
          []
        );

        setEditSlotMessage("");

        setMessage(
          "Appointment updated successfully."
        );

        await refreshCurrentAppointmentList();
      } catch (error) {
        console.error(
          "Error updating appointment:",
          error
        );

        setMessage(
          getApiErrorMessage(
            error,
            "Unable to update appointment."
          )
        );

        await fetchEditSlots(
          editingAppointment.doctor,
          editDate,
          editingAppointment.id
        );
      }
    };

  // =====================================================
  // RESET BOOKING
  // =====================================================

  const resetBookingForm =
    () => {
      setSearchType(
        "patient_id"
      );

      setSearchValue("");

      setPatient(null);

      setPatientSearchResults(
        []
      );

      setSelectedDepartment(
        ""
      );

      setDoctors([]);

      setSelectedDoctor("");

      setAppointmentType(
        "WALK_IN"
      );

      setAppointmentDate("");

      setAppointmentTime("");

      setAvailableSlots([]);

      setSlotMessage("");

      setLoadingSlot(false);

      setPaymentStatus(
        "UNPAID"
      );

      setFeePreview(null);

      setBookingResult(null);

      setShowBookingSuccess(
        false
      );
    };

  // =====================================================
  // BACK
  // =====================================================

  const goBack = () => {
    setSelectedAction(null);

    setFilterDate("");

    setAppointmentTypeFilter(
      "ALL"
    );

    setMessage("");

    setEditingAppointment(
      null
    );

    setEditDate("");
    setEditTime("");

    setEditAvailableSlots(
      []
    );

    setEditSlotMessage("");

    resetBookingForm();

    setAppointments([]);
  };

  const backToBookingPage =
    () => {
      setShowBookingSuccess(
        false
      );

      setBookingResult(null);

      setMessage("");

      resetBookingForm();

      setAppointmentType(
        "WALK_IN"
      );

      setAppointmentDate(
        getToday()
      );
    };

  // =====================================================
  // MAIN MENU
  // =====================================================

  if (!selectedAction) {
    return (
      <div>
        <h2 className="mb-4">
          Appointments
        </h2>

        <div className="row g-3">
          <div className="col-12 col-md-6 col-xl-4">
            <button
              type="button"
              className="btn text-white w-100 h-100 p-4"
              style={{
                backgroundColor:
                  "#1976A3",
                minHeight: "90px",
              }}
              onClick={() =>
                setSelectedAction(
                  "book"
                )
              }
            >
              Book Appointments
            </button>
          </div>

          <div className="col-12 col-md-6 col-xl-4">
            <button
              type="button"
              className="btn text-white w-100 h-100 p-4"
              style={{
                backgroundColor:
                  "#1976A3",
                minHeight: "90px",
              }}
              onClick={() =>
                setSelectedAction(
                  "view"
                )
              }
            >
              View and Edit
              Appointments
            </button>
          </div>

          <div className="col-12 col-md-6 col-xl-4">
            <button
              type="button"
              className="btn text-white w-100 h-100 p-4"
              style={{
                backgroundColor:
                  "#1976A3",
                minHeight: "90px",
              }}
              onClick={() =>
                setSelectedAction(
                  "log"
                )
              }
            >
              Appointment Log
            </button>
          </div>
        </div>
      </div>
    );
  }

  // =====================================================
  // BOOKING SUCCESS PAGE
  // =====================================================

  if (
    selectedAction === "book" &&
    showBookingSuccess &&
    bookingResult
  ) {
    const bookedAppointment =
      bookingResult.appointment;

    const bill =
      bookingResult.bill;

    return (
      <div>
        <BackButton
          onClick={
            backToBookingPage
          }
        />

        <div
          className="card shadow-sm"
          style={{
            maxWidth: "800px",
          }}
        >
          <div className="card-body">
            <h4 className="text-success mb-4">
              Appointment Booked
              Successfully
            </h4>

            <h5>
              Patient Details
            </h5>

            <DetailRow
              label="Patient ID"
              value={
                bookedAppointment.patient_id ||
                patient?.patient_id
              }
            />

            <DetailRow
              label="Patient Name"
              value={
                bookedAppointment.patient_name ||
                patient?.patient_name
              }
            />

            <DetailRow
              label="Mobile Number"
              value={
                patient?.mobile_number
              }
            />

            <hr />

            <h5>
              Doctor Details
            </h5>

            <DetailRow
              label="Doctor Name"
              value={
                bookedAppointment.doctor_name ||
                selectedDoctorDetails?.doctor_name
              }
            />

            <DetailRow
              label="Department"
              value={
                bookedAppointment.department_name ||
                selectedDepartmentDetails?.name
              }
            />

            <hr />

            <h5>
              Appointment Details
            </h5>

            <DetailRow
              label="Appointment ID"
              value={
                bookedAppointment.appointment_display_id ||
                `APT${String(
                  bookedAppointment.id
                ).padStart(4, "0")}`
              }
            />

            <DetailRow
              label="Token Number"
              value={
                bookedAppointment.token_number
              }
            />

            <DetailRow
              label="Appointment Type"
              value={formatAppointmentType(
                bookedAppointment.appointment_type
              )}
            />

            <DetailRow
              label="Date"
              value={
                bookedAppointment.appointment_date
              }
            />

            <DetailRow
              label="Time"
              value={formatTime(
                bookedAppointment.appointment_time
              )}
            />

            <DetailRow
              label="Status"
              value={
                bookedAppointment.status
              }
            />

            <hr />

            <h5>
              Consultation Bill
            </h5>

            <DetailRow
              label="Bill ID"
              value={
                bill.bill_display_id ||
                (bill.id
                  ? `CB${String(
                      bill.id
                    ).padStart(
                      4,
                      "0"
                    )}`
                  : "-")
              }
            />

            <DetailRow
              label="Registration Fee"
              value={`₹${bill.registration_fee}`}
            />

            <DetailRow
              label="Consultation Fee"
              value={`₹${bill.consultation_fee}`}
            />

            <DetailRow
              label="Total Amount"
              value={`₹${bill.total_amount}`}
            />

            <DetailRow
              label="Payment Status"
              value="PAID"
            />
          </div>
        </div>
      </div>
    );
  }

  // =====================================================
  // BOOK APPOINTMENT
  // =====================================================

  if (
    selectedAction === "book"
  ) {
    return (
      <div>
        <BackButton
          onClick={goBack}
        />

        <h3>
          Search Patient & Book
          Appointment
        </h3>

        {message && (
          <div className="alert alert-info mt-3">
            {message}
          </div>
        )}

        {/* PATIENT SEARCH */}

        <div className="card mt-4">
          <div className="card-body">
            <h5 className="mb-3">
              Search Patient
            </h5>

            <div className="row g-2">
              <div className="col-12 col-md-3">
                <select
                  className="form-select"
                  value={searchType}
                  onChange={(e) => {
                    setSearchType(
                      e.target.value
                    );

                    setSearchValue(
                      ""
                    );

                    setPatient(null);

                    setPatientSearchResults(
                      []
                    );

                    setSelectedDepartment(
                      ""
                    );

                    setSelectedDoctor(
                      ""
                    );

                    setDoctors([]);

                    setFeePreview(
                      null
                    );

                    setAppointmentTime(
                      ""
                    );

                    setAvailableSlots(
                      []
                    );

                    setSlotMessage(
                      ""
                    );

                    setMessage("");
                  }}
                >
                  <option value="patient_id">
                    Patient ID
                  </option>

                  <option value="patient_name">
                    Patient Name
                  </option>

                  <option value="mobile_number">
                    Mobile Number
                  </option>
                </select>
              </div>

              <div className="col-12 col-md-6">
                <input
                  type="text"
                  className="form-control"
                  value={searchValue}
                  placeholder={
                    searchType ===
                    "patient_id"
                      ? "Enter Patient ID"
                      : searchType ===
                        "patient_name"
                      ? "Enter Patient Name"
                      : "Enter Mobile Number"
                  }
                  onChange={(e) =>
                    setSearchValue(
                      e.target.value
                    )
                  }
                  onKeyDown={(e) => {
                    if (
                      e.key ===
                      "Enter"
                    ) {
                      handleSearchPatient();
                    }
                  }}
                />
              </div>

              <div className="col-12 col-md-3 d-grid">
                <button
                  type="button"
                  className="btn text-white"
                  style={{
                    backgroundColor:
                      "#1976A3",
                  }}
                  onClick={
                    handleSearchPatient
                  }
                >
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* PATIENT SEARCH RESULTS */}

        {patientSearchResults.length >
          0 && (
          <div className="card mt-4">
            <div className="card-body">
              <h5 className="mb-3">
                Matching Patients
              </h5>

              <div className="table-responsive">
                <table className="table table-bordered table-hover align-middle">
                  <thead>
                    <tr>
                      <th>
                        Patient ID
                      </th>

                      <th>Name</th>

                      <th>
                        Date of Birth
                      </th>

                      <th>Gender</th>

                      <th>
                        Mobile Number
                      </th>

                      <th>
                        Blood Group
                      </th>

                      <th>Status</th>

                      <th>
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {patientSearchResults.map(
                      (
                        searchPatient
                      ) => (
                        <tr
                          key={
                            searchPatient.id
                          }
                        >
                          <td>
                            {
                              searchPatient.patient_id
                            }
                          </td>

                          <td>
                            {
                              searchPatient.patient_name
                            }
                          </td>

                          <td>
                            {
                              searchPatient.date_of_birth
                            }
                          </td>

                          <td>
                            {
                              searchPatient.gender
                            }
                          </td>

                          <td>
                            {
                              searchPatient.mobile_number
                            }
                          </td>

                          <td>
                            {searchPatient.blood_group ||
                              "-"}
                          </td>

                          <td>
                            <span
                              className={`badge ${
                                searchPatient.is_active
                                  ? "bg-success"
                                  : "bg-secondary"
                              }`}
                            >
                              {searchPatient.is_active
                                ? "Active"
                                : "Inactive"}
                            </span>
                          </td>

                          <td>
                            <button
                              type="button"
                              className="btn btn-sm text-white text-nowrap"
                              style={{
                                backgroundColor:
                                  "#1976A3",
                              }}
                              disabled={
                                !searchPatient.is_active
                              }
                              onClick={() =>
                                handleSelectPatient(
                                  searchPatient
                                )
                              }
                            >
                              Select
                              Patient
                            </button>
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* SELECTED PATIENT */}

        {patient && (
          <>
            <div className="card mt-4">
              <div className="card-body">
                <h5>
                  Patient Details
                </h5>

                <DetailRow
                  label="Patient ID"
                  value={
                    patient.patient_id
                  }
                />

                <DetailRow
                  label="Name"
                  value={
                    patient.patient_name
                  }
                />

                <DetailRow
                  label="Mobile"
                  value={
                    patient.mobile_number
                  }
                />

                <DetailRow
                  label="Status"
                  value={
                    patient.is_active
                      ? "Active"
                      : "Inactive"
                  }
                />
              </div>
            </div>

            {/* BOOKING FORM */}

            <form
              className="card mt-4"
              onSubmit={
                handleBookAppointment
              }
            >
              <div className="card-body">
                <h5 className="mb-3">
                  Appointment Details
                </h5>

                <div className="row g-3">
                  {/* DEPARTMENT */}

                  <div className="col-12 col-md-6">
                    <label className="form-label">
                      Department
                    </label>

                    <select
                      className="form-select"
                      value={
                        selectedDepartment
                      }
                      onChange={
                        handleDepartmentChange
                      }
                      required
                    >
                      <option value="">
                        Select
                        Department
                      </option>

                      {departments.map(
                        (
                          department
                        ) => (
                          <option
                            key={
                              department.id
                            }
                            value={
                              department.id
                            }
                          >
                            {
                              department.name
                            }
                          </option>
                        )
                      )}
                    </select>
                  </div>

                  {/* DOCTOR */}

                  <div className="col-12 col-md-6">
                    <label className="form-label">
                      Doctor
                    </label>

                    <select
                      className="form-select"
                      value={
                        selectedDoctor
                      }
                      onChange={
                        handleDoctorChange
                      }
                      disabled={
                        !selectedDepartment
                      }
                      required
                    >
                      <option value="">
                        Select Doctor
                      </option>

                      {doctors.map(
                        (doctor) => (
                          <option
                            key={
                              doctor.id
                            }
                            value={
                              doctor.id
                            }
                          >
                            {
                              doctor.doctor_name
                            }
                          </option>
                        )
                      )}
                    </select>
                  </div>

                  {/* FEES */}

                  {feePreview && (
                    <div className="col-12">
                      <div className="alert alert-secondary mb-0">
                        <div className="row g-2">
                          <div className="col-12 col-md-4">
                            <strong>
                              Registration
                              Fee:
                            </strong>{" "}
                            ₹
                            {
                              feePreview.registration_fee
                            }
                          </div>

                          <div className="col-12 col-md-4">
                            <strong>
                              Consultation
                              Fee:
                            </strong>{" "}
                            ₹
                            {
                              feePreview.consultation_fee
                            }
                          </div>

                          <div className="col-12 col-md-4">
                            <strong>
                              Total:
                            </strong>{" "}
                            ₹
                            {
                              feePreview.total_amount
                            }
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TYPE */}

                  <div className="col-12 col-md-4">
                    <label className="form-label">
                      Appointment
                      Type
                    </label>

                    <select
                      className="form-select"
                      value={
                        appointmentType
                      }
                      onChange={
                        handleAppointmentTypeChange
                      }
                    >
                      <option value="WALK_IN">
                        Walk-in
                      </option>

                      <option value="PRIOR_BOOKING">
                        Prior Booking
                      </option>
                    </select>
                  </div>

                  {/* WALK-IN DATE */}

                  {appointmentType ===
                    "WALK_IN" && (
                    <div className="col-12 col-md-4">
                      <label className="form-label">
                        Appointment
                        Date
                      </label>

                      <input
                        type="date"
                        className="form-control"
                        value={
                          appointmentDate
                        }
                        readOnly
                      />

                      <small className="text-muted">
                        Walk-in
                        appointments are
                        for today only.
                      </small>
                    </div>
                  )}

                  {/* PRIOR DATE */}

                  {appointmentType ===
                    "PRIOR_BOOKING" && (
                    <div className="col-12 col-md-4">
                      <label className="form-label">
                        Appointment
                        Date
                      </label>

                      <select
                        className="form-select"
                        value={
                          appointmentDate
                        }
                        onChange={
                          handlePriorDateChange
                        }
                        required
                      >
                        <option value="">
                          Select Date
                        </option>

                        <option
                          value={
                            getTomorrow()
                          }
                        >
                          {getTomorrow()}
                        </option>

                        <option
                          value={
                            getDayAfterTomorrow()
                          }
                        >
                          {
                            getDayAfterTomorrow()
                          }
                        </option>
                      </select>

                      <small className="text-muted">
                        Prior booking
                        is available
                        only for the
                        next 2 days.
                      </small>
                    </div>
                  )}

                  {/* WALK-IN TIME */}

                  {appointmentType ===
                    "WALK_IN" && (
                    <div className="col-12 col-md-4">
                      <label className="form-label">
                        Appointment
                        Time
                      </label>

                      <input
                        type="text"
                        className="form-control"
                        value={
                          loadingSlot
                            ? "Checking..."
                            : appointmentTime
                        }
                        placeholder={
                          selectedDoctor
                            ? "Next available slot"
                            : "Select doctor first"
                        }
                        readOnly
                      />

                      <small className="text-muted">
                        Next available
                        time is assigned
                        automatically.
                      </small>
                    </div>
                  )}

                  {/* PRIOR TIME */}

                  {appointmentType ===
                    "PRIOR_BOOKING" && (
                    <div className="col-12 col-md-4">
                      <label className="form-label">
                        Appointment
                        Time
                      </label>

                      <select
                        className="form-select"
                        value={
                          appointmentTime
                        }
                        onChange={(e) =>
                          setAppointmentTime(
                            e.target.value
                          )
                        }
                        disabled={
                          loadingSlot ||
                          !selectedDoctor ||
                          !appointmentDate ||
                          availableSlots.length ===
                            0
                        }
                        required
                      >
                        <option value="">
                          {loadingSlot
                            ? "Checking..."
                            : "Select Time"}
                        </option>

                        {availableSlots.map(
                          (slot) => (
                            <option
                              key={
                                slot
                              }
                              value={
                                slot
                              }
                            >
                              {formatTime(
                                slot
                              )}
                            </option>
                          )
                        )}
                      </select>

                      <small className="text-muted">
                        Select any
                        available time
                        slot.
                      </small>
                    </div>
                  )}

                  {/* SLOT MESSAGE */}

                  {slotMessage && (
                    <div className="col-12">
                      <div
                        className={`alert ${
                          appointmentType ===
                            "WALK_IN" &&
                          appointmentTime
                            ? "alert-success"
                            : availableSlots.length >
                              0
                            ? "alert-info"
                            : "alert-warning"
                        } mb-0`}
                      >
                        {
                          slotMessage
                        }
                      </div>
                    </div>
                  )}

                  {/* PAYMENT */}

                  <div className="col-12 col-md-6">
                    <label className="form-label">
                      Payment Status
                    </label>

                    <select
                      className="form-select"
                      value={
                        paymentStatus
                      }
                      onChange={(e) =>
                        setPaymentStatus(
                          e.target.value
                        )
                      }
                    >
                      <option value="UNPAID">
                        Unpaid
                      </option>

                      <option value="PAID">
                        Paid
                      </option>
                    </select>
                  </div>
                </div>

                {paymentStatus ===
                  "UNPAID" && (
                  <div className="alert alert-warning mt-3">
                    Payment is not
                    completed.
                    Appointment,
                    token and bill
                    will not be
                    generated.
                  </div>
                )}

                <div className="d-grid d-sm-flex mt-4">
                  <button
                    type="submit"
                    className="btn text-white px-4"
                    style={{
                      backgroundColor:
                        "#1976A3",
                    }}
                    disabled={
                      loadingSlot ||
                      (paymentStatus ===
                        "PAID" &&
                        !appointmentTime)
                    }
                  >
                    Book Appointment
                  </button>
                </div>
              </div>
            </form>
          </>
        )}
      </div>
    );
  }

  // =====================================================
  // EDIT APPOINTMENT PAGE
  // =====================================================

  if (
    selectedAction === "view" &&
    editingAppointment
  ) {
    return (
      <div>
        <BackButton
          onClick={() => {
            setEditingAppointment(
              null
            );

            setMessage("");

            refreshCurrentAppointmentList();
          }}
        />

        <h3>
          Edit Appointment
        </h3>

        <div
          className="card mt-4 shadow-sm"
          style={{
            maxWidth: "800px",
          }}
        >
          <div className="card-body">
            <DetailRow
              label="Appointment ID"
              value={
                editingAppointment.appointment_display_id ||
                `APT${String(
                  editingAppointment.id
                ).padStart(
                  4,
                  "0"
                )}`
              }
            />

            <DetailRow
              label="Patient ID"
              value={
                editingAppointment.patient_id
              }
            />

            <DetailRow
              label="Patient Name"
              value={
                editingAppointment.patient_name
              }
            />

            <DetailRow
              label="Doctor"
              value={
                editingAppointment.doctor_name
              }
            />

            <DetailRow
              label="Department"
              value={
                editingAppointment.department_name
              }
            />

            <DetailRow
              label="Type"
              value={formatAppointmentType(
                editingAppointment.appointment_type
              )}
            />

            <DetailRow
              label="Token"
              value={
                editingAppointment.token_number
              }
            />

            <hr />

            <form
              onSubmit={
                handleUpdateAppointment
              }
            >
              <div className="row g-3">
                <div className="col-12 col-md-6">
                  <label className="form-label">
                    Appointment Date
                  </label>

                  <input
                    type="date"
                    className="form-control"
                    value={
                      editDate
                    }
                    min={
                      getToday()
                    }
                    onChange={
                      handleEditDateChange
                    }
                    required
                  />
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label">
                    Appointment Time
                  </label>

                  <select
                    className="form-select"
                    value={
                      editTime
                    }
                    onChange={(e) =>
                      setEditTime(
                        e.target.value
                      )
                    }
                    disabled={
                      loadingEditSlots ||
                      !editDate
                    }
                    required
                  >
                    <option value="">
                      {loadingEditSlots
                        ? "Checking..."
                        : "Select Available Time"}
                    </option>

                    {editAvailableSlots.map(
                      (slot) => (
                        <option
                          key={
                            slot
                          }
                          value={
                            slot
                          }
                        >
                          {formatTime(
                            slot
                          )}
                        </option>
                      )
                    )}
                  </select>
                </div>
              </div>

              {editSlotMessage && (
                <div className="alert alert-warning mt-3">
                  {
                    editSlotMessage
                  }
                </div>
              )}

              {message && (
                <div className="alert alert-info mt-3">
                  {message}
                </div>
              )}

              <div className="d-grid d-sm-flex mt-4">
                <button
                  type="submit"
                  className="btn text-white px-4"
                  style={{
                    backgroundColor:
                      "#1976A3",
                  }}
                  disabled={
                    loadingEditSlots
                  }
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // =====================================================
  // VIEW / LOG PAGE
  // =====================================================

  if (
    selectedAction === "view" ||
    selectedAction === "log"
  ) {
    const isLog =
      selectedAction === "log";

    return (
      <div>
        <BackButton
          onClick={goBack}
        />

        <h3>
          {isLog
            ? "Appointment Log"
            : "View and Edit Appointments"}
        </h3>

        {/* FILTER CARD */}

        <div className="card mt-4">
          <div className="card-body">
            <h5 className="mb-3">
              Filter Appointments
            </h5>

            <div className="row g-3 align-items-end">
              <div className="col-12 col-lg-5">
                <label className="form-label">
                  Appointment Date
                </label>

                <input
                  type="date"
                  className="form-control"
                  value={
                    filterDate
                  }
                  onChange={(e) =>
                    setFilterDate(
                      e.target.value
                    )
                  }
                />
              </div>

              <div className="col-12 col-lg-7">
                <div className="d-grid d-sm-flex gap-2">
                  <button
                    type="button"
                    className="btn text-white px-4"
                    style={{
                      backgroundColor:
                        "#1976A3",
                    }}
                    onClick={
                      handleDateFilter
                    }
                  >
                    Filter Date
                  </button>

                  <button
                    type="button"
                    className="btn btn-secondary px-4"
                    onClick={
                      clearFilter
                    }
                  >
                    Clear Date
                  </button>
                </div>
              </div>
            </div>

            {/* TYPE FILTER */}

            <div className="mt-4">
              <label className="form-label">
                Appointment Type
              </label>

              <div className="row g-2">
                <div className="col-12 col-sm-auto">
                  <button
                    type="button"
                    className={`btn w-100 px-4 ${
                      appointmentTypeFilter ===
                      "ALL"
                        ? "btn-primary"
                        : "btn-outline-primary"
                    }`}
                    onClick={() =>
                      handleTypeFilterChange(
                        "ALL"
                      )
                    }
                  >
                    All
                  </button>
                </div>

                <div className="col-12 col-sm-auto">
                  <button
                    type="button"
                    className={`btn w-100 px-4 ${
                      appointmentTypeFilter ===
                      "WALK_IN"
                        ? "btn-primary"
                        : "btn-outline-primary"
                    }`}
                    onClick={() =>
                      handleTypeFilterChange(
                        "WALK_IN"
                      )
                    }
                  >
                    Walk-in
                  </button>
                </div>

                <div className="col-12 col-sm-auto">
                  <button
                    type="button"
                    className={`btn w-100 px-4 ${
                      appointmentTypeFilter ===
                      "PRIOR_BOOKING"
                        ? "btn-primary"
                        : "btn-outline-primary"
                    }`}
                    onClick={() =>
                      handleTypeFilterChange(
                        "PRIOR_BOOKING"
                      )
                    }
                  >
                    Prior Booking
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {message && (
          <div className="alert alert-info mt-3">
            {message}
          </div>
        )}

        <AppointmentTable
          appointments={
            appointments
          }
          showActions={!isLog}
          onCancel={
            handleCancelAppointment
          }
          onEdit={
            handleEditAppointment
          }
          formatAppointmentType={
            formatAppointmentType
          }
          formatTime={
            formatTime
          }
        />
      </div>
    );
  }

  return null;
}

// =========================================================
// APPOINTMENT TABLE
// =========================================================

function AppointmentTable({
  appointments,
  showActions,
  onCancel,
  onEdit,
  formatAppointmentType,
  formatTime,
}) {
  return (
    <div className="card mt-4">
      <div className="card-body p-0 p-sm-3">
        <div className="table-responsive">
          <table className="table table-bordered table-hover align-middle mb-0">
            <thead>
              <tr>
                <th className="text-nowrap">
                  Appointment ID
                </th>

                <th className="text-nowrap">
                  Patient ID
                </th>

                <th>
                  Patient
                </th>

                <th>
                  Doctor
                </th>

                <th>
                  Department
                </th>

                <th>
                  Type
                </th>

                <th>
                  Date
                </th>

                <th>
                  Time
                </th>

                <th>
                  Token
                </th>

                <th>
                  Status
                </th>

                {showActions && (
                  <th className="text-center">
                    Actions
                  </th>
                )}
              </tr>
            </thead>

            <tbody>
              {appointments.length >
              0 ? (
                appointments.map(
                  (
                    appointment
                  ) => (
                    <tr
                      key={
                        appointment.id
                      }
                    >
                      <td className="text-nowrap">
                        {appointment.appointment_display_id ||
                          `APT${String(
                            appointment.id
                          ).padStart(
                            4,
                            "0"
                          )}`}
                      </td>

                      <td className="text-nowrap">
                        {appointment.patient_id ||
                          "-"}
                      </td>

                      <td>
                        {
                          appointment.patient_name
                        }
                      </td>

                      <td>
                        {
                          appointment.doctor_name
                        }
                      </td>

                      <td>
                        {appointment.department_name ||
                          "-"}
                      </td>

                      <td className="text-nowrap">
                        {formatAppointmentType(
                          appointment.appointment_type
                        )}
                      </td>

                      <td className="text-nowrap">
                        {
                          appointment.appointment_date
                        }
                      </td>

                      <td className="text-nowrap">
                        {formatTime(
                          appointment.appointment_time
                        )}
                      </td>

                      <td className="text-center">
                        {
                          appointment.token_number
                        }
                      </td>

                      <td>
                        <span
                          className={`badge ${
                            appointment.status ===
                            "SCHEDULED"
                              ? "bg-primary"
                              : appointment.status ===
                                "COMPLETED"
                              ? "bg-success"
                              : "bg-secondary"
                          }`}
                        >
                          {
                            appointment.status
                          }
                        </span>
                      </td>

                      {showActions && (
                        <td>
                          {appointment.status ===
                          "SCHEDULED" ? (
                            <div className="d-flex flex-column flex-xl-row gap-2 justify-content-center align-items-stretch">
                              <button
                                type="button"
                                className="btn btn-sm btn-warning text-nowrap"
                                onClick={() =>
                                  onEdit(
                                    appointment
                                  )
                                }
                              >
                                Edit
                              </button>

                              <button
                                type="button"
                                className="btn btn-sm btn-danger text-nowrap"
                                onClick={() =>
                                  onCancel(
                                    appointment.id
                                  )
                                }
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <div className="text-center">
                              -
                            </div>
                          )}
                        </td>
                      )}
                    </tr>
                  )
                )
              ) : (
                <tr>
                  <td
                    colSpan={
                      showActions
                        ? 11
                        : 10
                    }
                    className="text-center py-4"
                  >
                    No appointments
                    found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// =========================================================
// DETAIL ROW
// =========================================================

function DetailRow({
  label,
  value,
}) {
  return (
    <div className="row py-2 border-bottom">
      <div className="col-12 col-sm-4 fw-bold mb-1 mb-sm-0">
        {label}
      </div>

      <div className="col-12 col-sm-8">
        {value ?? "-"}
      </div>
    </div>
  );
}

// =========================================================
// BACK BUTTON
// =========================================================

function BackButton({
  onClick,
}) {
  return (
    <button
      type="button"
      className="btn btn-secondary mb-3"
      onClick={onClick}
    >
      ← Back
    </button>
  );
}

export default Appointments;

