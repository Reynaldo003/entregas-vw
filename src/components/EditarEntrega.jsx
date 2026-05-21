// src/components/EditarEntrega.jsx
import { useState } from "react";
import {
  Archive,
  Building2,
  Calendar,
  Car,
  ClipboardCheck,
  CreditCard,
  Hash,
  Loader2,
  MessageSquare,
  Phone,
  RotateCcw,
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

function crearEstadoInicial() {
  return {
    dealer: "",
    nombre: "",
    telefono: "",
    vin: "",
    modelo: "",
    fechaEntrega: "",
    asesorVentas: "",
    comentarios: "",
  };
}

const inputBase =
  "w-full min-h-[44px] px-3 py-2 text-sm rounded-xl bg-blue-950/70 border text-white placeholder-white/35 focus:outline-none focus:ring-2 focus:ring-blue-300/50 transition disabled:opacity-60";

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

export default function EditarEntrega({ onGuardado }) {
  const [form, setForm] = useState(crearEstadoInicial());
  const [errores, setErrores] = useState({});
  const [guardando, setGuardando] = useState(false);
  const [errorGeneral, setErrorGeneral] = useState("");
  const [mensajeOk, setMensajeOk] = useState("");

  const deshabilitado = guardando;

  const limpiarFormulario = () => {
    setForm(crearEstadoInicial());
    setErrores({});
    setErrorGeneral("");
  };

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
    setMensajeOk("");
  };

  const validar = () => {
    const nuevosErrores = {};

    if (!form.dealer) {
      nuevosErrores.dealer = "Selecciona el dealer.";
    }

    if (!form.nombre.trim()) {
      nuevosErrores.nombre = "Ingresa el nombre del cliente.";
    }

    if (!form.telefono || form.telefono.length < 10) {
      nuevosErrores.telefono = "Ingresa un teléfono válido.";
    }

    if (!form.vin.trim()) {
      nuevosErrores.vin = "Ingresa el VIN / Chasis.";
    }

    if (!form.modelo || form.modelo === "Seleccionar...") {
      nuevosErrores.modelo = "Selecciona un modelo.";
    }

    if (!form.fechaEntrega) {
      nuevosErrores.fechaEntrega = "Selecciona fecha y hora de entrega.";
    }

    if (!form.asesorVentas.trim()) {
      nuevosErrores.asesorVentas = "Selecciona el asesor de ventas.";
    }

    setErrores(nuevosErrores);

    return Object.keys(nuevosErrores).length === 0;
  };

  const crearPayload = () => ({
    agencia: form.dealer,
    nombre: form.nombre.trim(),
    telefono: form.telefono.trim(),
    correo: "",
    vin: form.vin.trim().toUpperCase(),
    modelo_version: form.modelo,
    fecha_hora_entrega: form.fechaEntrega || null,
    asesor_ventas: form.asesorVentas,
    comentarios: form.comentarios.trim(),
  });

  const handleRegistrarYGenerarPdf = async () => {
    if (!validar()) return;

    const formAntesDeLimpiar = { ...form };

    try {
      setGuardando(true);
      setErrorGeneral("");
      setMensajeOk("");

      const payload = crearPayload();
      const guardado = await apiEntrega.create(payload);

      if (!guardado?.id) {
        throw new Error("La entrega fue registrada, pero el backend no regresó el ID.");
      }

      await apiEntrega.downloadPdf(
        guardado.id,
        nombrePdfSeguro(formAntesDeLimpiar, guardado.id)
      );

      limpiarFormulario();
      setMensajeOk("✅ Entrega registrada y PDF generado correctamente.");

      if (typeof onGuardado === "function") {
        onGuardado(guardado);
      }
    } catch (error) {
      setErrorGeneral(
        error.message || "No se pudo registrar la entrega o generar el PDF."
      );
    } finally {
      setGuardando(false);
    }
  };

  const handleLimpiar = () => {
    limpiarFormulario();
    setMensajeOk("");
  };

  const primerError =
    errores.dealer ||
    errores.nombre ||
    errores.telefono ||
    errores.vin ||
    errores.modelo ||
    errores.fechaEntrega ||
    errores.asesorVentas;

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
            Registro de entrega y generación automática de PDF
          </p>
        </div>

        {mensajeOk && (
          <div className="relative z-10 mx-4 sm:mx-6 mb-3 px-4 py-3 rounded-xl bg-green-900/40 border border-green-400/40 text-green-100 text-xs sm:text-sm font-semibold">
            {mensajeOk}
          </div>
        )}

        {(primerError || errorGeneral) && (
          <div className="relative z-10 mx-4 sm:mx-6 mb-3 px-4 py-3 rounded-xl bg-red-900/40 border border-red-400/40 text-red-100 text-xs sm:text-sm font-semibold">
            ⚠ {errorGeneral || primerError}
          </div>
        )}

        <div className="relative z-10 px-4 sm:px-6 pb-5">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            <Campo error={errores.dealer}>
              <Label icon={<Building2 size={14} />} text="Dealer" required />

              <select
                value={form.dealer}
                disabled={deshabilitado}
                onChange={(e) => setCampo("dealer", e.target.value)}
                className={`${inputBase} ${errores.dealer ? inputErr : inputOk
                  }`}
              >
                <option value="">Seleccionar...</option>

                {DEALERS.map((dealer) => (
                  <option key={dealer} value={dealer}>
                    {dealer}
                  </option>
                ))}
              </select>
            </Campo>

            <Campo error={errores.nombre}>
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

            <Campo error={errores.telefono}>
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

            <Campo error={errores.vin}>
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

            <Campo error={errores.modelo}>
              <Label icon={<Car size={14} />} text="Modelo / versión" required />

              <select
                value={form.modelo}
                disabled={deshabilitado}
                onChange={(e) => setCampo("modelo", e.target.value)}
                className={`${inputBase} ${errores.modelo ? inputErr : inputOk
                  }`}
              >
                {MODELOS.map((modelo) => (
                  <option key={modelo} value={modelo}>
                    {modelo}
                  </option>
                ))}
              </select>
            </Campo>

            <Campo error={errores.fechaEntrega}>
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

            <Campo error={errores.asesorVentas}>
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

                {ASESORES.map((asesor) => (
                  <option key={asesor} value={asesor}>
                    {asesor}
                  </option>
                ))}
              </select>
            </Campo>

            <div className="md:col-span-2 xl:col-span-2">
              <label className="text-[0.7rem] sm:text-xs font-bold text-white uppercase tracking-wide flex items-center gap-1.5 drop-shadow-md mb-1.5">
                <MessageSquare size={14} />
                Comentarios
              </label>

              <textarea
                placeholder="Notas internas..."
                rows={1}
                value={form.comentarios}
                disabled={deshabilitado}
                onChange={(e) => setCampo("comentarios", e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl bg-blue-950/70 border border-white/15 text-white placeholder-white/35 focus:outline-none focus:ring-2 focus:ring-blue-300/50 resize-none transition disabled:opacity-60"
              />
            </div>
          </div>
        </div>


        <div className="relative z-10 flex flex-col sm:flex-row sm:justify-end items-stretch sm:items-center gap-3 px-4 sm:px-6 py-4 bg-black/30 border-t border-white/10">
          <button
            type="button"
            onClick={handleLimpiar}
            disabled={deshabilitado}
            className="w-full sm:w-auto flex justify-center items-center gap-2 bg-red-500 text-white font-bold text-sm px-5 py-3 sm:py-2 rounded-full hover:bg-red-600 transition hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-60 disabled:hover:translate-y-0"
          >
            <RotateCcw size={16} />
            Limpiar
          </button>

          <button
            type="button"
            onClick={handleRegistrarYGenerarPdf}
            disabled={deshabilitado}
            className="w-full sm:w-auto flex justify-center items-center gap-2 bg-white text-[#0d1f3c] font-bold text-sm px-5 py-3 sm:py-2 rounded-full hover:bg-blue-100 transition hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-60 disabled:hover:translate-y-0"
          >
            {guardando ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <ClipboardCheck size={16} />
            )}
            Registrar y generar PDF
          </button>
        </div>
      </div>
    </div>
  );
}