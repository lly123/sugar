routes.$inject = ['$stateProvider'];

export default function routes($stateProvider) {
    $stateProvider
        .state('teacher', {
            url: '/teacher',
            template: require('./main.html'),
            controller: 'TeacherController',
            controllerAs: 'teacher'
        });
}
