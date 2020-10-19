/* eslint-disable import/no-unresolved */
import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';
import { publishComposite } from 'meteor/reywood:publish-composite';
import { User } from 'meteor/socialize:user-model';

import { ChecksCollection } from '../common/common.js';


const optionsArgumentCheck = {
    limit: Match.Optional(Number),
    skip: Match.Optional(Number),
    sort: Match.Optional(Object),
};


publishComposite('socialize.checksFor', function publishChecksFor(linkedObjectId, options = { limit: 100, sort: { createdAt: -1 } }) {
    check(linkedObjectId, String);
    check(options, optionsArgumentCheck);
    if (this.userId) {
        const currentUser = User.createEmpty(this.userId);
        const blockedUserIds = currentUser.blockedUserIds();
        const blockedByUserIds = currentUser.blockedByUserIds();
        const blockIds = [...blockedUserIds, ...blockedByUserIds];

        if (!blockIds.includes(linkedObjectId)) {
            return {
                find() {
                    return ChecksCollection.find({ linkedObjectId, userId: { $nin: blockIds } }, options);
                },
                children: [
                    {
                        find(check) {
                            return Meteor.users.find({ _id: check.userId });
                        },
                    },
                ],
            };
        }
    }
    return this.ready();
});

publishComposite('socialize.checksBy', function publishChecksBy(aUserId, options = { limit: 100, sort: { createdAt: -1 } }) {
    check(aUserId, String);
    check(options, optionsArgumentCheck);
    if (this.userId) {
        const currentUser = User.createEmpty(this.userId);
        const blockedUserIds = currentUser.blockedUserIds();
        const blockedByUserIds = currentUser.blockedByUserIds();
        const blockIds = [...blockedUserIds, ...blockedByUserIds];

        if (!blockIds.includes(aUserId)) {
            return {
                find() {
                    return ChecksCollection.find({ userId: aUserId }, options);
                },
                children: [
                    {
                        find(check) {
                            return Meteor.users.find({ _id: check.userId });
                        },
                    },
                ]
            };
        }
    }
    return this.ready();
});
