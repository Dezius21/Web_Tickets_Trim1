const EMAIL_REGEX = /\S+@\S+\.\S+/;

const isText = (value) => typeof value === "string";

const validateRegister = (req,res,next) => {
    const {username, email, password} = req.body || {};
    const errors = {};

    if(!isText(username) || username.trim().length < 2)
    {
        errors.username = "El nombre de usuario debe tener al menos 2 caracteres"
    }
    if (!isText(email) || !EMAIL_REGEX.test(email.trim())) {
    errors.email = "El email no tiene un formato válido.";
    }
    if (!isText(password) || password.length < 8) {
        errors.password = "La contraseña debe tener al menos 8 caracteres.";
    }

    if (Object.keys(errors).length > 0) {
        return res
        .status(400)
        .json({ message: "Datos de registro no válidos.", errors });
    }

    req.body.username = username.trim();
    req.body.email = email.trim().toLowerCase();
    next();
};

const validateLogin = (req, res, next) => {
  const { email, password } = req.body || {};

  if (
    !isText(email) ||
    !EMAIL_REGEX.test(email.trim()) ||
    !isText(password) ||
    password.length === 0
  ) {
    return res
      .status(400)
      .json({ message: "Email y contraseña son obligatorios." });
  }

  req.body.email = email.trim().toLowerCase();
  next();
};

module.exports = { validateRegister, validateLogin };
