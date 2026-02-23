# Auditoría de Sitio Actual: dibrand.co

## Resumen Ejecutivo
Se ha realizado un análisis de la estructura de contenidos del sitio actual mediante exploración automatizada. A continuación se detalla la estructura de datos identificada para las secciones de Portfolio y Búsquedas Activas.

## 1. Portfolio (Proyectos)

El portfolio presenta una estructura orientada a mostrar casos de éxito con categorización y detalle profundo.

### Vista de Listado (Home/Portfolio)
- **Título**: Nombre del cliente o proyecto (ej. "Neptuno Bebidas", "Desde Asia Market").
- **Categoría/Servicios**: Etiquetas asociadas (ej. "Data Analytics", "Web Development").
- **Enlace**: URL dedicada de proyecto (`/portfolio/[slug]/`).
- **Resumen**: Breve descripción del desafío o solución.
- **Imagen Destacada**: Visual principal del proyecto.

### Vista de Detalle (`/portfolio/[slug]/`)
- **Breadcrumbs**: Navegación jerárquica (Home / Projects / Título).
- **Sección Hero**: Título del proyecto.
- **Media**: Galería o imagen principal del proyecto ("The project").
- **Descripción ("What did we do?")**: Texto detallado explicando el problema y la solución implementada.
- **Tecnologías/Stack**: Sección visual o listada de tecnologías utilizadas.
- **Navegación**: Enlaces a proyectos anterior/siguiente (ej. "Lowen", "Desde Asia Market").
- **Call to Action**: Sección de contacto ("LET'S TALK").

## 2. Búsquedas Activas (Jobs/Careers)

La sección de empleos gestiona ofertas laborales con metadatos específicos para filtrar y atraer talento.

### Vista de Listado (Home/Jobs)
- **Título del Puesto**: (ej. "Full Stack Developer | React-Node").
- **Enlace**: URL dedicada de la oferta (`/job/[slug]/`).
- **Modalidad**: Tipo de contratación (ej. "Full time").
- **Duración**: Temporalidad (ej. "Short Term" o Indefinido).
- **Rango Salarial**: Campos estructurados para "From" y "To" (aunque actualmente parecen estar en 000 en algunos casos).
- **Enlace "Ver todo"**: Acceso al listado completo (`/jobs/`).

### Vista de Detalle (`/job/[slug]/`)
- **Meta-información Encabezado**:
    - **Industria**: (ej. "IT Services").
    - **Tipo de Trabajo**: (ej. "Full time").
    - **Ubicación**: (ej. "Argentina").
- **Descripción**: Detalle de responsabilidades y cultura (extraído de metadatos OG, incluye "Acerca de Nosotros", "Seniority", etc.).
- **Requisitos**: Seniority y tecnologías requeridas.

## Conclusiones para Rediseño
Para el nuevo sitio, se recomienda mantener o enriquecer estos esquemas de datos:
1.  **Colección `Projects`**: Necesita campos para Título, Slug, Excerpt, Content (Rich Text), Gallery (List of Images), Services (Tags), Tech Stack (Tags/Icons).
2.  **Colección `Jobs`**: Necesita campos para Title, Slug, Job Type (Select), Location (Text), Salary Range (Object), Description (Rich Text), Requirements (Rich Text).
3.  **Filtrado**: Implementar filtros en listados basados en Servicios (para Portfolio) y Roles/Tecnologías (para Jobs).
