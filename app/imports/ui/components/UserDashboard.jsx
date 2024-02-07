import React from 'react';
import { Container, Row, Col, Card, Image } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { UserProfiles } from '../../api/user/UserProfileCollection';
import LoadingSpinner from './LoadingSpinner';

const UserDashboard = () => {
  const { ready, userProfile } = useTracker(() => {
    const currentUser = Meteor.user(); // Retrieve the current user
    const subscription = currentUser ? UserProfiles.subscribeUser() : null; // Subscribe to userProfile publication for the current user
    const profile = currentUser ? UserProfiles.findOne({ userID: currentUser._id }) : null; // Query user profile for the current user
    return {
      ready: subscription ? subscription.ready() : false,
      userProfile: profile,
    };
  });

  if (!ready) {
    return (
      <Container className="p-2">
        <LoadingSpinner /> {/* Show loading spinner while data is loading */}
      </Container>
    );
  }

  return (
    <Card>
      <Card.Body className="d-flex flex-column align-items-start">
        <h2 className="mb-3">Overview</h2>
        <Container className="d-flex flex-column align-items-start">
          <Row>
            <Col>
              <Image src={userProfile.image} alt="ProfileImage" style={{ width: '150px', height: '150px', borderRadius: '50%', marginBottom: '20px' }} />
            </Col>
            <Col>
              <h4>{userProfile.firstName} {userProfile.lastName}</h4>
              <h4>Hours Recorded: {userProfile.totalHours}</h4>
            </Col>
          </Row>
        </Container>
      </Card.Body>
    </Card>
  );
};

export default UserDashboard;
