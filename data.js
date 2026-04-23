// -----------------------------------------------------
// CONSTANTES DE REFERENCIA
// Definimos los valores permitidos en variables separadas.
// Así evitamos escribir mal un estado ("Nuevo" vs "nuevo")
// y es fácil saber qué valores existen en el sistema.
// -----------------------------------------------------

// Estados posibles de un cliente en el proceso de venta
const STATUS = {
  NUEVO:       "Nuevo",       // Cliente recién añadido, sin contacto
  CONTACTADO:  "Contactado",  // Ya hemos hablado con él
  EN_PROCESO:  "En proceso",  // Negociación activa
  CERRADO:     "Cerrado",     // Venta ganada
  PERDIDO:     "Perdido",     // Venta perdida
};

// Prioridades para organizar el trabajo del equipo comercial
const PRIORITY = {
  ALTA:  "Alta",
  MEDIA: "Media",
  BAJA:  "Baja",
};


// -----------------------------------------------------
// ARRAY DE CLIENTES (datos mock)
// Un array de objetos: cada objeto es un cliente.
// -----------------------------------------------------

const clients = [

  // --- Cliente 1 ---
  {
    id:          1,                          // Identificador único (número entero)
    name:        "Carlos Ruiz",              // Nombre del contacto principal
    company:     "Tecno Global S.L.",        // Empresa del cliente
    email:       "carlos.ruiz@tecnoglobal.es",
    status:      STATUS.CERRADO,             // Estado en el pipeline de ventas
    priority:    PRIORITY.ALTA,              // Qué tan urgente es atenderlo
    lastContact: "2025-04-15",              // Fecha del último contacto (formato ISO)
  },

  // --- Cliente 2 ---
  {
    id:          2,
    name:        "Laura Mendoza",
    company:     "Innova Hub",
    email:       "laura.m@innovahub.com",
    status:      STATUS.CONTACTADO,
    priority:    PRIORITY.ALTA,
    lastContact: "2025-04-18",
  },

  // --- Cliente 3 ---
  {
    id:          3,
    name:        "Roberto Sanz",
    company:     "DataSphere Inc.",
    email:       "ops@datasphere.io",
    status:      STATUS.EN_PROCESO,
    priority:    PRIORITY.ALTA,
    lastContact: "2025-04-10",
  },

  // --- Cliente 4 ---
  {
    id:          4,
    name:        "Marta Iglesias",
    company:     "RetailMax",
    email:       "ventas@retailmax.es",
    status:      STATUS.CONTACTADO,
    priority:    PRIORITY.MEDIA,
    lastContact: "2025-03-28",
  },

  // --- Cliente 5 ---
  {
    id:          5,
    name:        "Diego Fernández",
    company:     "AgroLink",
    email:       "info@agrolink.net",
    status:      STATUS.NUEVO,
    priority:    PRIORITY.BAJA,
    lastContact: "2025-02-20",
  },

  // --- Cliente 6 ---
  {
    id:          6,
    name:        "Sofía Vargas",
    company:     "HealthCore",
    email:       "sofia.v@healthcore.es",
    status:      STATUS.NUEVO,
    priority:    PRIORITY.MEDIA,
    lastContact: "2025-04-17",
  },

  // --- Cliente 7 ---
  {
    id:          7,
    name:        "Tomás Herrera",
    company:     "BuildSmart",
    email:       "t.herrera@buildsmart.com",
    status:      STATUS.EN_PROCESO,
    priority:    PRIORITY.ALTA,
    lastContact: "2025-04-12",
  },

  // --- Cliente 8 ---
  {
    id:          8,
    name:        "Elena Morales",
    company:     "FinEdge",
    email:       "elena@finedge.io",
    status:      STATUS.PERDIDO,
    priority:    PRIORITY.BAJA,
    lastContact: "2025-03-05",
  },

  // --- Cliente 9 ---
  {
    id:          9,
    name:        "Pablo Castro",
    company:     "MediaFlow",
    email:       "pablo.c@mediaflow.net",
    status:      STATUS.CONTACTADO,
    priority:    PRIORITY.MEDIA,
    lastContact: "2025-04-14",
  },

  // --- Cliente 10 ---
  {
    id:          10,
    name:        "Isabel Navarro",
    company:     "EduTech Solutions",
    email:       "i.navarro@edutech.es",
    status:      STATUS.CERRADO,
    priority:    PRIORITY.ALTA,
    lastContact: "2025-04-16",
  },

];


// -----------------------------------------------------
// VERIFICACIÓN RÁPIDA (solo para desarrollo)
// -----------------------------------------------------

console.log("✅ Clientes cargados:", clients.length);
console.log("📋 Primer cliente:", clients[0]);
console.log("📋 Todos los clientes:", clients);