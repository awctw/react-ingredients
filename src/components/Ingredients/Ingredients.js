import React, { useCallback, useReducer } from "react";

import IngredientForm from "./IngredientForm";
import IngredientList from "./IngredientList";
import Search from "./Search";
import ErrorModal from "../UI/ErrorModal";

const ingredientReducer = (currentIngredients, action) => {
  switch (action.type) {
    case "SET":
      return action.ingredients;
    case "ADD":
      return [...currentIngredients, action.ingredient];
    case "DELETE":
      return currentIngredients.filter((ing) => ing.id !== action.id);
    default:
      throw new Error("Should not get there!");
  }
};

const httpReducer = (currentHttpState, action) => {
  switch (action.type) {
    case "SEND":
      return { loading: true, error: null };
    case "RESPONSE":
      return { ...currentHttpState, loading: false };
    case "ERROR":
      return { loading: false, error: action.errorMessage };
    case "CLEAR":
      return { ...currentHttpState, error: null };
    default:
      throw new Error("Should not be reached!");
  }
};

function Ingredients() {
  const [userIngredients, dispatch] = useReducer(ingredientReducer, []);
  const [httpState, httpDispatch] = useReducer(httpReducer, {
    loading: false,
    error: null,
  });

  // const [userIngredients, setUserIngredients] = useState([]);
  // const [isLoading, setIsLoading] = useState(false);
  // const [error, setError] = useState(null);

  function addIngredientHandler(ingredient) {
    // setIsLoading(true);
    httpDispatch({ type: "SEND" });
    fetch(
      "https://react-ingredients-cd753-default-rtdb.firebaseio.com/ingredients.json",
      {
        method: "POST",
        body: JSON.stringify(ingredient),
        headers: { "Content-Type": "application/json" },
      }
    )
      .then((response) => {
        // setIsLoading(false);
        httpDispatch({ type: "RESPONSE" });

        return response.json();
      })
      .then((responseData) => {
        // setUserIngredients((prevIngredients) => [
        //   ...prevIngredients,
        //   {
        //     id: responseData.name,
        //     ...ingredient,
        //   },
        // ]);
        dispatch({
          type: "ADD",
          ingredient: { id: responseData.name, ...ingredient },
        });
      })
      .catch((err) => {
        httpDispatch({ type: "ERROR", errorMessage: "Something went wrong!" });
      });
  }

  function removeIngredientHandler(ingredientId) {
    // setIsLoading(true);
    httpDispatch({ type: "SEND" });

    fetch(
      `https://react-ingredients-cd753-default-rtdb.firebaseio.com/ingredients/${ingredientId}.json`,
      {
        method: "DELETE",
      }
    )
      .then((response) => {
        // setIsLoading(false);
        httpDispatch({ type: "RESPONSE" });

        // setUserIngredients((prevIngredients) =>
        //   prevIngredients.filter(
        //     (prevIngredient) => prevIngredient.id !== ingredientId
        //   )
        // );
        dispatch({ type: "DELETE", id: ingredientId });
      })
      .catch((err) => {
        // setError("Something went wrong!");
        // setIsLoading(false);
        httpDispatch({ type: "ERROR", errorMessage: "Something went wrong!" });
      });
  }

  function clearError() {
    // setError(null);
    httpDispatch({ type: "CLEAR" });
  }

  const filteredIngredientsHandler = useCallback((filteredIngredients) => {
    // setUserIngredients(filteredIngredients);
    dispatch({ type: "SET", ingredients: filteredIngredients });
  }, []);

  return (
    <div className="App">
      {httpState.error && (
        <ErrorModal onClose={clearError}>{httpState.error}</ErrorModal>
      )}
      <IngredientForm
        onAddIngredient={addIngredientHandler}
        loading={httpState.loading}
      />

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
