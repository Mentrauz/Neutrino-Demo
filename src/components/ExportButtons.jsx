import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import Papa from 'papaparse';

/**
 * ExportButtons — CSV and PDF export with clean icon buttons.
 */
export default function ExportButtons({ results }) {
  if (!results) return null;

  const { factors, motherTotal, fatherTotal, grandTotal, dominantParent, dob } = results;
  const dobFormatted = new Date(dob).toLocaleDateString('en-GB');

  const handleExportCSV = () => {
    const rows = factors.map((f) => ({
      'Life Factor': f.name,
      'Mother': f.mother.toFixed(3),
      'Father': f.father.toFixed(3),
      'Total': f.total.toFixed(3),
    }));

    rows.push({
      'Life Factor': 'TOTAL',
      'Mother': motherTotal.toFixed(3),
      'Father': fatherTotal.toFixed(3),
      'Total': grandTotal.toFixed(3),
    });

    const csv = Papa.unparse(rows);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `parental-legacy-${dobFormatted.replace(/\//g, '-')}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(18);
    doc.setTextColor(93, 72, 57);
    doc.text('Parental Legacy & Life Factors Report', 14, 22);

    // Subtitle
    doc.setFontSize(11);
    doc.setTextColor(122, 101, 85);
    doc.text(`Date of Birth: ${dobFormatted}`, 14, 32);
    doc.text(`Dominant Parent: ${dominantParent}`, 14, 39);
    doc.text(`Generated: ${new Date().toLocaleDateString('en-GB')}`, 14, 46);

    const tableData = factors.map((f) => [
      f.name,
      f.mother.toFixed(3),
      f.father.toFixed(3),
      f.total.toFixed(3),
    ]);

    tableData.push([
      'TOTAL',
      motherTotal.toFixed(3),
      fatherTotal.toFixed(3),
      grandTotal.toFixed(3),
    ]);

    autoTable(doc, {
      startY: 54,
      head: [['Life Factor', 'Mother', 'Father', 'Total']],
      body: tableData,
      theme: 'grid',
      headStyles: {
        fillColor: [187, 133, 74],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 10,
      },
      bodyStyles: {
        fontSize: 9,
        textColor: [93, 72, 57],
      },
      alternateRowStyles: {
        fillColor: [251, 246, 239],
      },
      columnStyles: {
        0: { cellWidth: 55 },
        1: { halign: 'center' },
        2: { halign: 'center' },
        3: { halign: 'center' },
      },
      didParseCell: (data) => {
        if (data.row.index === tableData.length - 1) {
          data.cell.styles.fillColor = [93, 72, 57];
          data.cell.styles.textColor = [255, 255, 255];
          data.cell.styles.fontStyle = 'bold';
        }
      },
    });

    doc.save(`parental-legacy-${dobFormatted.replace(/\//g, '-')}.pdf`);
  };

  return (
    <div className="export-buttons">
      <button className="export-btn" onClick={handleExportCSV}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
          <line x1="16" y1="13" x2="8" y2="13"/>
          <line x1="16" y1="17" x2="8" y2="17"/>
        </svg>
        Export CSV
      </button>
      <button className="export-btn" onClick={handleExportPDF}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
          <polyline points="7 10 12 15 17 10"/>
          <line x1="12" y1="15" x2="12" y2="3"/>
        </svg>
        Export PDF
      </button>
    </div>
  );
}
