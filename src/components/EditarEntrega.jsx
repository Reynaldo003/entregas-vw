// src/components/EditarEntrega.jsx
import { useState } from "react";
import {
  Building2, User, Phone, Hash, Car, Calendar,
  Truck, UserCheck, Wrench, CreditCard, Archive, MessageSquare, ClipboardCheck
} from "lucide-react";

const fondoRR = new URL('../assets/vw-bg.jpeg', import.meta.url).href;

const DEALERS = ["VW Cordoba", "VW Orizaba", "VW Poza Rica", "VW Tuxtepec", "VW Tuxpan"];

const MODELOS = [
  "Seleccionar...", "Virtus", "Polo", "Jetta", "Jetta GLI", "Golf GTI",
  "Taos", "Nivus", "Taigun", "Tiguan", "Teramont", "Crossport",
  "Saveiro", "Amarok", "Seminuevos", "Tera", "Avaluo", "Transporter", "Caddy", "Crafter",
];

const ASESORES = [
  "AURA MARLIZETH FERNANDEZ LOPEZ", "Bianca Isabel Chavez Alarcon",
  "ERENDIRA SANTOS COYOTZI", "IRENE DEL CARMEN GUIZA LOPEZ",
  "MARCOS RAUL DIAZ RAMOS", "MARIO ALBERTO LOPEZ RAMOS",
  "MARISOL LAGUNES GONZALEZ", "NALLELY HERNANDEZ GARCIA",
  "OCTAVIO BRUNO GONZALEZ", "ROGELIO VAZQUEZ SANCHEZ",
  "RUBEN ALBERTO TOSQUY ADRIANO", "Saja Azzam Mohammad Jamous",
  "SANDRA LUZ PRIETO PEREZ", "YAMIL MISAEL RODRIGUEZ AGUILAR",
  "LUIS ALFONSO CORIA MARROQUIN", "CANDY DENISSE MARQUEZ CORTES",
  "DELMAR JAVIER ILLESCAS DOMINGUEZ", "EDGAR JESUS GOMEZ PEREZ",
];

const inputBase = "w-full px-3 py-2 text-sm rounded-lg bg-blue-950/60 border text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-blue-400/40 transition";
const inputOk = "border-white/15";
const inputErr = "border-red-500 ring-2 ring-red-500/20";

const Campo = ({ error, hint, children }) => (
  <div className="flex flex-col gap-1">
    {children}
    {error
      ? <span className="text-[0.6rem] text-red-400">⚠ {error}</span>
      : hint && <span className="text-[0.6rem] text-white/60">{hint}</span>
    }
  </div>
);

const Label = ({ icon, text, required = false }) => (
  <label className="text-[0.7rem] font-bold text-white uppercase tracking-wide flex items-center gap-1 drop-shadow-md">
    <span className="flex items-center">{icon}</span> {text} {required && <span className="text-red-400">*</span>}
  </label>
);

export default function EditarEntrega({ id = 40, onCancelar }) {
  const [dealer,        setDealer]        = useState("");
  const [nombre,        setNombre]        = useState("");
  const [telefono,      setTelefono]      = useState("");
  const [vin,           setVin]           = useState("");
  const [modelo,        setModelo]        = useState("");
  const [fechaEntrega,  setFechaEntrega]  = useState("");
  const [entregaFisica, setEntregaFisica] = useState("pendiente");
  const [asesorVentas,  setAsesorVentas]  = useState("");
  const [preparadaPor,  setPreparadaPor]  = useState("");
  const [idNadin,       setIdNadin]       = useState("");
  const [idDms,         setIdDms]         = useState("");
  const [comentarios,   setComentarios]   = useState("");
  const [errores,       setErrores]       = useState({});

  const validar = () => {
    const e = {};
    if (!dealer)                                e.dealer       = "Selecciona el dealer.";
    if (!nombre.trim())                         e.nombre       = "Ingresa el nombre del cliente.";
    if (!telefono || telefono.length < 10)      e.telefono     = "Ingresa un teléfono válido.";
    if (!vin.trim())                            e.vin          = "Ingresa el VIN / Chasis.";
    if (!modelo || modelo === "Seleccionar...") e.modelo       = "Selecciona un modelo.";
    if (!fechaEntrega)                          e.fechaEntrega = "Selecciona fecha y hora de entrega.";
    if (!asesorVentas.trim())                   e.asesorVentas = "Ingresa el asesor de ventas.";
    if (!preparadaPor.trim())                   e.preparadaPor = "Ingresa quién prepara la entrega.";
    setErrores(e);
    return Object.keys(e).length === 0;
  };

  const handleGuardar = () => {
    if (validar()) alert("✅ Entrega guardada correctamente.");
  };

  const primerError = errores.dealer || errores.nombre || errores.telefono ||
    errores.vin || errores.modelo || errores.fechaEntrega ||
    errores.asesorVentas || errores.preparadaPor;

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6 relative font-sans"
      style={{ background: "linear-gradient(135deg, #0a1628 0%, #0d2144 100%)" }}
    >
      {/* Card */}
      <div
        className="relative z-10 w-full max-w-6xl backdrop-blur-md rounded-2xl border border-white/8 shadow-2xl overflow-hidden"
        style={{
          backgroundImage: `url(${fondoRR})`,
          backgroundSize: "cover",
          backgroundPosition: "20% 30%",
        }}
      >
        <div className="absolute inset-0 bg-[#0a1630]/40 z-0 pointer-events-none" />

        {/* HEADER */}
        <div className="relative z-10 text-center px-6 pt-5 pb-3">
          <span className="inline-block text-[0.68rem] font-semibold text-white/80 bg-white/10 border border-white/20 px-4 py-1 rounded-full tracking-wider uppercase mb-2">
            Automotriz R&amp;R
          </span>
          <h1 className="text-white text-2xl font-bold tracking-tight">
            Entregas
          </h1>
        </div>

        {/* BANNER ERROR */}
        {primerError && (
          <div className="relative z-10 mx-6 mb-1 px-4 py-2 rounded-lg bg-red-900/35 border border-red-500/40 text-red-300 text-xs font-semibold">
            ⚠ {primerError}
          </div>
        )}

        {/* FILA 1 — Dealer, Nombre, Teléfono */}
        <div className="relative z-10 grid grid-cols-3 gap-3 px-6 pt-2 pb-1">

          <Campo error={errores.dealer} hint="Selecciona el dealer.">
            <Label icon={<Building2 size={14} />} text="Dealer" required />
            <select
              value={dealer}
              onChange={(e) => { setDealer(e.target.value); setErrores((p) => ({ ...p, dealer: "" })); }}
              className={`${inputBase} ${errores.dealer ? inputErr : inputOk} bg-blue-900`}
            >
              <option value="">Seleccionar...</option>
              {DEALERS.map((d, i) => <option key={i}>{d}</option>)}
            </select>
          </Campo>

          <Campo error={errores.nombre} hint="Captura el nombre del cliente.">
            <Label icon={<User size={14} />} text="Nombre del Cliente" required />
            <input
              type="text"
              placeholder="NOMBRE COMPLETO"
              value={nombre}
              onChange={(e) => { setNombre(e.target.value); setErrores((p) => ({ ...p, nombre: "" })); }}
              className={`${inputBase} ${errores.nombre ? inputErr : inputOk}`}
            />
          </Campo>

          <Campo error={errores.telefono} hint="Captura un teléfono numérico.">
            <Label icon={<Phone size={14} />} text="Teléfono" required />
            <input
              type="text"
              placeholder="2711234567"
              maxLength={12}
              value={telefono}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, "").slice(0, 12);
                setTelefono(val);
                setErrores((p) => ({ ...p, telefono: "" }));
              }}
              className={`${inputBase} ${errores.telefono ? inputErr : inputOk}`}
            />
          </Campo>

        </div>

        {/* FILA 2 — VIN, Modelo, Fecha Entrega */}
        <div className="relative z-10 grid grid-cols-3 gap-3 px-6 pt-1 pb-1">

          <Campo error={errores.vin} hint="Ingresa el VIN o número de chasis.">
            <Label icon={<Hash size={14} />} text="VIN / Chasis" required />
            <input
              type="text"
              placeholder="WVW3N4D24ST050404"
              value={vin}
              onChange={(e) => { setVin(e.target.value.toUpperCase()); setErrores((p) => ({ ...p, vin: "" })); }}
              className={`${inputBase} ${errores.vin ? inputErr : inputOk}`}
            />
          </Campo>

          <Campo error={errores.modelo} hint="Selecciona el modelo / versión.">
            <Label icon={<Car size={14} />} text="Modelo / Versión" required />
            <select
              value={modelo}
              onChange={(e) => { setModelo(e.target.value); setErrores((p) => ({ ...p, modelo: "" })); }}
              className={`${inputBase} ${errores.modelo ? inputErr : inputOk} bg-blue-900`}
            >
              {MODELOS.map((m, i) => <option key={i}>{m}</option>)}
            </select>
          </Campo>

          <Campo error={errores.fechaEntrega} hint="Selecciona fecha y hora de entrega.">
            <Label icon={<Calendar size={14} />} text="Fecha y Hora de Entrega" required />
            <input
              type="datetime-local"
              value={fechaEntrega}
              onChange={(e) => { setFechaEntrega(e.target.value); setErrores((p) => ({ ...p, fechaEntrega: "" })); }}
              className={`${inputBase} ${errores.fechaEntrega ? inputErr : inputOk} [color-scheme:dark]`}
            />
          </Campo>

        </div>

        {/* FILA 3 — Entrega Física, Asesor Ventas, Preparada por */}
        <div className="relative z-10 grid grid-cols-3 gap-3 px-6 pt-1 pb-1">

          <div className="flex flex-col gap-1">
            <Label icon={<Truck size={14} />} text="Entrega Física" />
            <div className="flex gap-2">
              <button
                onClick={() => setEntregaFisica("pendiente")}
                className={`flex-1 py-2 rounded-lg text-xs font-bold border transition ${
                  entregaFisica === "pendiente"
                    ? "bg-yellow-500/20 border-yellow-400 text-yellow-300"
                    : "bg-blue-950/60 border-white/15 text-white/50"
                }`}
              >
                ⏳ Pendiente
              </button>
              <button
                onClick={() => setEntregaFisica("completada")}
                className={`flex-1 py-2 rounded-lg text-xs font-bold border transition ${
                  entregaFisica === "completada"
                    ? "bg-green-500/20 border-green-400 text-green-300"
                    : "bg-blue-950/60 border-white/15 text-white/50"
                }`}
              >
                ✅ Completada
              </button>
            </div>
          </div>

          <Campo error={errores.asesorVentas} hint="Selecciona el asesor de ventas.">
            <Label icon={<UserCheck size={14} />} text="Asesor Ventas" required />
            <select
              value={asesorVentas}
              onChange={(e) => { setAsesorVentas(e.target.value); setErrores((p) => ({ ...p, asesorVentas: "" })); }}
              className={`${inputBase} ${errores.asesorVentas ? inputErr : inputOk} bg-blue-900`}
            >
              <option value="">Seleccionar...</option>
              {ASESORES.map((a, i) => <option key={i}>{a}</option>)}
            </select>
          </Campo>

          <Campo error={errores.preparadaPor} hint="Ingresa quién prepara la entrega.">
            <Label icon={<Wrench size={14} />} text="Preparada por" required />
            <input
              type="text"
              placeholder="NOMBRE COMPLETO"
              value={preparadaPor}
              onChange={(e) => { setPreparadaPor(e.target.value); setErrores((p) => ({ ...p, preparadaPor: "" })); }}
              className={`${inputBase} ${errores.preparadaPor ? inputErr : inputOk}`}
            />
          </Campo>

        </div>

        {/* FILA 4 — ID NADIN, ID DMS */}
        <div className="relative z-10 grid grid-cols-2 gap-3 px-6 pt-1 pb-1">

          <Campo hint="ID del cliente en SF-NADIN.">
            <Label icon={<CreditCard size={14} />} text="ID Cliente / SF-NADIN" />
            <input
              type="text"
              placeholder="ID SF-NADIN"
              value={idNadin}
              onChange={(e) => setIdNadin(e.target.value)}
              className={`${inputBase} ${inputOk}`}
            />
          </Campo>

          <Campo hint="ID del cliente en SF-DMS.">
            <Label icon={<Archive size={14} />} text="ID Cliente / SF-DMS" />
            <input
              type="text"
              placeholder="ID SF-DMS"
              value={idDms}
              onChange={(e) => setIdDms(e.target.value)}
              className={`${inputBase} ${inputOk}`}
            />
          </Campo>

        </div>

        {/* FILA 5 — Comentarios */}
        <div className="relative z-10 px-6 pt-1 pb-4">
          <label className="text-[0.7rem] font-bold text-white uppercase tracking-wide flex items-center gap-1 drop-shadow-md mb-1">
            <MessageSquare size={14} /> Comentarios
          </label>
          <textarea
            placeholder="Notas internas..."
            rows={3}
            value={comentarios}
            onChange={(e) => setComentarios(e.target.value)}
            className="w-full px-3 py-2 text-sm rounded-lg bg-blue-950/60 border border-white/15 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-blue-400/40 resize-none transition"
          />
        </div>

        {/* FOOTER */}
        <div className="relative z-10 flex justify-end items-center gap-3 px-6 py-3 bg-black/25 border-t border-white/7">
          <button
            onClick={onCancelar}
            className="flex items-center gap-2 bg-red-500 text-white font-bold text-sm px-5 py-2 rounded-full hover:bg-red-600 transition hover:-translate-y-0.5 hover:shadow-lg"
          >
            ✕ Cancelar
          </button>
          <button
            onClick={handleGuardar}
            className="flex items-center gap-2 bg-white text-[#0d1f3c] font-bold text-sm px-5 py-2 rounded-full hover:bg-blue-100 transition hover:-translate-y-0.5 hover:shadow-lg"
          >
            <ClipboardCheck size={16} /> Guardar cambios
          </button>
        </div>

      </div>
    </div>
  );
}