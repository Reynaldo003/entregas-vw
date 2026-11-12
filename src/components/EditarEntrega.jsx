// src/components/EditarEntrega.jsx
import { useState } from "react";
import {
  Building2,
  Calendar,
  Car,
  ClipboardCheck,
  Hash,
  Info,
  Loader2,
  MessageSquare,
  Palette,
  Phone,
  RotateCcw,
  User,
  UserCheck,
  Layers3,
} from "lucide-react";

import { apiEntrega } from "../lib/apiEntrega";

import "./EditarEntrega.css";

const fondoVw = new URL("../assets/fondo-vw.png", import.meta.url).href;
const logoVw = new URL("../assets/vw_white.png", import.meta.url).href;

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

const VERSIONES = [
  "Seleccionar...",
  "Trendline",
  "Comfortline",
  "Highline",
  "Sportline",
  "GLI",
  "GTI",
  "R",
  "Peak Edition",
  "Robust",
  "Extreme",
  "Otro",
];

const COLORES = [
  "Seleccionar...",
  "Blanco Candy",
  "Blanco Puro",
  "Plata Reflex",
  "Plata Pirita",
  "Plata Sirius",
  "Gris Platino",
  "Gris Carbon Steel",
  "Gris Franela",
  "Negro Ninja",
  "Negro Profundo",
  "Azul Rising",
  "Azul Monterrey",
  "Rojo Wild Cherry",
  "Rojo Kings",
  "Amarillo Kurkuma",
  "Verde Vibrante",
  "Otro",
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
    version: "",
    color: "",
    fechaEntrega: "",
    asesorVentas: "",
    comentarios: "",
  };
}

function Campo({ error, hint, children }) {
  return (
    <div className="pe-campo">
      {children}

      {error ? (
        <span className="pe-error">⚠ {error}</span>
      ) : hint ? (
        <span className="pe-hint-text">{hint}</span>
      ) : null}
    </div>
  );
}

function Label({ icon, text, required = false }) {
  return (
    <label className="pe-label">
      <span className="pe-label-icon">{icon}</span>
      {text}
      {required && <span className="pe-req">*</span>}
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

  return `programacion_entrega_${id}_${limpio}.pdf`;
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

    if (!form.version || form.version === "Seleccionar...") {
      nuevosErrores.version = "Selecciona una versión.";
    }

    if (!form.color || form.color === "Seleccionar...") {
      nuevosErrores.color = "Selecciona un color.";
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
    version: form.version,
    color: form.color,

    fecha_hora_entrega: form.fechaEntrega || null,
    entrega_reportada: true,
    asesor_ventas: form.asesorVentas,
    preparada_por: "",
    id_cliente_sf_nadin: "",
    id_cliente_sf_dms: "",
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
        throw new Error(
          "La entrega fue registrada, pero el backend no regresó el ID."
        );
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
    errores.version ||
    errores.color ||
    errores.fechaEntrega ||
    errores.asesorVentas;

  return (
    <div className="pe-page">
      <div
        className="pe-fondo"
        style={{ backgroundImage: `url(${fondoVw})` }}
        aria-hidden="true"
      />
      <div className="pe-velo" aria-hidden="true" />

      <div className="pe-shell">
        <header className="pe-topbar">
          <div className="pe-brand">
            <img src={logoVw} alt="Volkswagen" className="pe-brand-logo" />
            <span className="pe-brand-text">
              Volkswagen <span className="pe-brand-sep">|</span> CRM
            </span>
          </div>
        </header>

        <div className="pe-badge-row">
          <span className="pe-badge">
            <Car size={15} />
            Automotriz R&amp;R
          </span>
        </div>

        <h1 className="pe-title">
          Programación de Entrega
          <span className="pe-title-line" />
        </h1>

        <section className="pe-card">
          {mensajeOk && (
            <div className="pe-alert pe-alert--ok">{mensajeOk}</div>
          )}

          {(primerError || errorGeneral) && (
            <div className="pe-alert pe-alert--err">
              ⚠ {errorGeneral || primerError}
            </div>
          )}

          <div className="pe-grid">
            <Campo error={errores.dealer}>
              <Label icon={<Building2 size={14} />} text="Dealer" required />
              <select
                value={form.dealer}
                disabled={deshabilitado}
                onChange={(e) => setCampo("dealer", e.target.value)}
                className={`pe-control pe-select ${errores.dealer ? "pe-control--error" : ""
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
                placeholder="Nombre completo"
                value={form.nombre}
                disabled={deshabilitado}
                onChange={(e) => setCampo("nombre", e.target.value)}
                className={`pe-control ${errores.nombre ? "pe-control--error" : ""
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
                className={`pe-control ${errores.telefono ? "pe-control--error" : ""
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
                className={`pe-control ${errores.vin ? "pe-control--error" : ""}`}
              />
            </Campo>

            <Campo error={errores.modelo}>
              <Label icon={<Car size={14} />} text="Modelo" required />
              <select
                value={form.modelo}
                disabled={deshabilitado}
                onChange={(e) => setCampo("modelo", e.target.value)}
                className={`pe-control pe-select ${errores.modelo ? "pe-control--error" : ""
                  }`}
              >
                {MODELOS.map((modelo) => (
                  <option key={modelo} value={modelo}>
                    {modelo}
                  </option>
                ))}
              </select>
            </Campo>

            <Campo error={errores.version}>
              <Label icon={<Layers3 size={14} />} text="Versión" required />
              <select
                value={form.version}
                disabled={deshabilitado}
                onChange={(e) => setCampo("version", e.target.value)}
                className={`pe-control pe-select ${errores.version ? "pe-control--error" : ""
                  }`}
              >
                {VERSIONES.map((version) => (
                  <option key={version} value={version}>
                    {version}
                  </option>
                ))}
              </select>
            </Campo>

            <Campo error={errores.color}>
              <Label icon={<Palette size={14} />} text="Color" required />
              <select
                value={form.color}
                disabled={deshabilitado}
                onChange={(e) => setCampo("color", e.target.value)}
                className={`pe-control pe-select ${errores.color ? "pe-control--error" : ""
                  }`}
              >
                {COLORES.map((color) => (
                  <option key={color} value={color}>
                    {color}
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
                className={`pe-control pe-datetime ${errores.fechaEntrega ? "pe-control--error" : ""
                  }`}
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
                className={`pe-control pe-select ${errores.asesorVentas ? "pe-control--error" : ""
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

            <div className="pe-campo pe-campo--full">
              <Label icon={<MessageSquare size={14} />} text="Comentarios" />

              <textarea
                placeholder="Notas internas..."
                rows={4}
                value={form.comentarios}
                disabled={deshabilitado}
                onChange={(e) => setCampo("comentarios", e.target.value)}
                className="pe-control pe-textarea"
              />
            </div>
          </div>

          <footer className="pe-footer">
            <p className="pe-footer-hint">
              <Info size={17} />
              Completa la información y registra la programación de entrega.
            </p>

            <div className="pe-actions">
              <button
                type="button"
                onClick={handleLimpiar}
                disabled={deshabilitado}
                className="pe-btn pe-btn--clean"
              >
                <RotateCcw size={16} />
                Limpiar
              </button>

              <button
                type="button"
                onClick={handleRegistrarYGenerarPdf}
                disabled={deshabilitado}
                className="pe-btn pe-btn--primary"
              >
                {guardando ? (
                  <Loader2 size={16} className="pe-spin" />
                ) : (
                  <ClipboardCheck size={16} />
                )}
                Registrar y generar PDF
              </button>
            </div>
          </footer>
        </section>
      </div>
    </div>
  );
}
