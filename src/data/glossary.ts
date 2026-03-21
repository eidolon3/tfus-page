export interface GlossaryEntry {
  term: string
  abbreviation?: string
  definition: string
  category: 'physics' | 'neuroscience' | 'engineering' | 'clinical' | 'general'
}

export const glossary: GlossaryEntry[] = [
  {
    term: 'Transcranial Focused Ultrasound',
    abbreviation: 'tFUS',
    definition: 'A non-invasive neuromodulation technique that uses focused acoustic energy to target specific brain regions through the intact skull.',
    category: 'general',
  },
  {
    term: 'Blood-Brain Barrier',
    abbreviation: 'BBB',
    definition: 'A highly selective semipermeable border of endothelial cells that prevents solutes in the circulating blood from crossing into the extracellular fluid of the central nervous system. tFUS with microbubbles can transiently open the BBB for drug delivery.',
    category: 'neuroscience',
  },
  {
    term: 'Phased Array Transducer',
    definition: 'A transducer with multiple independently controlled elements that can electronically steer and focus the ultrasound beam by adjusting the phase (timing) of each element\'s signal.',
    category: 'engineering',
  },
  {
    term: 'Acoustic Impedance',
    definition: 'The product of a medium\'s density and the speed of sound through it. Differences in acoustic impedance between tissues (e.g., skull bone vs. brain) cause reflection and refraction of ultrasound waves.',
    category: 'physics',
  },
  {
    term: 'Spatial-Peak Temporal-Average Intensity',
    abbreviation: 'ISPTA',
    definition: 'The maximum intensity at the focal point averaged over the pulse repetition period. A key safety parameter for determining whether tFUS is in the thermal or mechanical bioeffects regime.',
    category: 'physics',
  },
  {
    term: 'Mechanical Index',
    abbreviation: 'MI',
    definition: 'A metric (peak negative pressure divided by the square root of frequency) used to estimate the likelihood of cavitation. Regulatory bodies use MI thresholds to ensure safety.',
    category: 'physics',
  },
  {
    term: 'Cavitation',
    definition: 'The formation and oscillation (stable cavitation) or violent collapse (inertial cavitation) of gas bubbles in tissue under ultrasound. Inertial cavitation can cause tissue damage and is generally avoided in neuromodulation.',
    category: 'physics',
  },
  {
    term: 'Neuromodulation',
    definition: 'The alteration of nerve activity through targeted delivery of a stimulus (electrical, magnetic, or acoustic) to specific neurological sites in the body.',
    category: 'neuroscience',
  },
  {
    term: 'Duty Cycle',
    definition: 'The percentage of time that the ultrasound is actively transmitting within a pulse repetition period. Low duty cycles (< 10%) are typical for neuromodulation; high duty cycles are used for thermal ablation.',
    category: 'engineering',
  },
  {
    term: 'Pulse Repetition Frequency',
    abbreviation: 'PRF',
    definition: 'The number of ultrasound pulse bursts delivered per second. PRF influences the temporal pattern of neuromodulation and is a key dosimetry parameter.',
    category: 'engineering',
  },
  {
    term: 'Focal Length',
    definition: 'The distance from the transducer face to the point of maximum acoustic intensity (the focal point). Determines how deep into the brain the ultrasound can target.',
    category: 'physics',
  },
  {
    term: 'Acoustic Aberration',
    definition: 'Distortion of the ultrasound wavefront caused by the skull\'s heterogeneous bone structure, which varies in thickness and density. Aberration correction is critical for accurate targeting.',
    category: 'physics',
  },
  {
    term: 'MR-guided Focused Ultrasound',
    abbreviation: 'MRgFUS',
    definition: 'A technique combining focused ultrasound with real-time MRI for targeting guidance and temperature monitoring. Used clinically for thermal ablation in essential tremor.',
    category: 'clinical',
  },
  {
    term: 'Thermal Ablation',
    definition: 'The use of high-intensity focused ultrasound (HIFU) to raise tissue temperature above ~56°C, causing coagulative necrosis. FDA-approved for essential tremor thalamotomy.',
    category: 'clinical',
  },
  {
    term: 'Sonication',
    definition: 'A single application or exposure of focused ultrasound to a target. A treatment session may consist of multiple sonications.',
    category: 'general',
  },
  {
    term: 'Action Potential',
    abbreviation: 'AP',
    definition: 'A rapid, transient change in membrane potential that propagates along a neuron\'s axon. tFUS is hypothesized to modulate neural activity by affecting ion channel mechanosensitivity.',
    category: 'neuroscience',
  },
  {
    term: 'Microbubbles',
    definition: 'Gas-filled microspheres (1-10 μm diameter) used as ultrasound contrast agents. When combined with tFUS, microbubble oscillations can mechanically disrupt the BBB for targeted drug delivery.',
    category: 'clinical',
  },
  {
    term: 'Sham Stimulation',
    definition: 'A control condition in tFUS studies where the transducer is positioned but no acoustic energy is delivered, used to account for placebo effects and auditory confounds.',
    category: 'clinical',
  },
  {
    term: 'Acoustic Radiation Force',
    abbreviation: 'ARF',
    definition: 'A unidirectional force exerted on tissue by the absorption and reflection of an ultrasound wave. ARF is one proposed mechanism by which tFUS may modulate neural activity.',
    category: 'physics',
  },
  {
    term: 'Skull Coupling',
    definition: 'The acoustic interface between the transducer and the skull surface. Coupling media (water, gel) are used to minimize air gaps that would reflect ultrasound energy.',
    category: 'engineering',
  },
].sort((a, b) => a.term.localeCompare(b.term))
