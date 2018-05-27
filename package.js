/* global Package */
Package.describe({
    name: 'socialize:likeable',
    summary: 'A package implementing social "liking" or "starring"',
    version: '1.0.2',
    git: 'https://github.com/copleykj/socialize-likeable.git',
});

Package.onUse(function _(api) {
    api.versionsFrom('1.3');

    api.use([
        'socialize:user-blocking@1.0.1',
        'reywood:publish-composite@1.6.0',
    ]);

    api.imply('socialize:user-blocking');

    api.mainModule('server/server.js', 'server');
    api.mainModule('common/common.js', 'client');
});
