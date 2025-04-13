from services.fetch_sales import fetch_sales
from services.fetch_expenditure import fetch_expenditure
from services.fetch_transactions import fetch_transactions

def filter_fund_transactions(transactions):
    return [t for t in transactions if t["type"] == "funds"]

def filter_expenditure_transactions(transactions):
    return [t for t in transactions if t["type"] == "expenditure"]

def filter_sales_transactions(transactions):
    return [t for t in transactions if t["type"] == "sales"]



def calculate_total_funds(fund_transactions):
    return sum(t["amount"] for t in fund_transactions)

def calculate_total_revenue(sales):
    return sum(s["total"] for s in sales)

def calculate_total_expenditure(expenditure_transactions):
    return sum(t["amount"] for t in expenditure_transactions)

def calculate_profit(revenue, expenditure):
    return revenue - expenditure

def calculate_profit_percentage(profit, capital):
    return round((profit / capital) * 100, 2) if capital else 0


def filter_sales_by_transactions(sales, transaction_ids):
    return [sale for sale in sales if sale["transaction_id"] in transaction_ids]

def filter_expenditure_by_transactions(expenditures, transaction_ids):
    return [exp for exp in expenditures if exp["transaction_id"] in transaction_ids]


def organize_data(month=None, year=None):
    transactions = fetch_transactions(month, year)
    all_sales = fetch_sales()
    all_expenditures = fetch_expenditure()

    fund_transactions = filter_fund_transactions(transactions)
    expenditure_transactions = filter_expenditure_transactions(transactions)
    sales_transactions = filter_sales_transactions(transactions)


    transaction_ids = set(t["id"] for t in sales_transactions)

 
    filtered_sales = filter_sales_by_transactions(all_sales, transaction_ids)
    filtered_expenditures = filter_expenditure_by_transactions(all_expenditures, transaction_ids)

   
    capital = calculate_total_funds(fund_transactions)
    revenue = calculate_total_revenue(filtered_sales)
    expenses = calculate_total_expenditure(expenditure_transactions)
    profit = calculate_profit(revenue, expenses)
    profit_percent = calculate_profit_percentage(profit, capital)

 
    return {
        "total_funds_received": capital,
        "total_revenue": revenue,
        "total_expenditure": expenses,
        "net_profit": profit,
        "profit_percentage": profit_percent,
        "filtered_sales_count": len(filtered_sales),
        "filtered_expenditures_count": len(filtered_expenditures)
    }