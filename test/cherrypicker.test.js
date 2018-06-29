const assert = require("assert");
const path = require("path");
const { getDirs, loadFiles } = require("../src/utils");
const cherrypick = require("../src/cherrypicker");

const lineFeedRegex = new RegExp("\r\n", "g");

describe("Cherrypicker", () => {
  for (const testCase of getDirs(path.resolve(__dirname, "cases"))) {
    it(`should work with the "${testCase}" test case`, async () => {
      const basePath = path.resolve(__dirname, "cases", testCase);
      const inputFiles = await loadFiles([path.resolve(basePath, "input/**")]);
      const outputFiles = await loadFiles([
        path.resolve(basePath, "output/**")
      ]);

      (outputFiles["css"] || []).forEach(outputFile => {
        // noinspection JSUndefinedPropertyAssignment
        outputFile.inputPath = outputFile.path.replace("output", "input");
      });

      const cherrypickedFiles = cherrypick(inputFiles);

      for (const cherrypickedFile of cherrypickedFiles) {
        const actualOutput = cherrypickedFile.output;
        const expectedOutput = (outputFiles["css"] || [])
          .find(outputFile => outputFile.inputPath === cherrypickedFile.path)
          .content.replace(lineFeedRegex, "\n");

        assert.strictEqual(actualOutput, expectedOutput);
      }
    });
  }
});
