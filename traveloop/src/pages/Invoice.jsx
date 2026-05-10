import { invoiceData } from '../data/mockData';
import { useTravelPlanner } from '../context/useTravelPlanner';
import { ArrowLeft, Download, FileText, CheckCircle, DollarSign } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import './Pages.css';

import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export default function Invoice() {
  const { id } = useParams();
  const { getTripById } = useTravelPlanner();
  const trip = getTripById(id);
  const inv = invoiceData;

  const exportPDF = async () => {
    const element = document.getElementById('invoice-card');
    if (!element || !trip) return;
    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`Invoice_${trip.name.replace(/\s+/g, '_')}.pdf`);
  };

  if (!trip) return <div>Trip not found</div>;
  const spentPct = trip.totalBudget > 0 ? (trip.totalSpent / trip.totalBudget) * 100 : 0;

  return (
    <div className="page-content">
      <div className="container">
        <Link to={`/trips/${trip.id}`} className="back-link animate-in"><ArrowLeft size={16} /> Back to My Trips</Link>

        <div className="invoice-layout">
          <div className="invoice-main animate-in animate-in-delay-1">
            <div className="card" id="invoice-card">
              <div className="invoice-top">
                <div className="invoice-trip">
                  <div>
                    <h3>{trip.name}</h3>
                    <p>{trip.startDate} — {trip.endDate} · {trip.cities.length} cities</p>
                    <p>Created by {trip.createdBy}</p>
                  </div>
                </div>
                <div className="invoice-meta">
                  <div><strong>Invoice ID</strong><br/>{inv.invoiceId}</div>
                  <div><strong>Generated</strong><br/>{inv.generatedDate}</div>
                  <div><strong>Travelers</strong><br/>{trip.travelers.join(', ')}</div>
                  <div><strong>Status</strong><br/><span className="status-badge pending">{inv.paymentStatus}</span></div>
                </div>
              </div>

              <table className="invoice-table">
                <thead>
                  <tr><th>#</th><th>Category</th><th>Description</th><th>Qty</th><th>Unit Cost</th><th>Amount</th></tr>
                </thead>
                <tbody>
                  {inv.lineItems.map((item,i) => (
                    <tr key={i}><td>{i+1}</td><td>{item.category}</td><td>{item.description}</td><td>{item.qty}</td><td>${item.unitCost.toLocaleString()}</td><td>${item.amount.toLocaleString()}</td></tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr><td colSpan={4}/><td>Subtotal</td><td>${inv.subtotal.toLocaleString()}</td></tr>
                  <tr><td colSpan={4}/><td>Tax (5%)</td><td>${inv.tax.toLocaleString()}</td></tr>
                  <tr><td colSpan={4}/><td>Discount</td><td>-${inv.discount.toLocaleString()}</td></tr>
                  <tr className="grand-total"><td colSpan={4}/><td>Grand Total</td><td>${inv.grandTotal.toLocaleString()}</td></tr>
                </tfoot>
              </table>

              <div className="invoice-actions" data-html2canvas-ignore>
                <button className="btn btn-secondary" onClick={() => window.print()}><Download size={16} /> Print</button>
                <button className="btn btn-secondary" onClick={exportPDF}><FileText size={16} /> Export PDF</button>
                <button className="btn btn-primary"><CheckCircle size={16} /> Mark as Paid</button>
              </div>
            </div>
          </div>

          <div className="invoice-sidebar animate-in animate-in-delay-2">
            <div className="card budget-card">
              <h4><DollarSign size={16} /> Budget Insights</h4>
              <div className="budget-ring">
                <svg viewBox="0 0 100 100" className="ring-svg">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="var(--sand)" strokeWidth="12"/>
                  <circle cx="50" cy="50" r="40" fill="none" stroke="var(--terracotta)" strokeWidth="12"
                    strokeDasharray={`${spentPct * 2.51} 251`}
                    strokeLinecap="round" transform="rotate(-90 50 50)"/>
                </svg>
              </div>
              <div className="budget-stats">
                <div>Total Budget: <strong>${trip.totalBudget.toLocaleString()}</strong></div>
                <div>Total Spent: <strong>${trip.totalSpent.toLocaleString()}</strong></div>
                <div className={trip.totalBudget - trip.totalSpent < 0 ? 'over-budget' : ''}>
                  Remaining: <strong>${(trip.totalBudget - trip.totalSpent).toLocaleString()}</strong>
                </div>
              </div>
              <button className="btn btn-outline btn-full btn-sm">View Full Budget</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
