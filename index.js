const fs = require('fs');
const express = require('express');
const app = express();

const solutions = fs.readFileSync('words.txt', 'utf8').split('\n').map(word => word.trim());
const words = fs.readFileSync('words.random', 'utf8').split('\n').map(word => word.trim());

function today () {
    return Math.floor(Date.now() / 86400000);
}

function yesterdaysWord () {
    let num = 19054 - today();
    return solutions[solutions.indexOf('nasty') + num];
}

app.use((req, res, next) => {
    req.yesterday = req.query.yesterday || yesterdaysWord();
    req.today = undefined;
    if (solutions.includes(req.yesterday)) {
        const index = solutions.indexOf(req.yesterday);
        req.today = solutions[index + 1];
    }
    next();
});

app.get('/', (req, res) => {
    res.type('text/plain');
    res.send(`Wordle Helper API
GET /hint   | Get a good starting word for today that will make your friends think you're lucky  
GET /help   | Get words in order for people that really need help
GET /answer | Get the answer if you're really that bad

For all routes, you can pass yesterdays word with ?yesterday=<word>, otherwise responses will be given in the timezone of the server
`)
});

app.get('/hint', (req, res) => {
    res.type('text/plain');
    if (!req.today) return res.status(500).send('Unable to determine todays word');
    res.send(findBestWords(req.today, [req.today])[Math.floor(Math.random() * 9.9)]);
});

app.get('/hints', (req, res) => {
    res.type('text/plain');
    if (!req.today) return res.status(400).send('Unable to determine todays word');
    res.send(findBestWords(req.today, [req.today], 10).join('\n'));
});

app.get('/help', (req, res) => {
    res.type('text/plain');
    if (!req.today) return res.status(400).send('Unable to determine todays word');
    res.send(findSteps(req.today, [req.today]).join('\n').replace(req.today, 'ANSWER'));
});

app.get('/answer', (req, res) => {
    if (!req.today) return res.status(400).send('Unable to determine todays word');
    res.send(req.today);
});

app.listen(8080, () => console.log('Ready on *:8080'));

function getLettersOff (test1, test2) {
    let rawApart = test1.length - test1.split('').map((letter, i) => {
        if (letter != test2[i]) return false;
        return true;
    }).filter(a => a).length;
    if (rawApart == 1) {
        if (test1[0] == test2[1] && test1[1] == test2[0] && test1[0] !== test2[0]) rawApart += 0.5;
        if (test1[1] == test2[2] && test1[2] == test2[1] && test1[1] !== test2[1]) rawApart += 0.5;
        if (test1[2] == test2[3] && test1[3] == test2[2] && test1[2] !== test2[2]) rawApart += 0.5;
        if (test1[3] == test2[4] && test1[4] == test2[3] && test1[3] !== test2[3]) rawApart += 0.5;
    }
    return rawApart;
}

function findStartingWord (today, exclude = []) {
    for (const word of words) {
        let lettersOff = getLettersOff(word, today);
        if (lettersOff <= 1 && lettersOff > 0 && !exclude.includes(word)) return word;
    }
    for (const word of words) {
        let lettersOff = getLettersOff(word, today);
        if (lettersOff <= 2 && lettersOff > 0 && !exclude.includes(word)) return word;
    }
    for (const word of words) {
        let lettersOff = getLettersOff(word, today);
        if (lettersOff <= 3 && lettersOff > 0 && !exclude.includes(word)) return word;
    }
    for (const word of words) {
        let lettersOff = getLettersOff(word, today);
        if (lettersOff <= 4 && lettersOff > 0 && !exclude.includes(word)) return word;
    }
    for (const word of words) {
        let lettersOff = getLettersOff(word, today);
        if (lettersOff <= 5 && lettersOff > 0) return word;
    }
    return undefined;
}

function findBestWords (today, exclude = [], number = 10) {
    let best = [];
    for (const word of words) {
        let lettersOff = getLettersOff(word, today);
        if (lettersOff <= 1 && lettersOff > 0 && !exclude.includes(word)) best.push(word);
    }
    for (const word of words) {
        let lettersOff = getLettersOff(word, today);
        if (lettersOff <= 2 && lettersOff > 0 && !exclude.includes(word)) best.push(word);
    }
    for (const word of words) {
        let lettersOff = getLettersOff(word, today);
        if (lettersOff <= 3 && lettersOff > 0 && !exclude.includes(word)) best.push(word);
    }
    for (const word of words) {
        let lettersOff = getLettersOff(word, today);
        if (lettersOff <= 4 && lettersOff > 0 && !exclude.includes(word)) best.push(word);
    }
    for (const word of words) {
        let lettersOff = getLettersOff(word, today);
        if (lettersOff <= 5 && lettersOff > 0) best.push(word);
    }
    best.push(words[0], words[1], words[2], words[3]);
    return best.slice(0, 10);
}

function findSteps (word) {
    let steps = [word];
    steps.unshift(findStartingWord(word, steps));
    steps.unshift(findStartingWord(word, steps));
    steps.unshift(findStartingWord(word, steps));
    steps.unshift(findStartingWord(word, steps));
    return steps;
}
