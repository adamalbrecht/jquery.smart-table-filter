This jQuery plugin is used to apply some semi-advanced filtering to an HTML table. The user will be able to change a select, text field, or other input and see the table update its results immediately.

## Markup
This will work on any basic table. The filter inputs should be placed in the header or footer of the table in the same column as the data they will be filtering on. They inputs will need to have a `data-filter-type` attribute on them indicating the filter that will be applied on the column. There are built in filtering functions for `stringCaseSensitive` and `stringCaseInsensitive`. Creating custom filters is demonstrated below.

```html
<table class='smart-filter-example'>
  <thead>...</thead>
  <tbody>...</tbody>
  <tfoot>
    <tr>
      <th>
        <input data-filter-type='stringCaseInsensitive' type='text' />
      </th>
      <th>
        <select data-filter-type='statusFilter'>
          <option value=''>All</option>
          <option value='Active|New'>Open</option>
          <option value='Active'>Active</option>
          <option value='New'>New</option>
          <option value='Closed'>Closed</option>
        </select>
      </th>
    </tr>
  </tfoot>
</table
```

## Basics

The plugin should be applied to the entire table element. Currently, more than one table on a page is not supported.

```javascript
$('table.smart-filter-example').smartTableFilter();
```

## Custom Functions

You can call custom filtering functions if you need logic more complex than simply matching strings. For example, in the HTML markup above, we'd like to have a 'statusFilter' function that shows both 'Active' and 'New' rows when 'Open' is selected. To create this function, we pass it in as an option. The function should take 2 arguments: the value selected in the filter input and the cell that's being tested against the filter. Return true if the cell passes the filter, false if it doesn't.

```javascript
$('table.smart-filter-example').smartTableFilter({
  'customFilters': {
    'statusFilter': function(selectedFilterValue, cell) {
      if (!selectedFilterValue) { return true; } // blank means the filter is off
      var cellText = $.trim(cell.text());
      var statuses = selectedFilterValue.split('|');
      for (var i=0; i<statuses.length; i++) {
        if ($.trim(statuses[i]) == cellText) {
          return true;
        }
      }
      return false;
    }
  }
});
```


## Persist Filtering using Cookies

Coming soon...
