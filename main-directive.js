angular.module("myApp", []).directive("myDirective", function ($http) {
  return {
    restrict: "AEC",
    scope: {
      onButtonClick: "&",
      ngModel: "=",
      SortColumn: "=",
      sortBy: "&",
    },
    link: function (scope, element, attrs) {
      scope.card = "Daniel";
      scope.isGroup = false;
      scope.isFreeze = JSON.parse(attrs.ngFreeze);
      scope.myFlagCheckboxModel = false;
      scope.toggleFirstColumn = false;
      scope.message = attrs.type;
      let datas = JSON.parse(attrs.datasource);
      scope.HeaderColorOptions = JSON.parse(attrs.headercoloroptions);
      scope.moreOptions = JSON.parse(attrs.moreoptions);
      scope.data = datas.data;
      scope.column = datas.column;
      scope.columnData = datas.column;
      scope.tableData = [];
      scope.tableColumn = scope.column;
      (scope.curPage = 1), (scope.itemsPerPage = 5), (scope.maxSize = 5);
      scope.originalData = scope.data;
      this.items = scope.data;
      let begin = (scope.curPage - 1) * scope.itemsPerPage;
      let end = begin + scope.itemsPerPage;

      scope.tableData = scope.data.slice(begin, end);
      scope.getRowsObjects();
      scope.numOfPages = function () {
        scope.noOfPages = Math.ceil(scope.data.length / scope.itemsPerPage);
      };

      scope.numOfPagess = function () {
        scope.tableData = scope.data.slice(
          parseInt(scope.curPage - 1) * parseInt(scope.itemsPerPage),
          parseInt(scope.curPage - 1) * parseInt(scope.itemsPerPage) +
            parseInt(scope.itemsPerPage)
        );
        scope.getRowsObjects();
        scope.numOfPages();
      };

      scope.prevPage = function () {
        if (scope.curPage > 1) {
          scope.curPage--;
        }
        scope.tableData = scope.data.slice(
          parseInt(scope.curPage) * parseInt(scope.itemsPerPage),
          parseInt(scope.curPage) * parseInt(scope.itemsPerPage) +
            parseInt(scope.itemsPerPage)
        );
      };

      // Function to handle next page button click
      scope.nextPage = function () {
        if (scope.curPage < scope.noOfPages) {
          scope.curPage++;
        }
        scope.tableData = scope.data.slice(
          parseInt(scope.curPage) * parseInt(scope.itemsPerPage),
          parseInt(scope.curPage) * parseInt(scope.itemsPerPage) +
            parseInt(scope.itemsPerPage)
        );
      };

      scope.gotopage = function (n) {
        scope.curPage = n;
        scope.tableData = scope.data.slice(
          parseInt(scope.curPage) * parseInt(scope.itemsPerPage),
          parseInt(scope.curPage) * parseInt(scope.itemsPerPage) +
            parseInt(scope.itemsPerPage)
        );
      };

      // Function to set current page
      scope.setPage = function (page) {
        scope.curPage = page;
        scope.tableData = scope.data.slice(
          parseInt(scope.curPage) * parseInt(scope.itemsPerPage),
          parseInt(scope.curPage) * parseInt(scope.itemsPerPage) +
            parseInt(scope.itemsPerPage)
        );
      };

      scope.pages = Array.from({ length: scope.numOfPages() }, (_, i) => i + 1);
      scope.temp = scope.column;
      scope.objectKeys = Object.keys(scope.tableData[0]);
    },
    templateUrl: "templates/table.html",
    controller: function ($scope, $document) {
      $document.on("click", function (event) {
        var isClickedElementChildOfPopup = event.target.closest("#closePopup");
        var isClickedElementTriggerButton =
          event.target.matches("#triggerClosePopup");
        if (!isClickedElementChildOfPopup && !isClickedElementTriggerButton) {
          var isClickedElementGChildofPop = event.target.matches(".sortPopup");
          if (!isClickedElementGChildofPop) {
            $scope.sortPopupVisible = false;
            $scope.$apply();
          }

          if ($scope.optionForAddColumn) {
            filterPop = $scope.optionForAddColumn.field;
            if (filterPop == "Filter by this field") {
              $scope.filterByField($scope.columnForAddColumn);
              $scope.optionForAddColumn = undefined;
              $scope.columnForAddColumn = undefined;
            }
          } else {
            if (!(event.target.innerHTML == "close")) {
              $scope.filterIcon = false;
              $scope.columnDataList = [];
              $scope.getColumnList = [];
            }
          }
          $scope.viewHideColumn = false;
          $scope.$apply();
        }

        var isClickedElementChildOfPopup =
          event.target.closest(".popup-container");
        var t = event.target.closest("#closeSidePopup");
        let wantedFields = [
          "Edit field",
          "Set Column Header Color",
          "Set Full Column Color",
          "Set Conditional Colours",
        ];
        if ($scope.optionForAddColumn) {
          filterPop = $scope.optionForAddColumn.field;
          if (!wantedFields.includes(filterPop)) {
            $scope.$apply(function () {
              $scope.popup.style.display = "none";
            });
          }
          $scope.optionForAddColumn = undefined;
        }
        if (
          !isClickedElementChildOfPopup &&
          !isClickedElementTriggerButton &&
          !t
        ) {
          $scope.addFieldPopup = false;
          $scope.deleteIcon = false;
          $scope.$apply(function () {
            $scope.popup.style.display = "none";
          });
        }
      });
      setTimeout(() => {
        $scope.hidingColumnArrayList = [...$scope.column];
        $scope.constColumnArrayList = [...$scope.column];
      }, 1000);

      setTimeout(() => {
        var cells = document.getElementsByTagName("td");

        for (var i = 0; i < cells.length; i++) {
          cells[i].addEventListener("mouseover", function (event) {
            var rect = this.getBoundingClientRect();
            var x = event.clientX;
            var y = event.clientY;
            var rightEdge = rect.right;
            var bottomEdge = rect.bottom;
            var leftEdge = rect.left;
            var topEdge = rect.top;
            if (
              x >= rightEdge - 5 ||
              y >= bottomEdge - 5 ||
              x <= leftEdge + 5 ||
              y <= topEdge + 5
            ) {
              this.style.cursor = "cell";

              this.addEventListener("mousedown", startResize);
            } else {
              this.style.cursor = "default";
              this.removeEventListener("mousedown", startResize);
            }
          });
        }

        function startResize(event) {
          var cell = this;
          var originalWidth = cell.offsetWidth;
          var originalHeight = cell.offsetHeight;
          var originalX = event.clientX;
          var originalY = event.clientY;

          document.addEventListener("mousemove", resize);

          document.addEventListener("mouseup", stopResize);

          function resize(event) {
            var width = originalWidth + (event.clientX - originalX);
            var height = originalHeight + (event.clientY - originalY);
            cell.style.minWidth = width + "px";
            cell.style.height = height + "px";
          }

          function stopResize() {
            document.removeEventListener("mousemove", resize);
            document.removeEventListener("mouseup", stopResize);
          }
        }
      }, 1000);

      $scope.filter_column = true;
      $scope.conditionDropdownItems = ["WHERE", "AND", "OR"];
      $scope.expressionDropdownItems = [
        "EQUAL",
        "NOT EQUAL",
        "LIKE",
        "NOT LIKE",
        "IN",
        "NOT IN",
        "IS",
      ];
      $scope.checked = [];
      $scope.myForm = {
        myFields: [
          { condition: "WHERE", columnName: "", expression: "", value: "" },
        ],
      };

      $scope.ColumnForm = {
        myFields: [{ name: "", no: "" }],
        arrangement: "",
      };
      $scope.selectedCell = [];
      $scope.parents = [
        {
          name: "sabari",
          age: "25",
          children: [
            {
              name: "sabari",
              age: "25",
            },
          ],
        },
      ];
      $scope.checkbox = false;

      window.addEventListener("keydown", function (event) {
        if ($scope.selectedCell.length) {
          let as = $scope.selectedCell[$scope.selectedCell.length - 1];
          let i = as[0];
          let j = as[1];
          if (event.key === "Tab") {
            event.preventDefault();
            $scope.selectedCell.push([i, j + 1]);
            updateCellByButton(i, j + 1);
          } else if (event.key === "ArrowUp") {
            if (i - 1 >= 0) {
              $scope.selectedCell.push([i - 1, j]);
              updateCellByButton(i - 1, j);
            }
          } else if (event.key === "ArrowDown") {
            if (i >= 0) {
              $scope.selectedCell.push([i + 1, j]);
              updateCellByButton(i + 1, j);
            }
          } else if (event.key === "ArrowLeft") {
            if (j - 1 >= 0) {
              updateCellByButton(i, j - 1);
            }
          }
        }
      });

      function updateCellByButton(i, j) {
        let existData = [];
        $scope.selectedCell.forEach((e) => {
          if (e[0] === i && e[1] === j) {
            let a = document.getElementById(`${e[0]}-${e[1]}`);
            let b = document.getElementById(`${e[0]}-${e[1]}-index`);
            if (a && b) {
              a.style.display = "none";
              b.style.display = "block";
              b.focus();
            }

            existData = e;
          } else {
            let a = document.getElementById(`${e[0]}-${e[1]}`);
            let b = document.getElementById(`${e[0]}-${e[1]}-index`);
            if (a && b) {
              a.style.display = "block";
              b.style.display = "none";
            }
          }
        });
        $scope.selectedCell = $scope.selectedCell.filter(
          (data) => existData[0] === data[0] && existData[0] === data[0]
        );
      }
      $scope.toggleSidenav = () => {
        $scope.toggleFirstColumn = !$scope.toggleFirstColumn;
        $scope.freezeColumn(0, "MyViews");
      };

      $scope.getData = function () {
        var inputData = $scope.myData;
        var selectedOption = $scope.selectedValue;
        if ($scope.myData) {
          $scope.myStyle = {
            "background-color": $scope.myData,
          };
        } else {
          $scope.myStyle = {
            "background-color": "black",
          };
        }
      };
      $scope.editRow = function (row) {
        row.editable = !row.editable;
        row = row;
        $scope.onButtonClick({ $event: row });
      };
      $scope.selectCols = function (i, j) {
        $scope.selectedCell.push([i, j]);
        $scope.selectedCell.forEach((e) => {
          if (e[0] === i && e[1] === j) {
            let a = document.getElementById(`${e[0]}-${e[1]}`);
            let b = document.getElementById(`${e[0]}-${e[1]}-index`);
            a.style.display = "none";
            b.style.display = "block";
            b.focus();
            document.addEventListener("click", function () {
              b.blur();
              a.style.display = "block";
              b.style.display = "none";
            });
          } else {
            let a = document.getElementById(`${e[0]}-${e[1]}`);
            let b = document.getElementById(`${e[0]}-${e[1]}-index`);
            a.style.display = "block";
            b.style.display = "none";
          }
        });
      };
      $scope.format = function (item, count, property) {
        $scope.data[count].checked = property.target.checked;
        if (property.target.checked) {
          var table = document.getElementById("mytable");
          table.rows[count + 1].style.backgroundColor = "aliceblue";
        }
      };
      $scope.checkBoxchanges = function (event, item) {
        let datacheck = document.querySelectorAll(".markCheck");
        $scope.data.forEach((d) => {
          d.checked = datacheck[0].checked;
        });
      };

      $scope.removeField = function (index) {
        $scope.myForm.myFields.splice(index, 1);
      };

      $scope.saveChanges = function () {
        $scope.colList.push($scope.getColumnList);
      };
      $scope.columnDataList = [];
      $scope.getColumn = function (index) {
        if (!$scope.columnDataList.includes(index)) {
          $scope.columnDataList.push(index);
          $scope.showColumnBox = true;
          const box = document.getElementById("box");
          const insideBox = document.createElement("div");
          insideBox.classList.add("chip");
          insideBox.style.display = "flex";
          insideBox.style.alignItems = "center";
          insideBox.style.gap = "5px";
          const chip = document.createElement("div");
          chip.classList.add("col");
          chip.textContent = index;
          const icon = document.createElement("span");
          icon.classList.add("icon");
          icon.classList.add("material-symbols-outlined");
          icon.style.height = "10px";
          icon.style.fontSize = "15px";
          icon.style.color = "red";
          icon.style.cursor = "pointer";
          icon.textContent = "close";
          insideBox.appendChild(chip);
          insideBox.appendChild(icon);
          box.appendChild(insideBox);
          icon.addEventListener("click", function () {
            $scope.removeColumn(chip.innerHTML);
            insideBox.remove();
          });
        }

        if (!$scope.getColumnList) {
          $scope.getColumnList = [];
        }
        $scope.getColumnList.push(index);
      };
      $scope.removeColumn = function (index) {
        $scope.getColumnList.splice(index, 1);
      };
      $scope.addField = function () {
        var field = {
          condition: "",
          columnName: "",
          expression: "",
          value: "",
        };
        $scope.myForm.myFields.push(field);
      };
      $scope.submitForm = function () {
        $scope.assignValues();
        $scope.column.forEach((value) => {
          $scope.data.forEach((da) => {
            if (!$scope.filterData[value.field].includes(da[value.field])) {
              $scope.filterData[value.field].push(da[value.field]);
            }
          });
        });
      };

      $scope.assignValues = () => {
        $scope.filterData = {};
        $scope.column.forEach((value) => {
          $scope.filterData[value.field] = [];
        });
      };

      $scope.viewTable = () => {
        if ($scope.getColumnList.length) {
          $scope.column = $scope.tableColumn.filter((item) => {
            return $scope.getColumnList.includes(item.field);
          });
        } else {
          $scope.column = $scope.tableColumn;
        }
      };

      $scope.filterTable = () => {
        // Filter
        let filteredObjects = [];
        let checkConditions = false;
        let tempObject = [];
        let orderedFilterList = [];
        let filterOrder = ["not like", "like", "not equal", "equal"];
        $scope.tableData = $scope.originalData;
        const filterArr = $scope.myForm.myFields;

        filterArr.forEach((da) => {
          if (da["condition"].toLowerCase() == "or") {
            checkConditions = true;
          }
        });
        if (checkConditions) {
          orderedFilterList = filterArr;
        } else {
          filterOrder.forEach((filterorder) => {
            filterArr.forEach((filterarr) => {
              if (filterarr["expression"].toLowerCase() == filterorder) {
                orderedFilterList.push(filterarr);
              }
            });
          });
        }
        if (orderedFilterList.length > 0) {
          orderedFilterList.forEach((filterValue) => {
            if (
              filterValue.condition.toLowerCase() === "and" ||
              filterValue.condition.toLowerCase() === "where"
            ) {
              if (orderedFilterList.indexOf(filterValue) == 0) {
                $scope.originalData
                  .filter((col) => {
                    return $scope.queryCondition(filterValue, col);
                  })
                  .forEach((da) => {
                    if (!tempObject.includes(da)) {
                      tempObject.push(da);
                    }
                  });
              } else {
                tempObject = tempObject.filter((col) => {
                  return $scope.queryCondition(filterValue, col);
                });
              }
            } else if (filterValue.condition.toLowerCase() === "or") {
              filteredObjects = $scope.originalData.filter((col) => {
                return $scope.queryCondition(filterValue, col);
              });
              filteredObjects.forEach((da) => {
                if (!tempObject.includes(da)) {
                  tempObject.push(da);
                }
              });
            }
          });

          $scope.data = tempObject;
          $scope.numOfPagess();
        } else {
          filteredObjects = $scope.data;
        }
      };

      $scope.queryCondition = (filterValue, data) => {
        switch (filterValue.expression.toLowerCase()) {
          case "equal":
            if (
              data[filterValue.columnName.field].toString() ===
              filterValue.value
            ) {
              return true;
            }
            return false;
          case "not equal":
            if (
              data[filterValue.columnName.field].toString() !==
              filterValue.value
            ) {
              return true;
            }
            return false;
          case "like":
            return $scope.filterValuefun(
              data,
              filterValue.value,
              filterValue.columnName.field
            );
          case "not like":
            return !$scope.filterValuefun(
              data,
              filterValue.value,
              filterValue.columnName.field
            );
          default:
            return false;
        }
      };

      $scope.filterValuefun = (col, filter, key = null) => {
        if (key) {
          if (
            col[key].toString().toLowerCase().includes(filter.toLowerCase())
          ) {
            return true;
          } else {
            return false;
          }
        } else {
          let keys = Object.keys(col);
          for (let key of keys) {
            if (
              col[key].toString().toLowerCase().includes(filter.toLowerCase())
            ) {
              return true;
            }
          }
        }

        return false;
      };
      $scope.getRowsObjects = () => {
        setTimeout(() => {
          $scope.initialFreezeColumn();

          var rows = document.querySelectorAll(".rows");
          var columns = document.querySelectorAll(".columns");
          columns.forEach(function (row) {
            row.addEventListener("dragstart", function (event) {
              event.dataTransfer.setData("text/plain", event.target.id);

              event.target.style.opacity = "0.4";
            });

            row.addEventListener("dragend", function (event) {
              // Perform any necessary cleanup operations
              event.target.style.opacity = "1";
            });
          });
          columns.forEach(function (row) {
            row.addEventListener("dragover", function (event) {
              // Specify whether the drop target is a valid drop target
              event.preventDefault();
            });

            row.addEventListener("drop", function (event) {
              var data = event.dataTransfer.getData("text/plain");
              var draggedRow = document.getElementById(data);
              let i = Number(draggedRow.id.slice(7));

              let rowa = draggedRow.parentNode;
              let sibiling = returnParent(event.target, "TH");
              let j = Number(sibiling.id.slice(7));
              let a = $scope.column.splice(i, 1);
              $scope.column.splice(j, 0, ...a);
              $scope.$apply();
            });
          });

          // Define the drag event handlers for each row
          rows.forEach(function (row) {
            row.addEventListener("dragstart", function (event) {
              event.dataTransfer.setData("text/plain", event.target.id);
              event.target.style.opacity = "0.4";
            });

            row.addEventListener("dragend", function (event) {
              event.target.style.opacity = "1";
            });
          });
          rows.forEach(function (row) {
            row.addEventListener("dragover", function (event) {
              event.preventDefault();
            });

            row.addEventListener("drop", function (event) {
              var data = event.dataTransfer.getData("text/plain");
              var draggedRow = document.getElementById(data);
              let i = Number(draggedRow.id.slice(4));
              let rowa = draggedRow.parentNode;
              let sibiling = returnParent(event.target, "TR");

              let j = Number(sibiling.id.slice(4));
              let c = $scope.tableData.splice(i, 1);
              $scope.tableData.splice(j, 0, ...c);
              $scope.$apply();
            });
          });
        }, 1000);
      };

      function returnParent(event, data) {
        if (event.tagName === data) {
          return event;
        } else {
          let a = returnParent(event.parentNode, data);
          return a;
        }
      }

      $scope.togglePopup = (headerIndex) => {
        $scope.editPopup = false;
        $scope.popup = document.getElementById("popup-" + headerIndex);
        $scope.allPopups = document.getElementsByClassName("popup-container");
        $scope.isVisible =
          window.getComputedStyle($scope.popup).getPropertyValue("display") ===
          "block";
        for (var i = 0; i < $scope.allPopups.length; i++) {
          if ($scope.allPopups[i] !== $scope.popup) {
            $scope.allPopups[i].style.display = "none";
          }
        }
        if ($scope.popup.style.display === "none" || !$scope.isVisible) {
          $scope.popup.style.display = "block";
        } else {
          $scope.popup.style.display = "none";
        }
      };
      $scope.deleteIcon = false;
      $scope.openColorPicker = (option, headerIndex, column) => {
        $scope.isColorOption = !$scope.isColorOption;
        $scope.colorPopupIndex = headerIndex;

        $scope.optionForAddColumn = option;
        $scope.curOption = option;
        $scope.columnForAddColumn = column;

        if (option.field == "Insert left" || option.field == "Insert right") {
          $scope.addFieldPopup = true;
        } else if (option.field == "Delete field") {
          $scope.columnNamee = column;
          $scope.deleteIcon = true;
        } else if (option.field == "Duplicate field") {
          $scope.generateDuplicateField(column);
        } else if (option.field == "Filter by this field") {
          $scope.filterByField(column);
        } else if (option.field == "Edit field") {
          $scope.editPopup = true;
        }
      };

      $scope.headerColor = (index, color, option, column) => {
        if (option === "Set Column Header Color") {
          document.getElementById("columns" + index).style.backgroundColor =
            color;
          $scope.column.forEach((col) => {
            if (column.fieldName === col.fieldName) {
              col.headColor = color;
            }
          });
        } else if (option === "Set Full Column Color") {
          var targetHeaderText = column.fieldName;
          var targetColumnIndex = -1;
          var table = document.querySelector(".table");
          var headerRow = table.rows[0];
          for (var i = 0; i < headerRow.cells.length; i++) {
            if (headerRow.cells[i].innerText.includes(targetHeaderText)) {
              targetColumnIndex = i;
              break;
            }
          }

          // Set the background color of the cells in the target column
          if (targetColumnIndex !== -1) {
            var targetCells = table.querySelectorAll(
              "tr td:nth-child(" + (targetColumnIndex + 1) + ")"
            );
            for (var j = 0; j < targetCells.length; j++) {
              targetCells[j].style.backgroundColor = color;
            }
          }
          $scope.column.forEach((col) => {
            if (column.fieldName === col.fieldName) {
              col.bodyColor = color;
            }
          });
        }
      };
      $scope.closePopup = (headerIndex) => {
        document.getElementById("popup-" + headerIndex).style.display = "none";
      };
      $scope.freezeColumnIndex = null;

      $scope.initialFreezeColumn = () => {
        var ths = document.querySelectorAll('th[id*="columns"]');
        for (var i = 0; i < ths.length; i++) {
          $scope.head = ths[i];
          $scope.cols = document.querySelectorAll("td#columns" + i);
          var style = getComputedStyle(ths[i]);
          var colStyle = "";
          var position = style.getPropertyValue("position");
          var colour = style.getPropertyValue("background-color");
          width = 100;
          if (position == "sticky") {
            $scope.freezeCondition("sticky", "static", "static", i, width);
          }
          $scope.column.forEach((col) => {
            if (ths[i].textContent.includes(col.fieldName)) {
              ths[i].style.background = col.headColor;
            }
          });
          for (var j = 0; j < $scope.cols.length; j++) {
            $scope.column.forEach((col) => {
              if (
                ths[$scope.cols[j].cellIndex - 1].textContent.includes(
                  col.fieldName
                )
              ) {
                if (col.bodyColor) {
                  $scope.cols[j].style.backgroundColor = col.bodyColor;
                } else {
                  $scope.cols[j].style.backgroundColor = "white";
                }
              }
            });
          }
        }
      };
      $scope.freezeColumn = (a, c) => {
        $scope.head = document.querySelector("th#" + c);
        $scope.cols = document.querySelectorAll("td#" + c);
        var headStyle = getComputedStyle($scope.head);
        var headPosition = headStyle.getPropertyValue("position");
        var headWidth = headStyle.getPropertyValue("width");
        headWidth = parseInt(headWidth, 10);
        if (a > 0) {
          var prehead = getComputedStyle(
            document.querySelector("th#columns" + (a - 1))
          );

          var preHeaderPosition = prehead.getPropertyValue("position");

          var nexthead = getComputedStyle(
            document.querySelector("th#columns" + (a + 1))
          );
          var nextHeaderPosition = nexthead.getPropertyValue("position");
          $scope.freezeCondition(
            preHeaderPosition,
            headPosition,
            nextHeaderPosition,
            a,
            headWidth
          );
        } else if (a == 0) {
          var nexthead = getComputedStyle(
            document.querySelector("th#columns" + (a + 1))
          );
          var nextHeaderPosition = nexthead.getPropertyValue("position");
          $scope.freezeCondition(
            "sticky",
            headPosition,
            nextHeaderPosition,
            a,
            headWidth
          );
        }
      };
      $scope.freezeCondition = (pre, present, next, index, headWidth) => {
        if (pre == "sticky" && present === "static" && next == "static") {
          $scope.head.style.position = "sticky";
          $scope.head.style.left = 200 * index;
          $scope.head.style.backgroundColor = "#ddd";
          $scope.head.style.zIndex = 1;
          $scope.cols.forEach((td) => {
            var style = getComputedStyle(td);
            var position = style.getPropertyValue("position");
            var width = style.getPropertyValue("width");
            width = parseInt(width, 10);
            if (position === "static") {
              td.style.position = "sticky";
              td.style.left = 200 * index;
              td.style.backgroundColor = "white";
            }
          });
        } else if (
          pre == "sticky" &&
          present === "sticky" &&
          next == "static"
        ) {
          $scope.head.style.position = "static";
          $scope.head.style.left = 100 * index;
          $scope.head.style.backgroundColor = "#ddd";
          $scope.head.style.zIndex = 1;
          $scope.cols.forEach((td) => {
            var style = getComputedStyle(td);
            var position = style.getPropertyValue("position");
            var width = style.getPropertyValue("width");
            width = parseInt(width, 10);
            if (position === "sticky") {
              td.style.position = "static";
              td.style.left = width * index + 95;
              td.style.backgroundColor = "white";
            }
          });
        }
      };

      // popup function
      $scope.popupFunction = function (option, idx, column, event) {
        $scope.openColorPicker(option, idx, column);
        if (
          option.field == "Sort First -> last" ||
          option.field == "Sort First -> first"
        ) {
          $scope.sortBy(column.field, option.field);
        }

        if (option.field === "Hide field") {
          $scope.hidingColumn(column.field, event, true);
        }
      };
      // sort

      $scope.sortByField = function (field) {
        if (!$scope.sortedFieldDict) {
          $scope.sortedFieldDict = {};
        }
        $scope.reverse = !$scope.reverse;

        $scope.sortedFieldDict[field] = $scope.reverse;

        $scope.updateSortList();

        $scope.sortField = "";
        return $scope.reverse;
      };

      $scope.sortBy = function (field, val) {
        if (val === "Sort First -> last") {
          bolval = true;
          $scope.sortedFieldDict = {};
        }
        if (val === "Sort First -> first") {
          bolval = false;
          $scope.sortedFieldDict = {};
        }
        if (val === "add") {
          bolval = !$scope.reverse;
        }
        if (!$scope.sortedFieldDict) {
          $scope.sortedFieldDict = {};
        }
        $scope.reverse = bolval;
        $scope.sortedFieldDict[field] = $scope.reverse;

        $scope.updateSortList();

        $scope.sortField = "";
        return $scope.reverse;
      };
      $scope.updateSortList = function () {
        $scope.sortedFieldList = [];
        for (let name in $scope.sortedFieldDict) {
          if ($scope.sortedFieldDict[name]) {
            $scope.sortedFieldList.push(name);
          } else {
            $scope.sortedFieldList.push("-" + name);
          }
        }
      };
      $scope.updateMyObj = function (value) {
        if (value) {
          $scope.sortField = value;
        }
        if ($scope.sortField) {
          $scope.sortBy($scope.sortField, "add");
        }
      };
      $scope.updateAscDsc = function (key, val) {
        if (val) {
          val = false;
        } else {
          val = true;
        }
        $scope.sortBy(key, "add");
      };
      $scope.columnDatatype = function () {
        $scope.columnDatatypeDict = {};
        for (let col in $scope.column) {
          c = $scope.column[col];
          $scope.columnDatatypeDict[c.field] = c.dataType;
        }
      };
      $scope.removeSort = function (key) {
        delete $scope.sortedFieldDict[key];
        $scope.updateSortList();
      };
      $scope.findsortorder = function (key) {
        if (!$scope.sortedFieldDict) {
          return true;
        }
        return $scope.sortedFieldDict[key];
      };
      $scope.showSortPopup = function (event) {
        $scope.sortPopupVisible = true;
        $scope.popupPosition = {
          top: event.clientY + 15 + "px",
          left: event.clientX + "px",
        };
      };
      $scope.showPagination = function (event) {
        $scope.numOfPages();
        if ($scope.noOfPages > 0 && $scope.tableData.length !== 0) {
          $scope.pagination_details = true;
        } else {
          $scope.pagination_details = false;
        }
      };
      $scope.hideSortPopup = function () {
        $scope.sortPopupVisible = false;
      };
      $scope.generateArray = function (n) {
        if (n) {
          return Array(n - 1)
            .fill()
            .map((_, index) => index + 1);
        }
        return 0;
      };
      $scope.groupValue = "No Views";
      $scope.listData = [
        "Default",
        "First Data",
        "Second Data",
        "Third Data",
        "Fourth Data",
        "Fifth Data",
      ];

      $scope.viewIcon = false;
      $scope.expandIcon = "expand_more";
      $scope.viewlistFunc = () => {
        $scope.viewIcon = !$scope.viewIcon;
        if ($scope.viewIcon) {
          $scope.expandIcon = "expand_less";
        } else {
          $scope.expandIcon = "expand_more";
        }
      };

      $scope.getListValue = function ($event) {
        $scope.groupValue = $event.currentTarget.textContent;
        if ($event.currentTarget.textContent == "Default") {
          $scope.column = $scope.columnData;
        } else {
          $scope.newColumn = [
            {
              field: "name",
              type: "input",
              dataType: "input",
              editable: true,
            },
            {
              field: "phone",
              type: "input",
              dataType: "input",
              editable: true,
            },
            {
              field: "email",
              type: "input",
              dataType: "email",
              editable: false,
            },
            {
              field: "address",
              type: "input",
              dataType: "text",
              editable: true,
            },
            {
              field: "postalZip",
              type: "input",
              dataType: "input",
              editable: true,
            },
          ];

          $scope.columnList = $scope.colList
            ? $scope.colList
            : ["name", "phone"];

          $scope.updatedColumn = [];
          $scope.column.forEach((column) => {
            if ($scope.columnList.includes(column.field)) {
              $scope.updatedColumn.push(column);
            }
          });
          $scope.column = $scope.updatedColumn;
          $scope.searchButton = ($event) => {};
        }
      };

      $scope.viewHideColumn = false;
      $scope.callDropdown = () => {
        $scope.viewHideColumn = !$scope.viewHideColumn;
      };

      $scope.hidingColumn = (event, item, checked = false) => {
        if (!checked) {
          checBox = item.target.checked;
        } else {
          checBox = checked;
        }
        $scope.constColumnArrayList.forEach((da) => {
          if (da["field"] == event) {
            da["checked"] = checBox;
          }
        });
        if (checBox) {
          $scope.column.forEach((da) => {
            if (da["field"] == event) {
              let index = $scope.column.indexOf(da);
              $scope.column.splice(index, 1);
            }
          });
        } else {
          $scope.hidingColumnArrayList.forEach((d) => {
            if (d["field"] == event) {
              let index = $scope.hidingColumnArrayList.indexOf(d);
              $scope.column.splice(index, 0, d);
            }
          });
        }
      };

      $scope.Checkchecked = [];
      $scope.flagIcon = (index) => {
        if (!$scope.Checkchecked.includes(index)) {
          $scope.Checkchecked.push(index);
        } else {
          var checkbox = $scope.Checkchecked.indexOf(index);
          $scope.Checkchecked.splice(checkbox, 1);
        }
        $scope.$apply();
      };

      $scope.hiddenColumnFilter = (event) => {
        $scope.hidingColumnArrayList = $scope.constColumnArrayList;
        $scope.hidingColumnArrayList = $scope.hidingColumnArrayList.filter(
          (data) => {
            if (data["field"].includes(event)) {
              return true;
            }
            return false;
          }
        );
      };
      $scope.filterIcon = false;
      $scope.toggleFilterPopup = function () {
        $scope.filterIcon = !$scope.filterIcon;
      };

      $scope.flagIcon = (index) => {
        if (!$scope.checked.includes(index)) {
          checked.push(index);
        } else {
          var checkbox = $scope.checked.indeof(index);
          $scope.checked.splice(checkbox, 1);
        }
      };
      $scope.groupBy = ["list"];
      grouped = {};

      setTimeout(() => {
        $scope.data.forEach(function (col) {
          $scope.groupBy
            .reduce(function (o, g, i) {
              o[col[g]] =
                o[col[g]] || (i + 1 === $scope.groupBy.length ? [] : {}); // or generate new obj, or
              return o[col[g]];
              // at last, then an array
            }, grouped)
            .push(col);
        });
      }, 1000);

      $scope.addFieldPopup = false;
      $scope.toggleaddFieldPopup = (headerName) => {
        $scope.addFieldPopup = false;
        $scope.addColumn(
          headerName,
          $scope.curOption,
          $scope.columnForAddColumn
        );
      };

      $scope.headerPopup = false;
      $scope.addColumn = (header, option, columnName) => {
        $scope.headerPopup = !$scope.headerPopup;
        columnIndex = $scope.column.indexOf(columnName);
        data = {
          field: header ? header : "TEST",
          type: "input",
          dataType: "input",
          fieldName: header ? header : "TEST",
          editable: true,
          checked: false,
        };
        if (option.field == "Insert left") {
          $scope.column.splice(columnIndex, 0, data);
          $scope.hidingColumnArrayList = $scope.column;
          $scope.isColorOption = !$scope.isColorOption;
        } else if (option.field == "Insert right") {
          $scope.column.splice(columnIndex + 1, 0, data);
          $scope.hidingColumnArrayList = $scope.column;
          $scope.isColorOption = !$scope.isColorOption;
        }
      };

      $scope.deleteColumn = () => {
        $scope.deleteIcon = !$scope.deleteIcon;
        $scope.isVisible =
          window.getComputedStyle($scope.popup).getPropertyValue("display") ===
          "none";
        columnIndex = $scope.column.indexOf($scope.columnNamee);
        $scope.column.splice(columnIndex, 1);
        $scope.hidingColumnArrayList = $scope.column;
      };

      $scope.countNames = function (obj, name) {
        let count = 0;
        for (let prop in obj) {
          if (prop.includes(name)) {
            count++;
          }
        }
        return count;
      };

      $scope.generateDuplicateField = (columnName) => {
        columnIndex = $scope.column.indexOf(columnName);
        oldField = columnName.fieldName;
        fieldCount = $scope.countNames($scope.data[0], oldField);
        newField = `${columnName.fieldName}${fieldCount + 1}`;
        data = {
          field: newField,
          type: columnName.type,
          fieldName: newField,
          dataType: columnName.dataType,
          editable: true,
          checked: columnName.checked,
        };
        $scope.column.splice(columnIndex + 1, 0, data);
        $scope.hidingColumnArrayList = $scope.column;
        for (let i = 0; i < $scope.data.length; i++) {
          $scope.data[i][newField] = $scope.data[i][columnName.field];
        }
      };

      $scope.fieldNameValue = true;
      $scope.filterByField = (columnName) => {
        $scope.filterIcon = true;
        $scope.fieldName = columnName.field;
      };

      $scope.grouping = function () {
        if (!$scope.isGroup) {
          $scope.grouping = true;
        } else {
          $scope.grouping = false;
        }
      };
      setTimeout(function () {
        $scope.itemsPerPage = "5";
        $scope.$apply();
      }, 1000);
    },
  };
});
