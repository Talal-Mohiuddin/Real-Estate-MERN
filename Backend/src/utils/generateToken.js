const generateToken = (user, message, status, res) => {
  const token = user.generateWebToken();
  const cookieName = user.role === "admin" ? "admin" : "user";

  const expirationTime = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days from now

  res
    .status(status)
    .cookie(cookieName, token, {
      httpOnly: true,
      expires: expirationTime, 
    })
    .json({
      success: true,
      message,
      token,
      user,
    });
};

export { generateToken };
