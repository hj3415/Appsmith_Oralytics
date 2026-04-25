export default {
  async init() {
    const patientId = appsmith.store.selectedPatientId;
    const visitId = appsmith.store.selectedVisitId;
		/*
    if (!patientId || !visitId) {
      showAlert("환자 또는 방문 정보가 없습니다.", "warning");
      navigateTo("PatientDetailPage");
      return;
    }
		*/
    await Promise.all([
      Api_ReadPatient.run(),
      Api_ReadVisit.run(),
      Api_ReadBacteriaMaster.run(),
      Api_ReadRecommendationMaster.run()
    ]);

    await Api_ReadVisitTestResult.run();

    const testResult = Api_ReadVisitTestResult.data.data;

    if (testResult?.id) {
      await storeValue("selectedTestResultId", testResult.id);

      await Promise.all([
        Api_ReadBacteriaDetails.run(),
        Api_ReadRecommendations.run()
      ]);
    } else {
      await storeValue("selectedTestResultId", null);
    }
  },

  async saveTestResultHeader() {
    const existing = Api_ReadVisitTestResult.data.data;

    if (existing?.id) {
      await Api_UpdateTestResult.run();
    } else {
      await Api_CreateTestResult.run();
    }

    await Api_ReadVisitTestResult.run();

    const saved = Api_ReadVisitTestResult.data.data;

    if (saved?.id) {
      await storeValue("selectedTestResultId", saved.id);

      await Promise.all([
        Api_ReadBacteriaDetails.run(),
        Api_ReadRecommendations.run()
      ]);

      showAlert("검사결과 기본 정보가 저장되었습니다.", "success");
    }
  },

  bacteriaTableData() {
    const savedItems = Api_ReadBacteriaDetails.data?.data?.items || [];
    const masters = Api_ReadBacteriaMaster.data?.data?.items || [];

    if (savedItems.length > 0) {
      return savedItems;
    }

    return masters.map((m) => ({
      bacteria_code: m.code,
      bacteria_name: m.name,
      bacteria_category: m.category,
      detected: false,
      quantity_value: null,
      quantity_level_code: "",
      activity_level_code: "",
      clinical_risk_grade_code: "",
      interpretation_text: "",
      note: ""
    }));
  },

  bacteriaPayloadItems() {
    const rows = Table_BacteriaDetails.updatedRows && Table_BacteriaDetails.updatedRows.length > 0
      ? Table_BacteriaDetails.tableData.map(row => {
          const updated = Table_BacteriaDetails.updatedRows.find(u => u.index === row.__originalIndex__);
          return updated ? { ...row, ...updated.allFields } : row;
        })
      : Table_BacteriaDetails.tableData;

    return rows.map((r) => ({
      bacteria_code: r.bacteria_code,
      detected: !!r.detected,
      quantity_value: r.quantity_value === "" || r.quantity_value == null ? null : Number(r.quantity_value),
      quantity_level_code: r.quantity_level_code || null,
      activity_level_code: r.activity_level_code || null,
      clinical_risk_grade_code: r.clinical_risk_grade_code || null,
      interpretation_text: r.interpretation_text || null,
      note: r.note || null
    }));
  },

  async saveBacteriaDetails() {
    const testResultId = appsmith.store.selectedTestResultId;

    if (!testResultId) {
      showAlert("먼저 검사결과 기본 정보를 저장해 주세요.", "warning");
      return;
    }

    await Api_SaveBacteriaDetails.run();
    await Api_ReadBacteriaDetails.run();

    showAlert("세균 상세 정보가 저장되었습니다.", "success");
  },

  recommendationTableData() {
    const savedItems = Api_ReadRecommendations.data?.data?.items || [];

    if (savedItems.length > 0) {
      return savedItems;
    }

    return [];
  },

  recommendationPayloadItems() {
    return Table_Recommendations.tableData
      .filter((r) => r.recommendation_code)
      .map((r) => ({
        recommendation_code: r.recommendation_code,
        source: r.source || "manual",
        reason_text: r.reason_text || null
      }));
  },

  async saveRecommendations() {
    const testResultId = appsmith.store.selectedTestResultId;

    if (!testResultId) {
      showAlert("먼저 검사결과 기본 정보를 저장해 주세요.", "warning");
      return;
    }

    await Api_SaveRecommendations.run();
    await Api_ReadRecommendations.run();

    showAlert("Recommendation 정보가 저장되었습니다.", "success");
  },

  async saveAll() {
    await this.saveTestResultHeader();
    await this.saveBacteriaDetails();
    await this.saveRecommendations();

    showAlert("검사결과 전체가 저장되었습니다.", "success");
  },

  async saveAllAndGoReport() {
    await this.saveAll();
    navigateTo("ReportViewPage");
  },

  goReportView() {
    const testResultId = appsmith.store.selectedTestResultId;

    if (!testResultId) {
      showAlert("먼저 검사결과를 저장해 주세요.", "warning");
      return;
    }

    navigateTo("ReportViewPage");
  }
};