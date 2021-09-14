/**
 * @fileoverview Utilities for reporting to TeamCity
 */
class Logger {
    constructor() {
        // initialization
        if (!reportName) {
            throw new Error('Report name is not defined')
        }
        this.reportName = this.escapeTeamCityString(reportName)
        this.reportOutput = []
    }
    /**
     * Adds start of report to output
     * @returns {void}
     */
    reportStart() {
        this.reportOutput.push("##teamcity[testSuiteStarted name='" + this.reportName + "']")
    }

    /**
     * Adds end of report to output
     * @returns {void}
     */
    reportEnd() {
        this.reportOutput.push("##teamcity[testSuiteFinished name='" + this.reportName + "']")
    }

    /**
     * Adds end of report to output
     * @param {string} text - Message name
     * @param {string} errorDetails - Message name
     * @param {string} status - Status type (NORMAL, WARNING, FAILURE, ERROR)
     * @returns {void}
     */
    logMessage(text, errorDetails, status) {
        var output = []

        if (text) {
            output.push("text='" + this.escapeTeamCityString(text) + "'")
        } else {
            throw new Error('Message text is not defined')
        }

        if (errorDetails) {
            output.push("errorDetails='" + this.escapeTeamCityString(errorDetails) + "'")
        }

        if (status) {
            if (['NORMAL', 'WARNING', 'FAILURE', 'ERROR'].indexOf(status) > -1) {
                output.push("status='" + status + "'")
            } else {
                throw new Error('Please enter a valid status value. Value was ' + status + ' and needs to be one of NORMAL, WARNING, FAILURE, ERROR')
            }
        }

        this.reportOutput.push('##teamcity[message ' + output.join(' ') + ']')
    }

    /**
     * Adds start of test to output
     * @param {string} testName - Name of test
     * @returns {void}
     */
    testStart(testName) {
        this.reportOutput.push("##teamcity[testStarted name='" + this.reportName + ': ' + this.escapeTeamCityString(testName) + "']")
    }

    /**
     * Adds end of test to output
     * @param {string} testName - Name of test
     * @returns {void}
     */
    testEnd(testName) {
        this.reportOutput.push("##teamcity[testFinished name='" + this.reportName + ': ' + this.escapeTeamCityString(testName) + "']")
    }

    /**
     * Adds test failed info to output
     * @param {string} testName - Name of test
     * @param {array} messageList - Array of failed error messages
     * @returns {void}
     */
    testFailed(testName, messageList) {
        this.reportOutput.push("##teamcity[testFailed name='" + this.reportName + ': ' + this.escapeTeamCityString(testName) + "' message='" + this.escapeTeamCityString(messageList.join('\n')) + "']")
    }

    /**
     * Escapes a string for valid TeamCity output
     * @param {string} str - String to escape
     * @returns {string} - Escaped string
     */
    escapeTeamCityString(str) {
        if (!str) {
            return ''
        }
        return str
            .replace(/\|/g, '||')
            .replace(/\'/g, "|'")
            .replace(/\n/g, '|n')
            .replace(/\r/g, '|r')
            .replace(/\u0085/g, '|x')
            .replace(/\u2028/g, '|l')
            .replace(/\u2029/g, '|p')
            .replace(/\[/g, '|[')
            .replace(/\]/g, '|]')
    }
}

// Exports
module.exports = Logger
