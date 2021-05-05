import { useRef, useState } from 'react';
import db from '../firebase/db';
import CheckItem from "./CheckItem";
import ItemSelect from './ItemSelect';
import InputItem from './InputItem';
import validator from 'validator';
import InputFieldSet from './InputFieldSet';

export default function RegisterForm() {
  const [formData, setformData] = useState({
    fullName: '',
    email: '',
    // role: '',
    isActive: false
  });
  
  const [formWasValidated, setFormWasValidated] = useState(false);

  const [formErrors, setFormformErrors] = useState({
    fullName: '',
    email: '',
    // role: '',
    isActive: false
  });


  const references = {
    fullName: useRef(),
    email: useRef(),
    // role: useRef(),
    isActive: useRef()
  };

  const [formAlertText, setFormAlertText] = useState('');
  const [formAlertType, setFormAlertType] = useState('');

  const categoryOptions = [
    {
      value: "",
      text: "Válassz!"
    },
    {
      value: "admin"
    },
    {
      value: "vendég"
    },
    {
      value: "regisztrált felhasználó"
    }
  ];

  const validators = {
    fullName: {
      required: isNotEmpty,
    },
    email: {
      required: isNotEmpty,
      validEmail: isValidEmail
    },
    role: {
      required: isNotEmpty
    }
  }

  const errorTypes = {
    required: "Kitöltése kötelező",
    validEmail: "Nem megfelelő email cím formátum",
    selectMust: "Választani kötelező!"
  };

  function isValidEmail(value) {
    return validator.isEmail(value);
  }

  function isNotEmpty(value) {
    return value !== '';
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const isValid = isFormValid();

    if (isValid) {
      db.collection('qualification-exam').add(formData)
        .then((docRef) => {
          setFormAlertText(`Sikeres mentés`);
          setFormAlertType('success');
          setformData({
            fullName: '',
            email: '',
            // role: '',
            isActive: false
          });
        });
    }
  }

  function isFormValid() {
    let isFormValid = true;
    for (const fieldName of Object.keys(formData)) {
      const isFieldValid = validateField(fieldName);
      if (!isFieldValid) {
        isFormValid = false;
      }
    }
    return isFormValid;
  }

  function handleInputBlur(e) {
    const name = e.target.name;
    validateField(name);
  }

  function handleInputChange(e) {
    const value = e.target.value;
    const fieldName = e.target.name;
    setformData({
      ...formData,
      [fieldName]: value
    });
    setFormformErrors((previousformErrors) => ({
      ...previousformErrors,
      [fieldName]: ''
    }));
  }

  function handleFilterCheck(e) {
    setformData({
      ...formData,
      isActive: e.target.checked
    });
    
  }

  function validateField(fieldName) {
    const value = formData[fieldName];
    let isValid = true;
    setFormformErrors((previousformErrors) => ({
      ...previousformErrors,
      [fieldName]: ''
    }));
    references[fieldName].current.setCustomValidity('');

    if (validators[fieldName] !== undefined) {
      for (const [validationType, validatorFn] of Object.entries(validators[fieldName])) {
        if (isValid) {
          isValid = validatorFn(value);
          if (!isValid) {
            const errorText = errorTypes[validationType];
            setFormformErrors((previousformErrors) => {
              return ({
                ...previousformErrors,
                [fieldName]: errorText
              })
            });
            references[fieldName].current.setCustomValidity(errorText);
          }
        }
      }
    }
    return isValid;
  }

  return (
    <main className={"container"}>
      <h1>Regisztráció</h1>
      <form onSubmit={handleSubmit} noValidate={true}
        className={`needs-validation ${formWasValidated ? 'was-validated' : ''}`}>
        <InputItem
          reference={references['fullName']}
          name="fullName"
          labelText="Név"
          type="text"
          error={formErrors.fullName}
          formData={formData}
          handleInputBlur={handleInputBlur}
          handleInputChange={handleInputChange}
          required={true}
        />
        <InputItem
          reference={references['email']}
          name="email"
          labelText="Email cím"
          type="email"
          errors={formErrors.email}
          formData={formData}
          handleInputBlur={handleInputBlur}
          handleInputChange={handleInputChange}
          required={true}
        />
        {/* <InputFieldSet
          reference={references['role']}
          name="role"
          labelText="Jogkör"
          type="select"
          formErrors={formErrors}
          // formData={formData}
          options={categoryOptions}
          handleInputBlur={handleInputBlur}
          handleInputChange={handleInputChange}
          required={true}
        /> */}

        <CheckItem
          checkLabel="Aktív felhasználók"
          value="filter"
          onChange={handleFilterCheck}
          id={"filter"}
          checked={formData.isActive} 
          reference={references['isActive']}
          />
        <button type="submit" className="btn btn-primary">Regisztráció</button>
      </form>
      {formAlertText &&
        <div className={`alert mt-3 alert-${formAlertType}`} role="alert">
          {formAlertText}
        </div>
      }
    </main>
  );
}

