export default {
	searchPatients: async () => {
    await Api_GetPatients.run();
  },
	resetSearch: async () => {
    resetWidget("Input_PatientSearch", true);
    await Api_GetPatients.run();
  },
	openNewPatientModal: () => {
    showModal(Modal_NewPatient.name);
  },
	submitNewPatient: async () => {
    await Api_CreatePatient.run();
    closeModal(Modal_NewPatient.name);
    await Api_GetPatients.run();
    showAlert("환자가 등록되었습니다.", "success");
  },
	goToPatientDetail: (patientId) => {
    navigateTo("PatientDetail", { patient_id: patientId }, "SAME_WINDOW");
  }
}
