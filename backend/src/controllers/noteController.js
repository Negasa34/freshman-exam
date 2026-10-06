const prisma = require("../lib/prisma");

async function getNotesByCourse(req, res) {
  try {
    const { courseId } = req.params;

    const notes = await prisma.note.findMany({
      where: {
        courseId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      notes,
    });
  } catch (error) {
    console.error("Get notes error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
}

async function getNoteById(req, res) {
  try {
    const { id } = req.params;

    const note = await prisma.note.findUnique({
      where: {
        id,
      },
    });

    if (!note) {
      return res.status(404).json({
        message: "Note not found",
      });
    }

    return res.status(200).json({
      note,
    });
  } catch (error) {
    console.error("Get note by ID error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
}

async function createNote(req, res) {
  try {
    const { courseId } = req.params;
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        message: "Title and content are required",
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

    const note = await prisma.note.create({
      data: {
        title,
        content,
        courseId,
      },
    });

    return res.status(201).json({
      message: "Note created successfully",
      note,
    });
  } catch (error) {
    console.error("Create note error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
}

module.exports = {
  getNotesByCourse,
  getNoteById,
  createNote,
};