import io
import pytest
from fastapi import status
from backend.app.services.pdf_service import extract_text_from_pdf, PDFExtractionError
from backend.app.workflows.rca_graph import compiled_rca_graph, _fallback_extract_incident


# -------------------------------------------------------------------------
# 1. Health Endpoint Tests
# -------------------------------------------------------------------------
def test_health_check(client):
    response = client.get("/api/v1/health")
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["status"] in ["healthy", "degraded"]
    assert "database" in data
    assert "ai_engine" in data
    assert data["ai_engine"]["provider"] == "Groq"


# -------------------------------------------------------------------------
# 2. PDF Service & Upload Tests
# -------------------------------------------------------------------------
def test_pdf_extraction_empty_bytes():
    with pytest.raises(PDFExtractionError) as exc_info:
        extract_text_from_pdf(b"")
    assert "empty" in str(exc_info.value).lower()


def test_pdf_extraction_invalid_magic_bytes():
    with pytest.raises(PDFExtractionError) as exc_info:
        extract_text_from_pdf(b"NOT_A_REAL_PDF_CONTENT")
    assert "not a valid pdf" in str(exc_info.value).lower()


def test_pdf_upload_endpoint_valid(client):
    with open("sample_data/sample_oos_impurity_incident.pdf", "rb") as f:
        pdf_bytes = f.read()

    response = client.post(
        "/api/v1/extractions",
        files={"file": ("sample_oos_impurity_incident.pdf", io.BytesIO(pdf_bytes), "application/pdf")}
    )
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["success"] is True
    assert data["source_type"] == "pdf"
    assert "ATC-2026-B09" in data["extracted_data"]["batch_number"]
    assert "Atorvastatin" in data["extracted_data"]["product_name"]
    assert data["extracted_data"]["actual_result"] is not None


def test_pdf_upload_invalid_extension(client):
    response = client.post(
        "/api/v1/extractions",
        files={"file": ("malicious.exe", io.BytesIO(b"%PDF-1.4 test"), "application/octet-stream")}
    )
    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert "only pdf documents" in response.json()["detail"].lower()


# -------------------------------------------------------------------------
# 3. Text and Email Intake Tests (Form-Data and JSON Payloads)
# -------------------------------------------------------------------------
def test_text_intake_success(client):
    with open("sample_data/sample_incident_text.txt", "r") as f:
        sample_text = f.read()

    response = client.post(
        "/api/v1/extractions",
        data={"source_type": "text", "content": sample_text}
    )
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["success"] is True
    assert data["source_type"] == "text"
    assert data["extracted_data"]["title"] is not None
    assert len(data["extracted_data"]["known_evidence"]) > 0


def test_text_intake_json_success(client):
    """Verifies that Pasted Text / Lab Notes sent as JSON from frontend succeeds."""
    with open("sample_data/sample_incident_text.txt", "r") as f:
        sample_text = f.read()

    response = client.post(
        "/api/v1/extractions",
        json={"source_type": "text", "content": sample_text}
    )
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["success"] is True
    assert data["source_type"] == "text"
    assert data["extracted_data"]["title"] is not None


def test_email_intake_success(client):
    with open("sample_data/sample_incident_email.txt", "r") as f:
        sample_email = f.read()

    response = client.post(
        "/api/v1/extractions",
        data={
            "source_type": "email",
            "content": sample_email,
            "subject": "[URGENT QA ESCALATION] Out-of-Specification Impurity D"
        }
    )
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["success"] is True
    assert data["source_type"] == "email"
    assert data["original_reference"] == "[URGENT QA ESCALATION] Out-of-Specification Impurity D"


def test_email_intake_json_success(client):
    """Verifies that Email Reports sent as JSON from frontend succeeds."""
    with open("sample_data/sample_incident_email.txt", "r") as f:
        sample_email = f.read()

    response = client.post(
        "/api/v1/extractions",
        json={
            "source_type": "email",
            "content": sample_email,
            "subject": "[URGENT QA ESCALATION] Out-of-Specification Impurity D"
        }
    )
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["success"] is True
    assert data["source_type"] == "email"
    assert data["original_reference"] == "[URGENT QA ESCALATION] Out-of-Specification Impurity D"


def test_empty_content_validation(client):
    response = client.post(
        "/api/v1/extractions",
        data={"source_type": "text", "content": "   "}
    )
    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert "content is empty" in response.json()["detail"].lower()


def test_empty_content_json_validation(client):
    """Verifies that empty and whitespace-only JSON input returns HTTP 400."""
    response = client.post(
        "/api/v1/extractions",
        json={"source_type": "text", "content": "   "}
    )
    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert "content is empty" in response.json()["detail"].lower()


# -------------------------------------------------------------------------
# 4. LangGraph Workflow Tests
# -------------------------------------------------------------------------
def test_langgraph_workflow_execution():
    test_state = {
        "source_type": "text",
        "original_metadata": {},
        "raw_text": "Product: Losartan Potassium. Batch: LP-2026-X1. Deviation: Foreign particulate matter detected during filtration. Equipment: FLT-09.",
        "retry_count": 0,
        "execution_log": []
    }
    result = compiled_rca_graph.invoke(test_state)
    assert result["workflow_status"] == "COMPLETED"
    assert "extracted_fields" in result
    assert len(result["missing_evidence"]) > 0
    assert len(result["five_whys"]) > 0
    assert len(result["potential_root_causes"]) > 0
    assert len(result["capa_recommendations"]) > 0

    # Strict safeguard: verify no cause is marked Investigator Confirmed by AI alone
    for cause in result["potential_root_causes"]:
        assert cause["status"] != "Investigator Confirmed"
        assert cause["is_human_confirmed"] is False


# -------------------------------------------------------------------------
# 5. RCA and Cause Confirmation Tests
# -------------------------------------------------------------------------
def test_rca_preview_generation_both(client):
    context = {
        "title": "Degradation Excursion",
        "product_name": "Atorvastatin API",
        "batch_number": "ATC-2026-B09",
        "observed_deviation": "Impurity D at 0.28%",
        "process_stage": "Vacuum Drying",
        "equipment_id": "ANFD-02"
    }
    response = client.post(
        "/api/v1/rca-preview",
        json={"incident_context": context, "method": "both"}
    )
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["method"] == "both"
    assert len(data["five_whys"]) >= 3
    assert len(data["fishbone_factors"]) >= 5
    assert len(data["potential_root_causes"]) >= 1


def test_rca_preview_generation_5whys_only(client):
    context = {
        "title": "Degradation Excursion",
        "product_name": "Atorvastatin API",
        "batch_number": "ATC-2026-B09",
        "observed_deviation": "Impurity D at 0.28%",
        "process_stage": "Vacuum Drying",
        "equipment_id": "ANFD-02"
    }
    response = client.post(
        "/api/v1/rca-preview",
        json={"incident_context": context, "method": "5whys"}
    )
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["method"] == "5whys"
    assert len(data["five_whys"]) >= 3
    # Strict requirement: 6M analysis must NOT be generated
    assert len(data["fishbone_factors"]) == 0
    assert len(data["potential_root_causes"]) >= 1


def test_rca_preview_generation_6m_only(client):
    context = {
        "title": "Degradation Excursion",
        "product_name": "Atorvastatin API",
        "batch_number": "ATC-2026-B09",
        "observed_deviation": "Impurity D at 0.28%",
        "process_stage": "Vacuum Drying",
        "equipment_id": "ANFD-02"
    }
    response = client.post(
        "/api/v1/rca-preview",
        json={"incident_context": context, "method": "fishbone"}
    )
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["method"] == "fishbone"
    # Strict requirement: 5 Whys analysis must NOT be generated
    assert len(data["five_whys"]) == 0
    assert len(data["fishbone_factors"]) >= 5
    assert len(data["potential_root_causes"]) >= 1


def test_investigation_rca_generation_by_methodology(client):
    # Create investigation
    create_res = client.post(
        "/api/v1/investigations",
        json={
            "title": "Methodology Test Investigation",
            "incident_number": "DEV-METH-001",
            "incident_description": "Yield loss during filtration due to membrane fouling",
            "product_name": "API Substance",
            "batch_number": "METH-001",
            "observed_deviation": "Yield loss during filtration",
            "status": "In Progress"
        }
    )
    assert create_res.status_code == status.HTTP_201_CREATED
    inv_id = create_res.json()["id"]

    # Trigger 5 Whys Only
    rca_5whys = client.post(
        f"/api/v1/investigations/{inv_id}/rca",
        json={"method": "5whys"}
    )
    assert rca_5whys.status_code == status.HTTP_200_OK
    d5 = rca_5whys.json()
    assert d5["method"] == "5whys"
    assert len(d5["five_whys"]) > 0
    assert len(d5["fishbone_factors"]) == 0

    # Trigger 6M Only (using 'fishbone' or '6m')
    rca_6m = client.post(
        f"/api/v1/investigations/{inv_id}/rca",
        json={"method": "6m"}
    )
    assert rca_6m.status_code == status.HTTP_200_OK
    d6 = rca_6m.json()
    assert d6["method"] == "fishbone"
    assert len(d6["five_whys"]) == 0
    assert len(d6["fishbone_factors"]) > 0

    # Trigger Both
    rca_both = client.post(
        f"/api/v1/investigations/{inv_id}/rca",
        json={"method": "both"}
    )
    assert rca_both.status_code == status.HTTP_200_OK
    dboth = rca_both.json()
    assert dboth["method"] == "both"
    assert len(dboth["five_whys"]) > 0
    assert len(dboth["fishbone_factors"]) > 0


# -------------------------------------------------------------------------
# 6. CAPA Recommendation Tests
# -------------------------------------------------------------------------
def test_capa_preview_generation(client):
    context = {
        "title": "Thermal degradation in dryer",
        "product_name": "Atorvastatin API",
        "batch_number": "ATC-2026-B09",
        "observed_deviation": "OOS Impurity D"
    }
    response = client.post(
        "/api/v1/capa-preview",
        json={"incident_context": context}
    )
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert len(data["actions"]) >= 2
    types = [a["action_type"] for a in data["actions"]]
    assert "Corrective" in types
    assert "Preventive" in types


# -------------------------------------------------------------------------
# 7. Complete Investigation Persistence, Retrieval, and Human Review Lifecycle
# -------------------------------------------------------------------------
def test_investigation_lifecycle_and_safeguards(client):
    # Step A: Create Investigation
    create_payload = {
        "title": "Automated Test API Investigation",
        "incident_number": "DEV-TEST-001",
        "incident_description": "Thermal degradation test incident",
        "product_name": "Semaglutide API",
        "batch_number": "SEM-TEST-01",
        "process_stage": "Lyophilization",
        "observed_deviation": "Moisture above 2.0%",
        "expected_specification": "<= 1.5%",
        "actual_result": "2.4%",
        "status": "Draft",
        "root_causes": [
            {
                "cause_code": "RC-01",
                "category": "Machine",
                "description": "Condenser vacuum pump vacuum seal leak",
                "status": "Proposed",
                "supporting_evidence": "Pressure log showed vacuum rise to 0.5 mbar"
            }
        ],
        "capa_actions": [
            {
                "action_code": "CAPA-C-01",
                "action_type": "Corrective",
                "description": "Replace condenser mechanical shaft seal",
                "rationale": "Restores lyophilizer vacuum integrity",
                "status": "Proposed"
            }
        ]
    }
    create_res = client.post("/api/v1/investigations", json=create_payload)
    assert create_res.status_code == status.HTTP_201_CREATED
    inv_data = create_res.json()
    inv_id = inv_data["id"]
    cause_id = inv_data["root_causes"][0]["id"]
    capa_id = inv_data["capa_actions"][0]["id"]

    # Step B: Retrieve Deep Record
    get_res = client.get(f"/api/v1/investigations/{inv_id}")
    assert get_res.status_code == status.HTTP_200_OK
    assert get_res.json()["title"] == "Automated Test API Investigation"
    assert len(get_res.json()["root_causes"]) == 1

    # Step C: Human Confirmation of Cause (Human Oversight Safeguard)
    confirm_payload = {
        "reviewer_name": "Dr. Quality Officer",
        "status": "Investigator Confirmed",
        "confirmation_notes": "Physical vacuum helium leak detector confirmed pump seal crack."
    }
    confirm_res = client.post(
        f"/api/v1/investigations/{inv_id}/rca/causes/{cause_id}/confirm",
        json=confirm_payload
    )
    assert confirm_res.status_code == status.HTTP_200_OK
    updated_cause = confirm_res.json()
    assert updated_cause["is_human_confirmed"] is True
    assert updated_cause["status"] == "Investigator Confirmed"
    assert updated_cause["confirmed_by"] == "Dr. Quality Officer"

    # Step D: Human Review of CAPA Action
    capa_review_payload = {
        "review_decision": "Accepted",
        "proposed_owner": "Maintenance Lead J. Smith",
        "target_due_date": "2026-11-01",
        "effectiveness_check_plan": "Helium vacuum leak rate < 1x10^-4 mbar*l/s"
    }
    capa_res = client.put(
        f"/api/v1/investigations/{inv_id}/capa/{capa_id}",
        json=capa_review_payload
    )
    assert capa_res.status_code == status.HTTP_200_OK
    assert capa_res.json()["review_decision"] == "Accepted"
    assert capa_res.json()["proposed_owner"] == "Maintenance Lead J. Smith"

    # Step E: Formal Investigation Signoff
    review_payload = {
        "reviewer_name": "Dr. Quality Officer",
        "decision": "Reviewed",
        "comments": "Root cause proven by helium testing. CAPA accepted."
    }
    review_res = client.post(f"/api/v1/investigations/{inv_id}/review", json=review_payload)
    assert review_res.status_code == status.HTTP_200_OK
    assert review_res.json()["status"] == "Reviewed"
    assert review_res.json()["reviewer_name"] == "Dr. Quality Officer"

    # Step F: Verify List contains the item
    list_res = client.get("/api/v1/investigations")
    assert list_res.status_code == status.HTTP_200_OK
    ids = [i["id"] for i in list_res.json()]
    assert inv_id in ids


def test_not_found_investigation(client):
    response = client.get("/api/v1/investigations/00000000-0000-0000-0000-000000000000")
    assert response.status_code == status.HTTP_404_NOT_FOUND
