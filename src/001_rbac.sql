-- ROLE & PERMISSIONS

CREATE TABLE role (
  role_id SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  description TEXT
);

CREATE TABLE permission (
  permission_id SERIAL PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,      -- np. 'experiment.read'
  description TEXT,
  scope TEXT NOT NULL CHECK (scope IN ('project','experiment'))
);

CREATE TABLE role_permission (
  role_id INT NOT NULL REFERENCES role(role_id) ON DELETE CASCADE,
  permission_id INT NOT NULL REFERENCES permission(permission_id) ON DELETE CASCADE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  PRIMARY KEY (role_id, permission_id)
);

CREATE TABLE user_account (
  user_id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  first_name TEXT,
  last_name TEXT
);

-- zakładam że masz już tabelę "project" i "experiment"
-- tutaj tylko relacje użytkownik-rola-projekt/eksperyment

CREATE TABLE user_project_role (
  user_id INT NOT NULL REFERENCES user_account(user_id) ON DELETE CASCADE,
  project_id INT NOT NULL REFERENCES project(project_id) ON DELETE CASCADE,
  role_id INT NOT NULL REFERENCES role(role_id) ON DELETE CASCADE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  PRIMARY KEY (user_id, project_id, role_id)
);

CREATE TABLE user_experiment_role (
  user_id INT NOT NULL REFERENCES user_account(user_id) ON DELETE CASCADE,
  experiment_id INT NOT NULL REFERENCES experiment(experiment_id) ON DELETE CASCADE,
  role_id INT NOT NULL REFERENCES role(role_id) ON DELETE CASCADE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  PRIMARY KEY (user_id, experiment_id, role_id)
);

-- ROLES
INSERT INTO role (name, description) VALUES
  ('admin', 'Pelny dostep do projektu i eksperymentow'),
  ('moderator', 'Zarzadzanie eksperymentami i obserwacjami'),
  ('badacz', 'Dodawanie obserwacji, podglad eksperymentow'),
  ('viewer', 'Tylko podglad danych');

-- PERMISSIONS
INSERT INTO permission (code, description, scope) VALUES
  ('project.read',            'Podglad projektu',                      'project'),
  ('project.manage_forms',    'Tworzenie i edycja formularzy',         'project'),
  ('experiment.read',         'Podglad eksperymentu',                  'experiment'),
  ('experiment.edit',         'Edycja metadanych eksperymentu',        'experiment'),
  ('experiment.manage_roles', 'Zarzadzanie rolami w eksperymencie',    'experiment'),
  ('observation.add',         'Dodawanie obserwacji',                  'experiment'),
  ('observation.edit',        'Edycja obserwacji',                     'experiment');

-- ADMIN ma wszystkie uprawnienia
INSERT INTO role_permission (role_id, permission_id)
SELECT r.role_id, p.permission_id
FROM role r CROSS JOIN permission p
WHERE r.name = 'admin';

-- MODERATOR: może zarządzać eksperymentami i obserwacjami
INSERT INTO role_permission (role_id, permission_id)
SELECT r.role_id, p.permission_id
FROM role r
JOIN permission p ON p.code IN ('experiment.read','experiment.edit','observation.add','observation.edit')
WHERE r.name = 'moderator';

-- BADACZ: może oglądać eksperyment i dodawać obserwacje
INSERT INTO role_permission (role_id, permission_id)
SELECT r.role_id, p.permission_id
FROM role r
JOIN permission p ON p.code IN ('experiment.read','observation.add')
WHERE r.name = 'badacz';

-- VIEWER: tylko podgląd
INSERT INTO role_permission (role_id, permission_id)
SELECT r.role_id, p.permission_id
FROM role r
JOIN permission p ON p.code IN ('experiment.read')
WHERE r.name = 'viewer';

-- prosta tabela na definicje formularzy (jeśli potrzebujesz po stronie DB)
CREATE TABLE form_definition (
  form_id SERIAL PRIMARY KEY,
  form_key TEXT UNIQUE NOT NULL,      -- np. 'experiment_registration'
  name TEXT NOT NULL,
  entity TEXT NOT NULL,               -- 'experiment'
  json_definition JSONB NOT NULL
);
