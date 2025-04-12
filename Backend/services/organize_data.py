from services.fetch_transactions import fetch_transactions
from services.fetch_sales import fetch_sales
from services.fetch_expenditure import fetch_expenditure


def calculate_total_funds(transactions):
    return sum(t["amount"] for t in transactions if t["type"] == "funds")


def calculate_total_revenue(sales):
    return sum(s["total"] for s in sales)


def calculate_total_expenditure(transactions):
    return sum(t["amount"] for t in transactions if t["type"] == "expenditure")


def calculate_profit(revenue, expenditure):
    return revenue - expenditure


def calculate_profit_percentage(profit, capital):
    return round((profit / capital) * 100, 2) if capital else 0


def organize_data():
    transactions = fetch_transactions()
    sales = fetch_sales()

    capital = calculate_total_funds(transactions)
    revenue = calculate_total_revenue(sales)
    expenses = calculate_total_expenditure(transactions)
    profit = calculate_profit(revenue, expenses)
    profit_percent = calculate_profit_percentage(profit, capital)

    summary = {
        "total_funds_received": capital,
        "total_revenue": revenue,
        "total_expenditure": expenses,
        "net_profit": profit,
        "profit_percentage": profit_percent
    }

    print("Summary Report:")
    for key, val in summary.items():
        print(f"{key}: {val}")

    return summary
