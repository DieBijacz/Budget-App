class UI {
  constructor() {
    this.budgetFeedback = document.querySelector(".budget-feedback");
    this.expenseFeedback = document.querySelector(".expense-feedback");
    this.budgetForm = document.getElementById("budget-form");
    this.budgetInput = document.getElementById("budget-input");
    this.budgetAmount = document.getElementById("budget-amount");
    this.expenseAmount = document.getElementById("expense-amount");
    this.balance = document.getElementById("balance");
    this.balanceAmount = document.getElementById("balance-amount");
    this.expenseForm = document.getElementById("expense-form");
    this.expenseInput = document.getElementById("expense-input");
    this.amountInput = document.getElementById("amount-input");
    this.expenseList = document.getElementById("expense-list");
    this.itemList = [];
    this.itemID = 0;
  }

  //SUBMIT BUDGET
  submitBudgetForm() {
    const value = this.budgetInput.value

    //validate
    if(value === "" || value < 0){
      this.budgetFeedback.classList.add('showItem')
      this.budgetFeedback.innerHTML = `<p>value cannot be empty or negative</p>`

      //timeout
      const self = this
      setTimeout(function(){
        self.budgetFeedback.classList.remove('showItem')
      }, 2000)

      //if valid:
    } else {
      //passes budget value
      this.budgetAmount.textContent = value 

      //clears fields
      this.budgetInput.value = "" 

      this.showBalance()
    }
  }
  //SUBMIT EXPENSE 
  submitExpenseForm() {
    const expenseValue = this.expenseInput.value //name of expense
    const amountValue = this.amountInput.value //value of expense

    //validate
    if(expenseValue === "" || amountValue === 0 || amountValue < 0){
      this.expenseFeedback.classList.add('showItem')
      this.expenseFeedback.innerHTML = `<p>value cannot be empty or negative</p>`

     //timeout
     const self = this
     setTimeout(function(){
       self.expenseFeedback.classList.remove('showItem')
     }, 2000)

      //IF VALID:
    } else {
      let amount = parseInt(amountValue)

      //clears expenses fields
      this.expenseInput.value = ""
      this.amountInput.value = ""

      // base for expense object
      let expense = {
        id: this.itemID,
        title: expenseValue,
        amount: amount
      }
      // increase ID so every next will be diffrent
      this.itemID++

      //add expenase object to list
      this.itemList.push(expense)

      //add expense to expenses
      this.addExpense(expense)   
      
      this.showBalance()
    }
  }

  //ADD EXPENSE TO LIST
  addExpense(expense) {
    //create div with class 'expense' and add HTML to it based on expense objcet
    const div = document.createElement('div')
    div.classList.add('expense')
    div.innerHTML = `
    <div class="expense-item d-flex justify-content-between align-items-baseline">

         <h6 class="expense-title mb-0 text-uppercase list-item">${expense.title}</h6>
         <h5 class="expense-amount mb-0 list-item">${expense.amount}</h5>

         <div class="expense-icons list-item">

          <a href="#" class="edit-icon mx-2" data-id="${expense.id}">
           <i class="fas fa-edit"></i>
          </a>
          <a href="#" class="delete-icon" data-id="${expense.id}">
           <i class="fas fa-trash"></i>
          </a>
         </div>
        </div>
    `
    this.expenseList.appendChild(div)
  }

  //SHOW BALANCE
  showBalance() {
    const expenses = this.totalExpense()
    const total = parseInt(this.budgetAmount.textContent) - expenses
    this.balanceAmount.textContent = total

    //changes the colors of balance depending on total value
    if (total < 0){
      this.balance.classList.remove('showGreen', "showBlack")
      this.balance.classList.add('showRed')
    }
    else if (total > 0){
      this.balance.classList.remove('showRed', "showBlack")
      this.balance.classList.add('showGreen')
    } else {
      this.balance.classList.remove('showRed', "showGreen")
      this.balance.classList.add('showBlack')
    }
  }

  //TOTAL EXPENSE
  totalExpense(){
    let total = 0
    // if there are any elements in array
    if (this.itemList.length > 0){
      //run reduce function (accumulate, current)
      total = this.itemList.reduce(function(acc, curr){
        // console.log(`total is ${acc} and current value is ${curr.amount}`);
        //that will add to acc every current value of amount based on expense object
        acc += curr.amount
        //return acc as total
        return acc

      },0)      
    } 
    this.expenseAmount.textContent = total
    return total  
  }

  //EDIT EXPENSE
  editExpense(element) {
    let id = parseInt(element.dataset.id)
    //get to div with class of expense
    let row = element.parentElement.parentElement.parentElement

    //remove from DOM
    this.expenseList.removeChild(row)

    //filter out item from itemList
    let expense = this.itemList.filter(function(item){
      //filter return new array with item and I check if ID's matches
      return item.id === id
    })
    //show values
    this.expenseInput.value = expense[0].title
    this.amountInput.value = expense[0].amount
    //rest items with diffrent id
    let tempList = this.itemList.filter(function(item){
      return item.id !== id
    })
    //sets new list(without filtered item) as a itemList
    this.itemList = tempList
    this.showBalance()
  }

  //DELETE EXPENSE
  deleteExpense(element) {
    let id = parseInt(element.dataset.id)
    let row = element.parentElement.parentElement.parentElement

    this.expenseList.removeChild(row)
    let tempList = this.itemList.filter(function(item){
      return item.id !== id    
    })
    this.itemList = tempList
    this.showBalance()
  }
}

// LISTENERS
function eventListeners() {
  const budgetForm = document.querySelector('#budget-form')
  const expenseForm = document.querySelector('#expense-form')
  const expenseList = document.querySelector('#expense-list')

  //new instance of UI class
  const ui = new UI()
  
  //budget form submit
  budgetForm.addEventListener('submit', function(e) {
    e.preventDefault()
    ui.submitBudgetForm()
  
  })
  //expense form submit
  expenseForm.addEventListener('submit', function(e) {
    e.preventDefault()
    ui.submitExpenseForm()
  })
  //expense-list form submit
  expenseList.addEventListener('click', function(e) {
    // console.log(e.target.parentElement);
    if (e.target.parentElement.classList.contains('edit-icon')){
      //pass parentElement as this is <a
      ui.editExpense(e.target.parentElement)
    } else if (e.target.parentElement.classList.contains('delete-icon')){
      ui.deleteExpense(e.target.parentElement)
    }
  })
}







document.addEventListener('DOMContentLoaded', function() {
  eventListeners()
})