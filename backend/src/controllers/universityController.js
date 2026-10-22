
const prisma = require("../lib/prisma");

async function getUniversities(req, res) {
  try {
    const universities = await prisma.university.findMany({
      orderBy: {
        name: "asc",
      },
      include: {
        _count: {
          select: {
            departments: true,
          },
        },
      },
    });

    return res.status(200).json({ universities });
  } catch (error) {
    console.error("Get universities error:", error);

    return res.status(500).json({
      message: "Unable to fetch universities",
    });
  }
}

async function getUniversityById(req, res) {
  try {
    const { id } = req.params;

    const university = await prisma.university.findUnique({
      where: { id },
      include: {
        departments: {
          orderBy: {
            name: "asc",
          },
          include: {
            _count: {
              select: {
                courses: true,
              },
            },
          },
        },
      },
    });

    if (!university) {
      return res.status(404).json({
        message: "University not found",
      });
    }

    return res.status(200).json({ university });
  } catch (error) {
    console.error("Get university error:", error);

    return res.status(500).json({
      message: "Unable to fetch university",
    });
  }
}

module.exports = {
  getUniversities,
  getUniversityById,
};
