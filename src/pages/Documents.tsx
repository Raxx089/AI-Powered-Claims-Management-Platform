import { useState } from 'react'
import { UploadDialog } from '../flows'
import { Upload } from '../icons'
import { Button, PageHeader, useToast, Alert } from '../ui'
import { DocSummaryNlp, DocWorkspace } from './DocWorkspace'

export default function Documents() {
  const toast = useToast()
  const [up, setUp] = useState(false)
  return (
    <div>
      <PageHeader eyebrow="Documents · Intelligent processing" title="Document workspace" sub="Every file is read automatically. Highlights show where each value came from, so you can check it in seconds." actions={<Button variant="primary" icon={<Upload size={16} />} onClick={() => setUp(true)}>Upload documents</Button>} />
      <div className="mb-4 grid gap-4 lg:grid-cols-2">
        <Alert tone="warn" title="1 document needs a better scan" action={<Button size="sm" onClick={() => toast('Request sent to insured')}>Request re-upload</Button>}>medical_note_scan.jpg was read with only 58% confidence.</Alert>
        <DocSummaryNlp />
      </div>
      <DocWorkspace />
      <UploadDialog open={up} onClose={() => setUp(false)} onDone={(n, claimId) => toast(`${n} document${n === 1 ? '' : 's'} attached to ${claimId}. AI is reading ${n === 1 ? 'it' : 'them'}…`, 'info')} />
    </div>
  )
}
