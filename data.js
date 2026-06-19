// =====================================================
// data.js — Mock data for Mini CRM
// Loaded before app.js
// =====================================================


// =====================================================
// Reference values
// =====================================================

const STATUS = {
  NUEVO:       "Nuevo",       
  CONTACTADO:  "Contactado",  
  EN_PROCESO:  "En proceso",  
  CERRADO:     "Cerrado",     
  PERDIDO:     "Perdido",     
};

const PRIORITY = {
  ALTA:  "Alta",
  MEDIA: "Media",
  BAJA:  "Baja",
};


// =====================================================
// Mock clients
// =====================================================

const clients = [
  {
    id:          1,                          
    name:        "Carlos Ruiz",              
    company:     "Tecno Global S.L.",        
    email:       "carlos.ruiz@tecnoglobal.es",
    status:      STATUS.CERRADO,             
    priority:    PRIORITY.ALTA,              
    lastContact: "2025-04-15",           
  },

  {
    id:          2,
    name:        "Laura Mendoza",
    company:     "Innova Hub",
    email:       "laura.m@innovahub.com",
    status:      STATUS.CONTACTADO,
    priority:    PRIORITY.ALTA,
    lastContact: "2025-04-18",
  },

  {
    id:          3,
    name:        "Roberto Sanz",
    company:     "DataSphere Inc.",
    email:       "ops@datasphere.io",
    status:      STATUS.EN_PROCESO,
    priority:    PRIORITY.ALTA,
    lastContact: "2025-04-10",
  },

  {
    id:          4,
    name:        "Marta Iglesias",
    company:     "RetailMax",
    email:       "ventas@retailmax.es",
    status:      STATUS.CONTACTADO,
    priority:    PRIORITY.MEDIA,
    lastContact: "2025-03-28",
  },

  {
    id:          5,
    name:        "Diego Fernández",
    company:     "AgroLink",
    email:       "info@agrolink.net",
    status:      STATUS.NUEVO,
    priority:    PRIORITY.BAJA,
    lastContact: "2025-02-20",
  },

  {
    id:          6,
    name:        "Sofía Vargas",
    company:     "HealthCore",
    email:       "sofia.v@healthcore.es",
    status:      STATUS.NUEVO,
    priority:    PRIORITY.MEDIA,
    lastContact: "2025-04-17",
  },

  {
    id:          7,
    name:        "Tomás Herrera",
    company:     "BuildSmart",
    email:       "t.herrera@buildsmart.com",
    status:      STATUS.EN_PROCESO,
    priority:    PRIORITY.ALTA,
    lastContact: "2025-04-12",
  },

  {
    id:          8,
    name:        "Elena Morales",
    company:     "FinEdge",
    email:       "elena@finedge.io",
    status:      STATUS.PERDIDO,
    priority:    PRIORITY.BAJA,
    lastContact: "2025-03-05",
  },

  {
    id:          9,
    name:        "Pablo Castro",
    company:     "MediaFlow",
    email:       "pablo.c@mediaflow.net",
    status:      STATUS.CONTACTADO,
    priority:    PRIORITY.MEDIA,
    lastContact: "2025-04-14",
  },

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
