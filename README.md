simpleGrid — An Html Spreadsheet
==================================================

What is it
--------------------------------------

simpleGrid is a simple spreadsheet javascript library that works given an html table. It wraps the brilliant [dataTables](https://datatables.net/) and buids upon [editableTableWidget](https://mindmup.github.io/editable-table/). 


Dependencies
--------------------------------------

- [jQuery](https://jquery.com/)
- [dataTables](https://datatables.net/) 
- [typeahead.js](https://twitter.github.io/typeahead.js/): used for the autocomplete column type
- [moment.js](http://momentjs.com/): used for the formatting of date column types
- [font-awesome](https://fortawesome.github.io/Font-Awesome/): used for icons on the delete and undo buttons. Can be overridden.
- [Bootstrap](http://getbootstrap.com/): used for some default classes to style buttons and show cells as edited or deleted. Can be overridden.

Special Thanks
--------------------------------------

simpleGrid builds upon the great work done by the folk over at MindMup on [editableTableWidget](https://mindmup.github.io/editable-table/). This is an excellent and simple javascript library for inline editing of html tables and was the inspiration for this library. I wanted to expand on the work they had done but appreciated that one of their key objectives was to keep their library "tiny". Therefore I forked this and began work on a more complex spreadsheet library.


Usage
----------------------------

Using a jquery selector we can target any number of tables on a page:

```
var table = $('#tableId').simpleGrid();
```
Or
```
var table = $('.tableClass').simpleGrid();
```

We can then bring in different modules to bring various pieces of functionality:

- **dataTable**: This will give our tables full filtering, sorting, searching, paging, column visibility toggling , and exporting of data. It is recommended that this be activated to get the most out of simpleGrid. The default is for this to be *shown*.
- **editableTable**: This gives us inline editing of cells (batch or single), deletion of rows, adding of rows, specialised column types such as *autocomplete*, *dropdown*, *multiline*, *dateTime*, and *text box*. Again, it is recommended that if you need editing, this be enabled. The default is for this to be *shown*.
-  **numericTable**: Disabled by default, this will provide some additional basic summation capabilities and validation on cells, rejecting any non-numeric characters. 

### Options
The option types will be shown after the option, follwed by  the default in rounded brackets.
##### SimpleGrid
- **autoAddDeleteBtn** bool (*true*): by default, adding a new row, will add a Delete button to the Delete column.  
- **addRowSelector** string (*'.addRow'*): in order to add a new row to the table, an element will have to contain this class.
- **deleteBtnClass** string (*'btn-danger'*): this is used along with the *undoBtnClass* to add a class to the delete button to apply styling.
- **deletedClass** string (*'danger'*): used to identify a *&lt;tr&gt;* or *&lt;td&gt;* that has been marked for deletion.
- **deleteIconHtml** string (*'&lt;i class="fa fa-trash-o"&gt;&lt;/i&gt;'*): toggling a row as 'deleted' will then show an 'undo' button (*undoIconHtml*). If this undo button is pressed once more, the *deleteIconHtml* is added back to the button along with the deletedClass. Essentially, swapping an undo button for a delete button.
- **deleteRowSelector** string (*'.deleteRow'*): used to allow elements within a *&lt;tr&gt;*, that have this class, to delete a row.
- **duplicateItemClass** string (*'field-validation-error'*): a class added to all cells that are considered duplicates.
- **editedClass** string (*'success'*): a class added to show a cell or row has been edited.
- **internalDeletionClass** string (*'deleted'*): used internally, but is surfaced as an option to allow overriding, in case of conflict with existing stylings. 
- **markCellEdited** bool (*false*): mutally exclusive with *markRowEdited*. Presedence is given to *markCellEdited*. If a cell is edited, it will be marked with the *editedClass*.
- **markDuplicates** bool (*true*): toggles the duplicate checking behaviour on data. By default, the column in position zero, will be checked for duplicate values after every cell edit. The column can be altered by setting the *uniqueColumnName* option.
- **markRowEdited** bool (*true*): similar to the *markCellEdited* option, but applies to an entire row. 
- **newCellContent** string (*'-- New Row --'*): when adding a new row, by default, every cell will be assigned the *newCellContent* value. This can be prevented by editing the *newRowTemplate*.
- **newRowTemplate** string[] (*undefined*): a string array of new cell values that must match the total number of available columns. *null* must be used for *checkbox* or *Delete* columns.
```bash
newRowTemplate: ["", " {NEW ROW} ", "", null],
```
- **primaryKey** string (*undefined*): this works in conjunction with the 'data-id' attribute on the *&lt;tbody&gt;&lt;tr&gt;* and is the name of a column that will be attached to the object returned by *EditedRows()*. This can be omitted if there is no intention of updating data or if the Primary Key is already included as a column in the table.
- **readOnlyColumns** string[] (*undefined*): allows columns to be named as *readonly*. Alternatively, the *readonly* attribute can be added to the respective *&lt;thead&gt;&lt;th&gt;* cell for that column.
- **rowClickNewTab** bool (*true*): if a *&lt;tbody&gt;&lt;tr&gt;* element has an *href* attribute set, this property indicates if clicking this row will open a new tab in the browser.
- **sortColumnName** string (*undefined*): the name of the column to be sorted (in ascending order), once initialised.
- **tableFilter** bool (*true*): adds a *&lt;tfoot&gt;* element just below the *&lt;thead&gt;* and adds column filtering. This cannot be added if a footer is used elsewhere in the table. The *&lt;tfoot&gt;* element will be added automatically, there is no need to include it on the table.
- **tableFilterClass** string (*undefined*): a class that can be added to each *&lt;th&gt;* element of the footer.
- **undoBtnClass** string (*'btn-warning'*): see *deleteBtnClass*
- **uniqueColumnName** string (*undefined*): see *uniqueColumnName* 
- **undoIconHtml** string (*'&lt;i class="fa fa-undo"&gt;&lt;/i&gt;'*): see *deleteIconHtml*

##### DataTable
###### Example
```bash
var table = $('#tableId').simpleGrid({
    dataTable: {
        show: true,
        definition: {
            // dataTable initialisation object      
        }
    }
});
```
- **checkboxColumns** string[] (*[]*): denotes columns that should contain a checkbox. This ensures a checkbox *&lt;input&gt;* is added automatically for checkbox columns when a new row is added.
- **definition** object (*{  }*): this is used exclusively for the dataTables initialisation object. For further details, consult [dataTables.net](http://datatables.net/examples/basic_init/index.html). By default, there are a number of values passed in to the dataTables initialisation. These can be overridden per instance by passing in values here, or by  stepping into the simpleGrid.js file and altering the defaults specified at the bottom.
- **hiddenColumns** string[] (*[]*): an array of column names that should initially be hidden.
- **hiddenRows** string[] (*[]*): an array of class selectors that, when matched to classes found on on *&lt;tbody&gt;&lt;tr&gt;* elements, will initially set them to be hidden.
```bash
hiddenRows: [
    ".class1",
    ".class2",
    ".class7"
],
```
- **noFilters** string[] (*[]*): by default, column filters will be added to each column, not matching ["View", "Edit", "Delete"]. This option allows for additional columns to be excluded from the column filtering, i.e. no filter box will appear above that column.
- **orderColumns** [[colName: "asc" | "desc"]] (*[]*): an array of order arrays. Multiple order arrays can be specified. Data will first be sorted by the order specified in the orderColumns array, position zero. Additional sorting will be applied in turn, in the order specified in this array. In the abscence of this option, data will automatically be sorted by the column in position zero, in ascending order. 
```bash
orderColumns: [
    ["col7", "desc"],
    ["col3", "asc"]
]
```
- **selectFilters** string[] \(*[]*\): a column filter will default to an *&lt;input&gt;* element, however, this can be made to be a *&lt;select&gt;* element populated with all the values that exist in the current dataset, for that column. Simply add the column names this should apply to.
`
selectFilters: [
    "col4",
    "col8"
]
`
- **show** bool (*true*): will the dataTable be active 
- **tableOnly** bool (*false*): this option is used in conjunction with *tableOnlyDef* and allows for a second 'table only' layout to be applied. This can strip everything such as paging, searching, and column visibility buttons from the layout. Only the table will be displayed.
- **tableOnlyDef** string (*'t'*): In some instances you may wish to show only a table with paging. This can be achieved by setting this option and setting the *tableOnly* option to true. Please consult the [dataTables](https://datatables.net/reference/option/dom) documentation on details for setting the dataTables dom option.
- **visibleColumns** string[] (*[]*): this is the inverse of the hiddenColumns option above. On occasion, the number of columns on a table may dictate it to be simpler to specify which columns are visible rather than which columns to hide, initially.

##### EditableTable
###### Example
```bash
var table = $('#tableId').simpleGrid({
    editableTable: {
        show: true,
        definition: {
                 
        }
    }
});
```
- **show** bool (*true*): will the editableTable be active 
- **definition** object:  
    - **callback** function (*undefined*): used in conjunction with the *url* property. This function will be called after a successful postback. Suggestions might involve some form of success toaster.
    - **columns** {string: string} (*undefined*): Marries up the column names with the column types
```bash
columns: {
    "col1": "typeDate1",
    "col2": "typeMultiline1",
    "col14": "typeDate1"
}
```
    - **defaultOptions** object (*see below*)
      - **cloneProperties** string[] (*['padding', 'padding-top', 'padding-bottom', 'padding-left', 'padding-right', 'text-align', 'font', 'font-size', 'font-family', 'font-weight']*): a list of CSS properties that will be cloned from the cell to the editor.
      - **editor** string (*'&lt;input&gt;'*): the default editor shown if none are explicitly specified
    - **editorsMaxWidth** bool (*true*): forces editors to consume the entire width of the cell. In some instances of larger screens and very few columns, column widths can be large, and the associated editors may exceed any max width set for that control type.
    - **types** {object} (*undefined*):
      - **column type** object (*undefined*): the object used to define a non-standard (non-textbox) editor for a column. This can be defined once and reused on multiple columns in the columns collection defined above.
        - **type** string (*undefined*): by default, if a column has not been assigned a type, it will default to a standard html *input* or 'textbox'. Other types are available and must match these names, i.e. written in all lowercase. Additional properties specific to each type have been detailed below, however, when specifying these, they should be set at the same level as the type:
```bash
    definition: {
        types: {
            "aType": {
                type: "dropdown",
                sort: $.editableTable.dropdownSort.TEXT,
                source: [ "Value 1", "Value 2", "Value 3" ]
            },
            "anotherType": {
                type: "multiline"
            },
            "yetAnotherType": {
                type: "date",
                fixedDayOfMonth: 1
            },
            "stillAType": {
                type: "autocomplete",
                url: "/someArea/api/GetAutoCompleteData"
            }
        }     
    }
```
          - **autocomplete** (*&lt;input&gt;*): utilises the *typeahead* library
            - **url** string (*undefined*): a url to return a string[] of lookup values
          - **date** (*&lt;input&gt;*)
            - **dateFormat** string (*'DD MMM YYYY'*): allows custome date format to be set
            - **fixedDayOfMonth** int (*undefined*) [1-31]: allows a specific day to be always be chosen for a given month. For example always picking the 1st of the month chosen.
            - **timePicker** bool (*false*): toggles time picking component of date picker
          - **dropdown** (*&lt;select&gt;*)
            - **source** object | string[] (*undefined*): For an object, each element should be of the form "Id": "Display Value". This will create an html *select* element, with each option's *value* attribute being assigned the *"Id"* property name and the option contents being assigned the *"Display Value"*. A string array can also be accepted. This will assign the value attribute the index position in the array (zero-based index). The option contents will be assigned to the array text value. 
              - **object**
```bash
{
    "1": "Value 1",
    "2": "Value 2",
    "3": "Value 3"
}
```
              - **string[]**
```bash
[
    "Value 1",
    "Value 2",
    "Value 3"
]
```
            - **sort** dropdownSort (*dropdownSort.TEXT*) [NONE | ID | TEXT]: used to specify the order that options within the select will be sorted.
          - **multiline** (*&lt;textarea&gt;*)
    - **url** string (*undefined*):  URL accepting an Ajax HTTP POST. Allows for immediate posting of each cell update, as it is made. An object is constructed using the *name* attribute of the *&lt;td&gt;* or respective *&lt;thead&gt;&lt;th&gt;* cell as a property and the value being assigned the trimmed text contents of the cell. In addition, any data attributes are serialised and included.
```bash
&lt;td name="percentage"
    data-projectid="4"
    data-personid="5"&gt;
    57
&lt;/td&gt;
```
        Results in the following object being posted:
```bash
{
  "percentage": 57,
  "projectid": 4,
  "personid": 5
}
```

###### Exposed constant object
- **dropdownSort** object ({
        NONE: 'NONE',
        TEXT: 'TEXT',
        ID: 'ID'
    }): Used as external constant, in the absence of JS constants (pre ES2015). This allows the way in which values of an editor of type dropdown, to be sorted. 

##### NumericTable
Values are validated upon entry and only numeric characters, decimal points, and dollar ($) or pound (£) signs will be accepted.
###### Example
```bash
var table = $('#tableId').simpleGrid({
    numericTable: {
        show: true,
        definition: {
                 
        }
    }
});
```
- **show** bool (*false*): will the numericTable be active 
- **definition** object (**):  
    - **blankZeros** bool (*false*): when initialising the numericTable, any values of zero will have the *blankZerosClass* added.
    - **blankZerosClass** string (*'blank'*): the class that will be added to any zero-valued cells, if the *blankZeros* property is set.
    - **excludeColumnClass** string (*'excludeCol'*): a class used on the *&lt;thead&gt;&lt;th&gt;* elements to denote columns that should be excluded from any numeric validation
    - **initTotals** bool (*false*): preCalculates the totals on all *totalColumns* and footers. If you already have totals precalculated this can be left switched off.
    - **maxTotalPerTotalColumn** int (*99999*): dictates the maximum value accepted in *totalColumns*. If this value is exceeded, the *deletedClass* will be added to the *&lt;td&gt;*.
    - **maxValue** int (*99999*):  dictates the maximum value accepted for a single editable cell.  If this value is exceeded, the entry will be rejected.
    - **totalColumnClass** string (*totalCol*): a class used on the *&lt;thead&gt;&lt;th&gt;* elements to denote columns that should be treated as total columns. A total column is one that is readonly and sums the contents of the row (excluding any excludeColumns) between either the beginning of the row, or from the last totalColumn if another appears closer towards the left hand side.

### Methods

- **EditedRows** (*wrapperObject: string*) returns *object[]* : This uses the *editedClass* & *deletedClass* properties and determines which rows have these assigned. This indicates which rows will be included. Rows to be deleted will be assigned the property:
```bash
ToDelete: true
```
    Returns
```bash
[
    {
        Col1: "25",
        Col2: "someName",
        Col3: "Active",
        ToDelete: false
    },
    {
        Col1: "23",
        Col2: "someOtherName",
        Col3: "Active",
        ToDelete: true
    }
]
```
    The *wrapperObject* allows each row object to be wrapped in a further object.
```bash
[
    {
        wrapper: {
            Col1: "25",
            Col2: "someName",
            Col3: "Active",
            ToDelete: false
        }
    },
    {
        wrapper: {
            Col1: "23",
            Col2: "someOtherName",
            Col3: "Active",
            ToDelete: true
        }
    }
]
```
- **ToggleRows**(*selector: string*): Only show rows matching the given filter. This is a jQuery selector so can include comma separated values.
```bash
    var tbl = $('#tableId').simpleGrid();
    tbl.ToggleRows('.class1,.class2,.class5');
```
- **ToggleColumnByName**(*colName: string, makeVisible: bool*): toggle a column containing the given column name
```bash
    var tbl = $('#tableId').simpleGrid();
    tbl.ToggleColumnByName('colName1', false);
```
- **ToggleColumnByClass**(*className: string, makeVisible: bool*): toggle a column containing the given class
```bash
    var tbl = $('#tableId').simpleGrid();
    tbl.ToggleColumnByClass('class1', true);
```

Questions?
----------

If you have any questions, please feel free to ask through gitHub.
