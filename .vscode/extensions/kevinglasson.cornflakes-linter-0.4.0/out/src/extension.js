"use strict";
const flake8Linter_1 = require('./features/flake8Linter');
function activate(context) {
    let linter = new flake8Linter_1.default();
    linter.activate(context.subscriptions);
}
exports.activate = activate;
//# sourceMappingURL=extension.js.map