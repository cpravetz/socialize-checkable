/* global Package */
Package.describe({
    name: 'socialize:checkable',
    summary: 'A package implementing checkins / flagging',
    version: '1.0.4',
    git: 'https://github.com/cpravetz/socialize-checkable.git',
});

Package.onUse(function _(api) {
    api.versionsFrom('1.10.2');

    api.use([
        'socialize:user-blocking@1.0.5',
        'reywood:publish-composite@1.7.3',
    ]);

    api.imply('socialize:user-blocking');

    api.mainModule('server/server.js', 'server');
    api.mainModule('common/common.js', 'client');
});
