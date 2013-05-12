(function ( $ ) {
  var table;
  var settings;
  var filters = [];
  $.fn.smartTableFilter = function(options) {
    table = this;

    // Read the Cookie
    // ==============================================================

    // Define default filter functions
    // ==============================================================

    // Match basic strings (case sensitive)
    var stringCaseSensitive = function(selectedFilterValue, cell) {
      if ((selectedFilterValue == null) || (selectedFilterValue.length == 0)) {
        return true;
      }
      return ($(cell).text().indexOf(selectedFilterValue) !== -1);
    };
    // Match basic strings (not case sensitive)
    var stringCaseInsensitive = function(selectedFilterValue, cell) {
      if ((selectedFilterValue == null) || (selectedFilterValue.length == 0)) {
        return true;
      }
      return ($(cell).text().toLowerCase().indexOf(selectedFilterValue.toLowerCase()) !== -1);
    };
    // Match strings which may contain multiple values separated by a |
    // Case insensitive
    var stringBoolean = function(selectedFilterValue, cell) {
      var filterValues = selectedFilterValue.split('|');
      for (var i=0; i<filterValues.length; i++) {
        if (stringCaseInsensitive(filterValues[i], cell)) {
          return true;
        }
      }
      return false;
    };

    // Match a range of dates. The filter values should be represented
    // as number of seconds since 1970, separated by a dash. The date in
    // the cell will be parsed using the standard JS date parsing function.
    var dateRange = function(selectedFilterValue, cell) {
      if (!selectedFilterValue) {
        return true;
      }
      else if (!cell || !cell.text()) {
        return false;
      }
      var start = parseInt(selectedFilterValue.split("-")[0]);
      var finish = parseInt(selectedFilterValue.split("-")[1]);
      var curDate = Date.parse(cell.text()) / 1000;
      return ((curDate >= start) && (curDate <= finish));
    }

    // Plugin Settings
    // ==============================================================
    settings = $.extend({
      'persistToCookies': false,
      'cookiePrefix': '',
      'customFilters': {}
    }, options);


    // Generate a complete list of filter functions
    // ==============================================================
    filterFunctions = {
      'stringCaseSensitive' : stringCaseSensitive,
      'stringCaseInsensitive': stringCaseInsensitive,
      'stringBoolean' : stringBoolean,
      'dateRange': dateRange
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
      if (settings['persistToCookies'] == true) {
        saveFiltersToCookies();
      }
    };

    // Cookie Helper Functions
    // ==============================================================
    var createCookie = function(name,value,days) {
      if (days) {
        var date = new Date();
        date.setTime(date.getTime()+(days*24*60*60*1000));
        var expires = "; expires="+date.toGMTString();
      }
      else var expires = "";
      var theCookie = name+"="+value+expires+"; path=/";
      document.cookie = theCookie;
    };

    var readCookie = function(name) {
      var nameEQ = name + "=";
      var ca = document.cookie.split(';');
      for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
      }
      return null;
    };

    var eraseCookie = function(name) {
      createCookie(name,"",-1);
    };

    // Save the current value of the filter inputs to cookies
    // ==============================================================
    var saveFiltersToCookies = function() {
      $(table).find('[data-filter-type]').each(function(i, filterInput) {
        createCookie(settings['cookiePrefix'] + $(filterInput).attr('id'), $(filterInput).val(), 180);
      });
    };

    // Load filter values from cookies
    // ==============================================================
    if (settings['persistToCookies'] == true) {
      $(table).find('[data-filter-type]').each(function(i, filterInput) {
        var cookieVal = readCookie(settings['cookiePrefix'] + $(filterInput).attr('id'));
        if (cookieVal) {
          $(filterInput).val(cookieVal);
        }
      });
      applyFilters();
    }

    // Change event on all of the filter inputs
    // ==============================================================
    $(table).find('[data-filter-type]').on('change', function(e) { applyFilters(); });
    $(table).find("input[type='text'][data-filter-type]").on('keyup', function(e) { applyFilters(); });

    return table;
  };
}(jQuery));
