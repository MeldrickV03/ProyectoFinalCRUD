const express = require("express");
const router = express.Router();
const Producto = require("../models");

// Obtener todos los productos
router.get("/", (req, res) => {
  Producto.getAll((err, productos) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(productos);
  });
});

// Obtener un producto por ID
router.get("/:id", (req, res) => {
  Producto.getById(req.params.id, (err, producto) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!producto) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }
    res.json(producto);
  });
});

// Crear un nuevo producto
router.post("/", (req, res) => {
  const { nombre, descripcion, precio, cantidad, categoria } = req.body;
  Producto.create(
    nombre,
    descripcion,
    precio,
    cantidad,
    categoria,
    (err, result) => {
      if (err) {
        return res.status(400).json({ error: err.message });
      }
      res.status(201).json({ id: result.id });
    }
  );
});

// Actualizar un producto
router.put("/:id", (req, res) => {
  const { nombre, descripcion, precio, cantidad, categoria } = req.body;
  Producto.update(
    req.params.id,
    nombre,
    descripcion,
    precio,
    cantidad,
    categoria,
    (err) => {
      if (err) {
        return res.status(400).json({ error: err.message });
      }
      res.json({ message: "Producto actualizado correctamente" });
    }
  );
});

// Eliminar un producto
router.delete("/:id", (req, res) => {
  Producto.delete(req.params.id, (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    res.json({ message: "Producto eliminado correctamente" });
  });
});

module.exports = router;
