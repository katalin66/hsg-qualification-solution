const faker = require("faker");

module.exports = {
    randomInt(min, max) {
        return faker.random.number({min, max});
    },
    randomOddInt(min, max) {
        let randomNumber = faker.random.number({min, max});
        if (randomNumber % 2 === 0) {
            randomNumber++;
        }
        return randomNumber;
    },
    randomCharacter() {
        const characters = 'aábcdeéfghiíjklmnoóöőpqrstuúüűvwxyzAÁBCDEÉFGHIÍJKLMNOÓÖŐPQRSTUÚÜŰVWXYZ';
        return characters.charAt(Math.floor(Math.random() * characters.length));
    },
    randomString(minLength, maxLength) {
        const length = this.randomInt(minLength, maxLength);
        return new Array(length).fill(null).reduce((result) => result += this.randomCharacter(), '');
    },
    randomIntArray(n, min, max) {
        let result = [];
        for (let i = 0; i < n; i++) {
            result.push(faker.random.number({min, max}));
        }
        return result;
    },
    randomIntSquareMatrix(nMin, nMax, valueMin, valueMax) {
        const result = [];
        const n = this.randomInt(nMin, nMax);
        for (let i = 0; i < n; i++) {
            result.push(this.randomIntArray(n, valueMin, valueMax));
        }
        return result;
    },
    randomLoremSentence(wordCount) {
        return faker.lorem.sentence(wordCount);
    },
    randomLowerCaseLoremSentence(wordCount) {
        return faker.lorem.sentence(wordCount).toLowerCase();
    },
    randomLoremParagraph(sentenceCount) {
        return faker.lorem.paragraph(sentenceCount);
    },
    randomLowerCaseLoremParagraph(sentenceCount) {
        return faker.lorem.paragraph(sentenceCount).toLowerCase();
    }
}