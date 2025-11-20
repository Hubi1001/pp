-- Schemat bazy danych dla formularzy eksperymentów

-- Tabela: Eksperymenty (podstawowe informacje)
CREATE TABLE IF NOT EXISTS eksperymenty (
    id SERIAL PRIMARY KEY,
    project_id VARCHAR(255),
    name VARCHAR(255) NOT NULL,
    author_id INTEGER,
    form_id VARCHAR(255),
    description TEXT,
    details JSONB,
    status VARCHAR(50) DEFAULT 'new',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela: Eksperymenty rozszerzone (wszystkie pola)
CREATE TABLE IF NOT EXISTS eksperymenty_extended (
    id SERIAL PRIMARY KEY,
    project_id VARCHAR(255),
    name VARCHAR(255) NOT NULL,
    author_id INTEGER,
    form_id VARCHAR(255),
    description TEXT,
    details JSONB,
    status VARCHAR(50) DEFAULT 'new',
    start_date DATE,
    end_date DATE,
    priority VARCHAR(50),
    budget DECIMAL(10, 2),
    team_members JSONB,
    tags TEXT[],
    is_confidential BOOLEAN DEFAULT FALSE,
    laboratory JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela: Osoby (dla prostego formularza)
CREATE TABLE IF NOT EXISTS osoby (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    age INTEGER,
    email VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela: Formularze ogólne (dla dowolnych schematów)
CREATE TABLE IF NOT EXISTS form_submissions (
    id SERIAL PRIMARY KEY,
    form_type VARCHAR(100) NOT NULL,
    data JSONB NOT NULL,
    schema JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indeksy dla lepszej wydajności
CREATE INDEX IF NOT EXISTS idx_eksperymenty_status ON eksperymenty(status);
CREATE INDEX IF NOT EXISTS idx_eksperymenty_project_id ON eksperymenty(project_id);
CREATE INDEX IF NOT EXISTS idx_eksperymenty_created_at ON eksperymenty(created_at);

CREATE INDEX IF NOT EXISTS idx_eksperymenty_ext_status ON eksperymenty_extended(status);
CREATE INDEX IF NOT EXISTS idx_eksperymenty_ext_project_id ON eksperymenty_extended(project_id);

CREATE INDEX IF NOT EXISTS idx_form_submissions_type ON form_submissions(form_type);
CREATE INDEX IF NOT EXISTS idx_form_submissions_created ON form_submissions(created_at);

-- Funkcja do automatycznej aktualizacji updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggery dla automatycznej aktualizacji updated_at
CREATE TRIGGER update_eksperymenty_updated_at BEFORE UPDATE ON eksperymenty
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_eksperymenty_ext_updated_at BEFORE UPDATE ON eksperymenty_extended
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_form_submissions_updated_at BEFORE UPDATE ON form_submissions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Przykładowe dane testowe
INSERT INTO eksperymenty (project_id, name, author_id, form_id, description, status)
VALUES 
    ('PROJ-001', 'Testowy eksperyment 1', 1, 'FORM-001', 'Opis testowego eksperymentu', 'new'),
    ('PROJ-002', 'Badanie wpływu temperatury', 2, 'FORM-002', 'Analiza wpływu temperatury na reakcję', 'in_progress')
ON CONFLICT DO NOTHING;
