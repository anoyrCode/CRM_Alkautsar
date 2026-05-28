import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import * as XLSX from 'xlsx'
import logoUrl from '../assets/logoalka.png'

function buildRows(complaints) {
  return complaints.map((c, i) => [
    i + 1,
    c.ticket_id ?? '-',
    c.title ?? '-',
    c.categories?.name ?? '-',
    c.priority ?? '-',
    c.status ?? '-',
    c.created_at ? new Date(c.created_at).toLocaleDateString('id-ID') : '-',
  ])
}

function countStats(complaints) {
  return {
    total:    complaints.length,
    selesai:  complaints.filter(c => c.status === 'Selesai').length,
    diproses: complaints.filter(c => c.status === 'Diproses').length,
    pending:  complaints.filter(c => c.status === 'Pending').length,
  }
}

async function loadLogo() {
  const response = await fetch(logoUrl)
  const blob = await response.blob()
  const base64 = await new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
  const dims = await new Promise((resolve) => {
    const img = new Image()
    img.onload = () => resolve({ w: img.naturalWidth, h: img.naturalHeight })
    img.src = base64
  })
  return { base64, dims }
}

export async function exportPDF(complaints, meta) {
  const { dateFrom, dateTo, userName, roleName, printDate } = meta
  const stats = countStats(complaints)
  const doc = new jsPDF()

  // Header: logo pojok kiri, judul + info pojok kanan
  try {
    const { base64: logoBase64, dims } = await loadLogo()
    const logoW = 42
    const logoH = (dims.h / dims.w) * logoW
    doc.addImage(logoBase64, 'PNG', 14, 10, logoW, logoH)
  } catch {
    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.text('Pesantren Al-Kautsar', 14, 18)
  }

  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.text('Laporan Komplain', 196, 13, { align: 'right' })
  doc.setFontSize(8.5)
  doc.setFont('helvetica', 'normal')
  doc.text(`Periode  : ${dateFrom} s/d ${dateTo}`, 196, 20, { align: 'right' })
  doc.text(`Dicetak  : ${userName} - ${roleName}`, 196, 26, { align: 'right' })
  doc.text(`Tgl cetak: ${printDate}`, 196, 32, { align: 'right' })

  // Garis pemisah header
  doc.setDrawColor(0, 146, 183)
  doc.setLineWidth(0.5)
  doc.line(14, 37, 196, 37)

  // Ringkasan
  autoTable(doc, {
    startY: 43,
    head: [['Total', 'Selesai', 'Diproses', 'Pending']],
    body: [[stats.total, stats.selesai, stats.diproses, stats.pending]],
    styles:     { fontSize: 9 },
    headStyles: { fillColor: [0, 146, 183] },
    margin:     { left: 14, right: 14 },
  })

  // Daftar komplain
  const rows = buildRows(complaints)
  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 8,
    head: [['No', 'Ticket ID', 'Judul', 'Kategori', 'Prioritas', 'Status', 'Tanggal']],
    body: rows.length > 0 ? rows : [['', '', 'Tidak ada data pada periode ini', '', '', '', '']],
    styles:        { fontSize: 8 },
    headStyles:    { fillColor: [0, 146, 183] },
    columnStyles:  { 2: { cellWidth: 50 } },
    margin:        { left: 14, right: 14 },
  })

  doc.save(`laporan-komplain-${dateFrom}-${dateTo}.pdf`)
}

export function exportExcel(complaints, meta) {
  const { dateFrom, dateTo, userName, roleName, printDate } = meta
  const stats = countStats(complaints)
  const wb = XLSX.utils.book_new()

  // Sheet Ringkasan
  const summaryData = [
    ['Laporan Komplain — Pesantren Al-Kautsar'],
    [`Periode: ${dateFrom} s/d ${dateTo}`],
    [`Dicetak oleh: ${userName} — ${roleName}`],
    [`Tanggal cetak: ${printDate}`],
    [],
    ['Total', 'Selesai', 'Diproses', 'Pending'],
    [stats.total, stats.selesai, stats.diproses, stats.pending],
  ]
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(summaryData), 'Ringkasan')

  // Sheet Data Komplain
  const header = ['No', 'Ticket ID', 'Judul', 'Kategori', 'Prioritas', 'Status', 'Tanggal']
  const rows   = buildRows(complaints)
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([header, ...rows]), 'Data Komplain')

  XLSX.writeFile(wb, `laporan-komplain-${dateFrom}-${dateTo}.xlsx`)
}
