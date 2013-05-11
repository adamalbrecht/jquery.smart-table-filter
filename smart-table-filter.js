(function ( $ ) {
  var table;
  var settings;
  var filters = [];
  $.fn.smartTableFilter = function(options) {
    table = this;

    // Define default filter functions
    // ==============================================================
    var stringCaseSensitive = function(selectedFilterValue, cell) {
      if ((selectedFilterValue == null) || (selectedFilterValue.length == 0)) {
        return true;
      }
      return ($(cell).text().indexOf(selectedFilterValue) !== -1);
    };
    var stringCaseInsensitive = function(selectedFilterValue, cell) {
      if ((selectedFilterValue == null) || (selectedFilterValue.length == 0)) {
        return true;
      }
      return ($(cell).text().toLowerCase().indexOf(selectedFilterValue.toLowerCase()) !== -1);
    };
    var string = stringCaseInsensitive;

    // Plugin Settings
    // ==============================================================
    settings = $.extend({
      'saveInCookies': false,
      'cookiePrefix': '',
      'customFilters': {}
    }, options);

    // Generate a complete list of filter functions
    // ==============================================================
    filterFunctions = {
      'stringCaseSensitive' : stringCaseSensitive,
      'stringCaseInsensitive': stringCaseInsensitive
    }
    for (var customFunc in settings['customFilters']) {
      filterFunctions[customFunc] = settings['customFilters'][customFunc];
    }

    // Function used to apply the filters to the table
    // ==============================================================
    var applyFilters = function() {
      var curFilters = [];
      table.find('[data-filter-type]').each(function(i, filterInput) {
        curFilters.push({
          'columnIndex': $(filterInput).parents('td, th').index(),
          'filterValue': $(filterInput).val(),
          'filterFunction': filterFunctions[$(filterInput).data('filter-type')]
        });
      });
      $(table).find('tbody tr').each(function(i, row) {
        var shown = true;
        $.each(curFilters, function(i, cf) {
          var cell = $(row).find('td:nth-child(' + (cf['columnIndex'] + 1) + ')');
          if (!cf['filterFunction'](cf['filterValue'], cell)) {
            shown = false;
          }
        });
        if (shown) {
          $(row).show();
        } else {
          $(row).hide();
        }
      });
    };

    // Change event on all of the filter inputs
    // ==============================================================
    $(table).find('[data-filter-type]').on('change', function(e) { applyFilters(); });
    $(table).find("input[type='text'][data-filter-type]").on('keyup', function(e) { applyFilters(); });

    return table;
  };
}(jQuery));
