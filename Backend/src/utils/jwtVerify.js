const generateToken = (user, message, status, res) => {
  const token = user.generateWebToken();
  const cookieName = user.role === "admin" ? "admin" : "user";
  res
    .status(status)
    .cookie(cookieName, token, {
      expires: new Date(
        Date.now() + process.env.COOKIE_EXPIERY * 24 * 60 * 60 * 1000
      ),
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
