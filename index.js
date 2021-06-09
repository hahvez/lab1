
'use strict';

const ps = require("prompt-sync");
const prompt = ps();

var endGame = false; 

var getNum = function() {
	var number = [];

	while(number.length < 4) {
		let newNum = Math.floor(Math.random () * 10);
		if (number.indexOf(newNum) < 0){
			number.push(newNum);
		}
	}
	return number;
};

var goal = getNum();//Число компьютера


var guess = function() {
	let playersNumber = prompt("Input: ");
	if (playersNumber.length > 4){
		console.log('Неправильне введення');
		return false
	}
	let arr = [];

	for(let i = 0; i < 4; i++){
		let newUserArrElement = parseInt(playersNumber.substr(i, 1));
		arr.push(newUserArrElement);
	}
	
	check(arr);
};

var check = function(par) {//par - масив чисел, які ми написали
	let bulls = 0;
	let cows = 0;

	for( let i = 0; i< 4; i++) {
		if (par[i] == goal[i]) {
			bulls++;
		} else if(goal.indexOf(par[i]) >= 0) {
			cows++;
		}
	}

	if(bulls == 4) {
		endGame = true;
	}
	console.log(par);
	console.log('Корів:' + cows);
	console.log('Биків: '+ bulls);
};

console.log('Компьютер загадав число...');
while(endGame == false){
	guess();
}

console.log('Вітаю!! Ти вгадав! Загадане число: ' + goal);
