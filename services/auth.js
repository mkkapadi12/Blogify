const JWT = require("jsonwebtoken");

const secret = "$uperMan@123";

const GenerateUserToken = (user) => {
  const { _id, email, profileImgURL, role, fullName } = user;
  const payload = {
    _id,
    fullName,
    email,
    profileImgURL,
    role,
  };

  const token = JWT.sign(payload, secret);
  return token;
};

const validateToken = (token) => {
  const payload = JWT.verify(token, secret);
  return payload;
};

module.exports = {
  GenerateUserToken,
  validateToken,
};
