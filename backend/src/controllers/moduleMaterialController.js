
const prisma = require("../lib/prisma");

async function getModulesByCourse(req, res) {
  try {
    const { courseId } = req.params;

    const modules = await prisma.moduleMaterial.findMany({
      where: {
        courseId,
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
  id: true,
  title: true,
  fileUrl: true,
  courseId: true,
  createdAt: true,
},
    });

    return res.status(200).json({ modules });
  } catch (error) {
    console.error("Get modules error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
}

async function getModuleById(req, res) {
  try {
    const { id } = req.params;

    const moduleMaterial = await prisma.moduleMaterial.findUnique({
      where: { id },
    });

    if (!moduleMaterial) {
      return res.status(404).json({
        message: "Module not found",
      });
    }

    return res.status(200).json({
      module: moduleMaterial,
    });
  } catch (error) {
    console.error("Get module by ID error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
}

async function createModule(req, res) {
  try {
    const { courseId } = req.params;
    const { title, fileUrl } = req.body;

    if (!title || !fileUrl) {
      return res.status(400).json({
        message: "Title and fileUrl are required",
      });
    }

    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    const moduleMaterial = await prisma.moduleMaterial.create({
      data: {
        title,
        fileUrl,
        courseId,
      },
    });

    return res.status(201).json({
      message: "Module created successfully",
      module: moduleMaterial,
    });
  } catch (error) {
    console.error("Create module error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
}

module.exports = {
  getModulesByCourse,
  getModuleById,
  createModule,
};
