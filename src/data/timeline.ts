export interface Milestone {
  year: number
  title: string
  description: string
  significance: 'breakthrough' | 'major' | 'notable'
}

export const timeline: Milestone[] = [
  {
    year: 1942,
    title: 'Lynn & Putnam — First ultrasound brain effects',
    description: 'First report of focused ultrasound producing lesions in animal brains, establishing the physical basis for therapeutic ultrasound in neuroscience.',
    significance: 'breakthrough',
  },
  {
    year: 1958,
    title: 'Fry et al. — Ultrasound modulates brain activity',
    description: 'tFUS on the lateral geniculate nucleus of a craniectomized cat reduced electrical impulses, demonstrating that ultrasound can modulate brain activity.',
    significance: 'breakthrough',
  },
  {
    year: 2010,
    title: 'Tufail et al. — In vivo cortex activation in mice',
    description: 'First demonstration of in vivo cortex activation in mice with ultrasound, showing non-invasive transcranial FUS can stimulate intact brain circuits.',
    significance: 'breakthrough',
  },
  {
    year: 2013,
    title: 'Hameroff et al. — First human transcranial ultrasound study',
    description: 'First human transcranial ultrasound study — unfocused stimulation on 31 chronic pain patients showing improved mood. Opened the door to human applications.',
    significance: 'breakthrough',
  },
  {
    year: 2014,
    title: 'Legon et al. — First focused LIFU trial on humans',
    description: 'First focused low-intensity ultrasound trial on humans, tested on S1. Showed that LIFU can attenuate SEPs and increase performance on sensory discrimination tasks. LIFU can modulate brain activity in human participants.',
    significance: 'breakthrough',
  },
  {
    year: 2015,
    title: 'Lee et al. — LIFU can excite brain activity',
    description: 'Showed that LIFU on S1 can elicit a sensation, demonstrating that LIFU can not only inhibit brain activity but excite it.',
    significance: 'major',
  },
  {
    year: 2016,
    title: 'Monti et al. — Patient emerges from coma-like state',
    description: 'Stimulated the thalamus of a patient in a coma-like state. Patient emerged from this minimally conscious state after sonication.',
    significance: 'breakthrough',
  },
  {
    year: 2018,
    title: 'Legon et al. — First deep brain LIFU in humans',
    description: 'First LIFU trial on human participants targeting a deep brain region (thalamus). Showed that LIFU can attenuate evoked potentials in a deep brain region — the first trial of deep brain modulation that didn\'t require surgery.',
    significance: 'breakthrough',
  },
  {
    year: 2019,
    title: 'Verhagen et al. — Sustained offline effects in primates',
    description: 'Showed that tFUS could produce offline effects on cortical activation in primates lasting over one hour after stimulation, and increased local coupling (synchronization) with strongly connected regions. First study to examine medium-term brain changes from tFUS.',
    significance: 'major',
  },
  {
    year: 2019,
    title: 'Beisteiner et al. — tFUS for Alzheimer\'s disease',
    description: 'Treated 35 Alzheimer\'s patients using tFUS with ultrashort pulses (3μs) for 2–4 weeks. Cognitive scores improved and the improvement lasted up to 3 months, with increased functional connectivity in the hippocampus.',
    significance: 'major',
  },
  {
    year: 2020,
    title: 'Badran et al. — First tFUS pain reduction via thalamus',
    description: 'Ultrasound to the right anterior thalamus in 19 subjects. In 17 accurately sonicated subjects, thermal pain was significantly attenuated. First paper to reduce pain by targeting the thalamus, using MRI for targeting.',
    significance: 'major',
  },
  {
    year: 2020,
    title: 'Sanguinetti et al. — tFUS for mood modulation',
    description: 'tFUS to the right inferior frontal gyrus improved mood scores in 48 subjects and reduced default mode network connectivity. Opened psychiatric applications of tFUS.',
    significance: 'major',
  },
  {
    year: 2021,
    title: 'Yu et al. — Neuron-type-specific responses to PRF',
    description: 'Showed that excitatory and inhibitory neurons respond differently to ultrasound pulse repetition frequency (PRF). Excitatory neurons dramatically increased firing rates with higher PRF, while inhibitory neurons showed no significant response — suggesting specific neuron types can be preferentially targeted by tuning PRF.',
    significance: 'major',
  },
  {
    year: 2023,
    title: 'Yaakub et al. — Neurochemical evidence for tFUS mechanism',
    description: 'TUS in humans selectively reduced GABA levels in the posterior cingulate cortex and increased functional connectivity for at least 50 minutes after stimulation. Provided direct neurochemical evidence for how tFUS works — by reducing inhibitory GABA neurotransmission — and showed tFUS can induce neuroplastic changes.',
    significance: 'major',
  },
  {
    year: 2023,
    title: 'ITRUSST safety consensus (Aubry et al.)',
    description: 'International Transcranial Ultrasonic Stimulation Safety and Standards consortium publishes first comprehensive safety guidelines.',
    significance: 'major',
  },
  {
    year: 2023,
    title: 'Mahoney/Rezai et al. — First LIFU for substance use disorder',
    description: 'First-in-human application of low-intensity focused ultrasound for substance use disorder, opening a new therapeutic frontier.',
    significance: 'notable',
  },
  {
    year: 2024,
    title: 'Chou et al. — Amygdala modulation of fear networks',
    description: 'Demonstrated that tFUS can modulate amygdala-based fear networks, advancing understanding of tFUS for anxiety and fear-related disorders.',
    significance: 'notable',
  },
  {
    year: 2024,
    title: 'Riis et al. — tFUS for depression',
    description: 'tFUS applied for treatment of depression, contributing to the growing body of evidence for psychiatric applications.',
    significance: 'notable',
  },
  {
    year: 2024,
    title: 'Riis et al. — Tremor reduction with tFUS',
    description: 'Almost completely removed tremor in two-thirds of patients in the short term, demonstrating potent neuromodulatory effects.',
    significance: 'major',
  },
  {
    year: 2025,
    title: 'Rezai et al. — Opioid use disorder trial results',
    description: 'Published results from tFUS trial targeting opioid use disorder, advancing clinical evidence for addiction treatment with focused ultrasound.',
    significance: 'notable',
  },
]
