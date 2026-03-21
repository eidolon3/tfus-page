import PageWrapper from '../components/ui/PageWrapper'
import DataTable from '../components/ui/DataTable'
import { technology } from '../data/technology'

const statusColors: Record<string, string> = {
  'FDA cleared': 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
  'Investigational': 'text-amber-400 bg-amber-400/10 border-amber-400/20',
  'Research only': 'text-white/40 bg-white/5 border-white/10',
}

const columns = [
  {
    key: 'name' as const,
    header: 'Device',
    render: (val: unknown) => (
      <span className="text-white/90 font-medium">{String(val)}</span>
    ),
  },
  { key: 'manufacturer' as const, header: 'Manufacturer' },
  {
    key: 'type' as const,
    header: 'Type',
    render: (val: unknown) => (
      <span className="font-mono text-[10px] text-[#BF40BF]/70">{String(val)}</span>
    ),
  },
  {
    key: 'frequency_kHz' as const,
    header: 'Freq (kHz)',
    width: 'w-20',
    render: (val: unknown) => (
      <span className="font-mono">{Number(val) > 0 ? String(val) : 'Variable'}</span>
    ),
  },
  {
    key: 'elements' as const,
    header: 'Elements',
    width: 'w-20',
    render: (val: unknown) => (
      <span className="font-mono text-[#00FFFF]/60">{String(val)}</span>
    ),
  },
  {
    key: 'focalLength_mm' as const,
    header: 'Focal (mm)',
    width: 'w-20',
    render: (val: unknown) => (
      <span className="font-mono">{Number(val) > 0 ? String(val) : 'N/A'}</span>
    ),
  },
  {
    key: 'fdaStatus' as const,
    header: 'Status',
    render: (val: unknown) => {
      const status = String(val)
      const colorClass = statusColors[status] || statusColors['Research only']
      return (
        <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded border ${colorClass}`}>
          {status}
        </span>
      )
    },
  },
  { key: 'applications' as const, header: 'Applications' },
]

export default function Technology() {
  return (
    <PageWrapper
      title="Technology"
      subtitle="Transducer systems and research platforms used in tFUS.
        Positioned at the skull interface — where acoustic energy meets bone."
      accentColor="#7B68EE"
    >
      <DataTable
        data={technology}
        columns={columns}
        searchKeys={['name', 'manufacturer', 'type', 'fdaStatus', 'applications']}
        title="Devices & Platforms"
      />
    </PageWrapper>
  )
}
