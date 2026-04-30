export default {
  getData(api) {
    return api.data?.data ?? null;
  },

  getItems(api) {
    return api.data?.data?.items ?? [];
  },

  getError(api) {
    return api.data?.message || "Unknown error";
  },

  isSuccess(api) {
    return api.data?.success === true;
  }
};