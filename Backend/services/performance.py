def predict_shg_score(loan_repayment, capital, profit_percentage, num_meetings, attendance_percentage):
    import xgboost as xgb
    import pandas as pd

    # Load the saved model
    model = xgb.XGBRegressor()
    model.load_model("../model/shg_xgboost_model.json")

    # Replace these with values from your training data
    capital_max = 70000
    profit_min = -20
    profit_max = 50
    meetings_max = 30

    # Normalize input features using training stats
    capital_norm = capital / capital_max
    profit_norm = (profit_percentage - profit_min) / (profit_max - profit_min)
    meetings_norm = num_meetings / meetings_max

    # No need to normalize 0–100 features
    input_df = pd.DataFrame([{
        "Loan Repayment": loan_repayment,
        "Capital": capital,
        "Profit Percentage": profit_percentage,
        "No of Meetings": num_meetings,
        "Attendance Percentage": attendance_percentage
    }])

    # Predict score
    predicted_score = model.predict(input_df)[0]
    return round(predicted_score, 4)




sample_score = predict_shg_score(
    loan_repayment= 100,
    capital=30000,
    profit_percentage=50,
    num_meetings=22,
    attendance_percentage=85
)
print(f"Predicted SHG Score: {sample_score}")
