const nextButtons = document.querySelectorAll('.next-button');
const backButtons =  document.querySelectorAll('.back-button');
const formSteps = document.querySelectorAll('.form-step');
const plans = document.querySelectorAll('.plan');
const addOns = document.querySelectorAll('.add-on');
const changeButton = document.querySelector('.change-button')
const planPeriod = document.querySelector('.plan-period')
const inputs = document.querySelectorAll('.form-input')


/* creating an array to store the users choices with a default plan choice */
let userData = [{'planName': 'Arcade','planPrice':'$9/mo','planPeriod':'Monthly'}];


/* making the steps style work for all screens since i used a different container for mobile steps */
let numberSteps;
if (window.innerWidth >= 700) {
  numberSteps = Array.from(document.querySelector('.steps').querySelectorAll('.step'))
}else{
  numberSteps = Array.from(document.querySelectorAll('.step'))
}

/* declaring the current step at 0 */
let currentStep = 0;
/* next step button */
nextButtons.forEach((button) => {

    button.addEventListener('click', () => {
      if (currentStep < formSteps.length - 1) {
        /* Strat of Step 1 */
        if(currentStep === 0){
            
            let hasEmptyInput = false; // a flag to check if any input is empty
  
            inputs.forEach((input) => {
              /* checks if theres no input or if phone number input is not a number */
              if (!input.value || (input.getAttribute('data-type') === 'phone' && isNaN(input.value))) {
                /* if the input is not a number for the phone num input it removes the empty message and displays the enter a phone num message */
                if(input.getAttribute('data-type') === 'phone' && isNaN(input.value)){

                  document.querySelector(`.js-input-${input.getAttribute('data-type')}`).style.display = 'none';
                  document.querySelector(`.js-form-input-${input.getAttribute('data-type')}-required`).style.border = '1px solid  hsl(354, 84%, 57%)';
                  document.querySelector(`.js-input-${input.getAttribute('data-type')}-required`).style.display = 'block';

                  hasEmptyInput = true;

                }else{
                  document.querySelector(`.js-input-${input.getAttribute('data-type')}`).style.display = 'block';
                  document.querySelector(`.js-form-input-${input.getAttribute('data-type')}`).style.border = '1px solid  hsl(354, 84%, 57%)';

                  hasEmptyInput = true; // Set the flag to true if any input is empty
                }
                
              }
              else{
                
                  document.querySelector(`.js-input-${input.getAttribute('data-type')}`).style.display = 'none';
                  document.querySelector(`.js-form-input-${input.getAttribute('data-type')}`).style.border = '1px solid  hsl(229, 24%, 87%)';

                /* removes the alert of invalid phone num */
                if(input.getAttribute('data-type') === 'phone'){
                  document.querySelector(`.js-input-${input.getAttribute('data-type')}-required`).style.display = 'none';
                }
              }
            });
      
            if (!hasEmptyInput) {
              formSteps[currentStep].style.display = 'none';
              currentStep++;
              formSteps[currentStep].style.display = 'block';
              button.disabled = hasEmptyInput;

              /* styling the numbers of steps */
              numberSteps[currentStep].querySelector('h4').classList.add('current-step')
              numberSteps[currentStep - 1 ].querySelector('h4').classList.remove('current-step')

            }
        }
        /* End of Step 1 */

        else{
            
            formSteps[currentStep].style.display = 'none';
            currentStep++;

            // if its last step make it flex instead of block because thats how i styled it at first 
            if(currentStep === 4){
              formSteps[currentStep].style.display = 'flex';
            }else{
              formSteps[currentStep].style.display = 'block';
            }
            
            /* stop after the 4 steps (current step starts from 0) */
            if(currentStep <= 3){
              numberSteps[currentStep].querySelector('h4').classList.add('current-step')

              numberSteps[currentStep - 1 ].querySelector('h4').classList.remove('current-step')
            }
        }
        
      }
      showPlan()
    });
});


/* Plans Step (2) */
/* Choosing Plans */
plans.forEach((plan)=>{
    plan.addEventListener('click',()=>{
        
        plans.forEach((otherPlans)=>{
          otherPlans.classList.remove('plan-checked')
        })
        if(!planPeriod.checked){
          userData[0]['planName'] = plan.querySelector('h4').textContent
          userData[0]['planPrice'] = plan.querySelector('.month-plan').textContent
          userData[0]['planPeriod'] = 'Monthly'
          plan.classList.add('plan-checked')
        }
        else{
          userData[0]['planName'] = plan.querySelector('h4').textContent
          userData[0]['planPrice'] = plan.querySelector('.year-plan').textContent
          userData[0]['planPeriod'] = 'Yearly'
          plan.classList.add('plan-checked')
        }
    })
})

/* a flag condition to stop checking after only one time */
let existsHappened = false
/* Plan Switch */
planPeriod.addEventListener('click', ()=>{
  
  if(planPeriod.checked){
    existsHappened = false
    
    plans.forEach((plan)=>{
      plan.querySelector('.year-plan').style.display = 'block';
      plan.querySelector('.year-plan-months-free').style.visibility = 'visible';
      plan.querySelector('.month-plan').style.display = 'none';
      
      /* Switch the stored plan data */
      if(plan.classList.contains('plan-checked')){
          userData[0]['planName'] = plan.querySelector('h4').textContent
          userData[0]['planPrice'] = plan.querySelector('.year-plan').textContent
          userData[0]['planPeriod'] = 'Yearly'
      }
    })

    /* showing the yearly options for the add ons */
    addOns.forEach((addOn)=>{
      addOn.querySelector('.year-plan').style.display = 'block';
      addOn.querySelector('.month-plan').style.display = 'none';

      const index = userData.findIndex((data) => data.addOnName === addOn.querySelector('h4').textContent);

      const exists = userData.find((data)=> data.addOnPrice === addOn.querySelector('.month-plan').textContent)

      if(exists && !existsHappened){
        addOnsCost = 0
        existsHappened = true
      }
      if(exists){
        addOnsCost += parseInt(addOn.querySelector('.year-plan').textContent.match(/\+?\d+/), 10);
      }
      
      /* changing the option to yearly if the switch is switched back to month*/
      if(addOn.classList.contains('plan-checked')){
        userData[index]['addOnName'] = addOn.querySelector('h4').textContent;

        userData[index]['addOnPrice'] = addOn.querySelector('.year-plan').textContent
      }
    })

    showAddOns()
    
  }else{
    existsHappened = false

    plans.forEach((plan)=>{

      plan.querySelector('.year-plan').style.display = 'none';
      plan.querySelector('.year-plan-months-free').style.visibility = 'hidden';
      plan.querySelector('.month-plan').style.display = 'block';
      
      /* Switch the stored plan data */
      if(plan.classList.contains('plan-checked')){
        userData[0]['planName'] = plan.querySelector('h4').textContent
        userData[0]['planPrice'] = plan.querySelector('.month-plan').textContent
        userData[0]['planPeriod'] = 'Monthly'
    }
    })

    /* showing the monthly options for the add ons */
    addOns.forEach((addOn)=>{
      addOn.querySelector('.year-plan').style.display = 'none';
      addOn.querySelector('.month-plan').style.display = 'block';

      const index = userData.findIndex((data) => data.addOnName === addOn.querySelector('h4').textContent);


      const exists = userData.find((data)=> data.addOnPrice === addOn.querySelector('.year-plan').textContent)

      if(exists && !existsHappened){
        addOnsCost = 0
        existsHappened = true
      }
      if(exists){
        addOnsCost += parseInt(addOn.querySelector('.month-plan').textContent.match(/\+?\d+/), 10);
      }

      /* changing the option to monthly if the switch is switched back to month*/
      if(addOn.classList.contains('plan-checked')){

        userData[index]['addOnName'] = addOn.querySelector('h4').textContent;
        userData[index]['addOnPrice'] = addOn.querySelector('.month-plan').textContent
        
        userData[index]['addOnPrice'] = addOn.querySelector('.month-plan').textContent

      }

    })
    calculateTotalCost()
    showAddOns()
  }

});

/* declaring the cost of add-ons with 0 at start */
let addOnsCost = 0;
/* Add-Ons Step (3) */
/* Selecting Add-Ons */
addOns.forEach((addOn)=>{
  addOn.addEventListener('click',()=>{

    const index = userData.findIndex((data) => data.addOnName === addOn.querySelector('h4').textContent);

    if(addOn.querySelector('.add-on-plan').checked){
      addOn.querySelector('.add-on-plan').checked = false
      addOn.classList.remove('plan-checked')
            
      if(index !== -1){
        addOnsCost -= parseInt(userData[index].addOnPrice.match(/\+?\d+/), 10);
        userData.splice(index ,1)
      }
      
    }else{
      addOn.querySelector('.add-on-plan').checked = true
      addOn.classList.add('plan-checked')

      /* check if this add-on was added  */
      const exists = userData.some((data) => data.addOnName === addOn.querySelector('h4').textContent);

      if(!exists){

        if(userData[0].planPeriod === 'Yearly'){
          userData.push({
            'addOnName' : addOn.querySelector('h4').textContent,
            'addOnPrice' : addOn.querySelector('.year-plan').textContent
          })
          addOnsCost += parseInt(addOn.querySelector('.year-plan').textContent.match(/\+?\d+/), 10);
        }
        else{
          userData.push({
            'addOnName' : addOn.querySelector('h4').textContent,
            'addOnPrice' : addOn.querySelector('.month-plan').textContent
          })
          addOnsCost += parseInt(addOn.querySelector('.month-plan').textContent.match(/\+?\d+/), 10);
        }
      }
    }
      showAddOnsWhenChecked(addOn)
      calculateTotalCost()
    })
})


/* shows add-ons when its checked and removes it when unchecked */
function showAddOnsWhenChecked(addOn){
  /* showing the add-ons on the finishing page */
  userData.forEach((data)=>{

    if(data.addOnName === `${addOn.getAttribute('add-on-type')}`){
      
      document.querySelector(`.${addOn.getAttribute('add-on-type').replace(/\s/g, '')}`).innerHTML = `
        <p>${data.addOnName}</p>
        <p>${data.addOnPrice}</p>
        `
    }
    else{
      document.querySelector(`.${addOn.getAttribute('add-on-type').replace(/\s/g, '')}`).innerHTML = ``
    }
  })
}

/* shows add-ons on the finishing page */
function showAddOns(){
  userData.forEach((data)=>{
    addOns.forEach((addOn)=>{
      if(data.addOnName === `${addOn.getAttribute('add-on-type')}`){
      
        document.querySelector(`.${addOn.getAttribute('add-on-type').replace(/\s/g, '')}`).innerHTML = `
          <p>${data.addOnName}</p>
          <p>${data.addOnPrice}</p>
          `

      }
    })
  })
}

/* declaring plan cost with an intial value since theres a plan choosen by default */
let planCost = parseInt(userData[0].planPrice.match(/\d+/), 10)
/* Finishing up */
/* Plan & Plan Price and calculatio of costs*/
function showPlan(){
  document.querySelector('.finishing').querySelector('h4').innerHTML = `${userData[0].planName} (${userData[0].planPeriod})`
  document.querySelector('.finishing').querySelector('p').innerHTML = `${userData[0].planPrice}`
  planCost = parseInt(userData[0].planPrice.match(/\d+/), 10)
  calculateTotalCost()
}

/* Add-Ons */
/* calculates the cost and displays it */
function calculateTotalCost(){
  const totalCost = planCost + addOnsCost;
  const totalText = document.querySelector('.total').querySelector('p')
  const totalNumber = document.querySelector('.total-cost')
  if(userData[0].planPeriod === 'Monthly'){
    const totalCost = planCost + addOnsCost;
    totalNumber.innerHTML = `$${totalCost}/mo`
    totalText.innerHTML = `Total (per month)`
  }else{
    const totalCost = planCost + addOnsCost;
    totalNumber.innerHTML = `$${totalCost}/yr`
    totalText.innerHTML = `Total (per year)`
  }
}


/* a change button on the finishing page to get back to the plan page when clicked */
changeButton.addEventListener('click', ()=>{
  formSteps[currentStep].style.display = 'none';
  currentStep = 1;
  formSteps[currentStep].style.display = 'block';
})

/* Go back button */
backButtons.forEach((button) => {
    button.addEventListener('click', () => {
      if (currentStep < formSteps.length + 1) {
  
        formSteps[currentStep].style.display = 'none';

        numberSteps[currentStep].querySelector('h4').classList.remove('current-step')

        currentStep--;

        formSteps[currentStep].style.display = 'block';

        numberSteps[currentStep].querySelector('h4').classList.add('current-step')
      
      }
      showPlan()
    });
  });