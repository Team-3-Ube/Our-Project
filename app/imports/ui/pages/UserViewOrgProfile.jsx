import React from 'react';
import { Container, Row, Col, Card, Image } from 'react-bootstrap';
import { useTracker } from 'meteor/react-meteor-data';
import { useParams } from 'react-router';
import { Organization } from '../../api/organization/OrganizationCollection';
import ConnectButton from '../components/ConnectButton';
import UserViewOrgEvents from '../components/UserViewOrgEvents';
import LoadingSpinner from '../components/LoadingSpinner';
import { PAGE_IDS } from '../utilities/PageIDs';
import '../css/OrganizationProfile.css';

/** Organization profile page which can be viewed by everyone. */
const UserViewOrgProfile = () => {
  const { _id } = useParams();

  const { ready, orgProfile } = useTracker(() => {
    const subscription = Organization.subscribeOrganization(); // Subscribe to organization publication
    const profile = Organization.findOne({ _id: _id }); // Query organization
    return {
      ready: subscription ? subscription.ready() : false,
      orgProfile: profile,
    };
  });

  if (!ready) {
    return (
      <Container className="px-2 py-5">
        <LoadingSpinner /> {/* Show loading spinner while data is loading */}
      </Container>
    );
  }

  // Once data is ready, render the organization profile
  return (
    <Container id={PAGE_IDS.USER_VIEW_ORG_PROFILE}>
      <Row className="py-5">
        <Col md={1} />
        <Col md={4}>
          <h1>{orgProfile.name}</h1>
          <Image src={orgProfile.image} className="org-profile-img rounded mb-4" />
        </Col>
        <Col md={6}>
          <Card className="d-flex justify-content-center">
            <Card.Header>
              <h3>Organization Details</h3>
            </Card.Header>
            <Card.Body className="mt-2">
              <h5>Mission:</h5>
              {orgProfile.mission ? (
                <p>{orgProfile.mission}</p>
              ) : (<p>N/A</p>)}
              <h5>Location:</h5>
              {orgProfile.hasPhysicalAddress ? (
                <p>{orgProfile.address}, {orgProfile.city}, {orgProfile.state}, {orgProfile.country} {orgProfile.zipCode}</p>
              ) : (<p>N/A</p>)}
              <Row>
                <Col>
                  <h5>Contact Email:</h5>
                  {orgProfile.contactEmail ? (
                    <p>{orgProfile.contactEmail}</p>
                  ) : (<p>N/A</p>)}
                </Col>
                <Col>
                  <h5>Phone:</h5>
                  {orgProfile.phone ? (
                    <p>{orgProfile.phone}</p>
                  ) : (<p>N/A</p>)}
                </Col>
              </Row>
            </Card.Body>
            {orgProfile.contactEmail ? (
              <Card.Footer>
                <ConnectButton org={orgProfile} />
              </Card.Footer>
            ) : ''}
          </Card>
        </Col>
      </Row>
      <Row>
        <Col md={1} />
        <Col md={10}>
          <h1 className="text-center">Events Organized by {orgProfile.name}</h1>
          <UserViewOrgEvents org={orgProfile} />
        </Col>
      </Row>
    </Container>
  );
};

export default UserViewOrgProfile;