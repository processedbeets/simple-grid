/*
 * possible uses of dropdown: sort: $.editableTable.dropdownSort.ID
 */

; (function ($, window, document, undefined) {

    var EditableTable = function (options) {
        'use strict';
        var DATE_FORMAT = 'DD MMM YYYY',
            ARROW_LEFT = 37,
            ARROW_UP = 38,
            ARROW_RIGHT = 39,
            ARROW_DOWN = 40,
            ENTER = 13,
            ESC = 27,
            TAB = 9,
            EMPTY_STRING = '';

        var tableEditors = [];

        var init = function($tbl) {
            $tbl.each(function() {
                var getColumnName = function (activeCell) {
                    if (activeCell) {
                        var colIndex = activeCell.parent().children().index(activeCell);

                        return activeCell
                            .parents('table')
                            .find('thead tr th:eq(' + colIndex + ')')
                            .attr('name');
                    }
                };
                var buildDefaultOptions = function() {
                        var opts = $.extend({}, options.defaultOptions);
                        opts.editor = opts.editor.clone();
                        return opts;
                    },
                    activeOptions = $.extend(buildDefaultOptions(), options),
                    deletedClass = activeOptions.deletedClass || 'danger',
                    editedClass = activeOptions.editedClass || 'success',
                    element = $(this),
                    editor,
                    active,
                    setActiveText = function() {
                        var currentValue = editor.val(),
                            originalContent = active.html(),
                            originalValue = active.text().trim(),
                            originalAndCurrent = [currentValue, originalValue],
                            evt = $.Event('change', originalAndCurrent);

                        if (originalValue === currentValue || editor.hasClass('error')) {
                            //if (activeOptions.markCellEdited) {
                            //    active.removeClass(editedClass);
                            //} else if (activeOptions.markRowEdited) {
                            //    active.parents('tr').each(function() {
                            //        $(this).removeClass(editedClass);
                            //    });
                            //};
                            return true;
                        };

                        // if empty overwrite all text, otherwise update only the text content (node type = 3) and not any hidden elements
                        if (originalValue === EMPTY_STRING) {
                            active.text(currentValue);
                        } else {
                            active.contents().filter(function() {
                                return this.nodeType === 3;
                            }).last().replaceWith(currentValue);
                        }

                        active.trigger(evt, originalAndCurrent);
                        if (evt.result === false) {
                            active.html(originalContent);
                        } else if (activeOptions.url) {
                            var cellValue = {};
                            var colName = active.attr('name') || getColumnName(active);

                            cellValue[colName] = active.text().trim();

                            //serialize to get hidden inputs
                            var cellObject = $.extend({}, active.data(), cellValue);

                            $.ajax({
                                type: 'POST',
                                url: activeOptions.url,
                                dataType: 'json',
                                data: { 'postObject': cellObject },
                                success: function() {
                                    active.removeClass('error blank ' + deletedClass).addClass(editedClass);
                                    if (typeof activeOptions.callback === "function") {
                                        activeOptions.callback();
                                    }
                                },
                                error: function() {
                                    active.removeClass(editedClass).addClass(deletedClass);
                                    active.html(originalContent);
                                    active.trigger(evt, originalAndCurrent);
                                }
                            });
                        }
                        return true;
                    },
                    movement = function(cell, keycode) {
                        if (keycode === ARROW_RIGHT) {
                            return cell.next('td');
                        } else if (keycode === ARROW_LEFT) {
                            return cell.prev('td');
                        } else if (keycode === ARROW_UP) {
                            return cell.parent().prev().children().eq(cell.index());
                        } else if (keycode === ARROW_DOWN) {
                            return cell.parent().next().children().eq(cell.index());
                        }
                        return [];
                    },
                    columnIsReadOnly = function(activeCell) {
                        var colIndex = activeCell.parent().children().index(activeCell);
                        var colHeader = activeCell
                            .parents('table')
                            .find('thead tr th:eq(' + colIndex + ')');
                        return colHeader.attr('readonly') && !colHeader.is('[readonly="false"]');
                    },
                    cellIsReadOnly = function(activeCell) {
                        return activeCell.attr('readonly') && !activeCell.is('[readonly="false"]');
                    },
                    buildEditors = function() {
                        var eds = { 'default': activeOptions.editor };
                        if (options && options.types) {
                            $.each(options.types, function(index, obj) {
                                if (obj) {
                                    switch (obj.type) {
                                    case 'dropdown':

                                        // construct select list
                                        var sel = $('<select>').attr('id', index);

                                        // Sorting of Dropdown [NONE | ID | TEXT]
                                        var sortable;
                                        if (obj.sort !== $.editableTable.dropdownSort.NONE) {
                                            // sort object list  --> array 
                                            sortable = [];
                                            for (var key in obj.source) {
                                                if (obj.source.hasOwnProperty(key)) {
                                                    var item = {};
                                                    item.Key = key;
                                                    item.Value = obj.source[key];
                                                    sortable.push(item);
                                                }
                                            }

                                            if (typeof sortable.sort === 'function') {
                                                sortable.sort(function(item1, item2) {
                                                    if (typeof (item1) === 'object' && typeof (item2) === 'object') {
                                                        if (obj.sort === $.editableTable.dropdownSort.ID) {
                                                            return item1.Key - item2.Key;
                                                        } else { // Default - sort by TEXT Value
                                                            if (typeof item1.Value === 'string' && typeof item2.Value === 'string') {
                                                                return item1.Value.localeCompare(item2.Value);
                                                            }
                                                            return item1 - item2;
                                                        }
                                                    } else if (typeof (item1) === 'string' && typeof (item2) === 'string') {
                                                        return item1.localeCompare(item2);
                                                    } else {
                                                        return item1 - item2;
                                                    }
                                                });
                                            }
                                        } else {
                                            sortable = obj.source;
                                        }

                                        $.each(sortable, function(sourceIndex, sourceVal) {
                                            if (sourceVal !== '') {
                                                if (typeof (sourceVal) === 'object') {
                                                    sel.append($('<option>').attr('value', sourceVal.Key).text(sourceVal.Value));
                                                } else {
                                                    sel.append($('<option>').attr('value', sourceIndex).text(sourceVal));
                                                }
                                            }
                                        });
                                        eds[index] = sel;

                                        // override existing val function
                                        eds[index].originalVal = eds[index].val;
                                        eds[index].val = function(value) {
                                            // getter
                                            if (typeof value == 'undefined') {
                                                if (active) {
                                                    // may want to move this to part of setActiveText - after success - although the update url will need this to be set so might be ok here!?
                                                    active.attr('data-value', this.originalVal());
                                                }

                                                // return Text
                                                return this.find('option:selected').text();
                                            }
                                            // setter
                                            else {
                                                var id = this.find('option').filter(function() {
                                                    return $.trim($(this).text()) === value;
                                                }).attr('value');

                                                return this.originalVal(id);
                                            }
                                        };
                                        break;
                                    case 'date':
                                        eds[index] = activeOptions.editor.clone(true, true);
                                        eds[index].isDate = true;
                                        break;
                                    case 'autocomplete':
                                        eds[index] = activeOptions.editor.clone(true, true);
                                        eds[index].isAutoComplete = true;

                                        $.getJSON(obj.url, null, function(data) {
                                            eds[index].source = data;

                                            $(eds[index]).typeahead({
                                                hint: false,
                                                highlight: true,
                                                minLength: 0
                                            },
                                            {
                                                name: 'data',
                                                source: SharedHelpers.SubstringMatcher(data)
                                            });
                                        });

                                        break;
                                    case 'multiline':
                                        eds[index] = $('<textarea>').attr('id', index).attr('rows', 5);

                                        break;
                                    }

                                    // append properties in obj
                                    if (eds[index]) {
                                        $.each(obj, function(property, value) {
                                            eds[index][property] = value;
                                        });
                                    }
                                }
                            });
                        };

                        $.each(eds, function(index, obj) {
                            if (activeOptions.editorsMaxWidth) {
                                obj.addClass('no-max-width');
                            }

                            obj.css('position', 'absolute')
                                .css('z-index', 999)
                                .hide()
                                .appendTo(element.parent())
                                .blur(function() {
                                    setActiveText();
                                    editor.hide();
                                }).keydown(function(e) {
                                    if (e.which === ENTER && !e.shiftKey) {
                                        setActiveText();
                                        editor.hide();
                                        active.focus();
                                        e.preventDefault();
                                        e.stopPropagation();
                                    } else if (e.which === ESC) {
                                        editor.val(active.text().trim());
                                        e.preventDefault();
                                        e.stopPropagation();
                                        editor.hide();
                                        active.focus();
                                    } else if (e.which === TAB) {
                                        active.focus();
                                    } else if (this.selectionEnd - this.selectionStart === this.value.length) {
                                        var possibleMove = movement(active, e.which);
                                        if (possibleMove.length > 0) {
                                            possibleMove.focus();
                                            e.preventDefault();
                                            e.stopPropagation();
                                        }
                                    }
                                })
                                .on('input paste', function() {
                                    var evt = $.Event('validate');
                                    active.trigger(evt, editor.val());
                                    if (evt.result === false) {
                                        editor.addClass('error');
                                    } else {
                                        editor.removeClass('error');
                                    }
                                });
                        });
                        return eds;
                    },
                    editors = buildEditors(),
                    getEditor = function(activeCell) {
                        var colName = getColumnName(activeCell);

                        var col = activeOptions.columns ? activeOptions.columns[colName] : null;

                        return col ? editors[col] : editors['default'];
                    },
                    showEditor = function(select) {
                        active = element.find('tbody td:focus');
                        if (active.length
                            && !cellIsReadOnly(active)
                            && !columnIsReadOnly(active)
                            && active.children().not('[type="hidden"]').length === 0) {
                            editor = getEditor(active);
                            editor.val(active.text().trim())
                                .removeClass('error')
                                .show()
                                .offset(active.offset())
                                .css(active.css(activeOptions.cloneProperties))
                                .width(active.width())
                                .height(active.height())
                                .focus();
                            if (select) {
                                editor.select();

                                if (editor.isDate === true && typeof $(editor).datetimepicker === 'function') {
                                    $(editor).datetimepicker({
                                        format: 'd M Y H:i',
                                        validateOnBlur: true,
                                        closeOnDateSelect: !editor.timePicker,
                                        timepicker: editor.timePicker || false,
                                        startDate: !isNaN(Date.parse(active.text())) ? new Date(active.text()) : new Date(),
                                        'onChangeDateTime': function(dateText, instance) {
                                            if (editor.fixedDayOfMonth && typeof moment === 'function') {
                                                dateText = moment(dateText, editor.dateFormat)
                                                    .date(editor.fixedDayOfMonth)
                                                    .format(editor.dateFormat || DATE_FORMAT);
                                            }

                                            instance.val(dateText);
                                            instance.datetimepicker('destroy');

                                            if (typeof moment === 'function') {
                                                dateText = moment(dateText).format(editor.dateFormat || DATE_FORMAT);
                                            }

                                            editor.val(dateText);
                                            editor.blur();
                                        }
                                    });
                                    $(editor).datetimepicker('show');
                                }

                                if (editor.isAutoComplete === true && typeof $(editor).typeahead === 'function') {
                                    var offset = active.offset();
                                    offset.top = offset.top + active.outerHeight();

                                    editor.siblings('.tt-menu').offset(offset);
                                    editor.typeahead('val', active.text().trim());
                                    editor.typeahead('open');
                                }
                            }
                        }
                    };

                element.on('click keypress dblclick', showEditor)
                    //.css('cursor', 'pointer')
                    .keydown(function(e) {
                        var prevent = true,
                            possibleMove = movement($(e.target), e.which);
                        if (possibleMove.length > 0) {
                            possibleMove.focus();
                        } else if (e.which === ENTER) {
                            showEditor(false);
                        } else if (e.which === 17 || e.which === 91 || e.which === 93) {
                            showEditor(true);
                            prevent = false;
                        } else {
                            prevent = false;
                        }
                        if (prevent) {
                            e.stopPropagation();
                            e.preventDefault();
                        }
                    });

                element.find('tbody td').prop('tabindex', 1);

                $(window).on('resize', function() {
                    if (editor && editor.is(':visible')) {
                        editor.offset(active.offset())
                            .width(active.width())
                            .height(active.height());
                    }
                });

                // Datatable integration - if editor is active and user scrolls - hide editor
                $('div.dataTables_scrollBody').scroll(function() {
                    if (editor) {
                        editor.hide();
                    }
                });

                tableEditors[element.attr('id')] = editors;

                return this;
            });
        };

        var $table = init($(this));
        this.Editors = tableEditors;
        return this;
    };

    $.editableTable = {};
    $.editableTable.dropdownSort = {
        NONE: 'NONE',
        TEXT: 'TEXT',
        ID: 'ID'
    };

    $.fn.editableTable = EditableTable;

    return $.fn.editableTable;
})(jQuery, window, document);