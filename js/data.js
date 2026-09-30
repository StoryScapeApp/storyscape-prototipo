/* Todos los contenidos y resultados de esta demostración son simulados.
   finalizedAt es un registro técnico de cierre: no interviene en los resultados. */
const book = { id: "BOOK-001", title: "Libro piloto StoryScape" };

const sections = [
  { id: "SEC-01", title: "La semilla viajera" },
  { id: "SEC-02", title: "El faro de las ballenas" },
  { id: "SEC-03", title: "La biblioteca escondida" },
  { id: "SEC-04", title: "Los pájaros de papel" }
];

const students = [
  { id: "EST-001", name: "Lucía Benites", grade: "4.º B", initials: "LB", color: "violet" },
  { id: "EST-002", name: "Mateo Ramos", grade: "4.º A", initials: "MR", color: "blue" },
  { id: "EST-003", name: "Valentina Cruz", grade: "4.º B", initials: "VC", color: "pink" },
  { id: "EST-004", name: "Santiago Flores", grade: "4.º A", initials: "SF", color: "mint" },
  { id: "EST-005", name: "Camila Torres", grade: "4.º B", initials: "CT", color: "amber" },
  { id: "EST-006", name: "Diego Salazar", grade: "4.º A", initials: "DS", color: "blue" },
  { id: "EST-007", name: "Isabella Vega", grade: "4.º B", initials: "IV", color: "pink" },
  { id: "EST-008", name: "Nicolás Paredes", grade: "4.º A", initials: "NP", color: "mint" }
];

/* El texto de cada pregunta pertenece a una sección del único libro piloto. */
const questions = {
  "SEC-01": [
    { type: "Literal", prompt: "¿Qué llevó la semilla durante su viaje?", answer: "La llevó el viento hasta otro lugar.", result: "Correcta", usedHint: false, feedback: "Reconoció el hecho presentado en la sección." },
    { type: "Inferencial", prompt: "¿Por qué la semilla pudo crecer en ese lugar?", answer: "Porque encontró tierra y agua para crecer.", result: "Adecuada", usedHint: true, feedback: "Relacionó las condiciones del entorno con el crecimiento de la semilla." }
  ],
  "SEC-02": [
    { type: "Literal", prompt: "¿Qué encontró el personaje junto al faro?", answer: "Encontró una botella con un mensaje.", result: "Correcta", usedHint: false, feedback: "Identificó el objeto mencionado en la escena." },
    { type: "Inferencial", prompt: "¿Por qué crees que el personaje decidió guardar el mensaje?", answer: "Porque pensó que podía ser importante para alguien.", result: "Adecuada", usedHint: true, feedback: "Explicó una intención posible a partir de lo ocurrido." }
  ],
  "SEC-03": [
    { type: "Literal", prompt: "¿Dónde estaba la entrada de la biblioteca?", answer: "Detrás de una puerta pequeña.", result: "Correcta", usedHint: false, feedback: "Ubicó un detalle explícito de la sección." },
    { type: "Inferencial", prompt: "¿Por qué el personaje quiso compartir lo que descubrió?", answer: "Porque los demás también podían aprender de los libros.", result: "Adecuada", usedHint: false, feedback: "Relacionó el descubrimiento con el deseo de compartirlo." }
  ],
  "SEC-04": [
    { type: "Literal", prompt: "¿Qué hizo el personaje con las hojas de papel?", answer: "Construyó pájaros de papel.", result: "Correcta", usedHint: false, feedback: "Recordó la acción principal de la escena." },
    { type: "Inferencial", prompt: "¿Qué podrían representar los pájaros para el personaje?", answer: "La esperanza de enviar sus ideas lejos.", result: "Adecuada", usedHint: true, feedback: "Propuso una interpretación coherente con la historia." }
  ]
};

/* Orden de creación libre; app.js ordena por finalizedAt solo para el historial. */
const sessions = [
  { id: "SES-001", studentId: "EST-001", bookId: "BOOK-001", sectionId: "SEC-01", status: "FINALIZADA", finalizedAt: "2026-09-05T09:10:00", literalScore: 78, inferentialScore: 68, globalScore: 73 },
  { id: "SES-002", studentId: "EST-001", bookId: "BOOK-001", sectionId: "SEC-03", status: "FINALIZADA", finalizedAt: "2026-09-11T10:15:00", literalScore: 82, inferentialScore: 76, globalScore: 79 },
  { id: "SES-003", studentId: "EST-001", bookId: "BOOK-001", sectionId: "SEC-04", status: "FINALIZADA", finalizedAt: "2026-09-17T11:05:00", literalScore: 88, inferentialScore: 80, globalScore: 84 },
  { id: "SES-004", studentId: "EST-001", bookId: "BOOK-001", sectionId: "SEC-01", status: "FINALIZADA", finalizedAt: "2026-09-24T10:40:00", literalScore: 90, inferentialScore: 84, globalScore: 87 },
  { id: "SES-005", studentId: "EST-001", bookId: "BOOK-001", sectionId: "SEC-02", status: "FINALIZADA", finalizedAt: "2026-09-30T11:20:00", literalScore: 80, inferentialScore: 75, globalScore: 78 },
  { id: "SES-006", studentId: "EST-002", bookId: "BOOK-001", sectionId: "SEC-01", status: "FINALIZADA", finalizedAt: "2026-09-08T09:35:00", literalScore: 70, inferentialScore: 64, globalScore: 67 },
  { id: "SES-007", studentId: "EST-002", bookId: "BOOK-001", sectionId: "SEC-04", status: "FINALIZADA", finalizedAt: "2026-09-18T12:15:00", literalScore: 74, inferentialScore: 70, globalScore: 72 },
  { id: "SES-008", studentId: "EST-002", bookId: "BOOK-001", sectionId: "SEC-03", status: "FINALIZADA", finalizedAt: "2026-09-29T10:10:00", literalScore: 80, inferentialScore: 72, globalScore: 76 },
  { id: "SES-009", studentId: "EST-003", bookId: "BOOK-001", sectionId: "SEC-01", status: "FINALIZADA", finalizedAt: "2026-09-09T11:30:00", literalScore: 84, inferentialScore: 76, globalScore: 80 },
  { id: "SES-010", studentId: "EST-003", bookId: "BOOK-001", sectionId: "SEC-02", status: "FINALIZADA", finalizedAt: "2026-09-19T09:45:00", literalScore: 88, inferentialScore: 82, globalScore: 85 },
  { id: "SES-011", studentId: "EST-003", bookId: "BOOK-001", sectionId: "SEC-03", status: "FINALIZADA", finalizedAt: "2026-09-27T11:50:00", literalScore: 92, inferentialScore: 86, globalScore: 89 },
  { id: "SES-012", studentId: "EST-004", bookId: "BOOK-001", sectionId: "SEC-01", status: "FINALIZADA", finalizedAt: "2026-09-10T10:05:00", literalScore: 68, inferentialScore: 60, globalScore: 64 },
  { id: "SES-013", studentId: "EST-004", bookId: "BOOK-001", sectionId: "SEC-04", status: "FINALIZADA", finalizedAt: "2026-09-26T09:25:00", literalScore: 76, inferentialScore: 68, globalScore: 72 },
  { id: "SES-014", studentId: "EST-005", bookId: "BOOK-001", sectionId: "SEC-01", status: "FINALIZADA", finalizedAt: "2026-09-12T11:10:00", literalScore: 80, inferentialScore: 72, globalScore: 76 },
  { id: "SES-015", studentId: "EST-005", bookId: "BOOK-001", sectionId: "SEC-02", status: "FINALIZADA", finalizedAt: "2026-09-25T10:20:00", literalScore: 86, inferentialScore: 78, globalScore: 82 },
  { id: "SES-016", studentId: "EST-006", bookId: "BOOK-001", sectionId: "SEC-01", status: "FINALIZADA", finalizedAt: "2026-09-13T09:50:00", literalScore: 72, inferentialScore: 62, globalScore: 67 },
  { id: "SES-017", studentId: "EST-006", bookId: "BOOK-001", sectionId: "SEC-03", status: "FINALIZADA", finalizedAt: "2026-09-23T11:35:00", literalScore: 78, inferentialScore: 70, globalScore: 74 },
  { id: "SES-018", studentId: "EST-007", bookId: "BOOK-001", sectionId: "SEC-02", status: "FINALIZADA", finalizedAt: "2026-09-15T10:55:00", literalScore: 82, inferentialScore: 74, globalScore: 78 },
  { id: "SES-019", studentId: "EST-007", bookId: "BOOK-001", sectionId: "SEC-04", status: "FINALIZADA", finalizedAt: "2026-09-28T09:15:00", literalScore: 88, inferentialScore: 82, globalScore: 85 },
  { id: "SES-020", studentId: "EST-008", bookId: "BOOK-001", sectionId: "SEC-01", status: "FINALIZADA", finalizedAt: "2026-09-16T12:05:00", literalScore: 74, inferentialScore: 66, globalScore: 70 },
  { id: "SES-021", studentId: "EST-008", bookId: "BOOK-001", sectionId: "SEC-03", status: "FINALIZADA", finalizedAt: "2026-09-22T10:30:00", literalScore: 80, inferentialScore: 74, globalScore: 77 }
];
