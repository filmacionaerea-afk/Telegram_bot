Markdown
# Fullstack Architecture Document: Telegram Bot for Emerging Crypto Narratives

## Introduction

This document outlines the complete fullstack architecture for the **Telegram Bot for Emerging Crypto Narratives**, including backend systems, the frontend (bot) implementation, and their integration. It serves as the single source of truth for AI-driven development, ensuring consistency across the entire technology stack.

#### Starter Template or Existing Project
* **Decision:** N/A - Greenfield project.
* **Details:** The project will be built from scratch. The Telegram bot will be developed using the official Telegram SDK in TypeScript, not a pre-existing template.

#### Change Log
| Date | Version | Description | Author |
| :--- | :--- | :--- | :--- |
| 18/10/2025 | 1.0 | Initial creation of the Architecture Document. | Winston (Architect) |

## High Level Architecture

#### Technical Summary
La arquitectura está diseñada como un sistema de **microservicios desacoplados** que se ejecutan en un **monorepo** de TypeScript. El sistema consta de tres servicios principales: un **Recolector de Datos**, un **Analizador de IA** y un **Bot Notificador de Telegram**. Estos servicios operan de forma asíncrona, utilizando una base de datos **SQLite central** como nexo de comunicación. La arquitectura está optimizada para ser desplegada en un servidor en la nube, utilizando `cron jobs` para la automatización de tareas. Este enfoque modular garantiza la escalabilidad, la mantenibilidad y el despliegue independiente de cada componente.

#### Platform and Infrastructure Choice
* **Platform:** Servidor Privado Virtual (VPS) en la nube.
* **Justification:** Para la fase de MVP, un VPS estándar (como DigitalOcean, Linode, o AWS Lightsail) ofrece la máxima flexibilidad y simplicidad. Permite un control total sobre el entorno, facilita la configuración de la base de datos SQLite en un sistema de archivos local y simplifica la gestión de los `cron jobs`.
* **Key Services:**
    * **Computación:** 1x VPS con Linux (Ubuntu).
    * **Base de Datos:** SQLite alojado en el sistema de archivos del VPS.

#### Repository Structure
* **Structure:** Monorepo gestionado con npm/pnpm workspaces.
* **Justification:** Un monorepo es ideal para este proyecto, ya que permitirá gestionar el código de los diferentes servicios (`collector`, `analyzer`, `bot`) y cualquier paquete compartido en un solo lugar.

#### High Level Architecture Diagram

```mermaid
graph TD
    subgraph "Fuentes Externas"
        X[X (Twitter)]
        R[Reddit]
    end

    subgraph "Nuestra Infraestructura en la Nube (VPS)"
        subgraph "Servicio Recolector (Collector)"
            direction LR
            CRON1[Cron Job: DATA_FETCH_INTERVAL] --> CAPI(API Interna de Datos);
        end

        subgraph "Servicio Analizador (Analyzer)"
            direction LR
            CRON2[Cron Job: ANALYSIS_INTERVAL] --> AAPI(API Interna de Análisis);
        end

        subgraph "Servicio Notificador (Bot)"
            direction LR
            CRON3[Cron Job: REPORTING_INTERVAL] --> TAPI(API de Telegram);
        end

        DB[(SQLite Database)];
    end

    subgraph "Usuarios"
        TG_PUB[Canal Público de Telegram]
        TG_PRIV[Grupo Privado de Telegram]
    end

    X --> CAPI;
    R --> CAPI;
    CAPI --> DB;

    DB --> AAPI;
    AAPI --> DB;

    DB --> CRON3;
    TAPI --> TG_PUB;
    TAPI --> TG_PRIV;
Architectural Patterns
Decoupled Microservices: Cada función principal es un servicio independiente. Justification: Permite el desarrollo, despliegue y escalado por separado.
Database-driven Asynchronous Communication: Los servicios no se comunican directamente. En su lugar, se comunican a través del estado de la base de datos. Justification: Crea un sistema resiliente y desacoplado.
Monorepo: Todo el código reside en un único repositorio. Justification: Facilita la gestión de dependencias y el código compartido.
Tech Stack
Technology Stack Table
Category
Technology
Version
Purpose
Rationale
Backend Language
TypeScript
~5.x
Lenguaje principal de desarrollo
Robustez, escalabilidad y tipos estáticos.
Runtime
Node.js
^20.x (LTS)
Entorno de ejecución para los servicios
Estándar de la industria, gran ecosistema.
Database
SQLite
^5.x
Base de datos centralizada
Simplicidad, sin necesidad de servidor, ideal para MVP.
Telegram SDK
Telegraf.js
^4.x
Interacción con la API de Telegram
Librería popular y robusta para bots de Telegram.
DB Client
better-sqlite3
^9.x
Cliente de base de datos para SQLite
Ofrece un rendimiento síncrono superior para SQLite.
Cron Job Library
node-cron
^3.x
Programación de tareas
Librería simple y efectiva para automatización.
Backend Testing
Jest
^29.x
Framework de pruebas unitarias/integración
Ecosistema completo para pruebas en TypeScript/Node.js.
CI/CD
GitHub Actions
N/A
Automatización de integración y despliegue
Integración nativa con GitHub, fácil de configurar.
Logging
pino
^8.x
Librería de logging
Alto rendimiento y formato JSON estructurado.

Data Models
Influencers
Purpose: Almacena la lista de fuentes de datos (perfiles de X, subreddits).
TypeScript Interface:
TypeScript

interface Influencer {
  id: number;
  profile_name: string;
  profile_url: string;
  primary_blockchain_network: string;
}


Posts
Purpose: Almacena los datos brutos recolectados de cada publicación.
TypeScript Interface:
TypeScript

interface Post {
  id: number;
  influencer_id: number;
  post_url: string;
  content: string;
  views: number;
  comments: number;
  interactions: number;
  timestamp: string; // ISO 8601 format
}


DailyNarratives
Purpose: Almacena los resultados del análisis de IA para cada día.
TypeScript Interface:
TypeScript

interface DailyNarrative {
  id: number;
  date: string; // YYYY-MM-DD format
  narrative_summary: string;
  sentiment: 'Bullish' | 'Bearish' | 'Neutral';
}


NarrativeProbabilities
Purpose: Almacena la puntuación de probabilidad y los datos de soporte para cada narrativa.
TypeScript Interface:
TypeScript

interface NarrativeProbability {
  id: number;
  narrative_id: number;
  probability_score: number; // 0.0 to 1.0
  calculation_date: string; // ISO 8601 format
  supporting_posts_ids: string; // Comma-separated list of Post IDs
}


API Specification
No se desarrollará una API externa (REST/GraphQL) en el MVP. La comunicación entre los servicios internos se realizará a través de la base de datos. Las "APIs internas" son abstracciones lógicas que se implementarán como módulos dentro de los servicios correspondientes.
Components
Collector Service: Responsable de ejecutar el cron job que invoca a la API de datos, procesa las respuestas y almacena los datos brutos en la tabla Posts.
Analyzer Service: Responsable de ejecutar el cron job que lee los nuevos Posts, los envía a la API de análisis y almacena los resultados en las tablas DailyNarratives y NarrativeProbabilities.
Bot Service: Responsable de ejecutar el cron job que lee los resultados del análisis de la base de datos, formatea los mensajes y los envía a los canales de Telegram.
External APIs
Telegram Bot API: Se utilizará a través del SDK Telegraf.js para enviar mensajes. La autenticación se gestionará mediante un Bot Token proporcionado por Telegram (BotFather).
Core Workflows
Flujo de Datos End-to-End
Fragmento de código
sequenceDiagram
    participant Cron1 as Cron (Collector)
    participant Collector
    participant DB as SQLite DB
    participant Cron2 as Cron (Analyzer)
    participant Analyzer
    participant Cron3 as Cron (Bot)
    participant Bot
    participant Telegram

    Cron1->>Collector: Dispara el trabajo de recolección
    Collector->>DB: Lee lista de Influencers
    Collector->>Collector: Llama a la API interna de datos
    Collector->>DB: Escribe nuevos Posts

    Cron2->>Analyzer: Dispara el trabajo de análisis
    Analyzer->>DB: Lee nuevos Posts
    Analyzer->>Analyzer: Llama a la API interna de análisis
    Analyzer->>DB: Escribe DailyNarratives y NarrativeProbabilities

    Cron3->>Bot: Dispara el trabajo de notificación
    Bot->>DB: Lee los resultados del análisis
    Bot->>Telegram: Envía informe al Grupo Privado
    Bot->>Telegram: Envía resumen al Canal Público
Database Schema
SQL
-- Tabla: Influencers
CREATE TABLE Influencers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    profile_name TEXT NOT NULL UNIQUE,
    profile_url TEXT,
    primary_blockchain_network TEXT
);

-- Tabla: Posts
CREATE TABLE Posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    influencer_id INTEGER NOT NULL,
    post_url TEXT NOT NULL UNIQUE,
    content TEXT,
    views INTEGER DEFAULT 0,
    comments INTEGER DEFAULT 0,
    interactions INTEGER DEFAULT 0,
    timestamp DATETIME NOT NULL,
    FOREIGN KEY (influencer_id) REFERENCES Influencers (id)
);

-- Tabla: DailyNarratives
CREATE TABLE DailyNarratives (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date DATE NOT NULL,
    narrative_summary TEXT NOT NULL,
    sentiment TEXT CHECK(sentiment IN ('Bullish', 'Bearish', 'Neutral'))
);

-- Tabla: NarrativeProbabilities
CREATE TABLE NarrativeProbabilities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    narrative_id INTEGER NOT NULL,
    probability_score REAL NOT NULL CHECK(probability_score >= 0 AND probability_score <= 1),
    calculation_date DATETIME NOT NULL,
    supporting_posts_ids TEXT,
    FOREIGN KEY (narrative_id) REFERENCES DailyNarratives (id)
);
Frontend Architecture (Bot Service)
Service Layer
Se creará una capa de servicio (TelegramService.ts) que encapsulará toda la lógica de interacción con el SDK de Telegraf.
TypeScript
// services/TelegramService.ts
import { Telegraf } from 'telegraf';

class TelegramService {
  private bot: Telegraf;

  constructor(token: string) {
    this.bot = new Telegraf(token);
  }

  public async sendPrivateReport(chatId: string, message: string): Promise<void> {
    await this.bot.telegram.sendMessage(chatId, message, { parse_mode: 'Markdown' });
  }

  public async sendPublicSummary(chatId: string, message: string): Promise<void> {
    await this.bot.telegram.sendMessage(chatId, message, { parse_mode: 'Markdown' });
  }

  // ... más métodos si son necesarios
}
Backend Architecture (Collector & Analyzer Services)
Data Access Layer
Se utilizará un patrón de Repositorio simple para abstraer las interacciones con la base de datos SQLite.
TypeScript
// packages/db/src/PostRepository.ts
import Database from 'better-sqlite3';

class PostRepository {
  private db: Database.Database;

  constructor(dbPath: string) {
    this.db = new Database(dbPath);
  }

  public getNewPosts(since: string): Post[] {
    const stmt = this.db.prepare('SELECT * FROM Posts WHERE timestamp > ?');
    return stmt.all(since) as Post[];
  }

  // ... otros métodos como addPost, etc.
}
Unified Project Structure
Plaintext
/
├── apps/
│   ├── collector/      # Servicio de recolección de datos
│   │   ├── src/
│   │   │   └── main.ts
│   │   └── package.json
│   ├── analyzer/       # Servicio de análisis con IA
│   │   ├── src/
│   │   │   └── main.ts
│   │   └── package.json
│   └── bot/            # Servicio de notificación de Telegram
│       ├── src/
│       │   └── main.ts
│       └── package.json
├── packages/
│   ├── config/         # Carga de variables de entorno
│   ├── db/             # Cliente de BD y repositorios
│   ├── types/          # Interfaces compartidas de TypeScript
│   └── logger/         # Configuración del logger
├── .env.example
├── .gitignore
├── package.json
└── tsconfig.json
Deployment Architecture
Estrategia: Despliegue manual (vía git pull y scp) al VPS para el MVP.
Gestión de Procesos: Se utilizará un gestor de procesos como pm2 en el VPS para asegurar que los tres servicios (collector, analyzer, bot) se mantengan en ejecución y se reinicien automáticamente en caso de fallo.
CI/CD: Se configurará un flujo de trabajo básico en GitHub Actions para ejecutar el linter y las pruebas en cada push, asegurando la calidad del código.
Security
Gestión de Secretos: Todas las claves de API y tokens se gestionarán a través de variables de entorno (.env file) en el VPS. El archivo .env nunca se incluirá en el repositorio de Git.
Acceso a la Base de Datos: La base de datos SQLite será un archivo local en el VPS, accesible únicamente por los servicios que se ejecutan en él, minimizando la superficie de ataque.
Testing Strategy
Pruebas Unitarias: Cada función y clase dentro de los servicios y paquetes será probada de forma aislada utilizando Jest. Se usarán mocks para simular las llamadas a las APIs internas y a la base de datos.
Pruebas de Integración: Se creará una base de datos de prueba para verificar que el flujo completo (escribir con el recolector, leer con el analizador, etc.) funciona correctamente.
