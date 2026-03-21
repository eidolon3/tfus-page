import PageWrapper from '../components/ui/PageWrapper'
import DataTable from '../components/ui/DataTable'
import { organizations, companies } from '../data/organizations'

const stageColor: Record<string, string> = {
  clinical:     'text-[#00FFFF] border-[#00FFFF]/30',
  'pre-clinical': 'text-emerald-400 border-emerald-400/30',
  consumer:     'text-orange-400 border-orange-400/30',
  research:     'text-purple-400 border-purple-400/30',
}

const labColumns = [
  {
    key: 'name' as const,
    header: 'Lab / Group',
    render: (val: unknown) => (
      <span className="text-white/90 font-medium">{String(val)}</span>
    ),
  },
  {
    key: 'pi' as const,
    header: 'PI',
    render: (val: unknown) => (
      <span className="text-[#BF40BF]/80">{String(val)}</span>
    ),
  },
  { key: 'institution' as const, header: 'Institution' },
  { key: 'country' as const, header: 'Country', width: 'w-24' },
  { key: 'focusArea' as const, header: 'Focus Area' },
  {
    key: 'website' as const,
    header: 'Link',
    sortable: false,
    render: (val: unknown) => (
      <a
        href={String(val)}
        target="_blank"
        rel="noopener noreferrer"
        className="text-[#00FFFF]/50 hover:text-[#00FFFF] transition-colors font-mono text-[10px]"
      >
        [visit]
      </a>
    ),
  },
]

const companyColumns = [
  {
    key: 'name' as const,
    header: 'Company',
    render: (val: unknown) => (
      <span className="text-white/90 font-medium">{String(val)}</span>
    ),
  },
  {
    key: 'founderCeo' as const,
    header: 'Founder / CEO',
    render: (val: unknown) => (
      <span className="text-[#BF40BF]/80">{String(val)}</span>
    ),
  },
  { key: 'focus' as const, header: 'Product' },
  {
    key: 'stage' as const,
    header: 'Stage',
    render: (val: unknown) => (
      <span className={`font-mono text-[9px] border rounded px-1.5 py-px ${stageColor[String(val)] || 'text-white/30 border-white/10'}`}>
        {String(val)}
      </span>
    ),
  },
  { key: 'founded' as const, header: 'Founded', width: 'w-20' },
  { key: 'raised' as const, header: 'Raised', width: 'w-24' },
  {
    key: 'website' as const,
    header: 'Link',
    sortable: false,
    render: (val: unknown) => (
      <a
        href={String(val)}
        target="_blank"
        rel="noopener noreferrer"
        className="text-[#00FFFF]/50 hover:text-[#00FFFF] transition-colors font-mono text-[10px]"
      >
        [visit]
      </a>
    ),
  },
]

export default function Organizations() {
  return (
    <PageWrapper
      title="Ecosystem"
      subtitle="Research groups and companies advancing transcranial focused ultrasound."
      accentColor="#BF40BF"
    >
      <div className="space-y-16">
        <DataTable
          data={organizations}
          columns={labColumns}
          searchKeys={['name', 'institution', 'pi', 'focusArea', 'country']}
          title="Research Groups"
        />
        <DataTable
          data={companies}
          columns={companyColumns}
          searchKeys={['name', 'founderCeo', 'focus', 'stage']}
          title="Companies"
        />
      </div>
    </PageWrapper>
  )
}
