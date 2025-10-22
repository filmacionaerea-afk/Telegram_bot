Markdown
# UI/UX Specification: Telegram Bot for Emerging Crypto Narratives

## Introduction

This document defines the user experience goals, information architecture, user flows, and conversational design specifications for the project's user interface. It serves as the foundation for the bot's development, ensuring a cohesive and user-centered experience.

### Overall UX Goals & Principles

#### Target User Personas
* **The Amateur Crypto Investor:** An enthusiastic hobbyist trader who values actionable insights over deep technical jargon. They are time-poor and need a reliable filter to cut through market noise.

#### Usability Goals
* **Efficiency:** Users must be able to grasp the core of a new narrative within 60 seconds of reading a report.
* **Clarity:** The information must be presented in a way that is immediately understandable, with a clear distinction between the main narrative, sentiment, and supporting data.
* **Trust:** The bot's tone and the quality of its reports should build confidence, positioning it as a credible and indispensable tool.

#### Design Principles
1.  **Signal over Noise:** Our primary function is to filter. Every piece of information presented must be essential and directly contribute to the user's understanding.
2.  **Proactive, Not Pestering:** The bot delivers insights without being asked, but its notifications must always feel like high-value events, not spam.
3.  **Clarity Through Structure:** We will use a strong visual hierarchy within the text-based messages to make complex information scannable and digestible on a small screen.

### Change Log
| Date | Version | Description | Author |
| :--- | :--- | :--- | :--- |
| 18/10/2025 | 1.0 | Initial creation of the UI/UX Specification. | Sally (UX Expert) |

---

## Information Architecture (IA)

The information architecture for the bot is defined by the structure and relationship between its two main points of contact with the user.

### Message Map
This map shows the two distinct message types the bot will produce.

```mermaid
graph TD
    A[🤖 Bot] --> B[📢 Canal Público];
    A --> C[🔒 Grupo Privado];
Navigation Structure
Primary Navigation: No existe una navegación tradicional. La experiencia se basa en "empujar" (push) notificaciones. El único acto de "navegación" del usuario es pasar del mensaje del canal público a considerar unirse al grupo privado para obtener más detalles.
Secondary Navigation: No aplica para el MVP.

User Flows
Flow: Consumo de una Nueva Narrativa Detectada
User Goal: Entender rápidamente la última narrativa emergente y decidir si requiere más investigación o acción.
Entry Points: Una notificación de Telegram en el móvil o escritorio.
Success Criteria: El usuario lee el informe, comprende la idea principal y se siente informado sin tener que abandonar la aplicación de Telegram.
Fragmento de código
graph TD
    A[🔔 Notificación de Telegram] --> B{¿Usuario en Canal Público o Grupo Privado?};
    B --> |Público| C[Lee mensaje conciso];
    B --> |Privado| D[Lee informe detallado];
    C --> E[Considera unirse al grupo privado para más detalles];
    D --> F[Accede a los enlaces de soporte para investigar más];

Wireframes & Mockups (Message Design)
A continuación se muestran los "wireframes" de texto para los mensajes clave del bot.
Mensaje del Canal Público
Propósito: Generar intriga y demostrar valor con una vista previa concisa.
Diseño:
Plaintext
🔥 **Nueva Narrativa Emergente Detectada** 🔥

**Tema:** DePIN sobre Solana

**Sentimiento:** Alcista  bullish
**Probabilidad:** Alta

*Únete a nuestro grupo privado para recibir el informe completo, análisis detallado y los enlaces clave.*
Informe del Grupo Privado
Propósito: Entregar el análisis completo de forma clara, estructurada y procesable.
Diseño:
Plaintext
📊 **Informe de Inteligencia de Mercado**
*18 de Octubre, 2025*

---

🚀 **NARRATIVA DEL DÍA**
*Resumen:* Se ha detectado un aumento significativo en las conversaciones de influencers clave sobre proyectos de **Infraestructura Física Descentralizada (DePIN)** que se construyen sobre la red **Solana**. La narrativa se centra en la capacidad de Solana para gestionar transacciones de alta frecuencia a bajo coste, lo que la hace ideal para aplicaciones de IoT y redes de sensores.

---

📈 **SENTIMIENTO Y PROBABILIDAD**
* **Sentimiento del Mercado:** Alcista (Bullish)
* **Puntuación de Probabilidad:** 0.85 (Muy Alta)

---

🔗 **PUBLICACIONES DE SOPORTE**
1.  [Análisis de @Influencer1 sobre el potencial de DePIN](https://twitter.com/...)
2.  [Hilo de @Influencer2 explicando la sinergia con Solana](https://twitter.com/...)

---

💡 **5 NARRATIVAS PROBABLES (En Desarrollo)**
1.  **Gaming en Base:** Aumento sutil de menciones.
2.  **SocialFi 2.0:** Proyectos que integran nuevas primitivas.
3.  **Restaking en L2s:** Interés creciente en EigenLayer.
4.  **RWA (Real World Assets):** Continúa ganando tracción.
5.  **Bots de Telegram:** Aumento de volumen en DEX bots.

Branding & Style Guide
Tono de Voz
Experto pero Accesible: El bot debe sonar inteligente y seguro, pero nunca arrogante. Utiliza un lenguaje claro y directo.
Conciso: Cada palabra cuenta. Se evitan las frases de relleno.
Atractivo: El uso de emojis relevantes ayuda a captar la atención y a transmitir el tono rápidamente.
Guía de Estilo
Títulos: Siempre en negrita y a menudo acompañados de un emoji relevante (🔥, 📊, 🚀).
Secciones: Separadas por --- para crear una clara división visual.
Palabras Clave: Los términos o proyectos clave dentro de un resumen irán en negrita para facilitar el escaneo.
Listas: Se utilizarán listas numeradas o con viñetas para presentar información como las publicaciones de soporte o las narrativas probables.
