# StoryScape · Prototipo docente

StoryScape es un sistema de tesis para acompañar la comprensión lectora de estudiantes de primaria. En la experiencia completa, el estudiante utiliza un libro físico ilustrado mientras StoryScape reconoce sus páginas, proyecta elementos 2D y permite conversar con personajes. Las respuestas a preguntas literales e inferenciales quedan registradas para su consulta posterior.

Este repositorio contiene **únicamente el prototipo web del módulo docente del MVP**. Muestra un dashboard, estudiantes, sesiones, detalles y progreso. El MVP contempla **un solo libro**, `Libro piloto StoryScape`, con cuatro secciones. Es una demostración estática, sin conexión con cámara, Unity, ElevenLabs ni un backend.

## Ejecutar localmente

Abre `index.html` directamente en un navegador moderno. No se requiere Node.js, instalación de paquetes ni servidor. También puedes servir la carpeta con cualquier servidor estático si lo prefieres.

**Credenciales de demostración**

- Correo: `docente@storyscape.edu.pe`
- Contraseña: `Story2026`

El acceso es demostrativo y se conserva solo durante la pestaña actual mediante `sessionStorage`. No ofrece seguridad ni autenticación real.

## Vistas y navegación

- **Dashboard:** resumen de estudiantes, sesiones, comprensión global promedio y actividad reciente.
- **Estudiantes:** búsqueda por nombre y acceso al detalle de cada estudiante.
- **Detalle del estudiante:** resultados global, literal e inferencial, evolución e historial.
- **Sesiones:** historial ordenado por fecha técnica de finalización.
- **Detalle de sesión:** resultados, preguntas, respuestas, pistas y retroalimentación.
- **Progreso:** selecciona un estudiante para comparar las tres dimensiones de comprensión por sesión y ver qué sección trabajó.

La navegación usa fragmentos de URL (`#dashboard`, `#estudiantes`, etc.), sin recargar la página. En pantallas pequeñas, el menú se abre desde el botón superior.

## Estructura

```text
index.html          Estructura base e íconos SVG
css/styles.css      Diseño visual y adaptación responsive
js/data.js          Libro, secciones, estudiantes, preguntas y sesiones mock
js/app.js           Navegación, vistas, búsqueda y gráficos SVG
README.md           Esta guía
```

Para modificar la demostración, edita `js/data.js`. Los gráficos se dibujan con SVG y no requieren bibliotecas externas. La fuente se solicita a Google Fonts; si no hay conexión, se usa la fuente local de respaldo.

## Publicar en GitHub Pages

1. Sube estos archivos a la raíz de un repositorio de GitHub.
2. En **Settings → Pages**, elige **Deploy from a branch**.
3. Selecciona la rama que contiene el proyecto y la carpeta **/(root)**.
4. Guarda y abre la URL publicada por GitHub Pages.

Las referencias a CSS y JavaScript son relativas (`./css/styles.css`, `./js/data.js`, `./js/app.js`), por lo que funcionan también si GitHub Pages publica el sitio bajo un subdirectorio del repositorio.

## Alcance de los datos

Los estudiantes, fechas, porcentajes, respuestas y resultados son **datos simulados para fines de prototipado**. `finalizedAt` sirve exclusivamente para ordenar el historial y mostrar la última sesión registrada; no se utiliza como indicador de comprensión. Los resultados de comprensión se muestran como datos mock.
