import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import userEvent from '@testing-library/user-event';
import App from '../App';
import RecipesAppProvider from '../context/RecipesAppProvider';
import renderWithRouter from '../renderWithRouterAndRedux';
import oneMeal from '../../cypress/mocks/oneMeal';
import drinks from '../../cypress/mocks/drinks';

const searchTopBtn = 'search-top-btn';
const searchInput = 'search-input';
const searchBtn = 'exec-search-btn';
const nameSearchRadio = 'name-search-radio';
const firstLetter = 'first-letter-search-radio';
const ingredient = 'ingrediente-search-radio';

describe('Testa o componente SearchBar', () => {
  beforeEach(() => {
    global.fetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue(oneMeal),
    });
  });

  afterEach(() => {
    global.fetch.mockClear();
  });

  test('1-Testa a pesquisa pelo nome de um prato', async () => {
    const { history } = renderWithRouter(
      <RecipesAppProvider>
        <App />
      </RecipesAppProvider>,
    );
    act(() => {
      history.push('/meals');
    });

    const searchbtn = screen.getByTestId(searchTopBtn);
    act(() => {
      userEvent.click(searchbtn);
    });
    const search = screen.getByTestId(searchInput);
    await waitFor(() => expect(search).toBeInTheDocument());

    const searchInp = screen.getByTestId(searchInput);
    const searchButton = screen.getByTestId(searchBtn);
    const nameRadio = screen.getByTestId(nameSearchRadio);

    act(() => {
      userEvent.type(searchInp, 'Corba');
      userEvent.click(nameRadio);
      userEvent.click(searchButton);
    });
    await waitFor(() => {
      expect(history.location.pathname).toEqual('/meals/52977');
    }, {
      timeout: 5000,
    });
    const img = await screen.findByTestId('recipe-photo');
    const title = await screen.findByTestId('recipe-title');

    expect(img).toBeInTheDocument();
    expect(title).toBeInTheDocument();
  });
});
describe('Testa o componente SearchBar-part2', () => {
  beforeEach(() => {
    global.fetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue(drinks),
    });
  });
  afterEach(() => {
    global.fetch.mockClear();
  });

  test('2-Testa a pesquisa pelo nome de uma bebida', async () => {
    const { history } = renderWithRouter(
      <RecipesAppProvider>
        <App />
      </RecipesAppProvider>,
    );
    act(() => {
      history.push('/drinks');
    });
    const searchIcon = screen.getByTestId(searchTopBtn);
    act(() => {
      userEvent.click(searchIcon);
    });
    const searchInp = screen.getByTestId(searchInput);
    const searchButton = screen.getByTestId(searchBtn);
    const ingredients = screen.getByTestId(ingredient);

    act(() => {
      userEvent.type(searchInp, 'Amaretto Tea');
      userEvent.click(ingredients);
      userEvent.click(searchButton);
    });

    await waitFor(() => {
      expect(history.location.pathname).toEqual('/drinks/11029');
    }, {
      timeout: 5000,
    });
    const img = await screen.findByTestId('recipe-photo');
    const title = await screen.findByTestId('recipe-title');

    expect(img).toBeInTheDocument();
    expect(title).toBeInTheDocument();
  });

  test('3-Testa a pesquisa por 1a letra', async () => {
    const { history } = renderWithRouter(
      <RecipesAppProvider>
        <App />
      </RecipesAppProvider>,
    );
    act(() => {
      history.push('/meals');
    });
    const searchIcon = screen.getByTestId(searchTopBtn);
    act(() => {
      userEvent.click(searchIcon);
    });
    const searchInp = screen.getByTestId(searchInput);
    const searchButton = screen.getByTestId(searchBtn);
    const letter = screen.getByTestId(firstLetter);

    act(() => {
      userEvent.type(searchInp, 'a');
      userEvent.click(letter);
      userEvent.click(searchButton);
    });

    await waitFor(() => {
      const firsItemName = screen.getByTestId('0-card-img');
      expect(firsItemName).toBeInTheDocument();
    }, {
      timeout: 5000,
    });
  });
});
describe('Testa o componente SearchBar-part3', () => {
  beforeEach(() => {
    global.fetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue({
        meals: null,
      }),
    });
  });
  afterEach(() => {
    global.fetch.mockClear();
  });

  test('4-Testa se aparece o alerta ao digitar mais de 1 letra, ao selecionar o radio first letter', async () => {
    jest.spyOn(window, 'alert').mockImplementation(() => {});

    const { history } = renderWithRouter(
      <RecipesAppProvider>
        <App />
      </RecipesAppProvider>,
    );
    act(() => {
      history.push('/meals');
    });
    const searchIcon = screen.getByTestId(searchTopBtn);
    act(() => {
      userEvent.click(searchIcon);
    });
    const searchInp = screen.getByTestId(searchInput);
    const searchButton = screen.getByTestId(searchBtn);
    const letter = screen.getByTestId(firstLetter);

    act(() => {
      userEvent.type(searchInp, 'angela');
      userEvent.click(letter);
      userEvent.click(searchButton);
    });

    expect(global.alert).toBeCalled();
  });
});
