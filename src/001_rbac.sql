
CREATE DATABASE myExperimentalDb
WITH ENCODING 'UTF8'
-- Jeślo zainstalowane
-- LC_COLLATE 'pl_PL.UTF-8'
-- LC_CTYPE 'pl_PL.UTF-8'
TEMPLATE template0;

ALTER DATABASE myExperimentalDb SET search_path TO public, my_schema;
ALTER DATABASE myExperimentalDb SET statement_timeout = 0;
ALTER DATABASE myExperimentalDb SET lock_timeout = 0;
ALTER DATABASE myExperimentalDb SET idle_in_transaction_session_timeout = '1min';
ALTER DATABASE myExperimentalDb SET autovacuum_vacuum_scale_factor = 0.05;

DROP TABLE IF EXISTS Users CASCADE;
DROP TABLE IF EXISTS Users_Projects CASCADE;
DROP TABLE IF EXISTS Users_Roles CASCADE;
DROP TABLE IF EXISTS Roles CASCADE;
DROP TABLE IF EXISTS Roles_Group CASCADE;
DROP TABLE IF EXISTS Permissions CASCADE;
DROP TABLE IF EXISTS Permissions_Roles_Group CASCADE;
DROP TABLE IF EXISTS Projects CASCADE;
DROP TABLE IF EXISTS Forms CASCADE;
DROP TABLE IF EXISTS Projects_Forms CASCADE;
DROP TABLE IF EXISTS Form_Field CASCADE;
DROP TABLE IF EXISTS Observations CASCADE;
DROP TABLE IF EXISTS Experiments CASCADE;

CREATE TABLE Users (
    userID INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    affiliation VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Roles_Group (
    groupID INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    group_name VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Roles (
    roleID INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    groupID INTEGER NOT NULL REFERENCES Roles_Group(groupID) ON DELETE CASCADE,
    role_name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(groupID, role_name)
);

CREATE TABLE Users_Roles (
    roleID INTEGER NOT NULL REFERENCES Roles(roleID) ON DELETE CASCADE,
    userID INTEGER NOT NULL REFERENCES Users(userID) ON DELETE CASCADE,
    PRIMARY KEY (roleID, userID)
);

CREATE TABLE Permissions (
    permissionID INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    permission_name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Permissions_Roles_Group (
    groupID INTEGER NOT NULL REFERENCES Roles_Group(groupID) ON DELETE CASCADE,
    permissionID INTEGER NOT NULL REFERENCES Permissions(permissionID) ON DELETE CASCADE,
    PRIMARY KEY(groupID, permissionID)
);

CREATE TABLE Projects (
    projectID INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    ownerID INTEGER REFERENCES Users(userID) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'archive')),
    affiliation VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    metadata JSONB
);

CREATE TABLE Users_Projects (
    userID INTEGER NOT NULL REFERENCES Users(userID) ON DELETE CASCADE,
    projectID INTEGER NOT NULL REFERENCES Projects(projectID) ON DELETE CASCADE,
    PRIMARY KEY (userID, projectID)
);

CREATE TABLE Forms (
    formID INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    is_active  BOOLEAN NOT NULL DEFAULT TRUE,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    form_definition JSONB
);

CREATE TABLE Projects_Forms (
    projectID INTEGER NOT NULL REFERENCES Projects(projectID) ON DELETE CASCADE,
    formID INTEGER NOT NULL REFERENCES Forms(formID) ON DELETE CASCADE,
    PRIMARY KEY (projectID, formID)
);

CREATE TABLE Experiments (
    experimentID INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    projectID INTEGER NOT NULL REFERENCES Projects(projectID) ON DELETE CASCADE,
    authorID INTEGER REFERENCES Users(userID) ON DELETE SET NULL,
    status VARCHAR(50) DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'completed', 'archive')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    metadata JSONB
);

CREATE TABLE Observations (
    observationID INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    experimentID INTEGER NOT NULL REFERENCES Experiments(experimentID) ON DELETE CASCADE,
    registered_by INTEGER REFERENCES Users(userID) ON DELETE SET NULL,
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    details JSONB
	)

-- Ustalić, z czego ma się stworzyć definicja JSONB.....np UiSchema, może być odgórnie narzucone
-- albo osobne pole? Albo w ogole inna metoda i nie dotyczy
CREATE TABLE Form_Field(
	fieldID GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	name VARCHAR(255) NOT NULL,
	type VARCHAR(50) NOT NULL,
	required BOOLEAN NOT NULL DEFAULT TRUE,
	json_details JSONB,
	ui_details JSONB
	-- Przykładowe dane, mogą być w jsonb, mogą być wspólne w tabeli relacyjnej,
	-- ale mogą być niestandardowe w zależności do formularza, do zastanowienia
	-- format VARCHAR(50),
	-- description TEXT,
	-- min_value INT,
	-- max_value INT,
	-- options TEXT[]
)

CREATE TABLE Form_Fields_Mapping (
    formID INT REFERENCES Forms(formID) ON DELETE CASCADE,
    fieldID INT REFERENCES Form_Field(fieldID) ON DELETE CASCADE,
	position INT NOT NULL,
    PRIMARY KEY(formID, fieldID)
);

	
-- INDEXES--

----------Users-------------
CREATE INDEX idx_user_email ON Users(email)
CREATE INDEX idx_user_affiliation ON Users(affiliation)

----------Projects-------------
-- status, affiliation, updatedAt, createdAt => po czym będziemy często filtrować?
--  czy dużo projektów, opłaca sie zakładać BRIN (createdAt, updatedAt)
CREATE INDEX idx_projects_ownerID ON Projects(ownerID);
CREATE INDEX idx_projects_description_gin ON Projects USING GIN(to_tsvector('polish', description));
-- Tutaj B-Tree, czy lepiej GIN? Pewnie zależy jak złożone nazwy...
CREATE INDEX idx_projects_name_gin ON Projects USING GIN(to_tsvector('polish', name));
CREATE INDEX idx_project_metadata_gin ON Projects USING GIN(metadata);
-- Do zastanowienia, czy będzie na tyle dużo eksperymentów, czy warto
CREATE INDEX idx_project_created_brin ON Projects USING BRIN(created_at);
-- example do rozważenia
CREATE INDEX idx_projects_owner_active ON Projects(ownerID) WHERE status = 'active';

----------Experiments-------------
CREATE INDEX idx_exp_author ON Experiments(authorID);
CREATE INDEX idx_exp_status ON Experiments(status);
CREATE INDEX idx_exp_metadata_gin ON Experiments USING GIN(metadata);
-- Do zastanowienia, czy będzie na tyle dużo eksperymentów, czy warto
CREATE INDEX idx_exp_created_brin ON Experiments USING BRIN(created_at);

----------Observations-------------
CREATE INDEX idx_obs_registered ON Observations(registered_by);
CREATE INDEX idx_obs_date_brin ON Observations USING BRIN(registration_date);
CREATE INDEX idx_obs_details_gin ON Observations USING GIN(details);
-- Example jakby miałyby być często takie wyszukiwania
CREATE INDEX idx_obs_experiment_date ON Observations(experimentID, registration_date);

----------Forms-------------
CREATE INDEX idx_forms_description_gin ON Forms USING GIN(to_tsvector('polish', description));
-- Tutaj B-Tree, czy lepiej GIN? Zależy od tego w jaki sposób będziemy wyszukiwać formularzy...
-- Czy po pełnej nazwie/prefixie, czy po słowach w nazwie, frazach, analizie językowej
CREATE INDEX idx_forms_name_gin ON Forms USING GIN(to_tsvector('polish', name)); 
CREATE INDEX idx_forms_def_gin ON Forms USING GIN(form_definition);
-- Do rozważenia, będziemy filtrować po kategoriach?
-- No i chyba będą nas interesować aktywne formularze?
CREATE INDEX idx_forms_category ON Forms(category);
CREATE INDEX idx_form_active ON Forms(is_active) WHERE is_active=TRUE;

----------Form_Field-------------
CREATE INDEX idx_form_field_name ON Form_Field(name);
CREATE INDEX idx_form_field_type ON Form_Field(type);
CREATE INDEX idx_form_field_json_details_gin ON Form_Field USING GIN(details);

--  TRIGGERY -> na pewno 

CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at
BEFORE UPDATE ON Projects
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

-----------------UPDATE-FORM-DEFINITION-----------------

CREATE OR REPLACE FUNCTION generate_form_definition()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE Forms
    SET form_definition = (
        SELECT jsonb_build_object(
            'title', f.name,
            'jsonSchema', jsonb_build_object(
                'type', 'object',
                'properties', jsonb_object_agg(ff.name,
                    jsonb_build_object('type', ff.type) || COALESCE(ff.json_details, '{}')
                ),
                'required', jsonb_agg(ff.name) FILTER (WHERE ff.required)
            ),
            'uiSchema', jsonb_object_agg(ff.name, COALESCE(ff.ui_details, '{}'))
        )
        FROM Forms f
        JOIN Form_Fields_Map m ON f.formID = m.formID
        JOIN Form_Field ff ON m.fieldID = ff.fieldID
        WHERE f.formID = NEW.formID
        GROUP BY f.formID, f.name
    )
    WHERE formID = NEW.formID;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_generate_form_definition
AFTER INSERT OR DELETE OR UPDATE ON Form_Fields_Map
FOR EACH ROW EXECUTE FUNCTION generate_form_definition();







