/* eslint-disable import/no-unresolved */
import SimpleSchema from 'meteor/aldeed:simple-schema';
/* eslint-enable import/no-unresolved */

export default ({ Meteor, Mongo, BaseModel, LinkableModel, ServerTime }) => {
    const ChecksCollection = new Mongo.Collection('socialize:checks');

    if (ChecksCollection.configureRedisOplog) {
        ChecksCollection.configureRedisOplog({
            async mutation(options, { selector, doc }) {
                let linkedObjectId = (selector && selector.linkedObjectId) || (doc && doc.linkedObjectId);

                if (!linkedObjectId && selector._id) {
                    const comment = await ChecksCollection.findOneAsync({ _id: selector._id }, { fields: { linkedObjectId: 1 } });
                    linkedObjectId = comment && comment.linkedObjectId;
                }

                if (linkedObjectId) {
                    Object.assign(options, {
                        namespace: linkedObjectId,
                    });
                }
            },
            cursor(options, selector) {
                if (selector.linkedObjectId) {
                    Object.assign(options, {
                        namespace: selector.linkedObjectId,
                    });
                }
            },
        });
    }

    const CheckSchema = new SimpleSchema({
        userId: {
            type: String,
            autoValue() {
                if (this.isInsert) {
                    return this.userId;
                }
                return undefined;
            },
            index: 1,
            denyUpdate: true,
        },
        createdAt: {
            type: Date,
            autoValue() {
                if (this.isInsert) {
                    return ServerTime.date();
                }
                return undefined;
            },
            denyUpdate: true,
        },
        checkType: {
            type: String,
            defaultValue() {
                return "";
            }
        }
    });

    /**
    * A model of a check which is connected to another database object
    * @class Check
    */
    class Check extends LinkableModel(BaseModel) {
        /**
        * Get the User instance of the account which created the check
        * @returns {User} The user who created the check
        */
        async user() {
            return await Meteor.users.findOneAsync({ _id: this.userId });
        }
        /**
        * Check if the user has already checked the linked object
        * Duplicates are allowed
        * @returns {[[Type]]} [[Description]]
        */
        async isDuplicate() {
            return !!(await ChecksCollection.findOneAsync({ userId: this.userId, linkedObjectId: this.linkedObjectId }));
        }
    }

    // attach the schema for a check
    ChecksCollection.attachSchema(CheckSchema);

    // attach the ChecksCollection to the Check model via BaseModel's attchCollection method
    Check.attachCollection(ChecksCollection);

    // append the linkable schema so we are able to add linking information
    Check.appendSchema(LinkableModel.LinkableSchema);

    return { Check, ChecksCollection };
};
