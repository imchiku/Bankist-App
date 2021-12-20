'use strict';

// BANKIST APP

// Data
const account1 = {
  owner: 'Dhiraj Kumar',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Sumit Gupta',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Krishna Prashad Singh',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Amit Devraj',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const displayMovements = function (movements, sort = false) {
  // this will make our HTML empty and add new into this otherwise old data will also presents
  // innerHTML is similar to textContent but textContent return only text while innerHTML retuns whole HTML tags
  containerMovements.innerHTML = '';
  // .textContent = 0;

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const html = `
  <div class="movements__row">
  <div class="movements__type movements__type--${type}">  ${
      i + 1
    } ${type} </div>
  <div class="movements__value">${mov}€</div>
</div>
`;
    // it insert this into movements class , tooks two arg (where to insert , what to insert)
    containerMovements.insertAdjacentHTML('afterbegin', html);
    // containerMovements.insertAdjacentHTML('beforeend', html);
    // containerMovements.insertAdjacentHTML('beforebegin', html);
  });
};
// console.log(containerMovements.innerHTML);
// displayMovements(account1.movements);

// we use reduce method by for displaying total balance of account holder
const calcDisplayBalance = function (accnt) {
  const balance = accnt.movements.reduce((acc, mov) => acc + mov, 0);
  accnt.balance = balance;
  labelBalance.textContent = `${balance} EUR`;
};
// calcDisplayBalance(account1.movements);

// Calculate Summary (income, outcome, interest)
const calcDisplaySummary = function (accnt) {
  const income = accnt.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${income}€`;

  const outcome = accnt.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(outcome)}€`;

  const interest = accnt.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * accnt.interestRate) / 100)
    .filter((intr, i, arr) => {
      console.log(arr);
      return intr >= 1;
    })
    .reduce((acc, cur) => acc + cur, 0);
  labelSumInterest.textContent = `${interest}€`;
};
// calcDisplaySummary(account1.movements);

// for creating username
const createUserAccnts = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUserAccnts(accounts);

// Update UI
const updateUI = function (acc) {
  // Display movements
  displayMovements(acc.movements);

  // Display Balance
  calcDisplayBalance(acc);

  // Display summary
  calcDisplaySummary(acc);
};
// Login page
// Event handler
let currentAccount;
btnLogin.addEventListener('click', function (e) {
  // Prevent form from submitting..
  e.preventDefault();
  // console.log('Login');

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  // console.log(currentAccount);
  // if (currentAccount.pin === Number(inputLoginPin.value)) {
  // firstly check if pin is exist then login
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Display UI and Message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    // clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    //  it will loses focus from login field(cursor omit)
    inputLoginPin.blur();

    // Update UI
    updateUI(currentAccount);
  }
  console.log('Login.....😎');
});

////////////////////////////////////////////////////////////

// for transferring money
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';
  // console.log(amount, receiverAcc);

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);
    // now update in UI
    updateUI(currentAccount);
    // console.log('Transfer Valid');
  }
});

// request for loans
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    // Add the movements here
    currentAccount.movements.push(amount);

    // Update UI
    updateUI(currentAccount);
  }
  // clear input data
  inputLoanAmount.value = '';
});
// for deleting an accounts
btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    // console.log(index);
    // .indexOf(23); is similar to findIndex()

    //Delete accounts
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = '';
});

// for sorting the money
let sorted = true;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, sorted);
  sorted = !sorted;
});
/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////

// Data transformations Methods:{map, filter, reduce}
// 1. map
/*
      it behaves like forEach loop , and take a looping array and after some changes create a totally new brand array
*/

// 2. filter
/*    it filter the data according the condition provideds
      and then return a new array
*/
// 3. Reduce
// reduce all array elements into a single value
// Eg. (adding all the elements of array together)

////////////////////////////////////////////////////////////// Map Method

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// const eurToUsd = 1.1;
// const movementsUSD = movements.map(function (move) {
//   // it directly return a new Array
//   return move * eurToUsd;
// });
// console.log(movements);
// console.log(movementsUSD);

// replace the above method by callback(arrow function) , this is one liner function
// const movementsUSD = movements.map(mov => mov * eurToUsd);
// console.log(movementsUSD);
// here we manually create functions to return new array
// const movementsUSDfor = [];
// for (const mov of movements) movementsUSDfor.push(mov * eurToUsd);
// console.log(movementsUSDfor);

// const movementsDiscription = movements.map((move, i, arr) => {
//   if (move > 0) {
//     return `Movement ${i + 1}: You deposited ${move}`;
//   } else {
//     return `Movement ${i + 1}: You withdraw ${Math.abs(move)}`;
//   }
// });

// we can convert the above method to one liner
// const movementsDiscription = movements.map(
//   (mov, i) =>
//     `Movement ${i + 1}: You ${mov > 0 ? 'deposited' : 'withdrew'} ${Math.abs(
//       mov
//     )}`
// );
// console.log(movementsDiscription);

// /////////////////////////////////////////////////////

/*
//Computing user names by using maps
const user = 'Steven Thomas Williams'; //stw
// for computing first letter of name by iterate username by map

// it returns array of single letters and then we join it
const userName = user
  .toLowerCase()
  .split(' ')
  .map(function (name) {
    return name[0];
  })
  .join('');

// converting it into one liner function
const createFun = function (user) {
  const username = user
    .toLowerCase()
    .split(' ')
    .map(name => name[0])
    .join('');
  return username;
};
console.log(createFun('Steven Thomas Williams'));

// accessing all the accounts
const createUserAccnts = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUserAccnts(accounts);
console.log(accounts);

*/

////////////////////////////////////////////////////////////
// filter function
/*
const deposits = movements.filter(function (mov) {
  return mov > 0;
});
console.log(movements);
console.log(deposits);

// this is how we doing , using for loop (manually createing)
const depositFor = [];
for (const mov of movements) if (mov > 0) depositFor.push(mov);
console.log(depositFor);

const withdrawals = movements.filter(mov => mov < 0);
console.log(withdrawals);

*/

////////////////////////////////////////////////////////////
// Reduce function
// console.log(movements);

// accumulator --> SNOWBALL
// const balance = movements.reduce(function (acc, cur, i, arr) {
//   console.log(`Iteration ${i} :${acc}`);
//   return acc + cur;
// }, 3 /* initial value of accumulator(acc = 3)*/);
// console.log(balance);

// converting it in one liner function
// const balance = movements.reduce((acc, cur) => acc + cur, 15);
// console.log(balance);

// // by for loop
// let balance2 = 0;
// for (const mov of movements) balance2 += mov;
// console.log(balance2);

// // maximum value of movements array
// const maxValue = movements.reduce((acc, cur) => {
//   if (acc > cur) return acc;
//   else return cur;
// }, movements[0]);

// console.log(maxValue);

////////////////////////////////////////////////////////////// The magic of Chaining.......map, filter, reduce...
// const eurToUsd = 1.1;
// const totalDepositsUSD = movements
//   .filter(mov => mov > 0)
//   // .map(mov => mov * eurToUsd)
//   .map((mov, i, arr) => {
//     //it print 5 times same array because total 5 items are +ve
//     // console.log(arr);
//   })
//   .reduce((acc, cur) => acc + cur, 0);
// console.log(totalDepositsUSD);

////////////////////////////////////////////////////////////// find method() -> it returns first elements not an array like map
// const firstWithdrawal = movements.find(mov => mov < 0);
// console.log(movements);
// console.log(firstWithdrawal);

// console.log(accounts);

// const account = accounts.find(acc => acc.owner === 'Jessica Davis');
// console.log(account);

//findIndex() Method ->
// btnClose.addEventListener('click', function (e) {
//   e.preventDefault();

//   if (
//     inputCloseUsername.value === currentAccount.username &&
//     Number(inputClosePin.value) === currentAccount.pin
//   ) {
//     const index = accounts.findIndex(
//       acc => acc.username === currentAccount.username
//     );
//     // console.log(index);
//     // .indexOf(23); is similar to findIndex()

//     //Delete accounts
//     accounts.splice(index, 1);

//     // Hide UI
//     containerApp.style.opacity = 0;
//   }
//   inputCloseUsername.value = inputClosePin.value = '';
// });

////////////////////////////////////////////////////////////// some and every method
// console.log(movements);

//  Equality
// console.log(movements.includes(-130));

// condition
// console.log(movements.some(mov => mov === -130));

// some() method -> return true if conditions satisfy
// const anyDeposits = movements.some(mov => mov > 0);
// console.log(anyDeposits);

// EVERY -> return true , if every elements satisfy the condition
// console.log(movements.every(mov => mov > 0));
// console.log(account4.movements.every(mov => mov > 0));

// Sepetate callback
// const deposit = mov => mov > 0;
// console.log(movements.some(deposit));
// console.log(movements.every(deposit));
// console.log(movements.filter(deposit));

////////////////////////////////////////////////////////////// flat && flatMap() method -> use for flat the nested array

// const arr = [[1, , 2, 3], [4, 5, 6], 7, 8];
// console.log(arr.flat()); // it goes one level deep and flat the array

// const arrDeep = [[[1, 2], 3], [4, [5, 6]], 7, 8];
// console.log(arrDeep.flat()); // it can not flat whole array bcz array nested in level 2, so need to pass level in flat(2)
// console.log(arrDeep.flat(2));

// const accountMovements = accounts.map(acc => acc.movements);
// console.log(accountMovements);

// const allMovements = accountMovements.flat();
// console.log(allMovements);
// const totalBalance = allMovements.reduce((acc, mov) => acc + mov, 0);
// console.log(totalBalance);
// we can wrap up whole code in chaining

// const totalBalance = accounts
//   .map(acc => acc.movements)
//   .flat()
//   .reduce((acc, mov) => acc + mov, 0);
// console.log(totalBalance);

// // flatMap
// const totalBalance2 = accounts
//   .flatMap(acc => acc.movements)
//   .reduce((acc, mov) => acc + mov, 0);
// console.log(totalBalance2);

//---------------------------------------------------
//SORTING ARRAYS

// sort() method -> it changes the actual array
//Strings
// const owners = ['Dhiraj', 'Niraj', 'Abhinav', 'Mohan'];
// console.log(owners.sort());
// console.log(owners);

// Numbers
// console.log(movements);
// it is giving output a/c to string(binary no. like 1300, 12, 200, 3000, 450, 70)
// console.log(movements.sort());

// for fix this we need to pass comparator
// return < 0, A, B(keep order)
// return > 0, B, A(switch order)
// Ascending order
// movements.sort((a, b) => {
//   if (a > b) return 1;
//   if (a < b) return -1;
//   // else return -1;
// });
// or
// movements.sort((a, b) => a - b);
// console.log(movements);

// Descending order
// movements.sort((a, b) => {
//   if (a > b) return -1;
//   if (a < b) return 1;
//   // else return -1;
// });
// movements.sort((a, b) => b - a);
// console.log(movements);

//---------------------------------------------------
// More ways of Creating and Filling Arrays
const arr = [1, 2, 3, 4, 5, 6, 7];
console.log(new Array(1, 2, 3, 4, 5, 6, 7));

//Empety arrays + fill method
const x = new Array(7); // Create a new empty array of size 7
console.log(x);

// map doesn't work in filling the array
console.log(x.map(() => 5));

// fill(value, start, end)->
// x.fill(1); // fill whole array with one

// x.fill(1, 3); // left empty till first 3 , and rest array filled with 1
// x.fill(1, 3, 5); // left empty first 3 and last 2(7-5) and remain filled with 1;
// console.log(x);

// arr.fill(23, 2, 6);
// console.log(arr);

// Array.from() method -> also use to fill array
// const y = Array.from({ length: 7 }, () => 1);
// console.log(y);

// we can replace curr with default parameter(_)
// const z = Array.from({ length: 7 }, (curr, i) => i + 1);
// const z = Array.from({ length: 7 }, (_, i) => i + 1);
// console.log(z);

//----------------------------------------------------
labelBalance.addEventListener('click', function () {
  // const movementsUI = Array.from(
  //   document.querySelectorAll('.movements__value')
  // );
  const movementsUI = Array.from(
    document.querySelectorAll('.movements__value'),
    el => Number(el.textContent.replace('€', ''))
  );
  console.log(movementsUI);
  // console.log(movementsUI.map(el => el.textContent.replace('€', '')));

  const movementsUI2 = [...document.querySelectorAll('.movements__value')];
  console.log(movementsUI2);
});
