const prisma = require("../lib/prisma");

async function adminMiddleware(req, res, next) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: req.user.userId,
      },
      select: {
        role: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (user.role !== "ADMIN") {
      return res.status(403).json({
        message: "Admin access required",
      });
    }

    next();
  } catch (error) {
    console.error("Admin middleware error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
}

module.exports = adminMiddleware;