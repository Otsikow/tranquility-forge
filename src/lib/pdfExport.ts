/**
 * PDF Export functionality for assessment results
 * Uses jsPDF library to generate downloadable PDFs
 */

import type { AssessmentResultWithInsights } from "./assessmentService";

// This will use a lightweight approach with HTML and browser print
// For production, consider using jsPDF or pdfmake libraries

export interface PDFExportOptions {
  includeCharts?: boolean;
  includeRecommendations?: boolean;
  includeHistory?: boolean;
}

const assessmentNames = {
  phq9: "PHQ-9 Depression Screening",
  gad7: "GAD-7 Anxiety Screening",
  pss10: "PSS-10 Perceived Stress Scale",
  sleep_hygiene: "Sleep Hygiene Assessment",
};

const severityDescriptions = {
  minimal: "Minimal symptoms",
  mild: "Mild symptoms",
  moderate: "Moderate symptoms",
  moderately_severe: "Moderately severe symptoms",
  severe: "Severe symptoms",
};

export function generateAssessmentPDF(
  results: AssessmentResultWithInsights[],
  options: PDFExportOptions = {}
): void {
  if (results.length === 0) {
    alert("No assessment results to export");
    return;
  }

  const {
    includeCharts = true,
    includeRecommendations = true,
    includeHistory = true,
  } = options;

  const latestResult = results[0];
  const assessmentType = latestResult.assessment_type;
  const assessmentName = assessmentNames[assessmentType];

  // Create HTML content for PDF
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>${assessmentName} - Assessment Report</title>
      <style>
        @media print {
          body { margin: 0; padding: 20px; }
          .page-break { page-break-after: always; }
        }
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          text-align: center;
          border-bottom: 3px solid #3b82f6;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        .header h1 {
          color: #1e40af;
          margin: 0 0 10px 0;
        }
        .header .date {
          color: #666;
          font-size: 14px;
        }
        .section {
          margin-bottom: 30px;
        }
        .section-title {
          background: #f3f4f6;
          padding: 10px 15px;
          border-left: 4px solid #3b82f6;
          font-weight: bold;
          font-size: 18px;
          margin-bottom: 15px;
        }
        .score-card {
          background: #f9fafb;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 20px;
        }
        .score-main {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
        }
        .score-value {
          font-size: 48px;
          font-weight: bold;
          color: #3b82f6;
        }
        .severity-badge {
          display: inline-block;
          padding: 8px 16px;
          border-radius: 20px;
          font-weight: bold;
          text-transform: uppercase;
          font-size: 14px;
        }
        .severity-minimal { background: #dcfce7; color: #166534; }
        .severity-mild { background: #fef3c7; color: #854d0e; }
        .severity-moderate { background: #fed7aa; color: #9a3412; }
        .severity-moderately_severe { background: #fecaca; color: #991b1b; }
        .severity-severe { background: #fca5a5; color: #7f1d1d; }
        .interpretation {
          background: white;
          padding: 15px;
          border-left: 3px solid #3b82f6;
          margin-bottom: 15px;
        }
        .recommendations {
          list-style: none;
          padding: 0;
        }
        .recommendations li {
          background: white;
          padding: 12px;
          margin-bottom: 8px;
          border-left: 3px solid #10b981;
          padding-left: 15px;
        }
        .recommendations li:before {
          content: "✓ ";
          color: #10b981;
          font-weight: bold;
          margin-right: 5px;
        }
        .history-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 15px;
        }
        .history-table th {
          background: #f3f4f6;
          padding: 12px;
          text-align: left;
          font-weight: bold;
          border-bottom: 2px solid #d1d5db;
        }
        .history-table td {
          padding: 10px 12px;
          border-bottom: 1px solid #e5e7eb;
        }
        .trend-improving { color: #059669; }
        .trend-declining { color: #dc2626; }
        .trend-stable { color: #6b7280; }
        .disclaimer {
          background: #fef2f2;
          border: 2px solid #fca5a5;
          border-radius: 8px;
          padding: 15px;
          margin-top: 30px;
          font-size: 12px;
        }
        .disclaimer-title {
          font-weight: bold;
          color: #991b1b;
          margin-bottom: 8px;
        }
        .footer {
          text-align: center;
          color: #666;
          font-size: 12px;
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #e5e7eb;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>${assessmentName}</h1>
        <div class="date">Assessment Report - Generated on ${new Date().toLocaleDateString()}</div>
      </div>

      <!-- Current Score Section -->
      <div class="section">
        <div class="section-title">Current Assessment Results</div>
        <div class="score-card">
          <div class="score-main">
            <div>
              <div style="color: #666; font-size: 14px; margin-bottom: 5px;">Score</div>
              <div class="score-value">${latestResult.score}</div>
            </div>
            <div style="text-align: right;">
              <div style="color: #666; font-size: 14px; margin-bottom: 5px;">Severity Level</div>
              <span class="severity-badge severity-${latestResult.severity}">
                ${severityDescriptions[latestResult.severity]}
              </span>
            </div>
          </div>
          <div style="color: #666; font-size: 14px;">
            Completed on ${new Date(latestResult.completed_at).toLocaleDateString()} at 
            ${new Date(latestResult.completed_at).toLocaleTimeString()}
          </div>
        </div>
        
        ${
          latestResult.interpretation
            ? `
        <div class="interpretation">
          <strong>Interpretation:</strong><br>
          ${latestResult.interpretation}
        </div>
        `
            : ""
        }
      </div>

      ${
        includeRecommendations &&
        latestResult.recommendations &&
        latestResult.recommendations.length > 0
          ? `
      <!-- Recommendations Section -->
      <div class="section">
        <div class="section-title">Personalized Recommendations</div>
        <ul class="recommendations">
          ${latestResult.recommendations.map((rec) => `<li>${rec}</li>`).join("")}
        </ul>
      </div>
      `
          : ""
      }

      ${
        includeHistory && results.length > 1
          ? `
      <div class="page-break"></div>
      
      <!-- History Section -->
      <div class="section">
        <div class="section-title">Assessment History (Last ${results.length} assessments)</div>
        <table class="history-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Score</th>
              <th>Severity</th>
              <th>Trend</th>
            </tr>
          </thead>
          <tbody>
            ${results
              .map(
                (result) => `
              <tr>
                <td>${new Date(result.completed_at).toLocaleDateString()}</td>
                <td><strong>${result.score}</strong></td>
                <td>${severityDescriptions[result.severity]}</td>
                <td class="trend-${result.score_trend || "stable"}">
                  ${
                    result.score_trend === "improving"
                      ? "↓ Improving"
                      : result.score_trend === "declining"
                      ? "↑ Declining"
                      : "→ Stable"
                  }
                </td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>
      </div>
      `
          : ""
      }

      <!-- Disclaimer -->
      <div class="disclaimer">
        <div class="disclaimer-title">⚠️ Important Disclaimer</div>
        <p>
          This assessment is a screening tool and not a diagnostic instrument. The results should not be used
          as a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of
          your physician or other qualified health provider with any questions you may have regarding a
          medical condition.
        </p>
        <p style="margin-top: 10px;">
          If you are experiencing a mental health crisis or having thoughts of self-harm, please call 988
          (Suicide & Crisis Lifeline) or 911 immediately.
        </p>
      </div>

      <div class="footer">
        <p>This report was generated by Peace - Mental Health & Wellness App</p>
        <p>For more information, visit your healthcare provider</p>
      </div>
    </body>
    </html>
  `;

  // Create a new window and print
  const printWindow = window.open("", "_blank");
  if (printWindow) {
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.focus();

    // Wait for content to load, then print
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print();
        // Don't auto-close to allow user to review or save as PDF
      }, 250);
    };
  } else {
    alert("Please allow pop-ups to generate the PDF report");
  }
}

export function generateComparisonPDF(
  allResults: Record<string, AssessmentResultWithInsights[]>
): void {
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Assessment Comparison Report</title>
      <style>
        @media print {
          body { margin: 0; padding: 20px; }
          .page-break { page-break-after: always; }
        }
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          text-align: center;
          border-bottom: 3px solid #3b82f6;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        .header h1 {
          color: #1e40af;
          margin: 0 0 10px 0;
        }
        .comparison-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
          margin-bottom: 30px;
        }
        .assessment-card {
          background: #f9fafb;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          padding: 20px;
        }
        .assessment-title {
          font-weight: bold;
          font-size: 16px;
          margin-bottom: 10px;
          color: #1e40af;
        }
        .score-display {
          font-size: 36px;
          font-weight: bold;
          color: #3b82f6;
          margin-bottom: 10px;
        }
        .severity-badge {
          display: inline-block;
          padding: 6px 12px;
          border-radius: 15px;
          font-weight: bold;
          text-transform: uppercase;
          font-size: 12px;
        }
        .severity-minimal { background: #dcfce7; color: #166534; }
        .severity-mild { background: #fef3c7; color: #854d0e; }
        .severity-moderate { background: #fed7aa; color: #9a3412; }
        .severity-moderately_severe { background: #fecaca; color: #991b1b; }
        .severity-severe { background: #fca5a5; color: #7f1d1d; }
        .footer {
          text-align: center;
          color: #666;
          font-size: 12px;
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #e5e7eb;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Mental Health Assessment Comparison</h1>
        <div class="date">Report Generated on ${new Date().toLocaleDateString()}</div>
      </div>

      <div class="comparison-grid">
        ${Object.entries(allResults)
          .map(([type, results]) => {
            const latest = results[0];
            if (!latest) return "";

            return `
              <div class="assessment-card">
                <div class="assessment-title">${assessmentNames[type as keyof typeof assessmentNames]}</div>
                <div class="score-display">${latest.score}</div>
                <span class="severity-badge severity-${latest.severity}">
                  ${severityDescriptions[latest.severity]}
                </span>
                <div style="margin-top: 10px; font-size: 12px; color: #666;">
                  Last completed: ${new Date(latest.completed_at).toLocaleDateString()}
                </div>
              </div>
            `;
          })
          .join("")}
      </div>

      <div class="footer">
        <p>This report was generated by Peace - Mental Health & Wellness App</p>
      </div>
    </body>
    </html>
  `;

  const printWindow = window.open("", "_blank");
  if (printWindow) {
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.focus();
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print();
      }, 250);
    };
  } else {
    alert("Please allow pop-ups to generate the PDF report");
  }
}
