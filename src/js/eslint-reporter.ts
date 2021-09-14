/**
 * @fileoverview SCSS Lint HTML reporter
 */
'use strict'

var Logger = require('./logger')
var template = require('../templates/index')

class EslintReport {
    constructor() {
        this.fullReport = true
        this.useTeamCityReport = false
        this.ruleUrl = 'http://eslint.org/docs/rules/'
    }
    /**
     * 更新文件统计
     * @param {object} file 文件对象
     * @param {object} message 消息
     * @returns {object} 更新后的文件对象
     */
    summarizeFile(file, message) {
        var ruleUrl = this.ruleUrl + message.ruleId

        message.ruleUrl = ruleUrl

        if (message.severity === 2) {
            file.errors++

            file.errorList.push('line ' + message.line + ', col ' + message.column + ', ' + message.message)
        } else if (message.severity === 1) {
            file.warnings++
        }

        template.updateOccurrence(message.ruleId, message.severity, ruleUrl)

        file.messages.push(message)

        return file
    }
    /**
     * Summarizes the data
     * @param {object} results - JSON object
     * @returns {void}
     */
    summarizeData(results) {
        var Logger = new Logger('ESLint')
        Logger.reportStart()

        for (let i = 0; i < results.length; i++) {
            let result = results[i],
                fileName = result.filePath,
                messages = result.messages,
                file = { path: fileName, errors: 0, warnings: 0, messages: [], errorList: [] }

            Logger.testStart(fileName)

            for (var x = 0; x < messages.length; x++) {
                var message = messages[x]

                template.updateAlertSummary(message)
                file = this.summarizeFile(file, message)
            }

            if (file.errorList.length) {
                Logger.testFailed(fileName, file.errorList)
            }

            Logger.testEnd(fileName)
            template.updateFileSummary(file)

            // remove messages so that handlebars doesn't print links in the report
            // @todo get rid of handlebars
            if (!this.fullReport) {
                file.messages = null
            }
        }

        Logger.reportEnd()

        // output team city report to the console
        if (this.useTeamCityReport) {
            console.log(Logger.reportOutput.join('\n'))
        }
    }

    /**
     * Starts the Linting Report
     * @param {object} data - Data object
     * @param {boolean} fullReport - Whether or not to include the full report
     * @param {boolean} useTeamCityReport - Whether or not to output to TeamCity
     * @returns {object} - Object used to send to template for parsing
     */
    start(data, fullReport, useTeamCityReport) {
        this.fullReport = fullReport
        this.useTeamCityReport = useTeamCityReport

        this.summarizeData(data)

        template.files.sort(template.sortErrors)

        template.errorOccurrences.sort(template.sortOccurrences)
        template.warningOccurrences.sort(template.sortOccurrences)

        return {
            fileSummary: template.fileSummary,
            alertSummary: template.alertSummary,
            files: template.files,
            fullReport: this.fullReport,
            errorOccurrences: template.errorOccurrences,
            warningOccurrences: template.warningOccurrences,
            pageTitle: 'ESLint Results' + (this.fullReport ? '' : ' (lite)')
        }
    }
}

module.exports = EslintReport
