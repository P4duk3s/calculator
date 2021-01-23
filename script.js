const buttons = document.querySelectorAll('button');
const upperDisplay = document.getElementById('equation');
const lowerDisplay = document.getElementById('result');
const clearBtn = document.getElementById('clear-btn');

// Helper parameters
let firstNumber = 0;
let operatorValue = '';
let calculationDone = false;
let decimalUsed = false;

// Regular calculations and updating the displays
function calculate(number1, number2, operator) {
  switch (operator) {
    case '+':
      upperDisplay.textContent += lowerDisplay.textContent
      lowerDisplay.textContent = number1 + number2;
      calculationDone = true;
      decimalUsed = false;
      break;

    case '-':
      upperDisplay.textContent += lowerDisplay.textContent
      lowerDisplay.textContent = number1 - number2;
      calculationDone = true;
      decimalUsed = false;
      break;

    case '*':
      upperDisplay.textContent += lowerDisplay.textContent
      lowerDisplay.textContent = number1 * number2;
      calculationDone = true;
      decimalUsed = false;
      break;

    case '/':
      upperDisplay.textContent += lowerDisplay.textContent
      lowerDisplay.textContent = number1 / number2;
      calculationDone = true;
      decimalUsed = false;
      break;

    case '^':
      upperDisplay.textContent += lowerDisplay.textContent;
      lowerDisplay.textContent = Math.pow(number1, number2);
      calculationDone = true;
      decimalUsed = false;
      break;

    case '=':
      upperDisplay.textContent = lowerDisplay.textContent;
      lowerDisplay.textContent = number2; 
      calculationDone = true;
      decimalUsed = false;
      break;
  }
}

// "Special" calculations and updating the displays
function calculateSpecial(number, operator){
  switch (operator) {
    case '√':
      // prevent sqrt from negative numbers
      if (number < 0) {
        upperDisplay.textContent = 'Calculation Invalid';
        lowerDisplay.textContent = 'Reseting';
        calculationDone = true;
        setTimeout(function () {
          resetAll();
        }, 2000)
      } else {
        upperDisplay.textContent += lowerDisplay.textContent;
        lowerDisplay.textContent = Math.sqrt(number);
        calculationDone = true;
        decimalUsed = false;
      }
      break;
    case '∛':
      upperDisplay.textContent += lowerDisplay.textContent;
      lowerDisplay.textContent = Math.cbrt(number);
      calculationDone = true;
      decimalUsed = false;
      break;
    case '!':
      // only use integers for factorial
      if (number % 1 === 0) {
        upperDisplay.textContent += lowerDisplay.textContent;
        lowerDisplay.textContent = factorial(number);
        calculationDone = true;
      } else {
        upperDisplay.textContent = 'Calculation Invalid';
        lowerDisplay.textContent = 'Reseting';
        calculationDone = true;
        setTimeout(function () {
          resetAll();
        }, 2000)
      }
      break;
    default:
      return;
  }
  operatorValue = operator;
}

// Assign numbers to the display
function assignNumber(number) {
  // If calculation is done, reset the display and all parameters
  if(calculationDone) {
    resetAll();
  }
  const valueDisplay = lowerDisplay.textContent;
  if (valueDisplay === '0') {
    lowerDisplay.textContent = number;
  } 
  else {
    lowerDisplay.textContent = valueDisplay + number;
  }
}

// Manage operators and displays
function handleOperator(operator) {
  const currentNumber = Number(lowerDisplay.textContent);
  if (lowerDisplay.textContent === '') {
    //  change to new operator
    if (operatorValue !== operator && firstNumber) {
      // check if its not '='
      if (operator !== '=') {
        const newValue = upperDisplay.textContent.slice(0, -1);
        upperDisplay.textContent = newValue + operator;
        operatorValue = operator;
      } 
      // If it is '=' then just return
      else {
        return;
      }
      
    }
  } 
  // If conditions apply update display with correct operator
    else if (!operatorValue && operator !== '=') {
    operatorValue = operator;
    decimalUsed = false;
    lowerDisplay.textContent += operatorValue;
    upperDisplay.textContent = lowerDisplay.textContent;
    lowerDisplay.textContent = '';
  } 
  
  // Prepare displays after using special operators from different function
  if (operatorValue === '√' || operatorValue === '∛' || operatorValue === '!') {
    if (operator !== '=') {
      firstNumber = Number(lowerDisplay.textContent);
      upperDisplay.textContent = firstNumber;
      upperDisplay.textContent += operator;
      lowerDisplay.textContent = '';
      calculationDone = false;
      operatorValue = operator;
    }
  }

  // If there is no first number set, do so
  if (!firstNumber) {
    firstNumber = currentNumber;
    return;
  } 
    // Set result as first number for continous calculations
    else {
      if (operatorValue === '=' && operator !== '=') {
        firstNumber = Number(lowerDisplay.textContent);
        upperDisplay.textContent = firstNumber;
        upperDisplay.textContent += operator;
        lowerDisplay.textContent = '';
        calculationDone = false;
    } 
    // Don't do anything if user is spamming '='
    else if (operatorValue === '=' && operator === '=') {
        return;
    } else if (operatorValue !== '=' && operator !== '=') {
        return;
    } 
    else {
      calculate(firstNumber, currentNumber, operatorValue);
    }
  }
  operatorValue = operator;
  decimalUsed = false;
}

// Manage special operators and display 
function specialOperator (operator) {
  // Don't do anything if there is no valid number
  if (lowerDisplay.textContent === '') {
    return;
  }
  // Change sign + or -
  else if (operator === '+/-') {
    let currentValue = Number(lowerDisplay.textContent);
    if(lowerDisplay.textContent.includes('.')) {
      decimalUsed = true;
    } 
    if(currentValue === 0) {
      return;
    } else {
      currentValue = -currentValue;
      lowerDisplay.textContent = currentValue;
      if(lowerDisplay.textContent.includes('.')) {
        decimalUsed = true;
      } else {
        decimalUsed = false;
      }
    } 
      
  } 
  // If operator isn't "special" don't do anything because
  // regular operators require 2 valus, special ones only 1
  else if (operatorValue === '+' || operatorValue === '-' || operatorValue === '*' 
        || operatorValue === '/' || operatorValue === '^') {
    return;
  } 
  // Do calculations and update the displays
    else {
      const currentNumber = Number(lowerDisplay.textContent);
      upperDisplay.textContent = operator;
      upperDisplay.textContent += lowerDisplay.textContent;
      lowerDisplay.textContent = '';
      calculateSpecial(currentNumber, operator);
    }
}

// Add decimal
function decimalPoint(decimal) {
  // If display is empty, don't do anything
  if (lowerDisplay.textContent === '') {
    return;
  } else if (!decimalUsed && !calculationDone){
    lowerDisplay.textContent += decimal;
    decimalUsed = true;
  }
}

// Calculate factorial
function factorial(number) {
  if (number < 0) {
    return -1;
  } else if (number === 0) {
    return 1;
  } else {
    return (number * factorial(number - 1));
  }
}

// Clear all values, display and parameters
function resetAll() {
    upperDisplay.textContent = '';
    lowerDisplay.textContent = '';
    firstNumber = 0;
    operatorValue = '';
    calculationDone = false;
    decimalUsed = false;
}

// Add event listeners for specific types of buttons
buttons.forEach((item) => {
  if (item.classList.length === 0) {
    item.addEventListener('click', () => assignNumber(item.value));
  } else if (item.classList.contains('operator')) {
    item.addEventListener('click', () => handleOperator(item.value));
  } else if (item.classList.contains('decimal')) {
    item.addEventListener('click', () => decimalPoint(item.value));
  } else if (item.classList.contains('special')) {
    item.addEventListener('click', () => specialOperator(item.value));
  }
});

// Clear button
clearBtn.addEventListener('click', resetAll);
