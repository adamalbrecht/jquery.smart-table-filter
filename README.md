This jQuery plugin is used to apply some semi-advanced filtering to an HTML table. The user will be able to change a select, text field, or other input and see the table update its results immediately.

## Markup
This will work on any basic table. The filter inputs should be placed in the header or footer of the table in the same column as the data they will be filtering on. They inputs will need to have a `data-filter-type` attribute on them indicating the filter that will be applied on the column. There are several built-in functions listed below, or you can define your own custom ones.

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
        <select data-filter-type='randomFilter'>
          <option value=''>All</option>
          <option value='Active|New'>Open</option>
          <option value='Active'>Active</option>
          <option value='New'>New</option>
          <option value='Closed'>Closed</option>
        </select>
      </th>
    </tr>
  </tfoot>
</table>
```

## Calling the Plugin

The plugin should be applied to the entire table element. Currently, more than one table on a page is not supported.

```javascript
$('table.smart-filter-example').smartTableFilter();
```

## Built-In Filter Functions

There are 4 built-in filtering functions:

  * `stringCaseSensitive` - Cell must contain the value of the filter input (case sensitive).
  * `stringCaseInsensitive` - Cell must contain the value of the filter input (not case sensitive)
  * `stringBoolean` - Cell must contain any of the values inside the filter input separted by a |. For example, `<option value='active|new'>Open</option>` would match all cells containing either 'active' or 'new'
  * `dateRange` - Cell content must be a date. When parsed, it should fall inside the range specified in the filter input. For example, `<option value='1356998400-1388448000'>2013</option>` would match all of 2013. As you can see, the dates should be in integer form as seconds since 1970.

## Custom Filter Functions

You can call custom filtering functions if you need logic more complex than simply matching strings. For example, in the HTML markup above, we'd like to have a 'randomFilter' function that hides/shows rows at random. To create it, we simply pass it in as an option. The function should take 2 arguments: the value selected in the filter input and the cell that's being tested against the filter. Return true if the cell passes the filter, false if it doesn't.

```javascript
$('table.smart-filter-example').smartTableFilter({
  'customFilters': {
    'randomFilter': function(selectedFilterValue, cell) {
      if (Math.random() > 0.5) {
        return true;
      } else {
        return false;
      }
    }
  }
});
```


## Persist Filtering using Cookies

If you'd like to persist the filtering settings between page views, set `persistToCookies` to `true` in the options. In order for this to function, all of your filter inputs must have ID's.

You may want to add a prefix for the cookies, especially if you're using this plugin on multiple distinct pages. To do this set `cookiePrefix` in the options.

```javascript
$(function(){
  $('table.smart-filter-example').smartTableFilter({
    'persistToCookies': true,
    'cookiePrefix': '1-sample-',
    'customFilters': {}
  });
});
```
