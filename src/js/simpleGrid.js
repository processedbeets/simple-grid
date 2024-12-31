/*
 * simple-grid
 * https://github.com/processedbeets/simple-grid
 * 
 * Author: David Douglas Anderson
 * Copyright (c) 2015 Processed Beets Ltd
 * Licensed under the MIT license.
 */

; (function ($, window, document, undefined) {
    var mergedOptions = [],
        editorsCollection = [];

    'use strict';
    var CHECKBOX_COL = "checkboxColumn",
        DELETE_CELL = "deleteColumn";

    var SimpleGrid = function (instanceOptions) {

        //cache Dom
        var $table = $(this),
            columnNames,
            readOnlyIndices;

        var getColumnNames = function ($tbl) {
            var names = [];

            $tbl.find('tr th').each(function (index, cell) {
                names.push($(cell).attr('name'));
            });

            return names;
        };

        var getColumnIndices = function ($tbl, selector, match, matchAttribute, options) {
            var dataTable = $tbl.DataTable(),
                indices = [];

            var columns = $tbl.find(selector);
            $.each(columns, function () {
                indices.push($(this).index());
            });

            if (indices.length === 0
                && options
                && options.dataTable) {
                // .eq(0) --> convert 2D array to 1D
                $.each(dataTable.columns().eq(0), function (index) {
                    if ($(dataTable.column(index).header()).attr(matchAttribute) === match) {
                        indices.push(index);
                    }
                });
            }

            return indices;
        };

        var getColumnIndicesByName = function ($tbl, colName, options) {
            var selector = $tbl.find('thead tr th [name="' + colName + '"]');

            return getColumnIndices($tbl, selector, colName, 'name', options);
        };

        var getColumnIndicesByClass = function ($tbl, className, options) {
            var selector = $tbl.find('thead tr th.' + className);

            return getColumnIndices($tbl, selector, className, 'class', options);
        };

        var readOnlyColumnIndices = function ($tbl, options) {
            var readOnlyColumnNames = options.readOnlyColumns;
            var indices = [];

            if (readOnlyColumnNames) {
                $.each(readOnlyColumnNames, function (index, name) {
                    indices.push(getColumnIndicesByName($tbl, name, options)[0]);
                });
            } else {
                $tbl.find('tr th').each(function (index, cell) {
                    var $cell = $(cell);
                    if ($cell.attr('readonly') && !$cell.is('[readonly="false"]')) {
                        indices.push(index);
                    }
                });
            }

            return indices;
        };

        var checkBoxColumnIndices = function ($tbl, options) {
            var checkBoxColumnNames = options.dataTable.checkboxColumns;
            var indices = [];

            if (checkBoxColumnNames) {
                $.each(checkBoxColumnNames, function (index, name) {
                    indices.push(getColumnIndicesByName($tbl, name, options)[0]);
                });
            } else {
                $tbl.find('tr th').each(function (index, cell) {
                    var $cell = $(cell);
                    if ($cell.class('checkbox')) {
                        indices.push(index);
                    }
                });
            }

            return indices;
        };

        var cacheDom = function (table, options) {
            columnNames = getColumnNames(table);
            readOnlyIndices = readOnlyColumnIndices(table, options);
        };

        var newRowTemplate = function ($tbl, readOnlies, options) {
            var newRow = options.newRowTemplate;
            var newCellContent = options.newCellContent || '';

            if (!newRow) {
                newRow = [];
                $tbl.find('tr th').each(function (index, cell) {
                    readOnlies.indexOf(index) > -1
                        ? newRow.push(null)
                        : newRow.push(newCellContent);
                });
            }

            return newRow;
        };

        var sortColumnIndex = function ($tbl, options) {
            return options.sortColumnName ? getColumnIndicesByName($tbl, options.sortColumnName, options)[0] : 0;
        }

        var sortDefaultColumn = function ($tbl, options) {
            if ($tbl.DataTable()) {
                // reset sorting
                $tbl.DataTable().order([[sortColumnIndex($tbl, options), "asc"]]);
            }
        };

        var addNewRowAttributes = function ($tbl, rowNode, options) {
            var readOnlyCols = readOnlyColumnIndices($tbl, options),
                checkBoxCols = checkBoxColumnIndices($tbl, options);


            $.each(rowNode.children, function (index, cell) {
                // tab-able?
                if ($(cell).children().hasClass('deleteRow')) {
                    $(cell).changeElementType('th');
                    $(this).removeAttr('tabindex');
                    $(this).removeProp('tabindex');
                } else {
                    $(this).attr('tabindex', 1);
                }

                // readonly
                if (readOnlyCols.indexOf(index) > -1) {
                    $(cell).attr('readonly', true).addClass('center');
                }

                // checkboxes
                if (checkBoxCols.indexOf(index) > -1) {
                    $(cell).addClass('center');
                }
            });
        };

        var markDuplicates = function ($tbl, options) {
            if (options.markDuplicates) {
                var names = [],
                    $bodyRows;

                var colIndex = getColumnIndicesByName($tbl, options.uniqueColumnName, options)[0];

                // default to first column
                colIndex = colIndex > -1 ? colIndex : 0;

                if ($tbl.DataTable()) {
                    $bodyRows = $tbl.DataTable().column(colIndex).nodes();

                    // Remove previous Duplicate Markings - not ignoring those marked as deleted
                    $bodyRows.to$().removeClass(options.duplicateItemClass);

                    // ignore those marked as deleted
                    $bodyRows = $bodyRows.each(function (index, item) {
                        if (!$(item).hasClass(options.deletedClass)) {
                            return item;
                        }
                    });

                    // Build a sorted list of names
                    $.each($tbl.DataTable().column(0).nodes(), function (index, item) {
                        names.push($(item).text());
                    });
                    names = names.sort();

                    // Check for duplicates
                    var duplicates = [];
                    for (var i = 0; i < names.length - 1; i++) {
                        if (names[i + 1] === names[i]) {
                            duplicates.push(names[i]);
                        }
                    }

                    // Mark Duplicates
                    if (duplicates.length !== 0) {
                        $.each(duplicates, function (key, value) {
                            $bodyRows.to$().filter(':contains("' + value + '")').addClass(options.duplicateItemClass);
                        });
                    }
                } else {
                    $bodyRows = $tbl.find('tbody tr');

                    // Remove previous Duplicate Markings - not ignoring those marked as deleted
                    $bodyRows.find('td:eq(' + colIndex + ')').removeClass(options.duplicateItemClass);

                    // ignore those marked as deleted
                    $bodyRows = $bodyRows.not('.' + options.deletedClass);

                    // Build a sorted list of names
                    $bodyRows.each(function () {
                        names.push($(this).find('td:eq(' + colIndex + ')').text());
                    });

                    names = names.sort();

                    // Check for duplicates
                    var duplicates = [];
                    for (var i = 0; i < names.length - 1; i++) {
                        if (names[i + 1] === names[i]) {
                            duplicates.push(names[i]);
                        }
                    }

                    // Mark Duplicates
                    if (duplicates.length !== 0) {
                        $.each(duplicates, function (key, value) {
                            $bodyRows.find('td:contains("' + value + '")').addClass(options.duplicateItemClass);
                        });
                    }
                }
            }
        };

        var markAsEdited = function ($cell, oldVal, newVal, options) {
            // assume the 'change' event on a child input control must be a change of value
            if (oldVal !== newVal || $cell.find('input').length > 0) {
                if (options.markCellEdited) {
                    $cell.addClass(options.editedClass);
                } else if (options.markRowEdited) {
                    $cell.parents('tr').each(function () {
                        $(this).addClass(options.editedClass);
                    });
                }
            }
        };

        var rowUndo = function (btn, options) {
            btn.removeClass(options.internalDeletionClass);

            btn.parents('tr').each(function () {
                $(this).removeClass(options.deletedClass);

                //convert Undo -> Deleted Button
                btn.removeClass(options.undoBtnClass);
                btn.addClass(options.deleteBtnClass);
                btn.html(options.deleteIconHtml);
            });
        };

        var rowDelete = function (btn, options) {
            btn.addClass(options.internalDeletionClass);

            btn.parents('tr').each(function () {
                $(this).addClass(options.deletedClass);

                //convert Deleted -> Undo Button
                btn.removeClass(options.deleteBtnClass);
                btn.addClass(options.undoBtnClass);
                btn.html(options.undoIconHtml);
            });
        };

        var markRowAsDeleted = function ($btn, options) {
            $btn.hasClass(options.internalDeletionClass)
                ? rowUndo($btn, options)
                : rowDelete($btn, options);
        };

        var editCell = function (evt) {
            if (evt) {
                var oldVal = evt[1],
                    newVal = evt[0],
                    options = evt.data;

                markAsEdited($(this), oldVal, newVal, options);
                markDuplicates($(evt.delegateTarget), options);
            }
        };

        var deleteRow = function (evt) {
            if (evt) {
                var options = evt.data;

                markRowAsDeleted($(this), options);
                markDuplicates($(evt.delegateTarget), options);

                evt.preventDefault();
            }
        }

        var addRow = function (evt) {
            if (evt) {
                // stop jumping to top
                evt.preventDefault();

                var $tbl = evt.data[0],
                    options = evt.data[1];

                var newRow = newRowTemplate($tbl, readOnlyIndices, options);

                if ($tbl.DataTable()) {

                    // reset sorting
                    sortDefaultColumn($tbl, options);

                    var rowNode = $tbl
                        .DataTable()
                        .row
                        .add(newRow)
                        .draw(true)
                        .node();

                    addNewRowAttributes($tbl, rowNode, options);
                }
            }
        };

        var adjustTableSize = function (evt) {
            if (evt) {
                var $tbl = evt.data;
                if ($tbl.DataTable()) {
                    setTimeout(function () {
                        $tbl.DataTable().draw();
                    }, 300);

                    if (typeof $tbl.fnAdjustColumnSizing === 'function') {
                        $tbl.fnAdjustColumnSizing();
                    }
                }
            }
        };

        var rowClick = function (evt) {
            if (evt) {
                var options = evt.data;
                // only attach rowClick handler if we aren't enabling table editing table 
                if (!options.editableTable.show) {
                    if ($(evt.target).is('a') || typeof $(this).attr('href') !== 'string') {
                        return;
                    }
                    if ($(this).attr('href')) {
                        if (options.rowClickNewTab) {
                            window.open($(this).attr('href'), '_blank');
                        } else {
                            window.location.href = $(this).attr('href');
                        }
                    }
                }
            }
        };

        // Show/Hide columns - re-apply Editable
        var reApplyEditable = function (evt) {
            if (evt) {
                var $tbl = evt.data[0],
                    options = evt.data[1];

                if (options.editableTable.show) {
                    $tbl.editableTable(options.editableTable.definition);
                }

                if (options.numericTable.show) {
                    $tbl.numericTableWidget(options.numericTable.definition);
                }
            }
        };

        //bind events
        var bindEvents = function (table, options) {
            table.on('change', 'tbody td', options, editCell);
            table.on('click', 'tbody > tr', options, rowClick);
            table.on('click', options.deleteRowSelector, options, deleteRow);
            table.on('column-visibility.dt draw.dt', [table, options], reApplyEditable);
            $(options.addRowSelector).on('click', [table, options], addRow);

            $(window).on('resize', table, adjustTableSize);
        };

        // Apply classes unique to this plugin to the table
        // Prevent the need for the user to remember to add them
        var applyClasses = function (table, options) {
            // add class="deleteRow" to any thead th containing Delete
            var deleteHeader = table.find('thead th:contains("Delete")');
            if (!deleteHeader.attr('name')) {
                deleteHeader.attr('name', "Delete");
            }

            if (options && options.autoAddDeleteBtn) {
                deleteHeader.addClass(DELETE_CELL);
            }

            // add Checkbox Columns
            if (options.dataTable && options.dataTable.checkboxColumns.length > 0) {
                $(options.dataTable.checkboxColumns).each(function (index, item) {
                    table.find('thead th[name="' + item + '"]').addClass(CHECKBOX_COL);
                });
            }

            if (options.tableFilter) {
                table.find('tfoot').css('display', 'table-header-group');

                table.find('tfoot th').addClass(options.tableFilterClass);
            }
        };

        var applyOptions = function (table, options, userOptions) {
            if (options) {
                if (options.dataTable && options.dataTable.definition) {
                    // Prevent Filtering of Common Function columns
                    options.dataTable.noFilters.push("Delete");
                    options.dataTable.noFilters.push("View");
                    options.dataTable.noFilters.push("Edit");

                    if (options.dataTable.definition.serverSide) {
                        // let's add the name property to all columns   
                        if (!options.dataTable.definition.columnDefs || !options.dataTable.definition.columns) {
                            options.dataTable.definition.columns = [];

                            $(table).find('thead th').each(function () {
                                options.dataTable.definition.columns.push({
                                    "name": $(this).attr('name')
                                });
                            });
                        }
                    }

                    if (options.dataTable.tableOnly) {
                        options.dataTable.definition.dom = options.dataTable.tableOnlyDef;

                        // Unless explicitly set, prevent pagination when showing tableOnly definition
                        options.dataTable.definition.paginate = options.dataTable.definition.paginate || false;
                    }

                    // revert to user buttons array if specified - we don't want this merged
                    if (userOptions
                        && userOptions.dataTable
                        && userOptions.dataTable.definition
                        && userOptions.dataTable.definition.buttons) {
                        options.dataTable.definition.buttons = userOptions.dataTable.definition.buttons;
                    }
                }

                options.editableTable.definition.editedClass = options.editedClass;
                options.editableTable.definition.deletedClass = options.deletedClass;
                options.editableTable.definition.markCellEdited = options.markCellEdited;
                options.editableTable.definition.markRowEdited = options.markRowEdited;

                options.numericTable.definition.editedClass = options.editedClass;
                options.numericTable.definition.deletedClass = options.deletedClass;
                options.numericTable.definition.dataTablesWrapped = options.dataTable && options.dataTable.show;
            }
            return options || {};
        };

        var addFilters = function (table, options) {
            if (options.tableFilter) {
                var columnCount = table.find('thead th').length;
                table.find('thead').after('<tfoot><tr></tr></tfoot>');
                var tfootRow = table.find('tfoot tr');
                var columns = [];
                for (var col = 0; col < columnCount; col++) {
                    columns.push('<th></th>');
                }
                tfootRow.html(columns.join(""));
            }
        };

        // Here's a best practice for overriding 'defaults'
        // with specified options. Note how, rather than a 
        // regular defaults object being passed as the second
        // parameter, we instead refer to $.fn.pluginName.options 
        // explicitly, merging it with the options passed directly 
        // to the plugin. This allows us to override options both 
        // globally and on a per-call level. 
        mergedOptions[$table.attr('id')] = $.extend(true, {}, $.fn.simpleGrid.options, instanceOptions);

        var init = function (tableElement, options, userOptions) {
            var table = tableElement;

            options = applyOptions(table, options, userOptions);
            addFilters(table, options);
            applyClasses(table, options);

            if (options.dataTable.show) {
                table.DataTable(options.dataTable.definition);
            }

            if (options.editableTable.show) {
                tableElement.addClass('editable');
                table = tableElement.editableTable(options.editableTable.definition);
            }

            if (options.numericTable.show) {
                table = tableElement.numericTableWidget(options.numericTable.definition);
            }

            cacheDom(table, options);
            bindEvents(table, options);

            return table;
        };

        var getColumnNameByIndex = function ($tbl, colIndex) {
            var col = $tbl.find('thead tr th:eq(' + colIndex + ')');
            return col.attr('name') ? col.attr('name') : col.text().trim().replace(/\s/g, "X");
        };

        var getColumnNameByCell = function ($tbl, $cell) {
            var colIndex = $cell.parent().children().index($cell);

            return getColumnNameByIndex($tbl, colIndex);
        };

        var getEditedCollection = function ($tbl, $rows, deleteMe, options, wrapperObject, editors) {
            var items = [];
            var columns = options.editableTable.definition.columns;

            $rows.each(function () {
                var $row = $(this),
                    $cells = $row.find('td'),
                    pkValue = $row.data('id'),
                    pkName = options.primaryKey,
                    item = {
                        ToDelete: deleteMe
                    };

                if (!deleteMe || (deleteMe && pkValue > 0)) {
                    item[pkName] = pkValue;
                    $cells.each(function () {
                        var $cell = $(this),
                            cellName = getColumnNameByCell($tbl, $cell);

                        // if explicitly set
                        var colType = columns ? columns[cellName] : undefined;

                        if (cellName) {
                            // Checkbox
                            var $checkbox = $cell.children('[type="checkbox"]');
                            if ($checkbox && $checkbox.length > 0) {
                                item[cellName] = $checkbox.prop('checked');
                            } else {
                                // Dropdown - data-Value provided
                                if ($cell.data('value') !== undefined) {
                                    item[cellName] = $cell.data('value');
                                } else {
                                    // Dropdown - data-Value not provided. Let's lookup matching text value
                                    var editor = editors ? editors[colType] : undefined;
                                    if (editor && editor.source && !editor.isAutoComplete) {
                                        var cellValue = $cell.text().trim();

                                        $.each(editor.source, function (key, value) {
                                            if (value === cellValue) {
                                                item[cellName] = key;
                                                return;
                                            }
                                        });
                                    } else {
                                        // Default - Text Value
                                        item[cellName] = SharedHelpers.StripCurrency($cell.text().trim());
                                    }

                                }
                            }
                        }
                    });

                    if (wrapperObject) {
                        var currItem = item;
                        item = {};
                        item[wrapperObject] = currItem;
                    }

                    items.push(item);
                }
            });

            return items;
        };


        /*
         * returns an array of objects for every edited row
         */
        this.EditedRows = function (wrapperObject) {
            var $tbl = $(this);
            var id = $tbl.attr('id');

            var options = mergedOptions[id],
                editors = editorsCollection[id];

            var deleteSelector = $tbl.find('tbody > tr.' + options.deletedClass),
                editSelector = [];

            if (options.markCellEdited) {
                editSelector = $tbl.find('tbody tr').not('.' + options.deletedClass).find('td.' + options.editedClass).parent();
            }
            else if (options.markRowEdited) {
                editSelector = $tbl.find('tbody tr.' + options.editedClass).not('.' + options.deletedClass);
            }

            var editOnly = getEditedCollection($tbl, editSelector, false, options, wrapperObject, editors),
                deleteOnly = getEditedCollection($tbl, deleteSelector, true, options, wrapperObject, editors);

            return $.merge(editOnly, deleteOnly);
        };

        this.ToggleRows = function (selector) {
            var dataTable = $(this).DataTable();

            // first reset what's there
            $.fn.dataTableExt.afnFiltering.pop();
            dataTable.draw();

            // new filter
            $.fn.dataTableExt.afnFiltering.push(
                function (oSettings, aData, iDataIndex) {
                    var row = oSettings.aoData[iDataIndex].nTr;
                    return $(row).is(selector) ? true : false;
                }
            );
            dataTable.draw();
        };

        this.ToggleColumnByName = function (colName, visible) {
            var $tbl = $(this);

            var dataTable = $tbl.DataTable(),
                options = mergedOptions[$tbl.attr('id')];

            // Get the column API object
            var columns = getColumnIndicesByName($(this), colName, options);

            // Toggle the visibility
            var column;
            $.each(columns, function () {
                column = dataTable.column(this);

                column.visible(visible);
            });

            dataTable.draw();
            return true;
        };

        this.ToggleColumnByClass = function (selector, visible) {
            var $tbl = $(this);

            var dataTable = $tbl.DataTable(),
                options = mergedOptions[$tbl.attr('id')];

            // Get the column API object
            var columns = getColumnIndicesByClass($(this), selector, options);

            // Toggle the visibility
            var column;
            $.each(columns, function () {
                column = dataTable.column(this);

                column.visible(visible);
            });

            dataTable.draw();
            return true;
        };
        var id = $table.attr('id');
        $table = init($table, mergedOptions[id], instanceOptions);
        editorsCollection[id] = $table.Editors ? $table.Editors[id] : undefined;

        $.fn.simpleGrid = SimpleGrid;

        return this;
    };

    // Globally overriding options
    // Here are our publicly accessible default plugin options 
    // that are available in case the user doesn't pass in all 
    // of the values expected. The user is given a default
    // experience but can also override the values as necessary.
    // eg. $fn.pluginName.key ='otherval';

    SimpleGrid.options = {
        editedClass: 'success',
        deletedClass: 'danger',
        addRowSelector: '.addRow',
        deleteRowSelector: '.deleteRow',
        internalDeletionClass: 'deleted',
        deleteIconHtml: '<i class="fa fa-trash-o"></i>',
        undoIconHtml: '<i class="fa fa-undo"></i>',
        duplicateItemClass: 'field-validation-error',
        deleteBtnClass: 'btn-danger',
        undoBtnClass: 'btn-warning',
        newCellContent: '-- New Row --',
        autoAddDeleteBtn: true,
        markDuplicates: true,
        markRowEdited: true,
        markCellEdited: false,
        tableFilter: true,
        rowClickNewTab: true,
        dataTable: {
            show: true,
            selectFilters: [],
            noFilters: [],
            hiddenColumns: [],
            visibleColumns: [],
            checkboxColumns: [],
            orderColumns: [],
            hiddenRows: [], // initially hide rows matching these selectors
            columnFiltering: true,
            tableOnly: false,
            tableOnlyDef: 't',
            definition: {
                dom: 'Blfrtip',
                colReorder: true,
                "stateSave": true,
                orderClasses: false,
                pagingType: "full_numbers",
                buttons: [
                    'colvis', 'copy', 'csv', 'excel'
                ],
                "columnDefs": [
                    {
                        "defaultContent": "<input type='checkbox' class='checkbox chk-md disableRow' checked>",
                        "orderDataType": "dom-checkbox",
                        "targets": CHECKBOX_COL
                    },
                    {
                        "data": null,
                        "defaultContent": '<a class="btn btn-danger btn-block deleteRow" href="#"><i class="fa fa-trash-o"></i>&nbsp;</a>',
                        "targets": DELETE_CELL
                    }
                ],
                initComplete: function () {
                    var options = mergedOptions[$(this).attr('id')],
                        dataTable = $(this).DataTable();

                    // clear filters and searches from localStorage
                    dataTable.search('').columns().search('').draw();

                    // by the time we call this, our options are out of scope so have to access via simpleGrid object
                    var dataTableOptions = options.dataTable;
                    var hideAllCols = dataTableOptions.visibleColumns.length > 0;

                    dataTable.columns().every(function (colIndex) {
                        var column = this;
                        var title = $(column.header()).attr('name') ? $(column.header()).attr('name') : $(column.header()).text();

                        // default all columns to hidden and only show those in visibleColumns collection
                        if (hideAllCols) {
                            column.visible(false);
                        }

                        /* Filtering */
                        /*************************/
                        // select dropdown
                        if (options.tableFilter
                            && dataTableOptions.noFilters.indexOf(title) < 0
                            && dataTableOptions.checkboxColumns.indexOf(title) < 0) {
                            if (dataTableOptions.selectFilters.indexOf(title) > -1) {
                                var select = $('<select class="form-control"><option value=""></option></select>')
                                    .appendTo($(column.footer()).empty())
                                    .on('change', function () {
                                        column.search($(this).val(), false, false);
                                        if (dataTableOptions.definition.serverSide) {
                                            dataTable.ajax.reload();
                                        } else {
                                            dataTable.draw();
                                        }
                                    });

                                column.data().unique().sort().each(function (d, j) {
                                    if (d && d.trim() !== '') {
                                        select.append('<option value="' + d + '">' + d + '</option>');
                                    }
                                });
                            }
                                // text-input
                            else {
                                $('<input class="form-control table-filters" type="text" />')
                                    .appendTo($(column.footer()).empty())
                                    .on('keyup change', function () {
                                        column.search($(this).val(), false, false);
                                        if (dataTableOptions.definition.serverSide) {
                                            dataTable.ajax.reload();
                                        } else {
                                            dataTable.draw();
                                        }
                                    });
                            }
                        }

                        /* Column Visibility */
                        /***********************************/
                        if (dataTableOptions.hiddenColumns.indexOf(title) > -1) {
                            column.visible(false);
                        }

                        if (dataTableOptions.visibleColumns.indexOf(title) > -1) {
                            column.visible(true);
                        }

                        /* Column Ordering */
                        /**********************************/
                        if (dataTableOptions.orderColumns.length > 0) {
                            $(options.dataTable.orderColumns).each(function (index, item) {
                                var colName = item[0]; //["Name", "asc"]
                                if (colName === title) {
                                    options.dataTable.orderColumns[index][0] = colIndex;
                                    return;
                                }
                            });
                        }
                    });

                    /* Order */
                    if (dataTableOptions.orderColumns.length > 0) {
                        dataTable
                            .order(options.dataTable.orderColumns)
                            .draw();
                    }

                    /* Row Filtering */
                    /**********************************/
                    if (dataTableOptions.hiddenRows.length > 0) {
                        var selector = dataTableOptions.hiddenRows.join();

                        $.fn.dataTableExt.afnFiltering.push(
                           function (oSettings, aData, iDataIndex) {
                               var row = oSettings.aoData[iDataIndex].nTr;
                               return $(row).is(selector) ? false : true;
                           }
                        );

                        dataTable.draw();
                    }
                }
            }
        },
        editableTable: {
            show: true,
            definition: {
                callback: undefined,
                columns: [],
                defaultOptions: {
                    cloneProperties: ['padding', 'padding-top', 'padding-bottom', 'padding-left', 'padding-right', 'text-align', 'font', 'font-size', 'font-family', 'font-weight'],
                    editor: $('<input>')
                },
                editorsMaxWidth: true,
                showEditedCell: false,
                showEditedRow: false,
                types: [],
                url: undefined
            }
        },
        numericTable: {
            show: false,
            definition: {
                blankZeros: false,
                blankZerosClass: 'blank',
                dataTablesWrapped: true,
                excludeColumnClass: 'excludeCol',
                initTotals: false,
                maxValue: 99999,
                maxTotalPerTotalColumn: 99999,
                totalColumnClass: 'totalCol'
            }
        }
    };

    $.fn.simpleGrid = SimpleGrid;

    return $.fn.simpleGrid;
})(jQuery, window, document);
