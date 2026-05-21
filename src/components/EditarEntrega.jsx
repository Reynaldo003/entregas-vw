// src/components/EditarEntrega.jsx
import { useEffect, useState } from "react";
import {
  Archive,
  Building2,
  Calendar,
  Car,
  ClipboardCheck,
  CreditCard,
  FileText,
  Hash,
  Loader2,
  MessageSquare,
  Phone,
  Truck,
  User,
  UserCheck,
  Wrench,
} from "lucide-react";

import { apiEntrega } from "../lib/apiEntrega";

const fondoRR = new URL("../assets/vw-bg.jpeg", import.meta.url).href;

const DEALERS = [
  "VW Cordoba",
  "VW Orizaba",
  "VW Poza Rica",
  "VW Tuxtepec",
  "VW Tuxpan",
];

const MODELOS = [
  "Seleccionar...",
  "Virtus",
  "Polo",
  "Jetta",
  "Jetta GLI",
  "Golf GTI",
  "Taos",
  "Nivus",
  "Taigun",
  "Tiguan",
  "Teramont",
  "Crossport",
  "Saveiro",
  "Amarok",
  "Seminuevos",
  "Tera",
  "Avaluo",
  "Transporter",
  "Caddy",
  "Crafter",
];

const ASESORES = [
  "AURA MARLIZETH FERNANDEZ LOPEZ",
  "Bianca Isabel Chavez Alarcon",
  "ERENDIRA SANTOS COYOTZI",
  "IRENE DEL CARMEN GUIZA LOPEZ",
  "MARCOS RAUL DIAZ RAMOS",
  "MARIO ALBERTO LOPEZ RAMOS",
  "MARISOL LAGUNES GONZALEZ",
  "NALLELY HERNANDEZ GARCIA",
  "OCTAVIO BRUNO GONZALEZ",
  "ROGELIO VAZQUEZ SANCHEZ",
  "RUBEN ALBERTO TOSQUY ADRIANO",
  "Saja Azzam Mohammad Jamous",
  "SANDRA LUZ PRIETO PEREZ",
  "YAMIL MISAEL RODRIGUEZ AGUILAR",
  "LUIS ALFONSO CORIA MARROQUIN",
  "CANDY DENISSE MARQUEZ CORTES",
  "DELMAR JAVIER ILLESCAS DOMINGUEZ",
  "EDGAR JESUS GOMEZ PEREZ",
];

const estadoInicial = {
  dealer: "",
  nombre: "",
  telefono: "",
  vin: "",
  modelo: "",
  fechaEntrega: "",
  entregaFisica: "pendiente",
  asesorVentas: "",
  preparadaPor: "",
  idNadin: "",
  idDms: "",
  comentarios: "",
};

const inputBase =
  "w-full min-h-[44px] px-3 py-2 text-sm rounded-xl bg-blue-950/70 border text-white placeholder-white/35 focus:outline-none focus:ring-2 focus:ring-blue-300/50 transition";

const inputOk = "border-white/15";
const inputErr = "border-red-500 ring-2 ring-red-500/25";

function Campo({ error, hint, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      {children}

      {error ? (
        <span className="text-[0.68rem] text-red-300 font-semibold">
          ⚠ {error}
        </span>
      ) : hint ? (
        <span className="text-[0.68rem] text-white/65">{hint}</span>
      ) : null}
    </div>
  );
}

function Label({ icon, text, required = false }) {
  return (
    <label className="text-[0.7rem] sm:text-xs font-bold text-white uppercase tracking-wide flex items-center gap-1.5 drop-shadow-md">
      <span className="flex items-center">{icon}</span>
      {text}
      {required && <span className="text-red-300">*</span>}
    </label>
  );
}

function fechaParaInput(valor) {
  if (!valor) return "";

  const texto = String(valor);

  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(texto)) {
    return texto.slice(0, 16);
  }

  const fecha = new Date(valor);
  if (Number.isNaN(fecha.getTime())) return "";

  const pad = (n) => String(n).padStart(2, "0");

  return `${fecha.getFullYear()}-${pad(fecha.getMonth() + 1)}-${pad(
    fecha.getDate()
  )}T${pad(fecha.getHours())}:${pad(fecha.getMinutes())}`;
}

function telefonoParaInput(valor) {
  const digits = String(valor || "").replace(/\D/g, "");

  if (digits.length === 12 && digits.startsWith("52")) {
    return digits.slice(2);
  }

  return digits.slice(0, 12);
}

function mapearEntregaApi(data) {
  return {
    dealer: data?.agencia || "",
    nombre: data?.cliente?.nombre || "",
    telefono: telefonoParaInput(data?.cliente?.telefono || ""),
    vin: data?.vin || "",
    modelo: data?.modelo_version || "",
    fechaEntrega: fechaParaInput(data?.fecha_hora_entrega),
    entregaFisica: data?.entrega_reportada ? "completada" : "pendiente",
    asesorVentas: data?.asesor_ventas || "",
    preparadaPor: data?.preparada_por || "",
    idNadin: data?.id_cliente_sf_nadin || "",
    idDms: data?.id_cliente_sf_dms || "",
    comentarios: data?.comentarios || "",
  };
}

function nombrePdfSeguro(form, id) {
  const cliente = form.nombre || "cliente";
  const limpio = cliente
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[\\/:*?"<>|]+/g, "_")
    .replace(/\s+/g, "_")
    .toLowerCase();

  return `encuesta_entrega_${id}_${limpio}.pdf`;
}

export default function EditarEntrega({ id = null, onCancelar, onGuardado }) {
  const [form, setForm] = useState(estadoInicial);
  const [registroId, setRegistroId] = useState(id);
  const [errores, setErrores] = useState({});
  const [cargando, setCargando] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [generandoPdf, setGenerandoPdf] = useState(false);
  const [errorGeneral, setErrorGeneral] = useState("");

  useEffect(() => {
    let activo = true;

    async function cargarEntrega() {
      if (!id) {
        setRegistroId(null);
        setForm(estadoInicial);
        setErrores({});
        setErrorGeneral("");
        return;
      }

      try {
        setCargando(true);
        setErrorGeneral("");

        const data = await apiEntrega.get(id);

        if (!activo) return;

        setRegistroId(data.id);
        setForm(mapearEntregaApi(data));
      } catch (error) {
        if (!activo) return;
        setErrorGeneral(error.message || "No se pudo cargar la entrega.");
      } finally {
        if (activo) setCargando(false);
      }
    }

    cargarEntrega();

    return () => {
      activo = false;
    };
  }, [id]);

  const setCampo = (campo, valor) => {
    setForm((prev) => ({
      ...prev,
      [campo]: valor,
    }));

    setErrores((prev) => ({
      ...prev,
      [campo]: "",
    }));

    setErrorGeneral("");
  };

  const validar = () => {
    const e = {};

    if (!form.dealer) e.dealer = "Selecciona el dealer.";
    if (!form.nombre.trim()) e.nombre = "Ingresa el nombre del cliente.";
    if (!form.telefono || form.telefono.length < 10) {
      e.telefono = "Ingresa un teléfono válido.";
    }
    if (!form.vin.trim()) e.vin = "Ingresa el VIN / Chasis.";
    if (!form.modelo || form.modelo === "Seleccionar...") {
      e.modelo = "Selecciona un modelo.";
    }
    if (!form.fechaEntrega) {
      e.fechaEntrega = "Selecciona fecha y hora de entrega.";
    }
    if (!form.asesorVentas.trim()) {
      e.asesorVentas = "Selecciona el asesor de ventas.";
    }
    if (!form.preparadaPor.trim()) {
      e.preparadaPor = "Ingresa quién prepara la entrega.";
    }

    setErrores(e);
    return Object.keys(e).length === 0;
  };

  const crearPayload = () => ({
    agencia: form.dealer,
    nombre: form.nombre.trim(),
    telefono: form.telefono.trim(),
    correo: "",
    vin: form.vin.trim().toUpperCase(),
    modelo_version: form.modelo,
    fecha_hora_entrega: form.fechaEntrega || null,
    entrega_reportada: form.entregaFisica === "completada",
    asesor_ventas: form.asesorVentas,
    preparada_por: form.preparadaPor.trim(),
    id_cliente_sf_nadin: form.idNadin.trim(),
    id_cliente_sf_dms: form.idDms.trim(),
    comentarios: form.comentarios.trim(),
  });

  const guardarEntrega = async ({ mostrarAlerta = true } = {}) => {
    if (!validar()) return null;

    try {
      setGuardando(true);
      setErrorGeneral("");

      const payload = crearPayload();

      const guardado = registroId
        ? await apiEntrega.patch(registroId, payload)
        : await apiEntrega.create(payload);

      setRegistroId(guardado.id);
      setForm(mapearEntregaApi(guardado));

      if (typeof onGuardado === "function") {
        onGuardado(guardado);
      }

      if (mostrarAlerta) {
        alert("✅ Entrega guardada correctamente.");
      }

      return guardado;
    } catch (error) {
      setErrorGeneral(error.message || "No se pudo guardar la entrega.");
      return null;
    } finally {
      setGuardando(false);
    }
  };

  const handleGuardar = async () => {
    await guardarEntrega();
  };

  const handleGenerarPdf = async () => {
    try {
      setGenerandoPdf(true);
      setErrorGeneral("");

      const guardado = await guardarEntrega({ mostrarAlerta: false });

      if (!guardado?.id) return;

      await apiEntrega.downloadPdf(
        guardado.id,
        nombrePdfSeguro(form, guardado.id)
      );
    } catch (error) {
      setErrorGeneral(error.message || "No se pudo generar el PDF.");
    } finally {
      setGenerandoPdf(false);
    }
  };

  const primerError =
    errores.dealer ||
    errores.nombre ||
    errores.telefono ||
    errores.vin ||
    errores.modelo ||
    errores.fechaEntrega ||
    errores.asesorVentas ||
    errores.preparadaPor;

  const deshabilitado = cargando || guardando || generandoPdf;

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center p-3 sm:p-5 lg:p-8 relative font-sans"
      style={{
        background: "linear-gradient(135deg, #0a1628 0%, #0d2144 100%)",
      }}
    >
      <div
        className="relative z-10 w-full max-w-6xl backdrop-blur-md rounded-2xl sm:rounded-3xl border border-white/10 shadow-2xl overflow-hidden"
        style={{
          backgroundImage: `url(${fondoRR})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-[#071126]/75 sm:bg-[#071126]/62 z-0 pointer-events-none" />

        <div className="relative z-10 text-center px-4 sm:px-6 pt-5 sm:pt-7 pb-4">
          <span className="inline-block text-[0.68rem] font-semibold text-white/85 bg-white/10 border border-white/20 px-4 py-1 rounded-full tracking-wider uppercase mb-3">
            Automotriz R&amp;R
          </span>

          <h1 className="text-white text-2xl sm:text-3xl font-bold tracking-tight">
            Encuesta de entrega
          </h1>

          <p className="text-white/70 text-xs sm:text-sm mt-1">
            {registroId ? `Registro #${registroId}` : "Nuevo registro"}
          </p>
        </div>

        {cargando && (
          <div className="relative z-10 mx-4 sm:mx-6 mb-3 px-4 py-3 rounded-xl bg-white/10 border border-white/15 text-white text-sm font-semibold flex items-center gap-2">
            <Loader2 size={16} className="animate-spin" />
            Cargando información...
          </div>
        )}

        {(primerError || errorGeneral) && (
          <div className="relative z-10 mx-4 sm:mx-6 mb-3 px-4 py-3 rounded-xl bg-red-900/40 border border-red-400/40 text-red-100 text-xs sm:text-sm font-semibold">
            ⚠ {errorGeneral || primerError}
          </div>
        )}

        <div className="relative z-10 px-4 sm:px-6 pb-5">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            <Campo error={errores.dealer} hint="Selecciona el dealer.">
              <Label icon={<Building2 size={14} />} text="Dealer" required />
              <select
                value={form.dealer}
                disabled={deshabilitado}
                onChange={(e) => setCampo("dealer", e.target.value)}
                className={`${inputBase} ${errores.dealer ? inputErr : inputOk
                  }`}
              >
                <option value="">Seleccionar...</option>
                {DEALERS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </Campo>

            <Campo error={errores.nombre} hint="Captura el nombre del cliente.">
              <Label
                icon={<User size={14} />}
                text="Nombre del cliente"
                required
              />
              <input
                type="text"
                placeholder="NOMBRE COMPLETO"
                value={form.nombre}
                disabled={deshabilitado}
                onChange={(e) => setCampo("nombre", e.target.value)}
                className={`${inputBase} ${errores.nombre ? inputErr : inputOk
                  }`}
              />
            </Campo>

            <Campo error={errores.telefono} hint="Captura un teléfono numérico.">
              <Label icon={<Phone size={14} />} text="Teléfono" required />
              <input
                type="text"
                inputMode="numeric"
                placeholder="2711234567"
                maxLength={12}
                value={form.telefono}
                disabled={deshabilitado}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "").slice(0, 12);
                  setCampo("telefono", val);
                }}
                className={`${inputBase} ${errores.telefono ? inputErr : inputOk
                  }`}
              />
            </Campo>

            <Campo error={errores.vin} hint="Ingresa el VIN o número de chasis.">
              <Label icon={<Hash size={14} />} text="VIN / Chasis" required />
              <input
                type="text"
                placeholder="WVW3N4D24ST050404"
                value={form.vin}
                disabled={deshabilitado}
                onChange={(e) => setCampo("vin", e.target.value.toUpperCase())}
                className={`${inputBase} ${errores.vin ? inputErr : inputOk}`}
              />
            </Campo>

            <Campo error={errores.modelo} hint="Selecciona el modelo / versión.">
              <Label icon={<Car size={14} />} text="Modelo / versión" required />
              <select
                value={form.modelo}
                disabled={deshabilitado}
                onChange={(e) => setCampo("modelo", e.target.value)}
                className={`${inputBase} ${errores.modelo ? inputErr : inputOk
                  }`}
              >
                {MODELOS.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </Campo>

            <Campo
              error={errores.fechaEntrega}
              hint="Selecciona fecha y hora de entrega."
            >
              <Label
                icon={<Calendar size={14} />}
                text="Fecha y hora de entrega"
                required
              />
              <input
                type="datetime-local"
                value={form.fechaEntrega}
                disabled={deshabilitado}
                onChange={(e) => setCampo("fechaEntrega", e.target.value)}
                className={`${inputBase} ${errores.fechaEntrega ? inputErr : inputOk
                  } [color-scheme:dark]`}
              />
            </Campo>

            <div className="flex flex-col gap-1.5">
              <Label icon={<Truck size={14} />} text="Entrega física" />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  type="button"
                  disabled={deshabilitado}
                  onClick={() => setCampo("entregaFisica", "pendiente")}
                  className={`min-h-[44px] rounded-xl text-xs font-bold border transition ${form.entregaFisica === "pendiente"
                      ? "bg-yellow-500/20 border-yellow-300 text-yellow-200"
                      : "bg-blue-950/70 border-white/15 text-white/55 hover:text-white"
                    } disabled:opacity-60`}
                >
                  ⏳ Pendiente
                </button>

                <button
                  type="button"
                  disabled={deshabilitado}
                  onClick={() => setCampo("entregaFisica", "completada")}
                  className={`min-h-[44px] rounded-xl text-xs font-bold border transition ${form.entregaFisica === "completada"
                      ? "bg-green-500/20 border-green-300 text-green-200"
                      : "bg-blue-950/70 border-white/15 text-white/55 hover:text-white"
                    } disabled:opacity-60`}
                >
                  ✅ Completada
                </button>
              </div>
            </div>

            <Campo
              error={errores.asesorVentas}
              hint="Selecciona el asesor de ventas."
            >
              <Label
                icon={<UserCheck size={14} />}
                text="Asesor ventas"
                required
              />
              <select
                value={form.asesorVentas}
                disabled={deshabilitado}
                onChange={(e) => setCampo("asesorVentas", e.target.value)}
                className={`${inputBase} ${errores.asesorVentas ? inputErr : inputOk
                  }`}
              >
                <option value="">Seleccionar...</option>
                {ASESORES.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
            </Campo>

            <Campo
              error={errores.preparadaPor}
              hint="Ingresa quién prepara la entrega."
            >
              <Label icon={<Wrench size={14} />} text="Preparada por" required />
              <input
                type="text"
                placeholder="NOMBRE COMPLETO"
                value={form.preparadaPor}
                disabled={deshabilitado}
                onChange={(e) => setCampo("preparadaPor", e.target.value)}
                className={`${inputBase} ${errores.preparadaPor ? inputErr : inputOk
                  }`}
              />
            </Campo>

            <Campo hint="ID del cliente en SF-NADIN.">
              <Label
                icon={<CreditCard size={14} />}
                text="ID Cliente / SF-NADIN"
              />
              <input
                type="text"
                placeholder="ID SF-NADIN"
                value={form.idNadin}
                disabled={deshabilitado}
                onChange={(e) => setCampo("idNadin", e.target.value)}
                className={`${inputBase} ${inputOk}`}
              />
            </Campo>

            <Campo hint="ID del cliente en SF-DMS.">
              <Label icon={<Archive size={14} />} text="ID Cliente / SF-DMS" />
              <input
                type="text"
                placeholder="ID SF-DMS"
                value={form.idDms}
                disabled={deshabilitado}
                onChange={(e) => setCampo("idDms", e.target.value)}
                className={`${inputBase} ${inputOk}`}
              />
            </Campo>
          </div>

          <div className="mt-4">
            <label className="text-[0.7rem] sm:text-xs font-bold text-white uppercase tracking-wide flex items-center gap-1.5 drop-shadow-md mb-1.5">
              <MessageSquare size={14} />
              Comentarios
            </label>

            <textarea
              placeholder="Notas internas..."
              rows={4}
              value={form.comentarios}
              disabled={deshabilitado}
              onChange={(e) => setCampo("comentarios", e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-xl bg-blue-950/70 border border-white/15 text-white placeholder-white/35 focus:outline-none focus:ring-2 focus:ring-blue-300/50 resize-none transition disabled:opacity-60"
            />
          </div>
        </div>

        <div className="relative z-10 flex flex-col sm:flex-row sm:justify-end items-stretch sm:items-center gap-3 px-4 sm:px-6 py-4 bg-black/30 border-t border-white/10">
          <button
            type="button"
            onClick={onCancelar}
            disabled={deshabilitado}
            className="w-full sm:w-auto flex justify-center items-center gap-2 bg-red-500 text-white font-bold text-sm px-5 py-3 sm:py-2 rounded-full hover:bg-red-600 transition hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-60 disabled:hover:translate-y-0"
          >
            ✕ Cancelar
          </button>

          <button
            type="button"
            onClick={handleGenerarPdf}
            disabled={deshabilitado}
            className="w-full sm:w-auto flex justify-center items-center gap-2 bg-[#131E5C] text-white border border-white/20 font-bold text-sm px-5 py-3 sm:py-2 rounded-full hover:bg-[#1b2b82] transition hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-60 disabled:hover:translate-y-0"
          >
            {generandoPdf ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <FileText size={16} />
            )}
            Generar PDF
          </button>

          <button
            type="button"
            onClick={handleGuardar}
            disabled={deshabilitado}
            className="w-full sm:w-auto flex justify-center items-center gap-2 bg-white text-[#0d1f3c] font-bold text-sm px-5 py-3 sm:py-2 rounded-full hover:bg-blue-100 transition hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-60 disabled:hover:translate-y-0"
          >
            {guardando ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <ClipboardCheck size={16} />
            )}
            Guardar cambios
          </button>
        </div>
      </div>
    </div>
  );
}