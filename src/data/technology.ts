export interface TechnologyItem {
  name: string
  manufacturer: string
  type: string
  frequency_kHz: number
  elements: number
  focalLength_mm: number
  fdaStatus: string
  applications: string
}

export const technology: TechnologyItem[] = [
  {
    name: 'ExAblate Neuro',
    manufacturer: 'Insightec',
    type: 'Phased array',
    frequency_kHz: 650,
    elements: 1024,
    focalLength_mm: 150,
    fdaStatus: 'FDA cleared',
    applications: 'Essential tremor thalamotomy, tremor-dominant PD',
  },
  {
    name: 'NaviFUS',
    manufacturer: 'NaviFUS Corp',
    type: 'Phased array',
    frequency_kHz: 500,
    elements: 256,
    focalLength_mm: 70,
    fdaStatus: 'Investigational',
    applications: 'Neuronavigation-guided BBB opening, neuromodulation',
  },
  {
    name: 'NeuroFUS',
    manufacturer: 'Brainsonix',
    type: 'Single element',
    frequency_kHz: 500,
    elements: 1,
    focalLength_mm: 65,
    fdaStatus: 'Investigational',
    applications: 'Low-intensity tFUS neuromodulation',
  },
  {
    name: 'Sonic Concepts H-115',
    manufacturer: 'Sonic Concepts',
    type: 'Single element',
    frequency_kHz: 500,
    elements: 1,
    focalLength_mm: 52,
    fdaStatus: 'Research only',
    applications: 'Research — neuromodulation, sonogenetics',
  },
  {
    name: 'CTX-500',
    manufacturer: 'BrainBox Ltd',
    type: 'Multi-element',
    frequency_kHz: 500,
    elements: 4,
    focalLength_mm: 40,
    fdaStatus: 'Research only',
    applications: 'Portable tFUS neuromodulation research',
  },
  {
    name: 'SonoCloud',
    manufacturer: 'Carthera',
    type: 'Implantable',
    frequency_kHz: 1050,
    elements: 9,
    focalLength_mm: 0,
    fdaStatus: 'Investigational',
    applications: 'Implantable BBB opener for glioblastoma drug delivery',
  },
  {
    name: 'LIFU Prototype',
    manufacturer: 'Open Source (OpenWater)',
    type: 'Phased array',
    frequency_kHz: 250,
    elements: 128,
    focalLength_mm: 80,
    fdaStatus: 'Research only',
    applications: 'Open-source platform for tFUS research',
  },
  {
    name: 'Vantage 256',
    manufacturer: 'Verasonics',
    type: 'Research platform',
    frequency_kHz: 0,
    elements: 256,
    focalLength_mm: 0,
    fdaStatus: 'Research only',
    applications: 'Programmable research ultrasound platform (pairs with custom transducers)',
  },
]
