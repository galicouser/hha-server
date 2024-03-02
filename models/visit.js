const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  Copay: {
    type: String,
    required: true,
  },
  Notes: {
    type: String,
    required: true,
  },
  Duties: {
    type: String,
    required: true,
  },
  PayerID: {
    type: Boolean,
    default: false,
  },
  VisitID: {
    type: Boolean,
    default: false,
  },
  MemberID: {
    type: Boolean,
    default: false,
  },PaidDate: {
    type: Boolean,
    default: false,
  },PlanType: {
    type: Boolean,
    default: false,
  },OfficeNPI: {
    type: Boolean,
    default: false,
  },TRNNumber: {
    type: Boolean,
    default: false,
  },BilledRate: {
    type: Boolean,
    default: false,
  },ClockedIn: {
    type: Boolean,
    default: false,
  },Deductible: {
    type: Boolean,
    default: false,
  },EVVEndTime: {
    type: Boolean,
    default: false,
  },IsDeletion: {
    type: Boolean,
    default: false,
  },ScheduleID: {
    type: Boolean,
    default: false,
  },UserField1: {
    type: Boolean,
    default: false,
  },UserField2: {
    type: Boolean,
    default: false,
  },
  UserField3: {
    type: Boolean,
    default: false,
  },UserField4: {
    type: Boolean,
    default: false,
  },UserField5: {
    type: Boolean,
    default: false,
  },UserField6: {
    type: Boolean,
    default: false,
  },UserField7: {
    type: Boolean,
    default: false,
  },UserField8: {
    type: Boolean,
    default: false,
  },UserField9: {
    type: Boolean,
    default: false,
  },AgencyTaxID: {
    type: Boolean,
    default: false,
  },ClockedOut: {
    type: Boolean,
    default: false,
  },Coinsurance: {
    type: Boolean,
    default: false,
  },
  MissedVisit: {
    type: Boolean,
    default: false,
  },
  UnitsBilled: {
    type: Boolean,
    default: false,
  },
  
  
});

const User = mongoose.model("User", userSchema);

exports.User = User;
