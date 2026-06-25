/**
 * MediSense AMD — PDF Report Generator
 * Generates clinical report in browser using jsPDF
 * No backend needed — works on Vercel!
 */

export const generatePDFReport = (result) => {
  // Dynamically load jsPDF
  const script = document.createElement('script');
  script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
  script.onload = () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let y = 20;

    // ── Header Background ──────────────────────────────────────────────────
    doc.setFillColor(15, 23, 42); // dark navy
    doc.rect(0, 0, pageWidth, 45, 'F');

    // ── Title ──────────────────────────────────────────────────────────────
    doc.setTextColor(165, 180, 252); // purple
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('MediSense AMD', 15, 18);

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text('Clinical AI Report — Powered by AMD MI300X', 15, 28);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 15, 36);

    // AMD badge
    doc.setFillColor(99, 102, 241);
    doc.roundedRect(pageWidth - 55, 10, 45, 12, 3, 3, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.text('AMD MI300X', pageWidth - 51, 18);

    y = 58;

    // ── Patient Info ───────────────────────────────────────────────────────
    doc.setFillColor(241, 245, 249);
    doc.rect(10, y - 6, pageWidth - 20, 22, 'F');
    doc.setTextColor(30, 41, 59);
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.text(`Patient: ${result.patient_name}`, 15, y + 4);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text(`Language: ${result.language === 'hi' ? 'Hindi' : 'English'}  |  Powered by: ${result.powered_by}`, 15, y + 12);
    y += 30;

    // ── Urgency Banner ─────────────────────────────────────────────────────
    const urgencyColors = {
      LOW:      [34, 197, 94],
      MEDIUM:   [234, 179, 8],
      HIGH:     [249, 115, 22],
      CRITICAL: [239, 68, 68]
    };
    const uc = urgencyColors[result.urgency] || [99, 102, 241];
    doc.setFillColor(...uc);
    doc.rect(10, y, pageWidth - 20, 14, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.text(`URGENCY LEVEL: ${result.urgency}`, pageWidth / 2, y + 9, { align: 'center' });
    y += 22;

    // ── Risk Flags ─────────────────────────────────────────────────────────
    if (result.risk_flags && result.risk_flags.length > 0) {
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(239, 68, 68);
      doc.text('⚠ Risk Flags Detected:', 15, y);
      y += 7;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(60, 60, 60);
      result.risk_flags.forEach(flag => {
        doc.text(`  • ${flag}`, 15, y);
        y += 6;
      });
      y += 4;
    }

    // ── Disease Risk Scores ────────────────────────────────────────────────
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 41, 59);
    doc.text('Disease Risk Analysis', 15, y);
    y += 8;

    const predictions = result.predictions || {};
    const risks = [
      { label: 'Diabetes Risk',       value: predictions.diabetes_risk,       color: [99, 102, 241] },
      { label: 'Heart Disease Risk',  value: predictions.heart_disease_risk,  color: [239, 68, 68] },
      { label: 'Kidney Disease Risk', value: predictions.kidney_disease_risk, color: [234, 179, 8] },
      { label: 'Pneumonia Risk',      value: predictions.pneumonia_risk,      color: [34, 197, 94] },
    ];

    risks.forEach(risk => {
      if (risk.value === undefined || risk.value === null) return;

      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(30, 41, 59);
      doc.text(risk.label, 15, y);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 116, 139);
      doc.text(`${risk.value}%`, pageWidth - 25, y, { align: 'right' });

      // Progress bar background
      doc.setFillColor(226, 232, 240);
      doc.rect(15, y + 2, pageWidth - 30, 4, 'F');

      // Progress bar fill
      const barW = Math.min((risk.value / 100) * (pageWidth - 30), pageWidth - 30);
      doc.setFillColor(...risk.color);
      doc.rect(15, y + 2, barW, 4, 'F');

      y += 14;
    });

    y += 4;

    // ── Clinical Summary ───────────────────────────────────────────────────
    doc.setFillColor(248, 250, 252);
    doc.rect(10, y - 4, pageWidth - 20, 8, 'F');
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(99, 102, 241);
    doc.text('AI Clinical Summary', 15, y + 1);
    y += 12;

    doc.setFontSize(9.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(51, 65, 85);

    // Clean summary text
    const summary = (result.clinical_summary || '')
      .replace(/\*\*/g, '')
      .replace(/\*/g, '')
      .replace(/#{1,6}\s/g, '')
      .trim();

    const lines = doc.splitTextToSize(summary, pageWidth - 30);
    lines.forEach(line => {
      if (y > pageHeight - 40) {
        doc.addPage();
        y = 20;
      }
      doc.text(line, 15, y);
      y += 5.5;
    });

    y += 8;

    // ── Performance Metrics ────────────────────────────────────────────────
    if (result.timings_ms && y < pageHeight - 50) {
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(30, 41, 59);
      doc.text('AMD Performance Metrics', 15, y);
      y += 7;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(100, 116, 139);
      Object.entries(result.timings_ms).forEach(([key, val]) => {
        doc.text(`${key.replace(/_/g, ' ')}: ${val}ms`, 15, y);
        y += 5;
      });
    }

    // ── Footer ─────────────────────────────────────────────────────────────
    doc.setFillColor(15, 23, 42);
    doc.rect(0, pageHeight - 20, pageWidth, 20, 'F');
    doc.setTextColor(165, 180, 252);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text('MediSense AMD — AI Healthcare Platform | medisense-india.vercel.app', pageWidth / 2, pageHeight - 12, { align: 'center' });
    doc.text('⚕ This is an AI-generated report. Always consult a qualified doctor for medical decisions.', pageWidth / 2, pageHeight - 6, { align: 'center' });

    // ── Save PDF ───────────────────────────────────────────────────────────
    const filename = `MediSense_AMD_Report_${result.patient_name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(filename);
  };

  document.head.appendChild(script);
};
