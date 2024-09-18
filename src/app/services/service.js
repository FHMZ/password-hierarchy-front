var app = angular.module("myApp");

app.service("EmployeeService", [
  "$http",
  function ($http) {
    const apiHost = "http://localhost:8080";

    const baseUrl = `${apiHost}/api/employee`;

    this.getAll = function () {
      return $http.get(`${baseUrl}/employees`);
    };

    this.save = function (data) {
      if (data.id) {
        return $http.put(`${baseUrl}/${data.id}`, data);
      }
      return $http.post(baseUrl, data);
    };

    this.deleteById = function (dataId) {
      return $http.delete(`${baseUrl}/${dataId}`);
    };

    this.getDependents = function (dataId) {
      return $http.get(`${baseUrl}/dependents/${dataId}`);
    };

    this.getScore = function (item) {
      const data = { item: item };
      return $http.post(`${baseUrl}/score`, data);
    };
  },
]);
