export interface Organization {
  id: string
  name: string
  institution: string
  country: string
  pi: string
  focusArea: string
  website: string
}

export interface Study {
  id: string
  title: string
  authors: string
  year: number
  journal: string
  doi: string
  targetRegion: string
  frequency_kHz: number
  keyFinding: string
  category: 'neuromodulation' | 'bbb_opening' | 'imaging' | 'thermal' | 'other'
}

export interface TechnologyItem {
  id: string
  name: string
  manufacturer: string
  type: 'single_element' | 'phased_array' | 'multi_element'
  frequency_kHz: number
  elements: number
  focalLength_mm: number
  fdaStatus: 'cleared' | 'investigational' | 'research_only'
  applications: string[]
}

export interface OpenQuestion {
  id: string
  question: string
  context: string
  category: 'mechanism' | 'safety' | 'dosimetry' | 'clinical' | 'technical'
  status: 'open' | 'partially_addressed' | 'emerging_consensus'
}

export interface Milestone {
  id: string
  year: number
  title: string
  description: string
  significance: 'breakthrough' | 'major' | 'notable'
}

export interface ColumnDef<T> {
  key: keyof T
  header: string
  sortable: boolean
  render?: (value: T[keyof T], row: T) => React.ReactNode
  width?: string
}
