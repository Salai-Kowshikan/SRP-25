import { transactions } from "@/constants/data";

interface PerformanceMetrics {
  revenue: number;
  capital: number;
  expenditures: number;
  profit: number;
}

export const calculatePerformance = (shgId: string, month?: string): PerformanceMetrics => {
  // Filter transactions by SHG and month
  const filteredTransactions = transactions
    .filter(t => t.shg_id === shgId)
    .filter(t => !month || 
      new Date(t.timestamp).getMonth() + 1 === parseInt(month));

  // Calculate financial metrics
  const revenue = filteredTransactions
    .filter(t => t.transaction_type === "product_sale")
    .reduce((sum, t) => sum + t.amount, 0);

  const capital = filteredTransactions
    .filter(t => ["government_fund", "bank_fund"].includes(t.transaction_type))
    .reduce((sum, t) => sum + t.amount, 0);

  const expenditures = filteredTransactions
    .filter(t => ["raw_material_expenditure", "loan_repayment"].includes(t.transaction_type))
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const profit = revenue - expenditures;

  return { revenue, capital, expenditures, profit };
};

export const getChartData = (shgId: string, month: string) => {
  const metrics = calculatePerformance(shgId, month);
  return {
    labels: ["Revenue", "Capital", "Expenditure", "Profit"],
    datasets: [{
      data: [metrics.revenue, metrics.capital, metrics.expenditures, metrics.profit],
      colors: [
        (opacity = 1) => `rgba(46, 204, 113, ${opacity})`,  // Revenue (green)
        (opacity = 1) => `rgba(52, 152, 219, ${opacity})`,  // Capital (blue)
        (opacity = 1) => `rgba(231, 76, 60, ${opacity})`,    // Expenditure (red)
        (opacity = 1) => `rgba(155, 89, 182, ${opacity})`   // Profit (purple)
      ]
    }]
  };
};