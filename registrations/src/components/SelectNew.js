export default function SelectNew({
  errors,
  fieldValues,
  handleInputChange,
  handleInputBlur,
  type,
  name,
  labelText,
  required,
  reference,
}) {
  let options = ["admin", "vendég", "regisztrált felhasználó"];

  return (
    <div className={`mb-3 ${errors[name] !== "" ? "was-validated" : ""}`}>
      <label htmlFor={name} className="form-label">
        {labelText}
      </label>
      <select
        type={type}
        className="form-select"
        id={name}
        name={name}
        value={fieldValues[name]}
        onChange={handleInputChange}
        onBlur={handleInputBlur}
        required={required}
        ref={reference}
      >
        <option value="">Válassz!</option>
        {options.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>

      <div className="invalid-feedback">{errors[name]}</div>
    </div>
  );
}