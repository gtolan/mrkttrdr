'use strict';
/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Comment Schema
 */
var offersCommentsSchema = new Schema({
  comment: {
    type: String,
    default: ''
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  displayName: {
    type: String,
    trim: true
  },
  profileImageURL: {
    type: String
  },
  created: {
    type: Date,
    default: Date.now
  }
});
mongoose.model('offersComments', offersCommentsSchema);


/**
 * Reviews Schema
 */
var userAverageRatingSchema = new Schema({
  rating: {
    type: Number  
  }
});
mongoose.model('userAverage', userAverageRatingSchema);


/**
 * Offer Schema
 */
var OfferSchema = new Schema({
  taskId: {
    type: String
  },
  taskName: {
    type: String
  },
  taskDesc: {
    type: String
  },
  taskOwnerUser: {
    type: String
  },
  taskOwnerDisplayName: {
    type: String
  },
  taskOwnerEmail: {
    type: String  
  },
  taskOwnerUserProfileImageURL: {
    type: String
  },
  taskOwnerAbout: {
    type: String
  },
  taskOwnerAdditionalProvidersData: {},
  offerOwnerUser: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  offerUserAverage: [userAverageRatingSchema],
  offerDesc: {
    type: String,
    default: ''
  },
  offerPrice: {
    type: Number
  },
  // offerExpenses: {
  //   type: Number
  // },
  offerDate: {
    type: String
  },
  offerOwnerEmail: {
    type: String  
  },
  offerOwnerTelephone: {
    type: String
  },
  offerOwnerPayPal: {
    type: String
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  displayName: {
    type: String,
    trim: true
  },
  profileImageURL: {
    type: String
  },
  about: {
    type: String
  },
  comments: [offersCommentsSchema],    
  provider: {
    type: String
  },
  providerData: {},
  additionalProvidersData: {},
  created: {
    type: Date,
    default: Date.now
  },
  offerOpen: {
    type: Boolean,
    default: true
  },
  offerAccepted: {
    type: Boolean,
    default: false
  },
  statusPaid: {
    type: Boolean,
    default: false
  },
  offerClosed: {
    type: Boolean,
    default: false
  },
  taskRunnerReviewed: {
    type: Boolean,
    default: false
  },
  taskOwnerReviewed: {
    type: Boolean,
    default: false
  },
  acceptedPrice: {
    type: Number
  }
  // ,review: [offerReviewsSchema]
});
mongoose.model('Offer', OfferSchema);