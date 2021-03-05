
/**
 * Гра "Бики та корови" на javascript
 * (Гравець проти комп'ютера)
 *
 * Правила гри:
 *
 * Багато хто грав у логічну гру "Бики та корови". Опишемо коротко правила деякої аналогічної гри. 
 * Один гравець загадує деяке шестизначне число (без лідируючих нулів), усі цифри якого різні. 
 * Щоб відгадати його, другий гравець називає інші довільні шестизначні числа (без лідируючих нулів)
 * і у відповідь отримує два числа - скільки цифр опинились на тих же місцях (кількість биків) і 
 * скільки присутні у числі, але стоять на інших позиціях (кількість корів). Наприклад, якщо загадано 
 * 123456, і другий гравець називає 112233, то у відповідь він отримує "1 бик і 2 корови"  (перша одиниця
 * на своєму місці, друга одиниця була б "коровою", лише якби не було першої, одна 2 і одна 3 є у числі,
 * але не на своїх місцях).Потрібно по заданій історії гри (названі гравцями числа та відповіді) визначити, 
 * чи можна вже однозначно визначити загадане число.
 *  
 */

'use strict';

const ps = require("prompt-sync");
const prompt = ps();

class Game {
    constructor() {
        Game.isFinished = false;
        Game.player = new Player(true);
        Game.computer = new Player(false);
    }

    /**
     * Встановлює кількість корів і биків для поточного гравця
     *
     * @param estimatedNum {number} передбачуване число на поточному ходу
     * @param isRealPlayer {boolean} true - гравець, false - комп'ютер
     * @return {undefined}
     */
    static setCowsAndBulls(estimatedNum, isRealPlayer) {
        let one = estimatedNum + '';
        let two = isRealPlayer ? Game.player.num + '' : Game.computer.num + '';
        let bulls = 0;
        let cows = 0;

        if (isRealPlayer) {
            Game.computer.statistics.push(estimatedNum);
        } else {
            Game.player.statistics.push(estimatedNum);
        }

        for (let i = 0; i < one.length; i++) {
            for (let j = 0; j < two.length; j++) {
                if (i === j && one[i] === two[j]) {
                    bulls++;
                    if (isRealPlayer) {
                        Game.player.estimatedNum[i] = +two[j];
                    }
                } else if(i !== j && one[i] === two[j]) {
                    cows++;
                }
            }
        }

        if (isRealPlayer) {
            Game.computer.bulls.push(bulls);
            Game.computer.cows.push(cows);
        } else {
            Game.player.bulls.push(bulls);
            Game.player.cows.push(cows);
        }
    }

    /**
     * 
     * Скидання параметрів гри
     * Починає гру спочатку, якщо гравець погодиться
     *
     * @return {undefined}
     */
    reset() {
        Game.player.num = Game.computer.num = 0;
        Game.player.bulls = Game.computer.bulls = [];
        Game.player.cows = Game.computer.cows = [];
        Game.player.estimatedNum =
            Game.computer.estimatedNum = [null, null, null, null];
        Game.player.statistics.length = Game.computer.statistics.length = 0;
        Game.ifFinished = false;

        console.log('Игра окончена!');
        let conf = prompt('Хотите сыграть еще раз? Y/N');
        if (conf == 'y' || conf =='Y') {
            this.start();
        }
    }

    /**
     * Початок гри
     * Гравець і комп'ютер загадують число
     *
     * @return {undefined}
     */
    start() {
        console.log('\n\n-----------------------------------------\n|Ласкаво просимо в гру "Бики і корови"|\n-----------------------------------------');

        Game.player.num = Game.player.getNumber();
        Game.computer.num = Utils.generateRandomNumber(0, 9, 4);

        // Висновок загаданих чисел (для налагодження)
        // alert ( `
        // Гравець загадав число $ {Game.player.num}
        // Комп'ютер загадав число $ {Game.computer.num}
        // `);

        console.log('=======================================\n\nГравець і компьютер загадали числа гра починається');

        while (!Game.ifFinished) {
            if ( !Game.player.turn() ) break;
            if ( !Game.computer.turn() ) break;
        }

        this.reset();
    }

}

/**
 * Класс игрока
 */

class Player {
    constructor(isRealPlayer) {
        this.isRealPlayer = isRealPlayer;
        this.num = 0;
        this.estimatedNum = [null, null, null, null];
        this.cows = [];
        this.bulls = [];
        this.statistics = [];
    }

    /**
     * 
     * 
     * Хід гравця або комп'ютера
     *
     * @return {boolean} true - гра триває, false - гра закінчена
     */
    turn() {
        let estimatedNum = this.isRealPlayer
            ? this.getNumber()
            : Utils.generateRandomNumber(0, 9, 4);

        let num = +Utils.getEstimatedNum(Game.computer.estimatedNum);

        let foundedNumber = null;
        let realNum = null;

        if (this.isRealPlayer) {
            foundedNumber = estimatedNum;
            realNum = Game.computer.num;
        } else {
            foundedNumber = Utils.isNumeric(num) ? num : estimatedNum;
            realNum = Game.player.num;
        }

        if (foundedNumber === realNum) {
            let message = this.isRealPlayer
                ? 'Ви перемогли! Компьютер загадав число: '
                : 'Компютер переміг! Ваше число: ';

            console.log(message + foundedNumber);
            Game.isFinished = true;
            return false;
        }

        if (this.isRealPlayer) {
            Game.setCowsAndBulls(estimatedNum, false);
            console.log(`\n\n Чи не вгадали! Тепер ходить компьютер\n\n`);

            return true;
        } else {
            Game.setCowsAndBulls(estimatedNum, true);
            let message = `=======================================\n\nХід компьютера ...\nКомпьютер не вгадав!\n`;

            if (this.statistics.length > 0) {
                message += `\nСтатистика:\n`;
                this.statistics.forEach((item, i) => {
                    message += `  Хід ${i + 1}: ${item}  Биків: ${this.bulls[i]}`;
                    message += `   Корів: ${this.cows[i]}\n`;
                });
            }

            message += `\n\n  Компьютер передбачає число: ${Utils.getEstimatedNum(Game.player.estimatedNum)}`;

            console.log(message);

            return true;
        }
    }

    
    /**
     * Запитує у користувача ввести 4-х значне число з неповторяющихся цифр
     * Виконує перевірки на число, кількість цифр і їх унікальність в числі
     * @return num {number} 4-х значне число з неповторяющихся цифр
     */
    getNumber() {
        let message = `\n=======================================\n\n\nХід гравця ...\nВведіть 4-х значне число з різних цифр\n`,error,numArray,uniqArray;

        if (this.statistics.length > 0) {
            message += `\nСтатистика:\n`;
            this.statistics.forEach((item, i) => {
                message += `  Хід  ${i + 1}: ${item} Биків:  ${this.bulls[i]} Корів: ${this.cows[i]}\n`;
            });
        }

        while(true) {
            numArray = uniqArray =[];

            if (error) {
                console.log(error);
                error = '';
            }

            console.log(message);
            let num = prompt("Input: ");
            


            if (num === null) {
                return Utils.generateRandomNumber(0, 9, 4);
            }
            if (num.length !== 4) {
                error = 'Неправильна кількість цифр, має бути 4. Введіть ще раз!';
                continue;
            }
            if (!Utils.isNumeric(num)) {
                error = 'Один або кілька символів не є числами! Введіть ще раз!';
                continue;
            }

            numArray.push(num.split(''));
            uniqArray = ([...new Set(numArray[0])]);

            if (uniqArray.length !== 4) {
                error = 'Цифри не унікальні. Введіть число з різних цифр!';
                continue;
            }

            break;
        }

        let num = +uniqArray.join('');
        return num;
    }
}

/**
 * Допоміжні обчислення
 */

class Utils {
     /**
     * Генерує випадкове число з len цифр в діапазоні від min до max
     *
     * @param min {number} мінімальне число (початок діапазону)
     * @param max {number} максимальне число (кінець діапазону)
     * @param countDigits {number} кількість цифр в числі
     * @return {number} randomNum
     */
    static generateRandomNumber(min = 0, max = 9, countDigits) {
        let digitsArray = [];

        while (digitsArray.length < countDigits) {
            let digit = this.randomInteger(min, max);

            if (!digitsArray.includes(digit)) {
                digitsArray.push(digit);
            }

            if (digitsArray[0] === 0) {
                digitsArray = [];
            }
        }

        let randomNum = +digitsArray.join('');
        return randomNum;
    }

     /**
     * Генерує рядок передбачуваного комп'ютером числа
     * Цифри, які комп'ютер поки не знає, замінюються на '-'
     * @param estimatedNum {array} масив передбачуваних цифр / символів
     * @example -3-7
     * @return {string}
     */
    static getEstimatedNum(estimatedNum) {
        return estimatedNum.map((num) => {
            return Utils.isNumeric(num) ? num : '-';
        }).join('');
    }

     /**
     * Перевіряє, чи є переданий параметр num числом
     *
     * @param num {number} Перевіряється значення
     * @return {boolean} true, якщо num - число, або false
     */
    static isNumeric(num) {
        return !isNaN(parseFloat(num)) && isFinite(num);
    }

    /**
    
     * Генерує випадкове ціле число в діапазоні від min до max,
     * Включаючи min і max як можливі значення
     *
     * @param min {number} мінімальне число
     * @param max {number} максимальне число
     * @return rand {number} випадкове ціле число
     */
    static randomInteger(min, max) {
        let rand = min - 0.5 + Math.random() * (max - min + 1);
        rand = Math.round(rand);
        return rand;
    }
}


let game = new Game();
game.start();