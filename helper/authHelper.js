import bcrypt from "bcrypt";

export const hashedPassword = async (Password) => {
  try {
    const saltRounds = 10;
    const hashPassword = await bcrypt.hash(Password, saltRounds);
    return hashPassword;
  } catch (error) {
    console.log("Error in password hashing", error);
  }
};

export const comparePassword = async (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword);
};
