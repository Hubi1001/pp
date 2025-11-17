import React from "react";
import formDefinition from "./form.json";

function App() {
  const { name, description, fields } = formDefinition as any;

  return (
    <div style={{ padding: "1rem", fontFamily: "sans-serif" }}>
      <h1>{name}</h1>
      <p>{description}</p>

      <form>
        {fields.map((field: any, index: number) => (
          <div key={index} style={{ marginBottom: "10px" }}>
            <label>{field.label}</label>
            <input
              type={field.type === "number" ? "number" : "text"}
              placeholder={field.placeholder || ""}
              name={field.name}
            />
          </div>
        ))}
      </form>
    </div>
  );
}

export default App;
