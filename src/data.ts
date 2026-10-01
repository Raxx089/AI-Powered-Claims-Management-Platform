import type { Explain } from './ui'

export type Claim = {
  id: string
  insured: string
  type: string
  status: string
  priority: 'Critical' | 'High' | 'Medium' | 'Low'
  amount: number
  handler: string
  sla: string
  slaPct: number
  risk: number
  ai: number
  reason: string
  filed: string
  stage: number
}

export const STAGES = ['Intake', 'Triage', 'Assessment', 'Decision', 'Approval', 'Payment', 'Closure']

export const claims: Claim[] = [
  { id: 'CLM-48213', insured: 'Marguerite Ellsworth', type: 'Auto collision', status: 'Awaiting approval', priority: 'Critical', amount: 38450, handler: 'Priya Raman', sla: '2h 10m left', slaPct: 92, risk: 78, ai: 91, reason: 'High value, risk score 78, approval SLA nearing breach', filed: 'Sep 24', stage: 4 },
  { id: 'CLM-48190', insured: 'Halvorsen Logistics Ltd', type: 'Commercial property', status: 'Under investigation', priority: 'Critical', amount: 214000, handler: 'Daniel Okafor', sla: 'Breached 5h', slaPct: 100, risk: 86, ai: 88, reason: 'Invoice anomalies and two prior claims in 14 months', filed: 'Sep 19', stage: 3 },
  { id: 'CLM-48244', insured: 'Tomas Reyes', type: 'Home water damage', status: 'In assessment', priority: 'High', amount: 17800, handler: 'Priya Raman', sla: '1d 4h left', slaPct: 58, risk: 34, ai: 94, reason: 'Clear coverage match, photos consistent with report', filed: 'Sep 26', stage: 2 },
  { id: 'CLM-48251', insured: 'Yuki Tanabe', type: 'Travel cancellation', status: 'Awaiting documents', priority: 'Medium', amount: 4200, handler: 'Sam Whitlock', sla: '2d 6h left', slaPct: 35, risk: 21, ai: 82, reason: 'Medical certificate missing, reminder due today', filed: 'Sep 27', stage: 2 },
  { id: 'CLM-48257', insured: 'Adebayo & Sons Bakery', type: 'Business interruption', status: 'Triage', priority: 'High', amount: 52600, handler: 'Unassigned', sla: '5h left', slaPct: 71, risk: 49, ai: 76, reason: 'Needs senior adjuster, complex policy endorsements', filed: 'Sep 29', stage: 1 },
  { id: 'CLM-48262', insured: 'Clara Nguyen', type: 'Auto glass', status: 'Approved', priority: 'Low', amount: 640, handler: 'Sam Whitlock', sla: 'On track', slaPct: 12, risk: 6, ai: 98, reason: 'Eligible for straight-through payment', filed: 'Sep 29', stage: 5 },
  { id: 'CLM-48268', insured: 'Oren Bitton', type: 'Theft, contents', status: 'New', priority: 'Medium', amount: 9300, handler: 'Unassigned', sla: '7h left', slaPct: 44, risk: 62, ai: 71, reason: 'Police report pending, location mismatch flagged', filed: 'Sep 30', stage: 0 },
  { id: 'CLM-48271', insured: 'Bellweather Dental Group', type: 'Liability', status: 'Assigned', priority: 'High', amount: 76000, handler: 'Daniel Okafor', sla: '9h left', slaPct: 63, risk: 41, ai: 84, reason: 'Liability limit review needed before reserve change', filed: 'Sep 28', stage: 2 },
  { id: 'CLM-48275', insured: 'Rosalind Achebe', type: 'Auto collision', status: 'New', priority: 'Low', amount: 2900, handler: 'Unassigned', sla: '1d 2h left', slaPct: 18, risk: 12, ai: 93, reason: 'Minor damage, telematics confirms low-speed impact', filed: 'Sep 30', stage: 0 },
  { id: 'CLM-48279', insured: 'Petra Lindqvist', type: 'Home fire', status: 'In assessment', priority: 'Critical', amount: 168000, handler: 'Priya Raman', sla: '3h left', slaPct: 84, risk: 52, ai: 79, reason: 'Large loss, requires site inspection report', filed: 'Sep 27', stage: 2 },
]

export const explainRisk: Explain = {
  title: 'Why is this claim rated High risk?',
  answer: 'Claim CLM-48213 scores 78 of 100 because the loss pattern and the repair estimate differ from similar claims in this region. This is a prompt to look closer, not a finding of fraud.',
  confidence: 86,
  factors: [
    { label: 'Repair estimate 41% above regional median', weight: 34, dir: 'up' },
    { label: 'Two prior auto claims within 18 months', weight: 27, dir: 'up' },
    { label: 'Claim filed 6 days after policy upgrade', weight: 19, dir: 'up' },
    { label: 'Police report verified and matches statement', weight: 14, dir: 'down' },
  ],
  evidence: [
    { label: 'Repair estimate (Apex Collision)', source: 'Document · estimate_apex.pdf, p.2' },
    { label: 'Claim history, 2 records', source: 'Policy system · POL-771204' },
    { label: 'Police report #PR-2291-A', source: 'Document · police_report.pdf' },
  ],
  limits: 'The model has not seen the vehicle in person and only has 3 photos. It cannot verify the telematics gap between 14:02 and 14:40.',
}

export const explainSummary: Explain = {
  title: 'How this summary was written',
  answer: 'The summary combines the first notice of loss, the police report, three photos and the repair estimate. Sentences without a linked source are marked for your review.',
  confidence: 89,
  factors: [
    { label: 'Police report text matches insured statement', weight: 38, dir: 'up' },
    { label: 'Photo damage consistent with description', weight: 30, dir: 'up' },
    { label: 'Missing: witness contact details', weight: 12, dir: 'down' },
  ],
  evidence: [
    { label: 'First notice of loss', source: 'Intake form · Sep 24, 09:12' },
    { label: 'Police report', source: 'police_report.pdf' },
    { label: 'Photos 1-3', source: 'photos_front_rear.zip' },
  ],
  limits: 'Summaries are generated from uploaded documents only. Phone call notes are not included yet.',
}

export const explainDecision: Explain = {
  title: 'Why the AI recommends partial approval',
  answer: 'The covered portion is $33,150. Aftermarket wheel upgrades ($5,300) are excluded under endorsement E-14 and the estimate appears inflated on labour hours.',
  confidence: 82,
  factors: [
    { label: 'Policy endorsement E-14 excludes aftermarket parts', weight: 40, dir: 'up' },
    { label: 'Labour hours exceed benchmark by 22%', weight: 24, dir: 'up' },
    { label: 'Comprehensive cover active on loss date', weight: 20, dir: 'down' },
  ],
  evidence: [
    { label: 'Policy wording, section 4.2', source: 'Policy system · POL-771204' },
    { label: 'Labour benchmark table', source: 'Reference data · Q3 2026' },
  ],
  limits: 'Legal interpretation of endorsement E-14 has not been reviewed. A human must confirm before denying any part of the claim.',
}

export const tasks = [
  { id: 'T-2031', title: 'Approve payment over $25,000', claim: 'CLM-48213', pri: 'Critical', due: 'Today 14:00', sla: 'breach in 2h', assignee: 'Elena Marsh', type: 'Approval', done: false },
  { id: 'T-2034', title: 'Request medical certificate from insured', claim: 'CLM-48251', pri: 'Medium', due: 'Today 17:00', sla: 'on track', assignee: 'Sam Whitlock', type: 'Follow-up', done: false },
  { id: 'T-2036', title: 'Review invoice anomalies flagged by AI', claim: 'CLM-48190', pri: 'Critical', due: 'Overdue 5h', sla: 'breached', assignee: 'Daniel Okafor', type: 'Investigation', done: false },
  { id: 'T-2039', title: 'Schedule site inspection', claim: 'CLM-48279', pri: 'High', due: 'Tomorrow 10:00', sla: 'at risk', assignee: 'Priya Raman', type: 'Inspection', done: false },
  { id: 'T-2041', title: 'Assign senior adjuster', claim: 'CLM-48257', pri: 'High', due: 'Today 16:30', sla: 'at risk', assignee: 'Unassigned', type: 'Assignment', done: false },
  { id: 'T-2044', title: 'Confirm coverage with underwriting', claim: 'CLM-48271', pri: 'Medium', due: 'Oct 2', sla: 'on track', assignee: 'Priya Raman', type: 'Review', done: false },
  { id: 'T-2046', title: 'Issue payment, glass replacement', claim: 'CLM-48262', pri: 'Low', due: 'Oct 1', sla: 'on track', assignee: 'Sam Whitlock', type: 'Payment', done: true },
]

export const docs = [
  { id: 'D-1', name: 'police_report.pdf', kind: 'Police report', pages: 4, conf: 96, status: 'Processed', fields: 9 },
  { id: 'D-2', name: 'estimate_apex.pdf', kind: 'Repair estimate', pages: 3, conf: 88, status: 'Needs review', fields: 14 },
  { id: 'D-3', name: 'photos_front_rear.zip', kind: 'Photos (3)', pages: 3, conf: 91, status: 'Processed', fields: 3 },
  { id: 'D-4', name: 'policy_schedule.pdf', kind: 'Policy schedule', pages: 2, conf: 98, status: 'Processed', fields: 11 },
  { id: 'D-5', name: 'medical_note_scan.jpg', kind: 'Medical note', pages: 1, conf: 58, status: 'Low quality scan', fields: 4 },
]

export const extracted = [
  { k: 'Incident date', v: 'September 22, 2026', c: 98 },
  { k: 'Location', v: '1420 Larkspur Ave, Denver CO', c: 95 },
  { k: 'Vehicle', v: '2022 Subaru Outback, VIN ...4F2291', c: 93 },
  { k: 'Total estimate', v: '$38,450.00', c: 97 },
  { k: 'Labour hours', v: '64.5 hrs', c: 72 },
  { k: 'Parts supplier', v: 'Apex Collision Supply', c: 64 },
]

export const notifications = [
  { id: 1, cat: 'SLA', title: 'CLM-48190 has breached its SLA by 5 hours', time: '12 min ago', unread: true, tone: 'bad' },
  { id: 2, cat: 'Approval', title: 'Payment of $38,450 for CLM-48213 needs your approval', time: '34 min ago', unread: true, tone: 'warn' },
  { id: 3, cat: 'AI insight', title: 'AI found 3 similar claims linked to Apex Collision Supply', time: '1 h ago', unread: true, tone: 'ai' },
  { id: 4, cat: 'Mention', title: 'Daniel Okafor mentioned you on CLM-48271', time: '2 h ago', unread: false, tone: 'info' },
  { id: 5, cat: 'System', title: 'Document import finished: 14 files processed, 1 needs review', time: '3 h ago', unread: false, tone: 'neutral' },
  { id: 6, cat: 'Approval', title: 'Your override on CLM-48244 was approved by Elena Marsh', time: 'Yesterday', unread: false, tone: 'ok' },
]

export const audit = [
  { t: 'Sep 30, 10:42', who: 'Elena Marsh', role: 'Supervisor', act: 'Opened approval request', detail: 'Payment $38,450 · CLM-48213', kind: 'human' },
  { t: 'Sep 30, 10:40', who: 'CLAIMIQ AI', role: 'Model v4.2', act: 'Recommended partial approval ($33,150)', detail: 'Confidence 82% · 3 factors', kind: 'ai' },
  { t: 'Sep 30, 10:12', who: 'Priya Raman', role: 'Adjuster', act: 'Overrode AI fraud label: "Needs investigation" to "Monitor"', detail: 'Reason: police report verified independently', kind: 'override' },
  { t: 'Sep 30, 09:58', who: 'CLAIMIQ AI', role: 'Model v4.2', act: 'Calculated risk score 78 (High)', detail: 'Confidence 86%', kind: 'ai' },
  { t: 'Sep 29, 16:20', who: 'Priya Raman', role: 'Adjuster', act: 'Edited estimate field "Labour hours" 64.5 to 58', detail: 'Source: manual recalculation', kind: 'human' },
  { t: 'Sep 29, 11:03', who: 'System', role: 'OCR engine', act: 'Extracted 14 fields from estimate_apex.pdf', detail: 'Average confidence 88%', kind: 'system' },
  { t: 'Sep 24, 09:12', who: 'Portal', role: 'Customer', act: 'First notice of loss submitted', detail: 'Channel: web', kind: 'system' },
]

export const team = [
  { name: 'Priya Raman', role: 'Senior Adjuster', open: 14, cap: 16, breach: 1 },
  { name: 'Daniel Okafor', role: 'Adjuster', open: 18, cap: 16, breach: 3 },
  { name: 'Sam Whitlock', role: 'Claims Handler', open: 9, cap: 14, breach: 0 },
  { name: 'Lucía Ferrer', role: 'Claims Handler', open: 12, cap: 14, breach: 1 },
  { name: 'Marcus Bell', role: 'Adjuster', open: 11, cap: 16, breach: 0 },
]

export const trend = [
  { m: 'Apr', intake: 812, closed: 740, fraud: 4.1, cycle: 11.8 },
  { m: 'May', intake: 860, closed: 801, fraud: 4.4, cycle: 11.2 },
  { m: 'Jun', intake: 905, closed: 870, fraud: 4.0, cycle: 10.4 },
  { m: 'Jul', intake: 948, closed: 921, fraud: 3.6, cycle: 9.6 },
  { m: 'Aug', intake: 1012, closed: 980, fraud: 3.3, cycle: 8.7 },
  { m: 'Sep', intake: 1046, closed: 1031, fraud: 3.1, cycle: 7.9 },
]

export const byType = [
  { t: 'Auto', n: 412 },
  { t: 'Property', n: 286 },
  { t: 'Liability', n: 141 },
  { t: 'Travel', n: 118 },
  { t: 'Business', n: 89 },
]

export const riskBands = [
  { band: '0-20', n: 318 },
  { band: '21-40', n: 402 },
  { band: '41-60', n: 197 },
  { band: '61-80', n: 96 },
  { band: '81-100', n: 33 },
]
