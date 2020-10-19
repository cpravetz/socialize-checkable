# Checkable

A package for implementing models with Checking.  Bassically, this is Liking but allows multiple "likes" and different typoes of "likes" in the same collection to minimize redundant code.  Typical uses would be check-in, offer-redemptions, etc.

>This is a [Meteor][meteor] package with part of it's code published as a companion NPM package made to work with React Native. This allows your Meteor and React Native projects that use this package to share code between them to give you a competitive advantage when bringing your mobile and web application to market.

<!-- TOC depthFrom:1 depthTo:6 withLinks:1 updateOnSave:1 orderedList:0 -->
- [Supporting The Project](#supporting-the-project)
- [Meteor Installation](#meteor-installation)
- [React Native Installation](#react-native-installation)
- [Basic Usage](#basic-usage)
- [Scalability - Redis Oplog](#scalability---redis-oplog)
<!-- /TOC -->

## Supporting The Project

Finding the time to maintain FOSS projects can be quite difficult. I am myself responsible for over 30 personal projects across 2 platforms, as well as Multiple others maintained by the [Meteor Community Packages](https://github.com/meteor-community-packages) organization. Therfore, if you appreciate my work, I ask that you either sponsor my work through GitHub, or donate via Paypal or Patreon. Every dollar helps give cause for spending my free time fielding issues, feature requests, pull requests and releasing updates. Info can be found in the "Sponsor this project" section of the [GitHub Repo](https://github.com/copleykj/socialize-likeable)

## Meteor Installation

This package relies on the npm package `simpl-schema` so you will need to make sure it is installed as well.

```shell
meteor npm install --save simpl-schema
meteor add socialize:likeable
```

## React Native

A React Native companion has not been developed for this package.

> **Note**
>
> When using with React Native, you'll need to connect to a server which hosts the server side Meteor code for your app using `Meteor.connect` as per the [@socialize/react-native-meteor](https://www.npmjs.com/package/@socialize/react-native-meteor#example-usage) documentation.

## Basic Usage


```javascript
//Meteor Imports
import { Mongo } from 'meteor/mongo';
import { CheckableModel } from 'meteor/socialize-checkable';
import { LinkParent, LinkableModel } from 'meteor/socialize-linkable';
```

```javascript - 
//React Native Imports
import { Mongo } from '@socialize/react-native-meteor';
import { CheckableModel } from '@socialize/likeable';
import { LinkParent, LinkableModel } from '@socialize/linkable';
```

```javascript
//This gets imported the same no matter the environment
import SimpleSchema from 'simpl-schema';

//define the collection to hold products
const PlacesCollection = new Mongo.Collection("places");

//define the schema for a product
const PlacesSchema = new SimpleSchema({
    //actual schema excluded for brevity
});

//Create a product class extending LikeableModel and LinkParent
class Place extends CheckableModel(LinkParent) {
    //methods here
}
// Attach schema
PlacesCollection.attachSchema(PlacesSchema);
// Attache CheckableSchema
PlacesCollection.appendSchema(CheckableModel.CheckableSchema);


//Attach the collection to the model so we can use BaseModel's CRUD methods
Place.attachCollection(PlacesCollection);

//Register the Model as a potential Parent of a LinkableModel
LinkableModel.registerParentModel(Place);

//Create a new place and save it to the database using BaseModel's save method.
new Place({name:"Carnegie Hall"}).save();

//Get an instance of Place using a findOne call.
let foundPlace = PlacesCollection.findOne();

//This is an instance of place and since we've extended LikeableModel we can now just call it's like method
foundPlace.check('check-in');
//or
foundPlace.check('performed-at');

//and we can unlike it
foundPlace.uncheck('check-in');

//We can even query to see if a certain user has checked this place
foundPlace.isCheckdBy(Meteor.user(),"check-in"); //Publication of proper data necessary if querying client side of course
```

For a more in depth explanation of how to use this package see [API.md](api)

## Scalability - Redis Oplog

This package implements [cultofcoders:redis-oplog][redis-oplog]'s namespaces to provide reactive scalability as an alternative to Meteor's `livedata`. Use of redis-oplog is not required and will not engage until you install the [cultofcoders:redis-oplog][redis-oplog] package and configure it.

[redis-oplog]:https://github.com/cultofcoders/redis-oplog
[meteor]: https://meteor.com
[api]: https://github.com/copleykj/socialize-likeable/blob/master/API.md
[socialize]: https://atmospherejs.com/socialize
