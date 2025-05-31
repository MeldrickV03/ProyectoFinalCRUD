const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.resolve(__dirname, "inventario.db");

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Error al conectar con la base de datos:", err.message);
  } else {
    console.log("Conectado a la base de datos SQLite");
    db.run(
      `CREATE TABLE IF NOT EXISTS productos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      descripcion TEXT,
      precio REAL NOT NULL,
      cantidad INTEGER NOT NULL,
      categoria TEXT,
      fecha_creacion TEXT DEFAULT (datetime('now','localtime'))
    )`,
      (err) => {
        // <- Paréntesis de cierre añadido y callback
        if (err) {
          console.error("Error al crear tabla productos:", err.message);
        } else {
          console.log("Tabla 'productos' creada/verificada correctamente");
        }
      }
    );
  }
});

module.exports = db;
