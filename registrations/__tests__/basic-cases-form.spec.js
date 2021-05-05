/**
 * @jest-environment jsdom
 */

import {gradeIt} from '../autograder/utils/grader';
import * as path from 'path';
import React from 'react';

const MetaFunction = require('../autograder/utils/metaFunction');

import '@testing-library/jest-dom';
import {render, screen, waitFor} from '@testing-library/react';
import {findByLabelText, queryByText} from '@testing-library/dom';
import firebase from "firebase";
import userEvent from "@testing-library/user-event";

const {mockFirebase} = require('firestore-jest-mock');

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
  title: 'Should have a page title',
  score: 1,
  test: async function () {
    const h1s = document.querySelectorAll('h1');
    expect(h1s, `There isn't exactly 1 'h1' found in the document`).toHaveLength(1);
    expect(h1s[0], `'h1' is not in the document`).toBeInTheDocument();
    expect(h1s[0], `'h1' has not correct text`).toHaveTextContent(/^regisztráció$/i);
  }
});

gradeIt({
  title: 'Should have a form',
  score: 1,
  test: async function () {

    const forms = document.querySelectorAll('form');
    expect(forms, `There isn't exactly 1 'form' found in the document`).toHaveLength(1);
    expect(forms[0], `'form' is not in the document`).toBeInTheDocument();
  }
});

gradeIt({
  title: 'Should have a "Név" field with label on the form',
  score: 1,
  test: async function () {

    const input = await findByLabelText(document, /név/i);
    expect(input, `There isn't any 'input' in the form for label 'Név'`).toBeInTheDocument();
    expect(input, `'input' has not correct type`).toHaveAttribute('type', 'text');
    expect(input, `'input' has not empty initial value`).toHaveValue('');
  }
});

gradeIt({
  title: 'Should have an "Email" field with label on the form',
  score: 1,
  test: async function () {
    const input = await findByLabelText(document, /email/i);
    expect(input, `There isn't any 'input' in the form for label 'Email'`).toBeInTheDocument();
    expect(input, `'input' has not correct type`).toHaveAttribute('type', 'email');
    expect(input, `'input' has not empty initial value`).toHaveValue('');
  }
});

gradeIt({
  title: 'Should NOT have any validation message for "Név',
  score: 1,
  test: async function () {
    const input = await findByLabelText(document, /név/i);
    expect(input, `If 'Should have a "Név" field with label on the form', then this will fail too`).toBeInTheDocument();

    const inputContainer = input.parentNode;
    const messages = [
      'hiányzó érték'
    ];
    messages.forEach(message => {
      expect(queryByText(inputContainer, new RegExp(message, 'i')), `'${message}' validation message is set`).toBeNull();
    });
  }
});

gradeIt({
  title: 'Should NOT have any validation message for "Email',
  score: 1,
  test: async function () {
    const input = await findByLabelText(document, /email/i);
    expect(input, `If 'Should have a "Email" field with label on the form', then this will fail too`).toBeInTheDocument();

    const inputContainer = input.parentNode;
    const messages = [
      'hiányzó érték',
      'érvénytelen formátum'
    ];
    messages.forEach(message => {
      expect(queryByText(inputContainer, new RegExp(message, 'i')), `'${message}' validation message is set`).toBeNull();
    });
  }
});

gradeIt({
  title: 'Should have a "Jogkör" non-empty select field with label',
  score: 1,
  test: async function () {

    const select = await findByLabelText(document.body, /^jogkör$/i);
    expect(select, `There isn't any 'select' found in the form for label 'Jogkör'`).toBeInTheDocument();
    expect(select, `'select' has not empty initial value`).toHaveValue('');
  }
});

gradeIt({
  title: 'Should have a drop-down with filled options',
  score: 3,
  test: async function () {

    const select = await findByLabelText(document, /^jogkör$/i);
    expect(select, `If 'Should have a "jogkör" field with label on the form' test case fails, then this will fail too`).toBeInTheDocument();

    let notEmptyOptions = [];

    await waitFor(() => {
      notEmptyOptions = Array.from(select.querySelectorAll('option'));
      notEmptyOptions = notEmptyOptions.filter(option => option.value);

      expect(notEmptyOptions, `The select should have 3 options with non-empty values`).toHaveLength(3);
    });

    expect(notEmptyOptions[0], `'option[1]' has not correct value`).toHaveValue('admin');
    expect(notEmptyOptions[0], `'option[1]' has not correct text`).toHaveTextContent('admin');
    expect(notEmptyOptions[1], `'option[2]' has not correct value`).toHaveValue('vendég');
    expect(notEmptyOptions[1], `'option[2]' has not correct text`).toHaveTextContent('vendég');
    expect(notEmptyOptions[2], `'option[3]' has not correct value`).toHaveValue('regisztrált felhasználó');
    expect(notEmptyOptions[2], `'option[3]' has not correct text`).toHaveTextContent('regisztrált felhasználó');
  }
});

gradeIt({
  title: 'Should have a "Aktív" checkbox with label above the table',
  score: 1,
  test: async function () {
    const input = await findByLabelText(document, /^aktív/i);
    expect(input, `There isn't any 'input' in the document for label 'Aktív'`).toBeInTheDocument();
    expect(input, `'input' has not correct type`).toHaveAttribute('type', 'checkbox');
    expect(input, `'input' has not correct initial value`).not.toBeChecked();
  }
});


gradeIt({
  title: 'Should have a "Regisztráció" submit button on the form',
  score: 1,
  test: async function () {

    const buttons = document.querySelectorAll('button[type=submit], input[type=submit]');
    expect(buttons, `There isn't exactly 1 'submit' found in the form`).toHaveLength(1);
    expect(buttons[0], `'submit' is not in the form`).toBeInTheDocument();
    expect(buttons[0], `'submit' has not correct text`).toHaveTextContent(/regisztráció/i);
  }
});

