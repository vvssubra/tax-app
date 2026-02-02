// Mock transaction data based on Google Sheets schema
export const mockTransactions = [
    {
        status: 'Approved',
        receiptDate: '2026-01-15',
        receiptId: 'RCP-001',
        vendor: 'Office Supplies Co.',
        quantity: 5,
        description: 'Stationery and office materials',
        totalAmount: 450.00,
        subtotalAmount: 400.00,
        serviceCharge: 20.00,
        totalTax: 30.00,
        paymentMethod: 'Credit Card',
        receiptAttachment: ''
    },
    {
        status: 'Pending',
        receiptDate: '2026-01-18',
        receiptId: 'RCP-002',
        vendor: 'Tech Solutions Ltd.',
        quantity: 2,
        description: 'Software licenses',
        totalAmount: 1200.00,
        subtotalAmount: 1100.00,
        serviceCharge: 50.00,
        totalTax: 50.00,
        paymentMethod: 'Bank Transfer',
        receiptAttachment: ''
    },
    {
        status: 'Approved',
        receiptDate: '2026-01-20',
        receiptId: 'RCP-003',
        vendor: 'Cafe Downtown',
        quantity: 1,
        description: 'Client meeting lunch',
        totalAmount: 85.50,
        subtotalAmount: 75.00,
        serviceCharge: 5.00,
        totalTax: 5.50,
        paymentMethod: 'Cash',
        receiptAttachment: ''
    },
    {
        status: 'Approved',
        receiptDate: '2026-01-22',
        receiptId: 'RCP-004',
        vendor: 'Cloud Services Inc.',
        quantity: 1,
        description: 'Monthly cloud hosting',
        totalAmount: 299.00,
        subtotalAmount: 280.00,
        serviceCharge: 10.00,
        totalTax: 9.00,
        paymentMethod: 'Credit Card',
        receiptAttachment: ''
    },
    {
        status: 'Rejected',
        receiptDate: '2026-01-25',
        receiptId: 'RCP-005',
        vendor: 'Travel Agency',
        quantity: 1,
        description: 'Flight tickets',
        totalAmount: 850.00,
        subtotalAmount: 800.00,
        serviceCharge: 25.00,
        totalTax: 25.00,
        paymentMethod: 'Credit Card',
        receiptAttachment: ''
    },
    {
        status: 'Approved',
        receiptDate: '2026-01-28',
        receiptId: 'RCP-006',
        vendor: 'Marketing Agency',
        quantity: 1,
        description: 'Social media campaign',
        totalAmount: 2500.00,
        subtotalAmount: 2300.00,
        serviceCharge: 100.00,
        totalTax: 100.00,
        paymentMethod: 'Bank Transfer',
        receiptAttachment: ''
    },
    {
        status: 'Approved',
        receiptDate: '2026-01-30',
        receiptId: 'RCP-007',
        vendor: 'Utilities Provider',
        quantity: 1,
        description: 'Monthly electricity bill',
        totalAmount: 180.00,
        subtotalAmount: 165.00,
        serviceCharge: 5.00,
        totalTax: 10.00,
        paymentMethod: 'Auto-debit',
        receiptAttachment: ''
    },
    {
        status: 'Pending',
        receiptDate: '2026-02-01',
        receiptId: 'RCP-008',
        vendor: 'Equipment Rental',
        quantity: 3,
        description: 'Camera equipment rental',
        totalAmount: 650.00,
        subtotalAmount: 600.00,
        serviceCharge: 30.00,
        totalTax: 20.00,
        paymentMethod: 'Credit Card',
        receiptAttachment: ''
    }
];

// Calculate summary statistics
export function calculateStats(transactions = mockTransactions) {
    const total = transactions.reduce((sum, t) => sum + t.totalAmount, 0);
    const totalTax = transactions.reduce((sum, t) => sum + t.totalTax, 0);
    const totalQuantity = transactions.reduce((sum, t) => sum + t.quantity, 0);
    const approved = transactions.filter(t => t.status === 'Approved').length;
    const pending = transactions.filter(t => t.status === 'Pending').length;
    const rejected = transactions.filter(t => t.status === 'Rejected').length;

    return {
        totalAmount: total,
        totalTax: totalTax,
        totalQuantity: totalQuantity,
        transactionCount: transactions.length,
        approved,
        pending,
        rejected,
        avgTransaction: total / transactions.length
    };
}

// Group by payment method
export function groupByPaymentMethod(transactions = mockTransactions) {
    const grouped = {};
    transactions.forEach(t => {
        if (!grouped[t.paymentMethod]) {
            grouped[t.paymentMethod] = {
                count: 0,
                total: 0
            };
        }
        grouped[t.paymentMethod].count++;
        grouped[t.paymentMethod].total += t.totalAmount;
    });
    return grouped;
}

// Group by vendor
export function groupByVendor(transactions = mockTransactions) {
    const grouped = {};
    transactions.forEach(t => {
        if (!grouped[t.vendor]) {
            grouped[t.vendor] = {
                count: 0,
                total: 0
            };
        }
        grouped[t.vendor].count++;
        grouped[t.vendor].total += t.totalAmount;
    });
    return grouped;
}

// Get trend data for charts
export function getTrendData(transactions = mockTransactions) {
    const byDate = {};
    transactions.forEach(t => {
        const date = t.receiptDate;
        if (!byDate[date]) {
            byDate[date] = {
                total: 0,
                tax: 0,
                count: 0
            };
        }
        byDate[date].total += t.totalAmount;
        byDate[date].tax += t.totalTax;
        byDate[date].count++;
    });

    return Object.keys(byDate).sort().map(date => ({
        date,
        ...byDate[date]
    }));
}
