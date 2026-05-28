import jsPDF from 'jspdf'
import 'jspdf-autotable' // patches jsPDF.prototype with autoTable
import * as XLSX from 'xlsx'

function buildRows(complaints) {
  return complaints.map((c, i) => [
    i + 1,
    c.ticket_id ?? '—',
    c.title ?? '—',
    c.categories?.name ?? '—',
    c.priority ?? '—',
    c.status ?? '—',
    c.created_at ? new Date(c.created_at).toLocaleDateString('id-ID') : '—',
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

export function exportPDF(complaints, meta) {
  const { dateFrom, dateTo, userName, roleName, printDate } = meta
  const stats = countStats(complaints)
  const doc = new jsPDF()

  // Header
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text('Pesantren Al-Kautsar', 14, 18)
  doc.setFontSize(11)
  doc.text('Laporan Komplain', 14, 26)
  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.text(`Periode  : ${dateFrom} s/d ${dateTo}`, 14, 33)
  doc.text(`Dicetak  : ${userName} — ${roleName}`, 14, 39)
  doc.text(`Tgl cetak: ${printDate}`, 14, 45)

  // Ringkasan
  doc.autoTable({
    startY: 52,
    head: [['Total', 'Selesai', 'Diproses', 'Pending']],
    body: [[stats.total, stats.selesai, stats.diproses, stats.pending]],
    styles:     { fontSize: 9 },
    headStyles: { fillColor: [0, 146, 183] },
    margin:     { left: 14, right: 14 },
  })

  // Daftar komplain
  const rows = buildRows(complaints)
  doc.autoTable({
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
