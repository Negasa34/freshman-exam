const prisma = require("../lib/prisma");

async function getExamsByCourse(req, res) {
  try {
    const { courseId } = req.params;

    const exams = await prisma.exam.findMany({
  where: {
    courseId,
  },
  select: {
    id: true,
    title: true,
    year: true,
    type: true,
    isPremium: true,
    courseId: true,
    createdAt: true,
  },
  orderBy: [
    {
      year: "desc",
    },
    {
      type: "asc",
    },
  ],
});

    return res.status(200).json({
      exams,
    });
  } catch (error) {
    console.error("Get exams error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
}

async function getExamById(req, res) {
  try {
    const { id } = req.params;

    const exam = await prisma.exam.findUnique({
      where: {
        id,
      },
    });

    if (!exam) {
      return res.status(404).json({
        message: "Exam not found",
      });
    }

    console.log("Exam premium status:", exam.isPremium);

    if (exam.isPremium) {
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
    }

    return res.status(200).json({
      exam,
    });
  } catch (error) {
    console.error("Get exam by ID error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
}

async function createExam(req, res) {
  try {
    const { courseId } = req.params;
    const { title, year, type, isPremium, fileUrl } = req.body;

    if (!title || !year || !type || !fileUrl) {
      return res.status(400).json({
        message: "Title, year, type and fileUrl are required",
      });
    }

    if (!["MID", "FINAL"].includes(type)) {
      return res.status(400).json({
        message: "Type must be MID or FINAL",
      });
    }

    if (year < 2014 || year > 2018) {
      return res.status(400).json({
        message: "Year must be between 2014 and 2018",
      });
    }

    const course = await prisma.course.findUnique({
      where: {
        id: courseId,
      },
    });

    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    const exam = await prisma.exam.create({
      data: {
        title,
        year,
        type,
        isPremium: type === "FINAL" ? true : Boolean(isPremium),
        fileUrl,
        courseId,
      },
    });

    return res.status(201).json({
      message: "Exam created successfully",
      exam,
    });
  } catch (error) {
    console.error("Create exam error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
}

module.exports = {
  getExamsByCourse,
  getExamById,
  createExam,
};