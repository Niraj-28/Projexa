const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email',
      ],
      trim: true,
      lowercase: true,
    },
    passwordHash: {
      type: String,
      required: [true, 'Please add a password'],
      select: false,
    },
    role: {
      type: String,
      enum: ['super_admin', 'company_admin', 'manager', 'employee', 'SuperAdmin', 'Admin', 'Manager', 'Employee'],
      default: 'employee',
      get: function (val) {
        if (!val) return val;
        const key = String(val)
          .trim()
          .replace(/[_\s-]+/g, '')
          .toLowerCase();

        switch (key) {
          case 'superadmin':
            return 'super_admin';
          case 'admin':
          case 'companyadmin':
            return 'company_admin';
          case 'manager':
            return 'manager';
          case 'employee':
            return 'employee';
          default:
            return key;
        }
      },
      set: function (val) {
        if (!val) return val;
        const key = String(val)
          .trim()
          .replace(/[_\s-]+/g, '')
          .toLowerCase();

        switch (key) {
          case 'superadmin':
            return 'super_admin';
          case 'admin':
          case 'companyadmin':
            return 'company_admin';
          case 'manager':
            return 'manager';
          case 'employee':
            return 'employee';
          default:
            return key;
        }
      }
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      default: null,
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
      default: null,
    },
    designation: {
      type: String,
      trim: true,
      default: '',
    },
    phone: {
      type: String,
      trim: true,
      default: '',
    },
    joiningDate: {
      type: Date,
      default: null,
    },
    mustChangePassword: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    status: {
      type: String,
      enum: ['Active', 'Inactive'],
      default: 'Active',
    },
    refreshTokens: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true, getters: true },
    toObject: { virtuals: true, getters: true },
  }
);

// Virtuals to support companyId and departmentId representation
userSchema.virtual('companyId').get(function () {
  return this.company;
});

userSchema.virtual('departmentId').get(function () {
  return this.department;
});

// Pre-save hook to hash password if it is modified
userSchema.pre('save', async function () {
  if (!this.isModified('passwordHash')) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
});

// Compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.passwordHash);
};

module.exports = mongoose.model('User', userSchema);
