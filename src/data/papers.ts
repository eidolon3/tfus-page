export interface Paper {
  year: number
  title: string
  takeaway: string
}

export const papers: Paper[] = [
  {
    year: 1958,
    title: 'Fry et al.',
    takeaway: 'Demonstrated LIFU\'s ability to modulate brain activity for the first time. Inhibited visual evoked potentials in the LGN of craniotomized cats. Many later papers cited Fry\'s 1958 work as the origin point of the field.',
  },
  {
    year: 2010,
    title: 'Tufail et al.',
    takeaway: 'First demonstration of noninvasive tFUS neuromodulation in intact living animals. Low-frequency pulsed ultrasound applied transcranially to mouse motor cortex triggered visible motor responses, including tail and paw movements. Established that tFUS could stimulate brain circuits through the skull without surgery, bridging the gap between in vitro work and the human trials that would follow.',
  },
  {
    year: 2014,
    title: 'Legon et al.',
    takeaway: 'First confirmation of tFUS\'s ability to modulate the brain of human subjects. Targeting S1, Legon et al successfully attenuated SEPs in 11/12 subjects, and noted increased performance on sensory discrimination activities. Also helped validate tFUS\'s spatial precision in the brain \u2013 moving the beam just 1cm to the right or left abolished the attenuation on the SEPs.',
  },
  {
    year: 2015,
    title: 'Lee et al.',
    takeaway: 'Established tFUS\'s ability to excite the brain, inducing sensations in 11 patients by targeting S1. In most cases, sensations were localized to single fingers, documenting tFUS high spatial precision. While researchers tried to induce sensations specifically in the fingers, in some cases sensations were induced in other areas such as the wrist, arm, and feet.',
  },
  {
    year: 2016,
    title: 'Monti et al.',
    takeaway: 'Targeted the thalamus of a patient in a minimally conscious state with low-intensity focused ultrasound. The patient emerged from the minimally conscious state shortly after sonication, regaining the ability to communicate and perform voluntary movements. While a single case and potentially coincidental, the result generated significant attention and motivated further investigation into tFUS for disorders of consciousness.',
  },
  {
    year: 2018,
    title: 'Legon et al.',
    takeaway: 'First tFUS trial that targeted a subcortical structure. 40 participants underwent either tFUS or sham neuromodulation targeted at the unilateral sensory thalamus. Reported both a statistically significant reduction in SEPs, and reduced participant performance on sensory discrimination tasks.',
  },
  {
    year: 2019,
    title: 'Verhagen et al.',
    takeaway: 'First evidence of sustained offline effects from tFUS. Using just 40 seconds sonication, they produced regionally specific changes in brain connectivity lasting over two hours in macaques. Shifted the field\'s understanding of tFUS from a tool for transient modulation to one that can induce long lasting changes in the brain.',
  },
  {
    year: 2019,
    title: 'Beisteiner et al.',
    takeaway: 'First multi-patient study to treat a neurological disease. Treated 35 Alzheimer\'s patients using a unique protocol \u2013 ultrashort pulses (3\u03BCs) delivered using a steerable beam. Cognitive scores improved, with gains lasting for up to 3 months.',
  },
  {
    year: 2020,
    title: 'Badran et al.',
    takeaway: 'First study to demonstrate tFUS-induced pain inhibition in humans. Targeting the right anterior thalamus in 19 subjects, and successfully increased thermal pain thresholds. Established the anterior thalamus as a viable target for noninvasive pain modulation.',
  },
  {
    year: 2020,
    title: 'Sanguinetti et al.',
    takeaway: 'Demonstrated significantly improved mood after tFUS targeting the right inferior frontal gyrus (rIFG) in 24 subjects. A follow up experiment with 9 new participants revealed attenuated functional connectivity in the Default Mode Network after sonication. First focused ultrasound study targeting the prefrontal cortex, established the ability of tFUS to elevate mood, and opened questions on focused ultrasound\'s potential to assist with meditation.',
  },
  {
    year: 2021,
    title: 'Yu et al.',
    takeaway: 'Demonstrated using single-neuron recordings in mice that excitatory and inhibitory neurons respond differently to ultrasound pulse repetition frequency (PRF). Excitatory neurons dramatically increased firing rates as PRF increased, while inhibitory neurons retained constant firing rates as PRF increased. Suggested we can target specific neuron types by tuning the PRF parameter.',
  },
  {
    year: 2023,
    title: 'Yaakub et al.',
    takeaway: 'Provided the first direct neurochemical evidence of tFUS\'s mechanism in humans. Showed that tFUS selectively reduced GABA levels in the posterior cingulate cortex of human subjects, with effects lasting at least 50 minutes. Supported the hypothesis that tFUS modulates the brain by reducing GABAergic inhibition.',
  },
  {
    year: 2023,
    title: 'Mahoney et al.',
    takeaway: 'First human trial for tFUS for substance use disorder, targeting the bilateral nucleus accumbens in four participants. For the two participants who received the higher dose (90W), tFUS reduced cravings for multiple substances for up to 90 days after sonication. Opens the door for the use of tFUS as a noninvasive alternative to DBS for treating addiction.',
  },
  {
    year: 2024,
    title: 'Riis et al.',
    takeaway: 'Anterior cingulate cortex stimulation for chronic pain, with twenty participants. Ultrasound to the ACC produced rapid and long lasting reductions in chronic pain severity. 60% of subjects saw meaningful improvement on both day 1 and day 7 after active stimulation.',
  },
  {
    year: 2024,
    title: 'Chou et al.',
    takeaway: 'Study of 30 healthy participants investigating tFUS targeting the amygdala during a fear-inducing task. Results show that sonication reduced BOLD activation in the amygdala, hippocampus, and dorsal anterior cingulate cortex, with amygdala signal reductions correlating with decreased self-reported anxiety.',
  },
  {
    year: 2024,
    title: 'Riis et al.',
    takeaway: 'Targeting the ventral intermediate nucleus (VIM) of the thalamus with dual phased arrays at 650 kHz, tFUS nearly abolished tremor in 2 of 3 patients (97-98% amplitude reduction) within seconds of stimulation onset. Effects were cumulative across trials and transient, returning to baseline within ~20 minutes. Safe and well-tolerated with no adverse events.',
  },
  {
    year: 2025,
    title: 'He et al.',
    takeaway: 'Single case report: cingulum bundle tFUS for central post-stroke pain. Remarkable pain reduction after one week, sustained over 5 months, allowing full medication discontinuation by day 120. BOLD-fMRI confirmed normalized activity at 150-day follow-up.',
  },
  {
    year: 2026,
    title: 'Subramaniam et al.',
    takeaway: 'First-in-human study using tFUS for schizophrenia hallucinations, targeting deep reward-circuit structures in 3 patients. Stimulation safely reduced abnormal brain connectivity linked to hallucinations, with accompanying reductions in hallucination severity. No adverse events. Provides early proof that this circuit is a promising target for treating psychosis.',
  },
]
