import { body } from "express-validator";

export const loginValidation = async (req) => {
  const loginRequiredFields = [
    await body("email")
      .notEmpty()
      .withMessage("Email is required")
      .run(req),
    await body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long")
      .run(req),
  ];

  return loginRequiredFields;
};
