/* eslint-disable import/no-unresolved */
import SimpleSchema from 'simpl-schema';
var dateFormat = require('dateformat');
/* eslint-enable import/no-unresolved */


export default ({ Meteor, LinkParent, ChecksCollection, Check }) => {
    /**
    * CheckableModel - a mixin providing Checkable behavior for a model
    */
    const CheckableModel = Base => class extends Base { //eslint-disable-line
        constructor(document) {
            super(document);
            if (!(this instanceof LinkParent)) {
                throw new Meteor.Error('MustExtendParentLink', 'CheckableModel must extend ParentLink from socialize:linkable-model');
            }
        }

        /**
        * Add a record to the checks collection which is linked to the model
        */
        check(checkType) {
            var newDoc = this.getLinkObject();
            newDoc.checkType = checkType;
            new Check(newDoc).save();
        }

        /**
        * Remove one record from the checks collection that is linked to the model
        */
        uncheck(thisCheckType) {
            // find and then call call instance.remove() since client
            // is restricted to removing items by their _id
            const check = ChecksCollection.findOne({ checkType: thisCheckType, userId: Meteor.userId(), linkedObjectId: this._id });
            check && check.remove();
        }

        /**
        * Remove all records from the checks collection that are linked to the model
        */
        uncheckall() {
            const checks = ChecksCollection.find({ userId: Meteor.userId(), linkedObjectId: this._id });
            checks.forEach(remove());

        }
        /**
        * Get all the checks for the model
        * @returns {Mongo.Cursor} A mongo cursor which returns Check instances
        */
        checks(options = {}) {
            return ChecksCollection.find({ linkedObjectId: this._id }, options);
        }

        /**
        * Get the check by a particular user for the model
        * @param   {User|Object|String}  user A User instance, Object with _id field or a String
        *                                     of the userId to check against
        * @returns {Mongo.Cursor} A mongo cursor which returns Check instances
        */
        checksBy(user) {
            const userId = user._id || user;
            return ChecksCollection.find({ userId, linkedObjectId: this._id }, { limit: 1 });
        }

        /**
        * Get the checks of a particular type for the model
        * @param   {String}  thisType A string
        *                    of the checkType to check against
        * @returns {Mongo.Cursor} A mongo cursor which returns Check instances
        */
        checksAs(thisType) {
            return ChecksCollection.find({checkType : thisType, linkedObjectId: this._id});
        }
        /**
        * Check if the model is checkd by a certain user
        * @param   {User|Object|String}  user A User instance, Object with _id field or a String
        *                                     of the userId to check against
        * @returns {Boolean} Wheter the user checks the model or not
        */
        isCheckdBy(user, thisType) {
            const userId = user._id || user;
            return !!ChecksCollection.findOne({ linkedObjectId: this._id, userId, checkType: thisType });
        }
        prettyWhen() {
          if (!this.createdAt) {
            return 'Never'
        } else {
            return dateFormat(this.createdAt, "mediumDate");
        }
    }

    };

    // a schema which can be attached to other checkable types
    // if you extend a model with CheckableModel you will need to
    // attach this schema to it's collection as well.
    CheckableModel.CheckableSchema = new SimpleSchema({
        checkCounts: {
            type: Array,
          //  blackbox: true,
            optional: true
        },
        'checkCounts.$': {
            type: Object,
            optional: true
            },
        'checkCounts.$.checkType' : String,
        'checkCounts.$.count': {
            type: Number,
            defaultValue: 0,
            custom: SimpleSchema.denyUntrusted,
        },
    });

    return { CheckableModel };
};
