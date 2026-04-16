import { useState, useEffect, useCallback, useRef } from 'react';
import { UNITS } from './data/units';
import {
  isLoggedIn,
  apiLogin,
  apiRegister,
  apiLogout,
  apiQuantityOperation,
  apiGetHistory,
  removeToken
} from './services/api';

import Header from './components/Header';
import Hero from './components/Hero';
import TypeCards from './components/TypeCards';
import OperationTabs from './components/OperationTabs';
import ConversionPanel from './components/ConversionPanel';
import ResultCard from './components/ResultCard';
import HistoryView from './components/HistoryView';
import AuthModal from './components/AuthModal';
import Loader from './components/Loader';
import { ToastContainer, useToast } from './components/Toast';

import './App.css';

function App() {
  // ===== Application State =====
  const [currentMeasurementType, setCurrentMeasurementType] = useState('LENGTH');
  const [currentOperation, setCurrentOperation] = useState('convert');
  const [isLoading, setIsLoading] = useState(false);
  const [currentView, setCurrentView] = useState('dashboard'); // 'dashboard' | 'history'
  const [authenticated, setAuthenticated] = useState(isLoggedIn());
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Form state
  const [fromValue, setFromValue] = useState('');
  const [fromUnit, setFromUnit] = useState('');
  const [toValue, setToValue] = useState('');
  const [toUnit, setToUnit] = useState('');
  const [targetUnit, setTargetUnit] = useState('');

  // Result state
  const [resultVisible, setResultVisible] = useState(false);
  const [resultLabel, setResultLabel] = useState('Result');
  const [resultBody, setResultBody] = useState('—');

  // History state
  const [historyItems, setHistoryItems] = useState([]);

  // Toast
  const { toasts, showToast, removeToast } = useToast();

  // Auto-convert timer
  const autoConvertTimer = useRef(null);

  // ===== Theme Management =====
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      document.documentElement.setAttribute('data-theme', savedTheme);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }, []);

  const toggleTheme = useCallback(() => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    if (currentTheme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    }
  }, []);

  // ===== Initialize unit dropdowns =====
  useEffect(() => {
    const unitList = UNITS[currentMeasurementType] || [];
    if (unitList.length > 0) {
      setFromUnit((prev) => {
        const found = unitList.some(u => u.value === prev);
        return found ? prev : unitList[0].value;
      });
      setToUnit((prev) => {
        const found = unitList.some(u => u.value === prev);
        if (found) return prev;
        return unitList.length > 1 ? unitList[1].value : unitList[0].value;
      });
      setTargetUnit((prev) => {
        const found = unitList.some(u => u.value === prev);
        return found ? prev : unitList[0].value;
      });
    }
  }, [currentMeasurementType]);

  // ===== Ensure fromUnit !== toUnit =====
  useEffect(() => {
    const unitList = UNITS[currentMeasurementType] || [];
    if (unitList.length > 1 && fromUnit && fromUnit === toUnit) {
      const other = unitList.find(u => u.value !== fromUnit);
      if (other) setToUnit(other.value);
    }
  }, [fromUnit, toUnit, currentMeasurementType]);

  // ===== Select Measurement Type =====
  const selectMeasurementType = useCallback((type) => {
    setCurrentMeasurementType(type);
    setResultVisible(false);
    setToValue('');
  }, []);

  // ===== Select Operation =====
  const selectOperation = useCallback((op) => {
    setCurrentOperation(op);
    setResultVisible(false);
    setToValue('');
  }, []);

  // ===== Swap Units =====
  const swapUnits = useCallback(() => {
    setFromValue((prevFrom) => {
      setToValue((prevTo) => {
        setFromUnit((prevFromUnit) => {
          setToUnit((prevToUnit) => {
            // Swap units
            setFromUnit(prevToUnit);
            setToUnit(prevFromUnit);
            return prevToUnit;
          });
          return prevFromUnit;
        });
        // Set fromValue to previous toValue
        if (prevTo) {
          setFromValue(prevTo);
        } else {
          setFromValue('');
        }
        return '';
      });
      return prevFrom; // This gets overwritten by the inner setFromValue
    });

    setResultVisible(false);
  }, []);

  // Simpler swap approach
  const handleSwap = useCallback(() => {
    const tempFromValue = fromValue;
    const tempFromUnit = fromUnit;

    setFromValue(toValue || '');
    setFromUnit(toUnit);
    setToUnit(tempFromUnit);
    setToValue('');
    setResultVisible(false);
  }, [fromValue, fromUnit, toValue, toUnit]);

  // ===== Reset =====
  const resetAll = useCallback(() => {
    setFromValue('');
    setToValue('');
    setResultVisible(false);
    const unitList = UNITS[currentMeasurementType] || [];
    if (unitList.length > 0) {
      setFromUnit(unitList[0].value);
      setToUnit(unitList.length > 1 ? unitList[1].value : unitList[0].value);
      setTargetUnit(unitList[0].value);
    }
    showToast('Fields reset', 'info');
  }, [currentMeasurementType, showToast]);

  // ===== Perform Calculation =====
  const performCalculation = useCallback(async () => {
    if (isLoading) return;

    const value1 = parseFloat(fromValue);
    if (isNaN(value1)) {
      showToast('Please enter a valid number in the FROM field', 'warning');
      return;
    }

    const requestBody = {
      q1: {
        value: value1,
        unit: fromUnit,
        measurementType: currentMeasurementType
      },
      q2: {
        value: 0,
        unit: toUnit,
        measurementType: currentMeasurementType
      }
    };

    if (currentOperation !== 'convert') {
      const value2 = parseFloat(toValue);
      if (isNaN(value2)) {
        showToast('Please enter a value in the TO field', 'warning');
        return;
      }
      requestBody.q2.value = value2;
    }

    if (currentOperation === 'add' || currentOperation === 'subtract') {
      if (targetUnit) {
        requestBody.targetUnit = {
          value: 0,
          unit: targetUnit,
          measurementType: currentMeasurementType
        };
      }
    }

    setIsLoading(true);

    try {
      const serverResponse = await apiQuantityOperation(currentOperation, requestBody);
      displayResult(serverResponse);
      const operationName = currentOperation.charAt(0).toUpperCase() + currentOperation.slice(1);
      showToast(operationName + ' successful!', 'success');
    } catch (error) {
      showToast(error.message || 'Operation failed', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, fromValue, fromUnit, toValue, toUnit, currentMeasurementType, currentOperation, targetUnit, showToast]);

  // ===== Display Result =====
  const displayResult = useCallback((data) => {
    setResultVisible(true);

    if (currentOperation === 'compare') {
      // Backend returns plain boolean (true/false)
      const isEqual = data === true || data.result === true;
      setResultBody(isEqual ? '✅ Equal' : '❌ Not Equal');
      setResultLabel('Comparison Result');
    } else if (currentOperation === 'convert') {
      // Backend returns QuantityDTO { value, unit, measurementType }
      let resultValue;
      if (typeof data === 'object' && data !== null) {
        resultValue = data.value;
        const resultDisplay = `${data.value} ${data.unit || ''}`;
        setResultBody(resultDisplay.trim());
      } else {
        resultValue = data;
        setResultBody(String(data));
      }

      setResultLabel('Converted Value');

      if (resultValue !== undefined) {
        setToValue(String(resultValue));
      }
    } else if (currentOperation === 'divide') {
      // Backend returns plain double
      setResultLabel('Divide Result');
      setResultBody(String(data));
    } else {
      // Add/Subtract: Backend returns QuantityDTO { value, unit, measurementType }
      const operationName = currentOperation.charAt(0).toUpperCase() + currentOperation.slice(1);
      setResultLabel(operationName + ' Result');

      if (typeof data === 'object' && data !== null) {
        const resultDisplay = `${data.value} ${data.unit || ''}`;
        setResultBody(resultDisplay.trim());
      } else {
        setResultBody(String(data));
      }
    }
  }, [currentOperation]);

  // ===== Auto-convert =====
  useEffect(() => {
    if (currentOperation !== 'convert') return;
    clearTimeout(autoConvertTimer.current);
    autoConvertTimer.current = setTimeout(() => {
      const value = parseFloat(fromValue);
      if (!isNaN(value) && fromUnit && toUnit) {
        performCalculation();
      }
    }, 600);
    return () => clearTimeout(autoConvertTimer.current);
  }, [fromValue, fromUnit, toUnit]); // intentionally limited deps for auto-convert

  // ===== History =====
  const openHistory = useCallback(async () => {
    if (!isLoggedIn()) {
      setShowAuthModal(true);
      showToast('Please login to view history', 'warning');
      return;
    }

    setIsLoading(true);
    try {
      const historyData = await apiGetHistory();
      setHistoryItems(historyData);
      setCurrentView('history');
    } catch (error) {
      if (error.message === 'UNAUTHORIZED') {
        removeToken();
        setAuthenticated(false);
        setShowAuthModal(true);
        showToast('Session expired. Please login again.', 'warning');
      } else {
        showToast(error.message || 'Failed to load history', 'error');
      }
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  // ===== Auth =====
  const handleLogin = useCallback(async (credentials) => {
    setIsLoading(true);
    try {
      await apiLogin(credentials);
      showToast('Login successful!', 'success');
      setShowAuthModal(false);
      setAuthenticated(true);
      // Auto-open history after login
      setTimeout(() => openHistory(), 100);
    } catch (error) {
      showToast(error.message || 'Login failed', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [showToast, openHistory]);

  const handleSignup = useCallback(async (userData) => {
    setIsLoading(true);
    try {
      await apiRegister(userData);
      showToast('Account created! Please login.', 'success');
    } catch (error) {
      showToast(error.message || 'Registration failed', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  const handleLogout = useCallback(() => {
    apiLogout();
    setAuthenticated(false);
    setCurrentView('dashboard');
    showToast('Logged out', 'info');
  }, [showToast]);

  // ===== Enter key to calculate =====
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (showAuthModal) return;
      if (e.key === 'Enter' && document.activeElement.tagName !== 'BUTTON') {
        performCalculation();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [performCalculation, showAuthModal]);

  // ===== Button text =====
  const getButtonText = () => {
    const map = {
      convert: 'Convert',
      compare: 'Compare',
      add: 'Add',
      subtract: 'Subtract',
      divide: 'Divide'
    };
    return map[currentOperation] || 'Calculate';
  };

  return (
    <>
      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      {/* Loader */}
      <Loader isLoading={isLoading} />

      {/* Header */}
      <Header
        onToggleTheme={toggleTheme}
        onOpenHistory={openHistory}
        isAuthenticated={authenticated}
        onLogout={handleLogout}
        onShowAuthModal={() => setShowAuthModal(true)}
      />

      {/* Main Content */}
      <main id="main-content">
        {/* Dashboard View */}
        {currentView === 'dashboard' && (
          <section id="dashboard-view" className="view active-view">
            <Hero />

            <TypeCards
              currentType={currentMeasurementType}
              onSelectType={selectMeasurementType}
            />

            <OperationTabs
              currentOperation={currentOperation}
              onSelectOperation={selectOperation}
            />

            <ConversionPanel
              currentMeasurementType={currentMeasurementType}
              currentOperation={currentOperation}
              fromValue={fromValue}
              fromUnit={fromUnit}
              toValue={toValue}
              toUnit={toUnit}
              targetUnit={targetUnit}
              onFromValueChange={setFromValue}
              onFromUnitChange={setFromUnit}
              onToValueChange={setToValue}
              onToUnitChange={setToUnit}
              onTargetUnitChange={setTargetUnit}
              onSwap={handleSwap}
            />

            {/* Action Buttons */}
            <div className="action-row">
              <button
                id="calculate-btn"
                className="btn btn-primary btn-lg"
                onClick={performCalculation}
                disabled={isLoading}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                <span id="calculate-btn-text">{getButtonText()}</span>
              </button>
              <button id="reset-btn" className="btn btn-ghost" onClick={resetAll}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/>
                </svg>
                Reset
              </button>
            </div>

            <ResultCard
              visible={resultVisible}
              label={resultLabel}
              body={resultBody}
            />
          </section>
        )}

        {/* History View */}
        {currentView === 'history' && (
          <HistoryView
            historyItems={historyItems}
            onBack={() => setCurrentView('dashboard')}
          />
        )}
      </main>

      {/* Auth Modal */}
      {showAuthModal && (
        <AuthModal
          onClose={() => setShowAuthModal(false)}
          onLogin={handleLogin}
          onSignup={handleSignup}
        />
      )}
    </>
  );
}

export default App;
