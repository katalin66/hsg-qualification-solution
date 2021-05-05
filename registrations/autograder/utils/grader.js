const AutograderError = require('./AutograderError');

module.exports = {
  gradeIt(testCase) {
    let { title, score, test } = testCase;

    if (!title) {
      throw new AutograderError('The test case must have a title');
    }

    score = score || 1;
    title = `${title} [${score}p]`;

    it(title, test);
  },

  getTestCase(title) {
    let score = 1;
    let result = /(.+) \[(.+)p]/g.exec(title);

    if (result) {
      title = result[1];
      score = Number(result[2]);
    }

    return {
      title,
      score
    };
  }
}
