const CheckItem = ({
  onChange,
  checkLabel,
  value,
  name,
  id,
  checked,
  reference,
}) => {
  return (
    <div className="form-check">
      <input
        onChange={onChange}
        ref={reference}
        className="form-check-input "
        type="checkbox"
        value={value}
        id={id}
        name={name}
        checked={checked}
      />
      <label className="form-check-label " htmlFor={id}>
        {checkLabel}
      </label>
    </div>
  );
};
export default CheckItem;
