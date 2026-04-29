export default {
  async init() {
    await Promise.all([
      Api_ListBacteriaMasters.run(),
      Api_ListRecMasters.run()
    ]);
  },

  async refreshBacteriaMasters() {
    await Api_ListBacteriaMasters.run();
  },

  async refreshRecMasters() {
    await Api_ListRecMasters.run();
  },

  openBacteriaCreateModal() {
		resetWidget("inputBacteriaCreateCode", true);
		resetWidget("inputBacteriaCreateName", true);
		resetWidget("inputBacteriaCreateCategory", true);
		
    showModal(mdlBacteriaCreate.name);
  },

  async createBacteriaMaster() {
    try {
      if (!inputBacteriaCreateCode.text || !inputBacteriaCreateName.text) {
        showAlert("세균 코드와 이름은 필수입니다.", "warning");
        return;
      }

      await Api_CreateBacteriaMaster.run();
      closeModal(mdlBacteriaCreate.name);
      await Api_ListBacteriaMasters.run();

      showAlert("세균 마스터가 추가되었습니다.", "success");
    } catch (e) {
      console.log("createBacteriaMaster error", e);
      showAlert("세균 마스터 추가에 실패했습니다.", "error");
    }
  },

  openBacteriaEditModal() {
		const row = tblBacteriaMasters.selectedRow;
		return this.selectBacteriaAndOpenEdit(row);
	},
	
	async selectBacteriaAndOpenEdit(row) {
		try {
			if (!row || !row.code) {
				showAlert("수정할 세균 항목을 선택해 주세요.", "warning");
				return;
			}

			await storeValue("selectedBacteriaCode", row.code);
			await storeValue("selectedBacteriaMaster", row);
			
			setTimeout(() => {
				showModal(mdlBacteriaEdit.name);
			}, 100);
			
		} catch (e) {
			showAlert("세균 항목 선택에 실패했습니다.", "error");
			console.log("selectBacteriaAndOpenEdit error", e);
		}
	},
	
  async updateBacteriaMaster() {
    await Api_UpdateBacteriaMaster.run().catch(() => {});
    const body = Api_UpdateBacteriaMaster.data;
    const ok = Api_UpdateBacteriaMaster.responseMeta?.isExecutionSuccess;
		
    if (ok) {
      closeModal(mdlBacteriaEdit.name);
      await Api_ListBacteriaMasters.run().catch(() => {});
      showAlert(body?.message || "세균 마스터가 수정되었습니다.", "success");
      return;
    }

    showAlert(body?.message || "세균 마스터 수정에 실패했습니다.", "error");
    console.log("updateBacteriaMaster body:", body);
    console.log("updateBacteriaMaster responseMeta:", Api_UpdateBacteriaMaster.responseMeta);
  },

  async deleteBacteriaMaster() {
    try {
      const row = tblBacteriaMasters.selectedRow;

      if (!row || !row.code) {
        showAlert("삭제할 세균 항목을 선택해 주세요.", "warning");
        return;
      }

      await Api_DeleteBacteriaMaster.run();
      await Api_ListBacteriaMasters.run();

      showAlert("세균 마스터가 삭제되었습니다.", "success");
    } catch (e) {
      console.log("deleteBacteriaMaster error", e);
      showAlert("세균 마스터 삭제에 실패했습니다. 이미 검사결과에서 사용 중일 수 있습니다.", "error");
    }
  },

  openRecCreateModal() {
    showModal(mdlRecCreate.name);
  },

  async createRecMaster() {
    try {
      if (!inputRecCreateCode.text || !inputRecCreateName.text) {
        showAlert("추천 코드와 이름은 필수입니다.", "warning");
        return;
      }

      await Api_CreateRecMaster.run();
      closeModal(mdlRecCreate.name);
      await Api_ListRecMasters.run();

      showAlert("추천 마스터가 추가되었습니다.", "success");
    } catch (e) {
      console.log("createRecommendationMaster error", e);
      showAlert("추천 마스터 추가에 실패했습니다.", "error");
    }
  },

  openRecEditModal() {
    const row = tblRecMasters.selectedRow;
		return this.selectRecAndOpenEdit(row);
  },
	
	async selectRecAndOpenEdit(row) {
  try {
    if (!row || !row.code) {
      showAlert("수정할 추천 항목을 선택해 주세요.", "warning");
      return;
    }

    await storeValue("selectedRecCode", row.code);
    await storeValue("selectedRecMaster", row);

    setTimeout(() => {
      showModal(mdlRecEdit.name);
    }, 100);
  } catch (e) {
    showAlert("추천 항목 선택에 실패했습니다.", "error");
    console.log("selectRecAndOpenEdit error", e);
  }
},

  async updateRecMaster() {
    await Api_UpdateRecMaster.run().catch(() => {});
    const body = Api_UpdateRecMaster.data;
    const ok = Api_UpdateRecMaster.responseMeta?.isExecutionSuccess;

    if (ok) {
      closeModal(mdlRecEdit.name);
      await Api_ListRecMasters.run().catch(() => {});
      showAlert(body?.message || "추천 마스터가 수정되었습니다.", "success");
      return;
    }

    showAlert(body?.message || "추천 마스터 수정에 실패했습니다.", "error");
    console.log("updateRecommendationMaster body:", body);
    console.log("updateRecommendationMaster responseMeta:", Api_UpdateRecMaster.responseMeta);
  },

  async deactivateRecMaster() {
    try {
      const row = tblRecMasters.selectedRow;

      if (!row || !row.code) {
        showAlert("비활성화할 추천 항목을 선택해 주세요.", "warning");
        return;
      }

      await Api_DeactivateRecMaster.run();
      await Api_ListRecMasters.run();

      showAlert("추천 마스터가 비활성화되었습니다.", "success");
    } catch (e) {
      console.log("deactivateRecommendationMaster error", e);
      showAlert("추천 마스터 비활성화에 실패했습니다.", "error");
    }
  },
};