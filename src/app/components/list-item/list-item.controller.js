var app = angular.module("myApp");

app.controller("ListItemController", function ($scope) {
  $scope.deleteEmployee = function (employeeId) {
    // Logic to delete employee
    console.log("Deleting employee with ID:", employeeId);

    // Remove employee from employees list
    $scope.employees = $scope.employees.filter(function (employee) {
      return employee.id !== employeeId;
    });
  };
});
