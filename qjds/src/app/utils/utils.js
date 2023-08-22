export const byString = function (o, s) {
  s = s.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
  s = s.replace(/^\./, '');           // strip a leading dot
  var a = s.split('.');
  for (var i = 0, n = a.length; i < n; ++i) {
    var k = a[i];
    if (k in o) {
      o = o[k];
    } else {
      return;
    }
  }
  return o;
}
export const searchData = (entities, columns, searchTerm = '') => {
  const docs = entities.filter((item) => {
    let conditionMatch = false
    // console.log(columns)
    columns.map((column) => {
      //Search found columns and single data                
      if (item[column.dataField] && item[column.dataField]?.toString()?.toLowerCase().includes(searchTerm.toLowerCase())) {
        conditionMatch = true
      }
      ////Search not found columns but nested data 
      if (column.dataField.includes('.') || column.dataField.includes('[')) {
        const search = byString(item, column.dataField)
        if (search && search.toLowerCase().includes(searchTerm.toLowerCase())) {
          conditionMatch = true
        }
      }
    })
    return conditionMatch
  });
  const totalCount = docs.length;
  return { totalCount, entities: docs }
}

export const formateAmount = function (amount) {
  var formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });
  if (amount > 0) {
    return formatter.format(amount);
  } else {
    return formatter.format(0);
  }
}

export const checkPermission = function (module, permission) {
  let rights = JSON.parse(localStorage.getItem('rights'))
  let setPermission = false
  if(rights) {
    rights.filter((item) => {
      if (item.code == module) {
        setPermission = item[permission]
      }
    })
  }
  return setPermission
}

export const getDisplayEditorContent = function (content) {
  let return_content = ''
  if (content) {
    return_content = content.replaceAll("<table", "<table border=1").replaceAll("\n\t", '').replaceAll("\n<tr>", "<tr>").replaceAll("</tr>\n\n\n<tr>", '</tr><tr>').replaceAll("\\r\\n", "<br />").replaceAll("\r\n", "<br />").replaceAll("\n", "<br />")
  }
  return return_content
}