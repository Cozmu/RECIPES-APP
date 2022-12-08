import PropTypes from 'prop-types';
import { useEffect, useState, useMemo } from 'react';
import RecipesAppContext from './RecipesAppContext';

function RecipesAppProvider({ children }) {
  const storeFav = JSON.parse(localStorage.getItem('favoriteRecipes'));
  const store = JSON.parse(localStorage.getItem('inProgressRecipes'));
  const [favorits, setFavorits] = useState(storeFav || []);
  const [btnSearch, setBtnSearch] = useState(false);
  const [recipes, setRecipes] = useState([]);
  const [inProgressRecipes,
    setInProgressRecipes] = useState(store || { drinks: {}, meals: {} });

  useEffect(() => {
    localStorage.setItem('favoriteRecipes', JSON.stringify(favorits));
  }, [favorits]);

  const values = useMemo(() => ({
    setInProgressRecipes,
    inProgressRecipes,
    btnSearch,
    setBtnSearch,
    recipes,
    setRecipes,
    setFavorits,
    favorits,
  }), [
    favorits,
    inProgressRecipes,
    btnSearch,
    recipes,
  ]);

  return (
    <RecipesAppContext.Provider value={ values }>
      {children}
    </RecipesAppContext.Provider>
  );
}

RecipesAppProvider.propTypes = {
  children: PropTypes.any,
}.isRequired;

export default RecipesAppProvider;
