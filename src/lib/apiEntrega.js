// src/lib/apiEntrega.js
const API =
  import.meta.env.VITE_API_URL || "https://crm.grupoautomotrizryr.com";
// import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

function getAuthHeader() {
  try {
    const t = localStorage.getItem("auth.access");
    if (!t) return {};
    return { Authorization: `Bearer ${t}` };
  } catch {
    return {};
  }
}

async function leerError(res) {
  const contentType = res.headers.get("content-type") || "";

  try {
    if (contentType.includes("application/json")) {
      const data = await res.json();

      if (typeof data === "string") return data;
      if (data.detail) return data.detail;
      if (data.message) return data.message;

      return JSON.stringify(data);
    }

    return await res.text();
  } catch {
    return `HTTP ${res.status}`;
  }
}

async function http(
  path,
  { method = "GET", body, headers, responseType } = {},
) {
  const finalHeaders = {
    ...getAuthHeader(),
    ...(headers || {}),
  };

  const res = await fetch(`${API}${path}`, {
    method,
    headers: finalHeaders,
    body,
  });

  if (!res.ok) {
    const error = await leerError(res);
    throw new Error(error || `HTTP ${res.status}`);
  }

  if (res.status === 204) return null;

  if (responseType === "blob") {
    return await res.blob();
  }

  const ct = res.headers.get("content-type") || "";

  if (ct.includes("application/json")) {
    return await res.json();
  }

  return await res.text();
}

function limpiarNombreArchivo(nombre) {
  return String(nombre || "encuesta_entrega.pdf")
    .trim()
    .replace(/[\\/:*?"<>|]+/g, "_");
}

function descargarBlob(blob, nombreArchivo) {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");

  a.href = url;
  a.download = limpiarNombreArchivo(nombreArchivo);
  document.body.appendChild(a);
  a.click();
  a.remove();

  window.URL.revokeObjectURL(url);
}

async function descargarPdfEntrega(id, nombreArchivo) {
  const blob = await http(`/citas/api/entregas/${id}/pdf/`, {
    method: "GET",
    responseType: "blob",
  });

  descargarBlob(blob, nombreArchivo || `encuesta_entrega_${id}.pdf`);
  return blob;
}

export const apiEntrega = {
  list: () => http("/citas/api/entregas/"),
  get: (id) => http(`/citas/api/entregas/${id}/`),

  create: (payload) =>
    http("/citas/api/entregas/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }),

  update: (id, payload) =>
    http(`/citas/api/entregas/${id}/`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }),

  patch: (id, payload) =>
    http(`/citas/api/entregas/${id}/`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }),

  remove: (id) => http(`/citas/api/entregas/${id}/`, { method: "DELETE" }),

  pdf: (id) =>
    http(`/citas/api/entregas/${id}/pdf/`, {
      method: "GET",
      responseType: "blob",
    }),

  downloadPdf: descargarPdfEntrega,
};
