/**
 * @fileoverview ESLint HTML 'Lite' reporter
 */

const EslintReport = require('./eslint-report')
const templateUtils = require('../templates/utils')

module.exports = function (results) {
    let EslintReport = new EslintReport(),
        data = EslintReport.start(results, false, true)

    return templateUtils.applyTemplates(data)
}
