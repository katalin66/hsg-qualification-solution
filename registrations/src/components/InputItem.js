const InputItem = ({
  type = "text",
  name,
  id,
  value,
  onChange,
  onBlur,
  reference,
  error,
  labelText,
}) => {
  return (
    <div className={`${error && "was-validated"}`}>
      <label className={"form-label m-2"} htmlFor={id}>
        {labelText}
      </label>
      <input
        className={"form-control m-2"}
        type={type}
        name={name}
        id={id}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        ref={reference}
      />
      <div className="invalid-feedback mx-2">{error}</div>
    </div>
  );
};

export default InputItem;
