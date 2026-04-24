export default {
  searchPatients: async () => {
    await Api_ReadPatientList.run().catch(() => {});

    const body = Api_ReadPatientList.data;
    const ok = Api_ReadPatientList.responseMeta?.isExecutionSuccess;

    if (!ok) {
      showAlert(body?.message || "환자 조회에 실패했습니다.", "error");
      console.log("searchPatients body:", body);
      console.log("searchPatients responseMeta:", Api_ReadPatientList.responseMeta);
    }
  },

  resetSearch: async () => {
    resetWidget("Input_PatientSearch", true);

    await Api_ReadPatientList.run().catch(() => {});

    const body = Api_ReadPatientList.data;
    const ok = Api_ReadPatientList.responseMeta?.isExecutionSuccess;

    if (!ok) {
      showAlert(body?.message || "검색 초기화 후 환자 조회에 실패했습니다.", "error");
      console.log("resetSearch body:", body);
      console.log("resetSearch responseMeta:", Api_ReadPatientList.responseMeta);
    }
  },

  openNewPatientModal: () => {
		resetWidget("Input_NewPatientChartNo", true);
		resetWidget("Input_NewPatientName", true);
		resetWidget("Input_NewPatientBirthDate", true);
		resetWidget("Input_NewPatientPhone", true);
    showModal(Modal_NewPatient.name);
  },

  submitNewPatient: async () => {
    await Api_CreatePatient.run().catch(() => {});

    const body = Api_CreatePatient.data;
    const ok = Api_CreatePatient.responseMeta?.isExecutionSuccess;

    if (ok) {
      closeModal(Modal_NewPatient.name);
			
			resetWidget("Input_NewPatientChartNo", true);
			resetWidget("Input_NewPatientName", true);
			resetWidget("Input_NewPatientBirthDate", true);
			resetWidget("Input_NewPatientPhone", true);

      await Api_ReadPatientList.run().catch(() => {});

      const listOk = Api_ReadPatientList.responseMeta?.isExecutionSuccess;

      if (!listOk) {
        showAlert(
          Api_ReadPatientList.data?.message || "환자 목록 새로고침에 실패했습니다.",
          "warning"
        );
        console.log("submitNewPatient refresh body:", Api_ReadPatientList.data);
        console.log("submitNewPatient refresh responseMeta:", Api_ReadPatientList.responseMeta);
        return;
      }

      showAlert(body?.message || "환자가 등록되었습니다.", "success");
      return;
    }

    if (body?.code === "PATIENT_DUPLICATE") {
      showAlert(body?.message || "이미 등록된 차트번호입니다.", "warning");
    } else {
      showAlert(body?.message || "환자 등록에 실패했습니다.", "error");
    }

    console.log("submitNewPatient body:", body);
    console.log("submitNewPatient responseMeta:", Api_CreatePatient.responseMeta);
  },

  goToPatientDetail: (patientId) => {
    navigateTo("PatientDetail", { patient_id: patientId }, "SAME_WINDOW");
  }
};