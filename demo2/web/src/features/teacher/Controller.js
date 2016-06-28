export class Controller {
    constructor($scope) {
        this._scope = $scope;
        this._scope.name = 'World';
    }

    changeName() {
        this._scope.name = 'angular-tips';
    }
}

Controller.$inject = ['$scope'];
