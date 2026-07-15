import api from "./api.js";

export const getInstallments = async () => {
  const response = await api.get("/installments");
  return response.data.data.installments;
};

export const payInstallment = async (id, payment) => {
  const response = await api.patch(`/installments/${id}/pay`, payment);
  return response.data.data.installment;
};
