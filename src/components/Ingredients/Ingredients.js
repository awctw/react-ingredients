import React, { useState, useCallback } from "react";

import IngredientForm from "./IngredientForm";
import IngredientList from "./IngredientList";
import Search from "./Search";

function Ingredients() {
  const [userIngredients, setUserIngredients] = useState([]);

  function addIngredientHandler(ingredient) {
    fetch(
      "https://r eact-ingredients-cd753-default-rtdb.firebaseio.com/ingredients.json",
      {
        method: "POST",
        body: JSON.stringify(ingredient),
        headers: { "Content-Type": "application/json" },
      }
    )
      .then((response) => {
        return response.json();
      })
      .then((responseData) => {
        setUserIngredients((prevIngredients) => [
          ...prevIngredients,
          {
            id: responseData.name,
            ...ingredient,
          },
        ]);
      });
  }

  function removeIngredientHandler(ingredientId) {
    setUserIngredients((prevIngredients) =>
      prevIngredients.filter(
        (prevIngredient) => prevIngredient.id !== ingredientId
      )
    );
  }

  const filteredIngredientsHandler = useCallback((filteredIngredients) => {
    setUserIngredients(filteredIngredients);
  }, []);

  return (
    <div className="App">
      <IngredientForm onAddIngredient={addIngredientHandler} />

      <section>
        <Search onLoadedIngredients={filteredIngredientsHandler} />
        <IngredientList
          ingredients={userIngredients}
          onRemoveItem={removeIngredientHandler}
        />
      </section>
    </div>
  );
}

export default Ingredients;
