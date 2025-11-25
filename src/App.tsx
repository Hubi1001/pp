import { useState } from "react";
import { JsonForms } from "@jsonforms/react";
import {
  materialRenderers,
  materialCells,
} from "@jsonforms/material-renderers";
import experimentSchema from "./jsonforms-schema.json";
import experimentExtendedSchema from "./experiment-schema-extended.json";
import personSchemaSimple from "./person-schema-simple.json";
import "./styles.css";

interface JsonFormsConfig {
  schema: any;
  uischema: any;
  data: any;
}

// Dostępne szablony
const TEMPLATES = {
  experiment: {
    name: "Formularz eksperymentu (podstawowy)",
    data: experimentSchema,
  },
  experimentExtended: {
    name: "Formularz eksperymentu (rozszerzony)",
    data: experimentExtendedSchema,
  },
  person: {
    name: "Formularz osoby (prosty)",
    data: personSchemaSimple,
  },
  custom: {
    name: "Własny schemat (pusty)",
    data: {
      schema: { type: "object", properties: {} },
      uischema: { type: "VerticalLayout", elements: [] },
      data: {},
    },
  },
};

function App() {
  // Wybrany szablon
  const [selectedTemplate, setSelectedTemplate] = useState<keyof typeof TEMPLATES>("experiment");

  // Stan dla edytora JSON Schema
  const [schemaInput, setSchemaInput] = useState<string>(
    JSON.stringify(experimentSchema.schema, null, 2)
  );
  const [uiSchemaInput, setUiSchemaInput] = useState<string>(
    JSON.stringify(experimentSchema.uischema, null, 2)
  );
  
  // Stan dla aktualnego konfiguracji formularza
  const [currentConfig, setCurrentConfig] = useState<JsonFormsConfig>({
    schema: experimentSchema.schema,
    uischema: experimentSchema.uischema,
    data: experimentSchema.data,
  });

  // Stan dla danych formularza
  const [formData, setFormData] = useState<any>(experimentSchema.data);

  // Błędy parsowania
  const [parseError, setParseError] = useState<string>("");

  // Tryb widoku: 'editor' lub 'form'
  const [viewMode, setViewMode] = useState<"editor" | "form">("editor");

  // Stan wysyłania do bazy
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveMessage, setSaveMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleTemplateChange = (templateKey: keyof typeof TEMPLATES) => {
    const template = TEMPLATES[templateKey];
    setSelectedTemplate(templateKey);
    setSchemaInput(JSON.stringify(template.data.schema, null, 2));
    setUiSchemaInput(JSON.stringify(template.data.uischema, null, 2));
    setCurrentConfig({
      schema: template.data.schema,
      uischema: template.data.uischema,
      data: template.data.data,
    });
    setFormData(template.data.data);
    setParseError("");
  };

  const handleApplySchema = () => {
    try {
      const parsedSchema = JSON.parse(schemaInput);
      const parsedUiSchema = JSON.parse(uiSchemaInput);
      
      // Zainicjuj dane początkowe
      const initialData = generateInitialData(parsedSchema);
      
      setCurrentConfig({
        schema: parsedSchema,
        uischema: parsedUiSchema,
        data: initialData,
      });
      setFormData(initialData);
      setParseError("");
      setViewMode("form");
    } catch (error) {
      setParseError(`Błąd parsowania JSON: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  const generateInitialData = (schema: any): any => {
    if (!schema || !schema.properties) return {};
    
    const data: any = {};
    Object.keys(schema.properties).forEach((key) => {
      const prop = schema.properties[key];
      if (prop.type === "string") {
        data[key] = "";
      } else if (prop.type === "number" || prop.type === "integer") {
        data[key] = null;
      } else if (prop.type === "boolean") {
        data[key] = false;
      } else if (prop.type === "object") {
        data[key] = generateInitialData(prop);
      }
    });
    return data;
  };

  const handleFormDataChange = (data: any) => {
    setFormData(data);
  };

  const handleSaveToDatabase = async () => {
    setIsSaving(true);
    setSaveMessage(null);

    // Bazowy URL API (ustawiany przez Vite: VITE_API_BASE), domyślnie pusty (relatywny)
    // @ts-ignore: import.meta may not be typed in some TS configs, cast to any
    const API_BASE = ((import.meta as any)?.env?.VITE_API_BASE as string) || "";

    // Określ endpoint na podstawie konfiguracji (MongoDB endpoint)
    const endpoint = `${API_BASE}/api/mongodb/save`;

    try {

      // Określ nazwę kolekcji na podstawie szablonu
      let collectionName = "form_submissions";

      if (selectedTemplate === "experiment") {
        collectionName = "experiments";
      } else if (selectedTemplate === "experimentExtended") {
        collectionName = "experiments_extended";
      } else if (selectedTemplate === "person") {
        collectionName = "persons";
      }

      const payload = {
        collection: collectionName,
        data: {
          formType: selectedTemplate,
          ...formData,
          schema: currentConfig.schema,
        },
      };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setSaveMessage({
          type: "success",
          text: `✅ ${result.message || "Dane zostały zapisane do bazy danych"}`,
        });
      } else {
        setSaveMessage({
          type: "error",
          text: `❌ ${result.message || "Błąd zapisu do bazy danych"}`,
        });
      }
    } catch (error: any) {
      console.error("Błąd połączenia z serwerem:", error);
      const errMsg = error && error.message ? error.message : String(error);
      setSaveMessage({
        type: "error",
        text: `❌ Nie można połączyć się z serwerem pod adresem ${endpoint}. Szczegóły: ${errMsg}`,
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="app">
      <header style={{ marginBottom: "2rem" }}>
        <h1>Generator formularzy JSON Forms</h1>
        <p>Wybierz szablon lub podaj własny schemat JSON Schema</p>
        
        <div style={{ marginTop: "1rem", marginBottom: "1rem" }}>
          <label style={{ fontWeight: "600", marginRight: "0.5rem" }}>
            Szablon:
          </label>
          <select
            value={selectedTemplate}
            onChange={(e) => handleTemplateChange(e.target.value as keyof typeof TEMPLATES)}
            style={{
              padding: "0.5rem",
              borderRadius: "4px",
              border: "1px solid #ccc",
              fontSize: "14px",
            }}
          >
            {(Object.keys(TEMPLATES) as Array<keyof typeof TEMPLATES>).map((key) => (
              <option key={key} value={key}>
                {TEMPLATES[key].name}
              </option>
            ))}
          </select>
        </div>
        
        <div style={{ marginTop: "1rem" }}>
          <button
            onClick={() => setViewMode("editor")}
            style={{
              marginRight: "0.5rem",
              padding: "0.5rem 1rem",
              background: viewMode === "editor" ? "#1976d2" : "#e0e0e0",
              color: viewMode === "editor" ? "white" : "black",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Edytor schematu
          </button>
          <button
            onClick={() => setViewMode("form")}
            style={{
              padding: "0.5rem 1rem",
              background: viewMode === "form" ? "#1976d2" : "#e0e0e0",
              color: viewMode === "form" ? "white" : "black",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
            disabled={!currentConfig.schema}
          >
            Formularz
          </button>
        </div>
      </header>

      {viewMode === "editor" ? (
        <div className="schema-editor">
          <div style={{ 
            padding: "1rem", 
            background: "#e3f2fd", 
            borderRadius: "6px",
            marginBottom: "1rem",
            fontSize: "14px"
          }}>
            <strong>Aktualny szablon:</strong> {TEMPLATES[selectedTemplate].name}
            <br />
            <small>Możesz edytować schemat poniżej i wygenerować własny formularz</small>
          </div>
          
          <div style={{ marginBottom: "1rem" }}>
            <h3>JSON Schema</h3>
            <textarea
              value={schemaInput}
              onChange={(e) => setSchemaInput(e.target.value)}
              style={{
                width: "100%",
                minHeight: "300px",
                fontFamily: "monospace",
                padding: "1rem",
                fontSize: "14px",
              }}
              placeholder="Wprowadź JSON Schema..."
            />
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <h3>UI Schema (opcjonalnie)</h3>
            <textarea
              value={uiSchemaInput}
              onChange={(e) => setUiSchemaInput(e.target.value)}
              style={{
                width: "100%",
                minHeight: "200px",
                fontFamily: "monospace",
                padding: "1rem",
                fontSize: "14px",
              }}
              placeholder="Wprowadź UI Schema..."
            />
          </div>

          {parseError && (
            <div
              style={{
                padding: "1rem",
                background: "#ffebee",
                color: "#c62828",
                borderRadius: "4px",
                marginBottom: "1rem",
              }}
            >
              {parseError}
            </div>
          )}

          <button
            onClick={handleApplySchema}
            style={{
              padding: "0.75rem 2rem",
              background: "#1976d2",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: "bold",
            }}
          >
            Wygeneruj formularz
          </button>
        </div>
      ) : (
        <div className="form-container">
          <div style={{ 
            padding: "1rem", 
            background: "#e8f5e9", 
            borderRadius: "6px",
            marginBottom: "1.5rem",
            fontSize: "14px"
          }}>
            <strong>Formularz:</strong> {TEMPLATES[selectedTemplate].name}
            <br />
            <small>Wypełnij pola formularza - dane w formacie JSON pojawią się poniżej</small>
          </div>

          <div style={{ marginBottom: "2rem" }}>
            <JsonForms
              schema={currentConfig.schema}
              uischema={currentConfig.uischema}
              data={formData}
              renderers={materialRenderers}
              cells={materialCells}
              onChange={({ data }) => handleFormDataChange(data)}
            />
          </div>

          <div style={{ marginTop: "2rem" }}>
            <h3>Dane formularza (JSON)</h3>
            <div style={{ marginBottom: "0.5rem", fontSize: "14px", color: "#666" }}>
              Te dane możesz wysłać do bazy danych PostgreSQL
            </div>
            
            {saveMessage && (
              <div
                style={{
                  padding: "1rem",
                  marginBottom: "1rem",
                  borderRadius: "6px",
                  background: saveMessage.type === "success" ? "#d4edda" : "#f8d7da",
                  color: saveMessage.type === "success" ? "#155724" : "#721c24",
                  border: `1px solid ${saveMessage.type === "success" ? "#c3e6cb" : "#f5c6cb"}`,
                }}
              >
                {saveMessage.text}
              </div>
            )}

            <button
              onClick={handleSaveToDatabase}
              disabled={isSaving}
              style={{
                padding: "0.75rem 2rem",
                background: isSaving ? "#ccc" : "#28a745",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: isSaving ? "not-allowed" : "pointer",
                fontSize: "16px",
                fontWeight: "bold",
                marginBottom: "1rem",
              }}
            >
              {isSaving ? "Zapisywanie..." : "💾 Zapisz do bazy danych"}
            </button>

            <pre
              style={{
                background: "#f5f5f5",
                padding: "1rem",
                borderRadius: "6px",
                overflowX: "auto",
                fontSize: "14px",
                border: "1px solid #ddd",
              }}
            >
              {JSON.stringify(formData, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
