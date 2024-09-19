$(document).ajaxError(function (e, jqxhr, settings, exception) {
	e.stopPropagation();
	if (jqxhr != null) {

		var error = "";

		if (jqxhr.responseJSON != null) {
			if (jqxhr.responseJSON.Error != null) {
				error = jqxhr.responseJSON.Error;
			} else {
				var errors = jqxhr.responseJSON;

				$.each(errors, function (key, item) {
					error += "\\\\ " + item.errors[0] + " \\\\  \n";
				});
				alert(error);
			}
		} else if (jqxhr.statusText) {
			error = jqxhr.statusText;
		} else {
			error = "An error occurred trying to submit your data. Please try again and, if the problem persists, contact support.";
		}

		toastr.error(error);
	}
});
(function ($) {
	$.fn.changeElementType = function (newType) {
		var attrs = {};

		$.each(this[0].attributes, function (idx, attr) {
			attrs[attr.nodeName] = attr.nodeValue;
		});

		this.replaceWith(function () {
			return $("<" + newType + "/>", attrs).append($(this).contents());
		});
	}
})(jQuery);
$(document).ready(function () {
	// Wire up the close button
	$(".exit").click(function () { window.open('', '_self', '').close(); });
});
$(document).ready(function () {
	//Custom Sorting
	jQuery.extend(jQuery.fn.dataTableExt.oSort, {
		"jsPrefix-pre": function (a) {
			if (a.trim().toLowerCase().substring(0, 2) === "js") {
				return 2;
			}
			return 1;
		},

		"jsPrefix-asc": function (a, b) {
			return ((a < b) ? -1 : ((a > b) ? 1 : 0));
		},

		"jsPrefix-desc": function (a, b) {
			return ((a < b) ? 1 : ((a > b) ? -1 : 0));
		}
	});

	// Checkbox Sorting
	$.fn.dataTable.ext.order["dom-checkbox"] = function (settings, col) {
		return this.api().column(col, { order: "index" }).nodes().map(function (td, i) {
			return $("input", td).prop("checked") ? "1" : "0";
		});
	};
});


function getDaySuffix(day) {
	switch (day) {
		case 1:
		case 21:
		case 31:
			return "st";
		case 2:
		case 22:
			return "nd";
		case 3:
		case 23:
			return "rd";
		default:
			return "th";
	}
}
jQuery(document).ready(function () {
	SharedHelpers.DateTimeInit();
});


$(document).ready(function () {
	$("#mainContent").css("margin-top", $(".navbar").height() - 50);
});
function randomIntFromInterval(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}

$(document).ready(function () {
	if (randomIntFromInterval(1, 10) === 1) {
		var geckoNumber = randomIntFromInterval(2, 7);
		if (new Date().getDay() === 5) { //Friday for geckos, not for geckoes
			$(".GeckoAnchor").addClass('gecko' + geckoNumber);
		}
		geckoNumber = randomIntFromInterval(1, 7);
	}
	var geckoSpecial = 1;
	$("#gecko").click(function () {
		$("#gecko").removeClass('gecko1 gecko2 gecko3 gecko4 gecko5 gecko6 gecko7')
			.addClass('gecko' + geckoSpecial);
		if (geckoSpecial == 7) { geckoSpecial = 1; } else { geckoSpecial++; };
	});
});
$(document).ready(function () {
	var url = window.location.pathname;

	if (localStorage[url] === "true") {
		$('.row-offcanvas').addClass('active');
	} else {
		$('.row-offcanvas').removeClass('active');
	}

	$('[data-toggle="offcanvas"]').click(function () {
		$('.row-offcanvas').toggleClass('active');

		var visible = $('.row-offcanvas.active').length > 0;
		var url = window.location.pathname;
		localStorage[url] = visible;
	});
});
$(document).ready(function () {
	// Wire up the print button
	$(".print").click(function () {
		$(".unprintable").toggle(false);
		$(".printonly").toggle(true);
		$(".page-header").toggle(false);
		$(".left-sidebar").toggle(false);
		$(".header").toggle(false);
		$("body").css("padding-top", "0");
	});
});
$(document).ready(function () {
	// Enable Reload button
	$(".reloadWindow").click(function () {
		location.reload(true);
	});
});
$(document).ready(function () {
	// Allow Multiline Text boxes to be resized
	SharedHelpers.Resizable();
});
var SharedHelpers = function ($) {
	return {
		AddAntiForgeryToken: function (data) {
			data.__RequestVerificationToken = $('#__AjaxAntiForgeryForm input[name=__RequestVerificationToken]').val();
			return data;
		},
		StripCurrency: function (text) {
			return text.replace(/\,/g, '').replace('$', '').replace('\u00A3', ''); //\u00A3 == '£'
		},
		StripWhitespace: function (text) {
			return text.replace(/\s/g, '');
		},
		ColorScale: ["#3498db", "#1E824C", "#9b59b6", "#1abc9c", "#34495e", "#f1c40f", "#e67e22", "#FF6BE1", "#7f8c8d", "#BE90D4"],
		DateTimeInit: function () {
			$('.datetime').datetimepicker({
				format: 'd M Y H:i',
				validateOnBlur: true,
				hours12: false,
				//startDate: new Date(),
				scrollInput: false
			});

			$('.date').datetimepicker({
				format: 'd M Y',
				formatDate: 'd M Y',
				validateOnBlur: true,
				closeOnDateSelect: true,
				timepicker: false,
				//startDate: new Date(),
				scrollInput: false
			});
		},
		Resizable: function () {
			$(".resizable").resizable();
		},
		CaptureHtml: function (targetId) {
			$(".capture").click(function () {
				html2canvas($("#" + targetId), {
					onrendered: function (canvas) {
						canvas.toBlob(function (blob) {
							var filename = $(".page-header").text().trim();
							if (!filename) {
								filename = "@ViewBag.Title";
							}
							saveAs(blob, filename + ".png");
						});
					}
				});
			});
		},
		CaptureChart: function (targetId, filename, captureSelector) {
			if (!captureSelector) {
				captureSelector = ".capture";
			}

			$(captureSelector).click(function () {
				if (!filename) {
					filename = $(".page-header").text().trim() !== ""
						? $(".page-header").text().trim()
						: "@ViewBag.Title";
				}

				svgenie.save("#" + targetId, { name: filename + ".png" });
			});
		},
		SubstringMatcher: function (strs) {
			return function findMatches(q, cb) {

				// an array that will be populated with substring matches
				var matches = [];

				// regex used to determine if a string contains the substring `q`
				var substrRegex = new RegExp(q, 'i');

				// iterate through the pool of strings and for any string that
				// contains the substring `q`, add it to the `matches` array
				$.each(strs, function (i, str) {
					if (substrRegex.test(str)) {
						matches.push(str);
					}
				});

				cb(matches);
			};
		}
	};
}(jQuery);

toastr.options = {
	"positionClass": "toast-bottom-right"
};
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

		var init = function ($tbl) {
			$tbl.each(function () {
				var getColumnName = function (activeCell) {
					if (activeCell) {
						var colIndex = activeCell.parent().children().index(activeCell);

						return activeCell
							.parents('table')
							.find('thead tr th:eq(' + colIndex + ')')
							.attr('name');
					}
				};
				var buildDefaultOptions = function () {
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
					setActiveText = function () {
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
							active.contents().filter(function () {
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
								success: function () {
									active.removeClass('error blank ' + deletedClass).addClass(editedClass);
									if (typeof activeOptions.callback === "function") {
										activeOptions.callback();
									}
								},
								error: function () {
									active.removeClass(editedClass).addClass(deletedClass);
									active.html(originalContent);
									active.trigger(evt, originalAndCurrent);
								}
							});
						}
						return true;
					},
					movement = function (cell, keycode) {
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
					columnIsReadOnly = function (activeCell) {
						var colIndex = activeCell.parent().children().index(activeCell);
						var colHeader = activeCell
							.parents('table')
							.find('thead tr th:eq(' + colIndex + ')');
						return colHeader.attr('readonly') && !colHeader.is('[readonly="false"]');
					},
					cellIsReadOnly = function (activeCell) {
						return activeCell.attr('readonly') && !activeCell.is('[readonly="false"]');
					},
					buildEditors = function () {
						var eds = { 'default': activeOptions.editor };
						if (options && options.types) {
							$.each(options.types, function (index, obj) {
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
													sortable.sort(function (item1, item2) {
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

											$.each(sortable, function (sourceIndex, sourceVal) {
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
											eds[index].val = function (value) {
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
													var id = this.find('option').filter(function () {
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

											$.getJSON(obj.url, null, function (data) {
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
										$.each(obj, function (property, value) {
											eds[index][property] = value;
										});
									}
								}
							});
						};

						$.each(eds, function (index, obj) {
							if (activeOptions.editorsMaxWidth) {
								obj.addClass('no-max-width');
							}

							obj.css('position', 'absolute')
								.css('z-index', 999)
								.hide()
								.appendTo(element.parent())
								.blur(function () {
									setActiveText();
									editor.hide();
								}).keydown(function (e) {
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
								.on('input paste', function () {
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
					getEditor = function (activeCell) {
						var colName = getColumnName(activeCell);

						var col = activeOptions.columns ? activeOptions.columns[colName] : null;

						return col ? editors[col] : editors['default'];
					},
					showEditor = function (select) {
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
										'onChangeDateTime': function (dateText, instance) {
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
					.keydown(function (e) {
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

				$(window).on('resize', function () {
					if (editor && editor.is(':visible')) {
						editor.offset(active.offset())
							.width(active.width())
							.height(active.height());
					}
				});

				// Datatable integration - if editor is active and user scrolls - hide editor
				$('div.dataTables_scrollBody').scroll(function () {
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
/* global $ */
$.fn.numericTableWidget = function (options) {
	'use strict';
	var $table = $(this),
		footer = $table.find('tfoot tr'),
		totalColumnClass = options.totalColumnClass,
		excludeColumnClass = options.excludeColumnClass,
		deletedClass = options.deletedClass;

	var columnIndices = function (colClass) {
		var columns = [];
		$('thead th.' + colClass).each(function () {
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
				for (column = 1; column < footer.children().size(); column++) {
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
					$bodyRows.each(function (item, index) {
						if (!$(item).parent('tr').hasClass(options.deletedClass)) {
							names.push($(item).text());
						}
					});

					// Build a sorted list of names
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

					if (options.rowClickNewTab) {
						if ($(this).attr('href')) {
							window.open($(this).attr('href'), '_blank');
						}
					} else {
						if ($(this).attr('href')) {
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

			//$tbl.search( '' )
			//    .columns().search( '' )
			//    .draw();

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
					'colvis', 'copy', 'csv', 'excel', { extend: 'pdfHtml5', orientation: 'landscape' }
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
										column.search($(this).val());
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
/*
 * canvg.js - Javascript SVG parser and renderer on Canvas
 * MIT Licensed 
 * Gabe Lerner (gabelerner@gmail.com)
 * http://code.google.com/p/canvg/
 *
 * Requires: rgbcolor.js - http://www.phpied.com/rgb-color-parser-in-javascript/
 */
(function () {
	// canvg(target, s)
	// empty parameters: replace all 'svg' elements on page with 'canvas' elements
	// target: canvas element or the id of a canvas element
	// s: svg string, url to svg file, or xml document
	// opts: optional hash of options
	//		 ignoreMouse: true => ignore mouse events
	//		 ignoreAnimation: true => ignore animations
	//		 ignoreDimensions: true => does not try to resize canvas
	//		 ignoreClear: true => does not clear canvas
	//		 offsetX: int => draws at a x offset
	//		 offsetY: int => draws at a y offset
	//		 scaleWidth: int => scales horizontally to width
	//		 scaleHeight: int => scales vertically to height
	//		 renderCallback: function => will call the function after the first render is completed
	//		 forceRedraw: function => will call the function on every frame, if it returns true, will redraw
	this.canvg = function (target, s, opts) {
		// no parameters
		if (target == null && s == null && opts == null) {
			var svgTags = document.getElementsByTagName('svg');
			for (var i = 0; i < svgTags.length; i++) {
				var svgTag = svgTags[i];
				var c = document.createElement('canvas');
				c.width = svgTag.clientWidth;
				c.height = svgTag.clientHeight;
				svgTag.parentNode.insertBefore(c, svgTag);
				svgTag.parentNode.removeChild(svgTag);
				var div = document.createElement('div');
				div.appendChild(svgTag);
				canvg(c, div.innerHTML);
			}
			return;
		}
		opts = opts || {};

		if (typeof target == 'string') {
			target = document.getElementById(target);
		}

		// store class on canvas
		if (target.svg != null) target.svg.stop();
		target.svg = svg = build();
		svg.opts = opts;

		var ctx = target.getContext('2d');
		if (typeof (s.documentElement) != 'undefined') {
			// load from xml doc
			svg.loadXmlDoc(ctx, s);
		}
		else if (s.substr(0, 1) == '<') {
			// load from xml string
			svg.loadXml(ctx, s);
		}
		else {
			// load from url
			svg.load(ctx, s);
		}
	}

	function build() {
		var svg = {};

		svg.FRAMERATE = 30;
		svg.MAX_VIRTUAL_PIXELS = 30000;

		// globals
		svg.init = function (ctx) {
			svg.Definitions = {};
			svg.Styles = {};
			svg.Animations = [];
			svg.Images = [];
			svg.ctx = ctx;
			svg.ViewPort = new (function () {
				this.viewPorts = [];
				this.Clear = function () { this.viewPorts = []; }
				this.SetCurrent = function (width, height) { this.viewPorts.push({ width: width, height: height }); }
				this.RemoveCurrent = function () { this.viewPorts.pop(); }
				this.Current = function () { return this.viewPorts[this.viewPorts.length - 1]; }
				this.width = function () { return this.Current().width; }
				this.height = function () { return this.Current().height; }
				this.ComputeSize = function (d) {
					if (d != null && typeof (d) == 'number') return d;
					if (d == 'x') return this.width();
					if (d == 'y') return this.height();
					return Math.sqrt(Math.pow(this.width(), 2) + Math.pow(this.height(), 2)) / Math.sqrt(2);
				}
			});
		}
		svg.init();

		// images loaded
		svg.ImagesLoaded = function () {
			for (var i = 0; i < svg.Images.length; i++) {
				if (!svg.Images[i].loaded) return false;
			}
			return true;
		}

		// trim
		svg.trim = function (s) { return s.replace(/^\s+|\s+$/g, ''); }

		// compress spaces
		svg.compressSpaces = function (s) { return s.replace(/[\s\r\t\n]+/gm, ' '); }

		// ajax
		svg.ajax = function (url) {
			var AJAX;
			if (window.XMLHttpRequest) { AJAX = new XMLHttpRequest(); }
			else { AJAX = new ActiveXObject('Microsoft.XMLHTTP'); }
			if (AJAX) {
				AJAX.open('GET', url, false);
				AJAX.send(null);
				return AJAX.responseText;
			}
			return null;
		}

		// parse xml
		svg.parseXml = function (xml) {
			if (window.DOMParser) {
				var parser = new DOMParser();
				return parser.parseFromString(xml, 'text/xml');
			}
			else {
				xml = xml.replace(/<!DOCTYPE svg[^>]*>/, '');
				var xmlDoc = new ActiveXObject('Microsoft.XMLDOM');
				xmlDoc.async = 'false';
				xmlDoc.loadXML(xml);
				return xmlDoc;
			}
		}

		svg.Property = function (name, value) {
			this.name = name;
			this.value = value;
		}
		svg.Property.prototype.getValue = function () {
			return this.value;
		}

		svg.Property.prototype.hasValue = function () {
			return (this.value != null && this.value !== '');
		}

		// return the numerical value of the property
		svg.Property.prototype.numValue = function () {
			if (!this.hasValue()) return 0;

			var n = parseFloat(this.value);
			if ((this.value + '').match(/%$/)) {
				n = n / 100.0;
			}
			return n;
		}

		svg.Property.prototype.valueOrDefault = function (def) {
			if (this.hasValue()) return this.value;
			return def;
		}

		svg.Property.prototype.numValueOrDefault = function (def) {
			if (this.hasValue()) return this.numValue();
			return def;
		}

		// color extensions
		// augment the current color value with the opacity
		svg.Property.prototype.addOpacity = function (opacity) {
			var newValue = this.value;
			if (opacity != null && opacity != '' && typeof (this.value) == 'string') { // can only add opacity to colors, not patterns
				var color = new RGBColor(this.value);
				if (color.ok) {
					newValue = 'rgba(' + color.r + ', ' + color.g + ', ' + color.b + ', ' + opacity + ')';
				}
			}
			return new svg.Property(this.name, newValue);
		}

		// definition extensions
		// get the definition from the definitions table
		svg.Property.prototype.getDefinition = function () {
			var name = this.value.replace(/^(url\()?#([^\)]+)\)?$/, '$2');
			return svg.Definitions[name];
		}

		svg.Property.prototype.isUrlDefinition = function () {
			return this.value.indexOf('url(') == 0
		}

		svg.Property.prototype.getFillStyleDefinition = function (e) {
			var def = this.getDefinition();

			// gradient
			if (def != null && def.createGradient) {
				return def.createGradient(svg.ctx, e);
			}

			// pattern
			if (def != null && def.createPattern) {
				return def.createPattern(svg.ctx, e);
			}

			return null;
		}

		// length extensions
		svg.Property.prototype.getDPI = function (viewPort) {
			return 96.0; // TODO: compute?
		}

		svg.Property.prototype.getEM = function (viewPort) {
			var em = 12;

			var fontSize = new svg.Property('fontSize', svg.Font.Parse(svg.ctx.font).fontSize);
			if (fontSize.hasValue()) em = fontSize.toPixels(viewPort);

			return em;
		}

		svg.Property.prototype.getUnits = function () {
			var s = this.value + '';
			return s.replace(/[0-9\.\-]/g, '');
		}

		// get the length as pixels
		svg.Property.prototype.toPixels = function (viewPort) {
			if (!this.hasValue()) return 0;
			var s = this.value + '';
			if (s.match(/em$/)) return this.numValue() * this.getEM(viewPort);
			if (s.match(/ex$/)) return this.numValue() * this.getEM(viewPort) / 2.0;
			if (s.match(/px$/)) return this.numValue();
			if (s.match(/pt$/)) return this.numValue() * this.getDPI(viewPort) * (1.0 / 72.0);
			if (s.match(/pc$/)) return this.numValue() * 15;
			if (s.match(/cm$/)) return this.numValue() * this.getDPI(viewPort) / 2.54;
			if (s.match(/mm$/)) return this.numValue() * this.getDPI(viewPort) / 25.4;
			if (s.match(/in$/)) return this.numValue() * this.getDPI(viewPort);
			if (s.match(/%$/)) return this.numValue() * svg.ViewPort.ComputeSize(viewPort);
			return this.numValue();
		}

		// time extensions
		// get the time as milliseconds
		svg.Property.prototype.toMilliseconds = function () {
			if (!this.hasValue()) return 0;
			var s = this.value + '';
			if (s.match(/s$/)) return this.numValue() * 1000;
			if (s.match(/ms$/)) return this.numValue();
			return this.numValue();
		}

		// angle extensions
		// get the angle as radians
		svg.Property.prototype.toRadians = function () {
			if (!this.hasValue()) return 0;
			var s = this.value + '';
			if (s.match(/deg$/)) return this.numValue() * (Math.PI / 180.0);
			if (s.match(/grad$/)) return this.numValue() * (Math.PI / 200.0);
			if (s.match(/rad$/)) return this.numValue();
			return this.numValue() * (Math.PI / 180.0);
		}

		// fonts
		svg.Font = new (function () {
			this.Styles = 'normal|italic|oblique|inherit';
			this.Variants = 'normal|small-caps|inherit';
			this.Weights = 'normal|bold|bolder|lighter|100|200|300|400|500|600|700|800|900|inherit';

			this.CreateFont = function (fontStyle, fontVariant, fontWeight, fontSize, fontFamily, inherit) {
				var f = inherit != null ? this.Parse(inherit) : this.CreateFont('', '', '', '', '', svg.ctx.font);
				return {
					fontFamily: fontFamily || f.fontFamily,
					fontSize: fontSize || f.fontSize,
					fontStyle: fontStyle || f.fontStyle,
					fontWeight: fontWeight || f.fontWeight,
					fontVariant: fontVariant || f.fontVariant,
					toString: function () { return [this.fontStyle, this.fontVariant, this.fontWeight, this.fontSize, this.fontFamily].join(' ') }
				}
			}

			var that = this;
			this.Parse = function (s) {
				var f = {};
				var d = svg.trim(svg.compressSpaces(s || '')).split(' ');
				var set = { fontSize: false, fontStyle: false, fontWeight: false, fontVariant: false }
				var ff = '';
				for (var i = 0; i < d.length; i++) {
					if (!set.fontStyle && that.Styles.indexOf(d[i]) != -1) { if (d[i] != 'inherit') f.fontStyle = d[i]; set.fontStyle = true; }
					else if (!set.fontVariant && that.Variants.indexOf(d[i]) != -1) { if (d[i] != 'inherit') f.fontVariant = d[i]; set.fontStyle = set.fontVariant = true; }
					else if (!set.fontWeight && that.Weights.indexOf(d[i]) != -1) { if (d[i] != 'inherit') f.fontWeight = d[i]; set.fontStyle = set.fontVariant = set.fontWeight = true; }
					else if (!set.fontSize) { if (d[i] != 'inherit') f.fontSize = d[i].split('/')[0]; set.fontStyle = set.fontVariant = set.fontWeight = set.fontSize = true; }
					else { if (d[i] != 'inherit') ff += d[i]; }
				} if (ff != '') f.fontFamily = ff;
				return f;
			}
		});

		// points and paths
		svg.ToNumberArray = function (s) {
			var a = svg.trim(svg.compressSpaces((s || '').replace(/,/g, ' '))).split(' ');
			for (var i = 0; i < a.length; i++) {
				a[i] = parseFloat(a[i]);
			}
			return a;
		}
		svg.Point = function (x, y) {
			this.x = x;
			this.y = y;
		}
		svg.Point.prototype.angleTo = function (p) {
			return Math.atan2(p.y - this.y, p.x - this.x);
		}

		svg.Point.prototype.applyTransform = function (v) {
			var xp = this.x * v[0] + this.y * v[2] + v[4];
			var yp = this.x * v[1] + this.y * v[3] + v[5];
			this.x = xp;
			this.y = yp;
		}

		svg.CreatePoint = function (s) {
			var a = svg.ToNumberArray(s);
			return new svg.Point(a[0], a[1]);
		}
		svg.CreatePath = function (s) {
			var a = svg.ToNumberArray(s);
			var path = [];
			for (var i = 0; i < a.length; i += 2) {
				path.push(new svg.Point(a[i], a[i + 1]));
			}
			return path;
		}

		// bounding box
		svg.BoundingBox = function (x1, y1, x2, y2) { // pass in initial points if you want
			this.x1 = Number.NaN;
			this.y1 = Number.NaN;
			this.x2 = Number.NaN;
			this.y2 = Number.NaN;

			this.x = function () { return this.x1; }
			this.y = function () { return this.y1; }
			this.width = function () { return this.x2 - this.x1; }
			this.height = function () { return this.y2 - this.y1; }

			this.addPoint = function (x, y) {
				if (x != null) {
					if (isNaN(this.x1) || isNaN(this.x2)) {
						this.x1 = x;
						this.x2 = x;
					}
					if (x < this.x1) this.x1 = x;
					if (x > this.x2) this.x2 = x;
				}

				if (y != null) {
					if (isNaN(this.y1) || isNaN(this.y2)) {
						this.y1 = y;
						this.y2 = y;
					}
					if (y < this.y1) this.y1 = y;
					if (y > this.y2) this.y2 = y;
				}
			}
			this.addX = function (x) { this.addPoint(x, null); }
			this.addY = function (y) { this.addPoint(null, y); }

			this.addBoundingBox = function (bb) {
				this.addPoint(bb.x1, bb.y1);
				this.addPoint(bb.x2, bb.y2);
			}

			this.addQuadraticCurve = function (p0x, p0y, p1x, p1y, p2x, p2y) {
				var cp1x = p0x + 2 / 3 * (p1x - p0x); // CP1 = QP0 + 2/3 *(QP1-QP0)
				var cp1y = p0y + 2 / 3 * (p1y - p0y); // CP1 = QP0 + 2/3 *(QP1-QP0)
				var cp2x = cp1x + 1 / 3 * (p2x - p0x); // CP2 = CP1 + 1/3 *(QP2-QP0)
				var cp2y = cp1y + 1 / 3 * (p2y - p0y); // CP2 = CP1 + 1/3 *(QP2-QP0)
				this.addBezierCurve(p0x, p0y, cp1x, cp2x, cp1y, cp2y, p2x, p2y);
			}

			this.addBezierCurve = function (p0x, p0y, p1x, p1y, p2x, p2y, p3x, p3y) {
				// from http://blog.hackers-cafe.net/2009/06/how-to-calculate-bezier-curves-bounding.html
				var p0 = [p0x, p0y], p1 = [p1x, p1y], p2 = [p2x, p2y], p3 = [p3x, p3y];
				this.addPoint(p0[0], p0[1]);
				this.addPoint(p3[0], p3[1]);

				for (i = 0; i <= 1; i++) {
					var f = function (t) {
						return Math.pow(1 - t, 3) * p0[i]
							+ 3 * Math.pow(1 - t, 2) * t * p1[i]
							+ 3 * (1 - t) * Math.pow(t, 2) * p2[i]
							+ Math.pow(t, 3) * p3[i];
					}

					var b = 6 * p0[i] - 12 * p1[i] + 6 * p2[i];
					var a = -3 * p0[i] + 9 * p1[i] - 9 * p2[i] + 3 * p3[i];
					var c = 3 * p1[i] - 3 * p0[i];

					if (a == 0) {
						if (b == 0) continue;
						var t = -c / b;
						if (0 < t && t < 1) {
							if (i == 0) this.addX(f(t));
							if (i == 1) this.addY(f(t));
						}
						continue;
					}

					var b2ac = Math.pow(b, 2) - 4 * c * a;
					if (b2ac < 0) continue;
					var t1 = (-b + Math.sqrt(b2ac)) / (2 * a);
					if (0 < t1 && t1 < 1) {
						if (i == 0) this.addX(f(t1));
						if (i == 1) this.addY(f(t1));
					}
					var t2 = (-b - Math.sqrt(b2ac)) / (2 * a);
					if (0 < t2 && t2 < 1) {
						if (i == 0) this.addX(f(t2));
						if (i == 1) this.addY(f(t2));
					}
				}
			}

			this.isPointInBox = function (x, y) {
				return (this.x1 <= x && x <= this.x2 && this.y1 <= y && y <= this.y2);
			}

			this.addPoint(x1, y1);
			this.addPoint(x2, y2);
		}

		// transforms
		svg.Transform = function (v) {
			var that = this;
			this.Type = {}

			// translate
			this.Type.translate = function (s) {
				this.p = svg.CreatePoint(s);
				this.apply = function (ctx) {
					ctx.translate(this.p.x || 0.0, this.p.y || 0.0);
				}
				this.applyToPoint = function (p) {
					p.applyTransform([1, 0, 0, 1, this.p.x || 0.0, this.p.y || 0.0]);
				}
			}

			// rotate
			this.Type.rotate = function (s) {
				var a = svg.ToNumberArray(s);
				this.angle = new svg.Property('angle', a[0]);
				this.cx = a[1] || 0;
				this.cy = a[2] || 0;
				this.apply = function (ctx) {
					ctx.translate(this.cx, this.cy);
					ctx.rotate(this.angle.toRadians());
					ctx.translate(-this.cx, -this.cy);
				}
				this.applyToPoint = function (p) {
					var a = this.angle.toRadians();
					p.applyTransform([1, 0, 0, 1, this.p.x || 0.0, this.p.y || 0.0]);
					p.applyTransform([Math.cos(a), Math.sin(a), -Math.sin(a), Math.cos(a), 0, 0]);
					p.applyTransform([1, 0, 0, 1, -this.p.x || 0.0, -this.p.y || 0.0]);
				}
			}

			this.Type.scale = function (s) {
				this.p = svg.CreatePoint(s);
				this.apply = function (ctx) {
					ctx.scale(this.p.x || 1.0, this.p.y || this.p.x || 1.0);
				}
				this.applyToPoint = function (p) {
					p.applyTransform([this.p.x || 0.0, 0, 0, this.p.y || 0.0, 0, 0]);
				}
			}

			this.Type.matrix = function (s) {
				this.m = svg.ToNumberArray(s);
				this.apply = function (ctx) {
					ctx.transform(this.m[0], this.m[1], this.m[2], this.m[3], this.m[4], this.m[5]);
				}
				this.applyToPoint = function (p) {
					p.applyTransform(this.m);
				}
			}

			this.Type.SkewBase = function (s) {
				this.base = that.Type.matrix;
				this.base(s);
				this.angle = new svg.Property('angle', s);
			}
			this.Type.SkewBase.prototype = new this.Type.matrix;

			this.Type.skewX = function (s) {
				this.base = that.Type.SkewBase;
				this.base(s);
				this.m = [1, 0, Math.tan(this.angle.toRadians()), 1, 0, 0];
			}
			this.Type.skewX.prototype = new this.Type.SkewBase;

			this.Type.skewY = function (s) {
				this.base = that.Type.SkewBase;
				this.base(s);
				this.m = [1, Math.tan(this.angle.toRadians()), 0, 1, 0, 0];
			}
			this.Type.skewY.prototype = new this.Type.SkewBase;

			this.transforms = [];

			this.apply = function (ctx) {
				for (var i = 0; i < this.transforms.length; i++) {
					this.transforms[i].apply(ctx);
				}
			}

			this.applyToPoint = function (p) {
				for (var i = 0; i < this.transforms.length; i++) {
					this.transforms[i].applyToPoint(p);
				}
			}

			var data = svg.trim(svg.compressSpaces(v)).split(/\s(?=[a-z])/);
			for (var i = 0; i < data.length; i++) {
				var type = data[i].split('(')[0];
				var s = data[i].split('(')[1].replace(')', '');
				var transform = new this.Type[type](s);
				this.transforms.push(transform);
			}
		}

		// aspect ratio
		svg.AspectRatio = function (ctx, aspectRatio, width, desiredWidth, height, desiredHeight, minX, minY, refX, refY) {
			// aspect ratio - http://www.w3.org/TR/SVG/coords.html#PreserveAspectRatioAttribute
			aspectRatio = svg.compressSpaces(aspectRatio);
			aspectRatio = aspectRatio.replace(/^defer\s/, ''); // ignore defer
			var align = aspectRatio.split(' ')[0] || 'xMidYMid';
			var meetOrSlice = aspectRatio.split(' ')[1] || 'meet';

			// calculate scale
			var scaleX = width / desiredWidth;
			var scaleY = height / desiredHeight;
			var scaleMin = Math.min(scaleX, scaleY);
			var scaleMax = Math.max(scaleX, scaleY);
			if (meetOrSlice == 'meet') { desiredWidth *= scaleMin; desiredHeight *= scaleMin; }
			if (meetOrSlice == 'slice') { desiredWidth *= scaleMax; desiredHeight *= scaleMax; }

			refX = new svg.Property('refX', refX);
			refY = new svg.Property('refY', refY);
			if (refX.hasValue() && refY.hasValue()) {
				ctx.translate(-scaleMin * refX.toPixels('x'), -scaleMin * refY.toPixels('y'));
			}
			else {
				// align
				if (align.match(/^xMid/) && ((meetOrSlice == 'meet' && scaleMin == scaleY) || (meetOrSlice == 'slice' && scaleMax == scaleY))) ctx.translate(width / 2.0 - desiredWidth / 2.0, 0);
				if (align.match(/YMid$/) && ((meetOrSlice == 'meet' && scaleMin == scaleX) || (meetOrSlice == 'slice' && scaleMax == scaleX))) ctx.translate(0, height / 2.0 - desiredHeight / 2.0);
				if (align.match(/^xMax/) && ((meetOrSlice == 'meet' && scaleMin == scaleY) || (meetOrSlice == 'slice' && scaleMax == scaleY))) ctx.translate(width - desiredWidth, 0);
				if (align.match(/YMax$/) && ((meetOrSlice == 'meet' && scaleMin == scaleX) || (meetOrSlice == 'slice' && scaleMax == scaleX))) ctx.translate(0, height - desiredHeight);
			}

			// scale
			if (align == 'none') ctx.scale(scaleX, scaleY);
			else if (meetOrSlice == 'meet') ctx.scale(scaleMin, scaleMin);
			else if (meetOrSlice == 'slice') ctx.scale(scaleMax, scaleMax);

			// translate
			ctx.translate(minX == null ? 0 : -minX, minY == null ? 0 : -minY);
		}

		// elements
		svg.Element = {}

		svg.EmptyProperty = new svg.Property('EMPTY', '');

		svg.Element.ElementBase = function (node) {
			this.attributes = {};
			this.styles = {};
			this.children = [];

			// get or create attribute
			this.attribute = function (name, createIfNotExists) {
				var a = this.attributes[name];
				if (a != null) return a;

				if (createIfNotExists == true) { a = new svg.Property(name, ''); this.attributes[name] = a; }
				return a || svg.EmptyProperty;
			}

			// get or create style, crawls up node tree
			this.style = function (name, createIfNotExists) {
				var s = this.styles[name];
				if (s != null) return s;

				var a = this.attribute(name);
				if (a != null && a.hasValue()) {
					this.styles[name] = a; // move up to me to cache
					return a;
				}

				var p = this.parent;
				if (p != null) {
					var ps = p.style(name);
					if (ps != null && ps.hasValue()) {
						return ps;
					}
				}

				if (createIfNotExists == true) { s = new svg.Property(name, ''); this.styles[name] = s; }
				return s || svg.EmptyProperty;
			}

			// base render
			this.render = function (ctx) {
				// don't render display=none
				// don't render visibility=hidden
				// don't render opacity=0 as long as opacity style exists (!= EMPTY)
				if (this.style('display').value == 'none'
					|| this.attribute('visibility').value == 'hidden'
					|| (this.style('opacity').name !== "EMPTY" && this.style('opacity').value == 0)
				) {
					return;
				}


				ctx.save();
				this.setContext(ctx);
				// mask
				if (this.attribute('mask').hasValue()) {
					var mask = this.attribute('mask').getDefinition();
					if (mask != null) mask.apply(ctx, this);
				}
				else if (this.style('filter').hasValue()) {
					var filter = this.style('filter').getDefinition();
					if (filter != null) filter.apply(ctx, this);
				}
				else this.renderChildren(ctx);
				this.clearContext(ctx);
				ctx.restore();
			}

			// base set context
			this.setContext = function (ctx) {
				// OVERRIDE ME!
			}

			// base clear context
			this.clearContext = function (ctx) {
				// OVERRIDE ME!
			}

			// base render children
			this.renderChildren = function (ctx) {
				for (var i = 0; i < this.children.length; i++) {
					this.children[i].render(ctx);
				}
			}

			this.addChild = function (childNode, create) {
				var child = childNode;
				if (create) child = svg.CreateElement(childNode);
				child.parent = this;
				this.children.push(child);
			}

			if (node != null && node.nodeType == 1) { //ELEMENT_NODE
				// add children
				for (var i = 0; i < node.childNodes.length; i++) {
					var childNode = node.childNodes[i];
					if (childNode.nodeType == 1) this.addChild(childNode, true); //ELEMENT_NODE
				}

				// add attributes
				for (var i = 0; i < node.attributes.length; i++) {
					var attribute = node.attributes[i];
					this.attributes[attribute.nodeName] = new svg.Property(attribute.nodeName, attribute.nodeValue);
				}

				// add tag styles
				var styles = svg.Styles[node.nodeName];
				if (styles != null) {
					for (var name in styles) {
						this.styles[name] = styles[name];
					}
				}

				// add class styles
				if (this.attribute('class').hasValue()) {
					var classes = svg.compressSpaces(this.attribute('class').value).split(' ');
					for (var j = 0; j < classes.length; j++) {
						styles = svg.Styles['.' + classes[j]];
						if (styles != null) {
							for (var name in styles) {
								this.styles[name] = styles[name];
							}
						}
						styles = svg.Styles[node.nodeName + '.' + classes[j]];
						if (styles != null) {
							for (var name in styles) {
								this.styles[name] = styles[name];
							}
						}
					}
				}

				// add id styles
				if (this.attribute('id').hasValue()) {
					var styles = svg.Styles['#' + this.attribute('id').value];
					if (styles != null) {
						for (var name in styles) {
							this.styles[name] = styles[name];
						}
					}
				}

				// add inline styles
				if (this.attribute('style').hasValue()) {
					var styles = this.attribute('style').value.split(';');
					for (var i = 0; i < styles.length; i++) {
						if (svg.trim(styles[i]) != '') {
							var style = styles[i].split(':');
							var name = svg.trim(style[0]);
							var value = svg.trim(style[1]);
							this.styles[name] = new svg.Property(name, value);
						}
					}
				}

				// add id
				if (this.attribute('id').hasValue()) {
					if (svg.Definitions[this.attribute('id').value] == null) {
						svg.Definitions[this.attribute('id').value] = this;
					}
				}
			}
		}

		svg.Element.RenderedElementBase = function (node) {
			this.base = svg.Element.ElementBase;
			this.base(node);

			this.setContext = function (ctx) {
				// fill
				if (this.style('fill').isUrlDefinition()) {
					var fs = this.style('fill').getFillStyleDefinition(this);
					if (fs != null) ctx.fillStyle = fs;
				}
				else if (this.style('fill').hasValue()) {
					var fillStyle = this.style('fill');
					if (fillStyle.value == 'currentColor') fillStyle.value = this.style('color').value;
					ctx.fillStyle = (fillStyle.value == 'none' ? 'rgba(0,0,0,0)' : fillStyle.value);
				}
				if (this.style('fill-opacity').hasValue()) {
					var fillStyle = new svg.Property('fill', ctx.fillStyle);
					fillStyle = fillStyle.addOpacity(this.style('fill-opacity').value);
					ctx.fillStyle = fillStyle.value;
				}

				// stroke
				if (this.style('stroke').isUrlDefinition()) {
					var fs = this.style('stroke').getFillStyleDefinition(this);
					if (fs != null) ctx.strokeStyle = fs;
				}
				else if (this.style('stroke').hasValue()) {
					var strokeStyle = this.style('stroke');
					if (strokeStyle.value == 'currentColor') strokeStyle.value = this.style('color').value;
					ctx.strokeStyle = (strokeStyle.value == 'none' ? 'rgba(0,0,0,0)' : strokeStyle.value);
				}
				if (this.style('stroke-opacity').hasValue()) {
					var strokeStyle = new svg.Property('stroke', ctx.strokeStyle);
					strokeStyle = strokeStyle.addOpacity(this.style('stroke-opacity').value);
					ctx.strokeStyle = strokeStyle.value;
				}
				if (this.style('stroke-width').hasValue()) ctx.lineWidth = this.style('stroke-width').toPixels();
				if (this.style('stroke-linecap').hasValue()) ctx.lineCap = this.style('stroke-linecap').value;
				if (this.style('stroke-linejoin').hasValue()) ctx.lineJoin = this.style('stroke-linejoin').value;
				if (this.style('stroke-miterlimit').hasValue()) ctx.miterLimit = this.style('stroke-miterlimit').value;

				// font
				if (typeof (ctx.font) != 'undefined') {
					ctx.font = svg.Font.CreateFont(
						this.style('font-style').value,
						this.style('font-variant').value,
						this.style('font-weight').value,
						this.style('font-size').hasValue() ? this.style('font-size').toPixels() + 'px' : '',
						this.style('font-family').value).toString();
				}

				// transform
				if (this.attribute('transform').hasValue()) {
					var transform = new svg.Transform(this.attribute('transform').value);
					transform.apply(ctx);
				}

				// clip
				if (this.attribute('clip-path').hasValue()) {
					var clip = this.attribute('clip-path').getDefinition();
					if (clip != null) clip.apply(ctx);
				}

				// opacity
				if (this.style('opacity').hasValue()) {
					ctx.globalAlpha = this.style('opacity').numValue();
				}
			}
		}
		svg.Element.RenderedElementBase.prototype = new svg.Element.ElementBase;

		svg.Element.PathElementBase = function (node) {
			this.base = svg.Element.RenderedElementBase;
			this.base(node);

			this.path = function (ctx) {
				if (ctx != null) ctx.beginPath();
				return new svg.BoundingBox();
			}

			this.renderChildren = function (ctx) {
				this.path(ctx);
				svg.Mouse.checkPath(this, ctx);
				if (ctx.fillStyle != '') ctx.fill();
				if (ctx.strokeStyle != '') ctx.stroke();

				var markers = this.getMarkers();
				if (markers != null) {
					if (this.style('marker-start').isUrlDefinition()) {
						var marker = this.style('marker-start').getDefinition();
						marker.render(ctx, markers[0][0], markers[0][1]);
					}
					if (this.style('marker-mid').isUrlDefinition()) {
						var marker = this.style('marker-mid').getDefinition();
						for (var i = 1; i < markers.length - 1; i++) {
							marker.render(ctx, markers[i][0], markers[i][1]);
						}
					}
					if (this.style('marker-end').isUrlDefinition()) {
						var marker = this.style('marker-end').getDefinition();
						marker.render(ctx, markers[markers.length - 1][0], markers[markers.length - 1][1]);
					}
				}
			}

			this.getBoundingBox = function () {
				return this.path();
			}

			this.getMarkers = function () {
				return null;
			}
		}
		svg.Element.PathElementBase.prototype = new svg.Element.RenderedElementBase;

		// svg element
		svg.Element.svg = function (node) {
			this.base = svg.Element.RenderedElementBase;
			this.base(node);

			this.baseClearContext = this.clearContext;
			this.clearContext = function (ctx) {
				this.baseClearContext(ctx);
				svg.ViewPort.RemoveCurrent();
			}

			this.baseSetContext = this.setContext;
			this.setContext = function (ctx) {
				// initial values
				ctx.strokeStyle = 'rgba(0,0,0,0)';
				ctx.lineCap = 'butt';
				ctx.lineJoin = 'miter';
				ctx.miterLimit = 4;

				this.baseSetContext(ctx);

				// create new view port
				if (!this.attribute('x').hasValue()) this.attribute('x', true).value = 0;
				if (!this.attribute('y').hasValue()) this.attribute('y', true).value = 0;
				ctx.translate(this.attribute('x').toPixels('x'), this.attribute('y').toPixels('y'));

				var width = svg.ViewPort.width();
				var height = svg.ViewPort.height();

				if (!this.attribute('width').hasValue()) this.attribute('width', true).value = '100%';
				if (!this.attribute('height').hasValue()) this.attribute('height', true).value = '100%';
				if (typeof (this.root) == 'undefined') {
					width = this.attribute('width').toPixels('x');
					height = this.attribute('height').toPixels('y');

					var x = 0;
					var y = 0;
					if (this.attribute('refX').hasValue() && this.attribute('refY').hasValue()) {
						x = -this.attribute('refX').toPixels('x');
						y = -this.attribute('refY').toPixels('y');
					}

					ctx.beginPath();
					ctx.moveTo(x, y);
					ctx.lineTo(width, y);
					ctx.lineTo(width, height);
					ctx.lineTo(x, height);
					ctx.closePath();
					ctx.clip();
				}
				svg.ViewPort.SetCurrent(width, height);

				// viewbox
				if (this.attribute('viewBox').hasValue()) {
					var viewBox = svg.ToNumberArray(this.attribute('viewBox').value);
					var minX = viewBox[0];
					var minY = viewBox[1];
					width = viewBox[2];
					height = viewBox[3];

					svg.AspectRatio(ctx,
						this.attribute('preserveAspectRatio').value,
						svg.ViewPort.width(),
						width,
						svg.ViewPort.height(),
						height,
						minX,
						minY,
						this.attribute('refX').value,
						this.attribute('refY').value);

					svg.ViewPort.RemoveCurrent();
					svg.ViewPort.SetCurrent(viewBox[2], viewBox[3]);
				}
			}
		}
		svg.Element.svg.prototype = new svg.Element.RenderedElementBase;

		// rect element
		svg.Element.rect = function (node) {
			this.base = svg.Element.PathElementBase;
			this.base(node);

			this.path = function (ctx) {
				var x = this.attribute('x').toPixels('x');
				var y = this.attribute('y').toPixels('y');
				var width = this.attribute('width').toPixels('x');
				var height = this.attribute('height').toPixels('y');
				var rx = this.attribute('rx').toPixels('x');
				var ry = this.attribute('ry').toPixels('y');
				if (this.attribute('rx').hasValue() && !this.attribute('ry').hasValue()) ry = rx;
				if (this.attribute('ry').hasValue() && !this.attribute('rx').hasValue()) rx = ry;

				if (ctx != null) {
					ctx.beginPath();
					ctx.moveTo(x + rx, y);
					ctx.lineTo(x + width - rx, y);
					ctx.quadraticCurveTo(x + width, y, x + width, y + ry)
					ctx.lineTo(x + width, y + height - ry);
					ctx.quadraticCurveTo(x + width, y + height, x + width - rx, y + height)
					ctx.lineTo(x + rx, y + height);
					ctx.quadraticCurveTo(x, y + height, x, y + height - ry)
					ctx.lineTo(x, y + ry);
					ctx.quadraticCurveTo(x, y, x + rx, y)
					ctx.closePath();
				}

				return new svg.BoundingBox(x, y, x + width, y + height);
			}
		}
		svg.Element.rect.prototype = new svg.Element.PathElementBase;

		// circle element
		svg.Element.circle = function (node) {
			this.base = svg.Element.PathElementBase;
			this.base(node);

			this.path = function (ctx) {
				var cx = this.attribute('cx').toPixels('x');
				var cy = this.attribute('cy').toPixels('y');
				var r = this.attribute('r').toPixels();

				if (ctx != null) {
					ctx.beginPath();
					ctx.arc(cx, cy, r, 0, Math.PI * 2, true);
					ctx.closePath();
				}

				return new svg.BoundingBox(cx - r, cy - r, cx + r, cy + r);
			}
		}
		svg.Element.circle.prototype = new svg.Element.PathElementBase;

		// ellipse element
		svg.Element.ellipse = function (node) {
			this.base = svg.Element.PathElementBase;
			this.base(node);

			this.path = function (ctx) {
				var KAPPA = 4 * ((Math.sqrt(2) - 1) / 3);
				var rx = this.attribute('rx').toPixels('x');
				var ry = this.attribute('ry').toPixels('y');
				var cx = this.attribute('cx').toPixels('x');
				var cy = this.attribute('cy').toPixels('y');

				if (ctx != null) {
					ctx.beginPath();
					ctx.moveTo(cx, cy - ry);
					ctx.bezierCurveTo(cx + (KAPPA * rx), cy - ry, cx + rx, cy - (KAPPA * ry), cx + rx, cy);
					ctx.bezierCurveTo(cx + rx, cy + (KAPPA * ry), cx + (KAPPA * rx), cy + ry, cx, cy + ry);
					ctx.bezierCurveTo(cx - (KAPPA * rx), cy + ry, cx - rx, cy + (KAPPA * ry), cx - rx, cy);
					ctx.bezierCurveTo(cx - rx, cy - (KAPPA * ry), cx - (KAPPA * rx), cy - ry, cx, cy - ry);
					ctx.closePath();
				}

				return new svg.BoundingBox(cx - rx, cy - ry, cx + rx, cy + ry);
			}
		}
		svg.Element.ellipse.prototype = new svg.Element.PathElementBase;

		// line element
		svg.Element.line = function (node) {
			this.base = svg.Element.PathElementBase;
			this.base(node);

			this.getPoints = function () {
				return [
					new svg.Point(this.attribute('x1').toPixels('x'), this.attribute('y1').toPixels('y')),
					new svg.Point(this.attribute('x2').toPixels('x'), this.attribute('y2').toPixels('y'))];
			}

			this.path = function (ctx) {
				var points = this.getPoints();

				if (ctx != null) {
					ctx.beginPath();
					ctx.moveTo(points[0].x, points[0].y);
					ctx.lineTo(points[1].x, points[1].y);
				}

				return new svg.BoundingBox(points[0].x, points[0].y, points[1].x, points[1].y);
			}

			this.getMarkers = function () {
				var points = this.getPoints();
				var a = points[0].angleTo(points[1]);
				return [[points[0], a], [points[1], a]];
			}
		}
		svg.Element.line.prototype = new svg.Element.PathElementBase;

		// polyline element
		svg.Element.polyline = function (node) {
			this.base = svg.Element.PathElementBase;
			this.base(node);

			this.points = svg.CreatePath(this.attribute('points').value);
			this.path = function (ctx) {
				var bb = new svg.BoundingBox(this.points[0].x, this.points[0].y);
				if (ctx != null) {
					ctx.beginPath();
					ctx.moveTo(this.points[0].x, this.points[0].y);
				}
				for (var i = 1; i < this.points.length; i++) {
					bb.addPoint(this.points[i].x, this.points[i].y);
					if (ctx != null) ctx.lineTo(this.points[i].x, this.points[i].y);
				}
				return bb;
			}

			this.getMarkers = function () {
				var markers = [];
				for (var i = 0; i < this.points.length - 1; i++) {
					markers.push([this.points[i], this.points[i].angleTo(this.points[i + 1])]);
				}
				markers.push([this.points[this.points.length - 1], markers[markers.length - 1][1]]);
				return markers;
			}
		}
		svg.Element.polyline.prototype = new svg.Element.PathElementBase;

		// polygon element
		svg.Element.polygon = function (node) {
			this.base = svg.Element.polyline;
			this.base(node);

			this.basePath = this.path;
			this.path = function (ctx) {
				var bb = this.basePath(ctx);
				if (ctx != null) {
					ctx.lineTo(this.points[0].x, this.points[0].y);
					ctx.closePath();
				}
				return bb;
			}
		}
		svg.Element.polygon.prototype = new svg.Element.polyline;

		// path element
		svg.Element.path = function (node) {
			this.base = svg.Element.PathElementBase;
			this.base(node);

			var d = this.attribute('d').value;
			// TODO: convert to real lexer based on http://www.w3.org/TR/SVG11/paths.html#PathDataBNF
			d = d.replace(/,/gm, ' '); // get rid of all commas
			d = d.replace(/([MmZzLlHhVvCcSsQqTtAa])([MmZzLlHhVvCcSsQqTtAa])/gm, '$1 $2'); // separate commands from commands
			d = d.replace(/([MmZzLlHhVvCcSsQqTtAa])([MmZzLlHhVvCcSsQqTtAa])/gm, '$1 $2'); // separate commands from commands
			d = d.replace(/([MmZzLlHhVvCcSsQqTtAa])([^\s])/gm, '$1 $2'); // separate commands from points
			d = d.replace(/([^\s])([MmZzLlHhVvCcSsQqTtAa])/gm, '$1 $2'); // separate commands from points
			d = d.replace(/([0-9])([+\-])/gm, '$1 $2'); // separate digits when no comma
			d = d.replace(/(\.[0-9]*)(\.)/gm, '$1 $2'); // separate digits when no comma
			d = d.replace(/([Aa](\s+[0-9]+){3})\s+([01])\s*([01])/gm, '$1 $3 $4 '); // shorthand elliptical arc path syntax
			d = svg.compressSpaces(d); // compress multiple spaces
			d = svg.trim(d);
			this.PathParser = new (function (d) {
				this.tokens = d.split(' ');

				this.reset = function () {
					this.i = -1;
					this.command = '';
					this.previousCommand = '';
					this.start = new svg.Point(0, 0);
					this.control = new svg.Point(0, 0);
					this.current = new svg.Point(0, 0);
					this.points = [];
					this.angles = [];
				}

				this.isEnd = function () {
					return this.i >= this.tokens.length - 1;
				}

				this.isCommandOrEnd = function () {
					if (this.isEnd()) return true;
					return this.tokens[this.i + 1].match(/^[A-Za-z]$/) != null;
				}

				this.isRelativeCommand = function () {
					switch (this.command) {
						case 'm':
						case 'l':
						case 'h':
						case 'v':
						case 'c':
						case 's':
						case 'q':
						case 't':
						case 'a':
						case 'z':
							return true;
							break;
					}
					return false;
				}

				this.getToken = function () {
					this.i++;
					return this.tokens[this.i];
				}

				this.getScalar = function () {
					return parseFloat(this.getToken());
				}

				this.nextCommand = function () {
					this.previousCommand = this.command;
					this.command = this.getToken();
				}

				this.getPoint = function () {
					var p = new svg.Point(this.getScalar(), this.getScalar());
					return this.makeAbsolute(p);
				}

				this.getAsControlPoint = function () {
					var p = this.getPoint();
					this.control = p;
					return p;
				}

				this.getAsCurrentPoint = function () {
					var p = this.getPoint();
					this.current = p;
					return p;
				}

				this.getReflectedControlPoint = function () {
					if (this.previousCommand.toLowerCase() != 'c' && this.previousCommand.toLowerCase() != 's') {
						return this.current;
					}

					// reflect point
					var p = new svg.Point(2 * this.current.x - this.control.x, 2 * this.current.y - this.control.y);
					return p;
				}

				this.makeAbsolute = function (p) {
					if (this.isRelativeCommand()) {
						p.x += this.current.x;
						p.y += this.current.y;
					}
					return p;
				}

				this.addMarker = function (p, from, priorTo) {
					// if the last angle isn't filled in because we didn't have this point yet ...
					if (priorTo != null && this.angles.length > 0 && this.angles[this.angles.length - 1] == null) {
						this.angles[this.angles.length - 1] = this.points[this.points.length - 1].angleTo(priorTo);
					}
					this.addMarkerAngle(p, from == null ? null : from.angleTo(p));
				}

				this.addMarkerAngle = function (p, a) {
					this.points.push(p);
					this.angles.push(a);
				}

				this.getMarkerPoints = function () { return this.points; }
				this.getMarkerAngles = function () {
					for (var i = 0; i < this.angles.length; i++) {
						if (this.angles[i] == null) {
							for (var j = i + 1; j < this.angles.length; j++) {
								if (this.angles[j] != null) {
									this.angles[i] = this.angles[j];
									break;
								}
							}
						}
					}
					return this.angles;
				}
			})(d);

			this.path = function (ctx) {
				var pp = this.PathParser;
				pp.reset();

				var bb = new svg.BoundingBox();
				if (ctx != null) ctx.beginPath();
				while (!pp.isEnd()) {
					pp.nextCommand();
					switch (pp.command) {
						case 'M':
						case 'm':
							var p = pp.getAsCurrentPoint();
							pp.addMarker(p);
							bb.addPoint(p.x, p.y);
							if (ctx != null) ctx.moveTo(p.x, p.y);
							pp.start = pp.current;
							while (!pp.isCommandOrEnd()) {
								var p = pp.getAsCurrentPoint();
								pp.addMarker(p, pp.start);
								bb.addPoint(p.x, p.y);
								if (ctx != null) ctx.lineTo(p.x, p.y);
							}
							break;
						case 'L':
						case 'l':
							while (!pp.isCommandOrEnd()) {
								var c = pp.current;
								var p = pp.getAsCurrentPoint();
								pp.addMarker(p, c);
								bb.addPoint(p.x, p.y);
								if (ctx != null) ctx.lineTo(p.x, p.y);
							}
							break;
						case 'H':
						case 'h':
							while (!pp.isCommandOrEnd()) {
								var newP = new svg.Point((pp.isRelativeCommand() ? pp.current.x : 0) + pp.getScalar(), pp.current.y);
								pp.addMarker(newP, pp.current);
								pp.current = newP;
								bb.addPoint(pp.current.x, pp.current.y);
								if (ctx != null) ctx.lineTo(pp.current.x, pp.current.y);
							}
							break;
						case 'V':
						case 'v':
							while (!pp.isCommandOrEnd()) {
								var newP = new svg.Point(pp.current.x, (pp.isRelativeCommand() ? pp.current.y : 0) + pp.getScalar());
								pp.addMarker(newP, pp.current);
								pp.current = newP;
								bb.addPoint(pp.current.x, pp.current.y);
								if (ctx != null) ctx.lineTo(pp.current.x, pp.current.y);
							}
							break;
						case 'C':
						case 'c':
							while (!pp.isCommandOrEnd()) {
								var curr = pp.current;
								var p1 = pp.getPoint();
								var cntrl = pp.getAsControlPoint();
								var cp = pp.getAsCurrentPoint();
								pp.addMarker(cp, cntrl, p1);
								bb.addBezierCurve(curr.x, curr.y, p1.x, p1.y, cntrl.x, cntrl.y, cp.x, cp.y);
								if (ctx != null) ctx.bezierCurveTo(p1.x, p1.y, cntrl.x, cntrl.y, cp.x, cp.y);
							}
							break;
						case 'S':
						case 's':
							while (!pp.isCommandOrEnd()) {
								var curr = pp.current;
								var p1 = pp.getReflectedControlPoint();
								var cntrl = pp.getAsControlPoint();
								var cp = pp.getAsCurrentPoint();
								pp.addMarker(cp, cntrl, p1);
								bb.addBezierCurve(curr.x, curr.y, p1.x, p1.y, cntrl.x, cntrl.y, cp.x, cp.y);
								if (ctx != null) ctx.bezierCurveTo(p1.x, p1.y, cntrl.x, cntrl.y, cp.x, cp.y);
							}
							break;
						case 'Q':
						case 'q':
							while (!pp.isCommandOrEnd()) {
								var curr = pp.current;
								var cntrl = pp.getAsControlPoint();
								var cp = pp.getAsCurrentPoint();
								pp.addMarker(cp, cntrl, cntrl);
								bb.addQuadraticCurve(curr.x, curr.y, cntrl.x, cntrl.y, cp.x, cp.y);
								if (ctx != null) ctx.quadraticCurveTo(cntrl.x, cntrl.y, cp.x, cp.y);
							}
							break;
						case 'T':
						case 't':
							while (!pp.isCommandOrEnd()) {
								var curr = pp.current;
								var cntrl = pp.getReflectedControlPoint();
								pp.control = cntrl;
								var cp = pp.getAsCurrentPoint();
								pp.addMarker(cp, cntrl, cntrl);
								bb.addQuadraticCurve(curr.x, curr.y, cntrl.x, cntrl.y, cp.x, cp.y);
								if (ctx != null) ctx.quadraticCurveTo(cntrl.x, cntrl.y, cp.x, cp.y);
							}
							break;
						case 'A':
						case 'a':
							while (!pp.isCommandOrEnd()) {
								var curr = pp.current;
								var rx = pp.getScalar();
								var ry = pp.getScalar();
								var xAxisRotation = pp.getScalar() * (Math.PI / 180.0);
								var largeArcFlag = pp.getScalar();
								var sweepFlag = pp.getScalar();
								var cp = pp.getAsCurrentPoint();

								// Conversion from endpoint to center parameterization
								// http://www.w3.org/TR/SVG11/implnote.html#ArcImplementationNotes
								// x1', y1'
								var currp = new svg.Point(
									Math.cos(xAxisRotation) * (curr.x - cp.x) / 2.0 + Math.sin(xAxisRotation) * (curr.y - cp.y) / 2.0,
									-Math.sin(xAxisRotation) * (curr.x - cp.x) / 2.0 + Math.cos(xAxisRotation) * (curr.y - cp.y) / 2.0
								);
								// adjust radii
								var l = Math.pow(currp.x, 2) / Math.pow(rx, 2) + Math.pow(currp.y, 2) / Math.pow(ry, 2);
								if (l > 1) {
									rx *= Math.sqrt(l);
									ry *= Math.sqrt(l);
								}
								// cx', cy'
								var s = (largeArcFlag == sweepFlag ? -1 : 1) * Math.sqrt(
									((Math.pow(rx, 2) * Math.pow(ry, 2)) - (Math.pow(rx, 2) * Math.pow(currp.y, 2)) - (Math.pow(ry, 2) * Math.pow(currp.x, 2))) /
									(Math.pow(rx, 2) * Math.pow(currp.y, 2) + Math.pow(ry, 2) * Math.pow(currp.x, 2))
								);
								if (isNaN(s)) s = 0;
								var cpp = new svg.Point(s * rx * currp.y / ry, s * -ry * currp.x / rx);
								// cx, cy
								var centp = new svg.Point(
									(curr.x + cp.x) / 2.0 + Math.cos(xAxisRotation) * cpp.x - Math.sin(xAxisRotation) * cpp.y,
									(curr.y + cp.y) / 2.0 + Math.sin(xAxisRotation) * cpp.x + Math.cos(xAxisRotation) * cpp.y
								);
								// vector magnitude
								var m = function (v) { return Math.sqrt(Math.pow(v[0], 2) + Math.pow(v[1], 2)); }
								// ratio between two vectors
								var r = function (u, v) { return (u[0] * v[0] + u[1] * v[1]) / (m(u) * m(v)) }
								// angle between two vectors
								var a = function (u, v) { return (u[0] * v[1] < u[1] * v[0] ? -1 : 1) * Math.acos(r(u, v)); }
								// initial angle
								var a1 = a([1, 0], [(currp.x - cpp.x) / rx, (currp.y - cpp.y) / ry]);
								// angle delta
								var u = [(currp.x - cpp.x) / rx, (currp.y - cpp.y) / ry];
								var v = [(-currp.x - cpp.x) / rx, (-currp.y - cpp.y) / ry];
								var ad = a(u, v);
								if (r(u, v) <= -1) ad = Math.PI;
								if (r(u, v) >= 1) ad = 0;

								if (sweepFlag == 0 && ad > 0) ad = ad - 2 * Math.PI;
								if (sweepFlag == 1 && ad < 0) ad = ad + 2 * Math.PI;

								// for markers
								var halfWay = new svg.Point(
									centp.x + rx * Math.cos((a1 + (a1 + ad)) / 2),
									centp.y + ry * Math.sin((a1 + (a1 + ad)) / 2)
								);
								pp.addMarkerAngle(halfWay, (a1 + (a1 + ad)) / 2 + (sweepFlag == 0 ? -1 : 1) * Math.PI / 2);
								pp.addMarkerAngle(cp, (a1 + ad) + (sweepFlag == 0 ? -1 : 1) * Math.PI / 2);

								bb.addPoint(cp.x, cp.y); // TODO: this is too naive, make it better
								if (ctx != null) {
									var r = rx > ry ? rx : ry;
									var sx = rx > ry ? 1 : rx / ry;
									var sy = rx > ry ? ry / rx : 1;

									ctx.translate(centp.x, centp.y);
									ctx.rotate(xAxisRotation);
									ctx.scale(sx, sy);
									ctx.arc(0, 0, r, a1, a1 + ad, 1 - sweepFlag);
									ctx.scale(1 / sx, 1 / sy);
									ctx.rotate(-xAxisRotation);
									ctx.translate(-centp.x, -centp.y);
								}
							}
							break;
						case 'Z':
						case 'z':
							if (ctx != null) ctx.closePath();
							pp.current = pp.start;
					}
				}

				return bb;
			}

			this.getMarkers = function () {
				var points = this.PathParser.getMarkerPoints();
				var angles = this.PathParser.getMarkerAngles();

				var markers = [];
				for (var i = 0; i < points.length; i++) {
					markers.push([points[i], angles[i]]);
				}
				return markers;
			}
		}
		svg.Element.path.prototype = new svg.Element.PathElementBase;

		// pattern element
		svg.Element.pattern = function (node) {
			this.base = svg.Element.ElementBase;
			this.base(node);

			this.createPattern = function (ctx, element) {
				// render me using a temporary svg element
				var tempSvg = new svg.Element.svg();
				tempSvg.attributes['viewBox'] = new svg.Property('viewBox', this.attribute('viewBox').value);
				tempSvg.attributes['x'] = new svg.Property('x', this.attribute('x').value);
				tempSvg.attributes['y'] = new svg.Property('y', this.attribute('y').value);
				tempSvg.attributes['width'] = new svg.Property('width', this.attribute('width').value);
				tempSvg.attributes['height'] = new svg.Property('height', this.attribute('height').value);
				tempSvg.children = this.children;

				var c = document.createElement('canvas');
				document.body.appendChild(c);
				c.width = this.attribute('width').toPixels('x') + this.attribute('x').toPixels('x');
				c.height = this.attribute('height').toPixels('y') + this.attribute('y').toPixels('y');
				tempSvg.render(c.getContext('2d'));
				return ctx.createPattern(c, 'repeat');
			}
		}
		svg.Element.pattern.prototype = new svg.Element.ElementBase;

		// marker element
		svg.Element.marker = function (node) {
			this.base = svg.Element.ElementBase;
			this.base(node);

			this.baseRender = this.render;
			this.render = function (ctx, point, angle) {
				ctx.translate(point.x, point.y);
				if (this.attribute('orient').valueOrDefault('auto') == 'auto') ctx.rotate(angle);
				if (this.attribute('markerUnits').valueOrDefault('strokeWidth') == 'strokeWidth') ctx.scale(ctx.lineWidth, ctx.lineWidth);
				ctx.save();

				// render me using a temporary svg element
				var tempSvg = new svg.Element.svg();
				tempSvg.attributes['viewBox'] = new svg.Property('viewBox', this.attribute('viewBox').value);
				tempSvg.attributes['refX'] = new svg.Property('refX', this.attribute('refX').value);
				tempSvg.attributes['refY'] = new svg.Property('refY', this.attribute('refY').value);
				tempSvg.attributes['width'] = new svg.Property('width', this.attribute('markerWidth').value);
				tempSvg.attributes['height'] = new svg.Property('height', this.attribute('markerHeight').value);
				tempSvg.attributes['fill'] = new svg.Property('fill', this.attribute('fill').valueOrDefault('black'));
				tempSvg.attributes['stroke'] = new svg.Property('stroke', this.attribute('stroke').valueOrDefault('none'));
				tempSvg.children = this.children;
				tempSvg.render(ctx);

				ctx.restore();
				if (this.attribute('markerUnits').valueOrDefault('strokeWidth') == 'strokeWidth') ctx.scale(1 / ctx.lineWidth, 1 / ctx.lineWidth);
				if (this.attribute('orient').valueOrDefault('auto') == 'auto') ctx.rotate(-angle);
				ctx.translate(-point.x, -point.y);
			}
		}
		svg.Element.marker.prototype = new svg.Element.ElementBase;

		// definitions element
		svg.Element.defs = function (node) {
			this.base = svg.Element.ElementBase;
			this.base(node);

			this.render = function (ctx) {
				// NOOP
			}
		}
		svg.Element.defs.prototype = new svg.Element.ElementBase;

		// base for gradients
		svg.Element.GradientBase = function (node) {
			this.base = svg.Element.ElementBase;
			this.base(node);

			this.gradientUnits = this.attribute('gradientUnits').valueOrDefault('objectBoundingBox');

			this.stops = [];
			for (var i = 0; i < this.children.length; i++) {
				var child = this.children[i];
				this.stops.push(child);
			}

			this.getGradient = function () {
				// OVERRIDE ME!
			}

			this.createGradient = function (ctx, element) {
				var stopsContainer = this;
				if (this.attribute('xlink:href').hasValue()) {
					stopsContainer = this.attribute('xlink:href').getDefinition();
				}

				var g = this.getGradient(ctx, element);
				if (g == null) return stopsContainer.stops[stopsContainer.stops.length - 1].color;
				for (var i = 0; i < stopsContainer.stops.length; i++) {
					g.addColorStop(stopsContainer.stops[i].offset, stopsContainer.stops[i].color);
				}

				if (this.attribute('gradientTransform').hasValue()) {
					// render as transformed pattern on temporary canvas
					var rootView = svg.ViewPort.viewPorts[0];

					var rect = new svg.Element.rect();
					rect.attributes['x'] = new svg.Property('x', -svg.MAX_VIRTUAL_PIXELS / 3.0);
					rect.attributes['y'] = new svg.Property('y', -svg.MAX_VIRTUAL_PIXELS / 3.0);
					rect.attributes['width'] = new svg.Property('width', svg.MAX_VIRTUAL_PIXELS);
					rect.attributes['height'] = new svg.Property('height', svg.MAX_VIRTUAL_PIXELS);

					var group = new svg.Element.g();
					group.attributes['transform'] = new svg.Property('transform', this.attribute('gradientTransform').value);
					group.children = [rect];

					var tempSvg = new svg.Element.svg();
					tempSvg.attributes['x'] = new svg.Property('x', 0);
					tempSvg.attributes['y'] = new svg.Property('y', 0);
					tempSvg.attributes['width'] = new svg.Property('width', rootView.width);
					tempSvg.attributes['height'] = new svg.Property('height', rootView.height);
					tempSvg.children = [group];

					var c = document.createElement('canvas');
					c.width = rootView.width;
					c.height = rootView.height;
					var tempCtx = c.getContext('2d');
					tempCtx.fillStyle = g;
					tempSvg.render(tempCtx);
					return tempCtx.createPattern(c, 'no-repeat');
				}

				return g;
			}
		}
		svg.Element.GradientBase.prototype = new svg.Element.ElementBase;

		// linear gradient element
		svg.Element.linearGradient = function (node) {
			this.base = svg.Element.GradientBase;
			this.base(node);

			this.getGradient = function (ctx, element) {
				var bb = element.getBoundingBox();

				var x1 = (this.gradientUnits == 'objectBoundingBox'
					? bb.x() + bb.width() * this.attribute('x1').numValue()
					: this.attribute('x1').toPixels('x'));
				var y1 = (this.gradientUnits == 'objectBoundingBox'
					? bb.y() + bb.height() * this.attribute('y1').numValue()
					: this.attribute('y1').toPixels('y'));
				var x2 = (this.gradientUnits == 'objectBoundingBox'
					? bb.x() + bb.width() * this.attribute('x2').numValue()
					: this.attribute('x2').toPixels('x'));
				var y2 = (this.gradientUnits == 'objectBoundingBox'
					? bb.y() + bb.height() * this.attribute('y2').numValue()
					: this.attribute('y2').toPixels('y'));

				if (x1 == x2 && y1 == y2) return null;
				return ctx.createLinearGradient(x1, y1, x2, y2);
			}
		}
		svg.Element.linearGradient.prototype = new svg.Element.GradientBase;

		// radial gradient element
		svg.Element.radialGradient = function (node) {
			this.base = svg.Element.GradientBase;
			this.base(node);

			this.getGradient = function (ctx, element) {
				var bb = element.getBoundingBox();

				if (!this.attribute('cx').hasValue()) this.attribute('cx', true).value = '50%';
				if (!this.attribute('cy').hasValue()) this.attribute('cy', true).value = '50%';
				if (!this.attribute('r').hasValue()) this.attribute('r', true).value = '50%';

				var cx = (this.gradientUnits == 'objectBoundingBox'
					? bb.x() + bb.width() * this.attribute('cx').numValue()
					: this.attribute('cx').toPixels('x'));
				var cy = (this.gradientUnits == 'objectBoundingBox'
					? bb.y() + bb.height() * this.attribute('cy').numValue()
					: this.attribute('cy').toPixels('y'));

				var fx = cx;
				var fy = cy;
				if (this.attribute('fx').hasValue()) {
					fx = (this.gradientUnits == 'objectBoundingBox'
						? bb.x() + bb.width() * this.attribute('fx').numValue()
						: this.attribute('fx').toPixels('x'));
				}
				if (this.attribute('fy').hasValue()) {
					fy = (this.gradientUnits == 'objectBoundingBox'
						? bb.y() + bb.height() * this.attribute('fy').numValue()
						: this.attribute('fy').toPixels('y'));
				}

				var r = (this.gradientUnits == 'objectBoundingBox'
					? (bb.width() + bb.height()) / 2.0 * this.attribute('r').numValue()
					: this.attribute('r').toPixels());

				return ctx.createRadialGradient(fx, fy, 0, cx, cy, r);
			}
		}
		svg.Element.radialGradient.prototype = new svg.Element.GradientBase;

		// gradient stop element
		svg.Element.stop = function (node) {
			this.base = svg.Element.ElementBase;
			this.base(node);

			this.offset = this.attribute('offset').numValue();

			var stopColor = this.style('stop-color');
			if (this.style('stop-opacity').hasValue()) stopColor = stopColor.addOpacity(this.style('stop-opacity').value);
			this.color = stopColor.value;
		}
		svg.Element.stop.prototype = new svg.Element.ElementBase;

		// animation base element
		svg.Element.AnimateBase = function (node) {
			this.base = svg.Element.ElementBase;
			this.base(node);

			svg.Animations.push(this);

			this.duration = 0.0;
			this.begin = this.attribute('begin').toMilliseconds();
			this.maxDuration = this.begin + this.attribute('dur').toMilliseconds();

			this.getProperty = function () {
				var attributeType = this.attribute('attributeType').value;
				var attributeName = this.attribute('attributeName').value;

				if (attributeType == 'CSS') {
					return this.parent.style(attributeName, true);
				}
				return this.parent.attribute(attributeName, true);
			};

			this.initialValue = null;
			this.initialUnits = '';
			this.removed = false;

			this.calcValue = function () {
				// OVERRIDE ME!
				return '';
			}

			this.update = function (delta) {
				// set initial value
				if (this.initialValue == null) {
					this.initialValue = this.getProperty().value;
					this.initialUnits = this.getProperty().getUnits();
				}

				// if we're past the end time
				if (this.duration > this.maxDuration) {
					// loop for indefinitely repeating animations
					if (this.attribute('repeatCount').value == 'indefinite') {
						this.duration = 0.0
					}
					else if (this.attribute('fill').valueOrDefault('remove') == 'remove' && !this.removed) {
						this.removed = true;
						this.getProperty().value = this.initialValue;
						return true;
					}
					else {
						return false; // no updates made
					}
				}
				this.duration = this.duration + delta;

				// if we're past the begin time
				var updated = false;
				if (this.begin < this.duration) {
					var newValue = this.calcValue(); // tween

					if (this.attribute('type').hasValue()) {
						// for transform, etc.
						var type = this.attribute('type').value;
						newValue = type + '(' + newValue + ')';
					}

					this.getProperty().value = newValue;
					updated = true;
				}

				return updated;
			}

			this.from = this.attribute('from');
			this.to = this.attribute('to');
			this.values = this.attribute('values');
			if (this.values.hasValue()) this.values.value = this.values.value.split(';');

			// fraction of duration we've covered
			this.progress = function () {
				var ret = { progress: (this.duration - this.begin) / (this.maxDuration - this.begin) };
				if (this.values.hasValue()) {
					var p = ret.progress * (this.values.value.length - 1);
					var lb = Math.floor(p), ub = Math.ceil(p);
					ret.from = new svg.Property('from', parseFloat(this.values.value[lb]));
					ret.to = new svg.Property('to', parseFloat(this.values.value[ub]));
					ret.progress = (p - lb) / (ub - lb);
				}
				else {
					ret.from = this.from;
					ret.to = this.to;
				}
				return ret;
			}
		}
		svg.Element.AnimateBase.prototype = new svg.Element.ElementBase;

		// animate element
		svg.Element.animate = function (node) {
			this.base = svg.Element.AnimateBase;
			this.base(node);

			this.calcValue = function () {
				var p = this.progress();

				// tween value linearly
				var newValue = p.from.numValue() + (p.to.numValue() - p.from.numValue()) * p.progress;
				return newValue + this.initialUnits;
			};
		}
		svg.Element.animate.prototype = new svg.Element.AnimateBase;

		// animate color element
		svg.Element.animateColor = function (node) {
			this.base = svg.Element.AnimateBase;
			this.base(node);

			this.calcValue = function () {
				var p = this.progress();
				var from = new RGBColor(p.from.value);
				var to = new RGBColor(p.to.value);

				if (from.ok && to.ok) {
					// tween color linearly
					var r = from.r + (to.r - from.r) * p.progress;
					var g = from.g + (to.g - from.g) * p.progress;
					var b = from.b + (to.b - from.b) * p.progress;
					return 'rgb(' + parseInt(r, 10) + ',' + parseInt(g, 10) + ',' + parseInt(b, 10) + ')';
				}
				return this.attribute('from').value;
			};
		}
		svg.Element.animateColor.prototype = new svg.Element.AnimateBase;

		// animate transform element
		svg.Element.animateTransform = function (node) {
			this.base = svg.Element.animate;
			this.base(node);
		}
		svg.Element.animateTransform.prototype = new svg.Element.animate;

		// font element
		svg.Element.font = function (node) {
			this.base = svg.Element.ElementBase;
			this.base(node);

			this.horizAdvX = this.attribute('horiz-adv-x').numValue();

			this.isRTL = false;
			this.isArabic = false;
			this.fontFace = null;
			this.missingGlyph = null;
			this.glyphs = [];
			for (var i = 0; i < this.children.length; i++) {
				var child = this.children[i];
				if (child.type == 'font-face') {
					this.fontFace = child;
					if (child.style('font-family').hasValue()) {
						svg.Definitions[child.style('font-family').value] = this;
					}
				}
				else if (child.type == 'missing-glyph') this.missingGlyph = child;
				else if (child.type == 'glyph') {
					if (child.arabicForm != '') {
						this.isRTL = true;
						this.isArabic = true;
						if (typeof (this.glyphs[child.unicode]) == 'undefined') this.glyphs[child.unicode] = [];
						this.glyphs[child.unicode][child.arabicForm] = child;
					}
					else {
						this.glyphs[child.unicode] = child;
					}
				}
			}
		}
		svg.Element.font.prototype = new svg.Element.ElementBase;

		// font-face element
		svg.Element.fontface = function (node) {
			this.base = svg.Element.ElementBase;
			this.base(node);

			this.ascent = this.attribute('ascent').value;
			this.descent = this.attribute('descent').value;
			this.unitsPerEm = this.attribute('units-per-em').numValue();
		}
		svg.Element.fontface.prototype = new svg.Element.ElementBase;

		// missing-glyph element
		svg.Element.missingglyph = function (node) {
			this.base = svg.Element.path;
			this.base(node);

			this.horizAdvX = 0;
		}
		svg.Element.missingglyph.prototype = new svg.Element.path;

		// glyph element
		svg.Element.glyph = function (node) {
			this.base = svg.Element.path;
			this.base(node);

			this.horizAdvX = this.attribute('horiz-adv-x').numValue();
			this.unicode = this.attribute('unicode').value;
			this.arabicForm = this.attribute('arabic-form').value;
		}
		svg.Element.glyph.prototype = new svg.Element.path;

		// text element
		svg.Element.text = function (node) {
			this.base = svg.Element.RenderedElementBase;
			this.base(node);

			if (node != null) {
				// add children
				this.children = [];
				for (var i = 0; i < node.childNodes.length; i++) {
					var childNode = node.childNodes[i];
					if (childNode.nodeType == 1) { // capture tspan and tref nodes
						this.addChild(childNode, true);
					}
					else if (childNode.nodeType == 3) { // capture text
						this.addChild(new svg.Element.tspan(childNode), false);
					}
				}
			}

			this.baseSetContext = this.setContext;
			this.setContext = function (ctx) {
				this.baseSetContext(ctx);
				if (this.style('dominant-baseline').hasValue()) ctx.textBaseline = this.style('dominant-baseline').value;
				if (this.style('alignment-baseline').hasValue()) ctx.textBaseline = this.style('alignment-baseline').value;
			}

			this.renderChildren = function (ctx) {
				var textAnchor = this.style('text-anchor').valueOrDefault('start');
				var x = this.attribute('x').toPixels('x');
				var y = this.attribute('y').toPixels('y');
				for (var i = 0; i < this.children.length; i++) {
					var child = this.children[i];

					if (child.attribute('x').hasValue()) {
						child.x = child.attribute('x').toPixels('x');
					}
					else {
						if (this.attribute('dx').hasValue()) y += this.attribute('dx').toPixels('x');
						if (child.attribute('dx').hasValue()) x += child.attribute('dx').toPixels('x');
						child.x = x;
					}

					var childLength = child.measureText(ctx);
					if (textAnchor != 'start' && (i == 0 || child.attribute('x').hasValue())) { // new group?
						// loop through rest of children
						var groupLength = childLength;
						for (var j = i + 1; j < this.children.length; j++) {
							var childInGroup = this.children[j];
							if (childInGroup.attribute('x').hasValue()) break; // new group
							groupLength += childInGroup.measureText(ctx);
						}
						child.x -= (textAnchor == 'end' ? groupLength : groupLength / 2.0);
					}
					x = child.x + childLength;

					if (child.attribute('y').hasValue()) {
						child.y = child.attribute('y').toPixels('y');
					}
					else {
						if (this.attribute('dy').hasValue()) y += this.attribute('dy').toPixels('y');
						if (child.attribute('dy').hasValue()) y += child.attribute('dy').toPixels('y');
						child.y = y;
					}
					y = child.y;

					child.render(ctx);
				}
			}
		}
		svg.Element.text.prototype = new svg.Element.RenderedElementBase;

		// text base
		svg.Element.TextElementBase = function (node) {
			this.base = svg.Element.RenderedElementBase;
			this.base(node);

			this.getGlyph = function (font, text, i) {
				var c = text[i];
				var glyph = null;
				if (font.isArabic) {
					var arabicForm = 'isolated';
					if ((i == 0 || text[i - 1] == ' ') && i < text.length - 2 && text[i + 1] != ' ') arabicForm = 'terminal';
					if (i > 0 && text[i - 1] != ' ' && i < text.length - 2 && text[i + 1] != ' ') arabicForm = 'medial';
					if (i > 0 && text[i - 1] != ' ' && (i == text.length - 1 || text[i + 1] == ' ')) arabicForm = 'initial';
					if (typeof (font.glyphs[c]) != 'undefined') {
						glyph = font.glyphs[c][arabicForm];
						if (glyph == null && font.glyphs[c].type == 'glyph') glyph = font.glyphs[c];
					}
				}
				else {
					glyph = font.glyphs[c];
				}
				if (glyph == null) glyph = font.missingGlyph;
				return glyph;
			}

			this.renderChildren = function (ctx) {
				var customFont = this.parent.style('font-family').getDefinition();
				if (customFont != null) {
					var fontSize = this.parent.style('font-size').numValueOrDefault(svg.Font.Parse(svg.ctx.font).fontSize);
					var fontStyle = this.parent.style('font-style').valueOrDefault(svg.Font.Parse(svg.ctx.font).fontStyle);
					var text = this.getText();
					if (customFont.isRTL) text = text.split("").reverse().join("");

					var dx = svg.ToNumberArray(this.parent.attribute('dx').value);
					for (var i = 0; i < text.length; i++) {
						var glyph = this.getGlyph(customFont, text, i);
						var scale = fontSize / customFont.fontFace.unitsPerEm;
						ctx.translate(this.x, this.y);
						ctx.scale(scale, -scale);
						var lw = ctx.lineWidth;
						ctx.lineWidth = ctx.lineWidth * customFont.fontFace.unitsPerEm / fontSize;
						if (fontStyle == 'italic') ctx.transform(1, 0, .4, 1, 0, 0);
						glyph.render(ctx);
						if (fontStyle == 'italic') ctx.transform(1, 0, -.4, 1, 0, 0);
						ctx.lineWidth = lw;
						ctx.scale(1 / scale, -1 / scale);
						ctx.translate(-this.x, -this.y);

						this.x += fontSize * (glyph.horizAdvX || customFont.horizAdvX) / customFont.fontFace.unitsPerEm;
						if (typeof (dx[i]) != 'undefined' && !isNaN(dx[i])) {
							this.x += dx[i];
						}
					}
					return;
				}

				if (ctx.strokeStyle != '') ctx.strokeText(svg.compressSpaces(this.getText()), this.x, this.y);
				if (ctx.fillStyle != '') ctx.fillText(svg.compressSpaces(this.getText()), this.x, this.y);
			}

			this.getText = function () {
				// OVERRIDE ME
			}

			this.measureText = function (ctx) {
				var customFont = this.parent.style('font-family').getDefinition();
				if (customFont != null) {
					var fontSize = this.parent.style('font-size').numValueOrDefault(svg.Font.Parse(svg.ctx.font).fontSize);
					var measure = 0;
					var text = this.getText();
					if (customFont.isRTL) text = text.split("").reverse().join("");
					var dx = svg.ToNumberArray(this.parent.attribute('dx').value);
					for (var i = 0; i < text.length; i++) {
						var glyph = this.getGlyph(customFont, text, i);
						measure += (glyph.horizAdvX || customFont.horizAdvX) * fontSize / customFont.fontFace.unitsPerEm;
						if (typeof (dx[i]) != 'undefined' && !isNaN(dx[i])) {
							measure += dx[i];
						}
					}
					return measure;
				}

				var textToMeasure = svg.compressSpaces(this.getText());
				if (!ctx.measureText) return textToMeasure.length * 10;

				ctx.save();
				this.setContext(ctx);
				var width = ctx.measureText(textToMeasure).width;
				ctx.restore();
				return width;
			}
		}
		svg.Element.TextElementBase.prototype = new svg.Element.RenderedElementBase;

		// tspan 
		svg.Element.tspan = function (node) {
			this.base = svg.Element.TextElementBase;
			this.base(node);

			this.text = node.nodeType == 3 ? node.nodeValue : // text
				node.childNodes.length > 0 ? node.childNodes[0].nodeValue : // element
					node.text;
			this.getText = function () {
				return this.text;
			}
		}
		svg.Element.tspan.prototype = new svg.Element.TextElementBase;

		// tref
		svg.Element.tref = function (node) {
			this.base = svg.Element.TextElementBase;
			this.base(node);

			this.getText = function () {
				var element = this.attribute('xlink:href').getDefinition();
				if (element != null) return element.children[0].getText();
			}
		}
		svg.Element.tref.prototype = new svg.Element.TextElementBase;

		// a element
		svg.Element.a = function (node) {
			this.base = svg.Element.TextElementBase;
			this.base(node);

			this.hasText = true;
			for (var i = 0; i < node.childNodes.length; i++) {
				if (node.childNodes[i].nodeType != 3) this.hasText = false;
			}

			// this might contain text
			this.text = this.hasText ? node.childNodes[0].nodeValue : '';
			this.getText = function () {
				return this.text;
			}

			this.baseRenderChildren = this.renderChildren;
			this.renderChildren = function (ctx) {
				if (this.hasText) {
					// render as text element
					this.baseRenderChildren(ctx);
					var fontSize = new svg.Property('fontSize', svg.Font.Parse(svg.ctx.font).fontSize);
					svg.Mouse.checkBoundingBox(this, new svg.BoundingBox(this.x, this.y - fontSize.toPixels('y'), this.x + this.measureText(ctx), this.y));
				}
				else {
					// render as temporary group
					var g = new svg.Element.g();
					g.children = this.children;
					g.parent = this;
					g.render(ctx);
				}
			}

			this.onclick = function () {
				window.open(this.attribute('xlink:href').value);
			}

			this.onmousemove = function () {
				svg.ctx.canvas.style.cursor = 'pointer';
			}
		}
		svg.Element.a.prototype = new svg.Element.TextElementBase;

		// image element
		svg.Element.image = function (node) {
			this.base = svg.Element.RenderedElementBase;
			this.base(node);

			var href = this.attribute('xlink:href').value;
			var isSvg = href.match(/\.svg$/)

			svg.Images.push(this);
			this.loaded = false;
			if (!isSvg) {
				this.img = document.createElement('img');
				var self = this;
				this.img.onload = function () { self.loaded = true; }
				this.img.onerror = function () { if (console) console.log('ERROR: image "' + href + '" not found'); self.loaded = true; }
				this.img.src = href;
			}
			else {
				this.img = svg.ajax(href);
				this.loaded = true;
			}

			this.renderChildren = function (ctx) {
				var x = this.attribute('x').toPixels('x');
				var y = this.attribute('y').toPixels('y');

				var width = this.attribute('width').toPixels('x');
				var height = this.attribute('height').toPixels('y');
				if (width == 0 || height == 0) return;

				ctx.save();
				if (isSvg) {
					ctx.drawSvg(this.img, x, y, width, height);
				}
				else {
					ctx.translate(x, y);
					svg.AspectRatio(ctx,
						this.attribute('preserveAspectRatio').value,
						width,
						this.img.width,
						height,
						this.img.height,
						0,
						0);
					ctx.drawImage(this.img, 0, 0);
				}
				ctx.restore();
			}
		}
		svg.Element.image.prototype = new svg.Element.RenderedElementBase;

		// group element
		svg.Element.g = function (node) {
			this.base = svg.Element.RenderedElementBase;
			this.base(node);

			this.getBoundingBox = function () {
				var bb = new svg.BoundingBox();
				for (var i = 0; i < this.children.length; i++) {
					bb.addBoundingBox(this.children[i].getBoundingBox());
				}
				return bb;
			};
		}
		svg.Element.g.prototype = new svg.Element.RenderedElementBase;

		// symbol element
		svg.Element.symbol = function (node) {
			this.base = svg.Element.RenderedElementBase;
			this.base(node);

			this.baseSetContext = this.setContext;
			this.setContext = function (ctx) {
				this.baseSetContext(ctx);

				// viewbox
				if (this.attribute('viewBox').hasValue()) {
					var viewBox = svg.ToNumberArray(this.attribute('viewBox').value);
					var minX = viewBox[0];
					var minY = viewBox[1];
					width = viewBox[2];
					height = viewBox[3];

					svg.AspectRatio(ctx,
						this.attribute('preserveAspectRatio').value,
						this.attribute('width').toPixels('x'),
						width,
						this.attribute('height').toPixels('y'),
						height,
						minX,
						minY);

					svg.ViewPort.SetCurrent(viewBox[2], viewBox[3]);
				}
			}
		}
		svg.Element.symbol.prototype = new svg.Element.RenderedElementBase;

		// style element
		svg.Element.style = function (node) {
			this.base = svg.Element.ElementBase;
			this.base(node);

			// text, or spaces then CDATA
			var css = node.childNodes[0].nodeValue + (node.childNodes.length > 1 ? node.childNodes[1].nodeValue : '');
			css = css.replace(/(\/\*([^*]|[\r\n]|(\*+([^*\/]|[\r\n])))*\*+\/)|(^[\s]*\/\/.*)/gm, ''); // remove comments
			css = svg.compressSpaces(css); // replace whitespace
			var cssDefs = css.split('}');
			for (var i = 0; i < cssDefs.length; i++) {
				if (svg.trim(cssDefs[i]) != '') {
					var cssDef = cssDefs[i].split('{');
					var cssClasses = cssDef[0].split(',');
					var cssProps = cssDef[1].split(';');
					for (var j = 0; j < cssClasses.length; j++) {
						var cssClass = svg.trim(cssClasses[j]);
						if (cssClass != '') {
							var props = {};
							for (var k = 0; k < cssProps.length; k++) {
								var prop = cssProps[k].indexOf(':');
								var name = cssProps[k].substr(0, prop);
								var value = cssProps[k].substr(prop + 1, cssProps[k].length - prop);
								if (name != null && value != null) {
									props[svg.trim(name)] = new svg.Property(svg.trim(name), svg.trim(value));
								}
							}
							svg.Styles[cssClass] = props;
							if (cssClass == '@font-face') {
								var fontFamily = props['font-family'].value.replace(/"/g, '');
								var srcs = props['src'].value.split(',');
								for (var s = 0; s < srcs.length; s++) {
									if (srcs[s].indexOf('format("svg")') > 0) {
										var urlStart = srcs[s].indexOf('url');
										var urlEnd = srcs[s].indexOf(')', urlStart);
										var url = srcs[s].substr(urlStart + 5, urlEnd - urlStart - 6);
										var doc = svg.parseXml(svg.ajax(url));
										var fonts = doc.getElementsByTagName('font');
										for (var f = 0; f < fonts.length; f++) {
											var font = svg.CreateElement(fonts[f]);
											svg.Definitions[fontFamily] = font;
										}
									}
								}
							}
						}
					}
				}
			}
		}
		svg.Element.style.prototype = new svg.Element.ElementBase;

		// use element 
		svg.Element.use = function (node) {
			this.base = svg.Element.RenderedElementBase;
			this.base(node);

			this.baseSetContext = this.setContext;
			this.setContext = function (ctx) {
				this.baseSetContext(ctx);
				if (this.attribute('x').hasValue()) ctx.translate(this.attribute('x').toPixels('x'), 0);
				if (this.attribute('y').hasValue()) ctx.translate(0, this.attribute('y').toPixels('y'));
			}

			this.getDefinition = function () {
				var element = this.attribute('xlink:href').getDefinition();
				if (this.attribute('width').hasValue()) element.attribute('width', true).value = this.attribute('width').value;
				if (this.attribute('height').hasValue()) element.attribute('height', true).value = this.attribute('height').value;
				return element;
			}

			this.path = function (ctx) {
				var element = this.getDefinition();
				if (element != null) element.path(ctx);
			}

			this.renderChildren = function (ctx) {
				var element = this.getDefinition();
				if (element != null) {
					// temporarily detach from parent and render
					var oldParent = element.parent;
					element.parent = null;
					element.render(ctx);
					element.parent = oldParent;
				}
			}
		}
		svg.Element.use.prototype = new svg.Element.RenderedElementBase;

		// mask element
		svg.Element.mask = function (node) {
			this.base = svg.Element.ElementBase;
			this.base(node);

			this.apply = function (ctx, element) {
				// render as temp svg	
				var x = this.attribute('x').toPixels('x');
				var y = this.attribute('y').toPixels('y');
				var width = this.attribute('width').toPixels('x');
				var height = this.attribute('height').toPixels('y');

				// temporarily remove mask to avoid recursion
				var mask = element.attribute('mask').value;
				element.attribute('mask').value = '';

				var cMask = document.createElement('canvas');
				cMask.width = x + width;
				cMask.height = y + height;
				var maskCtx = cMask.getContext('2d');
				this.renderChildren(maskCtx);

				var c = document.createElement('canvas');
				c.width = x + width;
				c.height = y + height;
				var tempCtx = c.getContext('2d');
				element.render(tempCtx);
				tempCtx.globalCompositeOperation = 'destination-in';
				tempCtx.fillStyle = maskCtx.createPattern(cMask, 'no-repeat');
				tempCtx.fillRect(0, 0, x + width, y + height);

				ctx.fillStyle = tempCtx.createPattern(c, 'no-repeat');
				ctx.fillRect(0, 0, x + width, y + height);

				// reassign mask
				element.attribute('mask').value = mask;
			}

			this.render = function (ctx) {
				// NO RENDER
			}
		}
		svg.Element.mask.prototype = new svg.Element.ElementBase;

		// clip element
		svg.Element.clipPath = function (node) {
			this.base = svg.Element.ElementBase;
			this.base(node);

			this.apply = function (ctx) {
				for (var i = 0; i < this.children.length; i++) {
					if (this.children[i].path) {
						this.children[i].path(ctx);
						ctx.clip();
					}
				}
			}

			this.render = function (ctx) {
				// NO RENDER
			}
		}
		svg.Element.clipPath.prototype = new svg.Element.ElementBase;

		// filters
		svg.Element.filter = function (node) {
			this.base = svg.Element.ElementBase;
			this.base(node);

			this.apply = function (ctx, element) {
				// render as temp svg	
				var bb = element.getBoundingBox();
				var x = this.attribute('x').toPixels('x');
				var y = this.attribute('y').toPixels('y');
				if (x == 0 || y == 0) {
					x = bb.x1;
					y = bb.y1;
				}
				var width = this.attribute('width').toPixels('x');
				var height = this.attribute('height').toPixels('y');
				if (width == 0 || height == 0) {
					width = bb.width();
					height = bb.height();
				}

				// temporarily remove filter to avoid recursion
				var filter = element.style('filter').value;
				element.style('filter').value = '';

				// max filter distance
				var extraPercent = .20;
				var px = extraPercent * width;
				var py = extraPercent * height;

				var c = document.createElement('canvas');
				c.width = width + 2 * px;
				c.height = height + 2 * py;
				var tempCtx = c.getContext('2d');
				tempCtx.translate(-x + px, -y + py);
				element.render(tempCtx);

				// apply filters
				for (var i = 0; i < this.children.length; i++) {
					this.children[i].apply(tempCtx, 0, 0, width + 2 * px, height + 2 * py);
				}

				// render on me
				ctx.drawImage(c, 0, 0, width + 2 * px, height + 2 * py, x - px, y - py, width + 2 * px, height + 2 * py);

				// reassign filter
				element.style('filter', true).value = filter;
			}

			this.render = function (ctx) {
				// NO RENDER
			}
		}
		svg.Element.filter.prototype = new svg.Element.ElementBase;

		svg.Element.feGaussianBlur = function (node) {
			this.base = svg.Element.ElementBase;
			this.base(node);

			function make_fgauss(sigma) {
				sigma = Math.max(sigma, 0.01);
				var len = Math.ceil(sigma * 4.0) + 1;
				mask = [];
				for (var i = 0; i < len; i++) {
					mask[i] = Math.exp(-0.5 * (i / sigma) * (i / sigma));
				}
				return mask;
			}

			function normalize(mask) {
				var sum = 0;
				for (var i = 1; i < mask.length; i++) {
					sum += Math.abs(mask[i]);
				}
				sum = 2 * sum + Math.abs(mask[0]);
				for (var i = 0; i < mask.length; i++) {
					mask[i] /= sum;
				}
				return mask;
			}

			function convolve_even(src, dst, mask, width, height) {
				for (var y = 0; y < height; y++) {
					for (var x = 0; x < width; x++) {
						var a = imGet(src, x, y, width, height, 3) / 255;
						for (var rgba = 0; rgba < 4; rgba++) {
							var sum = mask[0] * (a == 0 ? 255 : imGet(src, x, y, width, height, rgba)) * (a == 0 || rgba == 3 ? 1 : a);
							for (var i = 1; i < mask.length; i++) {
								var a1 = imGet(src, Math.max(x - i, 0), y, width, height, 3) / 255;
								var a2 = imGet(src, Math.min(x + i, width - 1), y, width, height, 3) / 255;
								sum += mask[i] *
									((a1 == 0 ? 255 : imGet(src, Math.max(x - i, 0), y, width, height, rgba)) * (a1 == 0 || rgba == 3 ? 1 : a1) +
										(a2 == 0 ? 255 : imGet(src, Math.min(x + i, width - 1), y, width, height, rgba)) * (a2 == 0 || rgba == 3 ? 1 : a2));
							}
							imSet(dst, y, x, height, width, rgba, sum);
						}
					}
				}
			}

			function imGet(img, x, y, width, height, rgba) {
				return img[y * width * 4 + x * 4 + rgba];
			}

			function imSet(img, x, y, width, height, rgba, val) {
				img[y * width * 4 + x * 4 + rgba] = val;
			}

			function blur(ctx, width, height, sigma) {
				var srcData = ctx.getImageData(0, 0, width, height);
				var mask = make_fgauss(sigma);
				mask = normalize(mask);
				tmp = [];
				convolve_even(srcData.data, tmp, mask, width, height);
				convolve_even(tmp, srcData.data, mask, height, width);
				ctx.clearRect(0, 0, width, height);
				ctx.putImageData(srcData, 0, 0);
			}

			this.apply = function (ctx, x, y, width, height) {
				// assuming x==0 && y==0 for now
				blur(ctx, width, height, this.attribute('stdDeviation').numValue());
			}
		}
		svg.Element.filter.prototype = new svg.Element.feGaussianBlur;

		// title element, do nothing
		svg.Element.title = function (node) {
		}
		svg.Element.title.prototype = new svg.Element.ElementBase;

		// desc element, do nothing
		svg.Element.desc = function (node) {
		}
		svg.Element.desc.prototype = new svg.Element.ElementBase;

		svg.Element.MISSING = function (node) {
			if (console) console.log('ERROR: Element \'' + node.nodeName + '\' not yet implemented.');
		}
		svg.Element.MISSING.prototype = new svg.Element.ElementBase;

		// element factory
		svg.CreateElement = function (node) {
			var className = node.nodeName.replace(/^[^:]+:/, ''); // remove namespace
			className = className.replace(/\-/g, ''); // remove dashes
			var e = null;
			if (typeof (svg.Element[className]) != 'undefined') {
				e = new svg.Element[className](node);
			}
			else {
				e = new svg.Element.MISSING(node);
			}

			e.type = node.nodeName;
			return e;
		}

		// load from url
		svg.load = function (ctx, url) {
			svg.loadXml(ctx, svg.ajax(url));
		}

		// load from xml
		svg.loadXml = function (ctx, xml) {
			svg.loadXmlDoc(ctx, svg.parseXml(xml));
		}

		svg.loadXmlDoc = function (ctx, dom) {
			svg.init(ctx);

			var mapXY = function (p) {
				var e = ctx.canvas;
				while (e) {
					p.x -= e.offsetLeft;
					p.y -= e.offsetTop;
					e = e.offsetParent;
				}
				if (window.scrollX) p.x += window.scrollX;
				if (window.scrollY) p.y += window.scrollY;
				return p;
			}

			// bind mouse
			if (svg.opts['ignoreMouse'] != true) {
				ctx.canvas.onclick = function (e) {
					var p = mapXY(new svg.Point(e != null ? e.clientX : event.clientX, e != null ? e.clientY : event.clientY));
					svg.Mouse.onclick(p.x, p.y);
				};
				ctx.canvas.onmousemove = function (e) {
					var p = mapXY(new svg.Point(e != null ? e.clientX : event.clientX, e != null ? e.clientY : event.clientY));
					svg.Mouse.onmousemove(p.x, p.y);
				};
			}

			var e = svg.CreateElement(dom.documentElement);
			e.root = true;

			// render loop
			var isFirstRender = true;
			var draw = function () {
				svg.ViewPort.Clear();
				if (ctx.canvas.parentNode) svg.ViewPort.SetCurrent(ctx.canvas.parentNode.clientWidth, ctx.canvas.parentNode.clientHeight);

				if (svg.opts['ignoreDimensions'] != true) {
					// set canvas size
					if (e.style('width').hasValue()) {
						ctx.canvas.width = e.style('width').toPixels('x');
						ctx.canvas.style.width = ctx.canvas.width + 'px';
					}
					if (e.style('height').hasValue()) {
						ctx.canvas.height = e.style('height').toPixels('y');
						ctx.canvas.style.height = ctx.canvas.height + 'px';
					}
				}
				var cWidth = ctx.canvas.clientWidth || ctx.canvas.width;
				var cHeight = ctx.canvas.clientHeight || ctx.canvas.height;
				if (svg.opts['ignoreDimensions'] == true && e.style('width').hasValue() && e.style('height').hasValue()) {
					cWidth = e.style('width').toPixels('x');
					cHeight = e.style('height').toPixels('y');
				}
				svg.ViewPort.SetCurrent(cWidth, cHeight);

				if (svg.opts['offsetX'] != null) e.attribute('x', true).value = svg.opts['offsetX'];
				if (svg.opts['offsetY'] != null) e.attribute('y', true).value = svg.opts['offsetY'];
				if (svg.opts['scaleWidth'] != null && svg.opts['scaleHeight'] != null) {
					var xRatio = 1, yRatio = 1, viewBox = svg.ToNumberArray(e.attribute('viewBox').value);
					if (e.attribute('width').hasValue()) xRatio = e.attribute('width').toPixels('x') / svg.opts['scaleWidth'];
					else if (!isNaN(viewBox[2])) xRatio = viewBox[2] / svg.opts['scaleWidth'];
					if (e.attribute('height').hasValue()) yRatio = e.attribute('height').toPixels('y') / svg.opts['scaleHeight'];
					else if (!isNaN(viewBox[3])) yRatio = viewBox[3] / svg.opts['scaleHeight'];

					e.attribute('width', true).value = svg.opts['scaleWidth'];
					e.attribute('height', true).value = svg.opts['scaleHeight'];
					e.attribute('viewBox', true).value = '0 0 ' + (cWidth * xRatio) + ' ' + (cHeight * yRatio);
					e.attribute('preserveAspectRatio', true).value = 'none';
				}

				// clear and render
				if (svg.opts['ignoreClear'] != true) {
					ctx.clearRect(0, 0, cWidth, cHeight);
				}
				e.render(ctx);
				if (isFirstRender) {
					isFirstRender = false;
					if (typeof (svg.opts['renderCallback']) == 'function') svg.opts['renderCallback']();
				}
			}

			var waitingForImages = true;
			if (svg.ImagesLoaded()) {
				waitingForImages = false;
				draw();
			}
			svg.intervalID = setInterval(function () {
				var needUpdate = false;

				if (waitingForImages && svg.ImagesLoaded()) {
					waitingForImages = false;
					needUpdate = true;
				}

				// need update from mouse events?
				if (svg.opts['ignoreMouse'] != true) {
					needUpdate = needUpdate | svg.Mouse.hasEvents();
				}

				// need update from animations?
				if (svg.opts['ignoreAnimation'] != true) {
					for (var i = 0; i < svg.Animations.length; i++) {
						needUpdate = needUpdate | svg.Animations[i].update(1000 / svg.FRAMERATE);
					}
				}

				// need update from redraw?
				if (typeof (svg.opts['forceRedraw']) == 'function') {
					if (svg.opts['forceRedraw']() == true) needUpdate = true;
				}

				// render if needed
				if (needUpdate) {
					draw();
					svg.Mouse.runEvents(); // run and clear our events
				}
			}, 1000 / svg.FRAMERATE);
		}

		svg.stop = function () {
			if (svg.intervalID) {
				clearInterval(svg.intervalID);
			}
		}

		svg.Mouse = new (function () {
			this.events = [];
			this.hasEvents = function () { return this.events.length != 0; }

			this.onclick = function (x, y) {
				this.events.push({
					type: 'onclick', x: x, y: y,
					run: function (e) { if (e.onclick) e.onclick(); }
				});
			}

			this.onmousemove = function (x, y) {
				this.events.push({
					type: 'onmousemove', x: x, y: y,
					run: function (e) { if (e.onmousemove) e.onmousemove(); }
				});
			}

			this.eventElements = [];

			this.checkPath = function (element, ctx) {
				for (var i = 0; i < this.events.length; i++) {
					var e = this.events[i];
					if (ctx.isPointInPath && ctx.isPointInPath(e.x, e.y)) this.eventElements[i] = element;
				}
			}

			this.checkBoundingBox = function (element, bb) {
				for (var i = 0; i < this.events.length; i++) {
					var e = this.events[i];
					if (bb.isPointInBox(e.x, e.y)) this.eventElements[i] = element;
				}
			}

			this.runEvents = function () {
				svg.ctx.canvas.style.cursor = '';

				for (var i = 0; i < this.events.length; i++) {
					var e = this.events[i];
					var element = this.eventElements[i];
					while (element) {
						e.run(element);
						element = element.parent;
					}
				}

				// done running, clear
				this.events = [];
				this.eventElements = [];
			}
		});

		return svg;
	}
})();

if (CanvasRenderingContext2D) {
	CanvasRenderingContext2D.prototype.drawSvg = function (s, dx, dy, dw, dh) {
		canvg(this.canvas, s, {
			ignoreMouse: true,
			ignoreAnimation: true,
			ignoreDimensions: true,
			ignoreClear: true,
			offsetX: dx,
			offsetY: dy,
			scaleWidth: dw,
			scaleHeight: dh
		});
	}
}
/**
 * A class to parse color values
 * @author Stoyan Stefanov <sstoo@gmail.com>
 * @link   http://www.phpied.com/rgb-color-parser-in-javascript/
 * @license Use it if you like it
 */
function RGBColor(color_string) {
	this.ok = false;

	// strip any leading #
	if (color_string.charAt(0) == '#') { // remove # if any
		color_string = color_string.substr(1, 6);
	}

	color_string = color_string.replace(/ /g, '');
	color_string = color_string.toLowerCase();

	// before getting into regexps, try simple matches
	// and overwrite the input
	var simple_colors = {
		aliceblue: 'f0f8ff',
		antiquewhite: 'faebd7',
		aqua: '00ffff',
		aquamarine: '7fffd4',
		azure: 'f0ffff',
		beige: 'f5f5dc',
		bisque: 'ffe4c4',
		black: '000000',
		blanchedalmond: 'ffebcd',
		blue: '0000ff',
		blueviolet: '8a2be2',
		brown: 'a52a2a',
		burlywood: 'deb887',
		cadetblue: '5f9ea0',
		chartreuse: '7fff00',
		chocolate: 'd2691e',
		coral: 'ff7f50',
		cornflowerblue: '6495ed',
		cornsilk: 'fff8dc',
		crimson: 'dc143c',
		cyan: '00ffff',
		darkblue: '00008b',
		darkcyan: '008b8b',
		darkgoldenrod: 'b8860b',
		darkgray: 'a9a9a9',
		darkgreen: '006400',
		darkkhaki: 'bdb76b',
		darkmagenta: '8b008b',
		darkolivegreen: '556b2f',
		darkorange: 'ff8c00',
		darkorchid: '9932cc',
		darkred: '8b0000',
		darksalmon: 'e9967a',
		darkseagreen: '8fbc8f',
		darkslateblue: '483d8b',
		darkslategray: '2f4f4f',
		darkturquoise: '00ced1',
		darkviolet: '9400d3',
		deeppink: 'ff1493',
		deepskyblue: '00bfff',
		dimgray: '696969',
		dodgerblue: '1e90ff',
		feldspar: 'd19275',
		firebrick: 'b22222',
		floralwhite: 'fffaf0',
		forestgreen: '228b22',
		fuchsia: 'ff00ff',
		gainsboro: 'dcdcdc',
		ghostwhite: 'f8f8ff',
		gold: 'ffd700',
		goldenrod: 'daa520',
		gray: '808080',
		green: '008000',
		greenyellow: 'adff2f',
		honeydew: 'f0fff0',
		hotpink: 'ff69b4',
		indianred: 'cd5c5c',
		indigo: '4b0082',
		ivory: 'fffff0',
		khaki: 'f0e68c',
		lavender: 'e6e6fa',
		lavenderblush: 'fff0f5',
		lawngreen: '7cfc00',
		lemonchiffon: 'fffacd',
		lightblue: 'add8e6',
		lightcoral: 'f08080',
		lightcyan: 'e0ffff',
		lightgoldenrodyellow: 'fafad2',
		lightgrey: 'd3d3d3',
		lightgreen: '90ee90',
		lightpink: 'ffb6c1',
		lightsalmon: 'ffa07a',
		lightseagreen: '20b2aa',
		lightskyblue: '87cefa',
		lightslateblue: '8470ff',
		lightslategray: '778899',
		lightsteelblue: 'b0c4de',
		lightyellow: 'ffffe0',
		lime: '00ff00',
		limegreen: '32cd32',
		linen: 'faf0e6',
		magenta: 'ff00ff',
		maroon: '800000',
		mediumaquamarine: '66cdaa',
		mediumblue: '0000cd',
		mediumorchid: 'ba55d3',
		mediumpurple: '9370d8',
		mediumseagreen: '3cb371',
		mediumslateblue: '7b68ee',
		mediumspringgreen: '00fa9a',
		mediumturquoise: '48d1cc',
		mediumvioletred: 'c71585',
		midnightblue: '191970',
		mintcream: 'f5fffa',
		mistyrose: 'ffe4e1',
		moccasin: 'ffe4b5',
		navajowhite: 'ffdead',
		navy: '000080',
		oldlace: 'fdf5e6',
		olive: '808000',
		olivedrab: '6b8e23',
		orange: 'ffa500',
		orangered: 'ff4500',
		orchid: 'da70d6',
		palegoldenrod: 'eee8aa',
		palegreen: '98fb98',
		paleturquoise: 'afeeee',
		palevioletred: 'd87093',
		papayawhip: 'ffefd5',
		peachpuff: 'ffdab9',
		peru: 'cd853f',
		pink: 'ffc0cb',
		plum: 'dda0dd',
		powderblue: 'b0e0e6',
		purple: '800080',
		red: 'ff0000',
		rosybrown: 'bc8f8f',
		royalblue: '4169e1',
		saddlebrown: '8b4513',
		salmon: 'fa8072',
		sandybrown: 'f4a460',
		seagreen: '2e8b57',
		seashell: 'fff5ee',
		sienna: 'a0522d',
		silver: 'c0c0c0',
		skyblue: '87ceeb',
		slateblue: '6a5acd',
		slategray: '708090',
		snow: 'fffafa',
		springgreen: '00ff7f',
		steelblue: '4682b4',
		tan: 'd2b48c',
		teal: '008080',
		thistle: 'd8bfd8',
		tomato: 'ff6347',
		turquoise: '40e0d0',
		violet: 'ee82ee',
		violetred: 'd02090',
		wheat: 'f5deb3',
		white: 'ffffff',
		whitesmoke: 'f5f5f5',
		yellow: 'ffff00',
		yellowgreen: '9acd32'
	};
	for (var key in simple_colors) {
		if (color_string == key) {
			color_string = simple_colors[key];
		}
	}
	// emd of simple type-in colors

	// array of color definition objects
	var color_defs = [
		{
			re: /^rgb\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)$/,
			example: ['rgb(123, 234, 45)', 'rgb(255,234,245)'],
			process: function (bits) {
				return [
					parseInt(bits[1]),
					parseInt(bits[2]),
					parseInt(bits[3])
				];
			}
		},
		{
			re: /^(\w{2})(\w{2})(\w{2})$/,
			example: ['#00ff00', '336699'],
			process: function (bits) {
				return [
					parseInt(bits[1], 16),
					parseInt(bits[2], 16),
					parseInt(bits[3], 16)
				];
			}
		},
		{
			re: /^(\w{1})(\w{1})(\w{1})$/,
			example: ['#fb0', 'f0f'],
			process: function (bits) {
				return [
					parseInt(bits[1] + bits[1], 16),
					parseInt(bits[2] + bits[2], 16),
					parseInt(bits[3] + bits[3], 16)
				];
			}
		}
	];

	// search through the definitions to find a match
	for (var i = 0; i < color_defs.length; i++) {
		var re = color_defs[i].re;
		var processor = color_defs[i].process;
		var bits = re.exec(color_string);
		if (bits) {
			channels = processor(bits);
			this.r = channels[0];
			this.g = channels[1];
			this.b = channels[2];
			this.ok = true;
		}

	}

	// validate/cleanup values
	this.r = (this.r < 0 || isNaN(this.r)) ? 0 : ((this.r > 255) ? 255 : this.r);
	this.g = (this.g < 0 || isNaN(this.g)) ? 0 : ((this.g > 255) ? 255 : this.g);
	this.b = (this.b < 0 || isNaN(this.b)) ? 0 : ((this.b > 255) ? 255 : this.b);

	// some getters
	this.toRGB = function () {
		return 'rgb(' + this.r + ', ' + this.g + ', ' + this.b + ')';
	}
	this.toHex = function () {
		var r = this.r.toString(16);
		var g = this.g.toString(16);
		var b = this.b.toString(16);
		if (r.length == 1) r = '0' + r;
		if (g.length == 1) g = '0' + g;
		if (b.length == 1) b = '0' + b;
		return '#' + r + g + b;
	}

	// help
	this.getHelpXML = function () {

		var examples = new Array();
		// add regexps
		for (var i = 0; i < color_defs.length; i++) {
			var example = color_defs[i].example;
			for (var j = 0; j < example.length; j++) {
				examples[examples.length] = example[j];
			}
		}
		// add type-in colors
		for (var sc in simple_colors) {
			examples[examples.length] = sc;
		}

		var xml = document.createElement('ul');
		xml.setAttribute('id', 'rgbcolor-examples');
		for (var i = 0; i < examples.length; i++) {
			try {
				var list_item = document.createElement('li');
				var list_color = new RGBColor(examples[i]);
				var example_div = document.createElement('div');
				example_div.style.cssText =
					'margin: 3px; '
					+ 'border: 1px solid black; '
					+ 'background:' + list_color.toHex() + '; '
					+ 'color:' + list_color.toHex()
					;
				example_div.appendChild(document.createTextNode('test'));
				var list_item_value = document.createTextNode(
					' ' + examples[i] + ' -> ' + list_color.toRGB() + ' -> ' + list_color.toHex()
				);
				list_item.appendChild(example_div);
				list_item.appendChild(list_item_value);
				xml.appendChild(list_item);

			} catch (e) { }
		}
		return xml;

	}

}


/* global canvg window document */
/*
 * svgenie
 * https://github.com/Causata/svgenie
 *
 * Copyright (c) 2013 Causata Ltd
 * Licensed under the MIT license.
 */

var svgenie = (function () {
	"use strict";

	// Place any tweaks to css in here
	var tweakStyles = function () {
		// Forcing a dependency with jQuery here

		// Thin out axis lines
		$(".c3-axis path, .axis path, .c3-axis-x path, .x.axis path, .c3-axis-y path, .y.axis path, .tick line, .link").css("fill", "none").css("stroke", "#aaa").css('shape-rendering', 'crispEdges');

		// prevent line graph background filling out black
		$(".c3-lines, .lines, .c3-brush, .brush").css("fill-opacity", 0);

		$("g path.chart").css("opacity", "0.75");

		$(".node rect").css("fill-opacity", "0.5").css("stroke", "#5B89B1");

		$(".circle").css("fill", "#7f8c8d");
	};

	var _serializeXmlNode = function (xmlNode) {
		if (typeof window.XMLSerializer != "undefined") {
			return (new window.XMLSerializer()).serializeToString(xmlNode);
		} else if (typeof xmlNode.xml != "undefined") {
			return xmlNode.xml;
		}
		return "";
	};

	var _toCanvas = function (parentId, options, callback) {
		var svg;
		if (typeof parentId == "string") {
			if (parentId.substr(0, 1) === "#") {
				parentId = parentId.substr(1);
			}
			svg = document.getElementById(parentId).getElementsByTagName('svg')[0];
		}

		tweakStyles();

		// Hopefully don't need to attach anything to the DOM
		var canvas = document.createElement("canvas");
		canvas.setAttribute("height", svg.offsetHeight);
		canvas.setAttribute("width", svg.offsetWidth);
		canvg(canvas, _serializeXmlNode(svg), {
			ignoreMouse: true,
			ignoreAnimation: true,
			renderCallback: function () { callback(canvas); }
		});
	};

	var _toDataURL = function (id, options, callback) {
		_toCanvas(id, options, function (canvas) {
			callback(canvas.toDataURL("image/png"), canvas);
		});
	};

	var _save = function (id, options) {

		_toDataURL(id, options, function (data, canvas) {
			_saveToFile({
				data: data,
				canvas: canvas,
				name: options.name || "image.png"
			});
		});
	};

	var _saveToFile = function (conf) {
		var a = document.createElement("a");

		// Can we use the "download" attribute? (Chrome && FF20)
		if (a.download != null) {
			a.href = conf.data;
			a.download = conf.name;
			_pretendClick(a);
			return;
		};

		// IE10
		if (window.navigator.msSaveBlob) {
			conf.canvas.toBlob(function (blobby) {
				if (window.navigator.msSaveBlob) {
					window.navigator.msSaveBlob(blobby, conf.name);
				}
			}, "image/png");
			return;
		}

	};

	function _pretendClick(eElement) {
		var oEvent = document.createEvent("MouseEvents");
		oEvent.initMouseEvent("click", true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
		return eElement.dispatchEvent(oEvent);
	};

	return {
		save: _save,
		toCanvas: _toCanvas,
		toDataURL: _toDataURL
	};
})();
