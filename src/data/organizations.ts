export interface Organization {
  name: string
  institution: string
  country: string
  pi: string
  focusArea: string
  website: string
}

export interface Company {
  name: string
  founderCeo: string
  focus: string
  stage: 'clinical' | 'pre-clinical' | 'consumer' | 'research'
raised: string
  website: string
}

export const organizations: Organization[] = [
  {
    name: 'Bhatt Lab',
    institution: 'University of Southern California',
    country: 'USA',
    pi: 'Manbir Bhatt',
    focusArea: 'Low-intensity tFUS neuromodulation',
    website: '',
  },
  {
    name: 'Tyler Lab',
    institution: 'University of Alabama at Birmingham',
    country: 'USA',
    pi: 'William "Jamie" Tyler',
    focusArea: 'Low-intensity FUS for neural circuits',
    website: 'https://www.uab.edu',
  },
  {
    name: 'Legon Lab',
    institution: 'Virginia Tech / Fralin Biomedical Research Institute',
    country: 'USA',
    pi: 'Wynn Legon',
    focusArea: 'tFUS neuromodulation, somatosensory cortex',
    website: 'https://fbri.vtc.vt.edu/research/labs/legon.html',
  },
  {
    name: 'Butts Pauly Lab',
    institution: 'Stanford University',
    country: 'USA',
    pi: 'Kim Butts Pauly',
    focusArea: 'MR-guided FUS, neuromodulation',
    website: 'https://kbplab.stanford.edu',
  },
  {
    name: 'Shapiro Lab',
    institution: 'California Institute of Technology',
    country: 'USA',
    pi: 'Mikhail Shapiro',
    focusArea: 'Sonogenetics, ultrasound gene expression, acoustic biomolecules',
    website: 'https://shapirolab.caltech.edu',
  },
  {
    name: 'Yoo Lab',
    institution: 'Korea Institute of Science and Technology',
    country: 'South Korea',
    pi: 'Seung-Schik Yoo',
    focusArea: 'FUS neuromodulation, brain-computer interfaces',
    website: 'https://www.kist.re.kr',
  },
  {
    name: 'Hynynen Lab',
    institution: 'Sunnybrook Research Institute',
    country: 'Canada',
    pi: 'Kullervo Hynynen',
    focusArea: 'Blood-brain barrier opening, MRgFUS',
    website: 'https://sunnybrook.ca',
  },
  {
    name: 'Tanter Lab',
    institution: 'ESPCI Paris / INSERM',
    country: 'France',
    pi: 'Mickael Tanter',
    focusArea: 'Functional ultrasound imaging (fUSI), neuromodulation',
    website: 'https://www.institut-langevin.espci.fr',
  },
  {
    name: 'Deffieux Lab',
    institution: 'ESPCI Paris / INSERM',
    country: 'France',
    pi: 'Thomas Deffieux',
    focusArea: 'Ultrafast functional ultrasound imaging',
    website: 'https://www.inserm.fr',
  },
  {
    name: 'Aubry Lab',
    institution: 'ESPCI Paris',
    country: 'France',
    pi: 'Jean-François Aubry',
    focusArea: 'Transcranial aberration correction, skull modeling',
    website: 'https://www.espci.fr',
  },
  {
    name: 'Fouragnan Lab',
    institution: 'University of Plymouth',
    country: 'UK',
    pi: 'Elsa Fouragnan',
    focusArea: 'tFUS for decision making, anterior cingulate cortex, NHP',
    website: 'https://www.plymouth.ac.uk',
  },
  {
    name: 'Verhagen Lab',
    institution: 'Donders Institute / University of Oxford',
    country: 'Netherlands',
    pi: 'Lennart Verhagen',
    focusArea: 'NHP tFUS, offline neuromodulation, fMRI',
    website: 'https://www.ru.nl/donders',
  },
  {
    name: 'Folloni Lab',
    institution: 'Max Planck Institute / University of Pittsburgh',
    country: 'Germany',
    pi: 'Davide Folloni',
    focusArea: 'NHP tFUS, prefrontal circuits, behavior',
    website: 'https://www.cbs.mpg.de',
  },
  {
    name: 'Fomenko Lab',
    institution: 'University of Toronto',
    country: 'Canada',
    pi: 'Anton Fomenko',
    focusArea: 'Clinical tFUS for psychiatric disorders, OCD, depression',
    website: 'https://www.uhn.ca',
  },
  {
    name: 'McDannold Lab',
    institution: 'Brigham and Women\'s Hospital / Harvard',
    country: 'USA',
    pi: 'Nathan McDannold',
    focusArea: 'BBB opening, drug delivery, thermal ablation',
    website: 'https://fus.bwh.harvard.edu',
  },
  {
    name: 'Focused Ultrasound Foundation',
    institution: 'FUS Foundation',
    country: 'USA',
    pi: 'Neal Kassell',
    focusArea: 'Advocacy, funding, clinical translation',
    website: 'https://www.fusfoundation.org',
  },
]

export const companies: Company[] = [
  {
    name: 'Openwater',
    founderCeo: 'Mary Lou Jepsen, Aaron Timm',
    focus: 'Open-LIFU portable open-source LIFU platform for depression and neurological disease',
    stage: 'clinical',
    raised: '$100M',
    website: 'https://www.openwater.health',
  },
  {
    name: 'Nudge',
    founderCeo: 'Fred Ehrsam, Jeremy Barenholtz',
    focus: 'Whole-brain ultrasound headset for imaging and stimulation',
    stage: 'pre-clinical',
    raised: '$100M',
    website: 'https://www.nudge.com',
  },
  {
    name: 'Merge Labs',
    founderCeo: 'Alex Blania, Sam Altman',
    focus: 'Non-implantable ultrasound BCI for thought-to-text and clinical neuromodulation',
    stage: 'research',
    raised: '$252M',
    website: 'https://merge.io/blog',
  },
  {
    name: 'Forest Neurotech',
    founderCeo: 'Sumner Norman, Tyson Aflalo',
    focus: 'Ultrasound-on-chip for brain imaging and neuromodulation',
    stage: 'research',
    raised: '$14M',
    website: 'https://forestneurotech.org',
  },
  {
    name: 'SPIRE',
    founderCeo: 'Jan Kubanek, Tom Riis',
    focus: 'DIADEM LIFU device for treatment-resistant depression and chronic pain',
    stage: 'clinical',
    raised: 'Undisclosed',
    website: 'https://spire.us',
  },
  {
    name: 'Prophetic',
    founderCeo: 'Eric Wollberg, Wesley Berry',
    focus: 'Halo tFUS + EEG headband for lucid dreaming induction',
    stage: 'consumer',
    raised: '$3.4M',
    website: 'https://www.prophetic.com',
  },
  {
    name: 'Gestala',
    founderCeo: 'Phoenix Peng, Tianqiao Chen',
    focus: 'Ultrasound BCI for depression, chronic pain, PTSD, stroke rehab',
    stage: 'pre-clinical',
    raised: '$21.6M',
    website: 'https://www.gestala.com',
  },
  {
    name: 'Sanmai',
    founderCeo: 'Jay Sanguinetti',
    focus: 'AI-guided focused ultrasound headset for mental health treatment',
    stage: 'pre-clinical',
    raised: '$25M',
    website: 'https://sanmai.tech',
  },
]
