export default {
	async onPageLoad() {
    try {
      const patientId = appsmith.URL.queryParams.patient_id;
      if (!patientId) {
        showAlert("patient_id가 없습니다. 환자 목록으로 이동합니다.", "warning");
        navigateTo("Patients");
        return;
      }
      await storeValue("selectedPatientId", Number(patientId));
      await storeValue("selectedVisitId", null);
      await storeValue("selectedTestResultId", null);
      await Api_ReadPatient.run();
      await Api_ReadPatientVisits.run();
      const visits = Api_ReadPatientVisits.data || [];

      if (!visits.length) {
        return;
      }

      const firstVisit = visits[0];
      await storeValue("selectedVisitId", firstVisit.id);
      await Api_ReadVisit.run();
      await Api_ReadVisitTestResult.run();
      const testResult = Api_ReadVisitTestResult.data;

      if (testResult && testResult.id) {
        await storeValue("selectedTestResultId", testResult.id);
        await Api_ReadBacteriaDetails.run();
      } else {
        await storeValue("selectedTestResultId", null);
      }
    } catch (e) {
      showAlert("환자 상세 정보를 불러오지 못했습니다.", "error");
      console.log("onPageLoad error", e);
    }
  },
	
  async goBackToPatients() {
    navigateTo("Patients");
  },

  async openPatientEditModal() {
    showModal(modalPatientEdit.name);
  },

  async submitPatientEdit() {
    try {
      await Api_UpdatePatient.run();

      closeModal(modalPatientEdit.name);

      await Api_ReadPatient.run();

      showAlert("환자 정보가 수정되었습니다.", "success");
    } catch (e) {
      showAlert("환자 정보 수정에 실패했습니다.", "error");
      console.log("submitPatientEdit error", e);
    }
  },

  async openVisitCreateModal() {
    showModal(modalVisitCreate.name);
  },

  async submitVisitCreate() {
    try {
      await Api_CreateVisit.run();

      closeModal(modalVisitCreate.name);

      await Api_ReadPatientVisits.run();

      showAlert("내원 정보가 등록되었습니다.", "success");
    } catch (e) {
      showAlert("내원 정보 등록에 실패했습니다.", "error");
      console.log("submitVisitCreate error", e);
    }
  },

  async selectVisitAndLoad(row) {
  try {
    await storeValue("selectedVisitId", row.id);
    await storeValue("selectedTestResultId", null);

    await Api_ReadVisit.run();
    await Api_ReadVisitTestResult.run();

    const testResult = Api_ReadVisitTestResult.data;

    if (testResult && testResult.id) {
      await storeValue("selectedTestResultId", testResult.id);
      await Api_ReadBacteriaDetails.run();
    }

    showAlert("내원 상세를 불러왔습니다.", "success");
  } catch (e) {
    showAlert("내원 상세 조회에 실패했습니다.", "error");
    console.log("selectVisitAndLoad error", e);
  }
},

  async openVisitEditModal() {
    showModal(modalVisitEdit.name);
  },

  async submitVisitEdit() {
    try {
      await Api_UpdateVisit.run();

      closeModal(modalVisitEdit.name);

      await Api_ReadPatientVisits.run();
      await Api_ReadVisit.run();

      showAlert("내원 정보가 수정되었습니다.", "success");
    } catch (e) {
      showAlert("내원 정보 수정에 실패했습니다.", "error");
      console.log("submitVisitEdit error", e);
    }
  },


  async createOrUpdateTestResult() {
		try {
			await Api_UpdateVisitTestResult.run();
			await Api_ReadVisitTestResult.run();

			const testResult = Api_ReadVisitTestResult.data;

			if (testResult && testResult.id) {
				await storeValue("selectedTestResultId", testResult.id);
				await Api_ReadBacteriaDetails.run();
			}

			showAlert("검사 결과가 저장되었습니다.", "success");
		} catch (e) {
			showAlert("검사 결과 저장에 실패했습니다.", "error");
			console.log("createOrUpdateTestResult error", e);
		}
	},
	
  async saveBacteriaDetails() {
    try {
      await Api_ReplaceBacteriaDetails.run();
      await Api_ReadBacteriaDetails.run();

      showAlert("세균 상세 결과가 저장되었습니다.", "success");
    } catch (e) {
      showAlert("세균 상세 저장에 실패했습니다.", "error");
      console.log("saveBacteriaDetails error", e);
    }
  },

  async clearTestResultArea() {
    await storeValue("selectedTestResultId", null);
  },
	
	
  async deleteVisit() {
    const confirmed = await showAlert("삭제 버튼을 누르기 전에 Confirm 모달을 연결하는 것을 권장합니다.", "warning");

    try {
      await Api_DeleteVisit.run();

      await storeValue("selectedVisitId", null);
      await storeValue("selectedTestResultId", null);

      await Api_ReadPatientVisits.run();

      showAlert("내원 정보가 삭제되었습니다.", "success");
    } catch (e) {
      showAlert("내원 정보 삭제에 실패했습니다.", "error");
      console.log("deleteVisit error", e);
    }
  },
	
	async deleteTestResult() {
    try {
      await Api_DeleteVisitTestResult.run();

      await storeValue("selectedTestResultId", null);

      showAlert("검사 결과가 삭제되었습니다.", "success");
    } catch (e) {
      showAlert("검사 결과 삭제에 실패했습니다.", "error");
      console.log("deleteTestResult error", e);
    }
  },
	
	async confirmDeleteVisit() {
		try {
			await Api_DeleteVisit.run();

			closeModal(modalConfirmDeleteVisit.name);

			await storeValue("selectedVisitId", null);
			await storeValue("selectedTestResultId", null);

			await Api_ReadPatientVisits.run();

			showAlert("내원 정보가 삭제되었습니다.", "success");
		} catch (e) {
			showAlert("내원 정보 삭제에 실패했습니다.", "error");
			console.log("confirmDeleteVisit error", e);
		}
	},
	
	async confirmDeleteTestResult() {
		try {
			await Api_DeleteVisitTestResult.run();

			closeModal(modalConfirmDeleteTestResult.name);

			await storeValue("selectedTestResultId", null);

			showAlert("검사 결과가 삭제되었습니다.", "success");
		} catch (e) {
			showAlert("검사 결과 삭제에 실패했습니다.", "error");
			console.log("confirmDeleteTestResult error", e);
		}
	},
}