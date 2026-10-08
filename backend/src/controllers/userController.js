const prisma = require("../lib/prisma");

async function getMe(req, res) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: req.user.userId,
      },
      select: {
  id: true,
  name: true,
  email: true,
  isPremium: true,
  role: true,
  createdAt: true,
},
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      user,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
}

module.exports = {
  getMe,
};