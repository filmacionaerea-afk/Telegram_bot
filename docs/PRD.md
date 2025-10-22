# Product Requirements Document (PRD): Telegram Bot for Emerging Crypto Narratives

## Goals and Background Context

#### Goals
* Validar la viabilidad de un servicio de inteligencia de mercado por suscripción durante una fase de demo gratuita.
* Establecer el bot como una fuente de información creíble y de alta calidad para inversores minoristas.
* Proporcionar a los usuarios informes que les ofrezcan una ventaja informativa real y procesable.
* Alcanzar una tasa de precisión predictiva del 70% en la detección de narrativas antes de que se popularicen.

#### Background Context
El mercado de criptomonedas presenta una sobrecarga de información donde los inversores minoristas luchan por diferenciar las señales valiosas del "ruido". Las herramientas actuales son reactivas, informando de las tendencias cuando ya es tarde. Este proyecto resuelve ese problema mediante un bot de Telegram proactivo que utiliza IA para analizar la actividad de influencers clave, permitiendo a los usuarios detectar narrativas emergentes de forma temprana y tomar decisiones de inversión más informadas.

#### Change Log
| Date | Version | Description | Author |
| :--- | :--- | :--- | :--- |
| 18/10/2025 | 1.0 | Creación inicial del PRD a partir del Project Brief. | John (PM) |

## Requirements

#### Functional
* [cite_start]**FR1:** El sistema debe recolectar automáticamente las últimas publicaciones de una lista predefinida de *influencers* de X (Twitter) y subreddits a través de una API de datos[cite: 1392].
* [cite_start]**FR2:** Para cada publicación recolectada, el sistema debe almacenar el contenido, la URL, las métricas de interacción (vistas, comentarios, likes) y la marca de tiempo en la base de datos SQLite[cite: 1392, 2].
* [cite_start]**FR3:** El sistema debe procesar las nuevas publicaciones a través de una API de análisis para generar un resumen de la "narrativa del día"[cite: 2].
* [cite_start]**FR4:** El sistema debe analizar la narrativa diaria para determinar el sentimiento general del mercado (Alcista, Bajista o Neutral)[cite: 2].
* [cite_start]**FR5:** El sistema debe calcular una puntuación de probabilidad (entre 0 y 1) para la narrativa del día, basándose en la frecuencia histórica y las métricas de interacción social[cite: 2].
* [cite_start]**FR6:** El sistema debe analizar el historial de publicaciones (definido por `NARRATIVE_HISTORY_WINDOW`) para identificar y generar 5 narrativas probables adicionales que puedan estar desarrollándose[cite: 2].
* [cite_start]**FR7:** El bot de Telegram debe enviar un mensaje de alto nivel al canal público con la narrativa detectada, el sentimiento y la probabilidad[cite: 2].
* [cite_start]**FR8:** El bot de Telegram debe enviar un informe detallado al grupo privado, incluyendo el resumen de la narrativa, sentimiento, probabilidad y enlaces a las 2-3 publicaciones más relevantes que la respaldan[cite: 2].

#### Non-Functional
* [cite_start]**NFR1:** El sistema debe ser configurable a través de un archivo central (`.env` o similar) que gestione todas las variables críticas, incluyendo claves de API, intervalos de cron jobs y IDs de canales[cite: 1, 2].
* [cite_start]**NFR2:** La recolección de datos y los ciclos de análisis deben operar de forma autónoma y programada (mediante cron jobs) sin necesidad de intervención manual[cite: 2].
* [cite_start]**NFR3:** El código del sistema debe ser desarrollado en TypeScript para garantizar la robustez y mantenibilidad[cite: 1].
* [cite_start]**NFR4:** La base de datos SQLite debe seguir el esquema definido, con tablas para `Influencers`, `Posts`, `DailyNarratives` y `NarrativeProbabilities`[cite: 2].

## User Interface Design Goals

#### Overall UX Vision
La experiencia del usuario debe sentirse como si tuviera acceso a un analista de mercado personal, eficiente y de confianza. La interacción debe ser directa y sin fricciones. El usuario debe percibir cada notificación como una pieza de información de alto valor ("alfa") que le da una ventaja, sintiéndose informado y proactivo, no abrumado por datos.

#### Key Interaction Paradigms
La interacción principal es **proactiva y unidireccional**. El bot "empuja" (push) informes programados y de alto valor a los canales. En la fase de MVP, no se requiere que el usuario inicie conversaciones o utilice comandos complejos ("pull"). La experiencia se centra en recibir, no en solicitar.

#### Core Screens and Views
1.  **Notificación del Canal Público:** Un mensaje conciso y atractivo, diseñado para generar interés y demostrar valor. Contendrá únicamente el titular de la narrativa, el sentimiento general y el nivel de probabilidad.
2.  **Informe Detallado del Grupo Privado:** Un mensaje bien estructurado y fácil de leer en Telegram. Debe usar formato (negrita, listas) para separar claramente las secciones:
    * Resumen de la narrativa.
    * Métricas clave y sentimiento.
    * Enlaces a las 2-3 publicaciones más influyentes.
    * Una sección separada para las 5 narrativas probables adicionales.

#### Accessibility
Los informes deben usar un lenguaje claro y estar formateados con Markdown para mejorar la legibilidad y la estructura.

#### Branding
El tono de comunicación del bot será **accesible y atractivo, con un detalle moderado**. Debe sonar experto pero evitar la jerga excesivamente técnica.

#### Target Device and Platforms
[cite_start]La interfaz está diseñada para los clientes de Telegram en dispositivos móviles (iOS, Android) y de escritorio (Windows, macOS, Linux)[cite: 519].

## Technical Assumptions

#### Repository Structure: Monorepo
* **Rationale:** Un monorepo es ideal para este proyecto, ya que permitirá gestionar el código de los diferentes servicios (recolector, analizador, bot) y cualquier utilidad compartida en un solo lugar.

#### Service Architecture: Decoupled Microservices
* **Rationale:** La solución se compone de servicios independientes que se comunican de forma asíncrona a través de la base de datos SQLite. [cite_start]Este enfoque permite desarrollar, desplegar y escalar cada componente de forma independiente[cite: 522].

#### Testing Requirements: Unit + Integration
* [cite_start]**Rationale:** Se requerirán pruebas unitarias para cada módulo y pruebas de integración para verificar que los servicios interactúan correctamente a través de la base de datos y con las APIs[cite: 523].

#### Additional Technical Assumptions and Requests
* [cite_start]**Language:** TypeScript[cite: 1].
* [cite_start]**Database:** SQLite[cite: 1, 2].
* **Telegram SDK:** El desarrollo se basará en el SDK oficial de Telegram.
* **APIs:** El sistema dependerá de APIs internas para la recolección de datos y el análisis.
* [cite_start]**Automation:** La operación se basará en `cron jobs`[cite: 2].
* [cite_start]**Deployment:** La solución se alojará en un servidor en la nube[cite: 1].

## Epic List

* **Epic 1: Fundación del Proyecto e Infraestructura Central:** Establecer la estructura del proyecto (monorepo), la base de datos, la configuración central y el esqueleto básico del bot de Telegram.
* **Epic 2: Motor de Recolección y Almacenamiento de Datos:** Implementar el servicio que se conecta a la API de recolección, extrae las publicaciones y las almacena en SQLite.
* **Epic 3: Análisis y Síntesis de Narrativas con IA:** Desarrollar el servicio que procesa los datos brutos para generar narrativas, sentimiento y probabilidades.
* **Epic 4: Informes Inteligentes y Notificación por Telegram:** Construir el módulo final que lee los datos analizados y los envía a los canales de Telegram.

## Epic 1: Fundación del Proyecto e Infraestructura Central
**Expanded Goal:** Establecer la estructura técnica fundamental y el esqueleto del proyecto. Esto incluye la creación del monorepo, la inicialización de la base de datos SQLite, la configuración de un sistema centralizado para variables de entorno y la conexión de un bot de Telegram básico.

#### Story 1.1: Creación de la Estructura del Proyecto (Monorepo)
* **As a** developer, **I want** a monorepo project structure, **so that** I can manage the code for all services and shared packages in an organized, centralized way.
* **Acceptance Criteria:**
    1.  A new Git repository is initialized.
    2.  The main folder structure includes `apps` and `packages` directories.
    3.  A root `package.json` is configured to manage workspaces.
    4.  A base `tsconfig.json` is configured at the root level.

#### Story 1.2: Implementación de la Configuración Centralizada
* **As a** developer, **I want** a centralized configuration system, **so that** I can manage all API keys and environment variables securely and consistently across all services.
* **Acceptance Criteria:**
    1.  An `.env.example` file is created at the project root.
    2.  The `.gitignore` file is updated to exclude `.env` files.
    3.  A shared package is created to load and provide environment variables.

#### Story 1.3: Inicialización de la Base de Datos
* **As a** developer, **I want** an initialized SQLite database with the correct schema, **so that** services have a persistence layer to read and write data.
* **Acceptance Criteria:**
    1.  A script is created to generate the SQLite database file.
    2.  The script creates the `Influencers`, `Posts`, `DailyNarratives`, and `NarrativeProbabilities` tables correctly.
    3.  The database file is added to `.gitignore`.

#### Story 1.4: Conexión Básica del Bot de Telegram
* **As a** developer, **I want** a basic bot application that connects to the Telegram API, **so that** I can verify that the fundamental connection works.
* **Acceptance Criteria:**
    1.  A new `bot` application is created within the `apps/` directory.
    2.  The application uses the Telegram SDK to initialize a bot instance.
    3.  The bot token is loaded from the central configuration.
    4.  On execution, the application successfully authenticates with the Telegram API.

## Epic 2: Motor de Recolección y Almacenamiento de Datos
**Expanded Goal:** Implementar el servicio de recolección de datos completamente funcional, que se conectará a la API de datos, obtendrá las publicaciones y las persistirá en la base de datos SQLite.

#### Story 2.1: Pre-carga de la Lista de Influencers
* **As a** system, **I need** to have an initial list of influencers in the database, **so that** the collection service knows which sources to pull data from.
* **Acceptance Criteria:**
    1.  A seeding script is created to read a predefined list of influencers.
    2.  The script populates the `Influencers` table in the SQLite database.
    3.  The script prevents duplicate entries.

#### Story 2.2: Implementación del Servicio de Recolección de Datos
* **As a** developer, **I want** a new `collector` service within the monorepo, **so that** I can house all logic related to data extraction and storage.
* **Acceptance Criteria:**
    1.  A new `collector` application is created within the `apps/` directory.
    2.  The service has access to the central configuration and the database.
    3.  A main file (`index.ts`) is created as the entry point.

#### Story 2.3: Extracción de Publicaciones para un Influencer
* **As a** collector service, **I want** to fetch the latest posts for a specific influencer via the data API, **so that** I can process and store the relevant information.
* **Acceptance Criteria:**
    1.  A function is created that queries the database for an influencer's profile.
    2.  The function makes an API call to request the posts for that profile.
    3.  The function handles successful and failed API responses correctly.

#### Story 2.4: Persistencia de Publicaciones en la Base de Datos
* **As a** collector service, **I want** to save the fetched posts into the SQLite database, **so that** the data is permanently stored for later analysis.
* **Acceptance Criteria:**
    1.  A function is created that receives a list of posts and an `influencer_id`.
    2.  The function inserts each post into the `Posts` table, mapping all fields correctly.
    3.  The logic prevents the insertion of duplicate posts.

#### Story 2.5: Orquestación del Proceso de Recolección
* **As a** collector service, **I want** a main script that orchestrates the entire process for all influencers, **so that** I can run a full collection cycle with a single command.
* **Acceptance Criteria:**
    1.  The main script reads the full list of influencers from the database.
    2.  The script iterates over each influencer, fetching and persisting their posts.
    3.  The script logs the progress and a final summary.

#### Story 2.6: Programación del Cron Job de Recolección
* **As a** system, **I need** the collection process to run automatically at regular intervals, **so that** the database stays updated without manual intervention.
* **Acceptance Criteria:**
    1.  A cron job library is added.
    2.  The main script is scheduled to run based on the `DATA_FETCH_INTERVAL` environment variable.

## Epic 3: Análisis y Síntesis de Narrativas con IA
**Expanded Goal:** Desarrollar el servicio de análisis que transforma los datos crudos en inteligencia procesable, generando narrativas, sentimientos y probabilidades, y almacenando los resultados en la base de datos.

#### Story 3.1: Implementación del Servicio de Análisis
* **As a** developer, **I want** a new `analyzer` service within the monorepo, **so that** I can house all logic related to data processing and AI analysis.
* **Acceptance Criteria:**
    1.  A new `analyzer` application is created within the `apps/` directory.
    2.  The service has access to the central configuration and the database.
    3.  A mechanism is established to track the timestamp of the last analysis run.

#### Story 3.2: Recuperación de Datos Nuevos para Análisis
* **As an** analyzer service, **I want** to retrieve all posts added since my last run, **so that** I can process only new and relevant information.
* **Acceptance Criteria:**
    1.  A function queries the timestamp of the last analysis.
    2.  The function retrieves all records from the `Posts` table newer than that timestamp.

#### Story 3.3: Identificación de la Narrativa del Día
* **As an** analyzer service, **I want** to send the content of new posts to the analysis API, **so that** I can identify the main narrative of the day and its associated sentiment.
* **Acceptance Criteria:**
    1.  A function invokes the analysis API with the new content and the `narrative_prompt.txt`.
    2.  The function invokes the analysis API a second time with the `sentiment_prompt.txt`.
    3.  The results (narrative summary and sentiment) are saved to the `DailyNarratives` table.

#### Story 3.4: Cálculo de Probabilidad y Narrativas Emergentes
* **As an** analyzer service, **I want** to send historical and current context to the analysis API, **so that** I can calculate the probability of the current narrative and identify 5 emerging narratives.
* **Acceptance Criteria:**
    1.  A function retrieves historical narratives from the database.
    2.  The function invokes the analysis API with the required context and the `probability_prompt.txt`.
    3.  The probability score is saved to the `NarrativeProbabilities` table.
    4.  The 5 emerging narratives are saved as new entries in the `DailyNarratives` and `NarrativeProbabilities` tables.

#### Story 3.5: Orquestación y Programación del Cron Job de Análisis
* **As a** system, **I need** the entire analysis process to run automatically, **so that** market intelligence is generated regularly.
* **Acceptance Criteria:**
    1.  The main script orchestrates the sequence of analysis steps.
    2.  The script updates the timestamp of the last analysis run.
    3.  The process is scheduled as a cron job based on the `ANALYSIS_INTERVAL` environment variable.

## Epic 4: Informes Inteligentes y Notificación por Telegram
**Expanded Goal:** Construir el componente final que lee la inteligencia procesada de la base de datos, la formatea en mensajes claros y los distribuye a los canales de Telegram correspondientes.

#### Story 4.1: Recuperación de la Narrativa Analizada
* **As a** bot service, **I want** to query the database for the latest daily narrative and its associated data, **so that** I can prepare the content for the reports.
* **Acceptance Criteria:**
    1.  A function retrieves the latest record from `DailyNarratives`.
    2.  The function retrieves the corresponding `probability_score`.
    3.  The function retrieves the supporting posts from the `Posts` table.

#### Story 4.2: Formateo del Informe Detallado para el Grupo Privado
* **As a** bot service, **I want** a function that transforms the narrative data into a Markdown-formatted text message, **so that** the report is clear and professional in the private group.
* **Acceptance Criteria:**
    1.  The output message uses Telegram formatting (bold, lists, etc.).
    2.  The message includes separate sections for the summary, sentiment, probability, supporting links, and the 5 additional probable narratives.

#### Story 4.3: Envío del Informe al Grupo Privado
* **As a** bot service, **I want** to send the detailed, formatted report to the designated Telegram group, **so that** exclusive members receive the full analysis.
* **Acceptance Criteria:**
    1.  The bot sends a message using the Telegram SDK.
    2.  The destination group ID is read from the `PRIVATE_GROUP_ID` environment variable.

#### Story 4.4: Envío del Resumen al Canal Público
* **As a** bot service, **I want** to send a concise, high-level message to the public channel, **so that** I can generate interest and attract new users.
* **Acceptance Criteria:**
    1.  A function formats a brief message with only the narrative title, sentiment, and probability.
    2.  The bot sends this message to the channel ID defined in `PUBLIC_CHANNEL_ID`.

#### Story 4.5: Orquestación y Programación del Cron Job de Notificación
* **As a** system, **I need** the report-sending process to run automatically after the analysis, **so that** users receive timely information.
* **Acceptance Criteria:**
    1.  The main bot script orchestrates the sequence of fetching, formatting, and sending reports.
    2.  The process is scheduled as a cron job based on a `REPORTING_INTERVAL` variable.
    3.  The schedule is set to run after the analysis cron job has completed.

## Checklist Results Report
*Esta sección se poblaría después de ejecutar la `pm-checklist` contra este PRD. El objetivo es validar la integridad, claridad y viabilidad del plan antes de pasarlo al arquitecto. Se generaría un informe de estado (PASS/FAIL) para cada categoría de la checklist y se enumerarían las deficiencias críticas que deban ser corregidas.*

## Next Steps
#### UX Expert Prompt
"Basándote en este PRD, y específicamente en la sección 'User Interface Design Goals', por favor, crea un **UI/UX Specification** detallado. Enfócate en la estructura de los mensajes para el canal público y el grupo privado, el tono de la comunicación y el flujo de la experiencia del usuario al recibir los informes. El objetivo es asegurar que la presentación de la información sea clara, atractiva y de máximo valor para el 'Inversor Cripto Aficionado'."

#### Architect Prompt
"Utilizando este PRD como guía, por favor, crea un **Architecture Document** completo. Presta especial atención a las 'Suposiciones Técnicas', la arquitectura de microservicios desacoplados, la estructura del monorepo y el esquema de la base de datos SQLite. Tu diseño debe servir como el plano técnico definitivo para que el equipo de desarrollo implemente este sistema de forma robusta y escalable."
