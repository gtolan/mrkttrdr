'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Offer = mongoose.model('Offer'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, offer;

/**
 * Offer routes tests
 */
describe('Offer CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new Offer
    user.save(function () {
      offer = {
        name: 'Offer name'
      };

      done();
    });
  });

  it('should be able to save a Offer if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Offer
        agent.post('/api/offers')
          .send(offer)
          .expect(200)
          .end(function (offerSaveErr, offerSaveRes) {
            // Handle Offer save error
            if (offerSaveErr) {
              return done(offerSaveErr);
            }

            // Get a list of Offers
            agent.get('/api/offers')
              .end(function (offersGetErr, offersGetRes) {
                // Handle Offer save error
                if (offersGetErr) {
                  return done(offersGetErr);
                }

                // Get Offers list
                var offers = offersGetRes.body;

                // Set assertions
                (offers[0].user._id).should.equal(userId);
                (offers[0].name).should.match('Offer name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Offer if not logged in', function (done) {
    agent.post('/api/offers')
      .send(offer)
      .expect(403)
      .end(function (offerSaveErr, offerSaveRes) {
        // Call the assertion callback
        done(offerSaveErr);
      });
  });

  it('should not be able to save an Offer if no name is provided', function (done) {
    // Invalidate name field
    offer.name = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Offer
        agent.post('/api/offers')
          .send(offer)
          .expect(400)
          .end(function (offerSaveErr, offerSaveRes) {
            // Set message assertion
            (offerSaveRes.body.message).should.match('Please fill Offer name');

            // Handle Offer save error
            done(offerSaveErr);
          });
      });
  });

  it('should be able to update an Offer if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Offer
        agent.post('/api/offers')
          .send(offer)
          .expect(200)
          .end(function (offerSaveErr, offerSaveRes) {
            // Handle Offer save error
            if (offerSaveErr) {
              return done(offerSaveErr);
            }

            // Update Offer name
            offer.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Offer
            agent.put('/api/offers/' + offerSaveRes.body._id)
              .send(offer)
              .expect(200)
              .end(function (offerUpdateErr, offerUpdateRes) {
                // Handle Offer update error
                if (offerUpdateErr) {
                  return done(offerUpdateErr);
                }

                // Set assertions
                (offerUpdateRes.body._id).should.equal(offerSaveRes.body._id);
                (offerUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Offers if not signed in', function (done) {
    // Create new Offer model instance
    var offerObj = new Offer(offer);

    // Save the offer
    offerObj.save(function () {
      // Request Offers
      request(app).get('/api/offers')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Offer if not signed in', function (done) {
    // Create new Offer model instance
    var offerObj = new Offer(offer);

    // Save the Offer
    offerObj.save(function () {
      request(app).get('/api/offers/' + offerObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', offer.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Offer with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/offers/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Offer is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Offer which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Offer
    request(app).get('/api/offers/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Offer with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Offer if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Offer
        agent.post('/api/offers')
          .send(offer)
          .expect(200)
          .end(function (offerSaveErr, offerSaveRes) {
            // Handle Offer save error
            if (offerSaveErr) {
              return done(offerSaveErr);
            }

            // Delete an existing Offer
            agent.delete('/api/offers/' + offerSaveRes.body._id)
              .send(offer)
              .expect(200)
              .end(function (offerDeleteErr, offerDeleteRes) {
                // Handle offer error error
                if (offerDeleteErr) {
                  return done(offerDeleteErr);
                }

                // Set assertions
                (offerDeleteRes.body._id).should.equal(offerSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Offer if not signed in', function (done) {
    // Set Offer user
    offer.user = user;

    // Create new Offer model instance
    var offerObj = new Offer(offer);

    // Save the Offer
    offerObj.save(function () {
      // Try deleting Offer
      request(app).delete('/api/offers/' + offerObj._id)
        .expect(403)
        .end(function (offerDeleteErr, offerDeleteRes) {
          // Set message assertion
          (offerDeleteRes.body.message).should.match('User is not authorized');

          // Handle Offer error error
          done(offerDeleteErr);
        });

    });
  });

  it('should be able to get a single Offer that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new Offer
          agent.post('/api/offers')
            .send(offer)
            .expect(200)
            .end(function (offerSaveErr, offerSaveRes) {
              // Handle Offer save error
              if (offerSaveErr) {
                return done(offerSaveErr);
              }

              // Set assertions on new Offer
              (offerSaveRes.body.name).should.equal(offer.name);
              should.exist(offerSaveRes.body.user);
              should.equal(offerSaveRes.body.user._id, orphanId);

              // force the Offer to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the Offer
                    agent.get('/api/offers/' + offerSaveRes.body._id)
                      .expect(200)
                      .end(function (offerInfoErr, offerInfoRes) {
                        // Handle Offer error
                        if (offerInfoErr) {
                          return done(offerInfoErr);
                        }

                        // Set assertions
                        (offerInfoRes.body._id).should.equal(offerSaveRes.body._id);
                        (offerInfoRes.body.name).should.equal(offer.name);
                        should.equal(offerInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Offer.remove().exec(done);
    });
  });
});
