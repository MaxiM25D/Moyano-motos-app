import api from "./api.js";

export const getInstallments = async ({ search = "", filter = "ALL", sort = "PRIORITY", page = 1, pageSize = 20 } = {}) => {
  const response = await api.get("/installments", {
    params: { search: search || undefined, filter, sort, page, pageSize }
  });
  return response.data.data;
};

export const createInstallment = async (saleId, installment) => {
  const response = await api.post(`/installments/sale/${saleId}`, installment);
  return response.data.data.installment;
};

export const payInstallment = async (id, payment) => {
  const response = await api.patch(`/installments/${id}/pay`, payment);
  return response.data.data.installment;
};

export const revertInstallmentPayment = async (id) => {
  const response = await api.patch(`/installments/${id}/revert-payment`);
  return response.data.data.installment;
};

export const updateInstallment = async (id, installment) => {
  const response = await api.patch(`/installments/${id}`, installment);
  return response.data.data.installment;
};

export const updateInstallmentPlan = async (id, installment) => {
  const response = await api.patch(`/installments/${id}/plan`, installment);
  return response.data.data.installment;
};

export const deleteInstallment = async (id) => {
  const response = await api.delete(`/installments/${id}`);
  return response.data.data.installment;
};
