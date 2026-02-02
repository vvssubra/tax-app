import { mockTransactions, calculateStats, groupByPaymentMethod, getTrendData } from './data.js';

// Initialize dashboard
document.addEventListener('DOMContentLoaded', function () {
    // Set user name
    const userEmail = getCurrentUser();
    const userName = userEmail.split('@')[0];
    document.getElementById('userName').textContent = userName;
    document.getElementById('userInitial').textContent = userName.charAt(0).toUpperCase();

    // Calculate and display stats
    const stats = calculateStats();
    document.getElementById('totalAmount').textContent = `$${stats.totalAmount.toFixed(2)}`;
    document.getElementById('totalTax').textContent = `$${stats.totalTax.toFixed(2)}`;
    document.getElementById('transactionCount').textContent = stats.transactionCount;
    document.getElementById('avgTransaction').textContent = `$${stats.avgTransaction.toFixed(2)}`;

    // Populate transactions table
    populateTransactionsTable();

    // Initialize charts
    initializeTrendChart();
    initializePaymentChart();
});

// Populate transactions table
function populateTransactionsTable() {
    const tbody = document.getElementById('transactionsTable');
    const recentTransactions = mockTransactions.slice(0, 5);

    tbody.innerHTML = recentTransactions.map(transaction => {
        const statusColors = {
            'Approved': 'bg-green-500/20 text-green-400',
            'Pending': 'bg-orange-500/20 text-orange-400',
            'Rejected': 'bg-red-500/20 text-red-400'
        };

        return `
            <tr class="border-b border-slate-800 hover:bg-slate-900/30 transition-colors">
                <td class="py-4 px-4">
                    <span class="px-3 py-1 rounded-full text-xs font-medium ${statusColors[transaction.status]}">
                        ${transaction.status}
                    </span>
                </td>
                <td class="py-4 px-4 text-sm text-slate-300">${transaction.receiptDate}</td>
                <td class="py-4 px-4 text-sm font-mono text-slate-300">${transaction.receiptId}</td>
                <td class="py-4 px-4 text-sm text-slate-300">${transaction.vendor}</td>
                <td class="py-4 px-4 text-sm text-slate-400 max-w-xs truncate">${transaction.description}</td>
                <td class="py-4 px-4 text-sm text-slate-300">${transaction.paymentMethod}</td>
                <td class="py-4 px-4 text-sm font-semibold text-right text-white">$${transaction.totalAmount.toFixed(2)}</td>
            </tr>
        `;
    }).join('');
}

// Initialize trend chart
function initializeTrendChart() {
    const ctx = document.getElementById('trendChart').getContext('2d');
    const trendData = getTrendData();

    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, 'rgba(139, 92, 246, 0.3)');
    gradient.addColorStop(1, 'rgba(139, 92, 246, 0)');

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: trendData.map(d => d.date),
            datasets: [{
                label: 'Total Amount',
                data: trendData.map(d => d.total),
                borderColor: '#8b5cf6',
                backgroundColor: gradient,
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#8b5cf6',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                    titleColor: '#fff',
                    bodyColor: '#cbd5e1',
                    borderColor: '#475569',
                    borderWidth: 1,
                    padding: 12,
                    displayColors: false,
                    callbacks: {
                        label: function (context) {
                            return `Amount: $${context.parsed.y.toFixed(2)}`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        color: 'rgba(148, 163, 184, 0.1)',
                        drawBorder: false
                    },
                    ticks: {
                        color: '#94a3b8',
                        font: {
                            size: 11
                        }
                    }
                },
                y: {
                    grid: {
                        color: 'rgba(148, 163, 184, 0.1)',
                        drawBorder: false
                    },
                    ticks: {
                        color: '#94a3b8',
                        font: {
                            size: 11
                        },
                        callback: function (value) {
                            return '$' + value;
                        }
                    }
                }
            }
        }
    });
}

// Initialize payment method chart
function initializePaymentChart() {
    const ctx = document.getElementById('paymentChart').getContext('2d');
    const paymentData = groupByPaymentMethod();

    const labels = Object.keys(paymentData);
    const data = labels.map(key => paymentData[key].total);

    const colors = [
        '#8b5cf6', // purple
        '#3b82f6', // blue
        '#10b981', // green
        '#06b6d4', // cyan
        '#f59e0b', // orange
    ];

    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: colors,
                borderColor: '#0f172a',
                borderWidth: 3,
                hoverOffset: 10
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: '#cbd5e1',
                        padding: 15,
                        font: {
                            size: 12
                        },
                        usePointStyle: true,
                        pointStyle: 'circle'
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                    titleColor: '#fff',
                    bodyColor: '#cbd5e1',
                    borderColor: '#475569',
                    borderWidth: 1,
                    padding: 12,
                    callbacks: {
                        label: function (context) {
                            const label = context.label || '';
                            const value = context.parsed || 0;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((value / total) * 100).toFixed(1);
                            return `${label}: $${value.toFixed(2)} (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
}
