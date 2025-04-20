import { body, param } from "express-validator";

export const editUserValidation = async (req) => {
  const userRequiredFields = [
    await param("id").notEmpty().withMessage("User ID is required").run(req),
    await body("email").isEmail().withMessage("Invalid email format").run(req),
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
