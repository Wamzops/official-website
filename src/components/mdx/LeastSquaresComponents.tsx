"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { Text } from "@once-ui-system/core";

export const QuickCheck1 = () => {
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  
  const options = [
    "Maximize the sum of squared residuals",
    "Minimize the sum of absolute residuals",
    "Minimize the sum of squared residuals",
    "Maximize the R-squared value"
  ];
  
  const checkAnswer = (idx: number) => {
    setSelected(idx);
    setSubmitted(true);
  };
  
  return (
    <div style={{ border: '1px solid #4CAF50', borderRadius: '8px', padding: '15px', margin: '20px 0', backgroundColor: '#f9fff9' }}>
      <h4 style={{ color: '#2e7d32', marginTop: 0 }}>🤔 What does Ordinary Least Squares (OLS) minimize?</h4>
      {options.map((opt, i) => (
        <button
          key={i}
          onClick={() => checkAnswer(i)}
          style={{
            display: 'block',
            width: '100%',
            margin: '8px 0',
            padding: '10px',
            textAlign: 'left',
            backgroundColor: submitted && i === 2 ? '#c8e6c9' : (submitted && i === selected ? '#ffcdd2' : '#f5f5f5'),
            border: '1px solid #ddd',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: submitted && i === 2 ? 'bold' : 'normal',
            color: '#333'
          }}
          disabled={submitted}
        >
          {opt}
        </button>
      ))}
      {submitted && (
        <div style={{ marginTop: '10px' }}>
          {selected === 2 ? (
            <p style={{ color: '#2e7d32' }}>✅ Correct! OLS finds the line that minimizes the sum of squared residuals (errors).</p>
          ) : (
            <p style={{ color: '#c62828' }}>❌ Not quite. The correct answer is: <strong>Minimize the sum of squared residuals</strong>.</p>
          )}
          <button 
            onClick={() => { setSelected(null); setSubmitted(false); }} 
            style={{ 
              marginTop: '5px',
              padding: '6px 12px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
};

export const QuickCheck2 = () => {
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  
  const options = [
    "Linearity between predictors and outcome",
    "Homoscedasticity (constant variance of errors)",
    "Normality of the independent variables",
    "Independence of observations"
  ];
  
  const checkAnswer = (idx: number) => {
    setSelected(idx);
    setSubmitted(true);
  };
  
  return (
    <div style={{ border: '1px solid #2196F3', borderRadius: '8px', padding: '15px', margin: '20px 0', backgroundColor: '#f0f8ff' }}>
      <h4 style={{ color: '#1976d2', marginTop: 0 }}>📌 Which statement is FALSE regarding OLS assumptions?</h4>
      {options.map((opt, i) => (
        <button
          key={i}
          onClick={() => checkAnswer(i)}
          style={{
            display: 'block',
            width: '100%',
            margin: '8px 0',
            padding: '10px',
            textAlign: 'left',
            backgroundColor: submitted && i === 2 ? '#c8e6c9' : (submitted && i === selected ? '#ffcdd2' : '#f5f5f5'),
            border: '1px solid #ddd',
            borderRadius: '4px',
            cursor: 'pointer',
            color: '#333'
          }}
          disabled={submitted}
        >
          {opt}
        </button>
      ))}
      {submitted && (
        <div style={{ marginTop: '10px' }}>
          {selected === 2 ? (
            <p style={{ color: '#2e7d32' }}>✅ Correct! OLS does NOT require the independent variables themselves to be normally distributed — only the errors (residuals) should be normal for small samples.</p>
          ) : (
            <p style={{ color: '#c62828' }}>❌ Incorrect. The statement that is NOT an assumption is: <strong>Normality of the independent variables</strong>.</p>
          )}
          <button 
            onClick={() => { setSelected(null); setSubmitted(false); }} 
            style={{ 
              marginTop: '5px',
              padding: '6px 12px',
              backgroundColor: '#2196F3',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
};

export const OLSInteractive = () => {
  const [slope, setSlope] = useState(2);
  const [intercept, setIntercept] = useState(1);
  const [data, setData] = useState<any[]>([]);
  
  useEffect(() => {
    const xValues = [1, 2, 3, 4, 5, 6, 7, 8];
    const trueSlope = 2.5;
    const trueIntercept = 0.5;
    const initialData = xValues.map(x => ({
      x: x,
      actual: trueSlope * x + trueIntercept + (Math.random() - 0.5) * 2
    }));
    setData(initialData);
  }, []);

  const chartData = useMemo(() => {
    return data.map(d => ({
      ...d,
      predicted: slope * d.x + intercept
    }));
  }, [data, slope, intercept]);
  
  const calculateR2 = () => {
    if (data.length === 0) return "0.000";
    const actuals = data.map(d => d.actual);
    const predictions = chartData.map(d => d.predicted);
    const meanActual = actuals.reduce((a, b) => a + b, 0) / actuals.length;
    const ssRes = actuals.reduce((sum, actual, i) => sum + Math.pow(actual - predictions[i], 2), 0);
    const ssTot = actuals.reduce((sum, actual) => sum + Math.pow(actual - meanActual, 2), 0);
    if (ssTot === 0) return "1.000";
    return (1 - ssRes / ssTot).toFixed(3);
  };
  
  return (
    <div style={{ border: '1px solid #e0e0e0', borderRadius: '8px', padding: '20px', margin: '20px 0', backgroundColor: '#fff' }}>
      <h3 style={{ marginTop: 0 }}>🎮 Interactive OLS Simulator</h3>
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '10px', color: '#333', fontWeight: '500' }}>
          Slope (β₁): 
          <input 
            type="range" 
            min="0" 
            max="5" 
            step="0.1" 
            value={slope} 
            onChange={(e) => setSlope(parseFloat(e.target.value))}
            style={{ marginLeft: '10px', width: '200px', cursor: 'pointer' }}
          />
          <span style={{ marginLeft: '10px', fontWeight: 'bold', color: '#2e7d32' }}>{slope}</span>
        </label>
        <label style={{ display: 'block', color: '#333', fontWeight: '500' }}>
          Intercept (β₀): 
          <input 
            type="range" 
            min="-2" 
            max="5" 
            step="0.1" 
            value={intercept} 
            onChange={(e) => setIntercept(parseFloat(e.target.value))}
            style={{ marginLeft: '10px', width: '200px', cursor: 'pointer' }}
          />
          <span style={{ marginLeft: '10px', fontWeight: 'bold', color: '#2e7d32' }}>{intercept}</span>
        </label>
      </div>
      
      <div style={{ width: '100%', overflowX: 'auto' }}>
        <LineChart width={500} height={300} data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="x" label={{ value: 'X', position: 'insideBottomRight', offset: -5 }} />
          <YAxis label={{ value: 'Y', angle: -90, position: 'insideLeft' }} />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="actual" stroke="#8884d8" name="Actual Data" dot={{ r: 6 }} strokeWidth={0} />
          <Line type="monotone" dataKey="predicted" stroke="#82ca9d" name="Your Line" strokeDasharray="5 5" strokeWidth={2} dot={false} />
        </LineChart>
      </div>
      
      <div style={{ marginTop: '15px', padding: '15px', backgroundColor: '#f9f9f9', borderRadius: '4px', borderLeft: '4px solid #82ca9d' }}>
        <Text variant="body-default-m" onBackground="neutral-medium">
          <strong>📊 R² Score: {calculateR2()}</strong>
        </Text>
        <p style={{ marginTop: '8px', fontSize: '14px', color: '#666' }}>
          💡 <strong>Challenge:</strong> Adjust the slope and intercept to make the R² score as close to 1 as possible!
        </p>
      </div>
    </div>
  );
};

export const QuickCheck3 = () => {
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  
  const options = [
    "The proportion of variance explained by the model",
    "The slope of the regression line",
    "The p-value of the intercept",
    "The standard error of the estimate"
  ];
  
  const checkAnswer = (idx: number) => {
    setSelected(idx);
    setSubmitted(true);
  };
  
  return (
    <div style={{ border: '1px solid #FF9800', borderRadius: '8px', padding: '15px', margin: '20px 0', backgroundColor: '#fff8e7' }}>
      <h4 style={{ color: '#e65100', marginTop: 0 }}>📈 What does R-squared (R²) measure in OLS regression?</h4>
      {options.map((opt, i) => (
        <button
          key={i}
          onClick={() => checkAnswer(i)}
          style={{
            display: 'block',
            width: '100%',
            margin: '8px 0',
            padding: '10px',
            textAlign: 'left',
            backgroundColor: submitted && i === 0 ? '#c8e6c9' : (submitted && i === selected ? '#ffcdd2' : '#f5f5f5'),
            border: '1px solid #ddd',
            borderRadius: '4px',
            cursor: 'pointer',
            color: '#333'
          }}
          disabled={submitted}
        >
          {opt}
        </button>
      ))}
      {submitted && (
        <div style={{ marginTop: '10px' }}>
          {selected === 0 ? (
            <p style={{ color: '#2e7d32' }}>✅ Correct! R² is the proportion of variance in the dependent variable that is explained by the independent variable(s).</p>
          ) : (
            <p style={{ color: '#c62828' }}>❌ Not quite. R² measures <strong>the proportion of variance explained by the model</strong>.</p>
          )}
          <button 
            onClick={() => { setSelected(null); setSubmitted(false); }} 
            style={{ 
              marginTop: '5px',
              padding: '6px 12px',
              backgroundColor: '#FF9800',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
};

export const FinalOLSQuiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<any>({});
  const [showResults, setShowResults] = useState(false);
  
  const questions = [
    { text: "What does OLS stand for?", options: ["Optimal Linear Selection", "Ordinary Least Squares", "Ordered Linear System", "Observational Linear Statistics"], correct: 1 },
    { text: "Which is a key OLS assumption?", options: ["Normal independent variables", "Constant error variance (homoscedasticity)", "At least 100 observations", "Categorical dependent variable"], correct: 1 },
    { text: "What does a low coefficient p-value (< 0.05) indicate?", options: ["Not statistically significant", "Likely different from zero", "High R-squared", "Multicollinearity"], correct: 1 },
    { text: "Consequence of ignoring heteroscedasticity?", options: ["Biased coefficients", "Incorrect standard errors", "Non-linear relationships", "Negative R-squared"], correct: 1 },
    { text: "Which metric adjusts R-squared for # of predictors?", options: ["F-statistic", "Adjusted R-squared", "Standard error", "P-value"], correct: 1 }
  ];
  
  const handleAnswer = (optionIndex: number) => {
    setAnswers({ ...answers, [currentQuestion]: optionIndex });
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };
  
  const score = Object.keys(answers).reduce((acc, idx: any) => answers[idx] === questions[idx].correct ? acc + 1 : acc, 0);
  const percentage = (score / questions.length) * 100;

  if (showResults) {
    return (
      <div style={{ border: '2px solid #3f51b5', borderRadius: '8px', padding: '20px', margin: '20px 0', backgroundColor: '#f3f5ff' }}>
        <h3>🏆 Final Quiz Results</h3>
        <p>You got {score} out of {questions.length} correct ({percentage}%).</p>
        <button onClick={() => { setCurrentQuestion(0); setAnswers({}); setShowResults(false); }} style={{ padding: '8px 16px', cursor: 'pointer', marginTop: '10px', backgroundColor: '#3f51b5', color: 'white', border: 'none', borderRadius: '4px' }}>Retake Quiz</button>
      </div>
    );
  }
  
  const q = questions[currentQuestion];
  return (
    <div style={{ border: '2px solid #3f51b5', borderRadius: '8px', padding: '20px', margin: '20px 0', backgroundColor: '#fafaff' }}>
      <h3>📚 Question {currentQuestion + 1} of {questions.length}</h3>
      <p style={{ fontSize: '18px', fontWeight: '500', color: '#1a237e' }}>{q.text}</p>
      {q.options.map((opt, i) => (
        <button key={i} onClick={() => handleAnswer(i)} style={{ display: 'block', width: '100%', margin: '10px 0', padding: '12px', textAlign: 'left', backgroundColor: '#e8eaf6', border: '1px solid #c5cae9', borderRadius: '6px', cursor: 'pointer', color: '#333' }}>
          {String.fromCharCode(65 + i)}. {opt}
        </button>
      ))}
    </div>
  );
};
