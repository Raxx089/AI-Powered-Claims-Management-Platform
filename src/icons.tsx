import type { HTMLAttributes } from 'react'
import { createElement } from 'react'

export type MaterialIconProps = Omit<HTMLAttributes<HTMLSpanElement>, 'color'> & {
  size?: number | string
}

type IconComponent = (props: MaterialIconProps) => React.ReactElement

function makeIcon(name: string): IconComponent {
  return function MaterialSymbol({ size = 20, className, style, ...props }) {
    return createElement(
      'span',
      {
        ...props,
        'aria-hidden': props['aria-hidden'] ?? true,
        className: ['msym', className].filter(Boolean).join(' '),
        style: { fontSize: typeof size === 'number' ? `${size}px` : size, ...style },
      },
      name,
    )
  }
}

export const AlertOctagon = makeIcon('gpp_maybe')
export const AlertTriangle = makeIcon('warning')
export const ArrowDown = makeIcon('arrow_downward')
export const ArrowDownRight = makeIcon('south_east')
export const ArrowLeft = makeIcon('arrow_back')
export const ArrowRight = makeIcon('arrow_forward')
export const ArrowUp = makeIcon('arrow_upward')
export const ArrowUpRight = makeIcon('north_east')
export const BarChart3 = makeIcon('bar_chart')
export const Bell = makeIcon('notifications')
export const Bot = makeIcon('smart_toy')
export const Check = makeIcon('check')
export const CheckCheck = makeIcon('done_all')
export const CheckCircle2 = makeIcon('check_circle')
export const ChevronDown = makeIcon('expand_more')
export const ChevronLeft = makeIcon('chevron_left')
export const ChevronRight = makeIcon('chevron_right')
export const ChevronsLeft = makeIcon('keyboard_double_arrow_left')
export const ChevronsRight = makeIcon('keyboard_double_arrow_right')
export const Circle = makeIcon('radio_button_unchecked')
export const ClipboardCheck = makeIcon('fact_check')
export const Clock = makeIcon('schedule')
export const CloudOff = makeIcon('cloud_off')
export const Columns3 = makeIcon('view_column')
export const Download = makeIcon('download')
export const DarkMode = makeIcon('dark_mode')
export const ExternalLink = makeIcon('open_in_new')
export const FilePlus2 = makeIcon('note_add')
export const FileSearch = makeIcon('find_in_page')
export const FileText = makeIcon('description')
export const FilterX = makeIcon('filter_alt_off')
export const Flag = makeIcon('flag')
export const GitBranch = makeIcon('account_tree')
export const Image = makeIcon('image')
export const Info = makeIcon('info')
export const Layers = makeIcon('layers')
export const LayoutDashboard = makeIcon('dashboard')
export const LayoutList = makeIcon('view_list')
export const ListChecks = makeIcon('checklist')
export const Lock = makeIcon('lock')
export const LightMode = makeIcon('light_mode')
export const Mail = makeIcon('mail')
export const Menu = makeIcon('menu')
export const Network = makeIcon('hub')
export const Pencil = makeIcon('edit')
export const Plus = makeIcon('add')
export const RefreshCw = makeIcon('refresh')
export const RotateCcw = makeIcon('replay')
export const Scale = makeIcon('balance')
export const ScanText = makeIcon('document_scanner')
export const Search = makeIcon('search')
export const Settings = makeIcon('settings')
export const ShieldAlert = makeIcon('gpp_maybe')
export const ShieldCheck = makeIcon('verified_user')
export const ShieldOff = makeIcon('gpp_bad')
export const Sparkles = makeIcon('auto_awesome')
export const Table2 = makeIcon('table_view')
export const ThumbsDown = makeIcon('thumb_down')
export const ThumbsUp = makeIcon('thumb_up')
export const Upload = makeIcon('upload')
export const User = makeIcon('person')
export const UserPlus = makeIcon('person_add')
export const Users = makeIcon('groups')
export const X = makeIcon('close')
export const XCircle = makeIcon('cancel')
export const Zap = makeIcon('bolt')
