export const TEXT_PRESETS = [
  {
    id: 'txt-01',
    label: '1. Atorvastatin API — Impurity D Thermal OOS',
    content: `INCIDENT REPORT: DEV-2026-0841
Product: Atorvastatin Calcium Trihydrate API
Batch Number: ATC-2026-B09
Manufacturing Stage: Stage 4: Crystallization, Filtration & Vacuum Drying
Equipment ID: Reactor CRYS-RX-04 / ANFD-02
Date of Incident: 2026-10-22
Date of Discovery: 2026-10-23
Reporting Unit: QC Analytical Testing Laboratory

OBSERVED DEVIATION:
During final release testing of Atorvastatin Calcium API batch ATC-2026-B09, HPLC analysis detected Related Substance Impurity D at 0.28% (w/w). 
Specification: NMT 0.15% (w/w). 
Actual Result: 0.28% (w/w) - Out of Specification (OOS).
Assay was 99.4%, Water content was 4.1% (spec 3.5%-5.5%).

CHRONOLOGY & PROCESS OBSERVATIONS:
Investigation into agitated filter-dryer ANFD-02 revealed that during the vacuum drying cycle at 14:15 UTC, the product temperature spiked from 40°C setpoint to an unexpected peak of 58°C, remaining above 52°C for approximately 45 minutes. Control valve V-104 on the hot water heating jacket remained stuck open despite the PLC issuing a close command when temperature reached 40°C. Operator manually bypassed the valve to cooling water at 15:00 UTC.

IMMEDIATE CONTAINMENT:
1. Batch ATC-2026-B09 placed under QA Quarantine Hold in Warehouse 3 (all 12 drums tagged with physical yellow QA Hold banners).
2. ANFD-02 dryer locked out in SCADA; no further batches permitted.
3. Raw material ethanol lot RAW-ETH-4029 quarantined pending solvent re-assay.`
  },
  {
    id: 'txt-02',
    label: '2. Omeprazole API — Sulfone Degradation (N2 Loss)',
    content: `DEVIATION REPORT & FORENSIC NOTES: DEV-2026-0501
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
3. Air exposure hold-time validation study requested for all benzimidazole API lines.`
  },
  {
    id: 'txt-03',
    label: '3. Ibuprofen DC Grade — Bulk Density Over-Shear',
    content: `LAB INVESTIGATION & SHIFT LOG: DEV-2026-0502
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
3. Training matrix review initiated for all direct compression crystallization operators.`
  },
  {
    id: 'txt-04',
    label: '4. Amoxicillin Trihydrate — Coupling Yield Failure',
    content: `INCIDENT INVESTIGATION REPORT: DEV-2026-0503
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
3. Secondary coolant backup pump auto-switchover interlock commissioned on bioreactor BIO-02.`
  },
  {
    id: 'txt-05',
    label: '5. Gabapentin USP — Chloride Breakthrough OOS',
    content: `QUALITY DEVIATION RECORD: DEV-2026-0504
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
3. Conductivity sensor maintenance and calibration frequency shortened from monthly to weekly.`
  },
  {
    id: 'txt-06',
    label: '6. Levothyroxine Sodium — Photo-oxidation Drift',
    content: `FORENSIC QUALITY REPORT: DEV-2026-0505
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
3. Cleanroom change control protocol audited for temporary equipment replacements.`
  },
  {
    id: 'txt-07',
    label: '7. Doxycycline Hyclate — 4-Epidoxycycline Rise',
    content: `QUALITY INCIDENT SUMMARY: DEV-2026-0506
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
3. Engineering review of redundant backup steam supply for crystallization hall.`
  },
  {
    id: 'txt-08',
    label: '8. Clopidogrel Bisulfate — Optical Rotation Drop',
    content: `DEVIATION INVESTIGATION LOG: DEV-2026-0507
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
3. Rework resolution protocol drafted to re-dissolve and re-crystallize salt at validated 10°C.`
  },
  {
    id: 'txt-09',
    label: '9. Sitagliptin Phosphate — Genotoxic Alkyl Halide',
    content: `TRACE IMPURITY ESCALATION REPORT: DEV-2026-0508
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
3. Cake wash volume verification added as formal independent secondary signoff in BPCR.`
  },
  {
    id: 'txt-10',
    label: '10. Valacyclovir HCl — Guanine Hydrolysis Spike',
    content: `LAB DEVIATION NOTICE: DEV-2026-0510
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
3. Re-crystallization and hot filtration feasibility protocol submitted to QA.`
  }
];

export const EMAIL_PRESETS = [
  {
    id: 'em-01',
    label: '1. Semaglutide API — Pre-Crystallization Bioburden',
    subject: '[URGENT QA ESCALATION] Downstream Bioburden Excursion Prior to Semaglutide Crystallization (Batch SEM-2026-092)',
    body: `Dear Quality Assurance and Downstream Operations,

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
Microbiology Quality Control Supervisor | AIVOA Pharmaceuticals`
  },
  {
    id: 'em-02',
    label: '2. Atorvastatin API — Confirmed OOS Impurity H',
    subject: '[QA ESCALATION] Out-of-Specification Notification: Elevated Impurity H in Atorvastatin Calcium Batch ATC-2026-C14',
    body: `Team,

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
Head of Quality Assurance | AIVOA Pharmaceuticals`
  },
  {
    id: 'em-03',
    label: '3. Losartan Potassium — Trace NMBA Nitrosamine',
    subject: '[CRITICAL REGULATORY ALERT] Trace Nitrosamine Screening Approaching Action Limit in Losartan Potassium API Batch LSP-2026-055',
    body: `Dear Quality Investigation Team,

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
Director of Regulatory Compliance & Quality Risk Management`
  },
  {
    id: 'em-04',
    label: '4. Pantoprazole Sodium — Desiccant Seal Ingress',
    subject: '[DEVIATION NOTICE] Humidity Ingress & Degradation of Pantoprazole Sodium API Bulk Intermediate (Batch PAN-2026-110)',
    body: `Quality Team,

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
Warehouse & Logistics Operations Lead`
  },
  {
    id: 'em-05',
    label: '5. Empagliflozin Cocrystal — Solvate Depletion',
    subject: '[INVESTIGATION ESCALATION] Loss of Solvate Stoichiometry in Empagliflozin API Intermediate (Batch EMP-2026-440)',
    body: `Dear Quality Assurance,

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
Process Technology Transfer Manager | AIVOA Pharmaceuticals`
  },
  {
    id: 'em-06',
    label: '6. Sertraline HCl — Agitator Belt Slip & Inversion',
    subject: '[QC NOTICE] Chiral Purity Failure in Sertraline Hydrochloride API Synthesis (Batch SER-2026-880)',
    body: `Attention Quality Operations,

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
Senior QC Chromatography Chemist`
  },
  {
    id: 'em-07',
    label: '7. Amoxicillin Trihydrate — Agitator VFD Failure',
    subject: '[PLANT ESCALATION] Viscosity Elevation & Slurry Filtration Blockage on Amoxicillin Batch AMX-2026-720',
    body: `Dear Quality Assurance Team,

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
Active Pharmaceutical Ingredient Manufacturing Superintendent`
  },
  {
    id: 'em-08',
    label: '8. Tacrolimus API — Tautomer II Spike',
    subject: '[CRITICAL BIOPROCESS ALERT] Tautomer II Spike on Immunosuppressant Tacrolimus API (Batch TAC-2026-019)',
    body: `Quality Operations,

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
Fermentation & Bioseparations Director`
  },
  {
    id: 'em-09',
    label: '9. Remdesivir Intermediate — Cyano Byproduct',
    subject: '[QA ESCALATION] Residual Cyano-Adduct Exceeding Limit in Remdesivir Intermediate Batch RMD-2026-301',
    body: `Dear Quality Assurance,

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
Quality Control Analytical Chemist`
  },
  {
    id: 'em-10',
    label: '10. Ritonavir API — Spontaneous Form II Nucleation',
    subject: '[CRITICAL ALERT] Spontaneous Nucleation of Undesired Polymorph Form II in Ritonavir API Holding Vessel (Batch RIT-2026-150)',
    body: `URGENT QUALITY ALERT:

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
Principal Solid-State Scientist | AIVOA Pharmaceuticals`
  }
];
