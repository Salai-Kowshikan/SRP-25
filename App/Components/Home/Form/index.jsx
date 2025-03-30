import React from "react";
import { View, Text, TextInput, StyleSheet, ScrollView } from "react-native";
import { Formik } from "formik";
import { Card, Button } from "react-native-paper";
import * as Yup from "yup";
import DateTimePicker from "@react-native-community/datetimepicker";
import { SelectList } from "react-native-dropdown-select-list";
//import axios from "axios";

// Define the validation schema
const validationSchema = Yup.object().shape({
  SHG_Name: Yup.string().required("Required"),
  Date_of_Establishment: Yup.date().required("Required"),
  Number_of_Members: Yup.number().required("Required").positive().integer(),
  Sector: Yup.string().required("Required"),
  Annual_Revenue: Yup.number().required("Required").positive(),
  Annual_Profit: Yup.number().required("Required").positive(),
  Expenses: Yup.number().required("Required").positive(),
  Loan_Amount: Yup.number().required("Required").positive(),
  Loan_Repayment_Status: Yup.string().required("Required"),
  Projects_Completed: Yup.number().required("Required").positive().integer(),
  Success_Rate: Yup.number().required("Required").positive(),
  Geographical_Area: Yup.string().required("Required"),
  Market_Reach: Yup.string().required("Required"),
  Training_Programs_Attended: Yup.number()
    .required("Required")
    .positive()
    .integer(),
  Community_Impact: Yup.string().required("Required"),
  Awards_Recognitions: Yup.string().required("Required"),
  Economic_Conditions: Yup.string().required("Required"),
  Government_Support: Yup.string().required("Required"),
  Market_Trends: Yup.string().required("Required"),
});

const repaymentData = [
  { key: "1", value: "Repaid" },
  { key: "2", value: "Not Repaid" },
];

const geographicalData = [
  { key: "1", value: "Rural" },
  { key: "2", value: "Urban" },
];

const marketReachData = [
  { key: "1", value: "Local" },
  { key: "2", value: "District" },
  { key: "3", value: "State" },
  { key: "4", value: "National" },
  { key: "5", value: "International" },
];

const communityImpactData = [
  { key: "1", value: "Low" },
  { key: "2", value: "Medium" },
  { key: "3", value: "High" },
];

const awardsRecognitionData = [
  { key: "1", value: "Local" },
  { key: "2", value: "State" },
  { key: "3", value: "National" },
];

const economicConditionData = [
  { key: "1", value: "Good" },
  { key: "2", value: "Bad" },
];

const Form = ({ onSubmit }) => {
  const [showDatePicker, setShowDatePicker] = React.useState(false);
  const [date, setDate] = React.useState(new Date());

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  return (
<View>
        <Formik
          initialValues={{
            SHG_Name: "",
            Date_of_Establishment: date,
            Number_of_Members: "",
            Sector: "",
            Annual_Revenue: "",
            Annual_Profit: "",
            Expenses: "",
            Loan_Amount: "",
            Loan_Repayment_Status: "",
            Projects_Completed: "",
            Success_Rate: "",
            Geographical_Area: "",
            Market_Reach: "",
            Training_Programs_Attended: "",
            Community_Impact: "",
            Awards_Recognitions: "",
            Economic_Conditions: "",
            Government_Support: "",
            Market_Trends: "",
          }}
          validationSchema={validationSchema}
          onSubmit={(values) => {
            // axios.post("http://localhost:5000/send", values).then((response) => {
            //   console.log(response.data);
            // }).catch((error) => {
            //   console.error(error);
            // });
            // onSubmit(values);
            console.log(values);
          }}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
            setFieldValue,
          }) => (
            <ScrollView>
              <View style={styles.container}>
                {/* <Text style={styles.label}>SHG Name</Text>
                <TextInput
                  style={styles.input}
                  onChangeText={handleChange("SHG_Name")}
                  onBlur={handleBlur("SHG_Name")}
                  value={values.SHG_Name}
                />
                {touched.SHG_Name && errors.SHG_Name ? (
                  <Text style={styles.errorText}>{errors.SHG_Name}</Text>
                ) : null} */}

                {/* <Text style={styles.label}>Date of Establishment</Text>
                <Button onPress={() => setShowDatePicker(true)}>
                  {date.toDateString()}
                </Button>
                {showDatePicker && (
                  <DateTimePicker
                    value={date}
                    mode="date"
                    display="default"
                    onChange={handleDateChange}
                  />
                )}
                {touched.Date_of_Establishment &&
                errors.Date_of_Establishment ? (
                  <Text style={styles.errorText}>
                    {errors.Date_of_Establishment}
                  </Text>
                ) : null} */}

                <Text style={styles.label}>Number of Members</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  onChangeText={handleChange("Number_of_Members")}
                  onBlur={handleBlur("Number_of_Members")}
                  value={values.Number_of_Members}
                />
                {touched.Number_of_Members && errors.Number_of_Members ? (
                  <Text style={styles.errorText}>
                    {errors.Number_of_Members}
                  </Text>
                ) : null}
{/* 
                <Text style={styles.label}>Sector</Text>
                <TextInput
                  style={styles.input}
                  onChangeText={handleChange("Sector")}
                  onBlur={handleBlur("Sector")}
                  value={values.Sector}
                />
                {touched.Sector && errors.Sector ? (
                  <Text style={styles.errorText}>{errors.Sector}</Text>
                ) : null} */}

                <Text style={styles.label}>Revenue</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  onChangeText={handleChange("Annual_Revenue")}
                  onBlur={handleBlur("Annual_Revenue")}
                  value={values.Annual_Revenue}
                />
                {touched.Annual_Revenue && errors.Annual_Revenue ? (
                  <Text style={styles.errorText}>{errors.Annual_Revenue}</Text>
                ) : null}

                <Text style={styles.label}>Profit</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  onChangeText={handleChange("Annual_Profit")}
                  onBlur={handleBlur("Annual_Profit")}
                  value={values.Annual_Profit}
                />
                {touched.Annual_Profit && errors.Annual_Profit ? (
                  <Text style={styles.errorText}>{errors.Annual_Profit}</Text>
                ) : null}

                <Text style={styles.label}>Expenses</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  onChangeText={handleChange("Expenses")}
                  onBlur={handleBlur("Expenses")}
                  value={values.Expenses}
                />
                {touched.Expenses && errors.Expenses ? (
                  <Text style={styles.errorText}>{errors.Expenses}</Text>
                ) : null}

                <Text style={styles.label}>Loan Amount</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  onChangeText={handleChange("Loan_Amount")}
                  onBlur={handleBlur("Loan_Amount")}
                  value={values.Loan_Amount}
                />
                {touched.Loan_Amount && errors.Loan_Amount ? (
                  <Text style={styles.errorText}>{errors.Loan_Amount}</Text>
                ) : null}

                <Text style={styles.label}>Loan Repayment Status</Text>
                <SelectList
                  setSelected={(val) =>
                    setFieldValue("Loan_Repayment_Status", val)
                  }
                  data={repaymentData}
                  save="value"
                />
                {touched.Loan_Repayment_Status &&
                errors.Loan_Repayment_Status ? (
                  <Text style={styles.errorText}>
                    {errors.Loan_Repayment_Status}
                  </Text>
                ) : null}

                <Text style={styles.label}>Projects Completed</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  onChangeText={handleChange("Projects_Completed")}
                  onBlur={handleBlur("Projects_Completed")}
                  value={values.Projects_Completed}
                />
                {touched.Projects_Completed && errors.Projects_Completed ? (
                  <Text style={styles.errorText}>
                    {errors.Projects_Completed}
                  </Text>
                ) : null}

                <Text style={styles.label}>Success Rate</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  onChangeText={handleChange("Success_Rate")}
                  onBlur={handleBlur("Success_Rate")}
                  value={values.Success_Rate}
                />
                {touched.Success_Rate && errors.Success_Rate ? (
                  <Text style={styles.errorText}>{errors.Success_Rate}</Text>
                ) : null}

                <Text style={styles.label}>Geographical Area</Text>
                <SelectList
                  setSelected={(val) => setFieldValue("Geographical_Area", val)}
                  data={geographicalData}
                  save="value"
                />
                {touched.Geographical_Area && errors.Geographical_Area ? (
                  <Text style={styles.errorText}>
                    {errors.Geographical_Area}
                  </Text>
                ) : null}

                <Text style={styles.label}>Market Reach</Text>
                <SelectList
                  setSelected={(val) => setFieldValue("Market_Reach", val)}
                  data={marketReachData}
                  save="value"
                />
                {touched.Market_Reach && errors.Market_Reach ? (
                  <Text style={styles.errorText}>{errors.Market_Reach}</Text>
                ) : null}

                <Text style={styles.label}>Training Programs Attended</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  onChangeText={handleChange("Training_Programs_Attended")}
                  onBlur={handleBlur("Training_Programs_Attended")}
                  value={values.Training_Programs_Attended}
                />
                {touched.Training_Programs_Attended &&
                errors.Training_Programs_Attended ? (
                  <Text style={styles.errorText}>
                    {errors.Training_Programs_Attended}
                  </Text>
                ) : null}

                <Text style={styles.label}>Community Impact</Text>
                <SelectList
                  setSelected={(val) => setFieldValue("Community_Impact", val)}
                  data={communityImpactData}
                  save="value"
                />
                {touched.Community_Impact && errors.Community_Impact ? (
                  <Text style={styles.errorText}>
                    {errors.Community_Impact}
                  </Text>
                ) : null}

                <Text style={styles.label}>Awards Recognitions</Text>
                <SelectList
                  setSelected={(val) =>
                    setFieldValue("Awards_Recognitions", val)
                  }
                  data={awardsRecognitionData}
                  save="value"
                />
                {touched.Awards_Recognitions && errors.Awards_Recognitions ? (
                  <Text style={styles.errorText}>
                    {errors.Awards_Recognitions}
                  </Text>
                ) : null}

                <Text style={styles.label}>Economic Conditions</Text>
                <SelectList
                  setSelected={(val) =>
                    setFieldValue("Economic_Conditions", val)
                  }
                  data={economicConditionData}
                  save="value"
                />
                {touched.Economic_Conditions && errors.Economic_Conditions ? (
                  <Text style={styles.errorText}>
                    {errors.Economic_Conditions}
                  </Text>
                ) : null}

                <Text style={styles.label}>Government Support</Text>
                <TextInput
                  style={styles.input}
                  onChangeText={handleChange("Government_Support")}
                  onBlur={handleBlur("Government_Support")}
                  value={values.Government_Support}
                />
                {touched.Government_Support && errors.Government_Support ? (
                  <Text style={styles.errorText}>
                    {errors.Government_Support}
                  </Text>
                ) : null}

                <Text style={styles.label}>Market Trends</Text>
                <TextInput
                  style={styles.input}
                  onChangeText={handleChange("Market_Trends")}
                  onBlur={handleBlur("Market_Trends")}
                  value={values.Market_Trends}
                />
                {touched.Market_Trends && errors.Market_Trends ? (
                  <Text style={styles.errorText}>{errors.Market_Trends}</Text>
                ) : null}

                <Button mode="contained" onPress={handleSubmit} title="Submit" style={{margin:10}}>
                  Submit
                </Button>
              </View>
            </ScrollView>
          )}
        </Formik>
 </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  card: {
    margin: 16,
    borderRadius: 10,
  },
  label: {
    marginTop: 16,
    fontSize: 16,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginTop: 8,
    paddingLeft: 8,
    borderRadius: 4,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 4,
  },
});

export default Form;
