/**
 * @jest-environment jsdom
 */

import {gradeIt} from '../autograder/utils/grader';
import * as path from 'path';
import React from 'react';

const MetaFunction = require('../autograder/utils/metaFunction');

import '@testing-library/jest-dom';
import {act, render, screen, waitFor} from '@testing-library/react';
import {findByLabelText, queryByText} from '@testing-library/dom';
import firebase from "firebase";
import userEvent from "@testing-library/user-event";

const {mockFirebase} = require('firestore-jest-mock');
const {mockWhere, mockCollection, mockGet, mockDelete} = require('firestore-jest-mock/mocks/firestore');

const solutionPath = path.join(__dirname, '..', 'src');

const mockData = [
  {
    fullName: "John Fox",
    isActive: true,
    role: "admin",
    email: "j.fox@vulpesmail.com",
    id: 1
  }, {
    fullName: "Peter Wolverine",
    role: "vendég",
    isActive: false,
    email: "p.wolverine@vulpesmail.com",
    id: 2
  },
  {
    fullName: "Octavius Cottham",
    role: "vendég",
    isActive: true,
    email: "ocottham6@bbc.co.uk",
    id: 3
  },
  {
    fullName: "Jane Bear",
    role: "regisztrált felhasználó",
    isActive: true,
    email: "j.bear@vulpesmail.com",
    id: 4
  }, {
    fullName: "Jane Fox",
    isActive: true,
    role: "regisztrált felhasználó",
    email: "jane.f@vulpesmail.com",
    id: 5
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

  window.history.pushState([], 'Title', '/');
  await act(async () => {
    render(<App/>);
  });
});

gradeIt({
  title: 'Should have delete buttons in the table with the correct text',
  score: 1,
  test: async function () {

    await waitFor(async () => {

      const deleteButtons = await screen.findAllByText(/Törlés/i);
      expect(deleteButtons).toHaveLength(5);
    });
  }
});

gradeIt({
  title: 'Deletion from firebase should remove item from db',
  score: 1,
  test: async function () {
    let deleteButton;

    await waitFor(async () => {

      const deleteButtons = await screen.findAllByText(/Törlés/i);
      expect(deleteButtons).toHaveLength(5);
      deleteButton = deleteButtons[0];
    });

    await act(async () => {
      userEvent.click(deleteButton);
    });

    await waitFor(async () => {

      expect(mockCollection).toHaveBeenCalledWith('qualification-exam');
      expect(mockGet).toHaveBeenCalled();
      expect(mockDelete).toHaveBeenCalled();

    })

  }
});


gradeIt({
  title: 'Should display the stats table correctly',
  score: 1,
  test: async function () {
    let table = document.querySelector('#stat-table');
    expect(table).toBeInTheDocument()
    let rows = document.querySelectorAll('#stat-table tr');
    let headers = document.querySelectorAll('#stat-table tr th');
    let cells = document.querySelectorAll('#stat-table tr td');

    waitFor(() => {
      expect(rows).toHaveLength(5);
      expect(headers).toHaveLength(2);
      expect(cells).toHaveLength(10);
    });
  }
})



