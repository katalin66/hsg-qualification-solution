// export default function InputFieldSet(
//   {
//     errors, fieldValues, handleInputChange, handleInputBlur, type, name, labelText, required, reference
//   }) {
//   return (
//     <div className={`mb-3 ${errors[name] !== '' ? "was-validated" : ""}`}>
//       <label htmlFor={name} className="form-label">{labelText}</label>
//       <input
//         type={type}
//         className="form-control"
//         id={name}
//         name={name}
//         value={fieldValues[name]}
//         onChange={handleInputChange}
//         onBlur={handleInputBlur}
//         required={required}
//         ref={reference}
//       />
//       <div className="invalid-feedback">
//         {errors[name]}
//       </div>
//     </div>
//   );
// }

export default function InputFieldSet(
  {
    errors, fieldValues, handleInputChange, handleInputBlur, type, name, labelText, required, reference, options
  }) {
  let inputField;
  if (type === "select") {
    inputField = <select
      id={name}
      name={name}
      required={required}
      className={"form-select"}
      onChange={handleInputChange}
      onBlur={handleInputBlur}
      ref={reference}
      // value={fieldValues[name]}
    >
      {options.map((option) => (
        <option value={option.value} key={option.value}>{option.text ? option.text : option.value}</option>
      ))}
    </select>;
  } else if (type === "textarea") {
    inputField = <textarea
      className="form-control"
      id={name}
      name={name}
      onChange={handleInputChange}
      onBlur={handleInputBlur}
      required={required}
      ref={reference}
      rows="3"
      value={fieldValues[name]}
    />
  } else {
    inputField = <input
      type={type}
      className="form-control"
      id={name}
      name={name}
      value={fieldValues[name]}
      onChange={handleInputChange}
      onBlur={handleInputBlur}
      required={required}
      ref={reference}
    />
  }

  return (
    <div className={`mb-3 ${errors[name] !== '' ? "was-validated" : ""}`}>
      <label htmlFor={name} className="form-label">{labelText}</label>
      {inputField}
      <div className="invalid-feedback">
        {errors[name]}
      </div>
    </div>
  );
}
