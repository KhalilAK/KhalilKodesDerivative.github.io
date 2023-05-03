const button = document.getElementById("calculate");
const input = document.getElementById("input");
const p = document.querySelectorAll('.p');
const rule = document.querySelector('.rule');
const work = document.getElementById("show-work");

let testNumeratorCoefficient;
let testDenominatorCoefficient;

function isMobile(){
    return /Android|iPhone/i.test(navigator.userAgent);
}

if(isMobile()){
    for(let i = 0; i < p.length; i++){
        p[i].style.fontSize = "35px";
    }
    button.style.fontSize = "35px";
    input.style.fontSize = "35px";
}


function calculate(){
  let inputString = input.value;
  let terms = inputString.split(/[(\)]/);
  let result = "";
  let coefficientArray = [];
  let multiplycoefficientArray = [];
  let multiplyexponentArray = [];
  let exponentArray = [];
  let lastOperator = "";
  let lastOperatorArray = [];
  if(terms[0] == ''){
    terms.splice(0, 1);
  }
  for(let i = 0; i < terms.length; i++){
    if(!terms[i].includes("/")){ // no division
      let term = terms[i].trim();
      let parts = term.split(/(?=[+\-*])/);
      let lastPart = parts[parts.length - 1];
      lastOperator = lastPart.charAt(0);
      lastOperatorArray.push(lastOperator);
      for(let j = 0; j < parts.length; j++){
        let newterm = parts[j].trim();
        let operator = j > 0 ? newterm.charAt(0): "";
        let newparts = newterm.split("^");
        let coefficient = parseFloat(newparts[0].replace(/[^\d.-]/g, ''));
        let exponent = newparts.length === 2 ? parseFloat(newparts[1].replace(/[^\d.-]/g, '')) : 1;
        let derivative = "";
        if(!newterm.includes("x")){
          derivative = "0";
        }
        else if(coefficient === 0){
          continue;
        }
        else{
          if(isNaN(coefficient)){
            coefficient = 1;
          }
          coefficientArray.push(coefficient);
          exponentArray.push(exponent);
          if(coefficient !== coefficientArray[0] && coefficient < 0){
            coefficient = -coefficient;
          }
          if(operator === "" && coefficientArray[0] < 0){
            lastOperator = "";
          }
          let derivativeCoefficient = coefficient * exponent;
          if(operator === ""){
            result += lastOperator;
          }
          derivative += derivativeCoefficient + "x" + "<sup>" + (exponent - 1) + "</sup>";
          result += operator + " " + derivative + " ";
        }
      }
    } 
    else{ //divison
      let divisionterm = terms[i];
      let divisionparts = divisionterm.split("/");
      let numerator = divisionparts[0];
      let denominator = divisionparts[divisionparts.length - 1];
      let numeratorParts = numerator.split("^");
      let denominatorParts = denominator.split("^");
      let numeratorExponent = numeratorParts[numeratorParts.length - 1];
      let denominatorExponent = denominatorParts[denominatorParts.length - 1];
      let numeratorCoefficient = parseFloat(numeratorParts[0]);
      let denominatorCoefficient = parseFloat(denominatorParts[0]);
      let newExponent = numeratorExponent - denominatorExponent;
      let newnumeratorCoefficient = numeratorCoefficient * newExponent;
      for(let j = 0; j < 11; j++){
        if(newnumeratorCoefficient % j === 0 && denominatorCoefficient % j === 0){
          newnumeratorCoefficient /= j;
          denominatorCoefficient /= j
        }
      }
      for(let j = 0; j < 11; j++){
        if(newnumeratorCoefficient % j === 0 && denominatorCoefficient % j === 0){
          newnumeratorCoefficient /= j;
          denominatorCoefficient /= j
        }
      }
      if(numeratorExponent < denominatorExponent && denominatorCoefficient !== 0){
        result += lastOperator + " " + "(" + newnumeratorCoefficient + "/" + denominatorCoefficient + "x" + "<sup>" + (-newExponent + 1) + "</sup>" + ")" + " ";
      }
      else if((newExponent-1) === 0){
        result += lastOperator + " " + "(" + newnumeratorCoefficient + "/" + denominatorCoefficient + ")" + " ";
      }
      else if(denominatorCoefficient === 1 && numeratorExponent > denominatorExponent && newExponent !== 0){

        result += lastOperator + " " + "(" + newnumeratorCoefficient + "x" + "<sup>" + (newExponent - 1) + "</sup>" + ")" + " ";
      }
      else if(newExponent === 0 && denominatorCoefficient !== 0){
        result += lastOperator + " 0 ";
      }
      else if(denominatorCoefficient === 0){

        result += undefined + " "
      }
      else{
       result += lastOperator + " " + "(" + newnumeratorCoefficient + "x" + "<sup>" + (newExponent - 1) + "</sup>" + "/" + denominatorCoefficient + ")" + " ";
      }
    }
    
  }
  if(result.charAt(0) === lastOperatorArray[0]){
    result = result.replace(lastOperatorArray[0], '');
  }
  workSteps(coefficientArray, exponentArray, result);
  document.getElementById("result").innerHTML = result;
}

function workSteps(coefficient, exponent, result){
  let steps = "";
  for(let i = 0; i < coefficient.length; i++){
    steps += (i+1) + ": " + coefficient[i] + "x" + "<sup>" + exponent[i] + "</sup>" + " = " + exponent[i] + " * " + coefficient[i] + "x" + "<sup>" + exponent[i] + " - 1" + "</sup>" + ", ";
  }
  work.innerHTML = steps;
}

function addLiketerms(coefficient, exponent, derivativeCoefficient, derivativeExponent){
  let newExponent;
  let newDerivativeCoefficent;
  for(let i = 0; i < exponent.length - 1; i++){
    for(let j = i+1; j < exponent.length; j++){
      if(exponent[i] === exponent[j]){
        let newCoefficient = coefficient[i] + coefficient[j];
        newDerivativeCoefficent = newCoefficient * exponent[i];
        newExponent = exponent[i] - 1;
      }
    }
  }
  derivativeCoefficient = newDerivativeCoefficent;
  derivativeExponent = newExponent;
}

function changeButtonColor(){
    if(input.value !== ""){
        button.addEventListener('click', calculate);
        button.style.backgroundColor = "lightgreen";
        button.style.left = input.style.left;
        button.style.color = "black";
    }
    else{
        button.style.color = "white";
        button.style.backgroundColor = "red";
        work.innerHTML = "Work Steps (Only Power Rule)";
    }
}
  
  

  
  
  
  
  
  

function moveButton(){
    if(input.value === ""){
        const x = Math.random() * (window.innerWidth - button.offsetWidth);
        const y = button.offsetHeight;
        button.style.left = x + "px";
        button.addEventListener('click', moveButton);
        result.innerHTML = "";
    }

}

moveButton();




function update(){
    requestAnimationFrame(update);
    changeButtonColor();
    
}

update();


