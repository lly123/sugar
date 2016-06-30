routes.$inject = ['$stateProvider'];

export default function routes($stateProvider) {
    $stateProvider
        .state('teacher', {
            url: '/teacher',
            template: require('./main.html'),
            controller: 'Controller',
            controllerAs: 'teacher'
        });
}
