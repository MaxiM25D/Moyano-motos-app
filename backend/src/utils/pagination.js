import { HttpError } from "./httpError.js";

const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 50;

const parsePositiveInteger = (value, fallback, label) => {
  if (value === undefined || value === "") return fallback;

  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new HttpError(`${label} inválida`, 400);
  }
  return parsed;
};

export const parsePagination = ({ page, pageSize }) => {
  const parsedPage = parsePositiveInteger(page, 1, "Página");
  const parsedPageSize = parsePositiveInteger(pageSize, DEFAULT_PAGE_SIZE, "Cantidad por página");

  return {
    page: parsedPage,
    pageSize: Math.min(parsedPageSize, MAX_PAGE_SIZE),
    skip: (parsedPage - 1) * Math.min(parsedPageSize, MAX_PAGE_SIZE)
  };
};

export const buildPagination = (total, page, pageSize) => ({
  page,
  pageSize,
  total,
  totalPages: Math.max(Math.ceil(total / pageSize), 1)
});
