# Project Brief: Telegram Bot for Emerging Crypto Narratives

## Executive Summary

The project is to create a Telegram bot that proactively identifies emerging cryptocurrency narratives before they become mainstream. It will analyze the social media activity of key influencers and filter out market noise to deliver high-quality, actionable insights. The primary target audience consists of retail crypto investors and hobbyist traders looking for an edge. The core value is providing accurate, early-stage narrative detection to inform investment decisions.

## Problem Statement

The retail investor and crypto enthusiast, our target audience, faces an overwhelming and chaotic information ecosystem. Key platforms like X (Twitter) and Reddit, while hubs of innovation, are flooded with low-quality content, paid promotions (*shilling*), and biased analysis that obscure genuine opportunities.

This saturation forces the investor to spend a disproportionate amount of time and effort filtering information, often without success, leaving them in a state of constant reactivity. The core problem is that current tools are mostly news aggregators or price trackers that report on narratives *after* they have already gained significant market traction. They lack the predictive ability to systematically analyze the activity of key influencers and detect the incipient conversations that precede major trends.

The direct impact of this problem is twofold:
1.  **Loss of Opportunity:** Investors miss the advantage of entering early positions in narratives with high growth potential.
2.  **High-Risk Decision Making:** Acting on late or low-quality information increases the risk of investing at market peaks or in projects without solid fundamentals.

Solving this problem not only provides a decisive competitive advantage to the user but also validates a viable business model (subscription service) by offering clear, measurable, and hard-to-replicate value.

## Proposed Solution

We propose the development of an automated Telegram bot that functions as a proactive intelligence engine for narrative detection in the cryptocurrency ecosystem. The solution is designed to directly address the problem of noise and information overload through a systematic, two-phase workflow.

**Phase 1: Intelligent Data Collection.** Using an internal API, the system will continuously monitor a predefined and curated list of key influencers on X (Twitter) and relevant subreddits. It will extract not only the content of their posts but also crucial interaction metrics (views, comments, likes, etc.), creating a high-quality and relevant raw dataset.

**Phase 2: AI-Powered Analysis and Synthesis.** The collected data will be processed through a second internal API for analysis. Using a series of specialized and configurable prompts, the analysis engine will perform three critical tasks:
1.  **Narrative Identification:** It will synthesize the "narrative of the day" from the conversations.
2.  **Sentiment Analysis:** It will determine the overall market sentiment (bullish, bearish, neutral) associated with that narrative.
3.  **Probability Calculation:** It will assess the probability of the narrative gaining traction, based on historical frequency and the weight of social interaction.

The final output will be delivered via two Telegram channels: a public channel for general, high-level notifications to attract interest, and an exclusive private group where detailed reports will be shared, including the full summary, key metrics, sentiment, and links to the most influential supporting posts. This solution will transform the user from a reactive observer to an informed, proactive participant.

## Target Users

#### **Primary User Segment: The Amateur Crypto Investor**

* **Profile:** This segment is composed of retail investors who, while not financial professionals, have great enthusiasm and curiosity for the cryptocurrency ecosystem. It includes hobbyist traders, NFT collectors, and blockchain technology enthusiasts who manage their own investment portfolios. They are not looking for expert-level technical analysis, but rather actionable information they can quickly understand and use.
* **Current Behaviors:** They spend a considerable amount of time on platforms like X (Twitter) and Reddit, following influencers and participating in discussions to stay updated. They often feel overwhelmed by the volume of information and struggle to differentiate genuine trends from "noise" and promotions.
* **Needs and "Pain Points":**
    * **Need for a Quality Filter:** They require a source that eliminates irrelevant, low-quality content to focus solely on important signals.
    * **Access to Early Information:** Their main goal is to discover narratives *before* they reach the general public to maximize their opportunities.
    * **Clarity and Conciseness:** They value clear summaries and reports with an accessible, engaging tone that gets straight to the point without complex technical jargon.
* **Goals They Are Trying to Achieve:**
    * Gain an informational advantage over the rest of the retail market.
    * Make safer, more informed investment decisions.
    * Reduce the time spent on manual research without sacrificing information quality.

## Goals & Success Metrics

#### **Business Objectives**
* **Primary Objective (Model Validation):** To validate the viability of a subscription-based market intelligence service by demonstrating tangible, predictive value during a free demo phase to build an initial user base and gather feedback.
* **Secondary Objective (Positioning):** To establish the bot as a credible, high-quality source of information in the niche of retail crypto investors, generating organic interest through demonstrated results.

#### **User Success Metrics**
* **Perceived Utility:** Users should feel that the reports provide them with a real informational advantage. This will be measured through direct interaction: positive comments, discussions generated from the reports, and the number of times content from the private group is shared.
* **Clarity and Accessibility:** The reports must be easily understandable and actionable for the target audience. The absence of clarifying questions about terminology and the fluency of conversations will indicate success on this point.

#### **Key Performance Indicators (KPIs)**
* **Predictive Accuracy Rate (Primary KPI):** Achieve a 70% accuracy rate by correctly predicting at least 3 narratives before they become mainstream within the first 6 months of operation. This is the main indicator of the product's value.
* **Private Group Interaction Rate:** Measure weekly the percentage of active members (those who comment, react, or initiate discussions) out of the total members. A high level of interaction will be a direct indicator of content quality and relevance.
* **Public Channel Growth:** Track the weekly percentage growth of subscribers in the public channel as a metric of the interest the service is generating.
* **Qualitative Feedback Score:** Conduct quarterly surveys with users in the private group to obtain an average satisfaction score of 4 out of 5 regarding the utility of the reports.

## MVP Scope

#### **Core Features (Must Have)**
* **1. Data Collection Module:** Implementation of an automated agent (cron job) that connects to the data collection API to extract posts and interaction metrics from a predefined list of influencers and subreddits, and stores the data in the SQLite database.
* **2. Analysis and Synthesis Module:** Implementation of a second automated agent that uses the analysis API to process new data, performing narrative identification, sentiment calculation, probability scoring, and identification of 5 additional probable narratives.
* **3. Central Database (SQLite):** Full implementation of the defined database schema, including `Influencers`, `Posts`, `DailyNarratives`, and `NarrativeProbabilities` tables.
* **4. Notification Module (Telegram Bot):** A functional bot capable of automatically sending high-level summaries to the public channel and detailed, structured reports to the private group.
* **5. Centralized Configuration:** A central configuration file (`.env` or similar) to manage all critical variables (API keys, cron intervals, channel IDs, etc.).

#### **Out of Scope for MVP**
* **Subscription and Payment System:** No user management, payment gateways, or subscription-based access control will be implemented. Access will be managed manually during the demo phase.
* **Web User Interface:** No web-based dashboard or control panel will be developed. All end-user interaction will occur exclusively via Telegram.
* **User-led Customization:** Users will not be able to add, remove, or suggest influencers through the bot interface. The source list will be managed internally.
* **Support for Other Platforms:** Analysis will be strictly limited to X (Twitter) and Reddit.

#### **MVP Success Criteria**
* The entire workflow, from data collection to Telegram notification, must operate autonomously without manual intervention.
* The reports generated in the private group must contain all defined elements (summary, sentiment, probability, etc.) and be consistent with the collected data.
* The system must demonstrate operational stability over a one-week test period.

## Post-MVP Vision

#### **Immediate Post-MVP Priorities**
These are the features planned for development **immediately after** the successful validation of the demo phase. They represent the next logical step and are the top priority for evolving the bot into a commercial service.

* **Subscription Model Implementation:** Develop a complete subscription management system, including payment gateway integration (e.g., Stripe), a self-service portal for users, and automated access control to the private Telegram group.
* **Data Source Customization:** Allow paid subscribers to add a limited number of influencers or subreddits to their personal tracking list.

#### **Long-Term Vision (1-2 years)**
* Evolve the bot from a narrative detection tool into a **comprehensive market intelligence platform for the retail investor**.
* Introduce **different subscription tiers**, offering a range from basic report access to premium levels with deeper analysis or real-time alerts.

#### **Expansion Opportunities**
* **Platform Expansion:** Extend analysis to other niche platforms relevant in the crypto space, such as Farcaster or Lens Protocol.
* **Market Expansion:** Adapt the narrative analysis engine to identify trends in other speculative markets, like "meme stocks."

## Technical Considerations

#### **Platform Requirements**
* **Target Platform:** The solution will be a Telegram bot.
* **Performance Requirements:** The system must process data and send notifications in a timely manner, with cron jobs completing reliably within their defined intervals.

#### **Technology Preferences**
* **Primary Language:** TypeScript.
* **Framework/SDK:** The Telegram bot will be built using the **official Telegram SDK**.
* **Database:** SQLite.
* **AI Services:** Internal APIs for data collection and analysis.
* **Hosting Infrastructure:** The bot will be deployed on a cloud server.

#### **Architecture Considerations**
* **Repository Structure:** A monorepo is suggested to manage the code for the different agents (collector, analyzer, notifier) centrally.
* **Service Architecture:** The system will be composed of decoupled modules communicating via the SQLite database.
* **Integration Requirements:** The system must securely integrate with the Telegram API and the internal data collection and analysis APIs.

## Constraints & Assumptions

#### **Constraints**
* **Technical:** There are no significant technical constraints regarding the choice of libraries or development tools, provided they are compatible with the primary tech stack (TypeScript, SQLite, Cloud Server).

#### **Assumptions**
* **Internal API Access:** Continuous and uninterrupted access to the internal data collection and analysis APIs is assumed. The bot's operation is entirely dependent on the availability and performance of these services.
* **Unlimited API Consumption:** It is assumed there will be no technical limitations (like usage caps or rate limits) on the consumption of internal APIs that would prevent the required analyses during the demo phase.
* **Quality of Source Data:** It is assumed that the data provided by the collection API will be of sufficient quality for the analysis engine to extract coherent narratives and sentiments.
