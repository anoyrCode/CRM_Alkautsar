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

async function loadLogoBase64() {
  const response = await fetch(logoUrl)
  const blob = await response.blob()
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}

export async function exportPDF(complaints, meta) {
  const { dateFrom, dateTo, userName, roleName, printDate } = meta
  const stats = countStats(complaints)
  const doc = new jsPDF()

  // Header: logo kiri + teks kanan
  try {
    const logoBase64 = await loadLogoBase64()
    doc.addImage(logoBase64, 'PNG', 14, 10, 35, 15)
  } catch {
    // fallback teks jika logo gagal dimuat
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text('Pesantren Al-Kautsar', 14, 18)
  }

  doc.setFontSize(11)
  doc.setFont('helvetica', 'bold')
  doc.text('Laporan Komplain', 55, 16)
  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.text(`Periode  : ${dateFrom} s/d ${dateTo}`, 55, 22)
  doc.text(`Dicetak  : ${userName} - ${roleName}`, 55, 27)
  doc.text(`Tgl cetak: ${printDate}`, 55, 32)

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
