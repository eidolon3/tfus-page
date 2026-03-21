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
    year: 1954,
    title: 'Fry brothers — Reversible suppression of brain activity',
    description: 'William and Francis Fry demonstrated that low-intensity focused ultrasound could reversibly suppress neural activity without destroying tissue.',
    significance: 'breakthrough',
  },
  {
    year: 1991,
    title: 'Hynynen — MR-guided FUS concept',
    description: 'Kullervo Hynynen demonstrated the concept of using MRI to guide focused ultrasound thermal ablation, laying the foundation for MRgFUS.',
    significance: 'breakthrough',
  },
  {
    year: 2001,
    title: 'Hynynen — BBB opening with microbubbles',
    description: 'First demonstration that FUS combined with microbubbles can transiently open the blood-brain barrier in vivo, enabling targeted drug delivery.',
    significance: 'breakthrough',
  },
  {
    year: 2008,
    title: 'Tyler et al. — Low-intensity FUS modulates neural activity',
    description: 'Showed that low-intensity, low-frequency ultrasound can activate neurons and synaptic circuits in brain slices, reviving interest in FUS neuromodulation.',
    significance: 'breakthrough',
  },
  {
    year: 2010,
    title: 'Tufail et al. — In vivo tFUS neuromodulation in mice',
    description: 'First demonstration of non-invasive transcranial FUS stimulating intact brain circuits in living mice, triggering motor responses.',
    significance: 'major',
  },
  {
    year: 2013,
    title: 'ExAblate receives FDA approval for uterine fibroids',
    description: 'While not brain-focused, this FDA clearance validated the MRgFUS platform technology that would later be adapted for neurological applications.',
    significance: 'notable',
  },
  {
    year: 2014,
    title: 'Legon et al. — First human tFUS neuromodulation',
    description: 'Landmark study demonstrating that tFUS can modulate primary somatosensory cortex in awake humans, altering EEG responses and sensory perception.',
    significance: 'breakthrough',
  },
  {
    year: 2016,
    title: 'Elias et al. — MRgFUS thalamotomy RCT (NEJM)',
    description: 'Pivotal randomized controlled trial showing MRgFUS thalamotomy significantly reduces hand tremor in essential tremor patients. Led to FDA approval.',
    significance: 'breakthrough',
  },
  {
    year: 2016,
    title: 'FDA clears ExAblate for essential tremor',
    description: 'First FDA clearance for MRgFUS treatment of a neurological condition, marking a major clinical milestone for the field.',
    significance: 'major',
  },
  {
    year: 2018,
    title: 'Lipsman et al. — First human BBB opening trial',
    description: 'First-in-human clinical trial of MRgFUS blood-brain barrier disruption in Alzheimer\'s disease patients, demonstrating safety and feasibility.',
    significance: 'breakthrough',
  },
  {
    year: 2020,
    title: 'Sanguinetti et al. — tFUS for mood modulation',
    description: 'Demonstrated that single-session tFUS to right prefrontal cortex improved mood in healthy volunteers, opening psychiatric applications.',
    significance: 'major',
  },
  {
    year: 2023,
    title: 'ITRUSST safety consensus published',
    description: 'International Transcranial Ultrasonic Stimulation Safety and Standards consortium publishes first comprehensive safety guidelines.',
    significance: 'major',
  },
  {
    year: 2024,
    title: 'Multiple Phase II trials ongoing',
    description: 'Clinical trials for tFUS in depression, Alzheimer\'s, epilepsy, and chronic pain actively recruiting, with several approaching Phase II endpoints.',
    significance: 'notable',
  },
]
