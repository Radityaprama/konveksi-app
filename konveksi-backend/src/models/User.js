const userSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['customer', 'admin', 'staff'],
    default: 'customer'
  }
}, {
  timestamps: true
});

userSchema.methods.isAdmin = function() {
  return this.role === 'admin';
};

userSchema.methods.isStaff = function() {
  return this.role === 'staff' || this.role === 'admin';
};