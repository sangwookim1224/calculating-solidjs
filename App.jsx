import { createSignal } from "solid-js";
import "./App.css";

function App() {
  const [display, setDisplay] = createSignal("0");
  const [prevValue, setPrevValue] = createSignal(null);
  const [operator, setOperator] = createSignal(null);
  const [waitingForOperand, setWaitingForOperand] = createSignal(false);

  const inputDigit = (digit) => {
    if (waitingForOperand()) {
      setDisplay(String(digit));
      setWaitingForOperand(false);
    } else {
      setDisplay(display() === "0" ? String(digit) : display() + digit);
    }
  };

  const inputDot = () => {
    if (waitingForOperand()) {
      setDisplay("0.");
      setWaitingForOperand(false);
      return;
    }
    if (!display().includes(".")) {
      setDisplay(display() + ".");
    }
  };

  const clear = () => {
    setDisplay("0");
    setPrevValue(null);
    setOperator(null);
    setWaitingForOperand(false);
  };

  const toggleSign = () => {
    const value = parseFloat(display());
    setDisplay(String(value * -1));
  };

  const inputPercent = () => {
    const value = parseFloat(display());
    setDisplay(String(value / 100));
  };

  const calculate = (left, right, op) => {
    switch (op) {
      case "+": return left + right;
      case "-": return left - right;
      case "×": return left * right;
      case "÷": return right !== 0 ? left / right : "Error";
      default: return right;
    }
  };

  const handleOperator = (nextOperator) => {
    const current = parseFloat(display());

    if (prevValue() !== null && !waitingForOperand()) {
      const result = calculate(prevValue(), current, operator());
      if (result === "Error") {
        setDisplay("Error");
        setPrevValue(null);
        setOperator(null);
        setWaitingForOperand(false);
        return;
      }
      setDisplay(String(parseFloat(result.toFixed(10))));
      setPrevValue(result);
    } else {
      setPrevValue(current);
    }

    setOperator(nextOperator);
    setWaitingForOperand(true);
  };

  const handleEquals = () => {
    if (prevValue() === null || operator() === null) return;

    const current = parseFloat(display());
    const result = calculate(prevValue(), current, operator());

    if (result === "Error") {
      setDisplay("Error");
    } else {
      setDisplay(String(parseFloat(result.toFixed(10))));
    }

    setPrevValue(null);
    setOperator(null);
    setWaitingForOperand(false);
  };

  const isActiveOp = (op) => operator() === op && waitingForOperand();

  return (
    <div class="calculator">
      <div class="display">
        <div class="display-text">{display()}</div>
      </div>
      <div class="buttons">
        <button class="btn func" onClick={clear}>
          {display() === "0" && prevValue() === null ? "AC" : "C"}
        </button>
        <button class="btn func" onClick={toggleSign}>+/-</button>
        <button class="btn func" onClick={inputPercent}>%</button>
        <button
          class={`btn op ${isActiveOp("÷") ? "active" : ""}`}
          onClick={() => handleOperator("÷")}
        >÷</button>

        <button class="btn" onClick={() => inputDigit(7)}>7</button>
        <button class="btn" onClick={() => inputDigit(8)}>8</button>
        <button class="btn" onClick={() => inputDigit(9)}>9</button>
        <button
          class={`btn op ${isActiveOp("×") ? "active" : ""}`}
          onClick={() => handleOperator("×")}
        >×</button>

        <button class="btn" onClick={() => inputDigit(4)}>4</button>
        <button class="btn" onClick={() => inputDigit(5)}>5</button>
        <button class="btn" onClick={() => inputDigit(6)}>6</button>
        <button
          class={`btn op ${isActiveOp("-") ? "active" : ""}`}
          onClick={() => handleOperator("-")}
        >-</button>

        <button class="btn" onClick={() => inputDigit(1)}>1</button>
        <button class="btn" onClick={() => inputDigit(2)}>2</button>
        <button class="btn" onClick={() => inputDigit(3)}>3</button>
        <button
          class={`btn op ${isActiveOp("+") ? "active" : ""}`}
          onClick={() => handleOperator("+")}
        >+</button>

        <button class="btn zero" onClick={() => inputDigit(0)}>0</button>
        <button class="btn" onClick={inputDot}>.</button>
        <button class="btn op" onClick={handleEquals}>=</button>
      </div>
    </div>
  );
}

export default App;
