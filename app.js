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
        let multiplyCoefficient;
        let multiplyExponent;
        let multiplyequation = "";
        let exponent = newparts.length === 2 ? parseFloat(newparts[1].replace(/[^\d.-]/g, '')) : 1;
        let derivative = "";
        coefficientArray.push(coefficient);
        exponentArray.push(exponent);

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
          if(operator === "*"){   
            operator = "";
            derivative = '';
            multiplycoefficientArray.push(coefficient);
            multiplyexponentArray.push(exponent);
            let index = coefficientArray.indexOf(multiplycoefficientArray[0]);
            if(!multiplycoefficientArray.includes(coefficientArray[index-1], 0)){
              multiplyexponentArray.push(exponentArray[index - 1]);
              multiplycoefficientArray.push(coefficientArray[index - 1]);
            }
            multiplyExponent = multiplyexponentArray.reduce((a,b) => a+b, 0);
            multiplyCoefficient = multiplycoefficientArray.reduce((a, b) => a*b, 1);
            multiplyCoefficient *= multiplyExponent;
            multiplyExponent -= 1;
            multiplyequation += multiplyCoefficient + "x" + "<sup>" + multiplyExponent + "</sup>";
            result = multiplyequation + " " + operator + " " + derivative;
          } 
          else{
            if((exponent - 1) !== 0){
              result += operator + " " + derivative + " ";
            }
            else{
              result += operator + " " + coefficient + " ";
            }
          }
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


      
      if(denominatorCoefficient === 0){
        result += lastOperator + undefined;
      }
      else if(newExponent === 0){
        result += lastOperator + " 0 ";
      }
      else if((newExponent - 1) === 0){
        result += "1";
      }
      else if(denominatorCoefficient === 1 && newExponent > 0){
        console.log("de");
        result += lastOperator + " " + "(" + newnumeratorCoefficient + "x" + "<sup>" + (newExponent - 1) + "</sup>" + ") ";
      }
      else if((newExponent - 1) === 1){
        console.log("fir")
        result += lastOperator + " " + "(" + newnumeratorCoefficient + "x" + "/" + denominatorCoefficient + ")" + " ";
      }
      else if(newExponent < 0){
        console.log('sec');
        result += lastOperator + " " + "(" + newnumeratorCoefficient + "/" + denominatorCoefficient + "x" + "<sup>" + (-newExponent + 1) + "</sup>" + ")" + " ";
      }
      else if(newExponent > 0){
      
        console.log('third');
        result += lastOperator + " " + "(" + newnumeratorCoefficient + "x" + "<sup>" + (newExponent - 1) + "</sup>" +  "/" + denominatorCoefficient + ")" + " ";
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


