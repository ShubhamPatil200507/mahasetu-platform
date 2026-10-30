import os
import hashlib
import time
from datetime import datetime
from typing import Dict, List, Optional, Any
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel, Field

app = FastAPI(
    title="MahaSetu Government Interoperability & Unified Delivery API",
    description="Backend engine connecting isolated departmental platforms in Maharashtra with zero database replacement, AI-assisted anomaly harmonization, and SHA-256 cryptographic audit trails.",
    version="2.6.0"
)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -----------------------------------------------------------------------------
# 1. Pydantic Models & Schemas
# -----------------------------------------------------------------------------
class ConsentRequest(BaseModel):
    applicant_aadhaar_hash: str
    purpose: str
    consented_depts: List[str]

class ApplicationSubmitRequest(BaseModel):
    applicant_name: str
    applicant_phone: str
    aadhaar_number: str
    scheme_id: str
    district: str
    taluka: str
    village: str
    self_declared_income: float
    self_declared_land_hectares: float
    self_declared_caste: str

class OfficerActionRequest(BaseModel):
    officer_name: str
    officer_role: str
    remarks: str

# -----------------------------------------------------------------------------
# 2. In-Memory Silos & Cryptographic Ledger
# -----------------------------------------------------------------------------
REVENUE_SILO = {
    "a3f81e9d01b4c93817a5e98214fbc910": {
        "income_cert_id": "REV/MH/PUN/2026/049182",
        "applicant_name": "Ganesh Tukaram Shinde",
        "annual_income": 45000,
        "tahsildar_office": "Tahsildar Office, Daund",
        "taluka": "Daund",
        "district": "Pune",
        "validity_status": "VALID"
    },
    "b7e21a8c90f3d45291e0a81726fca819": {
        "income_cert_id": "REV/MH/AHM/2025/119283",
        "applicant_name": "Sunita Patil",
        "annual_income": 92000,
        "tahsildar_office": "Tahsildar Office, Karjat",
        "taluka": "Karjat",
        "district": "Ahmednagar",
        "validity_status": "VALID"
    },
    "c1d49e8a72b0f19384e9102837fba921": {
        "income_cert_id": "REV/MH/SOL/2026/009182",
        "applicant_name": "Ramesh Vitthal Jadhav",
        "annual_income": 55000,
        "tahsildar_office": "Tahsildar Office, Barshi",
        "taluka": "Barshi",
        "district": "Solapur",
        "validity_status": "VALID"
    }
}

SOCIAL_WELFARE_SILO = {
    "a3f81e9d01b4c93817a5e98214fbc910": {
        "caste_cert_id": "BARTI/PUN/SC/2023/09182",
        "applicant_name": "Ganesh Tukaram Shinde",
        "caste_category": "SC",
        "sub_caste": "Mahar",
        "barti_status": "VERIFIED"
    },
    "b7e21a8c90f3d45291e0a81726fca819": {
        "caste_cert_id": "BARTI/AHM/OBC/2024/49102",
        "applicant_name": "Sunita Ramdas Patil",
        "caste_category": "OBC",
        "sub_caste": "Kunbi Maratha",
        "barti_status": "VERIFIED"
    },
    "c1d49e8a72b0f19384e9102837fba921": {
        "caste_cert_id": "BARTI/SOL/OPEN/2021/11029",
        "applicant_name": "Ramesh Vithal Jadhav",
        "caste_category": "OPEN",
        "sub_caste": "Maratha",
        "barti_status": "VERIFIED"
    }
}

LAND_RECORDS_SILO = {
    "a3f81e9d01b4c93817a5e98214fbc910": {
        "survey_gat_number": "Gat No. 142/2",
        "applicant_name": "Ganesh T. Shinde",
        "land_area_hectares": 0.15,
        "village_name": "Kedgaon",
        "taluka": "Daund",
        "district": "Pune",
        "encumbrance_status": "NIL"
    },
    "b7e21a8c90f3d45291e0a81726fca819": {
        "survey_gat_number": "Gat No. 89/1-A",
        "applicant_name": "Sunita Ramdas Patil",
        "land_area_hectares": 1.45,
        "village_name": "Mirajgaon",
        "taluka": "Karjat",
        "district": "Ahmednagar",
        "encumbrance_status": "BANK_MORTGAGE"
    },
    "c1d49e8a72b0f19384e9102837fba921": {
        "survey_gat_number": "Gat No. 312/4",
        "applicant_name": "Ramesh Vitthal Jadhav",
        "land_area_hectares": 1.80,
        "village_name": "Pangri",
        "taluka": "Barshi",
        "district": "Solapur",
        "encumbrance_status": "NIL"
    }
}

def calculate_sha256(data: str) -> str:
    return hashlib.sha256(data.encode('utf-8')).hexdigest()

def compute_block_hash(index: int, timestamp: str, prev_hash: str, data_hash: str, actor: str, action: str, nonce: int) -> str:
    payload = f"{index}|{timestamp}|{prev_hash}|{data_hash}|{actor}|{action}|{nonce}"
    return calculate_sha256(payload)

GENESIS_HASH = "0000a98b1c4f72d918e0018247ca819203948571629401827461920485716294"
LEDGER_BLOCKS = [
    {
        "index": 0,
        "timestamp": "2026-03-12T09:00:00Z",
        "action": "GENESIS_BLOCK",
        "application_id": "SYSTEM",
        "actor": "MahaSetu Root Node",
        "actor_role": "STATE_ROOT_AUTHORITY",
        "data_hash": "0000000000000000000000000000000000000000000000000000000000000000",
        "previous_hash": "0000000000000000000000000000000000000000000000000000000000000000",
        "nonce": 10429,
        "hash": GENESIS_HASH
    }
]

class LoginRequest(BaseModel):
    role: str
    identifier: Optional[str] = None
    credential: Optional[str] = None

DEMO_PROFILES = {
    "CITIZEN_OPERATOR": {
        "id": "usr_csc_4120",
        "name": "Suresh M. Chavan",
        "name_mr": "सुरेश म. चव्हाण",
        "email": "suresh.chavan@csc.mahasetu.gov.in",
        "phone": "9822941029",
        "role": "CITIZEN_OPERATOR",
        "designation": "Aaple Sarkar Seva Kendra Operator",
        "department_office": "CSC Kendra #4120, Taluka Daund, Dist. Pune",
        "badge_number": "MH-CSC-2026-4120",
        "auth_method": "OTP",
        "allowed_tabs": ["tracking"],
        "default_tab": "tracking"
    },
    "TALUKA_OFFICER": {
        "id": "usr_rev_8491",
        "name": "S. K. Kulkarni",
        "name_mr": "एस. के. कुलकर्णी",
        "email": "sk.kulkarni@mahadit.gov.in",
        "phone": "9422019283",
        "role": "TALUKA_OFFICER",
        "designation": "Tahsildar & Sub-Divisional Scrutiny Officer",
        "department_office": "Office of the Tahsildar, Taluka Daund, Pune",
        "badge_number": "MH-REV-OFF-8491",
        "auth_method": "DSC_TOKEN",
        "allowed_tabs": ["tracking", "review"],
        "default_tab": "review"
    },
    "AUDITOR_SECURITY": {
        "id": "usr_cag_3901",
        "name": "Dr. Anuradha Deshmukh",
        "name_mr": "डॉ. अनुराधा देशमुख",
        "email": "anuradha.deshmukh@cag.gov.in",
        "phone": "9820019201",
        "role": "AUDITOR_SECURITY",
        "designation": "Senior Audit Officer & Cryptographic Inspector",
        "department_office": "Comptroller & Auditor General (CAG) Directorate, Maharashtra",
        "badge_number": "CAG-MH-SEC-3901",
        "auth_method": "SECURITY_KEY",
        "allowed_tabs": ["ledger", "tracking"],
        "default_tab": "ledger"
    },
    "SILO_ARCHITECT": {
        "id": "usr_dit_001",
        "name": "Vikramaditya Patil",
        "name_mr": "विक्रमादित्य पाटील",
        "email": "v.patil@maharashtra.gov.in",
        "phone": "9819920192",
        "role": "SILO_ARCHITECT",
        "designation": "Principal Enterprise Architect & DIT Gateway Lead",
        "department_office": "Directorate of Information Technology (DIT), Mantralaya, Mumbai",
        "badge_number": "DIT-GATEWAY-001",
        "auth_method": "GATEWAY_MFA",
        "allowed_tabs": ["silos", "ledger", "tracking", "review"],
        "default_tab": "silos"
    }
}

# -----------------------------------------------------------------------------
# 3. REST API Endpoints
# -----------------------------------------------------------------------------
@app.post("/api/auth/login")
def login_user(payload: LoginRequest):
    role = payload.role.upper()
    if role not in DEMO_PROFILES:
        raise HTTPException(status_code=400, detail="Invalid role specified")
    
    profile = DEMO_PROFILES[role]
    token = f"MH_GOV_TOKEN_{role}_{int(time.time())}"
    return {
        "success": True,
        "access_token": token,
        "token_type": "Bearer",
        "profile": profile
    }

@app.get("/api/auth/demo-users")
def get_demo_users():
    return {"demo_profiles": DEMO_PROFILES}

@app.get("/api/health")
def get_health():
    return {
        "status": "ONLINE",
        "platform": "MahaSetu Interoperability Platform v2.6",
        "authority": "Government of Maharashtra • Directorate of Information Technology",
        "connected_department_silos": [
            {"department": "REVENUE", "status": "ONLINE", "latency_ms": 38},
            {"department": "SOCIAL_WELFARE", "status": "ONLINE", "latency_ms": 44},
            {"department": "LAND_RECORDS", "status": "ONLINE", "latency_ms": 52}
        ],
        "total_ledger_blocks": len(LEDGER_BLOCKS),
        "timestamp": datetime.utcnow().isoformat() + "Z"
    }

@app.get("/api/silos/{dept_name}/records")
def get_silo_records(dept_name: str):
    dept = dept_name.upper()
    if dept == "REVENUE":
        return {"department": "REVENUE", "database_engine": "PostgreSQL 14 (Local Tahsildar Portal)", "records": REVENUE_SILO}
    elif dept == "SOCIAL_WELFARE":
        return {"department": "SOCIAL_WELFARE", "database_engine": "Oracle 19c (BARTI Registry)", "records": SOCIAL_WELFARE_SILO}
    elif dept == "LAND_RECORDS":
        return {"department": "LAND_RECORDS", "database_engine": "PostGIS (Mahabhulekh 7/12)", "records": LAND_RECORDS_SILO}
    else:
        raise HTTPException(status_code=404, detail="Department silo not found")

@app.get("/api/ledger/blocks")
def get_ledger_blocks():
    return {"total_blocks": len(LEDGER_BLOCKS), "blocks": LEDGER_BLOCKS}

@app.post("/api/ledger/verify")
def verify_ledger():
    if not LEDGER_BLOCKS:
        return {"is_valid": True, "message": "Ledger is empty"}
    
    for i in range(1, len(LEDGER_BLOCKS)):
        curr = LEDGER_BLOCKS[i]
        prev = LEDGER_BLOCKS[i - 1]
        
        # Pointer check
        if curr["previous_hash"] != prev["hash"]:
            return {
                "is_valid": False,
                "broken_index": i,
                "message": f"Pointer mismatch at Block #{i}",
                "expected": prev["hash"],
                "actual": curr["previous_hash"]
            }
        
        # Hash integrity check
        recalc = compute_block_hash(
            curr["index"], curr["timestamp"], curr["previous_hash"],
            curr["data_hash"], curr["actor"], curr["action"], curr["nonce"]
        )
        if curr["hash"] != recalc:
            return {
                "is_valid": False,
                "tampered_index": i,
                "message": f"Hash computation mismatch at Block #{i}",
                "expected": recalc,
                "actual": curr["hash"]
            }
            
    return {"is_valid": True, "message": f"All {len(LEDGER_BLOCKS)} blocks verified intact via SHA-256."}

# Static file serving for production
DIST_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "dist"))
if os.path.exists(DIST_DIR):
    app.mount("/assets", StaticFiles(directory=os.path.join(DIST_DIR, "assets")), name="assets")

    @app.get("/{full_path:path}")
    async def serve_frontend(full_path: str):
        file_path = os.path.join(DIST_DIR, full_path)
        if full_path and os.path.exists(file_path) and os.path.isfile(file_path):
            return FileResponse(file_path)
        return FileResponse(os.path.join(DIST_DIR, "index.html"))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
