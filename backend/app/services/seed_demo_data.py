from datetime import datetime
from backend.app.core.database import SessionLocal, init_db
from backend.app.models.investigation import Investigation
from backend.app.models.source_document import SourceDocument
from backend.app.models.evidence_item import EvidenceItem
from backend.app.models.root_cause import RootCause
from backend.app.models.capa_action import CapaAction
from backend.app.models.five_whys import FiveWhysStep
from backend.app.models.fishbone import FishboneFactor
from backend.app.models.review_event import ReviewEvent


def seed_demo_investigation():
    init_db()
    db = SessionLocal()
    try:
        # Check if already seeded
        existing = db.query(Investigation).filter(Investigation.incident_number == "DEV-2026-0841").first()
        if existing:
            print(f"Sample investigation already exists (ID: {existing.id}).")
            return existing.id

        inv = Investigation(
            incident_number="DEV-2026-0841",
            title="OOS Related Substance Impurity D on Finished Atorvastatin Calcium Trihydrate API",
            incident_description="Analytical QC release testing detected Impurity D at 0.28% (w/w), exceeding regulatory specification <= 0.15% (w/w). Subsequent engineering investigation of dryer ANFD-02 identified a thermal excursion to 58°C during vacuum drying cycle.",
            product_name="Atorvastatin Calcium Trihydrate API (USP/EP Grade)",
            batch_number="ATC-2026-B09",
            incident_date="2026-10-22",
            discovery_date="2026-10-23",
            process_stage="Stage 4: Crystallization, Filtration & Vacuum Drying",
            observed_deviation="Elevated Impurity D at 0.28% (w/w) exceeding specification NMT 0.15% (w/w).",
            expected_specification="NMT 0.15% (w/w)",
            actual_result="0.28% (w/w)",
            immediate_containment="All 12 drums quarantined under QA Hold in Warehouse 3 (Bay D-14). Dryer ANFD-02 locked out in SCADA. Raw material wash lot RAW-ETH-4029 quarantined.",
            equipment_id="Reactor CRYS-RX-04 / ANFD-02",
            material_lot_id="RAW-ETH-4029",
            process_parameters={
                "drying_temperature_target": "40°C ± 2°C",
                "drying_temperature_peak": "58°C",
                "excursion_duration_minutes": 45,
                "vacuum_pressure": "-0.095 MPa"
            },
            status="Under_Human_Review",
            reviewer_name="Dr. Sarah Thornton (QA Operations Lead)",
            reviewer_decision="Under Review",
            reviewer_comments="Preliminary engineering inspection points to stuck heating valve V-104. Awaiting teardown report.",
            reviewed_at=datetime.utcnow()
        )
        db.add(inv)
        db.flush()

        # Source doc
        db.add(SourceDocument(
            investigation_id=inv.id,
            source_type="pdf",
            original_filename="sample_oos_impurity_incident.pdf",
            file_size=2746,
            extracted_text="AIVOA PHARMACEUTICALS MANUFACTURING CORP. - API DEVIATION REPORT DEV-2026-0841...",
            metadata_json={"source": "Quality Control Laboratory"}
        ))

        # Missing Evidence Checklist
        evidence_records = [
            ("ANFD-02 Heating Jacket Valve V-104 Maintenance & Calibration Log", "ICH Q7 requires verified calibration of all process sensors and control elements impacting critical quality attributes.", "Machine / Valve Sticking", "Request maintenance engineering work order history and calibration records.", "Equipment Calibration Logs", "Requested"),
            ("Batch Production and Control Record (BPCR) Operator Log Sheet Pages 42-48", "Verify manual temperature setpoints, alarm acknowledgments, and operator interventions during drying.", "Man / Human Factor", "Retrieve physical executed BPCR from manufacturing archive.", "Batch Manufacturing Records", "Received"),
            ("Raw Material Certificate of Analysis (Ethanol Wash Lot: RAW-ETH-4029)", "Solvent purity or trace acidic impurities may accelerate ester hydrolysis during crystallization.", "Material Quality Variation", "Obtain QC raw material re-test data and vendor CoA.", "Raw Material CoA", "Missing"),
            ("Historical Process Capability & Trend Analysis (Last 20 Batches)", "Determine whether Impurity D is an isolated assignable cause or a creeping common cause trend.", "Process Capability", "Request Statistical Quality Control trend report from QA analytics.", "Analytical Testing Data", "Missing")
        ]
        for desc, why, cause, step, etype, stat in evidence_records:
            db.add(EvidenceItem(
                investigation_id=inv.id,
                item_description=desc,
                why_it_matters=why,
                related_cause_or_question=cause,
                recommended_next_step=step,
                evidence_type=etype,
                status=stat
            ))

        # 5 Whys
        whys_data = [
            (1, "Why did Batch ATC-2026-B09 fail release testing with Impurity D at 0.28%?", "Active ingredient underwent thermal degradation during the agitated vacuum drying cycle.", "HPLC chromatogram confirms degradation peak; thermal degradation kinetics of Atorvastatin above 50°C are documented.", True, "Confirmed", "Verify HPLC assay linearity and degradation pathway."),
            (2, "Why did thermal degradation occur in dryer ANFD-02?", "The product temperature in ANFD-02 reached 58°C, exceeding the validated range of 40°C ± 2°C for 45 minutes.", "ANFD-02 continuous temperature recorder strip shows temperature spike.", True, "Confirmed", "Cross-check secondary temperature sensor data."),
            (3, "Why did the temperature exceed the validated limit of 40°C?", "Heating water control valve V-104 remained 100% open despite temperature reaching setpoint.", "PLC event log shows close command dispatched at 14:22, but valve position feedback remained open.", False, "Hypothetical", "Inspect physical valve body and pneumatic actuator for mechanical bind."),
            (4, "Why did valve V-104 remain open after receiving a close signal?", "Pneumatic actuator air supply line had particulate buildup and diaphragm seal wear, causing mechanical sticking.", "Maintenance preliminary visual inspection noted particulate fouling in pilot regulator.", False, "Hypothetical", "Perform teardown inspection of actuator V-104."),
            (5, "Why was the mechanical seal wear not detected prior to batch processing?", "Preventive maintenance interval for valve V-104 actuator seals was scheduled annually rather than on a cycle-count basis.", "CMMS shows last overhaul was 11 months ago; high cycling during recent multi-product campaigns.", False, "Hypothetical", "Review reliability engineering PM schedule and cycle telemetry.")
        ]
        for num, q, a, ev, conf, stat, fup in whys_data:
            db.add(FiveWhysStep(
                investigation_id=inv.id,
                step_number=num,
                question=q,
                answer=a,
                supporting_evidence=ev,
                is_confirmed=conf,
                evidence_status=stat,
                follow_up_needed=fup
            ))

        # Fishbone Factors
        fishbone_data = [
            ("Machine", "Valve V-104 mechanical actuator sticking", "Pneumatic regulator fouled with particulate, preventing shutoff.", "PLC position feedback", "Key Factor"),
            ("Machine", "Temperature sensor calibration drift", "PT100 RTD sensor in dryer jacket may have calibration offset.", "Sensor log", "Investigated"),
            ("Method", "Drying cycle recipe parameters", "Validated drying cycle time 18 hours at 40°C vacuum.", "Batch record SOP-API-302", "Eliminated"),
            ("Material", "Solvent moisture content in wet cake", "Residual water in ethanol wash could catalyze hydrolysis.", "KF titration report", "Potential"),
            ("Measurement", "HPLC test method variability", "Analytical column age and mobile phase pH variation.", "QC system suitability log", "Eliminated"),
            ("Man", "Operator response time to high-temp alarm", "SCADA alarm acknowledged after 12 minutes delay.", "SCADA alarm audit trail", "Potential"),
            ("Environment", "Cleanroom humidity and ambient temperature", "ISO Class 8 cleanroom HVAC parameters within specification.", "BMS environmental log", "Eliminated")
        ]
        for cat, title, detail, link, stat in fishbone_data:
            db.add(FishboneFactor(
                investigation_id=inv.id,
                category=cat,
                factor_title=title,
                factor_detail=detail,
                evidence_link=link,
                status=stat
            ))

        # Root Causes (Grounded, not prematurely confirmed by AI)
        db.add(RootCause(
            investigation_id=inv.id,
            cause_code="RC-01",
            category="Machine",
            description="Mechanical sticking of pneumatic heating control valve V-104 on dryer ANFD-02 due to pilot regulator particulate fouling.",
            related_observation="Thermal excursion to 58°C during vacuum drying cycle.",
            supporting_evidence="PLC commanded valve closure at 14:22, but temperature continued rising; visual particulate observed on regulator.",
            contradicting_evidence=None,
            evidence_sufficiency="Supported by Evidence",
            status="Supported by Evidence",
            is_human_confirmed=False,
            recommended_verification="Perform bench pressure-decay test and actuator teardown in engineering shop.",
            model_confidence=0.88
        ))
        db.add(RootCause(
            investigation_id=inv.id,
            cause_code="RC-02",
            category="Man",
            description="Delayed operator acknowledgment and intervention following SCADA high-temperature alert.",
            related_observation="Temperature remained at 58°C for 45 minutes before manual emergency coolant override.",
            supporting_evidence="SCADA alarm log shows first alarm at 14:15, manual override logged at 15:00.",
            contradicting_evidence="Operator was attending simultaneous crystallization seeding in reactor CRYS-RX-04.",
            evidence_sufficiency="Insufficient Evidence",
            status="Proposed",
            is_human_confirmed=False,
            recommended_verification="Conduct interview with shift operators and review control room CCTV / logbooks.",
            model_confidence=0.76
        ))

        # CAPA Actions
        db.add(CapaAction(
            investigation_id=inv.id,
            action_code="CAPA-C-01",
            action_type="Corrective",
            description="Formal quarantine and rejection/re-work feasibility assessment of batch ATC-2026-B09 under QA Material Review Board.",
            rationale="Prevents unauthorized distribution of non-conforming API exceeding Impurity D release limits.",
            related_cause_id="RC-01",
            proposed_owner="QA Operations Lead",
            target_due_date="2026-10-30",
            status="Accepted",
            effectiveness_check_plan="100% reconciliation of batch container seals and QA Quarantine ERP lock verification.",
            review_decision="Accepted"
        ))
        db.add(CapaAction(
            investigation_id=inv.id,
            action_code="CAPA-C-02",
            action_type="Corrective",
            description="Teardown, overhaul, and replacement of pneumatic valve V-104 actuator and pilot regulator on dryer ANFD-02.",
            rationale="Restores equipment mechanical integrity prior to any further batch processing.",
            related_cause_id="RC-01",
            proposed_owner="Maintenance Engineering Lead",
            target_due_date="2026-10-28",
            status="Accepted",
            effectiveness_check_plan="Post-maintenance 50-cycle automated valve travel and stroke-time test with zero sticking.",
            review_decision="Accepted"
        ))
        db.add(CapaAction(
            investigation_id=inv.id,
            action_code="CAPA-P-01",
            action_type="Preventive",
            description="Implement automated SCADA hard interlock to cut heating steam supply and sound audible beacon if product temperature exceeds 44°C.",
            rationale="Eliminates reliance on manual operator observation during high-workload shift transitions.",
            related_cause_id="RC-02",
            proposed_owner="Process Automation Engineer",
            target_due_date="2026-11-15",
            status="Proposed",
            effectiveness_check_plan="Simulated thermal trip test during commissioning; verify cut-off response within 15 seconds.",
            review_decision="Pending"
        ))
        db.add(CapaAction(
            investigation_id=inv.id,
            action_code="CAPA-P-02",
            action_type="Preventive",
            description="Revise Preventive Maintenance SOP PM-DRY-012 from calendar-based (annual) to cycle-count based (every 500 batches or 6 months).",
            rationale="Addresses seal wear degradation caused by accelerated campaign utilization.",
            related_cause_id="RC-01",
            proposed_owner="Reliability Engineering Manager",
            target_due_date="2026-11-20",
            status="Proposed",
            effectiveness_check_plan="Audit CMMS work order generation at 6-month review; verify zero unassigned maintenance overdue flags.",
            review_decision="Pending"
        ))

        # Initial Review Event
        db.add(ReviewEvent(
            investigation_id=inv.id,
            event_type="DEMO_SEEDED",
            actor="System Setup",
            change_summary="Seeded baseline demonstration investigation DEV-2026-0841 for pharmaceutical API RCA."
        ))

        db.commit()
        print(f"Successfully seeded demo investigation DEV-2026-0841 (ID: {inv.id}).")
        return inv.id
    finally:
        db.close()


if __name__ == "__main__":
    seed_demo_investigation()
