const { model, Schema } = require("mongoose");
const { createHmac, randomBytes } = require("crypto");
const { GenerateUserToken } = require("../services/auth");

const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    salt: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    profileImgURL: {
      type: String,
      default: "/images/profile.png",
    },
    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", function (next) {
  const user = this;
  if (!user.isModified("password")) return;

  const salt = randomBytes(16).toString();
  const hashPassword = createHmac("sha256", salt)
    .update(user.password)
    .digest("hex");

  this.salt = salt;
  this.password = hashPassword;

  next();
});

userSchema.static(
  "matchPasswordAndGenerateToken",
  async function (email, password) {
    const user = await this.findOne({ email });

    if (!user) throw new Error("User not found !");

    const salt = user.salt;
    const hashPassword = user.password;

    const userProvidedHash = createHmac("sha256", salt)
      .update(password)
      .digest("hex");

    if (hashPassword !== userProvidedHash)
      throw new Error("Incorrect user and password");

    const token = GenerateUserToken(user);
    return token;
  }
);

const USER = model("user", userSchema);

module.exports = USER;
