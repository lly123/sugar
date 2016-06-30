export class Controller {
    constructor($scope) {
        this._scope = $scope;
        this._scope.func = () => {
            console.log('>>>>>!!!!!!!');
        }
    }
}

Controller.$inject = ['$scope'];
