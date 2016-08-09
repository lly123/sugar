routes.$inject = ['$stateProvider'];

export default function routes($stateProvider) {
    $stateProvider
        .state('student', {
            url: '/student',
            template: require('./main.html'),
            controller: 'StudentController',
            controllerAs: 'student'
        });
}
