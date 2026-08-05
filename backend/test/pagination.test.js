import assert from "node:assert/strict";
import test from "node:test";
import { parsePagination } from "../src/utils/pagination.js";

test("usa una pagina de 20 registros por defecto", () => {
  assert.deepEqual(parsePagination({}), { page: 1, pageSize: 20, skip: 0 });
});

test("calcula el desplazamiento de la página solicitada", () => {
  assert.deepEqual(
    parsePagination({ page: "3", pageSize: "15" }),
    { page: 3, pageSize: 15, skip: 30 }
  );
});

test("limita el tamaño máximo de página", () => {
  assert.deepEqual(
    parsePagination({ page: "2", pageSize: "500" }),
    { page: 2, pageSize: 50, skip: 50 }
  );
});

test("rechaza números de página inválidos", () => {
  assert.throws(() => parsePagination({ page: "0" }), /Página inválida/);
});
