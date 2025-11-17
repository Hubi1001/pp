import { useState, ChangeEvent, FormEvent } from "react";
import formDefinitionJson from "./form.json";
import "./styles.css";

// === Typy ról i definicji formularza ===

type RoleName = "admin" | "moderator" | "badacz" | "viewer";

interface PermissionConfig {
  read: RoleName[];
  write: RoleName[];
}

interface FieldDefinition {
  id: string;
  label: string;
  placeholder?: string;
  type: "text" | "number" | "textarea" | "select" | "date";
  validationType: "string" | "number";
  value: any;
  row: number;
  col: number;
  colspan?: number;
  options?: { label: string; value: string }[];
  dbField?: string;
  permissions?: PermissionConfig;
}

interface FormDefinition {
  key: string;
  name: string;
  description?: string;
  entity: string;
  layout: {
    columns: number;
  };
  fields: FieldDefinition[];
}

// prosty currentUser - w prawdziwej apce przyjdzie z backendu/JWT
const currentUser = {
  id: 1,
  roles: ["moderator"] as RoleName[],
};

// === Helpery uprawnień ===

const hasIntersection = (needed: RoleName[], userRoles: RoleName[]): boolean =>
  needed.some((role) => userRoles.indexOf(role) !== -1);

const canReadField = (
  field: FieldDefinition,
  userRoles: RoleName[]
): boolean => {
  if (!field.permissions) return true;
  return hasIntersection(field.permissions.read, userRoles);
};

const canWriteField = (
  field: FieldDefinition,
  userRoles: RoleName[]
): boolean => {
  if (!field.permissions) return true;
  return hasIntersection(field.permissions.write, userRoles);
};

// === Render pojedynczego inputu ===

function renderInput(
  field: FieldDefinition,
  value: any,
  onChange: (value: any) => void,
  disabled: boolean
) {
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const rawValue = e.target.value;
    const newValue =
      field.type === "number"
        ? rawValue === ""
          ? ""
          : Number(rawValue)
        : rawValue;
    onChange(newValue);
  };

  const commonProps = {
    id: field.id,
    name: field.id,
    placeholder: field.placeholder,
    value: value ?? "",
    onChange: handleChange,
    disabled,
  };

  switch (field.type) {
    case "textarea":
      return <textarea {...commonProps} rows={3} />;
    case "select":
      return (
        <select {...commonProps}>
          {field.options?.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      );
    case "date":
      return <input {...commonProps} type="date" />;
    default:
      // text / number
      return (
        <input
          {...commonProps}
          type={field.type === "number" ? "number" : "text"}
        />
      );
  }
}

// === Główny komponent ===

function App() {
  const formDefinition = formDefinitionJson as FormDefinition;

  // wartości pól
  const [values, setValues] = useState<Record<string, any>>(() => {
    const initial: Record<string, any> = {};
    formDefinition.fields.forEach((f) => {
      initial[f.id] = f.value ?? "";
    });
    return initial;
  });

  // ostatnio wysłany payload (podgląd pod formularzem)
  const [lastPayload, setLastPayload] = useState<Record<string, any> | null>(
    null
  );

  // pola widoczne dla użytkownika (wg uprawnień)
  const visibleFields = formDefinition.fields.filter((f) =>
    canReadField(f, currentUser.roles)
  );

  const handleFieldChange = (field: FieldDefinition, newValue: any) => {
    if (!canWriteField(field, currentUser.roles)) return;
    setValues((prev) => ({ ...prev, [field.id]: newValue }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    // budowanie payloadu do backendu
    const payload = visibleFields.reduce((acc, field) => {
      const dbKey = field.dbField || field.id;
      acc[dbKey] = values[field.id];
      return acc;
    }, {} as Record<string, any>);

    console.log("FORM KEY:", formDefinition.key);
    console.log("PAYLOAD (do API):", payload);

    setLastPayload(payload);
  };

  return (
    <div className="app">
      <h1>{formDefinition.name}</h1>
      {formDefinition.description && <p>{formDefinition.description}</p>}

      <div className="current-user">
        Zalogowany jako: <strong>#{currentUser.id}</strong> (role:{" "}
        {currentUser.roles.join(", ")})
      </div>

      <form onSubmit={handleSubmit} className="form-grid">
        {visibleFields.map((field) => {
          const disabled = !canWriteField(field, currentUser.roles);
          const gridColumn = `${field.col} / span ${field.colspan || 1}`;
          const gridRow = `${field.row}`;

          return (
            <div
              key={field.id}
              className="form-field"
              style={{ gridColumn, gridRow }}
            >
              <label htmlFor={field.id}>{field.label}</label>
              {renderInput(
                field,
                values[field.id],
                (val) => handleFieldChange(field, val),
                disabled
              )}
              {field.dbField && (
                <div className="db-field-hint">
                  <small>DB: {field.dbField}</small>
                </div>
              )}
            </div>
          );
        })}

        <div className="form-actions">
          <button type="submit">Zapisz eksperyment</button>
        </div>
      </form>

      {lastPayload && (
        <pre
          style={{
            marginTop: "1rem",
            background: "#f5f5f5",
            padding: "1rem",
            fontSize: "0.85rem",
            borderRadius: "6px",
            overflowX: "auto",
          }}
        >
          {JSON.stringify(lastPayload, null, 2)}
        </pre>
      )}
    </div>
  );
}

export default App;
