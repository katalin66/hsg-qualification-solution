/**
 * @jest-environment jsdom
 */

import { gradeIt } from '../autograder/utils/grader';
import * as path from 'path';
import React from 'react';
const MetaFunction = require('../autograder/utils/metaFunction');

import '@testing-library/jest-dom';
import {act, render, waitFor} from '@testing-library/react';
import { findByText, findByLabelText} from '@testing-library/dom';
import firebase from 'firebase';
import userEvent from "@testing-library/user-event";

const { mockFirebase } = require('firestore-jest-mock');

const mockData = [];
const firebaseMock = mockFirebase({
  database: {
    'qualification-exam': mockData
  }
});

const solutionPath = path.join(__dirname, '..', 'src');

const functionName = 'App';
const correctlyNamedFn = new MetaFunction({ pathToScan: solutionPath, functionName });
let App;

beforeAll(async () => {
  App = await correctlyNamedFn.getFn(['index.js', 'loadData.js']);
});

beforeEach(async () => {
  jest.clearAllMocks();

  window.history.pushState([], 'Title', '/');

  await act(async () => {
    render(<App />);
  });
});

gradeIt({
  title: 'Should have a "Szűrés jogkörre" non-empty select field with label on the form',
  score: 1,
  test: async function () {

    const select = await findByLabelText(document.body, /^szűrés jogkörre$/i);
    expect(select, `There isn't any 'select' found in the form for label 'Szűrés jogkörre'`).toBeInTheDocument();
    expect(select, `'select' has not empty initial value`).toHaveValue('');
  }
});

gradeIt({
  title: 'Should have a drop-down with filled options',
  score: 3,
  test: async function () {

    const select = await findByLabelText(document, /^szűrés jogkörre$/i);
    expect(select, `If 'Should have a "Szűrés jogkörre" field with label on the form' test case fails, then this will fail too`).toBeInTheDocument();

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
  title: 'Should have a "Aktív felhasználók" checkbox with label above the table',
  score: 1,
  test: async function () {
    const input = await findByLabelText(document, /^aktív felhasználók/i);
    expect(input, `There isn't any 'input' in the document for label 'Aktív felhasználók'`).toBeInTheDocument();
    expect(input, `'input' has not correct type`).toHaveAttribute('type', 'checkbox');
    expect(input, `'input' has not correct initial value`).not.toBeChecked();
  }
});

gradeIt({
  title: 'Should have a "Műveletek" column',
  score: 1,
  test: async function () {
    const actionsColumn = await findByText(document, /^műveletek/i);
    expect(actionsColumn).toBeVisible();
  }
});

gradeIt({
  title: 'Should have a "Darab" column',
  score: 1,
  test: async function () {
    const countsColumn = await findByText(document, /^darab/i);
    expect(countsColumn).toBeVisible();

    const summaryRow = await findByText(document, /^összesen/i);
    expect(summaryRow).toBeVisible();
  }
});

gradeIt({
  title: '"Új felhasználó" button redirects to /users/new',
  score: 1,
  test: async function () {

    const submits = document.querySelectorAll('button, a');
    let clickableButton;

    for (const button of submits) {
      if (button.nodeName == 'A') {
        if (button.text.trim().toLowerCase() == ('új felhasználó')) {
          clickableButton = button;
        }
      } else if (button.nodeName == 'BUTTON') {
        if (button.textContent.trim().toLowerCase() == ('új felhasználó')) {
          clickableButton = button;
        }
      }
    }

    userEvent.click(clickableButton);

    await waitFor(() => {
      expect(window.location.href, `Redirection to '/users/new' is not OK`).toMatch(/users\/new$/);
    });
  }
});
