export class TeacherController {
    constructor($scope) {
        this._scope = $scope;
        this._scope.name = "teacher" + Math.round(Math.random() * 10000)
    }
}

TeacherController.$inject = ['$scope'];
