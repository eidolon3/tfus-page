export interface OpenQuestion {
  question: string
  context: string
  category: string
  status: string
}

export const openQuestions: OpenQuestion[] = [
  {
    question: 'What is the primary mechanism of low-intensity tFUS neuromodulation?',
    context: 'Candidate mechanisms include mechanosensitive ion channels (Piezo1, TREK-1, TRAAK), intramembrane cavitation (neuronal bilayer sonophore model), and thermal effects. Evidence supports multiple co-occurring mechanisms depending on parameters.',
    category: 'Mechanism',
    status: 'Partially addressed',
  },
  {
    question: 'How do we standardize tFUS dosimetry and reporting?',
    context: 'The ITRUSST consortium is working on consensus guidelines, but there is still significant variability in how groups report acoustic parameters (Isppa, Ispta, MI, duty cycle, PRF). This hinders cross-study comparisons.',
    category: 'Dosimetry',
    status: 'Emerging consensus',
  },
  {
    question: 'Can tFUS achieve cell-type-specific neuromodulation?',
    context: 'Sonogenetics — using ultrasound-sensitive proteins (e.g., hsTRPA1, MscL) in genetically targeted neurons — could allow cell-type specificity. But clinical translation of viral vector delivery remains a challenge.',
    category: 'Technical',
    status: 'Open',
  },
  {
    question: 'What are the long-term safety implications of repeated tFUS sessions?',
    context: 'Most safety data comes from single-session or short-duration studies. Chronic exposure data in humans is limited. The ITRUSST framework defines per-session limits but chronic cumulative dosing is uncharted.',
    category: 'Safety',
    status: 'Open',
  },
  {
    question: 'How does skull heterogeneity affect focal precision across populations?',
    context: 'Skull thickness, density, and microstructure vary widely by age, sex, and ethnicity. CT-based aberration correction helps, but real-time adaptive focusing remains an active research area.',
    category: 'Technical',
    status: 'Partially addressed',
  },
  {
    question: 'Can tFUS treat drug-resistant depression?',
    context: 'Early evidence (Sanguinetti et al. 2020, ongoing RCTs) suggests tFUS to rPFC/DLPFC may modulate mood circuits. Several Phase I/II trials are underway but no definitive efficacy data yet.',
    category: 'Clinical',
    status: 'Open',
  },
  {
    question: 'What is the optimal frequency for transcranial neuromodulation?',
    context: '200-700 kHz is the current sweet spot. Lower frequencies penetrate skull better but have worse spatial resolution. Higher frequencies provide tighter focus but more absorption. The ideal frequency may depend on target depth.',
    category: 'Dosimetry',
    status: 'Partially addressed',
  },
  {
    question: 'How can we do real-time monitoring of tFUS effects?',
    context: 'Options include MR thermometry (for thermal), MR-ARFI (for mechanical displacement), EEG (for neural response), and functional ultrasound imaging. Closed-loop systems that adjust parameters in real-time are a key goal.',
    category: 'Technical',
    status: 'Partially addressed',
  },
]
