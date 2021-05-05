const TableItem = ({ fullName, isActive, role, email }) => {
  return (
    <>
      <td>{fullName}</td>
      <td>{email}</td>
      <td>{role}</td>
      <td>{isActive ? "✔️" : "❌"}</td>
    </>
  );
};

export default TableItem;
