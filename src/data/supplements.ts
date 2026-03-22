import type { Supplement, PhaseStack } from "@/domain/entities/supplement";

export const DISCLAIMER_VERSION = "1.0";

export const SUPPLEMENTS: Supplement[] = [
  // ── Dopamine Precursors ──────────────────────────────────────────────────
  {
    id: "supp-l-tyrosine",
    slug: "l-tyrosine",
    name: "L-Tyrosine",
    category: "dopamine_precursor",
    mechanismSummary:
      "An amino acid that serves as a precursor to dopamine, norepinephrine, and thyroid hormones.",
    mechanismDetail:
      "L-Tyrosine is a non-essential amino acid synthesised from phenylalanine. It is a direct precursor in the catecholamine pathway: tyrosine → L-DOPA → dopamine → norepinephrine → epinephrine. Supplemental tyrosine may help maintain catecholamine synthesis during cognitively demanding or stressful periods when endogenous production lags behind demand.",
    typicalUsageContext:
      "Studied in contexts of acute cognitive demand, sleep deprivation, and cold stress. Some research suggests short-term support for working memory under load. Not studied as a treatment for any condition.",
    timingNotes:
      "Often taken on an empty stomach or before demanding cognitive tasks. Not typically taken in the evening due to stimulatory precursor pathway.",
    safetyNotes: [
      "Generally well tolerated in healthy adults at typical educational-context doses.",
      "May interact with thyroid function if taken in excess — thyroid hormones are also synthesised from tyrosine.",
      "Individuals with phenylketonuria (PKU) must not take tyrosine supplements — consult a physician.",
    ],
    contraindications: [
      "Phenylketonuria (PKU)",
      "Active thyroid disorders",
      "MAO inhibitor (MAOI) medication use",
    ],
    doNotCombine: [
      "MAO inhibitors (MAOIs) — risk of hypertensive crisis",
      "Thyroid hormone medications (levothyroxine) — may alter levels",
      "Stimulant medications — additive catecholamine load",
    ],
    phaseAlignment: [
      {
        phase: "stabilize",
        rationale:
          "During stabilisation, baseline catecholamine support can help buffer the cognitive fatigue of early habit change. Supportive context, not primary intervention.",
      },
      {
        phase: "reset",
        rationale:
          "Dopamine pathway support during reward-system reset — may help sustain motivation during the most demanding protocol window.",
      },
    ],
    evidenceLevel: "emerging",
    status: "published",
    disclaimerVersion: "1.0",
    reviewedAt: "2026-01-15",
    sources: [
      {
        title: "Tyrosine improves cognitive and physical performance during the cold",
        url: "https://pubmed.ncbi.nlm.nih.gov/8029270/",
        publisher: "Brain Research Bulletin",
        publishedAt: "1994",
      },
      {
        title: "Working memory restitution by L-tyrosine in a sustained attention task",
        url: "https://pubmed.ncbi.nlm.nih.gov/22248725/",
        publisher: "Nutritional Neuroscience",
        publishedAt: "2011",
      },
    ],
  },
  {
    id: "supp-l-phenylalanine",
    slug: "l-phenylalanine",
    name: "L-Phenylalanine",
    category: "dopamine_precursor",
    mechanismSummary:
      "An essential amino acid that converts to tyrosine, the upstream precursor of dopamine.",
    mechanismDetail:
      "L-Phenylalanine is an essential amino acid — it must come from diet or supplementation. It is hydroxylated in the liver to L-tyrosine, which then feeds into the catecholamine synthesis pathway. By supporting tyrosine availability, phenylalanine supplementation may indirectly support dopamine, norepinephrine, and epinephrine production.",
    typicalUsageContext:
      "Less directly studied than tyrosine for cognitive performance. Often included in amino acid formulations as a two-step upstream support for the dopamine pathway.",
    timingNotes:
      "Typically taken between meals to avoid competition with other large neutral amino acids for blood-brain barrier transport.",
    safetyNotes: [
      "Generally well tolerated; excessive supplementation may increase tyrosine to unhealthy levels.",
      "Individuals with PKU cannot metabolise phenylalanine — contraindicated.",
    ],
    contraindications: ["Phenylketonuria (PKU)", "Active thyroid conditions"],
    doNotCombine: [
      "MAO inhibitors (MAOIs)",
      "Antipsychotic medications — may affect dopamine dynamics",
    ],
    phaseAlignment: [
      {
        phase: "stabilize",
        rationale:
          "Upstream catecholamine pathway support during the initial stabilisation phase.",
      },
    ],
    evidenceLevel: "limited",
    status: "published",
    disclaimerVersion: "1.0",
    reviewedAt: "2026-01-15",
    sources: [
      {
        title: "Phenylalanine and tyrosine in neuropsychiatric conditions",
        url: "https://pubmed.ncbi.nlm.nih.gov/1296117/",
        publisher: "Advances in Experimental Medicine and Biology",
        publishedAt: "1994",
      },
    ],
  },

  // ── Adaptogens ──────────────────────────────────────────────────────────
  {
    id: "supp-ashwagandha",
    slug: "ashwagandha",
    name: "Ashwagandha",
    category: "adaptogen",
    mechanismSummary:
      "An Ayurvedic root adaptogen shown to modulate cortisol and support HPA axis regulation.",
    mechanismDetail:
      "Ashwagandha (Withania somnifera) contains withanolides that appear to modulate the hypothalamic-pituitary-adrenal (HPA) axis, reducing cortisol output under chronic stress. It also shows GABAergic activity in pre-clinical models, contributing to its calming effect. As an adaptogen, it helps the body maintain homeostasis under stress without direct stimulation or sedation.",
    typicalUsageContext:
      "Studied in adults reporting chronic stress and anxiety. Research shows reductions in perceived stress, cortisol, and improvements in sleep quality in stressed populations. Not a treatment for anxiety disorders.",
    timingNotes:
      "Often taken in the evening or with food. Some evidence supports split dosing (morning + evening). KSM-66 and Sensoril are standardised extracts with the most research behind them.",
    safetyNotes: [
      "Generally well tolerated in 8–12 week study periods.",
      "Rare reports of liver injury — discontinue and consult a physician if jaundice, dark urine, or abdominal pain occur.",
      "May have thyroid-stimulating effects — monitor if you have thyroid conditions.",
    ],
    contraindications: [
      "Pregnancy and breastfeeding — insufficient safety data",
      "Autoimmune conditions (may stimulate immune activity)",
      "Thyroid disorders — may alter thyroid hormone levels",
    ],
    doNotCombine: [
      "Immunosuppressant medications",
      "Sedative medications — additive CNS depressant effect",
      "Thyroid medications",
    ],
    phaseAlignment: [
      {
        phase: "stabilize",
        rationale:
          "HPA axis modulation and cortisol reduction support the nervous system settling that is the primary goal of the Stabilise phase.",
      },
      {
        phase: "reset",
        rationale:
          "Continued stress axis support during the demanding habit-reset window.",
      },
      {
        phase: "rebuild",
        rationale:
          "Adaptogenic support for energy recovery and reducing stress-driven metabolic burden.",
      },
    ],
    evidenceLevel: "foundational",
    status: "published",
    disclaimerVersion: "1.0",
    reviewedAt: "2026-01-15",
    sources: [
      {
        title:
          "An investigation into the stress-relieving and pharmacological actions of ashwagandha",
        url: "https://pubmed.ncbi.nlm.nih.gov/31517876/",
        publisher: "Medicine",
        publishedAt: "2019",
      },
      {
        title:
          "A prospective, randomized double-blind study of safety and efficacy of ashwagandha root in reducing stress",
        url: "https://pubmed.ncbi.nlm.nih.gov/23439798/",
        publisher: "Indian Journal of Psychological Medicine",
        publishedAt: "2012",
      },
    ],
  },
  {
    id: "supp-rhodiola",
    slug: "rhodiola",
    name: "Rhodiola Rosea",
    category: "adaptogen",
    mechanismSummary:
      "An Arctic adaptogen that helps buffer stress-induced fatigue and supports mental endurance.",
    mechanismDetail:
      "Rhodiola rosea contains rosavins and salidroside, which appear to influence the monoamine system (serotonin, dopamine, norepinephrine) and the stress-response axis. It is classified as an adaptogen — it helps normalise stress responses without direct stimulation. Studied primarily for fatigue, burnout, and cognitive performance under stress.",
    typicalUsageContext:
      "Studied in contexts of occupational burnout, mental fatigue, and stress-induced cognitive decline. Research suggests benefits for fatigue reduction and stress resilience in physically and cognitively stressed adults.",
    timingNotes:
      "Typically taken in the morning due to mild energising properties. Often taken on an empty stomach. Avoid evening dosing as it may affect sleep.",
    safetyNotes: [
      "Generally well tolerated in short-term studies (up to 12 weeks).",
      "Mild agitation or dry mouth reported in some users.",
      "May have mild stimulatory effects — inappropriate for highly sensitive individuals.",
    ],
    contraindications: [
      "Bipolar disorder — stimulatory monoamine effects may trigger mania",
      "Autoimmune conditions",
    ],
    doNotCombine: [
      "SSRI/SNRI antidepressants — potential serotonin interaction",
      "Stimulant medications",
      "MAO inhibitors (MAOIs)",
    ],
    phaseAlignment: [
      {
        phase: "stabilize",
        rationale:
          "Fatigue buffering supports protocol adherence during the most demanding early days.",
      },
      {
        phase: "reset",
        rationale:
          "Mental endurance support during reward-system reset — the phase associated with highest fatigue and motivational friction.",
      },
    ],
    evidenceLevel: "foundational",
    status: "published",
    disclaimerVersion: "1.0",
    reviewedAt: "2026-01-15",
    sources: [
      {
        title: "Rhodiola rosea for mental and physical fatigue in nursing students",
        url: "https://pubmed.ncbi.nlm.nih.gov/21036578/",
        publisher: "Phytomedicine",
        publishedAt: "2011",
      },
    ],
  },

  // ── Mitochondrial Support ────────────────────────────────────────────────
  {
    id: "supp-coq10",
    slug: "coq10",
    name: "CoQ10 (Ubiquinol)",
    category: "mitochondrial_support",
    mechanismSummary:
      "A fat-soluble coenzyme essential for mitochondrial electron transport and cellular energy production.",
    mechanismDetail:
      "Coenzyme Q10 (CoQ10), particularly in its reduced form ubiquinol, plays a central role in the mitochondrial electron transport chain. It shuttles electrons between complexes I–III and acts as a lipid-soluble antioxidant in cell membranes. Endogenous synthesis declines with age and with statin use. Supplementation may support mitochondrial efficiency in contexts of depletion.",
    typicalUsageContext:
      "Studied in populations with mitochondrial dysfunction, cardiovascular disease, statin-induced myopathy, and age-related decline. Not studied as a primary energy booster in healthy young adults.",
    timingNotes:
      "Fat-soluble — best absorbed when taken with a meal containing dietary fat. Ubiquinol form has greater bioavailability than ubiquinone.",
    safetyNotes: [
      "Well tolerated in studies up to several hundred mg/day.",
      "May slightly lower blood pressure — relevant if you take antihypertensives.",
    ],
    contraindications: [
      "Warfarin therapy — may reduce anticoagulant effect (monitor closely)",
    ],
    doNotCombine: [
      "Warfarin/anticoagulants — may reduce effectiveness",
      "Blood pressure medications — additive hypotensive risk",
    ],
    phaseAlignment: [
      {
        phase: "rebuild",
        rationale:
          "Metabolic energy recovery is a primary Rebuild phase goal — mitochondrial support is contextually aligned.",
      },
      {
        phase: "optimize",
        rationale:
          "Performance stability and cellular energy efficiency are Optimize phase priorities.",
      },
    ],
    evidenceLevel: "foundational",
    status: "published",
    disclaimerVersion: "1.0",
    reviewedAt: "2026-01-15",
    sources: [
      {
        title: "Coenzyme Q10 in health and disease: an overview of current evidence",
        url: "https://pubmed.ncbi.nlm.nih.gov/23203826/",
        publisher: "Nutrition Reviews",
        publishedAt: "2012",
      },
    ],
  },
  {
    id: "supp-b-vitamins",
    slug: "b-vitamins",
    name: "B-Vitamin Complex",
    category: "mitochondrial_support",
    mechanismSummary:
      "A family of water-soluble cofactors essential for energy metabolism, methylation, and neurotransmitter synthesis.",
    mechanismDetail:
      "B vitamins (B1 thiamine, B2 riboflavin, B3 niacin, B5 pantothenic acid, B6 pyridoxine, B7 biotin, B9 folate, B12 cobalamin) are co-factors in virtually every step of cellular energy metabolism and neurotransmitter biosynthesis. Deficiencies, particularly in B12, folate, and B6, have well-established neurological and cognitive consequences.",
    typicalUsageContext:
      "Most relevant as dietary insurance when intake may be inadequate (vegan/vegetarian diets for B12; poor diet quality broadly). Active B-forms (methylcobalamin, methylfolate) are better absorbed in those with MTHFR variants.",
    timingNotes:
      "Water-soluble — morning with food is conventional. High doses of B vitamins can cause vivid dreams or disturbed sleep if taken at night.",
    safetyNotes: [
      "Water-soluble vitamins are generally safe as excess is excreted.",
      "High-dose B6 (>100mg/day long-term) can cause peripheral neuropathy.",
      "Niacin flush is common at high B3 doses — flush-free forms (inositol hexanicotinate) reduce this.",
    ],
    contraindications: [
      "Leber's hereditary optic neuropathy — high-dose B12 may exacerbate",
    ],
    doNotCombine: [
      "Metformin — reduces B12 absorption over time",
      "Certain antibiotics — may affect B vitamin metabolism",
    ],
    phaseAlignment: [
      {
        phase: "stabilize",
        rationale:
          "Baseline nutrient sufficiency supports neurotransmitter synthesis and stress resilience from day one.",
      },
      {
        phase: "rebuild",
        rationale:
          "Metabolic cofactors support the energy recovery focus of the Rebuild phase.",
      },
      {
        phase: "optimize",
        rationale:
          "Methylation support and energy metabolism are foundational to optimised performance.",
      },
    ],
    evidenceLevel: "foundational",
    status: "published",
    disclaimerVersion: "1.0",
    reviewedAt: "2026-01-15",
    sources: [
      {
        title: "B Vitamins and the Brain: Mechanisms, Dose and Efficacy",
        url: "https://pubmed.ncbi.nlm.nih.gov/26828517/",
        publisher: "Nutrients",
        publishedAt: "2016",
      },
    ],
  },
  {
    id: "supp-alpha-lipoic-acid",
    slug: "alpha-lipoic-acid",
    name: "Alpha-Lipoic Acid",
    category: "mitochondrial_support",
    mechanismSummary:
      "A mitochondria-derived antioxidant that regenerates other antioxidants and supports metabolic enzyme function.",
    mechanismDetail:
      "Alpha-lipoic acid (ALA) is synthesised in mitochondria and acts as a cofactor for key metabolic enzymes (pyruvate dehydrogenase, alpha-ketoglutarate dehydrogenase). It is a potent antioxidant in both fat and water environments and can regenerate vitamins C and E, CoQ10, and glutathione. The R-form is the biologically active enantiomer.",
    typicalUsageContext:
      "Clinically studied in diabetic peripheral neuropathy and as a mitochondrial antioxidant in aging research. R-ALA has greater bioavailability and efficacy than racemic ALA.",
    timingNotes:
      "Best taken on an empty stomach for maximum absorption. Reduces blood glucose — take with food if hypoglycaemia-prone.",
    safetyNotes: [
      "Generally well tolerated. High doses may cause nausea.",
      "May lower blood glucose — relevant for those with diabetes or on insulin.",
      "Thiamine deficiency can be worsened by ALA — ensure B1 adequacy.",
    ],
    contraindications: [
      "Thiamine (B1) deficiency",
      "Insulin-dependent diabetes without medical supervision",
    ],
    doNotCombine: [
      "Insulin or oral hypoglycaemic agents — additive blood glucose lowering",
      "Thyroid medications — may reduce absorption",
    ],
    phaseAlignment: [
      {
        phase: "rebuild",
        rationale:
          "Mitochondrial antioxidant support during the metabolic recovery focus of Rebuild.",
      },
      {
        phase: "optimize",
        rationale:
          "Supports the oxidative stress reduction and energy metabolism efficiency of the Optimize phase.",
      },
    ],
    evidenceLevel: "emerging",
    status: "published",
    disclaimerVersion: "1.0",
    reviewedAt: "2026-01-15",
    sources: [
      {
        title: "Alpha-lipoic acid as a biological antioxidant",
        url: "https://pubmed.ncbi.nlm.nih.gov/7506908/",
        publisher: "Free Radical Biology and Medicine",
        publishedAt: "1995",
      },
    ],
  },

  // ── Sleep Support ────────────────────────────────────────────────────────
  {
    id: "supp-magnesium-glycinate",
    slug: "magnesium-glycinate",
    name: "Magnesium Glycinate",
    category: "sleep_support",
    mechanismSummary:
      "A highly bioavailable magnesium chelate that supports GABA activity and nervous system relaxation.",
    mechanismDetail:
      "Magnesium acts as an NMDA receptor antagonist and GABA-A receptor agonist, contributing to nervous system inhibition. Glycinate chelation increases bioavailability compared to oxide or citrate forms while minimising gastrointestinal side effects. Magnesium deficiency is common in modern diets and may impair sleep quality and stress resilience.",
    typicalUsageContext:
      "Studied for sleep latency improvement, anxiety reduction, and muscle relaxation. Most relevant for individuals with suboptimal magnesium intake.",
    timingNotes:
      "Typically taken 30–60 minutes before bed for sleep support. Can also be split (morning + night) for general repletion.",
    safetyNotes: [
      "Well tolerated at standard doses. Excess magnesium causes loose stools.",
      "Glycinate form is gentlest on the gut.",
    ],
    contraindications: [
      "Severe kidney disease — impaired magnesium excretion",
      "Myasthenia gravis",
    ],
    doNotCombine: [
      "Antibiotics (fluoroquinolones, tetracyclines) — take 2 hours apart as magnesium impairs absorption",
      "Bisphosphonates (osteoporosis drugs) — separate by 2+ hours",
    ],
    phaseAlignment: [
      {
        phase: "stabilize",
        rationale:
          "Sleep quality is foundational to nervous system regulation — the primary Stabilise goal.",
      },
      {
        phase: "reset",
        rationale:
          "Maintaining sleep depth during the habit-reset window supports recovery and habit consolidation.",
      },
      {
        phase: "rebuild",
        rationale:
          "Continued sleep support during metabolic and psychological recovery.",
      },
      {
        phase: "optimize",
        rationale:
          "Sleep quality maintenance underlies all Optimize phase performance targets.",
      },
    ],
    evidenceLevel: "foundational",
    status: "published",
    disclaimerVersion: "1.0",
    reviewedAt: "2026-01-15",
    sources: [
      {
        title: "The effect of magnesium supplementation on primary insomnia",
        url: "https://pubmed.ncbi.nlm.nih.gov/23853635/",
        publisher: "Journal of Research in Medical Sciences",
        publishedAt: "2012",
      },
    ],
  },
  {
    id: "supp-glycine",
    slug: "glycine",
    name: "Glycine",
    category: "sleep_support",
    mechanismSummary:
      "An amino acid neurotransmitter that lowers core body temperature and improves subjective sleep quality.",
    mechanismDetail:
      "Glycine acts as an inhibitory neurotransmitter in the brainstem and spinal cord and activates NMDA receptors in the brain. Pre-sleep glycine lowers core body temperature — a key initiator of the sleep cascade — by dilating peripheral blood vessels. Studies show improved sleep quality, reduced sleep latency, and next-day alertness without drowsiness.",
    typicalUsageContext:
      "Studied at 3g before sleep in controlled trials with good-quality evidence for sleep quality improvement. Non-sedating — does not cause next-day grogginess.",
    timingNotes:
      "3g approximately 30–60 minutes before sleep. Can be dissolved in water; slightly sweet taste.",
    safetyNotes: [
      "Excellent safety profile — naturally abundant amino acid.",
      "No known tolerance or dependence.",
    ],
    contraindications: [],
    doNotCombine: [
      "Clozapine — glycine may reduce clozapine's antipsychotic efficacy",
    ],
    phaseAlignment: [
      {
        phase: "stabilize",
        rationale:
          "Direct sleep quality support — central to nervous system stabilisation.",
      },
      {
        phase: "reset",
        rationale:
          "Non-sedating sleep improvement during the highest-demand phase.",
      },
    ],
    evidenceLevel: "foundational",
    status: "published",
    disclaimerVersion: "1.0",
    reviewedAt: "2026-01-15",
    sources: [
      {
        title:
          "Glycine ingestion improves subjective sleep quality in human volunteers, correlating with polysomnographic changes",
        url: "https://pubmed.ncbi.nlm.nih.gov/23072791/",
        publisher: "Sleep and Biological Rhythms",
        publishedAt: "2007",
      },
    ],
  },
  {
    id: "supp-l-theanine",
    slug: "l-theanine",
    name: "L-Theanine",
    category: "sleep_support",
    mechanismSummary:
      "A tea-derived amino acid that promotes alpha-wave brain activity and relaxed alertness without sedation.",
    mechanismDetail:
      "L-Theanine is found primarily in green tea. It crosses the blood-brain barrier and increases GABA, serotonin, and dopamine levels. It also increases alpha-wave brain activity — associated with a calm, alert state. Often combined with caffeine (as in tea) where it softens the stimulatory edge and reduces jitteriness. For sleep, it reduces sleep-disrupting anxiety without causing direct sedation.",
    typicalUsageContext:
      "Studied for anxiety reduction, attention, and sleep quality. Particularly well-studied in combination with caffeine for focus. At higher doses (200mg), supports sleep onset without grogginess.",
    timingNotes:
      "100–200mg can be taken in the evening for relaxation/sleep prep, or in the morning/day for focus support. Non-sedating — flexibility on timing.",
    safetyNotes: [
      "Excellent safety record — abundant in green tea.",
      "May modestly lower blood pressure.",
    ],
    contraindications: [],
    doNotCombine: [
      "Stimulant medications at high doses — theanine partially offsets stimulant effect",
      "Blood pressure medications — additive mild hypotensive effect",
    ],
    phaseAlignment: [
      {
        phase: "stabilize",
        rationale:
          "Relaxed alertness and anxiety buffering support the nervous system settling of Stabilise.",
      },
      {
        phase: "reset",
        rationale:
          "Evening relaxation support without sedation is useful during the demanding Reset phase.",
      },
      {
        phase: "optimize",
        rationale:
          "The focus + calm profile of L-theanine aligns with Optimize phase performance goals.",
      },
    ],
    evidenceLevel: "foundational",
    status: "published",
    disclaimerVersion: "1.0",
    reviewedAt: "2026-01-15",
    sources: [
      {
        title: "L-theanine, a natural constituent in tea, and its effect on mental state",
        url: "https://pubmed.ncbi.nlm.nih.gov/18296328/",
        publisher: "Asia Pacific Journal of Clinical Nutrition",
        publishedAt: "2008",
      },
    ],
  },
  {
    id: "supp-melatonin",
    slug: "melatonin",
    name: "Melatonin (Low-Dose)",
    category: "sleep_support",
    mechanismSummary:
      "An endogenous circadian hormone that signals sleep onset — supplemented at low doses to support circadian alignment.",
    mechanismDetail:
      "Melatonin is synthesised in the pineal gland from serotonin and released in response to darkness. It does not induce sleep directly — it signals to the brain and body that it is night, supporting circadian alignment. Low doses (0.3–0.5mg) mimic physiological levels. High pharmacological doses (3–10mg) commonly sold OTC are far above physiological range and associated with tolerance, rebound insomnia, and next-day grogginess.",
    typicalUsageContext:
      "Best evidence for circadian rhythm disruption: jet lag, shift work, delayed sleep phase. Modest evidence for sleep latency reduction. LOWEST EFFECTIVE DOSE principle applies — 0.3–0.5mg is physiological; higher doses are not more effective and carry more risk.",
    timingNotes:
      "Take 30–60 minutes before desired bedtime in complete darkness or dim light. Exposure to bright light after taking melatonin negates its effect. NOT intended as a long-term nightly sedative.",
    safetyNotes: [
      "Low doses are safe for short-term use.",
      "High doses (>3mg) may cause next-day grogginess, affect reproductive hormones (especially in adolescents), and lose efficacy via receptor downregulation.",
      "Not for indefinite nightly use — supports circadian re-setting, not replacement.",
    ],
    contraindications: [
      "Pregnancy and breastfeeding — insufficient data",
      "Autoimmune conditions — may have immunomodulatory effects",
      "Adolescents and children — hormonal effects; not for routine use",
    ],
    doNotCombine: [
      "Blood thinners (warfarin) — may affect clotting",
      "Immunosuppressants",
      "Sedative medications — additive CNS depressant effect",
      "Contraceptive hormones — potential interactions",
    ],
    phaseAlignment: [
      {
        phase: "stabilize",
        rationale:
          "Circadian realignment is a foundational Stabilise intervention — low-dose melatonin can support sleep schedule correction.",
      },
    ],
    evidenceLevel: "foundational",
    status: "published",
    disclaimerVersion: "1.0",
    reviewedAt: "2026-01-15",
    sources: [
      {
        title: "Meta-analysis: melatonin for the treatment of primary sleep disorders",
        url: "https://pubmed.ncbi.nlm.nih.gov/23691095/",
        publisher: "PLOS ONE",
        publishedAt: "2013",
      },
      {
        title:
          "Low doses of melatonin and the melatonin receptor agonist ramelteon differentially affect sleep",
        url: "https://pubmed.ncbi.nlm.nih.gov/11272902/",
        publisher: "Sleep",
        publishedAt: "2001",
      },
    ],
  },

  // ── Nervous System Calming ───────────────────────────────────────────────
  {
    id: "supp-magnesium-l-threonate",
    slug: "magnesium-l-threonate",
    name: "Magnesium L-Threonate",
    category: "nervous_system_calming",
    mechanismSummary:
      "A brain-penetrating magnesium form that increases cerebrospinal magnesium levels and supports synaptic density.",
    mechanismDetail:
      "Magnesium L-threonate was developed at MIT specifically for its ability to cross the blood-brain barrier, raising cerebrospinal fluid magnesium concentrations more effectively than other forms. Brain magnesium plays a role in synaptic plasticity, NMDA receptor regulation, and anxiety buffering. Animal studies show increases in synaptic density; human trials suggest cognitive and anxiety benefits.",
    typicalUsageContext:
      "Studied for cognitive aging, anxiety, and sleep quality in older adults. Also being explored for traumatic brain injury and general nervous system support. Considered a premium form due to higher cost but unique brain-targeting profile.",
    timingNotes:
      "Often taken at night (1–2g of Magtein brand) due to relaxing CNS effects. Some split across day and night.",
    safetyNotes: [
      "Generally well tolerated. Headache reported in early use by some — typically transient.",
      "As with all magnesium: excess causes loose stools.",
    ],
    contraindications: ["Severe kidney disease"],
    doNotCombine: [
      "Antibiotics — separate by 2+ hours",
      "Other magnesium forms — total elemental magnesium may reach laxative threshold",
    ],
    phaseAlignment: [
      {
        phase: "stabilize",
        rationale:
          "Brain magnesium replenishment supports the CNS calming and anxiety reduction central to Stabilise.",
      },
      {
        phase: "reset",
        rationale:
          "Synaptic support during the high-cognitive-demand habit reset period.",
      },
    ],
    evidenceLevel: "emerging",
    status: "published",
    disclaimerVersion: "1.0",
    reviewedAt: "2026-01-15",
    sources: [
      {
        title: "Enhancement of learning and memory by elevating brain magnesium",
        url: "https://pubmed.ncbi.nlm.nih.gov/20152112/",
        publisher: "Neuron",
        publishedAt: "2010",
      },
    ],
  },
  {
    id: "supp-gaba-precursors",
    slug: "gaba-precursors",
    name: "GABA Precursor Context",
    category: "nervous_system_calming",
    mechanismSummary:
      "Compounds that support GABA synthesis or activity — the brain's primary inhibitory neurotransmitter system.",
    mechanismDetail:
      "GABA (gamma-aminobutyric acid) is the primary inhibitory neurotransmitter. GABA supplements themselves have poor blood-brain barrier penetrance — direct oral GABA supplementation has limited CNS effect. However, GABA precursors and modulators (such as glutamine → GABA synthesis pathway support, taurine's GABA-A receptor modulation, and the ketogenic intermediate butyrate's GABAergic effects) can support the inhibitory tone of the nervous system more effectively. This entry covers the educational context around GABA support strategies.",
    typicalUsageContext:
      "Understanding that direct GABA supplements have limited evidence for CNS effects is important. Strategies that indirectly support GABAergic tone (magnesium, L-theanine, GABA-B agonist herbs) may be more effective than oral GABA itself.",
    timingNotes:
      "Context-dependent on the specific precursor or modulator; see individual supplement entries (L-theanine, magnesium).",
    safetyNotes: [
      "Oral GABA is generally safe but has minimal direct CNS effect.",
      "GABA-modulating medications (benzodiazepines, gabapentinoids) are prescription drugs — do not combine supplements with prescription GABAergics without medical guidance.",
    ],
    contraindications: [
      "Prescription benzodiazepine or gabapentinoid use — potential additive CNS depression",
    ],
    doNotCombine: [
      "Benzodiazepines",
      "Gabapentin / pregabalin",
      "Alcohol — additive CNS depressant effect",
    ],
    phaseAlignment: [
      {
        phase: "stabilize",
        rationale:
          "Understanding GABAergic tone is directly relevant to the nervous system settling goal of Stabilise.",
      },
    ],
    evidenceLevel: "limited",
    status: "published",
    disclaimerVersion: "1.0",
    reviewedAt: "2026-01-15",
    sources: [
      {
        title:
          "GABA: A pioneer of brain-gut peripheral interactions and recipient of central and peripheral inputs",
        url: "https://pubmed.ncbi.nlm.nih.gov/26443078/",
        publisher: "Neuropharmacology",
        publishedAt: "2015",
      },
    ],
  },
];

// ── Phase Stacks ────────────────────────────────────────────────────────────

export const PHASE_STACKS: PhaseStack[] = [
  {
    phase: "stabilize",
    focus: "Nervous system settling and safety baseline",
    entries: [
      { supplementId: "supp-magnesium-glycinate",  rationale: "Foundational sleep quality and GABA support for nervous system settling.", priority: 1 },
      { supplementId: "supp-l-theanine",           rationale: "Relaxed alertness without sedation — reduces anxiety friction during protocol onset.", priority: 2 },
      { supplementId: "supp-ashwagandha",           rationale: "HPA axis modulation to reduce cortisol burden during early habit disruption.", priority: 3 },
      { supplementId: "supp-glycine",              rationale: "Non-sedating sleep quality improvement — lowers body temperature for better sleep onset.", priority: 4 },
      { supplementId: "supp-magnesium-l-threonate", rationale: "Brain magnesium support for CNS inhibitory tone and anxiety buffering.", priority: 5 },
      { supplementId: "supp-melatonin",             rationale: "Circadian realignment support where sleep schedule correction is needed (low-dose only).", priority: 6 },
      { supplementId: "supp-b-vitamins",            rationale: "Baseline neurotransmitter cofactor sufficiency.", priority: 7 },
      { supplementId: "supp-l-tyrosine",            rationale: "Catecholamine pathway baseline support for managing cognitive fatigue of early change.", priority: 8 },
      { supplementId: "supp-gaba-precursors",       rationale: "Educational context on GABAergic support strategies.", priority: 9 },
    ],
  },
  {
    phase: "reset",
    focus: "Reward pathway support and habit transition",
    entries: [
      { supplementId: "supp-l-tyrosine",           rationale: "Dopamine precursor support during reward-system reset — the most demanding phase window.", priority: 1 },
      { supplementId: "supp-rhodiola",             rationale: "Mental endurance and fatigue buffering during peak habit friction.", priority: 2 },
      { supplementId: "supp-ashwagandha",          rationale: "Continued cortisol modulation during high-stress habit transition.", priority: 3 },
      { supplementId: "supp-magnesium-glycinate",  rationale: "Sleep quality maintenance during the behaviorally demanding reset window.", priority: 4 },
      { supplementId: "supp-l-theanine",           rationale: "Evening relaxation support without daytime sedation.", priority: 5 },
      { supplementId: "supp-glycine",              rationale: "Non-sedating sleep improvement during highest-demand phase.", priority: 6 },
      { supplementId: "supp-magnesium-l-threonate", rationale: "Synaptic support during high-cognitive-load habit rewiring.", priority: 7 },
    ],
  },
  {
    phase: "rebuild",
    focus: "Energy and metabolic recovery support",
    entries: [
      { supplementId: "supp-coq10",              rationale: "Mitochondrial electron transport support during metabolic recovery.", priority: 1 },
      { supplementId: "supp-b-vitamins",         rationale: "Metabolic cofactors for energy production across every cellular pathway.", priority: 2 },
      { supplementId: "supp-alpha-lipoic-acid",  rationale: "Mitochondrial antioxidant reducing oxidative load from metabolic recovery.", priority: 3 },
      { supplementId: "supp-ashwagandha",        rationale: "Adaptogenic support for energy recovery and stress-driven metabolic burden.", priority: 4 },
      { supplementId: "supp-magnesium-glycinate", rationale: "Continued sleep and recovery support.", priority: 5 },
    ],
  },
  {
    phase: "optimize",
    focus: "Performance stability and resilience",
    entries: [
      { supplementId: "supp-l-theanine",         rationale: "Focus + calm profile — the signature neurochemical state of the Optimize phase.", priority: 1 },
      { supplementId: "supp-coq10",              rationale: "Cellular energy efficiency for sustained performance.", priority: 2 },
      { supplementId: "supp-b-vitamins",         rationale: "Methylation and neurotransmitter synthesis cofactors for cognitive performance.", priority: 3 },
      { supplementId: "supp-alpha-lipoic-acid",  rationale: "Oxidative stress reduction for long-term mitochondrial function.", priority: 4 },
      { supplementId: "supp-magnesium-glycinate", rationale: "Sustained sleep quality as performance foundation.", priority: 5 },
    ],
  },
];

// ── Helpers ─────────────────────────────────────────────────────────────────

export function getSupplementById(id: string): Supplement | undefined {
  return SUPPLEMENTS.find((s) => s.id === id);
}

export function getSupplementBySlug(slug: string): Supplement | undefined {
  return SUPPLEMENTS.find((s) => s.slug === slug);
}

export function getSupplementsByCategory(category: string): Supplement[] {
  return SUPPLEMENTS.filter((s) => s.category === category && s.status === "published");
}

export function getPublishedSupplements(): Supplement[] {
  return SUPPLEMENTS.filter((s) => s.status === "published");
}

export function getPhaseStack(phase: string): PhaseStack | undefined {
  return PHASE_STACKS.find((ps) => ps.phase === phase);
}
