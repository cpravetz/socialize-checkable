/* eslint-disable import/no-unresolved */
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { BaseModel } from 'meteor/socialize:base-model';
import { LinkableModel, LinkParent } from 'meteor/socialize:linkable-model';
import { ServerTime } from 'meteor/socialize:server-time';
/* eslint-enable import/no-unresolved */

import LikeConstruct from './like-model.js';
import CheckableConstruct from './checkable-model.js';

export const { Check, ChecksCollection } = LikeConstruct({ Meteor, Mongo, BaseModel, LinkableModel, ServerTime });

export const { CheckableModel } = CheckableConstruct({ Meteor, LinkParent, ChecksCollection, Check });
