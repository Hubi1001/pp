import React from "react";
import DynamicForm from "dynamic-form-json";
import formDefinition from "./form.json";

function App() {
  const { name, description } = formDefinition as any;

  const handleSubmission = (values: any) => {
    console.log("Values from form:", values);
    alert("Dane przesłane (zobacz console.log w konsoli CodeSandbox)");
    // tu docelowo: fetch(...) do backendu (FastAPI/Flask) z values
  };

  return (
    <div style={{ padding: "1rem", fontFamily: "sans-serif" }}>
      <h1>{name}</h1>
      {description && <p>{description}</p>}
    </div>
  );
}

export default App;
