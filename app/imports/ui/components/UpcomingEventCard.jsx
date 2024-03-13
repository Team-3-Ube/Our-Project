import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { useTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { UserProfiles } from '../../api/user/UserProfileCollection';
import { Events, eventPublications } from '../../api/event/EventCollection';
import LoadingSpinner from './LoadingSpinner';
import { COMPONENT_IDS } from '../utilities/ComponentIDs';

const UpcomingEventCard = () => {
  const { ready, userProfile } = useTracker(() => {
    const currentUser = Meteor.user();
    const userProfileSubscription = currentUser ? UserProfiles.subscribeUser() : null;
    const userProfileData = currentUser ? UserProfiles.findOne({ userID: currentUser._id }) : null;
    const eventSubscription = Meteor.subscribe(eventPublications.event);
    return {
      ready: userProfileSubscription ? userProfileSubscription.ready() && eventSubscription.ready() : false,
      userProfile: userProfileData,
    };
  });

  if (!ready) return <LoadingSpinner />;

  return (
    <Card className="w-100 h-100 my-1">
      <Card.Header>
        <h2>Upcoming Events</h2>
      </Card.Header>
      <Card.Body className="d-flex justify-content-start align-items-start p-2">
        {userProfile && userProfile.onGoingEvents && userProfile.onGoingEvents.length > 0 ? (
          <ul>
            {userProfile.onGoingEvents.map(eventId => {
              const event = Events.findOne({ _id: eventId });
              return event ? (
                <li key={eventId}>
                  <a href={`/view_event/${eventId}`}>{event.title}</a>
                  <p>{event.startTime.toLocaleDateString()}</p>
                </li>
              ) : null;
            })}
          </ul>
        ) : (
          <p className="m-0">Hmmm... No Events...</p>
        )}
      </Card.Body>
      <Card.Footer className="d-flex justify-content-end p-2">
        <Button id={COMPONENT_IDS.UPCOMING_EVENT_CARD_FIND_EVENTS} className="justify-content-end" href="/Events">Find Events</Button>
      </Card.Footer>
    </Card>
  );
};

export default UpcomingEventCard;
