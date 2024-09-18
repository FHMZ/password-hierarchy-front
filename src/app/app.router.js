angular
  .module("myApp")
  .config(function ($routeProvider, $locationProvider) {
    $routeProvider
      .when("/employees", {
        templateUrl: "app/components/employee/employee.html",
        controller: "EmployeeController",
        controllerAs: "sc",
      })
      .otherwise({
        redirectTo: "/employees",
      });

    $locationProvider.html5Mode(false);
  });
