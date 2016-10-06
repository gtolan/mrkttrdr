'use strict';
/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Comment Schema
 */
var CommentsSchema = new Schema({
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
  },
  visible: {
    type: Boolean,
    default: true
  }
});
mongoose.model('Comments', CommentsSchema);
/**
 * Task Schema
 */
var TaskSchema = new Schema({
  title: {
    type: String,
    default: '',
//    required: 'Please fill Task name',
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  about: {
    type: String
  },
  provider: {
    type: String,
    required: 'Provider is required'
  },
  providerData: {},
  additionalProvidersData: {},
  email: {
    type: String
  },
  description: {
    type: String
//    required: 'Please fill in a description of your task'
  },
  inPersonTask: {
    type: Boolean
  },
  onlineTask: {
    type: Boolean
  },
  cleaning: {
    type: Boolean
  },
  onlineIT: {
    type: Boolean
  },
  photoEvents: {
    type: Boolean
  },
  funQuirky: {
    type: Boolean
  },
  DIY: {
    type: Boolean
  },
  marketing: {
    type: Boolean
  },
  office: {
    type: Boolean
  },
  moving: {
    type: Boolean
  },
  misc: {
    type: Boolean
  },
  taskLocation: {
    type: String
  },
  dueDate: {
    type: Date
  },
  price: {
    type: Number
  },
  expenses: {
    type: Number
  },
  workerQty: {
    type: Number
  },
  profileImageURL: {
    type: String
    // default: 'modules/users/client/img/profile/default.png'
  },
  statusOpen: {
    default: true,
    type: Boolean
  },
  statusAssigned: {
    default: false,
    type: Boolean
  },
  statusPaid: {
    default: false,
    type: Boolean
  },
  statusClosed: {
    default: false,
    type: Boolean
  },
  //    offers: [OfferSchema],
  comments: [CommentsSchema],
  assignedTo: {
    type: String
  },
  acceptedPrice: {
    type: Number
  }
});
mongoose.model('Task', TaskSchema);