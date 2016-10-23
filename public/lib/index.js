function listFiles() {
  var table = document.getElementById('list-files-table');
  //TODO: Get form setting
  var listForm = {
    'max-keys': 100
  };

  $.post('/getFuckingList', listForm, function(result) {
    console.log(result);
    var objects = result.objects.sort(function (a, b) {
      var ta = new Date(a.lastModified);
      var tb = new Date(b.lastModified);
      if (ta > tb) return -1;
      if (ta < tb) return 1;
      return 0;
    });

    var numRows = table.rows.length;
    for (var i = 1; i < numRows; i ++) {
      table.deleteRow(table.rows.length - 1);
    }

    for (var i = 0; i < objects.length; i ++) {
      var row = table.insertRow(table.rows.length);
      row.insertCell(0).innerHTML = objects[i].name;
      row.insertCell(1).innerHTML = objects[i].size;
      row.insertCell(2).innerHTML = objects[i].lastModified;
    }
  });

};

window.onload = function () {
  document.getElementById('file-button').onclick = function () {
    //applyTokenDo(uploadFile);
  }

  document.getElementById('content-button').onclick = function () {
    //applyTokenDo(uploadContent);
  }

  document.getElementById('list-files-button').onclick = function () {
    listFiles();
  }

  document.getElementById('dl-button').onclick = function () {
    //applyTokenDo(downloadFile);
  }
};
