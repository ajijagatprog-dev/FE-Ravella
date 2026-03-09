// ─── Types ────────────────────────────────────────────────────────────────────

export type TxStatus = "Paid" | "Pending";
export type TxMethod = "QRIS" | "VA";
export type FilterStatus = "All" | "Paid" | "Pending";
export type FilterMethod = "All" | "QRIS" | "VA";

export interface Transaction {
  id: string;
  date: string;
  method: TxMethod;
  amount: number;
  status: TxStatus;
  isNew?: boolean;
  description: string;
  customerName?: string;
  companyName?: string;
}

export interface PaymentMethod {
  id: string;
  type: "VA" | "QRIS" | "Card";
  label: string;
  detail: string;
  bank?: string;
  isPrimary?: boolean;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function formatRp(amount: number): string {
  return "Rp " + amount.toLocaleString("id-ID");
}

export function generateInvoicePDF(trx: Transaction): void {
  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <title>Invoice ${trx.id}</title>
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    body{font-family:'Segoe UI',sans-serif;padding:48px;color:1a1a2e;background:fff}
    .header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:40px;border-bottom:2px solid 2563eb;padding-bottom:24px}
    .logo{font-size:22px;font-weight:800;color:2563eb}
    .logo span{color:1a1a2e}
    .badge{background:dcfce7;color:16a34a;padding:4px 14px;border-radius:20px;font-size:12px;font-weight:700}
    .title{font-size:28px;font-weight:700;margin-bottom:6px}
    .subtitle{color:6b7280;font-size:14px}
    .grid{display:grid;grid-template-columns:1fr 1fr;gap:32px;margin:32px 0}
    .label{font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.05em;color:9ca3af;margin-bottom:4px}
    .value{font-size:14px;font-weight:500;color:1f2937}
    table{width:100%;border-collapse:collapse;margin:24px 0}
    th{background:f3f4f6;padding:10px 16px;text-align:left;font-size:11px;text-transform:uppercase;letter-spacing:.05em;color:6b7280}
    td{padding:14px 16px;border-bottom:1px solid f3f4f6;font-size:14px}
    .total-row td{background:eff6ff;font-weight:700;font-size:16px;color:2563eb;border:none;padding:16px}
    .footer{margin-top:48px;padding-top:24px;border-top:1px solid e5e7eb;display:flex;justify-content:space-between;font-size:12px;color:9ca3af}
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="logo">Ravelle<span>Fashion</span></div>
      <div style="color:6b7280;font-size:13px;margin-top:4px">B2B Wholesale Portal</div>
    </div>
    <div class="badge">✓ LUNAS</div>
  </div>
  <div class="title">Invoice</div>
  <div class="subtitle">${trx.id.replace("", "INV-")}</div>
  <div class="grid">
    <div>
      <div class="label">Tagihan Kepada</div>
      <div class="value">${trx.customerName || "Retail Partner"}</div>
      <div style="color:6b7280;font-size:13px;margin-top:2px">${trx.companyName || "B2B Account"}</div>
    </div>
    <div>
      <div class="label">Tanggal Invoice</div>
      <div class="value">${trx.date}</div>
      <div style="margin-top:12px">
        <div class="label">Metode Pembayaran</div>
        <div class="value">${trx.method}</div>
      </div>
    </div>
  </div>
  <table>
    <thead><tr><th>Deskripsi</th><th>ID Transaksi</th><th style="text-align:right">Jumlah</th></tr></thead>
    <tbody>
      <tr>
        <td>${trx.description}</td>
        <td style="color:6b7280">${trx.id}</td>
        <td style="text-align:right;font-weight:600">${formatRp(trx.amount)}</td>
      </tr>
    </tbody>
    <tfoot>
      <tr class="total-row">
        <td colspan="2">Total Dibayar</td>
        <td style="text-align:right">${formatRp(trx.amount)}</td>
      </tr>
    </tfoot>
  </table>
  <div class="footer">
    <div>© 2023 Ravelle Fashion Portal. All rights reserved.</div>
    <div>Dokumen ini digenerate otomatis dan sah tanpa tanda tangan.</div>
  </div>
</body>
</html>`;
  const win = window.open("", "_blank");
  if (!win) return;
  win.document.write(html);
  win.document.close();
  win.focus();
  setTimeout(() => win.print(), 400);
}

// ─── Initial Data ─────────────────────────────────────────────────────────────

export const INIT_TRANSACTIONS: Transaction[] = [
  { id: "TRX-9950", date: "03 Nov 2023", method: "QRIS", amount: 5700000, status: "Pending", isNew: true, description: "Wholesale Order RVL-8902 — Nordstrom Rack" },
  { id: "TRX-9945", date: "02 Nov 2023", method: "VA", amount: 6500000, status: "Pending", description: "Wholesale Order RVL-8901 — Urban Outfitters" },
  { id: "TRX-9928", date: "24 Okt 2023", method: "VA", amount: 4200000, status: "Paid", description: "Wholesale Order RVL-8895 — Selfridges & Co" },
  { id: "TRX-9921", date: "20 Okt 2023", method: "QRIS", amount: 1500000, status: "Paid", description: "Wholesale Order RVL-8890 — H&M Group" },
  { id: "TRX-9910", date: "15 Okt 2023", method: "VA", amount: 8320000, status: "Paid", description: "Wholesale Order RVL-8885 — ASOS Wholesale" },
  { id: "TRX-9905", date: "12 Okt 2023", method: "QRIS", amount: 2150000, status: "Paid", description: "Wholesale Order RVL-8880 — Marks & Spencer" },
  { id: "TRX-9898", date: "10 Okt 2023", method: "VA", amount: 9800000, status: "Paid", description: "Wholesale Order RVL-8875 — Zalando SE" },
  { id: "TRX-9890", date: "07 Okt 2023", method: "QRIS", amount: 3400000, status: "Paid", description: "Wholesale Order RVL-8870 — Mango Fashion" },
  { id: "TRX-9882", date: "04 Okt 2023", method: "VA", amount: 7600000, status: "Paid", description: "Wholesale Order RVL-8865 — Next PLC" },
  { id: "TRX-9875", date: "01 Okt 2023", method: "QRIS", amount: 4780000, status: "Paid", description: "Wholesale Order RVL-8860 — River Island" },
  { id: "TRX-9860", date: "28 Sep 2023", method: "VA", amount: 11200000, status: "Paid", description: "Wholesale Order RVL-8855 — Topshop Group" },
  { id: "TRX-9852", date: "25 Sep 2023", method: "QRIS", amount: 2900000, status: "Paid", description: "Wholesale Order RVL-8848 — Zara Flagship" },
];

export const INIT_PAYMENT_METHODS: PaymentMethod[] = [
  { id: "pm1", type: "VA", label: "BCA Virtual Account", detail: "8277-0912-3456-7890", bank: "BCA", isPrimary: true },
  { id: "pm2", type: "VA", label: "Mandiri Virtual Account", detail: "8927-1234-5678-0011", bank: "Mandiri" },
  { id: "pm3", type: "QRIS", label: "QRIS", detail: "Scan QR untuk bayar" },
];

export const ITEMS_PER_PAGE = 4;