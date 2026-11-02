import os
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle

def generate_sample_pdf(output_path: str):
    doc = SimpleDocTemplate(
        output_path,
        pagesize=letter,
        rightMargin=36,
        leftMargin=36,
        topMargin=36,
        bottomMargin=36
    )

    styles = getSampleStyleSheet()
    
    # Custom styles
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontSize=16,
        leading=20,
        textColor=colors.HexColor('#1E293B'),
        alignment=1, # Center
        spaceAfter=10
    )
    
    header_style = ParagraphStyle(
        'HeaderStyle',
        parent=styles['Normal'],
        fontSize=9,
        leading=12,
        textColor=colors.HexColor('#64748B'),
        alignment=1
    )
    
    section_style = ParagraphStyle(
        'SectionHeader',
        parent=styles['Heading2'],
        fontSize=12,
        leading=16,
        textColor=colors.HexColor('#0F172A'),
        spaceBefore=8,
        spaceAfter=4
    )
    
    body_style = ParagraphStyle(
        'BodyDark',
        parent=styles['Normal'],
        fontSize=9,
        leading=13,
        textColor=colors.HexColor('#334155')
    )
    
    body_bold = ParagraphStyle(
        'BodyBold',
        parent=styles['Normal'],
        fontSize=9,
        leading=13,
        textColor=colors.HexColor('#0F172A'),
        fontName='Helvetica-Bold'
    )

    elements = []

    # Header Banner
    elements.append(Paragraph("AIVOA PHARMACEUTICALS MANUFACTURING CORP.", header_style))
    elements.append(Paragraph("GLOBAL QUALITY OPERATIONS & COMPLIANCE DIVISION", header_style))
    elements.append(Spacer(1, 4))
    elements.append(Paragraph("PHARMACEUTICAL API QUALITY DEVIATION & INVESTIGATION REPORT", title_style))
    elements.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor('#0284C7'), spaceAfter=10))

    # Meta Table
    meta_data = [
        [Paragraph("Deviation Number:", body_bold), Paragraph("DEV-2026-0841", body_style), Paragraph("Classification:", body_bold), Paragraph("Major / Critical Quality Attribute (CQA)", body_style)],
        [Paragraph("Product / API Name:", body_bold), Paragraph("Atorvastatin Calcium Trihydrate API", body_style), Paragraph("Batch / Lot Number:", body_bold), Paragraph("ATC-2026-B09", body_style)],
        [Paragraph("Manufacturing Stage:", body_bold), Paragraph("Stage 4: Crystallization, Filtration & Vacuum Drying", body_style), Paragraph("Equipment Tag:", body_bold), Paragraph("Reactor CRYS-RX-04 / ANFD-02", body_style)],
        [Paragraph("Date of Occurrence:", body_bold), Paragraph("2026-10-22 14:15 UTC", body_style), Paragraph("Date of Discovery:", body_bold), Paragraph("2026-10-23 09:30 UTC", body_style)],
        [Paragraph("Material Lot ID:", body_bold), Paragraph("Ethanol Wash RAW-ETH-4029", body_style), Paragraph("Reporting Department:", body_bold), Paragraph("Quality Control Analytical Laboratory", body_style)],
    ]
    meta_table = Table(meta_data, colWidths=[110, 160, 110, 160])
    meta_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#F8FAFC')),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#CBD5E1')),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
    ]))
    elements.append(meta_table)
    elements.append(Spacer(1, 10))

    # Section 1: Observed Deviation Details
    elements.append(Paragraph("1. OBSERVED DEVIATION & ANALYTICAL TEST RESULTS", section_style))
    results_data = [
        [Paragraph("Test Parameter", body_bold), Paragraph("Regulatory Specification", body_bold), Paragraph("Observed Lab Result", body_bold), Paragraph("Test Methodology / Instrument", body_bold)],
        [Paragraph("Chromatographic Purity: Related Substance Impurity D", body_style), Paragraph("NMT 0.15% (w/w)", body_bold), Paragraph("0.28% (w/w) [OUT OF SPECIFICATION]", ParagraphStyle('Alert', parent=body_bold, textColor=colors.HexColor('#DC2626'))), Paragraph("USP-NF / HPLC (Waters Alliance #HPLC-8812)", body_style)],
        [Paragraph("Assay (Anhydrous Basis)", body_style), Paragraph("98.0% - 102.0%", body_style), Paragraph("99.4%", body_style), Paragraph("HPLC UV Detection at 246 nm", body_style)],
        [Paragraph("Water Content (Karl Fischer)", body_style), Paragraph("3.5% - 5.5%", body_style), Paragraph("4.1%", body_style), Paragraph("Mettler Toledo V30S Titrator", body_style)],
        [Paragraph("Residual Ethanol", body_style), Paragraph("NMT 5000 ppm", body_style), Paragraph("1820 ppm", body_style), Paragraph("Headspace GC-FID", body_style)]
    ]
    res_table = Table(results_data, colWidths=[150, 110, 140, 140])
    res_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#E2E8F0')),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#94A3B8')),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
    ]))
    elements.append(res_table)
    elements.append(Spacer(1, 10))

    # Section 2: Narrative
    elements.append(Paragraph("2. INCIDENT NARRATIVE & CHRONOLOGY", section_style))
    narrative = (
        "During release analysis of Atorvastatin Calcium Trihydrate API Batch ATC-2026-B09, QC analyst reported "
        "Impurity D at 0.28% (w/w), significantly exceeding the validated specification limit of <= 0.15% (w/w). "
        "Laboratory phase 1 investigation confirmed no analytical testing error, dilution fault, or instrument drift. "
        "Subsequent manufacturing investigation of Agitated Nutsche Filter-Dryer ANFD-02 revealed that during the vacuum "
        "drying sequence at 14:15 on 2026-10-22, jacket heating control valve V-104 remained in full-open position despite "
        "the batch temperature reaching the recipe target of 40°C. Temperature soared to a peak of 58°C and remained "
        "elevated between 52°C and 58°C for approximately 45 minutes before manual intervention by lead operator. "
        "Atorvastatin is susceptible to thermal degradation and ester rearrangement at temperatures above 50°C in the presence "
        "of trace moisture."
    )
    elements.append(Paragraph(narrative, body_style))
    elements.append(Spacer(1, 10))

    # Section 3: Immediate Containment Actions
    elements.append(Paragraph("3. IMMEDIATE CONTAINMENT ACTIONS TAKEN", section_style))
    containment = (
        "1. Batch ATC-2026-B09 was immediately placed on QA Quarantine status in SAP ERP (System Status: Q-LOCKED).\n"
        "2. Physical yellow quarantine tags were applied to all 12 fiberboard drums located in Warehouse 3 (Bay D-14).\n"
        "3. SCADA system lock was applied to dryer ANFD-02, preventing further charging or processing until mechanical clearance.\n"
        "4. Retain samples sent to Analytical R&D for mass spectrometry structure verification of degradation peaks."
    )
    elements.append(Paragraph(containment.replace("\n", "<br/>"), body_style))
    elements.append(Spacer(1, 12))

    # Signatures Table
    sig_data = [
        [Paragraph("Prepared by:", body_bold), Paragraph("R. Patel (QC Senior Analyst)", body_style), Paragraph("Date: 2026-10-23", body_style)],
        [Paragraph("Verified by:", body_bold), Paragraph("M. Vance (Production Manager)", body_style), Paragraph("Date: 2026-10-23", body_style)],
        [Paragraph("QA Approval:", body_bold), Paragraph("Dr. S. Thornton (Head of Quality Assurance)", body_style), Paragraph("Status: PENDING ROOT CAUSE ANALYSIS", body_bold)]
    ]
    sig_table = Table(sig_data, colWidths=[100, 240, 200])
    sig_table.setStyle(TableStyle([
        ('LINEABOVE', (0,0), (-1,-1), 0.5, colors.HexColor('#94A3B8')),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
    ]))
    elements.append(sig_table)

    doc.build(elements)
    print(f"Generated sample PDF at: {output_path}")

if __name__ == "__main__":
    os.makedirs("sample_data", exist_ok=True)
    generate_sample_pdf("sample_data/sample_oos_impurity_incident.pdf")
