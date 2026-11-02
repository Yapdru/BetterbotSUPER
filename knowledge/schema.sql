CREATE TABLE IF NOT EXISTS questions (rowid INTEGER PRIMARY KEY, id TEXT NOT NULL UNIQUE, title TEXT NOT NULL, tags TEXT NOT NULL, body TEXT NOT NULL, payload TEXT NOT NULL);
CREATE VIRTUAL TABLE IF NOT EXISTS knowledge_fts USING fts5(title,tags,body,content='questions',content_rowid='rowid');
CREATE TRIGGER IF NOT EXISTS questions_ai AFTER INSERT ON questions BEGIN INSERT INTO knowledge_fts(rowid,title,tags,body) VALUES(new.rowid,new.title,new.tags,new.body); END;
CREATE TRIGGER IF NOT EXISTS questions_ad AFTER DELETE ON questions BEGIN INSERT INTO knowledge_fts(knowledge_fts,rowid,title,tags,body) VALUES('delete',old.rowid,old.title,old.tags,old.body); END;
CREATE TRIGGER IF NOT EXISTS questions_au AFTER UPDATE ON questions BEGIN INSERT INTO knowledge_fts(knowledge_fts,rowid,title,tags,body) VALUES('delete',old.rowid,old.title,old.tags,old.body); INSERT INTO knowledge_fts(rowid,title,tags,body) VALUES(new.rowid,new.title,new.tags,new.body); END;
CREATE TABLE IF NOT EXISTS knowledge_stats (id INTEGER PRIMARY KEY CHECK(id=1), records INTEGER NOT NULL);
