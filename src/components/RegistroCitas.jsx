// src/components/RegistroCitas.jsx
import { useState } from "react";
const fondoRR = new URL('../assets/vw-bg.jpeg', import.meta.url).href;

const DEALERS = ["VW Cordoba", "VW Orizaba", "VW Poza Rica", "VW Tuxtepec", "VW Tuxpan"];

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

const MODELOS = [
  "Seleccionar...", "Virtus", "Polo", "Jetta", "Jetta GLI", "Golf GTI",
  "Taos", "Nivus", "Taigun", "Tiguan", "Teramont", "Crossport",
  "Saveiro", "Amarok", "Seminuevos", "Tera", "Avaluo", "Transporter", "Caddy", "Crafter",
];

const inputBase = "w-full px-3 py-2 text-sm rounded-lg bg-blue-950/60 border text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-blue-400/40 transition";
const inputOk   = "border-white/15";
const inputErr  = "border-red-500 ring-2 ring-red-500/20";

export default function RegistroCitas() {
  const [busqueda,           setBusqueda]           = useState("");
  const [mostrarSugerencias, setMostrarSugerencias] = useState(false);
  const [dealer,             setDealer]             = useState("");
  const [nombre,             setNombre]             = useState("");
  const [telefono,           setTelefono]           = useState("");
  const [modelo,             setModelo]             = useState("");
  const [fechaHora,          setFechaHora]          = useState("");
  const [fuente,             setFuente]             = useState("");
  const [errores,            setErrores]            = useState({});

  const asesoresFiltrados = ASESORES.filter((a) =>
    a.toLowerCase().includes(busqueda.toLowerCase())
  );

  const validar = () => {
    const e = {};
    if (!dealer)                               e.dealer    = "Selecciona el dealer.";
    if (!nombre.trim())                        e.nombre    = "Ingresa el nombre del cliente.";
    if (!telefono || telefono.length < 10)     e.telefono  = "Ingresa un teléfono válido.";
    if (!modelo || modelo === "Seleccionar...") e.modelo   = "Selecciona un modelo.";
    if (!fechaHora)                            e.fechaHora = "Selecciona la fecha y hora.";
    if (!fuente)                               e.fuente    = "Selecciona la fuente.";
    if (!busqueda.trim())                      e.asesor    = "Selecciona un asesor de piso.";
    setErrores(e);
    return Object.keys(e).length === 0;
  };

  const handleGuardar = () => {
    if (validar()) alert("✅ Cita guardada correctamente.");
  };

  const primerError = errores.dealer || errores.nombre || errores.telefono ||
    errores.modelo || errores.fechaHora || errores.fuente || errores.asesor;

  const Campo = ({ error, hint, children }) => (
    <div className="flex flex-col gap-1">
      {children}
      {error
        ? <span className="text-[0.6rem] text-red-400">⚠ {error}</span>
       : hint && <span className="text-[0.6rem] text-white/60">{hint}</span>
      }
    </div>
  );

 const Label = ({ icon, text, required = true }) => (
  <label className="text-[0.7rem] font-bold text-white uppercase tracking-wide flex items-center gap-1 drop-shadow-md">
    <span className="text-lg">{icon}</span> {text} {required && <span className="text-red-400">*</span>}
  </label>
);

  return (
    <div
  className="min-h-screen flex items-center justify-center p-6 relative font-sans"
  style={{
    background: "linear-gradient(135deg, #0a1628 0%, #0d2144 100%)",
  }}
>
      {/* Overlay fondo */}
      <div className="fixed inset-0 bg-gradient-to-br from-[#0a1628]/88 to-[#0d2144]/82 z-0" />

      {/* Card */}
     <div
  className="relative z-10 w-full max-w-6xl backdrop-blur-md rounded-2xl border border-white/8 shadow-2xl overflow-hidden"
  style={{
    backgroundImage: `url(${fondoRR})`,
    backgroundSize: "cover",
    backgroundPosition: "20% 30%",
  }}
>
  {/* Overlay para ver bien los campos */}
  <div className="absolute inset-0 bg-[#0a1630]/40 z-0 pointer-events-none" />

        {/* HEADER */}
        <div className="text-center px-6 pt-5 pb-3">
          <span className="inline-block text-[0.68rem] font-semibold text-white/80 bg-white/10 border border-white/20 px-4 py-1 rounded-full tracking-wider uppercase mb-2">
            Automotriz R&amp;R
          </span>
          <h1 className="text-white text-2xl font-bold tracking-tight">
            Registro de citas
          </h1>
        </div>

        {/* BANNER ERROR */}
        {primerError && (
          <div className="mx-6 mb-1 px-4 py-2 rounded-lg bg-red-900/35 border border-red-500/40 text-red-300 text-xs font-semibold">
            ⚠ {primerError}
          </div>
        )}

        {/* FILA 1 — 5 columnas */}
        <div className="grid grid-cols-5 gap-3 px-6 pt-2 pb-1">

          <Campo error={errores.dealer} hint="Selecciona el dealer.">
            <Label icon="🏢" text="Dealer" />
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
<Label icon="" text="Nombre del Cliente" />
            <input
              type="text"
              placeholder="NOMBRE COMPLETO"
              value={nombre}
              onChange={(e) => { setNombre(e.target.value); setErrores((p) => ({ ...p, nombre: "" })); }}
              className={`${inputBase} ${errores.nombre ? inputErr : inputOk}`}
            />
          </Campo>

          <Campo error={errores.telefono} hint="Captura un teléfono numérico.">
            <Label icon="📞" text="Teléfono" />
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

          <Campo error={errores.modelo} hint="Selecciona el VW de interés.">
            <Label icon="🚗" text="VW de sus Sueños" />
            <select
              value={modelo}
              onChange={(e) => { setModelo(e.target.value); setErrores((p) => ({ ...p, modelo: "" })); }}
              className={`${inputBase} ${errores.modelo ? inputErr : inputOk} bg-blue-900`}
            >
              {MODELOS.map((m, i) => <option key={i}>{m}</option>)}
            </select>
          </Campo>

          <Campo error={errores.fechaHora} hint="Selecciona fecha y hora.">
  <Label icon="🗓️" text="Fecha y Hora" />
  <input
    type="datetime-local"
    value={fechaHora}
    onChange={(e) => { setFechaHora(e.target.value); setErrores((p) => ({ ...p, fechaHora: "" })); }}
    className={`${inputBase} ${errores.fechaHora ? inputErr : inputOk} [color-scheme:dark]`}
  />
</Campo>

        </div>

        {/* FILA 2 — 3 columnas */}
        <div className="grid grid-cols-3 gap-3 px-6 pt-1 pb-4">

          <Campo error={errores.fuente} hint="Selecciona la fuente.">
            <Label icon="📋" text="Fuente" />
            <select
              value={fuente}
              onChange={(e) => { setFuente(e.target.value); setErrores((p) => ({ ...p, fuente: "" })); }}
              className={`${inputBase} ${errores.fuente ? inputErr : inputOk} bg-blue-900`}
            >
              <option value="">Seleccionar...</option>
              <option>Facebook</option>
              <option>WhatsApp</option>
              <option>VW-Concesionarios</option>
              <option>Llamada entrante</option>
              <option>Prospeccion</option>
              <option>Cartera</option>
              <option>Eternizacion de credito</option>
              <option>Remarketing</option>
              <option>Base de Datos</option>
              <option>Ubicacion</option>
            </select>
          </Campo>

          <Campo error={errores.asesor} hint="Selecciona el asesor de piso.">
            <Label icon="🔍" text="Asesor de Piso" />
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar asesor..."
                value={busqueda}
                onFocus={() => setMostrarSugerencias(true)}
                onChange={(e) => {
                  setBusqueda(e.target.value);
                  setMostrarSugerencias(true);
                  setErrores((p) => ({ ...p, asesor: "" }));
                }}
                onBlur={() => setTimeout(() => setMostrarSugerencias(false), 150)}
                className={`${inputBase} ${errores.asesor ? inputErr : inputOk} pl-7`}
              />
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-white/40 text-xs">🔍</span>

              {mostrarSugerencias && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-[#122952] border border-white/12 rounded-lg max-h-44 overflow-y-auto z-30 shadow-xl">
                  {asesoresFiltrados.length > 0 ? (
                    asesoresFiltrados.map((asesor, i) => (
                      <div
                        key={i}
                        className="px-3 py-2 text-xs text-white/80 cursor-pointer border-b border-white/6 hover:bg-blue-500/20 last:border-b-0"
                        onClick={() => {
                          setBusqueda(asesor);
                          setMostrarSugerencias(false);
                          setErrores((p) => ({ ...p, asesor: "" }));
                        }}
                      >
                        {asesor}
                      </div>
                    ))
                  ) : (
                    <div className="px-3 py-2 text-xs text-white/40">No se encontraron asesores</div>
                  )}
                </div>
              )}
            </div>
          </Campo>

          <div className="flex flex-col gap-1">
          <label className="text-[0.7rem] font-bold text-white uppercase tracking-wide flex items-center gap-1 drop-shadow-md">
  <span className="text-lg">📝</span> Comentarios
</label>
            <textarea
              placeholder="Notas adicionales de la cita..."
              rows={3}
              className="w-full px-3 py-2 text-sm rounded-lg bg-blue-950/60 border border-white/15 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-blue-400/40 resize-none transition"
            />
          </div>

        </div>

        {/* FOOTER */}
        <div className="flex justify-between items-center px-6 py-3 bg-black/25 border-t border-white/7">
          <p className={`text-xs ${primerError ? "text-red-400 font-semibold" : "text-white/38"}`}>
            {primerError ? `⚠ ${primerError}` : "Revisa los datos y guarda la cita."}
          </p>
          <button
            onClick={handleGuardar}
            className="flex items-center gap-2 bg-white text-[#0d1f3c] font-bold text-sm px-5 py-2 rounded-full hover:bg-blue-100 transition hover:-translate-y-0.5 hover:shadow-lg"
          >
            ⊙ Guardar cita
          </button>
        </div>

      </div>
    </div>
  );
}