/**
 * @jest-environment jsdom
 */

import {gradeIt} from '../autograder/utils/grader';
import * as path from 'path';
import React from 'react';

const MetaFunction = require('../autograder/utils/metaFunction');

import '@testing-library/jest-dom';
import {render, screen, waitFor} from '@testing-library/react';
import {findByLabelText, findByText, queryByText} from '@testing-library/dom';
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
  title: 'Submitting the form should insert a document in firebase',
  score: 1,
  test: async function () {
    const button = await screen.findByRole('button', {name: /regisztráció/i});

    let [name, email] = document.querySelectorAll('input[type=text]');

    if ( ! email ) {
      email = document.querySelector('input[type=email]');
    }

    const roleSelect = document.querySelector('form select');

    userEvent.type(name, 'Gipsz Admin');
    userEvent.type(email, 'j.gipsz@vulpesmail.com');
    userEvent.selectOptions(roleSelect, ['admin']);

    userEvent.click(button);

    await waitFor(() => {
      expect(mockAdd, `Firestore add data has not requested`).toHaveBeenCalled();
      expect(mockUpdate, `Firestore update data has requested`).not.toHaveBeenCalled();
    });
  }
});

gradeIt({
  title: 'A success message should be displayed after submitting the form',
  score: 1,
  test: async function () {

    const button = await screen.findByRole('button', {name: /regisztráció/i});

    let [name, email] = document.querySelectorAll('input[type=text]');

    if ( ! email ) {
      email = document.querySelector('input[type=email]');
    }

    const roleSelect = document.querySelector('form select');

    userEvent.type(name, 'Gipsz Admin');
    userEvent.type(email, 'j.gipsz@vulpesmail.com');
    userEvent.selectOptions(roleSelect, ['admin']);

    userEvent.click(button);

    await waitFor(() => {
      expect(mockAdd, `Firestore add data has not requested`).toHaveBeenCalled();
      expect(mockUpdate, `Firestore update data has requested`).not.toHaveBeenCalled();
    });

    const alert = await findByText(document, /^sikeres/i);

    expect(alert).toBeInTheDocument();
  }
});

gradeIt({
  title: 'The form should be resetted after send',
  score: 1,
  test: async function () {

    const button = await screen.findByRole('button', {name: /regisztráció/i});

    let [name, email] = document.querySelectorAll('input[type=text]');

    if ( ! email ) {
      email = document.querySelector('input[type=email]');
    }

    const roleSelect = document.querySelector('form select');

    userEvent.type(name, 'Gipsz Admin');
    userEvent.type(email, 'j.gipsz@vulpesmail.com');
    userEvent.selectOptions(roleSelect, ['admin']);

    userEvent.click(button);

    await waitFor(() => {
      expect(mockAdd, `Firestore add data has not requested`).toHaveBeenCalled();
      expect(mockUpdate, `Firestore update data has requested`).not.toHaveBeenCalled();
    });

    const alert = await findByText(document, /^sikeres/i);

    expect(alert).toBeInTheDocument();

    expect(name.value).toEqual('');
    expect(email.value).toEqual('');
  }
});
