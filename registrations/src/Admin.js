import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import db from "./firebase/db";

import "./App.scss";
import TableItem from "./components/TableItem";
import CheckItem from "./components/CheckItem";

function App() {
  const [userList, setUserList] = useState([]);
  const [isChecked, setIsChecked] = useState(false);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [userToBeDeleted, setUserToBeDeleted] = useState(null);

  // useEffect(() => {
  //   const unsubscribe = db
  //     .collection("qualification-exam")
  //     .onSnapshot((snapshot) => {
  //       const data = [];

  //       snapshot.docs.forEach((person) => {
  //         const docItem = person.data();
  //         docItem["docId"] = person.id;

  //         data.push(docItem);
  //       });
  //       setUserList(data);
  //     });
  //   return () => {
  //     unsubscribe();
  //   };
  // }, []);

  const processUserSnapShot = (querySnapshot) => {
    const tableDataCache = [];
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      const row = {
        ...doc.data(),
        docId: doc.id,
      };
      tableDataCache.push(row);
    });
    setUserList(tableDataCache);
  };

  useEffect(() => {
    db.collection("qualification-exam")
      .get()
      .then((ref) => {
        ref.docs.forEach((doc) => {
          const user = doc.data();
          user["docId"] = doc.id;
          setUserList((previousUserLIst) => [...previousUserLIst, user]);
        });
      });
  }, []);

  useEffect(() => {
    db.collection("qualification-exam")
      .get()
      .then((querySnapshot) => {
        const uniqueRoles = [];
        querySnapshot.forEach((doc) => {
          const userData = doc.data();
          if (!uniqueRoles.includes(userData.role)) {
            uniqueRoles.push(userData.role);
          }
        });
        setRoles(uniqueRoles);
      });
  }, []);

  function handleRoleChange(e) {
    const value = e.target.value;
    const ref = db.collection("qualification-exam");
    if (value !== "") {
      ref.where("role", "==", value).get().then(processUserSnapShot);
    } else {
      ref.get().then(processUserSnapShot);
    }
  }

  const handleFilterCheck = (e) => {
    setIsChecked(e.target.checked);
  };

  useEffect(() => {
    const unsubscribe = db
      .collection("qualification-exam")
      .where("isActive", "==", true)
      .onSnapshot((snapshot) => {
        const items = [];

        snapshot.docs.forEach((item) => {
          const docItem = item.data();
          docItem["docId"] = item.id;

          items.push(docItem);
        });
        setFilteredUsers(items);
      });
    return () => {
      unsubscribe();
    };
  }, [isChecked]);

  function handleDeleteOnClick(e) {
    let toBeDeleted = e.target.dataset.id;

    if (toBeDeleted) {
      db.collection("qualification-exam").doc(toBeDeleted).delete();
      db.collection("qualification-exam").get().then(processUserSnapShot);
    } else {
      console.log("can not delete");
    }
    // setUserToBeDeleted(toBeDeleted);
  }

  return (
    <>
      <header className="container mt-3 mb-3">
        <h1>Regisztráció admin</h1>
      </header>
      <section className="container">
        <Link to={"/users/new"} className={"btn btn-primary"}>
          Új felhasználó
        </Link>
        <br />
        <label htmlFor="roleselector" className="form-label">
          Szűrés jogkörre
        </label>
        <select
          id="roleselector"
          className={"form-select"}
          onChange={handleRoleChange}
        >
          <option value={""}>Válassz!</option>
          {roles.map((borough) => (
            <option key={borough} value={borough}>
              {borough}
            </option>
          ))}
        </select>
        <CheckItem
          checkLabel="Aktív felhasználók"
          value="filter"
          onChange={handleFilterCheck}
          id={"filter"}
          checked={isChecked}
        />
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Név</th>
              <th>Email</th>
              <th>Jogkör</th>
              <th>Státusz</th>
              <th>Műveletek</th>
            </tr>
          </thead>
          <tbody>
            {isChecked
              ? filteredUsers.map((user) => (
                  <tr key={user.docId}>
                    <TableItem
                      fullName={user.fullName}
                      // yearOfBirth={user.yearOfBirth}
                      isActive = {user.isActive}
                      role={user.role}
                      email={user.email}
                    />
                    <td>
                      <div
                        class="btn-group"
                        role="group"
                        aria-label="Basic example"
                      >
                        <Link to={`users/edit/${user.docId}`}>
                          <button className="btn btn-primary">Módosítás</button>
                        </Link>
                        <button
                          className="btn btn-danger"
                          data-id={user.docId}
                          onClick={handleDeleteOnClick}
                        >
                          Törlés
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              : userList.map((user) => (
                  <tr key={user.docId}>
                    <TableItem
                      fullName={user.fullName}
                      // yearOfBirth={user.yearOfBirth}
                      isActive = {user.isActive}
                      role={user.role}
                      email={user.email}
                    />
                    <td>
                      <div
                        class="btn-group"
                        role="group"
                        aria-label="Basic example"
                      >
                        <Link to={`users/edit/${user.docId}`}>
                          <button className="btn btn-primary">Módosítás</button>
                        </Link>
                        <button
                          className="btn btn-danger"
                          data-id={user.docId}
                          onClick={handleDeleteOnClick}
                        >
                          Törlés
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
        {/* <table className="table table-striped">
          <thead>
            <tr>
              <th>Jogkör</th>
              <th>Darab</th>
            </tr>
          </thead>
          <tbody>
            {roles.map((role) => (
              <tr>
                <td>{role}</td>
              </tr>
            ))}
          </tbody>
        </table> */}
      </section>
    </>
  );
}

export default App;
