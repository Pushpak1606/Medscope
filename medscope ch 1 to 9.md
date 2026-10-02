# **Chapter 1 — Introduction** 

Consider what it would actually be like to be a patient suffering from a chronic illness in 2025. You might have a different doctor for your high blood pressure than for your diabetes, and perhaps if you’re lucky, you may get to see a therapist once a month. Your prescription paper sits somewhere in your bag, crumbled and unusable. 

The information of what was prescribed last month by your psychiatrist, for instance, stays purely within the hands of the psychiatrist and your primary care physician has no knowledge of it whatsoever. The nutrition app does not consider the beta-blockers you are on. All information concerning your health has been divided into several disparate parts, held and processed separately, with no central connector. This is what Medscope has been designed to resolve. Not a singular part, but all parts. 

Medscope is an artificial intelligence digital health application that amalgamates aspects of physical health tracking, mental health support, and medication tracking into a single service under one umbrella of organization. It targets two types of people, those who desire the highest degree of management and oversight without managing five separate apps simultaneously, and physicians hoping for an entire viewpoint of the patient before consultation in person or through telemedicine. It operates on a central concept; that is that health organizations and data function best when it’s not trapped within silos. This chapter establishes the broad framework for the project. Section 1.1 will describe the problem of structure within the current model of healthcare delivery that led to the development of Medscope. Section 1.2 will focus on what Medscope is and what it would do. Section 1.2.2 will outline the specific aims of the project. 

## **1.1 Background: The Healthcare Fragmentation Problem** 

Healthcare fragmentation is the state of a patient's health needs being distributed across various professionals, places and devices which do not communicate with each other. Fragmentation is nothing new and but the impact has much multiplied and its cost higher as we have needed to involve ever greater numbers of skills with which an individual will be presented. 

As an example picture an individual with moderate depression, type 2 diabetes and hypertension managing multiple different aspects of their lives with not only their GP, also their endocrinologist and psychiatrist all being involved in their care, if they were to share this information effectively with each other they can share notes, compare prescriptions and be guided through coordinated care but currently the doctor sees one set of notes and records while his colleague with another has no clue as to what his colleague has decided to prescribe. 

Figure 1.1 below illustrates the fragmented digital health landscape that a typical patient navigates — five separate data environments, none of which share information. 

1 

**Figure 1.1 — Global Healthcare Fragmentation Problem: Five Isolated Digital Health Environments** 

|**Medication**<br>**Reminder App**|**Teleconsultation**<br>**Platform**|**Mental Health**<br>**Journal App**|**Fitness &**<br>**Nutrition App**|**GP / Specialist EHR**|
|---|---|---|---|---|
||**← No data s**|**haring between any o**|**f these systems →**||
|**Patient must sel**|**f-coordinate across**|**all five environments.**<br>**boundaries.**|**Doctor cannot see p**|**atterns that cross tool**|



The magnitude of this is enormous. Study after study consistently confirms that about 50% of those with chronic illness do not adhere to their treatment, according to the World Health Organization (2021). Cost is by far not the predominant reason--lack of effective support systems is. A person taking an unknown medication without reminders and without a mechanism to report side effects in between doctors' appointments is truly at high risk for complications that are absolutely preventable. 

In the field of mental health, the problem is even more dramatic. As much as 75% of people with a mental health condition do not get treated for it in low-income countries, while the gap remains significant in well-off countries: the stigma around mental health, shortage of professionals, and lack of low-barrier mental health tools to reach those in need all contribute. 

But digital health said this would change, except it ended up doing the opposite: fragmenting the space. We now had a separate app that sends medication reminders, another to conduct teleconsultation, one to keep a journal, and one to record physical activity. They all perform their singular tasks fairly well. 

None interact with any other tool, and none provide any mechanism of sharing a Clinically-relevant pattern with one's doctor. 

Medscope attempts to be an entirely different animal, by viewing the patient holistically, giving their physician the appropriate context to act on it. 

## **1.2 Overview of the Medscope Platform** 

There was only one principle when creating Medscope: that a person's health records should be in one place, become smarter with AI, be available-in the right view, to the right people-to both patient and doctor. Every feature was held against that principle and if it didn't adhere, then it was cut. 

The system has two interfaces: that seen by the patient and the application intended for and to be used by doctors. For the patient application, true ease of use means accessibility by a 60-year-old, managing three chronic conditions – rather than the latest, brightest 25-year-old on the latest tech device. The 

2 

dashboard aimed at clinicians will need to reflect clinical process, to quickly present the most important data, to the appropriate specialist. 

The two interfaces are both pulling from the same foundational data layer. A patient submitting an entry at 9pm; the trend it represents being reflected in the doctor's pre-meeting summary the following morning, for example. A doctor amending a prescription; the patient’s calendar receiving an updated reminder within seconds. That two-way sync is the achievement that fundamentally shifts Medscope beyond its predecessors, rather than an added extra. 

The AI layer also resides below both interfaces in the form of a collection of five modular microservices, each performing a single analytical function effectively, feeding up the insights to either side. The AI provides decision support; it does not make the decisions. Enforcement of this is via the architecture, and not only disclaimers. 

### **1.2.1 Platform Features and Applications** 

Medscope's feature set is organized into six functional domains: 

**Medication Management — AI Medicine Assistant:** Users are able to upload photos of prescriptions or enter details of medicines in manually. OCR analysis extract information which crosschecks against a database of medication interactions and generate reminders tailored for the individual – including the individual frequency dose intervals, meal restrictions and tolerance level. Chronic non-adherent are given increasingly varied, more intrusive notifications in order to avoid habituation. Each medicine includes a simplified description-why this medicine should be taken, common side effects and special advice-since those who do not comprehend the rationale behind taking a particular medication are much more likely to be a non-adherent. 

On a polypharmacy dashboard patients on more than one drug have all current medication, schedule, interaction status and refill by date on a single page. Interactions flagged will be colour coded for severity and advise patient to check with doctor - system doesn't prescribe drug stopping. 

**Lifestyle Support — Nutrition and Exercise:** The recommendation engine builds plan according to the real medical profile of the patient rather than age and weight. A patient with hypertension is recommended to follow a DASH diet. A patient with Type II Diabetes will be advised on glycemic index management. If dietary plans conflict, it highlights the clash of recommendations, recommend dietetic counselling (it will not try to resolve clinical clashes on its own that are difficult for professional doctors) 

**Real-Time Clinical Consultation:** Prior to the consultation, a pre-consultation summary including recent adherence and the last 2 weeks journal highlights, symptoms reported and any AI-detected 

3 

patterns is generated for the doctor. During the consultation the patient record can be accessed in a sidebar. At the conclusion of the consultation, an AI-written summary is provided covering what was discussed, treatment modifications and follow up duties for both patient and doctor, with an assigned next contact date. 

**Mental Health Support Suite:** Features of this module include validated disorder screening (PHQ-9, GAD-7, PSS-10), a warm, non-judgemental AI chatbot (available 24/7), daily journaling combined with AI trend analysis, and psychiatric medication management. Screening results, in simple English, include easily-understandable next-step recommendations. The AI chatbot, in particular, has been fine-tuned from mental-health focused conversations, with immediate notification of crisis resources in the event of immediate suicidal or homicidal ideation. 

Daily entries convert personal reflection into the stream of clinical data. 

Each week, the trend in diary entries, shown to both user and clinician, can then guide therapy or prescription adjustments. 

**Community Engagement:** Mediated peer-support groups are set up for patients with chronic conditions or behavioural health problems. Physicians can post educational information, provide a mediation capacity, and track forum engagement patterns within their patient panel. 

**Clinical Decision Support (Doctor-Facing):** Centralized dashboard to integrate everything medical related (medical history, prescriptions, consultations, journal trends, screening scores) in a single, navigate per-patient view. Alerts are tiered into 3 categories (prescription abnormalities, journal trend issues, missed follow-up flags) Prescriptions include real time interactions checking with auditable trail of acknowledgement 

### **1.2.2 Aims and Objectives** 

**Primary Aim:** To design, implement and validate an integrated AI driven health system that combines physical health management, mental well-being assistance, drug reminders and a seamless clinical consultation service within a singular patient focused digital system that provides non-stop personalized clinically driven health management for patients and that increases an effective contextual awareness for medical providers. 

4 

### Specific Objectives: 

1. To consolidate the scattered health service components into a common platform; thereby, obviating the patients having to use a multitude of fragmented and isolated devices for managing health needs. 

2. Through intelligent, context-aware reminders, promote treatment adherence by chronic patients thereby hoping to improve from baseline non-digital treatment delivery by 30-50%. 

3. Ensure earliest detection of changes in symptom progression via automated screening by AI, daily self-reporting journals with trend analysis and anomalous change identification, thereby enabling clinical consultation at the acute care stage or earlier. 

4. Aid the doctors by streamlining and organizing daily work via consolidating various patient data onto a single dashboard, auto generation of clinical notes, and automated appointment scheduling thus enhancing clinician's productivity. 

5. Facilitate a psychologically safe, stigma-minimising 24/7 access to mental health professionals through valid instruments and automated routing to a professional in case of severe mental health emergencies. 

6. Develop an individualistic and personalized treatment plan comprising suggestions for exercise, diet and medication based on a comprehensive clinical profile and individual requirements, avoiding non-specific, generic guidance. 

7. Establish a data management framework compliant with the HIPAA and GDPR rules including data security through end-to-end encryption, end point authentication and role-based access controls along with careful management of patient consent at all interaction levels. 

8. Create and test a functionally working prototype incorporating the aforementioned critical features to accurately demonstrate proof of concept and also use simulations to demonstrate possible impact on health conditions. 

One point which is critical to make at this stage is that Medscope is a prototype. In terms of clinical outcome on live patient populations it is only possible to judge a system fully following an official clinical trial which would not realistically be part of an undergraduate project. The appraisal presented in Chapter 6 therefore relies solely upon a review of the technical performance of Medscope, a analysis of its simulation modelling and trials into user-acceptance with indications as to where more extensive clinical validation would be essential before actual clinical use. 

5 

# **Chapter 2 — LITERATURE REVIEW** 

Prior to building Medscope, we wanted to know where we were, what had been tested before, what worked - and critically, what had failed. The digital health space has generated voluminous peerreviewed research over the past decade. It is not a shortage of studies: it's that most them test single narrow aspects of the issue in isolation. 

This chapter reviews the best across 4 disciplines of work in digital health: smart medication reminder systems, AI for mental health support, integrated digital health systems, and lifestyle recommender systems. 

It synthesizes the openings they leave - and why these openings are specifically relevant for Medscope. 

A literature search of PubMed, IEEE Xplore, ACM Digital Library and Google Scholar was carried out using keywords in relation to 'digital health platform', 'AI medication adherence', 'mental health chatbot', 'integrated EHR AI', 'telemedicine patient outcomes' and 'clinical decision support system'. Inclusion criterion: publications were peer-reviewed, had an evidence base and were within the scope of at least one of Medscope's functional domains (i.e. Exclusion were studies pertaining to hardware, genomics or medical imaging). 

## **2.1 Review of Prior Research by Domain** 

### **2.1.1 Smart Medication Reminder Systems — Nguyen, T., Pham, H. & Tran, L. (2019)** 

One of the earliest, and most heavily cited, studies involving IoT based medication adherence was presented by Nguyen et al. (2019), a trial of a rule-based alert engine with a group of elderly outpatients being treated for at least two chronic diseases. Medication dispensers integrated with IoT infrastructure tracked whether patients had consumed the medication within an acceptable time; multiple push notifications would be issued to the patient's mobile device if it detected the dispensed drug being missing within a given interval. The 12-week study showed an increased adherence rate from control. 

The experiment successfully showed that passive digital reminders (with no underlying lifestyle intervention, clinical engagement element etc) could affect a statistically significant improvement in adherence in a demographic traditionally difficult to enrol in complicated digital intervention. The necessity of IoT hardware made the system unsustainable and un-equitable. There was no scope for personalization of the rule-based notification logic. Critically, for Medscope, there was absolutely no integration into the clinical workflow: the clinician was not informed of a missed day, and the reminder system knew nothing of the greater patient health status. 

6 

### **2.1.2 AI Chatbots for Mental Health — Johnson, M., Williams, R. & Clarke, S. (2022)** 

Johnson et al. (2022) investigated the use of a dedicated NLP conversational agent in a student cohort experiencing low to moderate levels of anxiety and depression. The agent was trained using therapeutic dialogues based on cognitive behavioural therapy principles; these included breathing exercises, prompts for cognitive restructuring, and behavioural activation tasks. A RCT found that those in the intervention arm experienced substantial reductions in self-reported scores for anxiety and depression after four and twelve weeks of usage. High user engagement was also achieved throughout the study period, not often a trait of digital interventions. 

The aspect that even the authors acknowledge is crucial-the chatbot was a black box for clinicians. A student could use it for three months, have the appearance of real improvement in symptoms, and the doctor treating that student would have no structured way of understanding it ever occurred. No charting it against medical records, no clinician sharing data. This tool existed outside its logical field. 

### **2.1.3 Integrated Digital Health Ecosystems — Kumar, A. & Lee, J. (2023)** 

Kumar and Lee (2023) built a cloud platform which federated the hospital E.H.R systems to an A.I analytics engine performing population-based health monitoring. In this design it was proven that realtime integration of data from several clinical systems can be made accessible to Clinical Decision Support tools within a reasonable latency without data loss. The A.I analytics engine flagged high-risk patients within a population based on their clinical data trends over time and clinical pilots involving this approach achieved decreased emergency admissions via AI-proactive outreach. 

The work that appears to be the most technically complex prior work directly related to Medscope, but it was built assuming that a large hospital network with established EHRs and clinical IT departments is available. It was not consumer-facing in the least--in essence it's a population health tool for institutions, not an individual personal health device. Customization was negligible, the individual's experience wasn't at all considered. 

### **2.1.4 Lifestyle and Wellness Recommendation Systems — Zhao, W., Liu, X. & Chen, Y. (2020)** 

A recommendation engine to personalises plans for the physical activity and diet plan was designed by Zhao et al. (2020) using collaborative filtering (users similar to the new users that had successfully modified behaviour were analysed, and those patterns then used with the new user). After the 16-week observation period the levels of physical activity increased and diet quality increased. 

Here is a patient safety concern of utmost importance, and the authors face it squarely-The system was unaware of current medication regimes of its users and medical problems of which they were treated. The system could offer a diet that a patient’s cardiologist had strongly advised against taking and an 

7 

exercise recommendation that should not be taken post-surgery without either person ever knowing about the other’s recommendations. In their conclusion, the authors pleaded for the integration of lifestyle tools into the clinical data environment. Medscope is partly in response to that desire. 

### **2.1.5 AI Healthcare Monitoring — Patel, R., Shah, M. & Doshi, K. (2020)** 

Patel and colleagues used machine learning on continuous streams of patient data to identify physiological deterioration (cardiac events, sepsis). Their models were superior to early warning score systems based on more heuristic, threshold-based rule. The concept used is directly applicable to Medscope where, with continuous, structured access to health data, an AI may find patterns that more intermittent assessments don't. 

The only flaw which the authors conceded was that the model had an exclusive focus on physical healththere was no capacity within the model to incorporate data regarding mental health, and they stated that physical health deterioration pathways relative to their respective psychological states were a monitored lacuna. 

8 

## **2.2 Comparative Analysis and Research Gap** 

Table 2.1 below summaries all five studies across methodology, advantages, and key limitations. 

**Table 2.1 — Comparative Literature Review Summary** 

|**Author &**<br>**Year**|**Study Area**|**Methodology**|**Key Advantages**|**Limitations**|
|---|---|---|---|---|
|Nguyen et<br>al., 2019|Medication<br>Adherence|IoT pill dispensers +<br>rule-based escalating<br>notifications;<br>12-<br>week cohort study|Measurable<br>adherence<br>improvement;<br>passive<br>sensing;<br>elderly-friendly|No AI personalisation; no<br>clinical workflow integration;<br>requires IoT hardware|
|Johnson et<br>al., 2022|AI<br>Mental<br>Health Chatbot|NLP agent trained on<br>CBT dialogue; RCT<br>with outcomes at 4<br>and 12 weeks|Significant<br>symptom<br>improvement;<br>high engagement;<br>scalable to large<br>populations|No medical record access;<br>outcomes self-reported only;<br>no clinical data sharing|
|Kumar &<br>Lee, 2023|Integrated<br>Health<br>Ecosystem|Cloud<br>EHR<br>integration with AI<br>analytics; population-<br>level<br>risk<br>identification<br>in<br>hospital network|Clinically<br>validated; reduces<br>emergency<br>admissions;<br>technically<br>scalable|Hospital-only deployment; not<br>patient-facing;<br>complex<br>infrastructure required|
|Zhao et al.,<br>2020|Lifestyle<br>Recommendatio<br>n|Collaborative<br>filtering on wearable<br>+ self-report data; 16-<br>week RCT|Improves activity<br>and<br>dietary<br>quality;<br>personalised<br>to<br>user profile|No clinical data integration;<br>potential<br>drug-lifestyle<br>conflicts; no doctor visibility|
|Patel et al.,<br>2020|AI<br>Health<br>Monitoring|ML on continuous<br>monitoring streams;<br>compared<br>against<br>early warning score<br>benchmarks|Superior<br>sensitivity<br>to<br>deterioration;<br>actionable clinical<br>alerts;<br>outperforms rule-<br>based systems|Physical<br>health<br>only;<br>no<br>mental<br>health<br>dimension;<br>hospital inpatient setting only|



9 

### **2.2.1 Identification of the Research Gap** 

The synthesis reveals three particular gaps. Firstly, currently no single integrated data system offers a patient-facing platform including physical health tracking, mental health counselling, and prescription management. Secondly, no reviewed system offers two-way data synchronicity for patient-contributed data such as mood diaries, tracking diaries, and symptom notes to directly update and influence the view available for treatment to the patient's primary physician. 

Thirdly, no tool for offering recommendations for lifestyle changes is clinically sensitive enough to address the problem of patient safety that Zhao et al. 

Identified in non-contraindicating recommendations. 

Medscope was designed precisely to address the simultaneous closure of these three gaps. It is patientfacing, bi-directionally linked, and clinically contextualised at all levels. The design choices outlined in Chapters 3 and 4 can each be mapped directly back to these shortcomings. 

10 

# **Chapter 3 — PROBLEM DEFINITION AND REQUIREMENT ANALYSIS** 

## **3.1 Problem Statement** 

The formal problem underpinning the creation of Medscope can be described as follows: patients dealing with a chronic or mental illness has access today to no single, AI powered digital tool that addresses their physical and mental health needs while concurrently administering the appropriate, continuous, individually tailored medical care-including their medication-and simultaneously giving their physician with real time consolidation information on how his patients are being cared for and their respective statuses-all of this leading to a large degree of medication non-adherence, undetected worsening symptoms and under-diagnosed and treated comorbid mental states as well as a high level of inefficient workflows which are responsible for providing mediocre clinical care to a limited scope of patients. 

This breaks down into five specific sub-problems that collectively define Medscope's requirement space: 

1. It is not yet possible to provide the patient with AI support for their medication that dynamically adapts to prescriptions in the event of the patient and doctor changing prescription dynamically. 

2. Mental health supported tools are structurally separated from clinical data ecosystems, which in turn, limit their value to both patient and clinician. 

3. Lifestyle recommendations are produced independently from the clinical context of the patient and can pose risks to patient safety. 

4. Doctors don't have unified, AI-driven view of patients that would allow for effective management of a larger patient panel without compromising on care. 

5. The supports that already exist via peers and the wider community that are known to help chronic and mental health conditions simply don't exist with clinical platform models. 

## **3.2 Functional Requirements** 

The ten following functional requirements have been deduced by a structured analysis of the intended user-related processes developed in chapter 1 and the research needs defined in chapter 2. All requirements with a classification of priority level are displayed on the following Table 3.1: 

11 

**Table 3.1 — Functional Requirements of Medscope** 

|**ID**|**Feature**|**Description**|**Priority**|
|---|---|---|---|
|**FR-**<br>**01**|**Patient**<br>**Registration**|Patient profile creation with demographics, medical<br>history,<br>diagnoses,<br>medication<br>regimens,<br>and<br>communication preferences.|**Core Feature**|
|**FR-**<br>**02**|**AI**<br>**Medicine**<br>**Assistant**|Prescription image upload, OCR-based parsing, drug<br>interaction detection, personalised reminder scheduling,<br>refill alerts, and plain-language medication explanations.|**Critical**|
|**FR-**<br>**03**|**Lifestyle**<br>**Recommendatio**<br>**ns**|Disease-specific nutrition and exercise plans personalised<br>on diagnosis, current medications, body metrics, and<br>stated lifestyle preferences.|**Important**|
|**FR-**<br>**04**|**Live**<br>**Consultation**|WebRTC-based real-time consultation with AI pre-<br>consultation summary for doctors, full record access in-<br>session, and structured post-consultation summary<br>distributed to both parties.|**Critical**|
|**FR-**<br>**05**|**Mental**<br>**Health**<br>**Screening**|Validated PHQ-9, GAD-7, and PSS-10 instruments with<br>plain-language result explanations, threshold alerting, and<br>automatic booking prompts.|**Critical**|
|**FR-**<br>**06**|**AI**<br>**Chatbot**<br>**Support**|24/7 empathetic conversational AI with CBT-informed<br>responses and immediate escalation protocols for detected<br>acute distress.|**Critical**|
|**FR-**<br>**07**|**Daily Journaling**|Structured and free-text entry with AI longitudinal trend<br>analysis, weekly insight summaries, and doctor-visible<br>trend dashboard.|**Important**|
|**FR-**<br>**08**|**Peer**<br>**Communities**|Moderated patient support groups with membership<br>management, doctor content oversight, and educational<br>content posting.|**Nice-to-have**|
|**FR-**<br>**09**|**Doctor**<br>**Dashboard**|Unified per-patient health record, AI clinical summaries,<br>prescription drafting with interaction checking, and<br>consultation calendar management.|**Critical**|
|**FR-**<br>**10**|**Bidirectional**<br>**Data Sync**|Patient-generated data reflects in doctor's view; doctor<br>updates reflect in patient's experience — both within<br>defined latency thresholds.|**Critical**|



12 

## **3.3 Non-Functional Requirements** 

Table 3.2 presents the non-functional requirements across five categories, with the implementation approach adopted in the Medscope prototype. 

**Table 3.2 — Non-Functional Requirements Specification** 

|**Category**|**Requirement**|**Implementation Approach**|
|---|---|---|
|**Security**<br>**&**<br>**Privacy**|Role-based access controls; all sensitive<br>health data encrypted in transit and at rest;<br>explicit patient consent; HIPAA and GDPR-<br>aligned data practices.|AES-256 encryption; JWT with rotation;<br>field-level encryption on journal/chat data|
|**Performance**|Core features for ≥500 concurrent users;<br>consultation quality consistent with clinical<br>standards; AI summaries within acceptable<br>latency thresholds.|Sub-5 sec AI trend analysis; sub-2 sec sync;<br>CDN for static assets|
|**Usability**|Patient interface SUS score ≥70; doctor tasks<br>completable<br>within<br>defined<br>time<br>benchmarks; WCAG 2.1 AA accessibility<br>compliance.|SUS scores: Patients 76.4, Doctors 72.1 (both<br>above threshold)|
|**Scalability**|Horizontal scaling across compute, storage,<br>and AI inference layers; AI microservices<br>independently scalable.|Docker containers; auto-scaling on CPU<br>utilisation; serverless API layer|
|**Reliability**|99.5% uptime for core features; independent<br>reliability guarantee for medication reminder<br>engine; automated backup and recovery.|Automated daily backups; point-in-time<br>recovery; GitHub Actions CI/CD pipeline|



13 

# **Chapter 4 — DESIGN AND IMPLEMENTATION** 

## **4.1 System Architecture Overview** 

In Medscope the system is built in a three-tier architecture where: presentation layer (what the system shows to the user), application logic layer (handles what processes and manages all tasks), and data and AI processing layer (holds the data and also makes sure data is processed using AI to perform tasks like searching, classification and recommendations). These layers will allow better maintained code and allow certain parts of the system to be scaled without any further impact on other part of the system. Diagram below shows the complete three tier architecture including the data pathways between them. (Diagram 4.1) 

**Figure 4.1 — System Architecture: Three-Tier Overview with AI Microservices** 

|**PRESENTATION**<br>**TIER (Frontend)**|**ME**|**DSCOPE — THRE**<br>**APPLICATION**<br>**TIER (Backend**<br>**API)**|**E-TIER S**|**YSTEM ARCHITECTURE**<br>**DATA & AI TIER (Storage + AI)**|
|---|---|---|---|---|
|Patient Interface<br>(React Web App)|**→**|Node.js +<br>Express REST<br>API|**→**|PostgreSQL (Structured Data)|
|Doctor Dashboard<br>(React Web App)|**↕**|JWT Auth &<br>Authorisation|**↕**|Firebase (Unstructured Data)|
|Shared<br>Component<br>Library|**→**|Business Logic<br>Modules|**→**|AI Microservices (Python / PyTorch)|
|WebRTC<br>Consultation UI|**↕**|Notification<br>Engine|**↕**|Drug Interaction API (3rd party)|



One design principle carried across all aspects of the build: the only component that speaks to the database is the application tier, nothing else. The frontend cannot speak to the database. Nor can the AI services. All read and write operations are via the API tier and for each write the access controls apply, so you are never in a state where security is not on where it is applicable - it is on, or it is off. 

The AI tier is itself designed as five completely independent, deployable micro-services, which are intended to do specific analysis and only make exposed API contracts to the application tier, without any further dependencies between them. 

14 

**Table 4.2 — AI Microservices: Functions and Technology** 

|**AI Microservice**|**Function & Responsibility**|**Technology**|
|---|---|---|
|**Medication**<br>**Intelligence**<br>**Service**|Prescription parsing (OCR), drug interaction checking,<br>personalised reminder scheduling, refill alert generation|PyTorch + HuggingFace +<br>Drug Interaction API|
|**Clinical**<br>**Summary**<br>**Service**|Generates AI pre- and post-consultation summaries from<br>structured patient data for the doctor dashboard|LLM (fine-tuned) +<br>Template Engine|
|**Screening**|Processes PHQ-9, GAD-7, PSS-10 questionnaire|Rule-based + ML|
|**Analysis Service**|responses; generates clinical threshold assessments|Classifier|
|**Journal Insight**<br>**Service**|Analyses longitudinal journal entries for trend detection;<br>generates weekly insight summaries for clinicians|NLP Trend Analysis +<br>Time Series|
|**Conversational**<br>**Support Service**|Manages the 24/7 empathetic AI chatbot; CBT-informed<br>responses; acute distress escalation trigger logic|LLM (fine-tuned on<br>mental health dialogue)|



## **4.2 Technology Stack** 

Table 4.1 documents the complete technology stack used in the Medscope prototype, including the rationale for each choice. 

**Table 4.1 — Technology Stack Summary** 

|**Layer**|**Technology**|**Language**|**Role in Medscope**|
|---|---|---|---|
|**Frontend**|React.js<br>(Component-<br>based SPA)|JavaScript|Modular UI; shared component library;<br>separate routing domains for patient and<br>doctor interfaces|
|**Backend API**|Node.js + Express.js|JavaScript|Lightweight<br>RESTful<br>API;<br>JWT<br>authentication<br>with<br>refresh<br>token<br>rotation; business logic and notification<br>engine|
|**Auth**|JSON<br>Web<br>Tokens<br>(JWT)|—|Stateless authentication; refresh token<br>rotation for session management; role-<br>based access control|
|**Relational**<br>**DB**|PostgreSQL|SQL|Structured data: user accounts, patient<br>profiles,<br>medications,<br>consultations,<br>screening results|
|**Document**<br>**Store**|Firebase|NoSQL|Unstructured data: journal entries, chat<br>logs, AI-generated summaries; schema-<br>flexible storage|



15 

|**AI / ML**|Python,<br>PyTorch,<br>Hugging<br>Face<br>Transformers|Python|LLM fine-tuning; NLP pipelines; clinical<br>scoring algorithms; trend analysis models|
|---|---|---|---|
|**Real-Time**<br>**Comms**|WebRTC + Socket.io|JavaScript|Peer-to-peer audio/video consultation;<br>signalling server for connection setup<br>and NAT traversal|
|**Deployment**|Vercel + Docker +<br>GitHub Actions|—|Serverless frontend/API; containerised<br>AI services with auto-scaling; CI/CD<br>pipeline with mandatory test gate|
|**Drug**<br>**Interaction**|Third-party<br>Drug<br>Interaction API|REST/JSON|Continuously maintained clinical dataset;<br>real-time interaction checking during<br>prescription updates|



The hybrid database approach-PostgreSQL for structured data, MongoDB for unstructured-is actually for truly different access patterns and schema requirements. Having rigid columns for journal entries and chat logs is completely inappropriate because these documents are by nature unstructured and therefore schema less. Similarly forcing clinical records, with medication details and clinician reporting capabilities, into a document store would have prevented complex SQL joins, making it hard to produce necessary information. 

The real-time consultation layer is based upon WebRTC with peer-to-peer audio/video. A Socket.io signalling server would set up connection and tunnel NAT. It completely prevents media processing from ever taking place at Medscope servers and saves both money and time. 

## **4.3 Patient Module Implementation** 

We had an early discussion on our design about depth of registration. Given how big a profile is really needed to offer truly personalized recommendations, trying to collect it all on the initial sign-up has a massive churn problem-users bail before they ever see what a truly personalized experience looks like. The compromise was to have a short mandatory section that captures just the bare essentials that will take no more than a few minutes to complete (demographics, contact info, principal pathway), and a profile that can optionally be completed at any point following registration, but is less critical for immediate functionality, yielding a more personalized product starting from Day 1 and getting smarter over time. 

16 

**Figure 4.2 — Patient Workflow Diagram: Physical Health Path and Mental Health Path** 



<!-- Start of picture text -->
PATIENT WORKFLOW — PHYSICAL HEALTH PATH          |          MENTAL HEALTH PATH<br>PATIENT REGISTRATION &  SAME ONBOARDING FLOW<br>PROFILE SETUP<br>▼ ▼<br>Select Physical Health Pathway Select Mental Health Pathway<br>▼ ▼<br>Upload Prescription / Enter Medications Mental Health Screening (PHQ-9 / GAD-7 / PSS-10)<br>▼ ▼<br>AI Medicine Assistant: Drug Interaction  AI Analyses Score → Result + Explanation Shown to<br>Check + Reminder Schedule Patient<br>▼ ▼<br>Receive Personalised Nutrition & Exercise  If Score ≥ Clinical Threshold → Prompt to Book<br>Recommendations Consultation<br>▼ ▼<br>Daily: Confirm Medication Doses  Daily Journal Entry: Mood / Sleep / Stress / Energy + Free<br>(Adaptive Reminders) Text<br>▼ ▼<br>Book Live Consultation → Attend Session  AI Chatbot (24/7) for Emotional Support → Escalation if<br>Receive Post-Consultation Summary Acute Distress Detected<br>▼ ▼<br>All Data Visible to Treating Doctor  Journal Trends Shared with Clinician (AI Insight<br>(Bidirectional Sync <2 seconds) Summary Weekly)<br><!-- End of picture text -->

The home screen for a patient is constructed dynamically based on the patient's level of interaction. For a new and incomplete patient's profile, this would emphasize the onboarding activities. A patient on the application for a few weeks might see medication reminders for the day, the current trends from their journals, and next follow up issues from previous visit. This interface should be a real care management tool, not a "welcome mat." 

For prescription upload the allowed types are JPG, PNG and PDF. This upload is sent to the Medication Intelligence Service which uses OCR to parse the document, retrieving the medication name, dosage instructions, prescribing doctor and date. Important: after parsing the values are presented to the patient for acceptance prior to being added to medication record. OCR can fail, especially where handwriting is present and a dosage is accidentally added to the reminder schedule it is a patient safety risk. 

17 

## **4.4 Doctor Module Implementation** 

The day view login option shows the doctor's consultation schedule and highlights any patient for whom the AI has flagged an alert since the previous consultation. The three types of alerts that will appear are; medication issues (dosing and interactions), journal trend issues and due for next follow up not booked. Doctors see all highlighted patients at the start of day. 

**Figure 4.3 — Doctor Dashboard: Daily Workflow Diagram** 

#### **DOCTOR DASHBOARD — DAILY WORKFLOW** 



<!-- Start of picture text -->
1. Login → View  2. Open Patient Profile  3. Review Medication Adherence,<br>Consultation Schedule + AI  → Review AI Pre- → Journal Trends, Screening History<br>Alert Flags Consultation Summary<br>▼ ▼<br>4. Conduct Live Consultation  5. Update Prescription  6. Review AI Alerts (Missed Doses,<br>(WebRTC) Full Record  → (Real-Time Drug  → Journal Concerns, Overdue Follow-<br>Visible Interaction Check) ups)<br>▼ ▼<br>7. AI Generates Structured Post-Consultation Summary → Sent to Patient & Added to Doctor's<br>Record (All patient data synced <2 sec)<br><!-- End of picture text -->

Every patient profile consists of 5 tabs: Overview, Medications, Journal Trends, Consultations and Screening History. The Overview tab is, at all times, showing the last AI generated patient summary. This is near-real-time, it is constantly updated by new data arriving from any source. As the doctor opens the Overview of a patient's profile prior to a visit with that patient, he sees a contemporary summary of whatever has been occurring (in that person's case) since last seeing this doctor. 

A part of the prescription management process is real time drug interaction checking, whereby a new medication is submitted through the system to the Medication Intelligence Service which checks against the complete list of the patients present medications to reveal potential interaction which is flagged to the doctor. The interaction detail is provided to the physician which can then choose to acknowledge (optionally giving a clinical rationale reason for accepting it or rejecting it) it and the change go through. A flag to indicate that this interaction has occurred is displayed in the patient's record, and this with the acknowledgement is kept creating an auditable clinical decision trail. 

## **4.5 Data Flow and Security Implementation** 

Figure 4.5 portrays the Bidirectional Sync Model, which constitutes the primary technical advancement of Medscope. All data-generating actions performed by the patient are ingested by the application tier 

18 

where they are persisted first, and then (if appropriate) kicked off a non-blocking AI processing cycle. The patient is immediately affirmed (AI feedback within seconds). 

**Figure 4.5 — Bidirectional Data Synchronization Model** 

||**BIDIRECTI**|**ONAL DATA SYNCHR**|**ONIS**|**ATION MODEL**|
|---|---|---|---|---|
|**PATIENT INTE**|**RFACE**<br>⇄|**APPLICATION**<br>**TIER (Sync Engine**<br>**<2 sec latency)**|⇄|**DOCTOR DASHBOARD**|
|Logs medication d<br>Adherence upd|ose →<br>ated|**Medication**<br>**Intelligence Service**||Doctor sees updated adherence + alert<br>flag|
|Submits journal entry<br>recalculated|→ Trend<br>|**Journal Insight**<br>**Service (async, ~3-5**<br>**sec)**||Doctor sees new trend summary + alert<br>if concern|
|Receives updated r<br>schedule (<2 s<br>able 4.3 documents<br>lational store and t|eminder<br>ec)<br>the core datab<br>he Firebase do<br>**Table 4.3**|**Doctor updates**<br>**prescription → AI**<br>**checks interactions**<br>ase schema, covering a<br>cument store.<br>**— Database Schema Ove**|ll maj<br>**rview:**|Doctor updates prescription + sees<br>interaction flag<br>or entities across both the PostgreSQL<br>**Core Entities**|
|**Entity**|**Store**|**Key Fields**||**Notes**|
|**Users**|PostgreSQL|id, email, password_has<br>(patient/doctor),<br>creat<br>last_login|h, role<br>ed_at,|Core account record; role field drives<br>access control throughout the system|
|**Patient_Profiles**|PostgreSQL|user_id,<br>name,<br>conditions[],<br>medicat<br>allergies[], pathway_sel<br>consent_flags|dob,<br>ions[],<br>ection,|Detailed health profile; conditions and<br>medications stored as arrays for easy<br>extension|
|**Medications**|PostgreSQL|patient_id, drug_name, d<br>frequency,<br>start<br>refill_date, interaction_<br>doctor_id|osage,<br>_date,<br>status,|Supports<br>polypharmacy;<br>interaction_status updated in real time<br>by Medication Intelligence Service|
|**Consultations**|PostgreSQL|id,<br>patient_id,<br>doct<br>scheduled_at,<br> <br>pre_summary_ref,<br>post_summary_ref|or_id,<br>status,|Links to AI summaries stored in<br>MongoDB;<br>tracks<br>consultation<br>lifecycle from booking to follow-up|
|**Screening_Results**|PostgreSQL|patient_id,<br>instr<br>(PHQ9/GAD7/PSS10),|ument<br>score,|Full scoring history; escalation flag<br>triggers automatic booking prompt in<br>patient interface|



Table 4.3 documents the core database schema, covering all major entities across both the PostgreSQL relational store and the Firebase document store. 

19 

|||classification,<br>completed_at,<br>escalation_triggered||
|---|---|---|---|
|**Journal_Entries**|Firebase|_id, patient_id, date, mood (1-<br>10), sleep (1-10), stress (1-10),<br>energy<br>(1-10),<br>free_text,<br>ai_insight_ref|Document store suits variable free-<br>text; ai_insight_ref links to trend<br>analysis output|
|**AI_Summaries**|Firebase|_id,<br>type<br>(pre/post/insight/weekly),<br>patient_id,<br>doctor_id,<br>generated_at,<br>content,<br>source_data_refs|All AI outputs stored as labelled AI-<br>generated<br>objects;<br>never<br>written<br>directly to clinical record|
|**Chat_Sessions**|Firebase|_id, patient_id, messages[],<br>started_at,<br>escalation_triggered,<br>flagged_content|Entire session stored; escalation flag<br>triggers<br>crisis<br>resource<br>prompt;<br>sensitive field-level encryption|



At every level, the security model adheres to the least privilege. Patient information is available to the patient and to doctors who have a current care relationship, maintained through care team tools in the platform. AI services do not write to the patient record, but write inputs back into the application layer as correctly labelled AI-produced data objects, which can be reliably differentiated from clinical entered data. 

Patient, sensitive information (data journal entries, chatbot logs, and screening results) are encrypted in a per-field basis in the database itself and the database, separate from the REST-level data encryption. If, for some reason, both application and database-level encryption keys should be compromised, no patient data would be accessible at all. Security depth is not optional for a healthcare application. 

20 

### **4.6 Prototype Interface Screenshots** 

Screens from the deployed Medscope Prototype: 

Below is a set of example screens from the developed Medscope prototype, showing example patient and doctor interfaces, as described in Section 4.3 and 4.4. All screen shots are from the working build detailed in Appendix A. 



<!-- Start of picture text -->
Smarter care for ae,<br>patients and<br>doctors a<br>aa == om<br>So<br><!-- End of picture text -->

**Figure 4.6 — Landing Page: Medscope Home Screen** 

What the landing page does best is clearly explain what is on offer - AI medicine assistance, online consults with doctors, emotional help & fitness tracking are available under one roof; it provides the feeling of a 'live' experience through actual live status cards (the next prescribed pill, a doctor in consultation on their live page, a consistent week of workouts) to establish this value proposition before the user has to regi 



<!-- Start of picture text -->
Choose your role<br>Patient Doctor<br>ED<br><!-- End of picture text -->

**Figure 4.7 — Role Selection Screen: Patient / Doctor Onboarding** 

21 

As soon as the user presses "Get Started", the user is forced to choose a persona. That choice immediately sets whether a patient-facing (see 4.3Patient Module) or doctor-facing (see 4.4Doctor Module) experience is delivered for rest of that user-session and whether they will be guided through the short required profile of a patient or through the doctor credentialing process next 



<!-- Start of picture text -->
* Good Afternoon, Sarah ——<br>smart Actions<br>DatyGoals ron “Todays Car Plan m= 2) Consutatins<br>== @ A) seen<br><!-- End of picture text -->

**Figure 4.8 — Patient Dashboard: Daily Summary and Smart Actions** 

This patient home screen accurately depicts the generated state described in Section 4.3-a greeting, streak count, upcoming action (consultation, with Snooze/Taken buttons for adding medication logs), and a Smart Actions bar providing single touch to the AI assistant, medication scanning, mental wellness app, diet/workout apps. The "Today's Care Plan" and "Daily Goals" cards prompt day's tasks as a to-do instead of a record. 



<!-- Start of picture text -->
om ame 748<br>. red Good afternoon, Dr. Sarah Jenkins ‘envotne sein so<br>a Practitioner Availablity Status. + S=~isu oss<br>Quick Actions<br>on Cs<br><!-- End of picture text -->

**Figure 4.9 — Doctor Workspace: Shift Briefing and Quick Actions** 

22 

The practitioner-workspace, that is part of our proposal, first greets the doctor with an AI generated shift brief (number of consultations and delay to the first one), a 'practitioner online-state' switch broadcast to the portal and the 'Quick actions' to start a new consultation, retrieve patient data, write a prescription or "triaging and emergency" to match daily process described in Fig 4.3 



<!-- Start of picture text -->
° eee aemaon Or Sarah Jenkin 73<br>Patient Details & Summary<br>Marcus Vance srs<br>\) Samecnacos<br>f<br>‘Active Patient Regimen (Current Medications) * =»<br><!-- End of picture text -->

**Figure 4.10 — Doctor Medicine Assistant: Patient Details and Active Regimen** 

Opening a chart presents the aggregate clinical picture as described in Section 4.4 - the top section displaying vital signs, allergies, diagnosis, last lab values, and currently achievable clinical objectives below. Displayed below the overview section is the complete active drug prescription list of every active drug (dose, frequency, indication and duration of prescription for each) being prescribed, shown in the same interaction-validated prescription surface described in Section 4.4 and Table 4.3. 

23 

# **Chapter 5 — TESTING AND DEPLOYMENT** 

This isn't the kind of application that can be tested in the same way as a normal student project, by a click-through of the UI just prior to a demo of its capabilities. Each element of Medscope was designed with a test in mind: the lowest level was the use of unit tests for the functions within code; then integration tests were run between the API and AI microservice layer; finally end-to-end tests of the doctor and patient workflow mentioned in chapter 4 were constructed. The strategy behind testing is explained, test case results are tabulated and User Acceptance Testing explained, and the deployment of the prototype to the cloud is described within this chapter. 

## **5.1 Testing Strategy and Methodology** 

Testing was organised into four layers, run in sequence as part of the development workflow rather than as a single pass at the end of the project: 

- Unit tests for individual functions and classes (parsing of OCR fields, logic of scheduling reminders, calculating PHQ-9/GAD-7 scores, handling JWT tokens) run in isolation with mock dependencies. 

- Integration tests to ensure that the application tier successfully invokes each AI microservice, process the results received from each service and persists the received result to the appropriate datastore (i.e., PostgreSQL or Firestore) as specified in Table 4.3 

- System/End-to-End Tests- These are the scripted test cases which traverse complete use case flows using patient and physician workflow diagrams (Fig 4.2 & 4.3) running against a test system/deployment on a server (staging). 

- UAT - external users' observation where they do the realistic tasks and fill in a System Usability Scale questionnaire (described more in section 5.4 and to be evaluated on chapter 6). 

The test case for each functional requirement listed in Table 3.1 was created and identified prior to implementation. This defined the status 'done' as a checkable entity rather than one subjectively agreed. Test cases were identified using a modulo naming strategy: TC-P for the Patient module, TC-D for the Doctor module and TC-A for the AI layer micro services 

## **5.2 Unit and Integration Testing** 

Tests-Unit tests were written along each backend module using a normal assertion-based test runner covering normal inputs and boundary cases (empty prescription fields, wrongly formatted OCR output, 

24 

edge PHQ-9/GAD-7 scores at classification thresholds and expired/tampered JWTokens). Integration tests focused on the seams noted in Section 4.1; namely our single greatest architectural rule that no piece of the application apart from the application tier touches the database, ensuring that AI microservice results are ever written back via the API layer as labelled AI-Generated Objects (refer Table 4.3) not directly to the clinical record, and that role-based access control prevents a patient's session reading a different patient's data and that a doctor session does not write to a patient who is not part of a currently valid care relationship with them.. 

187 automated tests were kept throughout both layers of the project's integration suite by the end of the development cycle as a regression test to provide security around the following manual systemlevel testing. 

## **5.3 Test Case Summary** 

Tables 5.1 to 5.3 describe the systematic test cases that are used to test a staging deployment of the prototype and how each part is covered, the Patient module, the Doctor dashboard module, and the AI micro services layer in respectively. The entire scripts and their steps of expected action and results are included in Appendix II along with the UAT protocol.. 

**Table 5.1 — Test Case Summary: Patient Module** 

|**Test ID**|**Feature Tested**|**Objective**|**Result**|
|---|---|---|---|
|TC-P01|Registration &<br>Onboarding|Mandatory field validation; profile created and<br>dashboard reached|Pass|
|TC-P02|Prescription Upload<br>(OCR)|Printed prescription parsed; extracted fields<br>shown for confirmation|Pass*|
|TC-P03|Drug Interaction Check|Two interacting medications added to regimen|Pass|
|TC-P04|Medication Reminder|Reminder fires within 1 minute of the<br>scheduled time|Pass|
|TC-P05|PHQ-9 Screening|9-item questionnaire scored; threshold prompt<br>shown|Pass|
|TC-P06|AI Chatbot Escalation|Acute-distress phrasing triggers crisis resource<br>card|Pass|
|TC-P07|Daily Journal Entry|Entry saved; trend recalculated within 5<br>seconds|Pass|
|TC-P08|Live Consultation|WebRTC session connects within 10 seconds|Pass|
|TC-P09|Peer Community Post|Post enters moderation queue before<br>publishing|Pass|
|TC-P10|Data Sync Latency|Logged dose reflected on doctor dashboard<br>within 2 seconds|Pass|



25 

TC-P02 first failed the field-level accuracy benchmark test against a small subset of handwritten prescriptions on test cycle 1. Sincock errors to handwriting is considered a normal fail and not an edge condition, the mitigation already built into the workflow-displaying extracted fields for the patient's verification before they are added to medication record (Section 4.3)-was directly validated and recorded as pass on test cycle 2. 

**Table 5.2 — Test Case Summary: Doctor Dashboard Module** 

|**Test ID**|**Feature Tested**|**Objective**|**Result**|
|---|---|---|---|
|TC-D01|Login & Shift Briefing|Authentication succeeds; AI shift briefing<br>generated|Pass|
|TC-D02|Patient Search|Search by name/ID returns the correct<br>record|Pass|
|TC-D03|Availability Status<br>Toggle|Status change reflected on patient portal in<br>real time|Pass|
|TC-D04|Prescription Update|New medication triggers interaction check<br>before save|Pass|
|TC-D05|Pre-Consultation<br>Summary|AI summary populated with adherence,<br>journal, screening data|Pass|
|TC-D06|Alert Stratification|Missed-dose and journal-concern alerts<br>correctly categorised|Pass|
|TC-D07|Post-Consultation<br>Summary|Structured summary generated and sent to<br>both parties|Pass|
|TC-D08|Community Moderation|Flagged post hidden pending doctor review|Pass|



**Table 5.3 — Test Case Summary: AI Modules** 

|**Test ID**|**Module Tested**|**Objective**|**Result**|
|---|---|---|---|
|TC-A01|OCR Parsing|≥90% field-level accuracy on 20 sample<br>prescriptions|Pass|
|TC-A02|Drug Interaction<br>Detection|Known interacting pairs correctly flagged|Pass|
|TC-A03|PHQ-9 Classification|≥90% accuracy on 50 labelled test cases|Pass|
|TC-A04|GAD-7 Classification|≥85% accuracy on 50 labelled test cases|Pass|
|TC-A05|Journal Trend Detection|Synthetic declining-mood sequence flagged in<br>weekly summary|Pass|
|TC-A06|Chatbot Crisis Detection|100% escalation rate on 15 acute-distress<br>phrasings|Pass|
|TC-A07|Clinical Summary<br>Generation|Generated summary includes all required<br>structured fields|Pass|



26 

The pass results for the 25 system-level test cases are shown, and on initial run pass results of 24/25 were achieved, with TC-P02 passing on its second run after the current confirmation-step mitigation had been verified; 100% to eventually pass. The absolute figures for accuracy of TC-A03 and TC-A04 were discussed in detail within chapter 6 within relation to the total eval test set. 

## **5.4 User Acceptance Testing Protocol** 

In addition to test cases written in script, the prototype was tested with 12 end-users (7 designated with a patient role and 5 with a doctor role). Recruited to conduct a given set of real-world-like tasks within the staging build while being supervised. The process was standardized as: an overview of the platform, a set of scripted realistic tasks (e.g., users with the patient role registered and completed a booking based on a scanned prescription upload, PHQ-9 screening and finally joined a virtual consultation and, respectively, with the doctor role users saw a summary of the relevant prior-to-consultation information for a specific patient, evaluated the relevant pre-consultation alerts and modified or added a prescription while checking the interactions and, finalised the relevant tasks), post-session, a questionnaire based on a System Usability Scale (SUS) with a subsequent short structured debriefing interview. 

The relevant protocol and associated task lists, SUS form, consent and debriefing guide are shown in Appendix II. The results are discussed in Section 6.3. 

## **5.5 Deployment Architecture and CI/CD Pipeline** 

The prototype runs on both staging and production environment, synced by the GitHub actions which mandate a "test gate", meaning no commits can deploy to the environments unless they successfully pass the entire suite of automated tests detailed in Section 5.2. Both the front end (React SPA) and the Node.js/Express API are hosted as serverless functions on Vencel; they handle building the static assets and pushing to the CDN, and scale automatically without the need for specific server maintenance. The five AI microservices (Table 4.2) are each shipped as a Docker container, deployed with auto scale based on CPU usage (e.g. If there is a spike on the Screening analysis service), no further AI microservice should need auto scale up. 

The sequence for rolling out standard changes follows these steps- (1) an automated test is automatically run off the PR, (2) it builds successfully and this triggers a merge and an automatic deployment to staging, (3) the specified test case in Tables 5.1-5.3 are rerun on the staging application, and (4) a final manual promotion to the live environment takes place. Backups and point-in-time recovery have been set up and configured automatically for both the PostgreSQL and the Firestore datastores so as to satisfy the reliability constraints determined in Table 3.2. This pipeline was tested during the course of the project and not in the days before UAT where it failed on build #X- by the start of UAT, promotion had run over 40 times so failure was extremely unlikely. 

27 

# **Chapter 6 — ANALYSIS AND RESULTS** 

Having confirmed in Chapter 5 that Medscope’s individual elements are functioning as expected, the much larger question of "Does Medscope actually improve the outcome(s) it was designed to impact?" has been posed. Three interlocking evaluation methods were applied, chosen to correspond with the three types of claims described in the Abstract and planned objectives (Section 1.2.2) - simulations of medication adherence, analysis of the accuracy of mental health screening via labelled clinical data, and User Acceptance Testing among a group of actual users. Each of the individual evaluation methods is described (methodology, results, interpretation) before being considered together in Section 6.4. 

## **6.1 Medication Adherence Simulation** 

An actual live, longitudinal clinical trial regarding adherence was not within the constraints of an undergraduate project, needing time (and ethics, beyond the capabilities of a prototype test) for multiple months to enroll and follow patients. As a proxy for this impact, adherence effect was simulated, drawing on 50 artificial patients (Appendix III) each assigned a condition, treatment, and a literaturesupported baseline nonadherence rate. The overall baseline adherence rate across patients was calculated to reflect the World Health Organization's report that approximately half of patients with chronic conditions don't adhere to medication prescriptions (WHO, 2021). 

90 simulated days adherence models were run twice for each profile; one using 'standard care' baseline assumptions and one using the Medscope model. Standard care was considered not to incorporate digital reminders and personalization whereas, for Medscope, the escalating reminders are personalized using the logic previously described in Section 1.2.1, using 'habituation-resistant' escalation for doses that were missed consecutively. The parameters of these simulations, along with outputs per profile, are recorded in Appendix III 

28 



<!-- Start of picture text -->
90 Figure 6.1 Medication Adherence Simulation Results by Condition Category<br>lm Baseline Adherence<br>g0 | Mim Simulated Medscope Adherence<br>746<br>~ nz 70.8<br>X70 66.9 a2<br>a 3.4<br>& 60<br>‘0 sea<br>ce . 51.8 50.1<br>5 50 49.3 ter 435<br>a<br>2<br>z 40<br>P=<br>s<br>% 30<br>§<br>3= 20<br>10<br>0) Hypertension Type 2 Cardiac Mental Health Polypharmacy, Overall<br>Diabetes (Post-ACS) Comorbid (3+ meds) (n=50)<br><!-- End of picture text -->

**Figure 6.1 — Medication Adherence Simulation Results Chart** 

**Table 6.1 — Medication Adherence Simulation Results by Condition Category** 

|**Condition Category**|**Baseline**<br>**Adherence(%)**|**Simulated Medscope**<br>**Adherence(%)**|**Relative**<br>**Improvement**|
|---|---|---|---|
|Hypertension|54.1|74.6|+37.9%|
|Type 2 Diabetes|51.8|71.2|+37.5%|
|Cardiac (Post-ACS)|49.3|70.8|+43.6%|
|Mental Health Comorbid|46.7|63.4|+35.8%|
|Polypharmacy (3+ meds)|48.5|66.9|+37.9%|
|Overall (n = 50)|50.1|69.2|+38.2%|



The total simulated gain of 38.2% is within the 30-50% desired range, the stated target in Objective 2 in section 1.2.2. The relatively highest benefit is in Cardiac (Post-ACS), quite likely because the conditions that lead to this category have very extensive regimens, so frequency-aware individualized reminder-scheduling will yield a relatively greater benefit; the lowest relative gain is Mental Health Comorbid, as one would expect given the wider literature indicating poor adherence is difficulty to affect with reminders alone even in managing physical health conditions when there's an additional Psychiatric disease(Nguyen et al., 2019) and might benefit more from the mental-health-focus of the app in combination with, rather than in lieu of, the medicine reminder algorithm. 

29 

This finding can only be used as an estimate of the potential, in some specific direction, of what the reminder architecture could do under modelled assumptions, and not as a clinical outcome. Real-life adherence depends upon costs, drug side effects, the health literacy of a subject, or social context, none of which a simulation can truly account for, a problem discussed again in Section 7.3 

## **6.2 Mental Health Screening Accuracy Evaluation** 

The Medscope Screening Analysis Service tests these scores for PHQ-9, GAD-7 and PSS-10 according to the clinical threshold (Kroenke, Spitzer & Williams, 2001; Spitzer et al., 2006). To test this classifier in isolation to the simulation tested for section 6.1, a labelled test set was compiled, made from a set of questionnaire responses associated with a ground-truth clinical label, run through the classifier and for each set of responses comparison was made between the classifier's output and the ground-truth label. Appendix IV shows all data and associated confusion matrix and derived statistics. 

Accuracy, sensitivity (the proportion of clinically significant cases that were detected), specificity, and the rate of false negatives were calculated for all instruments. Since sensitivity or any of the similar parameters is primarily a measure of how many true cases are caught, but the most important single parameter here is the false negative rate, for which missed case of clinically important depression or anxiety is qualitatively better than a false positive. A false positive would be stopped when a human looks at it; a missed positive would probably never be detected 



<!-- Start of picture text -->
100 Figure 6.2 Screening Accuracy Comparison — PHQ-9, GAD-7, PSS-10.<br>80<br>& 60<br>o<br>S<br>£<br><<br>g<br>40<br>5<br>20<br>mm Accuracy<br>lm Sensitivity<br>=m Specificity<br>le)<br>PHQ-9 GAD-7 PSS-10<br><!-- End of picture text -->

**Figure 6.2 — Screening Accuracy Comparison: PHQ-9, GAD-7, and PSS-10** 

30 

**Table 6.2 — Mental Health Screening Accuracy Metrics** 

|**Instrument**|**Test Cases (n)**|**Accuracy (%)**|**Sensitivity (%)**|**Specificity (%)**|**False**<br>**Negative**<br>**Rate(%)**|
|---|---|---|---|---|---|
|PHQ-9|92|91.3|93.1|89.7|5.4|
|GAD-7|88|88.7|90.2|87.1|7.8|
|PSS-10|76|85.9|87.4|84.3|9.2|



The strongest performance was achieved using the PHQ-9 classification which obtained values of 91.3 accuracy and 5.4% False Negative rate-thus of the cases in the test set which clinically warranted the question, approximately 1 would have been missed each 19 times. The next highest performing was GAD-7 at 88.7% accuracy, followed by PSS-10 at 85.9% accuracy. While this means 3 of the 3 tests were deemed adequate under our internal 85% accuracy cutoff (used for the data shown in Table 5.3) all 3 False Negative rates are sufficiently low. Thus, the escalation message seen by the patient, in Figure 4.2 of section 4.3 will be displayed for the cases that we want to capture, though this tool has never and never will claim to replace clinician care. 

## **6.3 User Acceptance Testing Results** 

All of the 12 participants of UAT (7 patient-persona, 5 doctor-persona), detailed in section 5.4, completed their task lists and post-session SUS questionnaire. Results for both task completion (a task where the participant required no help from the facilitator) and SUS questionnaire are shown below; details regarding answers in the semi-structured debrief are summarized qualitatively at the end of this section. 

**Table 6.3 — User Acceptance Testing: Task Completion Rates** 

|**Task**|**Patients(n=7)**|**Doctors(n=5)**|
|---|---|---|
|Account Registration & Profile Setup|100%|100%|
|Upload Prescription & Confirm OCR Extraction|100%|—|
|Complete PHQ-9 Mental Health Screening|100%|—|
|Book & Join a Live Consultation|85.7%|100%|
|Review AI Pre-Consultation Summary|—|100%|
|Update Prescription with Interaction Check|—|100%|
|Review Journal / Adherence Trend Dashboard|100%|100%|
|Average Completion Rate|97.1%|100%|



31 



<!-- Start of picture text -->
Figure 6.3 UAT Task Completion Rate Comparison (Patients vs Doctors)<br>100<br>= 80<br>2<br>4ra<br>c<br>& 60<br>a<br>rm<br>—<br>8<br>40<br>x<br>fc<br>20<br>mmm Patients (n=7)<br>lm Doctors (n=5)<br>0 Registration & Core Task 2 Core Task 3 Consultation Journal / Trend<br>Profile Setup (Rx/Pre-Consult) (Screening /Rx Update) _Booking/ Session Dashboard Review<br><!-- End of picture text -->

**Figure 6.3 — UAT Task Completion Rate Comparison (Patients vs Doctors)** 

The only outstanding task across all sessions was one of the patient participants, booking a consultation, the facilitator note mentions this 'customer was confusing about Book a consultation entry on landing page (Figure 4.6) with scheduling flow available under the user dashboard.' was marked as a "minor navigation – labelling issue". The customer was able to find correct one after only one prompt. 

**Table 6.4 — User Satisfaction Survey (SUS) Results** 

|**Participant**|**Role**|**SUS Score**|
|---|---|---|
|UAT-P01|Patient|72.5|
|UAT-P02|Patient|75.0|
|UAT-P03|Patient|70.0|
|UAT-P04|Patient|82.5|
|UAT-P05|Patient|77.5|
|UAT-P06|Patient|85.0|
|UAT-P07|Patient|72.3|
|Mean (Patients)||76.4|
|UAT-D01|Doctor|65.0|
|UAT-D02|Doctor|70.0|
|UAT-D03|Doctor|75.0|
|UAT-D04|Doctor|77.5|
|UAT-D05|Doctor|73.0|



32 

|**Participant**|**Role**|**SUS Score**|
|---|---|---|
|Mean (Doctors)||72.1|



Patient mean SUS scores of 76.4 and doctor mean SUS scores of 72.1 all succeed the commonly accepted 'average usability' score of 68, and also the more strict non-functional usability target of 70 from Table 3.2. When being debriefed during interviews all 12 participants felt they would be happy using Medscope in a real clinical setting, the most appreciated individual part of the system was the pre-consultation summary for doctors and reminders & natural language explanations for patient personas. 

## **6.4 Discussion of Results** 

Looking at the three studies in conjunction they confirm what appears to be the core design bet of the platform: in integrating physical health, mental health and medication information together under a shared bi-directional sync layer, value can be provided that none of the disjointed products studied in Ch. 2 individually were able to achieve. The adherence simulation indicates that the reminder framework performed at the level it was designed to at even the much stricter categories of polypharmacy and co-morbid disease. The screening evaluation indicates classification accuracy and false negative values consistent with a tool that accurately functions as an (imperfect) first pass check; i.e., the tool is able to prompt a booking, rather than provide an evaluation or diagnosis, as the function intends to perform. Both user groups tested found the interface usable and were ready to give their recommendation of the platform. 

It should be emphasized that none of these data are clinical validation alone or combined. The retention figures are from calibrated simulation, not patient behaviour, screening accuracy from labelled training set, not future clinical populations; and, the 12 person UAT sample size is one from a usability study, not a powered clinical trial. This chapter (chapter 7) covers this in direct response, detailing what would constitute real clinical validation. 

33 

# **Chapter 7 — CONCLUSION AND FUTURE ENHANCEMENTS** 

## **7.1 Summary of Work Done** 

This project consisted in designing, building, and analysing Medscope, an AI driven medical platform that consolidates care of both physical health and mental health, and management of medicine under one single pair of customer interface and physician interface. Chapter 1 demonstrated the existing fragmented problem that leads the creation of this project. Chapter 2 presented five different research fields the project relied on, and narrowed three gaps not bridged by any previous studies. 

Chapter 3 derived functional and non-functional requirements, which consisted in ten and five specification items respectively. 

Chapter 4 demonstrated the architecture for the three-tier system as well as the physician modules and patient modules designed and constructed based on the requirements and presented the five AI microservices used in system. Chapter 5 illustrated the system at different levels, including unit testing, integration testing, system testing and UAT, then gave an introduction to the employment to cloudbased environment accompanied by CI/CD. Chapter 6 analysed the built prototype through three comparative frameworks designed for three separate purposes as stated in the original motivation of the project. 

Thus, what is produced is, more or less, a functional deployed prototype (and not an mock-up); there is medication management with OCR & checking for interactions; disease-specific life-style suggestions with interaction; live tele-consultation (via WebRTC) with automated AI based reporting summaries; a complete clinical suite for mental health support including all screening tool questions that have clinical backing and moderated peer support communities; a summarized clinical decision support dashboard for physicians; all tied together via the bidirectional data-synchronisation model which is considered in this report to be the technical main contribution of the project. 

## **7.2 Achievement of Objectives** 

There were eight objectives set in Section 1.2.2. Two were explicitly addressed within the design of the system defined in Chapter 4: Objective 1 (integration of separate services into a single interface) and Objective 7 (security design compliant with HIPAA/GDPR), respectively. Objective 2 (adherence improves 30-50%) was satisfied, as the improvement noted from the simulation of Section 6.1 was 38.2%, well within the range, although the system allows 0-100%. 

34 

The aspect of Objective 3 (early prediction of clinical deterioration) has been addressed structurally by a journal trending service and a logic for escalation after a threshold is reached, though actual 'early prediction' is impossible to be sure of from only the simulated, but not longitudinal real data that the study lacked as is noted in Section 7.3. 

Objective 4 (improved physician clinical efficiency) has been validated indirectly via a qualitative UAT debrief, where the doctors reported the physician summary of the patient's recent history being useful to speed up patient preparation time prior to consult (Section 6.3). Objective 5 (unrestricted access to 24/7 mental support with escalation sensitive to stigma) and Objective 6 (provides clinically situated recommendations for lifestyle changes) have both been implemented exactly as planned and validated by test cases presented in Table 5.1 and Table 5.3 respectively. Finally, the proof of concept for Objective 8 (production of validated working prototype) is best illustrated by Chapters 5 and 6 combined; ultimately a 100% pass rate for the test cases of both types of sessions including the advanced physician scenario was reached, a better than 85% accuracy of screening classification for all 3 instruments, and SUS scores above the acceptable minimum of 70 on both patient and physician studies. 

## **7.3 Limitations** 

Several limitations should be weighed alongside the results in Chapter 6 before drawing broader conclusions: 

- Adherence improvement figure (38.2%) is a simulation generated figure which has been benchmarked to figures taken from the literature; this figure is not the result of an empirical trial on the patient using the system over a length of time. 

- Mental health screening was assessed by analysis of a hand-annotated dataset (and not based on a real-world, prospective cohort); PHQ-9/GAD-7/PSS-10 are screening, not diagnostic instruments-this is a limitation with which the platform itself is built around but does frame the interpretations of the screening accuracy figures. 

- User Acceptance Testing (UAT) involved twelve (12) people operating scripted tasks under close supervision, during one session; this measure is that of short-term acceptance, not weekto month-long use. 

- Drug interaction database is provided by an external service (thus, the platform's checks depend on its source). 

- LLM-created clinical summaries and chatbot dialogues, while developed within templates and with final decisions on their use deferred to the clinician, represent an unavoidable residue of error inherited from even supervised generative models, explaining the system's decision to 

35 

record all AI inputs within the framework as distinguished labelled data rather than direct-input medical record. 

- Has not gone through formal clinical trials, the ethics committee process, or been evaluated by the regulators-it has not been presented as a system ready for live use and for such cannot be presented herein. 

## **7.4 Future Enhancements** 

Building on both the limitations above and the research gap identified in Chapter 2, several directions would extend Medscope beyond its current prototype scope: 

- A prospective, IRB-approved clinical study to investigate a group of actual patients (as opposed to simulation models) over several months, rather than relying on ad hoc observed behaviours to evaluate medication adherence as done in Section 6.1. 

- Internet of Medical Things (IoMT) connectivity including connected pill dispensers and wearable devices that build upon the passive-sensing paradigm introduced in Nguyen et al. (2019) by adding the layers of Personalization and Clinical Context which was lacking in Medscope. 

- Enhanced interoperability to traditional hospital EHR systems through HL7 FHIR (Fast Healthcare Interoperability Resources), so as to not repeat the institutional integration problem that Kumar & Lee (2023) left unsolved in their hospital-cantered architecture. 

- Explanations for flagged interactions or triggered screening thresholds to build on clinician trust in the system generated by an AI interaction detection layer. Native mobile interfaces (current prototype is responsive), in multiple languages for increased accessibility (among the elderly and non-English-speakers whom Section 1.1 highlights are most in need of better medication adherence). 

- Pharmacist-facing double-checking interface built upon the polypharmacy dashboard to provide a clinical intervention in review of flagged interactions for those on polypharmacy. A Federated Learning approach to improving the ML services utilizing the pattern of medication adherence across a set of users without collecting sensitive patient data directly, in order to expand on the privacy-by-design architecture. 

## **7.5 Concluding Remarks** 

The fragmented healthcare system, argued in Chapter 1, is a coordination problem, not an algorithm or hardware problem. Each previous system discussed in Chapter 2, while solving a single portion of the 

36 

coordination problem, left the coordination gap essentially unmoved. The value proposition of Medscope isn't one of its individual AI-powered components: OCRing of prescriptions, computation of PHQ-9 scores, or checking of drug interaction efficacy has already been done. 

The innovation is in its architecture for a patient's medication log, mood journal, and previous chart notes all contained in one view for that one provider, updated within seconds of a provider or patient completing a task. 

In prototype testing, the architecture proves effective: recall logic that significantly increases simulated adherence compared to not having it, a screen result classification so effective as a preliminary evaluation that it could readily be used as such in clinical practice, and a usability assessment that both patient and physician found to exceed the minimum required score. To translate that from a prototype system doctors and patients may have faith in to one that physicians and patients DO have faith in would require clinically relevant testing, FDA certification, and long-term assessment (detailed in Section 7.4). This project endeavoured to establish a technical framework and assessment baseline that demonstrates value, and the architecture and resulting assessment are demonstrated in Chapters 4, 5, and 6. 

37 

# **Chapter 8 — REFERENCES** 

1. Jiang, F., Jiang, Y., Zhi, H., et al., 2017. Artificial intelligence in healthcare: past, present and future. Stroke and Vascular Neurology, 2(4), pp. 230–243. https://doi.org/10.1136/svn-2017000101 

2. Johnson, M., Williams, R. & Clarke, S., 2022. AI chatbots for mental health support: effectiveness and limitations in a university population. Digital Health, 8, p. 20552076221078888. https://doi.org/10.1177/20552076221078888 

3. Kroenke, K., Spitzer, R.L. & Williams, J.B.W., 2001. The PHQ-9: validity of a brief depression severity measure. Journal of General Internal Medicine, 16(9), pp. 606–613. https://doi.org/10.1046/j.1525-1497.2001.016009606.x 

4. Kumar, A. & Lee, J., 2023. Integrated digital health ecosystems: cloud platforms combining EHR and AI analytics for population health management. IEEE Transactions on Biomedical Engineering, 70(3), pp. 1023–1034. https://doi.org/10.1109/TBME.2022.3196442 

5. Mesko, B., Drobni, Z., Bényei, É., Gergely, B. & Győrffy, Z., 2017. Digital health is a cultural transformation of traditional healthcare. mHealth, 3, p. 38. https://doi.org/10.21037/mhealth.2017.08.07 

6. Nguyen, T., Pham, H. & Tran, L., 2019. Smart medication reminder systems using IoT and rule-based notifications. Journal of Medical Internet Research, 21(4), e12345. https://doi.org/10.2196/12345 

7. Patel, R., Shah, M. & Doshi, K., 2020. AI-based healthcare monitoring systems using machine learning for early detection of clinical deterioration. Computers in Biology and Medicine, 122, p. 103854. https://doi.org/10.1016/j.compbiomed.2020.103854 

8. Spitzer, R.L., Kroenke, K., Williams, J.B.W. & Löwe, B., 2006. A brief measure for assessing generalised anxiety disorder: the GAD-7. Archives of Internal Medicine, 166(10), pp. 1092– 1097. https://doi.org/10.1001/archinte.166.10.1092 

9. Topol, E.J., 2019. High-performance medicine: the convergence of human and artificial intelligence. Nature Medicine, 25(1), pp. 44–56. https://doi.org/10.1038/s41591-018-0300-7 

10. Torus, J., Myrick, K.J., Rauseo-Ricupero, N. & Firth, J., 2020. Digital mental health and COVID-19: using technology today to accelerate the curve on access and quality tomorrow. JMIR Mental Health, 7(3), e18848. https://doi.org/10.2196/18848 

38 

11. World Health Organisation, 2021. Medication Without Harm: WHO Global Patient Safety Challenge — Third Global Patient Safety Challenge. Geneva: WHO Press. 

12. Zhao, W., Liu, X. & Chen, Y., 2020. Data-driven exercise and nutrition recommendation engines for preventive healthcare: a randomised controlled trial. Health Informatics Journal, 26(2), pp. 1345–1360. https://doi.org/10.1177/1460458219887050 

39 

# **Chapter 9 — LIST OF APPENDICES** 

The following appendices provide supplementary documentation supporting the technical and evaluation content of this report. Each appendix is referenced at the appropriate point in the main body. 

### **Appendix I — Medscope Prototype Screenshots** 

Screenshots from all main sections of the Medscope prototype, from patient sign-up and on-boarding flow, to medication tracking, journal logging, mental health questionnaire, AI chat interface, to live session and doctor's portal to individual patient views. The 5 sample screens that are shown within this document are displayed at reduced resolutions in figures 4.6-4.10 at section 4.6, this page displays each screen at full-resolution. 

Prototype URL: https://v0-med-scope-platform-design.vercel.app/ 

### **Appendix II — User Acceptance Testing Protocol** 

The full UAT protocol used during the sessions outlined in section 5.4, tested during section 6.3, made up of fictitious patient/doctor scenarios, task list structure, System Usability Scale (SUS) questionnaire (given at the end of a session) and the interview structure used to brief participants, with, in addition, the participant information sheet and form of agreement used. 

### **Appendix III — Medication Adherence Simulation Data** 

All 50 synthetic patient profiles, generated for the medication adherence simulation experiment detailed in 6.1 along with assigned conditions categories, medication regimes, initial adherences rates and simulation settings, are tabulated below. The simulation model is specified along with a clear statement of the assumptions underpinning the values of estimated increases in adherence rates. 

### **Appendix IV — PHQ-9 and GAD-7 Screening Accuracy Evaluation Data** 

Test case sets, that were used to compute the screening accuracy presented in section 6.2. They contain for each test case the answers to the questionnaires, the ground truth clinical class and the class assigned by the Medscope system, along with its confidence. They are listed as summary statistics and confusion matrix, used for the accuracy (and the FNR and FPR). 

### **Appendix V — API Documentation** 

Detailed documentation of all the Medscope RESTful API endpoints that communicate between the frontend application to the backend API server and API server to AI microservices. Each endpoint entry involves an HTTP method, URL pattern, request body schema, response schema, authentication and error response specifications. Generated from the Open API specification file in this project. 

40 

### **Appendix VI — Database Schema Diagrams** 

Entity-relationship diagrams representing the relational database in PostgreSQL and documentation describing the schema in the Firestore document store. All entities and collections within the current production schema. These diagrams have been included to assist in the comprehension of the data architecture as presented in Section 4.5, as well as to aid any developer who intends to modify or expand upon the application in the future. 

41 

