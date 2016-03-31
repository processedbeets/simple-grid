/* global $ */
$.fn.numericTableWidget = function (options) {
    'use strict';
    var $table = $(this),
        footer = $table.find('tfoot tr'),
        totalColumnClass = options.totalColumnClass,
        excludeColumnClass = options.excludeColumnClass,
        deletedClass = options.deletedClass;

    var columnIndices = function(colClass) {
            var columns = [];
            $('thead th.' + colClass).each(function() {
                columns.push($(this).index());
            });
            return columns.sort();
        };

    var excludeCols = columnIndices(excludeColumnClass),
        totalCols = columnIndices(totalColumnClass);

    // Want to scan columns left to right starting with cell index
    var nextTotalCell = function (cell) {
        var cellIndex = $(cell).index(),
            nextTotal = null,
            row = $(cell).parent('tr');
        for (var i = 0; i < totalCols.length; i++) {
            if (totalCols[i] >= cellIndex) {
                nextTotal = totalCols[i];
                break;
            }
        };
        return $(row).children().eq(nextTotal);
    };

    var editableCellSelector = function () {
        var nonEditableCols = [];
            // 1 based index when using nth-child(X), so we add 1
            $.each(excludeCols, function (index, val) {
                nonEditableCols.push(":nth-child(" + (parseInt(val) + 1) + ")");
            });

            $.each(totalCols, function (index, val) {
                nonEditableCols.push(":nth-child(" + (parseInt(val) + 1) + ")");
            });

            return 'tbody td:not(' + nonEditableCols.join(',') + ')';
        };
    
    if (options.dataTablesWrapped) {
        footer = $('#' + $(this).attr('id') + '_wrapper .dataTables_scrollFootInner tfoot tr');
    }

    var dataRows = $table.find('tbody tr'),
        initialTotal = function () {
            if (options.initTotals) {
                var column, total;

                // Total Columns - loop each row; loop each cell
                dataRows.each(function () {
                    total = 0;
                    $(this).find('td').each(function () {
                        var cellIndex = $(this).index();
                        if (totalCols.indexOf(cellIndex) > -1) {
                            if (total > options.maxTotalPerTotalColumn) {
                                $(this).addClass(deletedClass);
                            }

                            $(this).text(total.toFixed(2));
                            total = 0;
                        } else {
                            total += isNaN(parseFloat($(this).text() ? $(this).text() : 0)) ? 0 : parseFloat($(this).text());
                        }
                    });
                });

                // Total Footer Row
                for (column = 1; column < footer.children().size() ; column++) {
                    total = 0;
                    dataRows.each(function () {
                        var row = $(this);
                        var rowValue = row.children().eq(column).text().trim();
                        total += parseFloat(rowValue ? rowValue : 0);
                    });
                    footer.children().eq(column).text(!isNaN(total) ? total.toFixed(2) : '');
                };
            }
        },
        blankZeros = function () {
            if (options.blankZeros) {
                $table.find(editableCellSelector).filter(function () {
                    return $(this).text().trim() === '0';
                }).addClass(options.blankZerosClass);
            }
        },
        updateCell = function (evt, newVal, prevVal) {
            var $cell = $(evt.target);
        	var column = $cell.index(),
        	    total = 0;

            $table.find('tbody tr').each(function () {
                var row = $(this);
                var rowValue = row.children().eq(column).text().trim();
                total += parseFloat(rowValue ? rowValue : 0);
            });
            if (column === 1 && total > options.maxValue) {
                $('.alert').show();
                return false; // changes can be rejected
            } else {
                $('.alert').hide();
                footer.children().eq(column).text(!isNaN(total) ? total.toFixed(2) : '');

                /* let us also update the next available total column cell on this row */
                if (totalCols.length > 0) {
                    newVal = isNaN(parseFloat(newVal)) || parseFloat(newVal) < 0 ? 0 : parseFloat(newVal);
                    prevVal = isNaN(parseFloat(prevVal)) || parseFloat(prevVal) < 0 ? 0 : parseFloat(prevVal);

                    var totalCol = nextTotalCell($cell);
                    var currentTotal = parseFloat(totalCol.text().trim()),
                        difference = newVal - prevVal;

                    currentTotal = isNaN(currentTotal) || currentTotal < 0 ? 0 : currentTotal;
                    var newTotal = isNaN(currentTotal + difference) || (currentTotal + difference) < 0 ? 0 : parseFloat(currentTotal + difference).toFixed(2);

                    // Clear existing class - check if error Class should be added
                    totalCol.removeClass(deletedClass);
                    if (newTotal > options.maxTotalPerTotalColumn) {
                        totalCol.addClass(deletedClass);
                    }
                    totalCol.text(newTotal);

                    /* now we also want to update the footer total for this totalCol */
                    var totalColIndex = totalCol.index(),
                        totalColFooter = footer.children().eq(totalColIndex),
                        totalColFooterValue = isNaN(totalColFooter.text().trim()) || totalColFooter.text().trim() < 0 ? 0 : parseFloat(totalColFooter.text().trim());

                    var newTotalFooter = parseFloat(totalColFooterValue + difference).toFixed(2);
                    totalColFooter.text(newTotalFooter < 0 ? 0 : newTotal);
                }
            }

            return true;
        },
        validate = function (evt, value) {
            // Prevent entering of non-number
            var numericValue = SharedHelpers.StripCurrency(SharedHelpers.StripWhitespace(value));

            return !isNaN(parseFloat(numericValue)) && isFinite(numericValue) && parseFloat(numericValue) <= options.maxValue;
        };

    //bind events
    var bindEvents = function () {
        $table.on('change', editableCellSelector(), updateCell);
        $table.on('validate', editableCellSelector(), validate);
    };

    bindEvents();
    initialTotal();
    blankZeros();
    return this;
};
