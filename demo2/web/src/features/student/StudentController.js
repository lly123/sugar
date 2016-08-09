export class StudentController {
    constructor($scope) {
        this._scope = $scope;
        this._scope.name = "student" + Math.round(Math.random() * 10000)
    }
}

StudentController.$inject = ['$scope'];
