const prisma = require("../lib/prisma");

async function premiumMiddleware(req, res, next) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: req.user.userId,
      },
      select: {
        isPremium: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (!user.isPremium) {
      return res.status(403).json({
        message: "Premium subscription required",
      });
    }

    next();
  } catch (error) {
    console.error("Premium middleware error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
}

module.exports = premiumMiddleware;