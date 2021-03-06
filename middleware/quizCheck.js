const { Quiz } = require("../models");

const quizCheck = async (req, res, next) => {
  const { quizId } = req.params;
  try {
    const quiz = await Quiz.findById(quizId);
    if (quiz) {
      req.quiz = quiz;
      next();
    } else {
      return res.status(404).json({
        ok: false,
        message: "Data not found",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(404).json({
      ok: false,
      message: "Data not found",
    });
  }
};

module.exports = quizCheck;
