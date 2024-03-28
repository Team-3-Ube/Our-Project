import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Events } from './EventCollection';
import { generateID, isAOrganization, isAUser, isEvent_id, validMainCategory, validSubCategory } from '../base/BaseUtilities';

Meteor.methods({
  'Events.define': function (data) {
    check(data, Object);
    Events._schema.clean(data);

    // check for valid activityCategory
    if (!(validMainCategory(data.activityCategory.mainCategory) && validSubCategory(data.activityCategory.subCategory))) {
      throw Meteor.Error('Create Event Failed', 'Invalid Category.');
    }
    // check if hostID is organization/individual
    if (!(isAOrganization(data.hostID) || isAUser(data.hostID))) {
      throw Meteor.Error('Events.define Failed', 'This host does not exists');
    }

    try {
      const id = data.EventID === undefined ? generateID() : data.EventID;
      return Events._collection.insert({
        ...data,
        ...{ EventID: id },
      });
    } catch (error) {
      throw Meteor.Error('Events.define failed', 'Unable to create new event.');
    }
  },
});

Meteor.methods({
  'Events.update': function (docID, data) {
    check(docID, String);
    check(data, Object);
    if (!isEvent_id(docID)) {
      throw Meteor.Error('Events.update failed', `Unable to find event ${docID}`);
    }

    try {
      const updateData = {};
      Object.keys(data).forEach(key => {
        switch (key) {
        case 'activityCategory':
          if (!(validMainCategory(data[key].mainCategory) && validSubCategory(data[key].subCategory))) {
            throw Meteor.Error('Events.update failed', 'Invalid Category.');
          }
          updateData[key] = data[key];
          break;
        case 'spotsFilled':
          data[key].forEach(userID => {
            if (!isAUser(userID)) {
              throw Meteor.Error('Events.update failed', 'A non existing user filled a spot.');
            }
          });
          updateData[key] = data[key];
          break;
        case 'canceledVolunteer':
          data[key].forEach(userID => {
            if (!isAUser(userID)) {
              throw Meteor.Error('Events.update failed', 'A non existing user filled a spot.');
            }
          });
          updateData[key] = data[key];
          break;
        default:
          updateData[key] = data[key];
        }
      });
      Events._collection.update(docID, data);
    } catch (error) {
      throw new Meteor.Error('Events.update failed', 'Failed to update event: ', error);
    }
  },
});

Meteor.methods({
  'Events.remove': function (docID) {
    check(docID, String);
    try {
      Events._collection.remove(docID);
      if (isEvent_id(docID)) {
        throw Meteor.Error('Events.remove failed', 'Event still exists in the database.');
      }
    } catch (error) {
      throw new Meteor.Error('Events.remove failed', 'Failed to delete event: ', error);
    }
  },
});
