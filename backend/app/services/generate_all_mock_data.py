import os
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle

OUTPUT_DIR = "sample_data"
os.makedirs(OUTPUT_DIR, exist_ok=True)

# -------------------------------------------------------------------------
# PDF Generator Helper
# -------------------------------------------------------------------------
def create_pharma_pdf(filepath, meta, results, narrative, containment, signatures):
    doc = SimpleDocTemplate(
        filepath,
        pagesize=letter,
        rightMargin=36,
        leftMargin=36,
        topMargin=36,
        bottomMargin=36
    )
    styles = getSampleStyleSheet()

    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontSize=15,
        leading=18,
        textColor=colors.HexColor('#0F172A'),
        alignment=1,
        spaceAfter=8
    )
    header_style = ParagraphStyle(
        'HeaderStyle',
        parent=styles['Normal'],
        fontSize=8.5,
        leading=11,
        textColor=colors.HexColor('#64748B'),
        alignment=1
    )
    section_style = ParagraphStyle(
        'SectionHeader',
        parent=styles['Heading2'],
        fontSize=11,
        leading=15,
        textColor=colors.HexColor('#0F172A'),
        spaceBefore=8,
        spaceAfter=4
    )
    body_style = ParagraphStyle(
        'BodyDark',
        parent=styles['Normal'],
        fontSize=8.5,
        leading=12,
        textColor=colors.HexColor('#334155')
    )
    body_bold = ParagraphStyle(
        'BodyBold',
        parent=styles['Normal'],
        fontSize=8.5,
        leading=12,
        textColor=colors.HexColor('#0F172A'),
        fontName='Helvetica-Bold'
    )

    elements = []

    # Header
    elements.append(Paragraph("AIVOA PHARMACEUTICALS MANUFACTURING CORP.", header_style))
    elements.append(Paragraph("GLOBAL QUALITY OPERATIONS & COMPLIANCE DIVISION", header_style))
    elements.append(Spacer(1, 3))
    elements.append(Paragraph("PHARMACEUTICAL API QUALITY DEVIATION & INVESTIGATION REPORT", title_style))
    elements.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor('#0284C7'), spaceAfter=8))

    # Meta Table
    meta_table_data = [
        [Paragraph("Deviation Number:", body_bold), Paragraph(meta["deviation_no"], body_style), Paragraph("Classification:", body_bold), Paragraph(meta["classification"], body_style)],
        [Paragraph("Product / API Name:", body_bold), Paragraph(meta["product_name"], body_style), Paragraph("Batch / Lot Number:", body_bold), Paragraph(meta["batch_no"], body_style)],
        [Paragraph("Manufacturing Stage:", body_bold), Paragraph(meta["stage"], body_style), Paragraph("Equipment Tag:", body_bold), Paragraph(meta["equipment"], body_style)],
        [Paragraph("Date of Occurrence:", body_bold), Paragraph(meta["date_occurred"], body_style), Paragraph("Date of Discovery:", body_bold), Paragraph(meta["date_discovered"], body_style)],
        [Paragraph("Material / Lot ID:", body_bold), Paragraph(meta["material_lot"], body_style), Paragraph("Reporting Unit:", body_bold), Paragraph(meta["reporting_unit"], body_style)],
    ]
    meta_table = Table(meta_table_data, colWidths=[110, 160, 110, 160])
    meta_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#F8FAFC')),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#CBD5E1')),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
        ('LEFTPADDING', (0,0), (-1,-1), 5),
        ('RIGHTPADDING', (0,0), (-1,-1), 5),
    ]))
    elements.append(meta_table)
    elements.append(Spacer(1, 8))

    # Section 1: Analytical Results Table
    elements.append(Paragraph("1. OBSERVED DEVIATION & ANALYTICAL TEST RESULTS", section_style))
    res_table_data = [
        [Paragraph("Test Parameter", body_bold), Paragraph("Regulatory Specification", body_bold), Paragraph("Observed Lab Result", body_bold), Paragraph("Test Methodology / Instrument", body_bold)]
    ]
    for row in results:
        is_oos = row.get("is_oos", False)
        result_para = Paragraph(
            row["result"],
            ParagraphStyle('Alert', parent=body_bold, textColor=colors.HexColor('#DC2626')) if is_oos else body_style
        )
        res_table_data.append([
            Paragraph(row["param"], body_style),
            Paragraph(row["spec"], body_bold if is_oos else body_style),
            result_para,
            Paragraph(row["method"], body_style)
        ])
    res_table = Table(res_table_data, colWidths=[150, 110, 140, 140])
    res_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#E2E8F0')),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#94A3B8')),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
    ]))
    elements.append(res_table)
    elements.append(Spacer(1, 8))

    # Section 2: Chronology Narrative
    elements.append(Paragraph("2. INCIDENT CHRONOLOGY & FORENSIC NARRATIVE", section_style))
    elements.append(Paragraph(narrative, body_style))
    elements.append(Spacer(1, 8))

    # Section 3: Immediate Containment
    elements.append(Paragraph("3. IMMEDIATE CONTAINMENT ACTIONS TAKEN", section_style))
    elements.append(Paragraph(containment.replace("\n", "<br/>"), body_style))
    elements.append(Spacer(1, 10))

    # Signatures
    sig_data = [
        [Paragraph("Prepared by:", body_bold), Paragraph(signatures["prepared"], body_style), Paragraph(signatures["date_prep"], body_style)],
        [Paragraph("Verified by:", body_bold), Paragraph(signatures["verified"], body_style), Paragraph(signatures["date_ver"], body_style)],
        [Paragraph("QA Approval:", body_bold), Paragraph(signatures["qa"], body_style), Paragraph("Status: PENDING ROOT CAUSE ANALYSIS", body_bold)]
    ]
    sig_table = Table(sig_data, colWidths=[90, 250, 200])
    sig_table.setStyle(TableStyle([
        ('LINEABOVE', (0,0), (-1,-1), 0.5, colors.HexColor('#94A3B8')),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
    ]))
    elements.append(sig_table)

    doc.build(elements)


# -------------------------------------------------------------------------
# 10 Unique PDF Incidents Data Definitions
# -------------------------------------------------------------------------
pdf_incidents = [
    {
        "filename": "incident_pdf_01_atorvastatin_impurity_d.pdf",
        "meta": {
            "deviation_no": "DEV-2026-0841",
            "classification": "Major / Critical Quality Attribute (CQA)",
            "product_name": "Atorvastatin Calcium Trihydrate API (USP/EP Grade)",
            "batch_no": "ATC-2026-B09",
            "stage": "Stage 4: Crystallization, Filtration & Vacuum Drying",
            "equipment": "Reactor CRYS-RX-04 / Filter-Dryer ANFD-02",
            "date_occurred": "2026-10-22 14:15 UTC",
            "date_discovered": "2026-10-23 09:30 UTC",
            "material_lot": "Ethanol Wash RAW-ETH-4029",
            "reporting_unit": "QC Analytical Testing Laboratory"
        },
        "results": [
            {"param": "Related Substance: Impurity D", "spec": "NMT 0.15% (w/w)", "result": "0.28% (w/w) [OOS]", "method": "USP HPLC (Waters Alliance #HPLC-8812)", "is_oos": True},
            {"param": "Assay (Anhydrous Basis)", "spec": "98.0% - 102.0%", "result": "99.4%", "method": "HPLC UV Detection at 246 nm", "is_oos": False},
            {"param": "Water Content (Karl Fischer)", "spec": "3.5% - 5.5%", "result": "4.1%", "method": "Mettler Toledo V30S Titrator", "is_oos": False},
            {"param": "Residual Ethanol", "spec": "NMT 5000 ppm", "result": "1820 ppm", "method": "Headspace GC-FID", "is_oos": False}
        ],
        "narrative": "During final release testing of Atorvastatin Calcium Trihydrate API Batch ATC-2026-B09, QC analyst reported Impurity D at 0.28% (w/w), exceeding the specification limit of <= 0.15% (w/w). Phase 1 laboratory investigation confirmed no testing fault. Inspection of ANFD-02 revealed that during vacuum drying sequence at 14:15, jacket heating control valve V-104 failed to throttle closed. Temperature spiked to 58°C and remained elevated for 45 minutes before manual operator override.",
        "containment": "1. All 12 fiberboard drums of Batch ATC-2026-B09 placed on QA Quarantine status in Warehouse 3.\n2. Dryer ANFD-02 locked out in SCADA; heating valve actuator isolated for mechanical inspection.\n3. Raw material solvent ethanol lot RAW-ETH-4029 quarantined.",
        "signatures": {"prepared": "R. Patel (QC Senior Chemist)", "date_prep": "2026-10-23", "verified": "M. Vance (Production Manager)", "date_ver": "2026-10-23", "qa": "Dr. S. Thornton (QA Lead)"}
    },
    {
        "filename": "incident_pdf_02_losartan_residual_solvent.pdf",
        "meta": {
            "deviation_no": "DEV-2026-0914",
            "classification": "Major / Critical Quality Attribute (CQA)",
            "product_name": "Losartan Potassium API (USP Grade)",
            "batch_no": "LSP-2026-042",
            "stage": "Stage 5: Final Rotary Vacuum Paddle Drying",
            "equipment": "Paddle Dryer RVPD-01 / Condenser COND-02",
            "date_occurred": "2026-10-21 04:30 UTC",
            "date_discovered": "2026-10-22 11:00 UTC",
            "material_lot": "Dichloromethane Pure RAW-DCM-882",
            "reporting_unit": "QC Organic Volatile Impurities Lab"
        },
        "results": [
            {"param": "Residual Methylene Chloride (DCM)", "spec": "NMT 600 ppm (ICH Q3C Class 2)", "result": "840 ppm [OOS]", "method": "Headspace Gas Chromatography GC-FID-04", "is_oos": True},
            {"param": "Residual Acetone", "spec": "NMT 5000 ppm", "result": "1200 ppm", "method": "Headspace GC-FID", "is_oos": False},
            {"param": "Assay (Potassium Basis)", "spec": "98.5% - 101.5%", "result": "99.8%", "method": "Potentiometric Titration", "is_oos": False},
            {"param": "Heavy Metals", "spec": "NMT 10 ppm", "result": "< 5 ppm", "method": "ICP-OES", "is_oos": False}
        ],
        "narrative": "Residual solvent testing by headspace GC-FID on Losartan Potassium batch LSP-2026-042 showed dichloromethane at 840 ppm, exceeding the ICH Q3C threshold of 600 ppm. Investigation into RVPD-01 identified that secondary vacuum condenser glycol chiller tripped offline at 04:30 UTC due to high head pressure. Exhaust gas condensation efficiency collapsed from 96% to 42%, preventing complete desolvation.",
        "containment": "1. Batch LSP-2026-042 (850 kg) quarantined in double poly-lined drums.\n2. Chiller unit CHL-02 compressor reset and scheduled for immediate freon leak inspection.\n3. Re-drying protocol feasibility assessment initiated by Process Tech Transfer.",
        "signatures": {"prepared": "D. Chen (QC Specialist)", "date_prep": "2026-10-22", "verified": "K. Kowalski (Plant Ops)", "date_ver": "2026-10-22", "qa": "Dr. E. Gomez (Quality Assurance)"}
    },
    {
        "filename": "incident_pdf_03_semaglutide_dimer_formation.pdf",
        "meta": {
            "deviation_no": "DEV-2026-1002",
            "classification": "Critical / Biological API Purity (CQA)",
            "product_name": "Semaglutide Synthetic Peptide API",
            "batch_no": "SEM-2026-081",
            "stage": "Stage 6: Preparative RP-HPLC & Lyophilization",
            "equipment": "Prep-HPLC Skid PREP-LC-03 / Lyophilizer LYO-02",
            "date_occurred": "2026-10-20 18:00 UTC",
            "date_discovered": "2026-10-22 14:20 UTC",
            "material_lot": "Ammonium Bicarbonate Lot ABC-4410",
            "reporting_unit": "Biologics Analytical Quality Control"
        },
        "results": [
            {"param": "High Molecular Weight Impurities (HMWI / Dimer)", "spec": "NMT 0.80% (Area %)", "result": "1.45% (Area %) [OOS]", "method": "Size Exclusion Chromatography SEC-HPLC-01", "is_oos": True},
            {"param": "Purity by RP-HPLC", "spec": "NLT 98.0%", "result": "96.8%", "method": "Reverse Phase C18 HPLC", "is_oos": True},
            {"param": "Peptide Content", "spec": "85.0% - 95.0%", "result": "88.4%", "method": "Kjeldahl Nitrogen Titration", "is_oos": False},
            {"param": "Endotoxin Level", "spec": "NMT 5.0 EU/mg", "result": "0.45 EU/mg", "method": "LAL Kinetic Turbidimetric", "is_oos": False}
        ],
        "narrative": "Size Exclusion Chromatography (SEC) analysis of purified Semaglutide peptide batch SEM-2026-081 revealed covalent dimer and multimer formation at 1.45%, exceeding the 0.80% release limit. Buffer preparation records show Mobile Phase B (ammonium bicarbonate buffer) was held at 24°C room temperature for 72 hours instead of validated 24 hours at 2-8°C, leading to CO2 off-gassing, pH shift from 7.5 to 8.7, and accelerated inter-chain disulfide exchange.",
        "containment": "1. Lyophilized peptide bulk (3.2 kg) placed under restricted cold quarantine (-20°C Vault).\n2. PREP-LC-03 buffer feed manifolds flushed and sanitized.\n3. Buffer shelf-life SOP SOP-BUF-041 flagged for urgent revision.",
        "signatures": {"prepared": "Dr. L. Zhang (QC Biologics Lead)", "date_prep": "2026-10-22", "verified": "A. Dubois (Downstream Lead)", "date_ver": "2026-10-22", "qa": "Dr. S. Thornton (QA Lead)"}
    },
    {
        "filename": "incident_pdf_04_paracetamol_discoloration.pdf",
        "meta": {
            "deviation_no": "DEV-2026-1055",
            "classification": "Moderate / Physical Appearance & Color",
            "product_name": "Acetaminophen (Paracetamol) Micropowder API",
            "batch_no": "APAP-2026-118",
            "stage": "Stage 3: Decolorization & Crystallization",
            "equipment": "Decolorization Tank TK-201 / Filter Press FP-02",
            "date_occurred": "2026-10-19 22:10 UTC",
            "date_discovered": "2026-10-20 08:30 UTC",
            "material_lot": "Activated Carbon Norit A-CA-2201",
            "reporting_unit": "Physical Testing & Raw Quality Lab"
        },
        "results": [
            {"param": "Appearance of Solution (400 nm Absorbance)", "spec": "Absorbance NMT 0.030 AU", "result": "0.082 AU [OOS]", "method": "Spectrophotometric UV-Vis 400nm", "is_oos": True},
            {"param": "Powder Appearance", "spec": "Pure white crystalline powder", "result": "Slight pink / off-white tint", "method": "Visual Inspection against white tile", "is_oos": True},
            {"param": "Assay (HPLC)", "spec": "99.0% - 101.0%", "result": "99.7%", "method": "USP HPLC 243nm", "is_oos": False},
            {"param": "Related Substance: 4-Aminophenol", "spec": "NMT 50 ppm", "result": "38 ppm", "method": "HPLC Ion Pair", "is_oos": False}
        ],
        "narrative": "Visual examination of Acetaminophen API batch APAP-2026-118 showed an abnormal pinkish tint, and solution absorbance at 400 nm was 0.082 AU (limit NMT 0.030 AU). Investigation of filter press FP-02 showed bypass tearing in plate gasket #4, allowing unadsorbed trace polymeric quinoid chromophores and 4-aminophenol oxidation complexes to pass downstream into the crystallization vessel.",
        "containment": "1. 2,400 kg of bulk crystallized Paracetamol placed under quarantine warehouse lock.\n2. Filter press FP-02 dismantled; ruptured gasket #4 tagged and retained as forensic evidence.\n3. Preventive carbon filter post-filtration membrane integrity test instituted.",
        "signatures": {"prepared": "S. Tanaka (QC Analyst)", "date_prep": "2026-10-20", "verified": "J. Brennan (Production)", "date_ver": "2026-10-20", "qa": "M. Al-Mansoor (Quality Assurance)"}
    },
    {
        "filename": "incident_pdf_05_metformin_particulate_matter.pdf",
        "meta": {
            "deviation_no": "DEV-2026-1109",
            "classification": "Critical / Foreign Particulate Contamination",
            "product_name": "Metformin Hydrochloride API (USP/BP)",
            "batch_no": "MET-2026-904",
            "stage": "Stage 4: Fluid Bed Drying & Particle Conditioning",
            "equipment": "Fluid Bed Dryer FBD-04 / Sifter SFT-01",
            "date_occurred": "2026-10-18 16:45 UTC",
            "date_discovered": "2026-10-19 10:15 UTC",
            "material_lot": "In-process Granular Wet Cake LOT-W-881",
            "reporting_unit": "In-Process Physical Quality Assurance"
        },
        "results": [
            {"param": "Visible Foreign Particulate Matter", "spec": "Zero visible foreign particles", "result": "Metallic micro-filaments detected [OOS]", "method": "Stereomicroscopy & Optical Inspection", "is_oos": True},
            {"param": "Loss on Drying (LOD)", "spec": "NMT 0.50%", "result": "0.22%", "method": "Halogen Moisture Analyzer 105°C", "is_oos": False},
            {"param": "Assay (Dry Basis)", "spec": "98.5% - 101.0%", "result": "99.9%", "method": "Potentiometric Titration with HClO4", "is_oos": False},
            {"param": "Related Substance: Dicyandiamide", "spec": "NMT 0.02%", "result": "< 0.005%", "method": "HPLC Ion Exchange", "is_oos": False}
        ],
        "narrative": "Routine optical microscopy during sifting of Metformin HCl batch MET-2026-904 detected 7 metallic wire fragments (0.4 mm to 1.2 mm). SEM-EDX elemental analysis confirmed the composition as 316L stainless steel. Visual inspection inside Fluid Bed Dryer FBD-04 discovered mechanical rubbing between the air distribution rotating agitator blade and the lower perforated bottom retention screen.",
        "containment": "1. Complete batch MET-2026-904 (3,500 kg) quarantined under physical red tag lock.\n2. FBD-04 dryer red-tagged; maintenance work order issued for agitator shaft realignment.\n3. Preceding and succeeding batches quarantined for 100% magnetic and optical sifter audit.",
        "signatures": {"prepared": "H. Schmidt (QC Physical QA)", "date_prep": "2026-10-19", "verified": "P. O'Connor (Maintenance Lead)", "date_ver": "2026-10-19", "qa": "Dr. S. Thornton (QA Lead)"}
    },
    {
        "filename": "incident_pdf_06_montelukast_polymorphic_failure.pdf",
        "meta": {
            "deviation_no": "DEV-2026-1182",
            "classification": "Major / Polymorphic Crystal Form (CQA)",
            "product_name": "Montelukast Sodium API (Ph. Eur.)",
            "batch_no": "MTK-2026-215",
            "stage": "Stage 4: Anti-Solvent Crystallization & Nucleation",
            "equipment": "Crystallizer CRYS-01 / Slurry Pump PMP-102",
            "date_occurred": "2026-10-17 11:20 UTC",
            "date_discovered": "2026-10-18 15:40 UTC",
            "material_lot": "Heptane Anhydrous RAW-HEP-901",
            "reporting_unit": "Solid State Characterization Laboratory"
        },
        "results": [
            {"param": "Polymorphic Form Purity (XRPD)", "spec": "Form I Crystalline NLT 95.0%", "result": "84.2% Form I (15.8% Amorphous) [OOS]", "method": "X-Ray Powder Diffraction (Bruker D8)", "is_oos": True},
            {"param": "Differential Scanning Calorimetry (DSC)", "spec": "Sharp melting peak 135°C - 138°C", "result": "Broad glass transition at 78°C [OOS]", "method": "TA Instruments DSC 2500", "is_oos": True},
            {"param": "Assay (Anhydrous)", "spec": "98.0% - 102.0%", "result": "99.1%", "method": "HPLC 280nm", "is_oos": False},
            {"param": "Specific Optical Rotation", "spec": "+80.0° to +86.0°", "result": "+83.2°", "method": "Polarimeter 589nm", "is_oos": False}
        ],
        "narrative": "XRPD solid-state profiling of Montelukast Sodium batch MTK-2026-215 revealed incomplete crystal lattice formation with 15.8% amorphous phase, failing the crystalline specification of NLT 95.0%. Review of SCADA historian records revealed that heptane anti-solvent addition valve FV-102 suffered an automated flow meter calibration error, dumping 45 L/min instead of ramped addition of 15 L/min at 10°C, inducing crash nucleation instead of controlled seed growth.",
        "containment": "1. Batch MTK-2026-215 (420 kg) placed on QA hold in conditioned warehouse storage.\n2. Flow control loop on CRYS-01 re-calibrated and locked into supervisory control.\n3. Recrystallization rework protocol submitted to QA for regulatory risk review.",
        "signatures": {"prepared": "Dr. N. Rossi (Solid State Chemist)", "date_prep": "2026-10-18", "verified": "G. Bell (Plant Supervisor)", "date_ver": "2026-10-18", "qa": "Dr. E. Gomez (QA Director)"}
    },
    {
        "filename": "incident_pdf_07_ciprofloxacin_water_content_oos.pdf",
        "meta": {
            "deviation_no": "DEV-2026-1230",
            "classification": "Major / Water of Hydration Content (CQA)",
            "product_name": "Ciprofloxacin Monohydrochloride Monohydrate API",
            "batch_no": "CIP-2026-304",
            "stage": "Stage 4: Centrifugal Isolation & Atmospheric Drying",
            "equipment": "Peeler Centrifuge CF-03 / Vacuum Dryer VCD-01",
            "date_occurred": "2026-10-16 07:15 UTC",
            "date_discovered": "2026-10-17 13:00 UTC",
            "material_lot": "Wash Water Purified WTR-PW-449",
            "reporting_unit": "QC Chemical Analysis Laboratory"
        },
        "results": [
            {"param": "Water Content by Karl Fischer", "spec": "4.7% - 6.7% (Monohydrate state)", "result": "7.8% (w/w) [OOS]", "method": "Coulometric Karl Fischer Titration", "is_oos": True},
            {"param": "Chromatographic Purity (HPLC)", "spec": "Total Impurities NMT 0.50%", "result": "0.18%", "method": "Ph. Eur. HPLC Method", "is_oos": False},
            {"param": "Assay (Titrimetric)", "spec": "98.0% - 102.0%", "result": "99.3%", "method": "Non-aqueous titration with HClO4", "is_oos": False},
            {"param": "Residue on Ignition", "spec": "NMT 0.10%", "result": "0.04%", "method": "Sulfated Ash 600°C", "is_oos": False}
        ],
        "narrative": "Karl Fischer titration for Ciprofloxacin HCl Monohydrate batch CIP-2026-304 yielded water content of 7.8%, exceeding the monohydrate theoretical boundary of 6.7%. Investigation of peeler centrifuge CF-03 wash manifold demonstrated that cake wash spray nozzle #2 had clogged, causing uneven displacement of mother liquor and leaving excessive surface water and hygroscopic mother liquor trapped within the lower centrifuge cake layer.",
        "containment": "1. 1,800 kg of Ciprofloxacin HCl quarantined in sealed polyethylene fiber drums.\n2. Centrifuge CF-03 wash spray header dismounted for ultrasonic cleaning and spray pattern validation.\n3. Fluidized bed finish drying re-pass authorized under Deviation Protocol DEV-1230-DP.",
        "signatures": {"prepared": "F. Moreau (QC Analyst)", "date_prep": "2026-10-17", "verified": "J. Brennan (Production Manager)", "date_ver": "2026-10-17", "qa": "Dr. S. Thornton (QA Lead)"}
    },
    {
        "filename": "incident_pdf_08_apixaban_particle_size_drift.pdf",
        "meta": {
            "deviation_no": "DEV-2026-1299",
            "classification": "Critical / Particle Size Distribution (PSD)",
            "product_name": "Apixaban Micronized API (USP)",
            "batch_no": "APX-2026-512",
            "stage": "Stage 5: Fluid Energy Jet Milling & Packaging",
            "equipment": "Spiral Jet Mill JM-02 / Malvern Mastersizer 3000",
            "date_occurred": "2026-10-15 15:30 UTC",
            "date_discovered": "2026-10-16 11:25 UTC",
            "material_lot": "Unmicronized Feed Cake LOT-APX-U512",
            "reporting_unit": "Particle Characterization Unit"
        },
        "results": [
            {"param": "Particle Size: d90", "spec": "d90 NMT 25.0 μm", "result": "42.6 μm [OOS]", "method": "Laser Diffraction (Malvern Mastersizer)", "is_oos": True},
            {"param": "Particle Size: d50", "spec": "d50 NMT 10.0 μm", "result": "18.4 μm [OOS]", "method": "Laser Diffraction Dry Dispersion", "is_oos": True},
            {"param": "Particle Size: d10", "spec": "d10 NMT 3.0 μm", "result": "2.8 μm", "method": "Laser Diffraction", "is_oos": False},
            {"param": "Assay (Anhydrous)", "spec": "98.0% - 102.0%", "result": "100.2%", "method": "HPLC UV 254nm", "is_oos": False}
        ],
        "narrative": "Laser diffraction particle sizing on micronized Apixaban batch APX-2026-512 revealed coarse particle distribution with d90 of 42.6 μm versus specification <= 25.0 μm. Jet mill JM-02 pneumatic telemetry demonstrated that the primary high-pressure nitrogen grinding regulator experienced a diaphragm rupture at 15:30 UTC, causing nitrogen grinding pressure to drop from 7.5 bar to 4.8 bar while feed rate remained continuous at 12 kg/hr.",
        "containment": "1. 350 kg of micronized Apixaban in 14 fiber drums placed under QA hold.\n2. Jet mill JM-02 locked out; replacement of pressure regulator REG-02 completed.\n3. Automated low-pressure grinding cut-off interlock recommended for engineering design.",
        "signatures": {"prepared": "T. Larsson (Particle Physicist)", "date_prep": "2026-10-16", "verified": "M. Vance (Production)", "date_ver": "2026-10-16", "qa": "Dr. E. Gomez (QA Lead)"}
    },
    {
        "filename": "incident_pdf_09_rosuvastatin_enantiomeric_purity.pdf",
        "meta": {
            "deviation_no": "DEV-2026-1350",
            "classification": "Critical / Chiral & Enantiomeric Purity (CQA)",
            "product_name": "Rosuvastatin Calcium API (USP/EP)",
            "batch_no": "RSV-2026-077",
            "stage": "Stage 2: Asymmetric Catalytic Hydrogenation",
            "equipment": "High-Pressure Autoclave HYD-01 / Chiral HPLC",
            "date_occurred": "2026-10-14 09:00 UTC",
            "date_discovered": "2026-10-15 16:15 UTC",
            "material_lot": "Tetrahydrofuran Anhydrous RAW-THF-110",
            "reporting_unit": "QC Chiral Separations Laboratory"
        },
        "results": [
            {"param": "Enantiomeric Purity (3R,5S-Enantiomer)", "spec": "NLT 99.5% ee", "result": "98.1% ee [OOS]", "method": "Chiralpak AD-H Chiral HPLC", "is_oos": True},
            {"param": "Unwanted (3S,5R)-Diastereomer", "spec": "NMT 0.20%", "result": "1.42% [OOS]", "method": "Chiral HPLC UV 242nm", "is_oos": True},
            {"param": "Assay (Rosuvastatin Calcium)", "spec": "98.0% - 102.0%", "result": "98.8%", "method": "HPLC", "is_oos": False},
            {"param": "Total Other Related Substances", "spec": "NMT 0.50%", "result": "0.31%", "method": "Reverse Phase HPLC", "is_oos": False}
        ],
        "narrative": "Chiral HPLC analysis of intermediate Rosuvastatin ester batch RSV-2026-077 indicated enantiomeric purity dropped to 98.1% ee with 1.42% of the enantiomeric impurity. Investigation revealed raw reagent tetrahydrofuran lot RAW-THF-110 contained 45 ppm of dimethyl sulfide stabilizer residue that poisoned the chiral ruthenium Ru-(S)-BINAP catalyst, lowering stereoselective facial coordination during ketone reduction.",
        "containment": "1. Entire reaction mass (1,200 L) held in tank TK-HYD-01 under nitrogen blanket.\n2. Raw material vendor quarantine placed on THF lot RAW-THF-110.\n3. Sulfur trace screening added to raw solvent release testing protocol.",
        "signatures": {"prepared": "Dr. V. Kulkarni (Chiral QC Lead)", "date_prep": "2026-10-15", "verified": "A. Dubois (Chemical Synthesis)", "date_ver": "2026-10-15", "qa": "Dr. S. Thornton (QA Lead)"}
    },
    {
        "filename": "incident_pdf_10_azithromycin_heavy_metals_palladium.pdf",
        "meta": {
            "deviation_no": "DEV-2026-1411",
            "classification": "Critical / Elemental Impurities (ICH Q3D)",
            "product_name": "Azithromycin Dihydrate API (USP/EP)",
            "batch_no": "AZM-2026-640",
            "stage": "Stage 4: Palladium Scavenging & Crystallization",
            "equipment": "Scavenger Column SCV-01 / Agilent 7900 ICP-MS",
            "date_occurred": "2026-10-13 19:40 UTC",
            "date_discovered": "2026-10-14 17:00 UTC",
            "material_lot": "Silica Thiol Scavenger Resin SIL-THI-304",
            "reporting_unit": "Trace Elemental Spectroscopy Lab"
        },
        "results": [
            {"param": "Elemental Impurity: Palladium (Pd)", "spec": "NMT 10.0 ppm (ICH Q3D Oral PDE)", "result": "18.2 ppm [OOS]", "method": "ICP-MS with Microwave Digestion", "is_oos": True},
            {"param": "Elemental Impurity: Nickel (Ni)", "spec": "NMT 20.0 ppm", "result": "1.2 ppm", "method": "ICP-MS", "is_oos": False},
            {"param": "Assay (Anhydrous Azithromycin)", "spec": "94.5% - 103.0%", "result": "97.4%", "method": "HPLC Amperometric Detection", "is_oos": False},
            {"param": "Crystallinity (Microscopy)", "spec": "Birefringent needles / laths", "result": "Conforms", "method": "Polarizing Optical Microscopy", "is_oos": False}
        ],
        "narrative": "ICP-MS screening of Azithromycin Dihydrate batch AZM-2026-640 revealed residual palladium catalyst at 18.2 ppm against the ICH Q3D limit of 10.0 ppm. Examination of metal scavenger column SCV-01 demonstrated preferential channeling and fluid bypass around the silica-thiol resin bed due to improper top frit distribution disc alignment during column re-packing on 2026-10-12.",
        "containment": "1. 950 kg of Azithromycin Dihydrate bulk quarantined in Warehouse 2.\n2. Column SCV-01 decommissioned; standardized slurry packing SOP instituted.\n3. Re-treatment with secondary thiol resin batch adsorption protocol under review.",
        "signatures": {"prepared": "C. Lindqvist (Spectroscopist)", "date_prep": "2026-10-14", "verified": "K. Kowalski (Production Lead)", "date_ver": "2026-10-14", "qa": "Dr. E. Gomez (QA Lead)"}
    }
]

# Generate all 10 PDFs
print("--- Generating 10 PDF Documents ---")
for p in pdf_incidents:
    out_path = os.path.join(OUTPUT_DIR, p["filename"])
    create_pharma_pdf(out_path, p["meta"], p["results"], p["narrative"], p["containment"], p["signatures"])
    print(f"Generated PDF: {out_path}")


# -------------------------------------------------------------------------
# 10 Unique Pasted Text / Lab Notes Definitions
# -------------------------------------------------------------------------
text_incidents = [
    {
        "filename": "incident_text_01_omeprazole_sulfone_degradation.txt",
        "content": """DEVIATION REPORT & FORENSIC NOTES: DEV-2026-0501
Product Name: Omeprazole API (USP/EP)
Batch Number: OMP-2026-419
Manufacturing Stage: Stage 4: Centrifuge Washing & Fluid Bed Drying
Equipment ID: Heinkel Centrifuge HNK-02 / Fluid Bed Dryer FBD-01
Date of Occurrence: 2026-10-21 | Date of Discovery: 2026-10-22
Reporting Department: Quality Control Analytical Laboratory

OBSERVED DEVIATION:
Finished API release testing by HPLC detected Related Substance Impurity B (Omeprazole Sulfone) at 0.34% (w/w), exceeding the regulatory specification limit of NMT 0.15% (w/w). Assay was 99.1% and residue on ignition was 0.05%.

PROCESS & SHIFT OBSERVATIONS:
Omeprazole is highly acid-labile. During the centrifugal isolation stage on HNK-02, a nitrogen blanket pressure loss occurred for 35 minutes when the main nitrogen header valve jammed during shift changeover. Ambient cleanroom air and moisture entered the centrifuge basket, lowering the localized pH of the wet cake surface and accelerating oxidative degradation to omeprazole sulfone.

IMMEDIATE CONTAINMENT:
1. Batch OMP-2026-419 (1,100 kg) quarantined in double polyethylene lined fiber drums.
2. Centrifuge HNK-02 nitrogen supply pressure sensor interlocked to prevent operation if pressure < 0.2 bar.
3. Air exposure hold-time validation study requested for all benzimidazole API lines."""
    },
    {
        "filename": "incident_text_02_ibuprofen_bulk_density_deviation.txt",
        "content": """LAB INVESTIGATION & SHIFT LOG: DEV-2026-0502
Product Name: Ibuprofen Direct Compression (DC) Grade API
Batch Number: IBU-2026-788
Manufacturing Stage: Stage 3: Reactive Crystallization & Agglomeration
Equipment ID: Crystallizer CRYS-04 / High Shear Wet Mill WML-01
Date of Occurrence: 2026-10-20 | Date of Discovery: 2026-10-21
Reporting Department: Physical Quality Characterization Lab

OBSERVED DEVIATION:
Untapped bulk density tested at 0.31 g/mL, failing the Direct Compression validated specification range of 0.40 g/mL - 0.48 g/mL. Tapped density was 0.44 g/mL (Carr's Index = 29.5%, indicating poor powder flowability).

PROCESS & LAB NOTES:
During the cooling crystallization cycle, wet mill WML-01 speed was operated at 3,200 RPM instead of the recipe-defined 1,800 RPM due to an incorrect manual setpoint entry by a trainee operator. The excessive shear force fractured spherical crystal agglomerates into fine needle fragments with high aspect ratios, causing poor bulk packing.

IMMEDIATE CONTAINMENT:
1. Batch IBU-2026-788 (4,200 kg) segregated in Warehouse Bulk Bay 7 under yellow QA hold tags.
2. Supervisory authorization lock placed on wet mill RPM parameters in SCADA recipe.
3. Training matrix review initiated for all direct compression crystallization operators."""
    },
    {
        "filename": "incident_text_03_amoxicillin_coupling_yield_loss.txt",
        "content": """INCIDENT INVESTIGATION REPORT: DEV-2026-0503
Product Name: Amoxicillin Trihydrate API (Enzymatic Route)
Batch Number: AMX-2026-610
Manufacturing Stage: Stage 2: Enzymatic Coupling & pH Crystallization
Equipment ID: Bioreactor BIO-02 / Penicillin Acylase Enzyme Bed
Date of Occurrence: 2026-10-19 | Date of Discovery: 2026-10-20
Reporting Department: Biochemical Manufacturing Operations

OBSERVED DEVIATION:
Chemical conversion yield collapsed to 68.4% (w/w) against the validated batch minimum of NLT 92.0% (w/w). Residual unreacted 6-APA intermediate spiked to 4.8% (spec NMT 0.5%).

CHRONOLOGY & INVESTIGATION:
During enzymatic coupling of 6-APA with D-hydroxyphenylglycine methyl ester, bioreactor BIO-02 chilling jacket circulation pump tripped at 02:15 UTC. Slurry temperature climbed to 29.5°C (validated control limit is 18°C - 20°C). Immobilized Penicillin G Acylase enzyme underwent thermal denaturation, permanently losing catalytic coupling activity.

IMMEDIATE CONTAINMENT:
1. Reaction mass quarantined in tank TK-BIO-02 under refrigeration.
2. Immobilized enzyme charge discarded; biocatalyst bed purged.
3. Secondary coolant backup pump auto-switchover interlock commissioned on bioreactor BIO-02."""
    },
    {
        "filename": "incident_text_04_gabapentin_chloride_exhaustion.txt",
        "content": """QUALITY DEVIATION RECORD: DEV-2026-0504
Product Name: Gabapentin USP API
Batch Number: GBP-2026-302
Manufacturing Stage: Stage 3: Ion-Exchange Demineralization & Desalting
Equipment ID: Resin Column IXC-03 (Dowex Monosphere Resin)
Date of Occurrence: 2026-10-18 | Date of Discovery: 2026-10-19
Reporting Department: QC Wet Chemistry Analytical Lab

OBSERVED DEVIATION:
Inorganic chloride content in finished Gabapentin API tested at 0.045% (450 ppm), severely exceeding the USP compendial limit of NMT 0.010% (100 ppm). HPLC purity was 99.6%.

INVESTIGATION DETAILS:
Gabapentin free amino acid is isolated by passing gabapentin hydrochloride through a strong basic anion exchange resin column (IXC-03). Conductivity monitoring during elution failed because the conductivity probe had foul coating and recorded 12 μS/cm while actual conductivity exceeded 85 μS/cm. The resin had reached chloride breakthrough exhaustion 2 hours prior to collection cutoff.

IMMEDIATE CONTAINMENT:
1. Batch GBP-2026-302 (1,500 kg) locked in ERP with status Q-RETEST.
2. Resin Column IXC-03 taken out of service for full caustic regeneration.
3. Conductivity sensor maintenance and calibration frequency shortened from monthly to weekly."""
    },
    {
        "filename": "incident_text_05_levothyroxine_photooxidation_drift.txt",
        "content": """FORENSIC QUALITY REPORT: DEV-2026-0505
Product Name: Levothyroxine Sodium API (USP)
Batch Number: LTH-2026-090
Manufacturing Stage: Stage 4: Micro-dispersion & Final Crystallization
Equipment ID: Glass-Lined Reactor GLR-01 / Transfer Line TL-04
Date of Occurrence: 2026-10-17 | Date of Discovery: 2026-10-18
Reporting Department: QC Specialized Micro-Assay Lab

OBSERVED DEVIATION:
Potency assay of finished Levothyroxine Sodium tested at 93.8% (w/w) on anhydrous basis, failing the tight USP monograph specification of 97.0% - 102.0%. High levels of deiodinated and keto-acid photo-degradation products observed.

PROCESS OBSERVATIONS:
Levothyroxine is exceptionally light-sensitive. Temporary fluoropolymer clear PFA transfer tubing (TL-04) had been installed during maintenance bypass rather than amber UV-opaque stainless steel braided lines. Slurry transfer took 6 hours under 800 lux fluorescent cleanroom lighting without amber UV light shielding.

IMMEDIATE CONTAINMENT:
1. Batch LTH-2026-090 (24 kg high-potency bulk) quarantined in dedicated light-tight freezer.
2. Temporary clear tubing TL-04 immediately removed and scrapped.
3. Cleanroom change control protocol audited for temporary equipment replacements."""
    },
    {
        "filename": "incident_text_06_doxycycline_epimer_increase.txt",
        "content": """QUALITY INCIDENT SUMMARY: DEV-2026-0506
Product Name: Doxycycline Hyclate API (USP)
Batch Number: DOX-2026-224
Manufacturing Stage: Stage 3: Salt Formation & Extended Crystallization Hold
Equipment ID: Holding Crystallizer T-302 / Filter ANFD-01
Date of Occurrence: 2026-10-16 | Date of Discovery: 2026-10-17
Reporting Department: QC HPLC Antibiotics Unit

OBSERVED DEVIATION:
Related Substance 4-Epidoxycycline tested at 1.84% (w/w), exceeding the USP monograph specification limit of NMT 1.20% (w/w). Total other impurities remained below 0.5%.

LABORATORY INVESTIGATION:
Due to an unexpected plant boiler steam outage on Friday night, crystallization slurry in T-302 remained held at 28°C for 54 hours instead of the validated maximum slurry hold time of 12 hours prior to filtration. Extended exposure to acidic aqueous ethanol at elevated ambient temperature drove reversible C-4 epimerization of doxycycline into 4-epidoxycycline.

IMMEDIATE CONTAINMENT:
1. Batch DOX-2026-224 (800 kg) quarantined in Warehouse 1.
2. Slurry hold-time limits added as mandatory critical process parameter in electronic batch record.
3. Engineering review of redundant backup steam supply for crystallization hall."""
    },
    {
        "filename": "incident_text_07_clopidogrel_optical_rotation_drop.txt",
        "content": """DEVIATION INVESTIGATION LOG: DEV-2026-0507
Product Name: Clopidogrel Bisulfate Form I API
Batch Number: CLOP-2026-815
Manufacturing Stage: Stage 3: Chiral Resolution with 10-Camphorsulfonic Acid
Equipment ID: Chiral Resolution Reactor CR-01 / Basket Centrifuge BCF-01
Date of Occurrence: 2026-10-15 | Date of Discovery: 2026-10-16
Reporting Department: QC Optical & Physical Analysis Lab

OBSERVED DEVIATION:
Specific optical rotation [α]D20 measured at +51.8°, failing the specification of +55.0° to +58.0°. Chiral HPLC confirmed presence of unwanted (R)-enantiomer at 3.9% (specification NMT 1.0%).

FORENSIC AUDIT:
Resolution of racemic clopidogrel requires precise fractional crystallization of the (S)-camphorsulfonate diastereomeric salt in acetone. A cooling temperature overshoot occurred (cooled to -2°C instead of +10°C) because cooling jacket brine valve CV-101 jammed open. The lower temperature caused co-crystallization and precipitation of the more soluble (R)-enantiomer camphorsulfonate salt.

IMMEDIATE CONTAINMENT:
1. Batch CLOP-2026-815 (950 kg) placed on QA hold in Warehouse Bay C.
2. Temperature control valve CV-101 replaced and re-tuned with dual PID loop feedback.
3. Rework resolution protocol drafted to re-dissolve and re-crystallize salt at validated 10°C."""
    },
    {
        "filename": "incident_text_08_sitagliptin_genotoxic_alkyl_halide.txt",
        "content": """TRACE IMPURITY ESCALATION REPORT: DEV-2026-0508
Product Name: Sitagliptin Phosphate Monohydrate API
Batch Number: SIT-2026-340
Manufacturing Stage: Stage 5: Final Salt Formation & Washing
Equipment ID: Isolation Filter-Dryer FD-03 / Agilent 6470 LC-MS/MS
Date of Occurrence: 2026-10-14 | Date of Discovery: 2026-10-15
Reporting Department: Trace Organic Analysis & Mass Spectrometry Lab

OBSERVED DEVIATION:
Targeted genotoxic impurity screen by LC-MS/MS detected trace alkylating reagent (2,4,5-trifluorobenzyl bromide) at 3.8 ppm, exceeding the ICH M7 Threshold of Toxicological Concern (TTC) specification limit of NMT 1.5 ppm.

INVESTIGATION NOTES:
The synthesis involves alkylation in Step 2. Final API isolation on FD-03 includes an isopropanol/water cake displacement wash designed to purge residual alkyl halides. Cake displacement wash volume was truncated by 40% due to an erroneous liquid level sensor reading on wash tank TK-WSH-01, leaving trace electrophilic reactant unextracted.

IMMEDIATE CONTAINMENT:
1. Batch SIT-2026-340 (600 kg) quarantined in secure warehouse vault.
2. Level transmitter LT-01 on wash tank re-calibrated.
3. Cake wash volume verification added as formal independent secondary signoff in BPCR."""
    },
    {
        "filename": "incident_text_09_propofol_homogenization_droplet_growth.txt",
        "content": """PROCESS QUALITY DEVIATION: DEV-2026-0509
Product Name: Propofol Crude API Liquid Oil Substance
Batch Number: PRF-2026-112
Manufacturing Stage: Stage 3: High-Pressure Emulsion Microfluidization
Equipment ID: Microfluidizer Homogenizer MF-110T / Malvern Zetasizer
Date of Occurrence: 2026-10-13 | Date of Discovery: 2026-10-14
Reporting Department: Colloidal & Emulsion Testing Unit

OBSERVED DEVIATION:
Mean oil droplet diameter measured at 0.74 μm (740 nm), failing the injectable API intermediate specification of NMT 0.45 μm (450 nm). Distribution showed tailing of large globule fraction > 5 μm (PFAT5 = 0.082%, spec <= 0.050%).

PROCESS OBSERVATIONS:
Microfluidizer operating pressure fluctuated erratically between 800 bar and 1,200 bar (recipe requires continuous 1,400 bar ± 50 bar). Teardown of the ceramic interaction chamber discovered severe cavitation erosion and tungsten carbide valve seat chipping, preventing laminar shear droplet disruption.

IMMEDIATE CONTAINMENT:
1. Bulk oil batch PRF-2026-112 (450 L) placed on QA hold in stainless steel totes.
2. Microfluidizer ceramic chamber replaced with diamond interaction chamber.
3. Pre-run pressure stability check instituted prior to future emulsion processing."""
    },
    {
        "filename": "incident_text_10_valacyclovir_guanine_hydrolysis.txt",
        "content": """LAB DEVIATION NOTICE: DEV-2026-0510
Product Name: Valacyclovir Hydrochloride API
Batch Number: VAL-2026-550
Manufacturing Stage: Stage 4: Hydrolytic Deprotection & Acid Precipitation
Equipment ID: Glass-Lined Hydrolysis Vessel GLR-03 / Nutsche Filter
Date of Occurrence: 2026-10-12 | Date of Discovery: 2026-10-13
Reporting Department: QC Chromatographic Release Section

OBSERVED DEVIATION:
Finished API release chromatography identified Related Substance Guanine at 0.38% (w/w), exceeding the USP monograph specification limit of NMT 0.15% (w/w). Valacyclovir assay was 98.2%.

CHRONOLOGY & INVESTIGATION:
During deprotection of CBZ-valacyclovir in vessel GLR-03, concentrated 37% hydrochloric acid addition was executed over 15 minutes instead of the validated 90-minute metered dosing at 15°C. Rapid exothermic acid addition caused localized pH drop below 0.5 and internal temperature spike to 38°C, cleaving the valyl ester linkage and precipitating insoluble free guanine base.

IMMEDIATE CONTAINMENT:
1. Batch VAL-2026-550 (800 kg) quarantined in Warehouse 3.
2. Automated peristaltic metering pump locked to prevent manual override of acid feed rate.
3. Re-crystallization and hot filtration feasibility protocol submitted to QA."""
    }
]

# Write all 10 Text Files
print("--- Generating 10 Pasted Text / Lab Notes Files ---")
for t in text_incidents:
    out_path = os.path.join(OUTPUT_DIR, t["filename"])
    with open(out_path, "w", encoding="utf-8") as f:
        f.write(t["content"].strip())
    print(f"Generated Text: {out_path}")


# -------------------------------------------------------------------------
# 10 Unique Email Report Definitions
# -------------------------------------------------------------------------
email_incidents = [
    {
        "filename": "incident_email_01_semaglutide_bioburden_alert.txt",
        "subject": "[URGENT QA ESCALATION] Downstream Bioburden Excursion Prior to Semaglutide Crystallization (Batch SEM-2026-092)",
        "from": "marcus.lindemann@aivoapharma.com (QC Microbiology Supervisor)",
        "to": "qa-director@aivoapharma.com, downstream-lead@aivoapharma.com",
        "date": "2026-10-22 08:15 AM",
        "body": """Dear Quality Assurance and Downstream Operations,

This is an urgent quality escalation notification regarding Semaglutide Peptide API Batch SEM-2026-092.

Incident Summary:
- Deviation Number: DEV-2026-0601
- Product: Semaglutide Synthetic Peptide API
- Batch Number: SEM-2026-092
- Process Stage: Stage 5: Ultrafiltration & Diafiltration (UF/DF)
- Equipment: Tangential Flow Skid TFF-02 (0.22 μm PES Filter)
- Observed Result: Pre-crystallization bioburden sample yielded 42 CFU/100 mL
- Validated Specification: NMT 10 CFU/100 mL (In-Process Microbial Alert Limit)

Investigation Findings:
Microbiology laboratory preliminary Gram stain identified Gram-negative rod bacteria (Burkholderia cepacia complex). Swab testing of UF/DF skid TFF-02 identified biofilm accumulation in the permeate recirculation pipe dead-leg that escaped standard CIP sanitization due to a degraded CIP spray ball.

Immediate Containment:
1. Peptide pool SEM-2026-092 (4.5 kg) quarantined at 2-8°C with sodium azide preservation pending QA disposition.
2. TFF-02 skid red-tagged; hot 0.5N NaOH sanitization cycle and CIP dead-leg replacement initiated.
3. Please open an AI-assisted Root Cause Analysis investigation in the workspace.

Regards,
Marcus Lindemann
Microbiology Quality Control Supervisor | AIVOA Pharmaceuticals"""
    },
    {
        "filename": "incident_email_02_atorvastatin_hplc_oos_escalation.txt",
        "subject": "[QA ESCALATION] Out-of-Specification Notification: Elevated Impurity H in Atorvastatin Calcium Batch ATC-2026-C14",
        "from": "dr.sarah.thornton@aivoapharma.com (Head of Quality Assurance)",
        "to": "plant-manager@aivoapharma.com, ops-director@aivoapharma.com",
        "date": "2026-10-21 11:30 AM",
        "body": """Team,

Be advised that QC release testing for commercial Atorvastatin Calcium Trihydrate API Batch ATC-2026-C14 has produced a confirmed Out-of-Specification (OOS) result.

Specific Details:
- Deviation ID: DEV-2026-0602
- Product: Atorvastatin Calcium Trihydrate API
- Batch: ATC-2026-C14
- Parameter: Related Substance Impurity H (Pyrrole keto-derivative)
- Specification Limit: NMT 0.15% (w/w)
- Observed Lab Result: 0.31% (w/w) [Confirmed on duplicate re-injection]
- Manufacturing Stage: Paal-Knorr Condensation & Ring Closure

Lab & Engineering Findings:
Phase 1 laboratory investigation completed: HPLC column suitability verified, mobile phase prepared fresh, dilution integrity confirmed. Plant investigation into reactor RX-02 revealed condensation reaction temperature was maintained at 74°C for 14 hours instead of validated 65°C ± 2°C due to steam thermal sensor offset.

Immediate Containment:
- All 18 fiber drums of batch ATC-2026-C14 placed under QA Quarantine hold in Warehouse 2.
- Temperature transmitter TT-102 tagged out for calibration overhaul.
- Initiate RCA (5 Whys and Fishbone) to determine root cause and corrective actions.

Dr. Sarah Thornton
Head of Quality Assurance | AIVOA Pharmaceuticals"""
    },
    {
        "filename": "incident_email_03_losartan_nitrosamine_trace_screening.txt",
        "subject": "[CRITICAL REGULATORY ALERT] Trace Nitrosamine Screening Approaching Action Limit in Losartan Potassium API Batch LSP-2026-055",
        "from": "elena.gomez@aivoapharma.com (Director of Regulatory Compliance)",
        "to": "qa-operations@aivoapharma.com, solvent-recovery@aivoapharma.com",
        "date": "2026-10-20 02:45 PM",
        "body": """Dear Quality Investigation Team,

Regulatory Compliance and QC have completed LC-MS/MS nitrosamine screening on Losartan Potassium API Batch LSP-2026-055.

Deviation Details:
- Deviation Reference: DEV-2026-0603
- Product: Losartan Potassium API
- Batch: LSP-2026-055
- Impurity: N-Nitroso-N-methyl-4-aminobutyric acid (NMBA)
- Observed Result: 0.88 ppm [FDA Interim Limit: NMT 0.96 ppm, Internal Action Limit: 0.50 ppm]
- Manufacturing Stage: Tetrazole Ring Formation (Sodium Azide / Tributyltin chloride)

Root Cause Indicators:
The recovery distillation column REC-COL-01 was used to recycle Dimethylformamide (DMF) solvent. Recycled DMF contained trace dimethylamine precursors that reacted with residual nitrous acid formed during tetrazole acidic quenching.

Required Actions:
1. Place Batch LSP-2026-055 on QA Hold; do not release for commercial distribution.
2. Immediate quarantine on recovered solvent tank TK-DMF-REC.
3. Run comprehensive RCA to identify preventive controls and solvent recovery validation limits.

Elena Gomez, Ph.D.
Director of Regulatory Compliance & Quality Risk Management"""
    },
    {
        "filename": "incident_email_04_pantoprazole_desiccant_seal_compromise.txt",
        "subject": "[DEVIATION NOTICE] Humidity Ingress & Degradation of Pantoprazole Sodium API Bulk Intermediate (Batch PAN-2026-110)",
        "from": "kevin.kowalski@aivoapharma.com (Packaging & Warehouse Operations Lead)",
        "to": "qa-escalations@aivoapharma.com, production-ops@aivoapharma.com",
        "date": "2026-10-19 09:20 AM",
        "body": """Quality Team,

During warehouse inspection of Pantoprazole Sodium Sesquihydrate API Batch PAN-2026-110, physical seal integrity compromise was detected.

Incident Parameters:
- Deviation: DEV-2026-0604
- Product: Pantoprazole Sodium API
- Batch: PAN-2026-110
- Packaging: 25 kg Double Poly-Lined HDPE Drums with Silica Desiccant Pouches
- Problem: Relative humidity indicators inside inner liner registered 60% RH (specification NMT 20% RH)
- Lab Impact: Surface discoloration (yellowing) and moisture content rose to 9.2% (spec 6.5% - 8.5%)

Observations:
Induction heat sealer HS-02 experienced temperature sensor failure, causing incomplete hermetic sealing on inner foil barrier bags across 8 of 12 drums. Cleanroom humidity in staging airlock rose to 65% during torrential rainfall.

Containment Actions:
- All 12 drums quarantined under ERP lock Q-INSP.
- Re-drying and repackaging assessment initiated.
- Sealer HS-02 locked out pending heat element replacement.

Regards,
Kevin Kowalski
Warehouse & Logistics Operations Lead"""
    },
    {
        "filename": "incident_email_05_empagliflozin_solvate_loss.txt",
        "subject": "[INVESTIGATION ESCALATION] Loss of Solvate Stoichiometry in Empagliflozin API Intermediate (Batch EMP-2026-440)",
        "from": "dr.vikram.patel@aivoapharma.com (Process Technology Transfer Manager)",
        "to": "qa-head@aivoapharma.com, plant-superintendent@aivoapharma.com",
        "date": "2026-10-18 04:10 PM",
        "body": """Dear Quality Assurance,

We have encountered a critical solid-state deviation in Empagliflozin L-Proline cocrystal API batch EMP-2026-440.

Deviation Summary:
- Deviation No: DEV-2026-0605
- Product: Empagliflozin L-Proline Cocrystal API
- Batch: EMP-2026-440
- Parameter: Molar ratio of Empagliflozin to L-Proline (1:1 stoichiometric specification)
- Observed Result: Molar ratio 1:0.78 (L-Proline depletion)
- Process Stage: Vacuum Tray Drying (Oven VTD-03)

Preliminary Findings:
The vacuum tray dryer temperature controller was accidentally set to 65°C instead of 45°C. Excessive thermal energy caused partial sublimation and loss of the L-proline co-former from the crystal lattice, leading to phase transformation and collapse of powder flow characteristics.

Containment:
- Batch EMP-2026-440 (520 kg) placed on QA Hold.
- Temperature controller interlocked with dual supervisory password access.
- Please open 5 Whys RCA in the system.

Dr. Vikram Patel
Process Technology Transfer Manager | AIVOA Pharmaceuticals"""
    },
    {
        "filename": "incident_email_06_sertraline_mandelate_chiral_inversion.txt",
        "subject": "[QC NOTICE] Chiral Purity Failure in Sertraline Hydrochloride API Synthesis (Batch SER-2026-880)",
        "from": "claire.fontaine@aivoapharma.com (Senior QC Chromatography Chemist)",
        "to": "qa-investigations@aivoapharma.com, synthesis-manager@aivoapharma.com",
        "date": "2026-10-17 01:15 PM",
        "body": """Attention Quality Operations,

Chiral HPLC screening of Sertraline Hydrochloride API Batch SER-2026-880 has failed enantiomeric purity criteria.

Deviation Specifics:
- Reference ID: DEV-2026-0606
- Product: Sertraline Hydrochloride API (USP)
- Batch: SER-2026-880
- Test Parameter: Chiral Enantiomeric Purity ((1S,4S)-cis-enantiomer)
- Monograph Specification: NLT 99.0%
- Observed Result: 96.2% [(1R,4R)-enantiomer present at 3.8%]
- Process Stage: Stage 3: D-Mandelic Acid Resolution Salt Isolation

Forensic Analysis:
Resolution crystallization reactor R-301 agitator stopped for 40 minutes due to drive belt slippage during critical cooling crystallization. The lack of agitation allowed un-resolved racemic free base to oil out and contaminate the crystalline (1S,4S)-sertraline mandelate salt cake.

Immediate Containment:
1. Batch SER-2026-880 (750 kg) quarantined in centrifuge receiver.
2. Agitator motor drive belts replaced on reactor R-301 with optical tachometer failure alarm.
3. Initiate formal RCA and CAPA workflow.

Claire Fontaine
Senior QC Chromatography Chemist"""
    },
    {
        "filename": "incident_email_07_amoxicillin_agitator_shear_drop.txt",
        "content": """Dear Quality Assurance Team,

This message serves as formal deviation notice for Amoxicillin Trihydrate API Batch AMX-2026-720.

Deviation Details:
- Deviation Number: DEV-2026-0607
- Product: Amoxicillin Trihydrate Compacted API
- Batch: AMX-2026-720
- Parameter: Bulk Viscosity & Filtration Flow Rate
- Observed Result: Slurry filtration duration exceeded 14 hours (validated cycle time: 4 hours)
- Impact: Increased moisture retention, residual solvent elevation

Cause Indicators:
The variable frequency drive (VFD) controlling the main draft-tube agitator in crystallizer CRYS-03 drifted down from 120 RPM to 45 RPM during the acid crystallization sequence. The reduced shear field resulted in agglomerated gelatinous crystal habits instead of free-filtering prism crystals.

Actions Taken:
- Slurry cake quarantined in Nutsche filter NF-02.
- Electrical technician repaired VFD analog 4-20mA control signal cable.
- Please initialize RCA and evidence tracker.

Regards,
Rajesh Sharma
Active Pharmaceutical Ingredient Manufacturing Superintendent"""
    },
    {
        "filename": "incident_email_08_tacrolimus_tautomer_spike_alert.txt",
        "subject": "[CRITICAL BIOPROCESS ALERT] Tautomer II Spike on Immunosuppressant Tacrolimus API (Batch TAC-2026-019)",
        "from": "dr.hans.becker@aivoapharma.com (Biotechnology Fermentation Lead)",
        "to": "qa-compliance@aivoapharma.com, fermentation-ops@aivoapharma.com",
        "date": "2026-10-15 10:45 AM",
        "body": """Quality Operations,

HPLC release analysis for Tacrolimus Monohydrate API Batch TAC-2026-019 has reported an out-of-specification tautomer impurity profile.

Key Facts:
- Deviation: DEV-2026-0608
- Product: Tacrolimus Monohydrate API (USP/EP)
- Batch: TAC-2026-019
- Test: Tacrolimus Tautomer II Ratio
- Limit: NMT 1.5% (Relative Area)
- Observed Result: 2.85% [OOS]
- Process Stage: Stage 5: Resin Adsorption & Solvent Stripping

Investigation Notes:
Tacrolimus exists as interconverting conformational tautomers in solution. Stripping column evaporator T-401 vacuum level dropped from -0.098 MPa to -0.075 MPa, requiring heating bath temperature to rise to 52°C (limit <= 35°C) to distill off ethyl acetate, accelerating tautomeric equilibrium shift towards Tautomer II.

Containment:
- 18 kg of concentrated Tacrolimus eluate placed in -20°C dark storage.
- Vacuum booster pump overhaul initiated.
- Full 5 Whys and CAPA required before resuming column processing.

Dr. Hans Becker
Fermentation & Bioseparations Director"""
    },
    {
        "filename": "incident_email_09_remdesivir_cyano_intermediate_oos.txt",
        "subject": "[QA ESCALATION] Residual Cyano-Adduct Exceeding Limit in Remdesivir Intermediate Batch RMD-2026-301",
        "from": "monica.alvarez@aivoapharma.com (Synthetic Organic Quality Specialist)",
        "to": "qa-head@aivoapharma.com, chemical-ops@aivoapharma.com",
        "date": "2026-10-14 03:00 PM",
        "body": """Dear Quality Assurance,

Analytical testing on final Remdesivir nucleotide prodrug intermediate batch RMD-2026-301 has detected elevated cyano-adduct impurity.

Summary:
- Deviation ID: DEV-2026-0609
- Product: Remdesivir API Intermediate (GS-441524 Intermediate)
- Batch: RMD-2026-301
- Parameter: Cyano-lactone Byproduct
- Specification: NMT 0.20% (w/w)
- Lab Result: 0.46% (w/w) [OOS]
- Process Step: C-Glycosylation & Cyano-Coupling

Mechanism:
During trimethylsilyl cyanide (TMSCN) addition in dichloromethane at -78°C, the liquid nitrogen cryogenic cooling jacket supply valve malfunctioned, allowing internal vessel temperature to spike to -45°C. At this elevated temperature, competitive bis-cyano addition occurred.

Containment:
- Intermediate batch RMD-2026-301 (320 kg) quarantined.
- Cryogenic valve solenoid replaced.
- RCA workflow initiated.

Monica Alvarez
Quality Control Analytical Chemist"""
    },
    {
        "filename": "incident_email_10_ritonavir_polymorphic_form_ii_nucleation.txt",
        "subject": "[CRITICAL ALERT] Spontaneous Nucleation of Undesired Polymorph Form II in Ritonavir API Holding Vessel (Batch RIT-2026-150)",
        "from": "dr.arthur.pendleton@aivoapharma.com (Principal Solid State Scientist)",
        "to": "qa-executive@aivoapharma.com, production-head@aivoapharma.com",
        "date": "2026-10-13 08:30 AM",
        "body": """URGENT QUALITY ALERT:

This is a critical solid-state escalation regarding Ritonavir API Batch RIT-2026-150.

Incident Summary:
- Deviation Reference: DEV-2026-0610
- Product: Ritonavir API (USP)
- Batch: RIT-2026-150
- Problem: Raman spectroscopy & XRPD detected crystalline Form II nucleation in supersaturated solution tank TK-102
- Specification: 100% Polymorphic Form I (Form II is thermodynamic insoluble form)
- Impact: Form II has significantly lower aqueous bioavailability and is unacceptable for drug product formulation

Process Chronology:
The supersaturated solution in ethyl acetate was held in transfer tank TK-102 for 18 hours at 22°C without continuous mild heating. Un-passivated surface scratching on the stainless steel agitator blade provided heterogeneous nucleation sites that triggered spontaneous crystallization of the stable, insoluble Form II crystal habit.

Immediate Containment:
1. Tank TK-102 quarantined; all transfers halted.
2. Complete decontamination and hot solvent dissolution protocol required.
3. Initiate thorough 5 Whys and Fishbone investigation in AIVOA.AI workspace.

Dr. Arthur Pendleton
Principal Solid-State Scientist | AIVOA Pharmaceuticals"""
    }
]

# Write all 10 Email Files
print("--- Generating 10 Email Report Files ---")
for idx, em in enumerate(email_incidents):
    out_path = os.path.join(OUTPUT_DIR, em["filename"])
    content = ""
    if "content" in em:
        content = em["content"]
    else:
        content = f"SUBJECT: {em['subject']}\nFROM: {em['from']}\nTO: {em['to']}\nDATE: {em['date']}\n\n{em['body']}"
    with open(out_path, "w", encoding="utf-8") as f:
        f.write(content.strip())
    print(f"Generated Email: {out_path}")

print("--- All 30 Mock Data Files Successfully Generated in sample_data/ ---")
