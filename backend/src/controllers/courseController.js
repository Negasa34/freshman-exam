
const prisma = require("../lib/prisma");

async function getCourses(req, res) {
  try {
    const { universityId } = req.query;

    const where = {};

    if (universityId) {
      where.universityId = universityId;
    }

    const courses = await prisma.course.findMany({
      where,
      orderBy: {
        name: "asc",
      },
    });

    return res.status(200).json({ courses });
  } catch (error) {
    console.error("Get courses error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
}

async function getCourseById(req, res) {
  try {
    const { id } = req.params;

    const course = await prisma.course.findUnique({
      where: { id },
    });

    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    return res.status(200).json({ course });
  } catch (error) {
    console.error("Get course by ID error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
}

async function createCourse(req, res) {
  try {
    const { name, code, description, universityId } = req.body;

    if (!name || !code) {
      return res.status(400).json({
        message: "Name and code are required",
      });
    }

    if (universityId) {
      const university = await prisma.university.findUnique({
        where: { id: universityId },
      });

      if (!university) {
        return res.status(404).json({
          message: "University not found",
        });
      }
    }

    const existingCourse = await prisma.course.findUnique({
      where: { code },
    });

    if (existingCourse) {
      return res.status(409).json({
        message: "Course code already exists",
      });
    }

    const course = await prisma.course.create({
      data: {
        name,
        code,
        description: description || null,
        universityId: universityId || null,
      },
    });

    return res.status(201).json({
      message: "Course created successfully",
      course,
    });
  } catch (error) {
    console.error("Create course error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
}

module.exports = {
  getCourses,
  getCourseById,
  createCourse,
};
