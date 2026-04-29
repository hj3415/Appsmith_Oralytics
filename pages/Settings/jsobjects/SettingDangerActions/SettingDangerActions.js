export default {
	
	openResetClinicalModal() {
    resetWidget("inputResetClinicalConfirm", true);
    showModal(mdlResetClinicalData.name);
  },

  openResetAllModal() {
    resetWidget("inputResetAllConfirm", true);
    showModal(mdlResetAllData.name);
  },

  async resetClinicalData() {
    if (inputResetClinicalConfirm.text !== "RESET ORALYTICS") {
      showAlert("확인 문구가 일치하지 않습니다.", "warning");
      return;
    }

    await Api_ResetClinicalData.run().catch(() => {});
    const body = Api_ResetClinicalData.data;
    const ok = Api_ResetClinicalData.responseMeta?.isExecutionSuccess;

    if (ok) {
      closeModal(mdlResetClinicalData.name);
      await storeValue("selectedPatientId", null);
      await storeValue("selectedVisitId", null);
      await storeValue("selectedTestResultId", null);
      showAlert(body?.message || "진료 데이터가 초기화되었습니다.", "success");
      return;
    }

    showAlert(body?.message || "진료 데이터 초기화에 실패했습니다.", "error");
    console.log("resetClinicalData body:", body);
    console.log("resetClinicalData responseMeta:", Api_ResetClinicalData.responseMeta);
  },

  async resetAllData() {
    if (inputResetAllConfirm.text !== "RESET ORALYTICS") {
      showAlert("확인 문구가 일치하지 않습니다.", "warning");
      return;
    }

    await Api_ResetAllData.run().catch(() => {});
    const body = Api_ResetAllData.data;
    const ok = Api_ResetAllData.responseMeta?.isExecutionSuccess;

    if (ok) {
      closeModal(mdlResetAllData.name);
      await storeValue("selectedPatientId", null);
      await storeValue("selectedVisitId", null);
      await storeValue("selectedTestResultId", null);
      await storeValue("selectedBacteriaCode", null);
      await storeValue("selectedBacteriaMaster", null);
      await storeValue("selectedRecCode", null);
      await storeValue("selectedRecMaster", null);

      await Api_ListBacteriaMasters.run().catch(() => {});
      await Api_ListRecMasters.run().catch(() => {});
      showAlert(body?.message || "전체 데이터가 초기화되었습니다.", "success");
      return;
    }

    showAlert(body?.message || "전체 데이터 초기화에 실패했습니다.", "error");
    console.log("resetAllData body:", body);
    console.log("resetAllData responseMeta:", Api_ResetAllData.responseMeta);
  }
}