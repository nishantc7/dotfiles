'use strict';
const vscode_1 = require('vscode');
const lintingProvider_1 = require('./utils/lintingProvider');
class Flake8LintingProvider {
    constructor() {
        this.languageId = 'python';
        this.settingsSection = 'cornflakes';
    }
    activate(subscriptions) {
        let provider = new lintingProvider_1.LintingProvider(this);
        provider.activate(subscriptions);
    }
    loadConfiguration() {
        let section = vscode_1.workspace.getConfiguration(this.settingsSection);
        if (!section)
            return;
        return {
            executable: section.get('linter.executablePath', 'flake8'),
            fileArgs: [],
            bufferArgs: [],
            extraArgs: [],
            runTrigger: section.get('linter.run', 'onSave')
        };
    }
    process(lines, filePath) {
        let diagnostics = [];
        let violations = 0;
        violations = this.getViolations(lines);
        if (violations !== 0) {
            diagnostics = this.getDiagnostics(lines, filePath);
        }
        else {
            diagnostics = [];
        }
        return diagnostics;
    }
    getDiagnostics(lines, filePath) {
        const lintRegex = /^(.+):(\d+):(\d+):\ (\S+\d+):?\ (.+)$/;
        // const filePathRegex = new RegExp(filePath);
        let diagnostics = [];
        lines.forEach(line => {
            let matches = lintRegex.exec(line);
            // No errors found so return an empty list.
            if (matches === null) {
                return;
            }
            // Check that the the error is actually for the file we are 
            // processing.
            if (filePath === (matches[1])) {
                diagnostics.push({
                    range: new vscode_1.Range(parseInt(matches[2]) - 1, 0, parseInt(matches[2]) - 1, Number.MAX_VALUE),
                    severity: vscode_1.DiagnosticSeverity.Information,
                    message: matches[5],
                    code: matches[4],
                    source: 'cornflakes'
                });
            }
        });
        console.log(diagnostics);
        return diagnostics;
    }
    getViolations(lines) {
        const violationsRegex = /Found a total of \d+ violations and reported (\d+)$/;
        let violations = 0;
        lines.some(line => {
            const matches = violationsRegex.exec(line);
            if (matches !== null) {
                violations = parseInt(matches[1]);
                return true;
            }
        });
        return violations;
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Flake8LintingProvider;
//# sourceMappingURL=flake8Linter.js.map