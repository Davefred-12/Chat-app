async function logout(req, res) {
    try {
      const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        expires: new Date(0), 
      };
  
      return res
        .status(200)
        .cookie("token", "", cookieOptions) 
        .json({
          message: "Logged out successfully",
          success: true,
        });
    } catch (error) {
      return res.status(500).json({
        message: error.message || error,
        error: true,
      });
    }
  }
  
  module.exports = logout;