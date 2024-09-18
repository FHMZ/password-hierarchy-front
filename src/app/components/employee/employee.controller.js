var app = angular.module("myApp");

app.controller("EmployeeController", [
  "$scope",
  "EmployeeService",
  function ($scope, EmployeeService) {
    $scope.title = "Pesquisar";

    $scope.showModal = false;

    $scope.showMessage = false;

    $scope.isDelete = false;

    $scope.form = {};

    $scope.score = { value: 0, text: "" };

    $scope.search = { field: "" };

    $scope.api = { status: "", message: "" };

    $scope.employees = [];

    $scope.filteredEmployees = [];

    $scope.dependents = [];

    $scope.loadEmployees = function () {
      EmployeeService.getAll()
        .then(function (response) {
          $scope.employees = response.data;
          $scope.filteredEmployees = $scope.employees;
        })
        .catch(function (error) {
          console.log("error: ", error);
          $scope.employees = [];
          $scope.filteredEmployees = $scope.employees;
        });
    };

    $scope.filterByName = function () {
      const searchText = $scope.search.field.toLowerCase();

      if (!searchText) {
        $scope.filteredEmployees = $scope.employees;
      } else {
        $scope.filteredEmployees = recursiveFilter(
          $scope.employees,
          searchText
        );
      }
    };

    $scope.onOpenNew = function () {
      $scope.title = "Novo";
      $scope.showModal = true;
      $scope.isDelete = false;
      $scope.resetForm();
      $scope.findDependents($scope.form.id);
    };

    $scope.onOpenEdit = function (data) {
      $scope.title = "Editar";
      $scope.showModal = true;
      $scope.isDelete = false;
      $scope.setForm(data);
      $scope.findDependents(data.id);
    };

    $scope.onOpenDelete = function (data) {
      $scope.title = "Deletar";
      $scope.showModal = true;
      $scope.isDelete = true;
      $scope.setForm(data);
      $scope.findDependents(data.id);
    };

    $scope.onCancel = function () {
      $scope.showModal = false;
      $scope.isDelete = false;
      $scope.title = "Pesquisar";
      $scope.resetForm();
    };

    $scope.onSubmit = function (isValid) {
      if (!isValid) {
        alert("Preencha o formulário corretamente.");
        return;
      }

      if (!$scope.isDelete) {
        $scope.onSave($scope.form);
      } else {
        $scope.onDelete($scope.form.id);
      }

      $scope.resetForm();
      $scope.title = "Pesquisar";
      $scope.showModal = false;
      $scope.showMessage = true;
    };

    $scope.onSave = function (form) {
      EmployeeService.save(form)
        .then(function () {
          $scope.loadEmployees();
          $scope.api = {
            status: "success",
            message: "Salvo com Sucesso.",
          };
        })
        .catch(function (error) {
          $scope.api = { status: "error", message: "Falha ao Salvar." };
          console.error("Error saving employee:", error);
        });
    };

    $scope.onDelete = function (id) {
      EmployeeService.deleteById(id)
        .then(function () {
          $scope.loadEmployees();
          $scope.api = {
            status: "success",
            message: "Deletado com Sucesso.",
          };
        })
        .catch(function (error) {
          $scope.api = { status: "error", message: "Falha ao Deletar." };
          console.error("Error deleting employee:", error);
        });
    };

    $scope.checkPasswordStrength = function () {
      if (!$scope.form.password || $scope.form.password === "") return;

      EmployeeService.getScore($scope.form.password)
        .then(function (response) {
          if (response.data.value === 0) {
            $scope.score = {
              value: 1,
              text: "Senha deve conter 8 Caracteres, Maiúscula, Minúscula, Números e Symbolos",
            };
            return;
          }
          $scope.score = response.data;
        })
        .catch(function (error) {
          console.log("error: ", error);
          $scope.score = { value: 0, text: "" };
        });
    };

    $scope.findDependents = function (dataId) {
      const firstOp = {
        id: 0,
        name: "Nenhum",
      };
      EmployeeService.getDependents(dataId)
        .then(function (response) {
          $scope.dependents = response.data;
          $scope.dependents.unshift(firstOp);
        })
        .catch(function (error) {
          console.log("error: ", error);
          $scope.dependents = [firstOp];
        });
    };

    $scope.resetForm = function () {
      $scope.form = {
        id: 0,
        dependentId: 0,
        email: "",
        name: "",
        password: "",
        passwordStrengthLabel: "",
        passwordStrengthValue: 0,
        dependents: [],
      };
    };

    $scope.setForm = function (data) {
      $scope.form = data;
    };

    $scope.onToggleMessage = function () {
      $scope.showMessage = !$scope.showMessage;
    };

    function recursiveFilter(employees, text) {
      return employees.reduce((result, employee) => {
        const isMatch = employee.name.toLowerCase().includes(text);

        const filteredDependents = employee.dependents
          ? recursiveFilter(employee.dependents, text)
          : [];

        if (isMatch || filteredDependents.length > 0) {
          result.push({
            ...employee,
            dependents: filteredDependents,
          });
        }

        return result;
      }, []);
    }

    $scope.loadEmployees();
  },
]);
