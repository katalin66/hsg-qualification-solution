/**
 * @jest-environment jsdom
 */

import {gradeIt} from '../autograder/utils/grader';
import * as path from 'path';
import React from 'react';

const MetaFunction = require('../autograder/utils/metaFunction');

import '@testing-library/jest-dom';
import {render, screen, waitFor} from '@testing-library/react';
import {findByLabelText, findByText, queryByLabelText, queryByText} from '@testing-library/dom';
import firebase from "firebase";
import userEvent from "@testing-library/user-event";

const {mockFirebase} = require('firestore-jest-mock');
const {mockWhere, mockGet, mockAdd, mockUpdate, mockSet } = require('firestore-jest-mock/mocks/firestore');

const solutionPath = path.join(__dirname, '..', 'src');

const mockData = [
  {
    fullName: "John Fox",
    isActive: true,
    role: "admin",
    email: "j.fox@vulpesmail.com"
  }, {
    fullName: "Peter Wolverine",
    role: "vendég",
    isActive: false,
    email: "p.wolverine@vulpesmail.com"
  }, {
    fullName: "Jane Bear",
    role: "regisztrált felhasználó",
    isActive: true,
    email: "j.bear@vulpesmail.com"
  }, {
    fullName: "Jane Fox",
    isActive: true,
    role: "regisztrált felhasználó",
    email: "jane.f@vulpesmail.com"
  }
];

let firebaseMock = mockFirebase({
  database: {
    "qualification-exam": mockData
  }
});

const functionName = 'App';
const correctlyNamedFn = new MetaFunction({pathToScan: solutionPath, functionName});
let App;

beforeAll(async () => {
  App = await correctlyNamedFn.getFn(['index.js', 'loadData.js']);
});

beforeEach(async () => {
  jest.clearAllMocks();

  window.history.pushState([], 'Title', '/users/new');
  render(<App/>);
});

gradeIt({
  title: "Should render validation message on blur for empty name field",
  score: 1,
  test: async function () {
    let field = queryByLabelText(document, /név/i);
    expect(field, `There isn't any 'input' in the form for label 'Név'`).not.toBeNull();

    userEvent.type(field, "");
    field.blur();

    let errorMessage = await findByText(document, /kitöltése kötelező/i);

    expect(
      errorMessage,
      `error message is not in the document`
    ).toBeInTheDocument();
  },
});

gradeIt({
  title: "Should render validation message on blur for empty email field",
  score: 1,
  test: async function () {
    let field = queryByLabelText(document, /email/i);
    expect(field, `There isn't any 'input' in the form for label 'Email'`).not.toBeNull();

    userEvent.type(field, "");
    field.blur();

    let errorMessage = await findByText(document, /kitöltése kötelező/i);

    expect(
      errorMessage,
      `error message is not in the document`
    ).toBeInTheDocument();
  },
});
