/* global Package */
Package.describe({
    name: 'socialize:checkable',
    summary: 'A package implementing checkins / flagging',
    version: '1.0.5',
    git: 'https://github.com/cpravetz/socialize-checkable.git',
});

Package.onUse(function _(api) {

    api.use([
        'socialize:user-blocking',
        'reywood:publish-composite',
    ]);

    api.imply('socialize:user-blocking');

    api.mainModule('server/server.js', 'server');
    api.mainModule('common/common.js', 'client');
});
