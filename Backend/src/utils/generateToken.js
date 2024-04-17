const generateToken = (user, message, status, res) => {
  const token = user.generateWebToken();
  const cookieName = user.role === "admin" ? "admin" : "user";
  res
    .status(status)
    .cookie(cookieName, token, {
      httpOnly: true,
    })
    .json({
      success: true,
      message,
      token,
      user,
    });
};

export { generateToken };
