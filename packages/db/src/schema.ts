export const schema = `
-- Tabla: Influencers
CREATE TABLE Influencers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    profile_name TEXT NOT NULL UNIQUE,
    profile_url TEXT,
    primary_blockchain_network TEXT
);

-- Tabla: Posts
CREATE TABLE Posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    influencer_id INTEGER NOT NULL,
    post_url TEXT NOT NULL UNIQUE,
    content TEXT,
    views INTEGER DEFAULT 0,
    comments INTEGER DEFAULT 0,
    interactions INTEGER DEFAULT 0,
    timestamp DATETIME NOT NULL,
    FOREIGN KEY (influencer_id) REFERENCES Influencers (id)
);

-- Tabla: DailyNarratives
CREATE TABLE DailyNarratives (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date DATE NOT NULL,
    narrative_summary TEXT NOT NULL,
    sentiment TEXT CHECK(sentiment IN ('Bullish', 'Bearish', 'Neutral'))
);

-- Tabla: NarrativeProbabilities
CREATE TABLE NarrativeProbabilities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    narrative_id INTEGER NOT NULL,
    probability_score REAL NOT NULL CHECK(probability_score >= 0 AND probability_score <= 1),
    calculation_date DATETIME NOT NULL,
    supporting_posts_ids TEXT,
    FOREIGN KEY (narrative_id) REFERENCES DailyNarratives (id)
);
`;
