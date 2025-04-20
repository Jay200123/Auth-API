import { body } from "express-validator";

export const registerUserValidation = async (req) => {
  const userRequiredFields = [
    await body("email").isEmail().withMessage("Invalid email format").run(req),
    await body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long")
      .run(req),
    await body("first_name")
      .notEmpty()
      .withMessage("First name is required")
      .run(req),
    await body("last_name")
      .notEmpty()
      .withMessage("Last name is required")
      .run(req),
    await body("phone_number")
      .notEmpty()
      .withMessage("Phone number is required")
      .run(req),
    await body("address")
      .notEmpty()
      .withMessage("Address is required")
      .run(req),
    await body("city").notEmpty().withMessage("City is required").run(req),
  ];

  return userRequiredFields;
};
