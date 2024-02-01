// Función para verificar si el usuario es administrador
const isAdmin = (roles) => {
  let role = roles.find(role => role.name == "admin");

  if (role) { return true; }
  else { return false; }
}

// Función para verificar si el usuario es empleado
const isEmployee = (roles) => {
  let role = roles.find(role => role.name == "employee");

  if (role) { return true; }
  else { return false; }
}

// Función simple para validar el formulario
const validateForm = (params) => {
  let errors = new Object();

  for (const property in params) {
    if (!params[property]) {
      errors[property] = ["El campo es requerido."];
    }
  }

  if (Object.keys(errors).length > 0) {
    return { message: "Por favor, revisa el formulario.", errors };
  } else {
    return false;
  }
}

// Función para convertir los errores en un objeto para poder mostrarlos debajo de cada input correspondiente
const convertArrayErrorsInObject = (array = []) => {
  let errors = new Object();
  let message = "";

  if (array.length > 0) {
    message = "Por favor, revisa el formulario.";
  }

  array.forEach((item) => {
    if (errors[item.$property]) {
      errors[item.$property].push(item.$message);
    } else {
      errors[item.$property] = [item.$message];
    }
  });

  return { message, errors };
}

export default { isAdmin, isEmployee, validateForm, convertArrayErrorsInObject }