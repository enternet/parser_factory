function log_json(spreadsheet, sheet_name, json, dot_columns_json) {
  if (!json)
    return;
  
  // массив обработаем по одной записи за раз чтобы гарантированно не пропустить ни одной колонки 
  if (Array.isArray(json)) {
    for (var i in json)
      log_json(spreadsheet, sheet_name, make_plain_json(json[i]), dot_columns_json);
    return;
  }
  
  //Logger.log(sheet_name);
  //Logger.log((json && json.id) ? json.id.toString() : undefined);
  //Logger.log(dot_columns_json);

  // массивы будем записывать на отдельные листы
  var fulljson = union({ ".timestamp": new Date() }, dot_columns_json, make_plain_json(json));
  var fulljson_no_arrays = except(fulljson, Object.keys(fulljson).filter(function(k) { return Array.isArray(fulljson[k]); }));
  var fulljson_arrays_only = except(fulljson, Object.keys(fulljson).filter(function(k) { return !Array.isArray(fulljson[k]); }));
  //Logger.log(fulljson_no_arrays);
  //Logger.log(fulljson_arrays_only);

  // подготовка листа  
  var sheet = spreadsheet.getSheetByName(sheet_name);
  if (!sheet) {
    sheet = spreadsheet.insertSheet(sheet_name);
  }
  add_unknown_columns_to_sheet(sheet, Object.keys(fulljson_no_arrays));
  var columns_list = get_list_of_columns(sheet);
  
  // запись одной строки данных
  var values = [];
  for (var c in columns_list) {
    var column_name = columns_list[c];
    var v = fulljson_no_arrays[column_name];
    if (typeof v === "undefined")
      v = "";
    // обновим дату, чтобы была максимально близка к моменту записи
    if (column_name === ".timestamp")
      v = new Date();
    values.push(v);
  }
  sheet.getRange(sheet.getLastRow() + 1, 1, 1, values.length).setValues([values]);
  
  // запись массивов на отдельные листы
  for (var i in fulljson_arrays_only)
    log_json(spreadsheet, sheet_name + "." + i, fulljson_arrays_only[i], { ".super_id": json.id });
}

function filter_unknown_records(spreadsheet, api_name, json) {
  if (api_name === "login" || !Array.isArray(json) || api_name.indexOf(".") > 0 )
    return json;
  
  var sheet = spreadsheet.getSheetByName(api_name);
  var known_ids = get_column_values(sheet, "id");
  return json.filter(function(item) {
    return known_ids.indexOf(item.id) < 0;
  });
}

function add_unknown_columns_to_sheet(sheet, fields_list) {
  var columns_list = get_list_of_columns(sheet);
  var new_columns = fields_list.filter(function(name) { return columns_list.indexOf(name) < 0; });
  if (new_columns.length > 0) {
    var last_column = sheet.getLastColumn();
    if (sheet.getMaxColumns() < columns_list.length)
      sheet.insertColumnsAfter(last_column, new_columns.length);
    sheet.getRange(1, last_column + 1, 1, new_columns.length).setValues([new_columns]);
  }
}

function get_list_of_columns(sheet) {
  return get_row_values(sheet, 1);
}

function get_row_values(sheet, row_num) {
  var last_column = sheet.getLastColumn();
  if (last_column > 0)
    return sheet.getRange(row_num, 1, 1, last_column).getValues()[0]
  else
    return [];
}

function get_column_values(sheet, column_name) {
  var index_of_column = get_list_of_columns(sheet).indexOf(column_name) + 1;
  if (index_of_column <= 0)
    return undefined;
  var last_row = sheet.getLastRow();
  if (last_row <= 1)
    return [];
  return sheet.getRange(2, index_of_column, sheet.getLastRow() - 1).getValues().map(function(d) { return d[0]; });
}

function get_sheet_id() {
  var id  = SpreadsheetApp.getActiveSpreadsheet().getId();
  Logger.log(id);
  return id;
}

