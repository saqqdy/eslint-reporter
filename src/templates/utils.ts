/**
 * @fileoverview Template Utils for HTML Reporters
 */
'use strict'

var handlebars = require('handlebars')
var fs = require('fs')
var path = require('path')

/**
 * Adds appropriate class name to a row
 * @param {object} context - Data passed to the helper
 * @param {object} options - Nested data
 * @returns {string} - Table row with appropriate class name
 */
exports.rowHelper = function (context, options) {
    var className = 'success'

    if (context.errors) {
        className = 'danger'
    } else if (context.warnings) {
        className = 'warning'
    }

    return '<tr class="' + className + '">' + options.fn(this) + '</tr>'
}

/**
 * Adds appropriate class name to a message row
 * @param {object} context - Data passed to the helper
 * @param {object} options - Nested data
 * @returns {string} - Table row with appropriate class name
 */
exports.messageRow = function (context, options) {
    var className = ''

    if (context.severity === 2 || context.severity === 'error') {
        className = 'msg-danger'
    } else if (context.severity === 1 || context.severity === 'warning') {
        className = 'msg-warning'
    }

    if (className === '') {
        return '<tr>' + options.fn(this) + '</tr>'
    }
    return '<tr class="' + className + '">' + options.fn(this) + '</tr>'
}

/**
 * Format severity number into text
 * @param {object} context - Data passed to the helper
 * @returns {string} - Severity as text
 */
exports.formatSeverity = function (context) {
    if (context.severity === 2 || context.severity === 'error') {
        return 'Error'
    } else if (context.severity === 1 || context.severity === 'warning') {
        return 'Warning'
    }
    return ''
}

/**
 * registerPartials
 * @description 注册组件
 * @returns {void}
 */
exports.registerPartials = function () {
    let partialsPath = path.join(__dirname, 'partials'),
        // 汇总
        summary = fs.readFileSync(path.join(partialsPath, 'summary.hbs'), {
            encoding: 'utf-8'
        }),
        // file breakdown
        fileBreakdown = fs.readFileSync(path.join(partialsPath, 'file-breakdown.hbs'), {
            encoding: 'utf-8'
        }),
        // occurrences
        occurrences = fs.readFileSync(path.join(partialsPath, 'occurrences.hbs'), {
            encoding: 'utf-8'
        }),
        // css
        css = fs.readFileSync(path.join(partialsPath, 'css.hbs'), {
            encoding: 'utf-8'
        }),
        // js
        js = fs.readFileSync(path.join(partialsPath, 'js.hbs'), {
            encoding: 'utf-8'
        })

    handlebars.registerPartial({
        summary: handlebars.compile(summary),
        fileBreakdown: handlebars.compile(fileBreakdown),
        occurrences: handlebars.compile(occurrences),
        js: handlebars.compile(js),
        css: handlebars.compile(css)
    })
}

/**
 * Register Handlebars helpers
 * @returns {void}
 */
exports.registerHelpers = function () {
    handlebars.registerHelper('row', this.rowHelper)
    handlebars.registerHelper('messageRow', this.messageRow)
    handlebars.registerHelper('formatSeverity', this.formatSeverity)
}

/**
 * Apply handlebars template to data
 * @param {object} data - Data to parse with Handlebars template
 * @returns {string} - HTML-formatted report
 */
exports.applyTemplates = function (data) {
    if (!data) {
        throw new Error('Data is undefined')
    }

    this.registerHelpers()
    this.registerPartials()

    var reporter = fs.readFileSync(path.join(__dirname, './reporter.hbs'), {
            encoding: 'utf-8'
        }),
        template = handlebars.compile(reporter)

    return template(data)
}
