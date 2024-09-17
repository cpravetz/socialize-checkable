import { Check, CheckableModel, ChecksCollection } from '../common/common.js';
import './publications.js';

ChecksCollection.allow({
    insert(userId, check) {
        // allow liking to occur if a user is logged in, the current user added the check
        return userId && check.checkOwnership();
    },
    remove(userId, check) {
        // allow unliking if there is a current user and the current user was the one who checkd the object
        return userId && check.checkOwnership();
    },
});

ChecksCollection.after.insert(function afterinsert(userId, check) {
    // after a successful check, increment the linked object's checkCount property
    const collection = this.transform().getCollectionForParentLink();
    var thisType = check.checkType;
    userId && collection && collection.updateAsync({ _id: check.linkedObjectId }, { $inc: { ['checkCount.'+thisType] : 1 } });
});

ChecksCollection.after.remove(function afterRemove(userId, check) {
    // if the user unchecks an object, decrement the linked objects checkCount property
    const collection = this.transform().getCollectionForParentLink();
    var thisType = check.checkType;
    userId && collection && collection.updateAsync({ _id: check.linkedObjectId }, { $inc: { ['checkCount.'+thisType] : -1 } });
});

export { Check, CheckableModel, ChecksCollection };
