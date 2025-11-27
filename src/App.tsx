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

  // Kreator pól dla szablonu custom
  const [newFieldName, setNewFieldName] = useState<string>("");
  const [newFieldType, setNewFieldType] = useState<string>("string");
  const [newFieldWidget, setNewFieldWidget] = useState<string>("text");

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
      
      // Debug: log schema to console
      console.log('handleApplySchema - parsedSchema:', parsedSchema);
      console.log('handleApplySchema - parsedUiSchema:', parsedUiSchema);
      
      // Zainicjuj dane początkowe
      const initialData = generateInitialData(parsedSchema);
      console.log('handleApplySchema - initialData:', initialData);
      
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

  const removeCustomField = (fieldName: string) => {
    setParseError("");
    try {
      const parsedSchema = JSON.parse(schemaInput);
      const parsedUiSchema = JSON.parse(uiSchemaInput);

      if (parsedSchema.properties && parsedSchema.properties[fieldName]) {
        delete parsedSchema.properties[fieldName];
      }

      // Usuń kontrolkę z uischema
      if (parsedUiSchema.elements && Array.isArray(parsedUiSchema.elements)) {
        parsedUiSchema.elements = parsedUiSchema.elements.filter((el: any) => el.scope !== `#/properties/${fieldName}`);
      }

      // Zaktualizuj dane formularza
      const newData = { ...(currentConfig.data || {}) };
      delete newData[fieldName];

      setSchemaInput(JSON.stringify(parsedSchema, null, 2));
      setUiSchemaInput(JSON.stringify(parsedUiSchema, null, 2));
      setFormData(newData);
      setCurrentConfig({ schema: parsedSchema, uischema: parsedUiSchema, data: newData });
    } catch (err) {
      setParseError('Błąd podczas usuwania pola: ' + (err instanceof Error ? err.message : String(err)));
    }
  };

    const addCustomField = () => {
      setParseError("");
      if (!newFieldName.match(/^[a-zA-Z_][a-zA-Z0-9_]*$/)) {
        setParseError('Nazwa pola musi zaczynać się od litery lub podkreślenia i zawierać tylko znaki alfanumeryczne oraz _');
        return;
      }

      try {
        const parsedSchema = JSON.parse(schemaInput);
        const parsedUiSchema = JSON.parse(uiSchemaInput);

        if (!parsedSchema.properties) parsedSchema.properties = {};

        // Dodaj właściwość z mapowaniem widgetów
        let defaultValue: any = null;
        const prop: any = {};

        if (newFieldType === 'string') {
          prop.type = 'string';
          defaultValue = '';
        } else if (newFieldType === 'number') {
          prop.type = 'number';
          defaultValue = null;
        } else if (newFieldType === 'integer') {
          prop.type = 'integer';
          defaultValue = null;
        } else if (newFieldType === 'boolean') {
          prop.type = 'boolean';
          defaultValue = false;
        } else if (newFieldType === 'object') {
          prop.type = 'object';
          prop.properties = {};
          defaultValue = {};
        } else {
          prop.type = 'string';
          defaultValue = '';
        }

        // Dostosuj właściwość wg wybranego widgetu
        if (newFieldWidget === 'date') {
          // JSON Schema: użyj string + format: date
          prop.type = 'string';
          prop.format = 'date';
        } else if (newFieldWidget === 'textarea') {
          // zostaw string, UI-schema ustawi textarea
          prop.type = prop.type || 'string';
        } else if (newFieldWidget === 'checkbox') {
          prop.type = 'boolean';
        }

        parsedSchema.properties[newFieldName] = prop;

        // Zaktualizuj uischema (dodaj kontrolkę na końcu)
        if (!parsedUiSchema.elements) parsedUiSchema.elements = [];
        const control: any = {
          type: 'Control',
          scope: `#/properties/${newFieldName}`,
        };
        if (newFieldWidget === 'textarea') control.options = { multi: true };
        if (newFieldWidget === 'date') control.options = { format: 'date' };
        parsedUiSchema.elements.push(control);

        // Zaktualizuj formData (weź obecną konfigurację jako źródło)
        const currentData = { ...(currentConfig.data || {}) };
        currentData[newFieldName] = defaultValue;

        setSchemaInput(JSON.stringify(parsedSchema, null, 2));
        setUiSchemaInput(JSON.stringify(parsedUiSchema, null, 2));
        setFormData(currentData);
        setCurrentConfig({ schema: parsedSchema, uischema: parsedUiSchema, data: currentData });

        // Wyczyść pola kreatora
        setNewFieldName('');
        setNewFieldType('string');
        setNewFieldWidget('text');
      } catch (err) {
        setParseError('Błąd podczas dodawania pola: ' + (err instanceof Error ? err.message : String(err)));
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

    try {
      // Określ endpoint na podstawie szablonu (SQLite endpoints)
      let endpoint = "";
      let payload: any = {};

      if (selectedTemplate === "experiment") {
        endpoint = `${API_BASE}/api/experiments`;
        payload = {
          project_id: formData.project_id || "",
          name: formData.name || "",
          author_id: formData.author_id || null,
          form_id: formData.form_id || "",
          description: formData.description || "",
          details: formData.details || "",
          status: formData.status || "new",
        };
      } else if (selectedTemplate === "experimentExtended") {
        endpoint = `${API_BASE}/api/experiments/extended`;
        payload = {
          project_id: formData.project_id || "",
          name: formData.name || "",
          author_id: formData.author_id || null,
          form_id: formData.form_id || "",
          description: formData.description || "",
          details: formData.details || "",
          status: formData.status || "new",
          start_date: formData.start_date || null,
          end_date: formData.end_date || null,
          priority: formData.priority || null,
          budget: formData.budget || null,
          team_members: formData.team_members || null,
          tags: formData.tags || null,
          is_confidential: formData.is_confidential || false,
          laboratory: formData.laboratory || null,
        };
      } else if (selectedTemplate === "person") {
        endpoint = `${API_BASE}/api/persons`;
        payload = {
          firstName: formData.firstName || "",
          lastName: formData.lastName || "",
          age: formData.age || null,
          email: formData.email || null,
        };
      } else {
        // Dla innych formularzy użyj uniwersalnego endpointu
        endpoint = `${API_BASE}/api/forms/submit`;
        payload = {
          formType: selectedTemplate,
          data: formData,
          schema: currentConfig.schema,
        };
      }

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      // Bezpiecznie spróbuj odczytać odpowiedź — nie zakładaj, że zawsze jest JSON
      const text = await response.text();
      let result: any = null;

      if (text) {
        try {
          result = JSON.parse(text);
        } catch (err) {
          // Jeśli odpowiedź nie jest poprawnym JSON, zachowaj surowy tekst
          result = { success: false, message: text };
        }
      } else {
        result = { success: response.ok, message: response.statusText || "Brak treści odpowiedzi" };
      }

      if (response.ok && result && result.success) {
        setSaveMessage({
          type: "success",
          text: `✅ ${result.message || "Dane zostały zapisane do bazy danych"}`,
        });
      } else {
        setSaveMessage({
          type: "error",
          text: `❌ ${result && result.message ? result.message : "Błąd zapisu do bazy danych"}`,
        });
      }
    } catch (error: any) {
      console.error("Błąd połączenia z serwerem:", error);
      const errMsg = error && error.message ? error.message : String(error);
      setSaveMessage({
        type: "error",
        text: `❌ Nie można połączyć się z serwerem. Szczegóły: ${errMsg}`,
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
            {selectedTemplate === 'custom' && (
              <div style={{ marginBottom: '0.75rem', padding: '0.75rem', background: '#fffde7', borderRadius: 6 }}>
                <strong>Dodaj pole (custom):</strong>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', alignItems: 'center' }}>
                  <input
                    value={newFieldName}
                    onChange={(e) => setNewFieldName(e.target.value)}
                    placeholder="nazwa pola"
                    style={{ padding: '0.4rem', borderRadius: 4, border: '1px solid #ccc' }}
                  />
                  <select value={newFieldType} onChange={(e) => setNewFieldType(e.target.value)} style={{ padding: '0.4rem', borderRadius: 4 }}>
                    <option value="string">string</option>
                    <option value="number">number</option>
                    <option value="integer">integer</option>
                    <option value="boolean">boolean</option>
                    <option value="object">object</option>
                  </select>
                  <select value={newFieldWidget} onChange={(e) => setNewFieldWidget(e.target.value)} style={{ padding: '0.4rem', borderRadius: 4 }}>
                    <option value="text">Text</option>
                    <option value="textarea">Textarea</option>
                    <option value="date">Date</option>
                    <option value="checkbox">Checkbox</option>
                  </select>
                  <button onClick={addCustomField} style={{ padding: '0.4rem 0.8rem', background: '#1976d2', color: 'white', border: 'none', borderRadius: 4 }}>Dodaj</button>
                </div>
                <div style={{ marginTop: '0.5rem', fontSize: '12px', color: '#666' }}>Po dodaniu pola możesz kliknąć "Wygeneruj formularz"</div>

                {/* Lista aktualnych pól i możliwość usunięcia */}
                <div style={{ marginTop: '0.75rem' }}>
                  <strong>Aktualne pola:</strong>
                  <div style={{ marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    {(() => {
                      try {
                        const parsed = JSON.parse(schemaInput);
                        const keys = parsed.properties ? Object.keys(parsed.properties) : [];
                        if (keys.length === 0) return <div style={{ color: '#666' }}>Brak pól</div>;
                        return keys.map((k: string) => (
                          <div key={k} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff', padding: '0.4rem', borderRadius: 4, border: '1px solid #eee' }}>
                            <div style={{ fontSize: '14px' }}>{k}</div>
                            <div>
                              <button onClick={() => removeCustomField(k)} style={{ padding: '0.3rem 0.6rem', background: '#e53935', color: 'white', border: 'none', borderRadius: 4 }}>Usuń</button>
                            </div>
                          </div>
                        ));
                      } catch (e) {
                        return <div style={{ color: '#c62828' }}>Błąd odczytu pól</div>;
                      }
                    })()}
                  </div>
                </div>
              </div>
            )}
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
