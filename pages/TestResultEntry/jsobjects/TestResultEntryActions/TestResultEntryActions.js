export default {
  async init() {
		try {
			const patientId =
				appsmith.URL.queryParams.patient_id ||
				appsmith.store.selectedPatientId;

			const visitId =
				appsmith.URL.queryParams.visit_id ||
				appsmith.store.selectedVisitId;

			const testResultId =
				appsmith.URL.queryParams.test_result_id ||
				appsmith.store.selectedTestResultId;

			if (!patientId || !visitId || !testResultId) {
				showAlert("환자, 방문 또는 검사결과 정보가 없습니다.", "warning");
				navigateTo("PatientDetailPage", {
					patient_id: patientId,
				});
				return;
			}

			await storeValue("selectedPatientId", Number(patientId));
			await storeValue("selectedVisitId", Number(visitId));
			await storeValue("selectedTestResultId", Number(testResultId));

			await Promise.all([
				Api_ReadPatient.run(),
				Api_ReadVisit.run(),
				Api_ReadBacteriaMaster.run(),
				Api_ReadRecommendationMaster.run()
			]);

			await Api_ReadVisitTestResult.run();

			const testResult = Api_ReadVisitTestResult.data.data;

			if (!testResult?.id) {
				showAlert("검사결과 정보를 찾을 수 없습니다.", "warning");
				navigateTo("PatientDetailPage", {
					patient_id: patientId,
				});
				return;
			}

			await storeValue("selectedTestResultId", testResult.id);

			await Promise.all([
				Api_ReadBacteriaDetails.run(),
				Api_ReadRecommendations.run()
			]);

		} catch (e) {
			showAlert("검사결과 입력 화면을 불러오지 못했습니다.", "error");
			console.log("TestResultEntry init error", e);
		}
	},

  async saveTestResultHeader() {
    const existing = Api_ReadVisitTestResult.data.data;

    if (existing?.id) {
      await Api_UpdateVisitTestResult.run();
    } else {
      await Api_CreateVisitTestResult.run();
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
    const rows = tblBacteriaDetails.updatedRows && tblBacteriaDetails.updatedRows.length > 0
      ? tblBacteriaDetails.tableData.map(row => {
          const updated = tblBacteriaDetails.updatedRows.find(u => u.index === row.__originalIndex__);
          return updated ? { ...row, ...updated.allFields } : row;
        })
      : tblBacteriaDetails.tableData;

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
    return tblRecommendations.tableData
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
};