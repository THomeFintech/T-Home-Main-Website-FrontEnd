// Utility to generate EMI PDF in the attached design
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function downloadEmiPDF({
  schedule,
  loanDetails,
  emiDetails,
  logoUrl = "/home/logo.png",
}) {
  const doc = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });

  // Header
  doc.addImage(logoUrl, "PNG", 36, 24, 54, 54);
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("T-Home Fintech", 110, 48);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("DPIIT Recognized & Certified by Startup India", 110, 62);

  // Title
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("T-Home EMI Amortization Schedule", 50, 110);

  // Loan/EMI Details
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.setFillColor(245, 248, 255);
  doc.roundedRect(50, 120, 500, 70, 8, 8, 'F');
  doc.setFont("helvetica", "bold");
  doc.text("Loan Details", 70, 140);
  doc.text("EMI Details", 320, 140);
  doc.setFont("helvetica", "normal");
  doc.text(`Loan Amount:  ₹${loanDetails.amount}`, 70, 158);
  doc.text(`Annual Interest Rate:  ${loanDetails.rate}%`, 70, 172);
  doc.text(`Tenure:  ${loanDetails.tenure} years`, 70, 186);
  doc.text(`Payment Frequency:  Monthly`, 70, 200);
  doc.text(`Monthly EMI:  ₹${emiDetails.emi}`, 320, 158);
  doc.text(`Total Interest:  ₹${emiDetails.totalInterest}`, 320, 172);
  doc.text(`Total Payment:  ₹${emiDetails.totalPayment}`, 320, 186);

  // Amortization Table
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.text("Monthly Amortization Schedule", 50, 230);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  autoTable(doc, {
    startY: 240,
    head: [["Month", "Date", "Principal", "Interest", "Balance"]],
    body: schedule.map((row) => [
      row.month,
      row.date || "-",
      `₹${row.principal}`,
      `₹${row.interest}`,
      `₹${row.balance}`,
    ]),
    theme: "grid",
    styles: {
      font: "helvetica",
      fontSize: 9,
      cellPadding: 4,
      valign: "middle",
      halign: "center",
    },
    headStyles: {
      fillColor: [37, 99, 235],
      textColor: 255,
      fontStyle: "bold",
    },
    alternateRowStyles: { fillColor: [245, 248, 255] },
    margin: { left: 50, right: 50 },
    tableWidth: 500,
  });

  // Footer
  const pageHeight = doc.internal.pageSize.height;
  doc.setFontSize(9);
  doc.setTextColor(100);
  doc.text(
    "Thank you for choosing T-Home Fintech! We appreciate your trust in our services.",
    50,
    pageHeight - 60
  );
  doc.setDrawColor(37, 99, 235);
  doc.setLineWidth(1.2);
  doc.line(50, pageHeight - 50, 550, pageHeight - 50);
  doc.setFontSize(8);
  doc.setTextColor(120);
  doc.text("Page 1 of 1", 520, pageHeight - 30);

  // Save
  doc.save("emi_amortization_schedule.pdf");
}
