import { useRef, useState } from "react";
import validator from "validator";
import InputFieldSet from "./InputFieldSet";
import SelectNew from "./SelectNew";
import CheckItem from "./CheckItem";
import db from "../firebase/db";

export default function RegisterForm() {
  const [formWasValidated, setFormWasValidated] = useState(false);

  const [errors, setErrors] = useState({
    fullName: "",
    email: "",
    role: "",
    isActive: false
  });

  const [fieldValues, setFieldValues] = useState({
    fullName: "",
    email: "",
    role: "",
    isActive: false
  });

  const references = {
    fullName: useRef(),
    email: useRef(),
    role: useRef(),
    isActive: useRef()
  };

  const [formAlertText, setFormAlertText] = useState("");
  const [formAlertType, setFormAlertType] = useState("");

  const validators = {
    fullName: {
      required: isNotEmpty,
    },
    email: {
      required: isNotEmpty,
      validEmail: isValidEmail,
    },
    role: {
      validRole: isValidRole,
    },
  };

  const errorTypes = {
    required: "Hiányzó érték",
    validEmail: "Nem megfelelő email cím formátum",
    validRole: "Választani kötelező"
  };

  function isNotEmpty(value) {
    return value !== "";
  }

  function isValidEmail(value) {
    return validator.isEmail(value);
  }

  function isValidRole(value) {
    let options = ["admin", "vendég", "regisztrált felhasználó"];
    return options.includes(value);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const isValid = isFormValid();

    if (isValid) {
      db.collection("qualification-exam")
        .add(fieldValues)
        .then((docRef) => {
          setFormAlertText(`Sikeres mentés`);
          setFormAlertType("success");
          setFieldValues({
            fullName: "",
            email: "",
            role: "",
            isActive: false
          });
        });
    }
  }

  function isFormValid() {
    let isFormValid = true;
    for (const fieldName of Object.keys(fieldValues)) {
      const isFieldValid = validateField(fieldName);
      if (!isFieldValid) {
        isFormValid = false;
      }
    }
    return isFormValid;
  }

  function handleInputChange(e) {
    const value = e.target.value;
    const fieldName = e.target.name;
    setFieldValues({
      ...fieldValues,
      [fieldName]: value,
    });
    setErrors((previousErrors) => ({
      ...previousErrors,
      [fieldName]: "",
    }));
  }

  function handleFilterCheck(e) {
    setFieldValues({
      ...fieldValues,
      isActive: e.target.checked
    });
  }

  function validateField(fieldName) {
    const value = fieldValues[fieldName];
    let isValid = true;
    setErrors((previousErrors) => ({
      ...previousErrors,
      [fieldName]: "",
    }));
    references[fieldName].current.setCustomValidity("");

    if (validators[fieldName] !== undefined) {
      for (const [validationType, validatorFn] of Object.entries(
        validators[fieldName]
      )) {
        if (isValid) {
          isValid = validatorFn(value);
          if (!isValid) {
            const errorText = errorTypes[validationType];
            setErrors((previousErrors) => {
              return {
                ...previousErrors,
                [fieldName]: errorText,
              };
            });
            references[fieldName].current.setCustomValidity(errorText);
          }
        }
      }
    }
    return isValid;
  }
  function handleInputBlur(e) {
    const name = e.target.name;
    validateField(name);
  }

  return (
    <main className={"container"}>
      <h1>Regisztráció</h1>
      <form
        onSubmit={handleSubmit}
        noValidate={true}
        className={`needs-validation ${
          formWasValidated ? "was-validated" : ""
        }`}
      >
        <InputFieldSet
          reference={references["fullName"]}
          name="fullName"
          labelText="Név"
          type="text"
          errors={errors}
          fieldValues={fieldValues}
          handleInputBlur={handleInputBlur}
          handleInputChange={handleInputChange}
          required={true}
        />
        <InputFieldSet
          reference={references["email"]}
          name="email"
          labelText="Email cím"
          type="text"
          errors={errors}
          fieldValues={fieldValues}
          handleInputBlur={handleInputBlur}
          handleInputChange={handleInputChange}
          required={true}
        />
        <SelectNew
          reference={references["role"]}
          name="role"
          labelText="Jogkör"
          type="select"
          errors={errors}
          fieldValues={fieldValues}
          handleInputBlur={handleInputBlur}
          handleInputChange={handleInputChange}
          required={true}
        />
        <CheckItem
          checkLabel="Aktív"
          value="filter"
          onChange={handleFilterCheck}
          id={"filter"}
          checked={fieldValues.isActive} 
          reference={references['isActive']}
          />
        <button type="submit" className="btn btn-primary">
          Mentés
        </button>
      </form>
      {formAlertText && (
        <div className={`alert mt-3 alert-${formAlertType}`} role="alert">
          {formAlertText}
        </div>
      )}
    </main>
  );
}
