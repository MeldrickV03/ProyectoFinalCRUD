const db = require("./database");

class Producto {
  static getAll(callback) {
    db.all("SELECT * FROM productos", callback);
  }

  static getById(id, callback) {
    db.get("SELECT * FROM productos WHERE id = ?", [id], callback);
  }

  static create(nombre, descripcion, precio, cantidad, categoria, callback) {
    db.run(
      "INSERT INTO productos (nombre, descripcion, precio, cantidad, categoria) VALUES (?, ?, ?, ?, ?)",
      [nombre, descripcion, precio, cantidad, categoria],
      function (err) {
        callback(err, { id: this.lastID });
      }
    );
  }

  static update(
    id,
    nombre,
    descripcion,
    precio,
    cantidad,
    categoria,
    callback
  ) {
    db.run(
      "UPDATE productos SET nombre = ?, descripcion = ?, precio = ?, cantidad = ?, categoria = ? WHERE id = ?",
      [nombre, descripcion, precio, cantidad, categoria, id],
      callback
    );
  }

  static delete(id, callback) {
    db.run("DELETE FROM productos WHERE id = ?", [id], callback);
  }
}

module.exports = Producto;
