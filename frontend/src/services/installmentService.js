import api from "./api.js";

export const getInstallments = async () => {
  const response = await api.get("/installments");
  return response.data.data.installments;
};

export const createInstallment = async (saleId, installment) => {
  const response = await api.post(`/installments/sale/${saleId}`, installment);
  return response.data.data.installment;
};

export const payInstallment = async (id, payment) => {
  const response = await api.patch(`/installments/${id}/pay`, payment);
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
