# MahaSetu (महासेतू)
### State Government Interoperability & Citizen Service Delivery Platform
> *Government of Maharashtra • Directorate of Information Technology (DIT)*

---

## 🏛️ Platform Overview

MahaSetu is an enterprise-grade government interoperability gateway connecting independent state departmental registries on-demand via standardized API connectors without centralizing or duplicating their underlying databases.

### Core Capabilities
* **Decentralized Registry Connector:** On-demand REST queries to Revenue (Tahsildar Income & Domicile), Social Justice (BARTI Caste Validity), and Land Records (Mahabhulekh 7/12 Land Holding).
* **Automated Data Verification:** Levenshtein phonetic string matching, schema conformity, and eligibility threshold validation.
* **Frontline Human-in-the-Loop Review:** Dedicated desk officer portal for physical verification and reconciliation of flagged records before entitlement release.
* **Cryptographic Tamper-Evident Ledger:** Immutable SHA-256 hash chaining guaranteeing non-repudiation and instant detection of unauthorized record alterations.
* **DPDP Act 2023 Compliance:** Purpose-specific, time-bound digital consent tokens with citizen revocation controls and PII masking.
* **Verifiable QR Entitlement Certificate:** Official printable dossier layout with DSC electronic signatures and dynamic cryptographic verification links.

---

## 🚀 Live Access

* **Web Application & Backend Server:** [http://127.0.0.1:8000](http://127.0.0.1:8000)
* **REST API Documentation (Swagger):** [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
* **Vite Dev Server (Frontend):** [http://127.0.0.1:5173](http://127.0.0.1:5173)

---

## 🛠️ Technology Architecture

* **Frontend:** React 19, TypeScript, Tailwind CSS, Bilingual Engine (English & मराठी).
* **Backend:** Python 3.9+, FastAPI, Pydantic, Uvicorn, Hashlib.
* **Security:** SHA-256 Block Chaining, DPDP Act 2023 Tokenization, UIDAI Masking (`XXXX-XXXX-XXXX`), DSC Digital Signatures.
