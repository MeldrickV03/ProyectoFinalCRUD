import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [productos, setProductos] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [notification, setNotification] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    cantidad: "",
    categoria: "",
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchProductos();
  }, []);

  const fetchProductos = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/productos");
      const data = await response.json();
      setProductos(data);
    } catch (error) {
      console.error("Error fetching productos:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingId
        ? `http://localhost:5000/api/productos/${editingId}`
        : "http://localhost:5000/api/productos";
      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        fetchProductos();
        setFormData({
          nombre: "",
          descripcion: "",
          precio: "",
          cantidad: "",
          categoria: "",
        });
        setEditingId(null);
        showNotification(
          editingId 
            ? "Producto actualizado correctamente" 
            : "Producto agregado correctamente"
        );
        setShowForm(false);
      }
    } catch (error) {
      console.error("Error saving producto:", error);
    }
  };

  const handleEdit = (producto) => {
    setFormData({
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      precio: producto.precio,
      cantidad: producto.cantidad,
      categoria: producto.categoria,
    });
    setEditingId(producto.id);
    setShowForm(true);
  };

  const confirmDelete = (id) => {
    setProductToDelete(id);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/productos/${productToDelete}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        fetchProductos();
        setShowDeleteModal(false);
        showNotification("Producto eliminado correctamente");
      }
    } catch (error) {
      console.error("Error deleting producto:", error);
    }
  };

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  return (
    <div className="app">
      <h1>Inventario de Tienda Online</h1>

      <div className="action-buttons">
  <button 
    className={`action-btn ${showForm ? 'active' : ''}`} 
    onClick={() => {
      setShowForm(true);
      setShowDetails(false);
      setEditingId(null);
      setFormData({
        nombre: "",
        descripcion: "",
        precio: "",
        cantidad: "",
        categoria: "",
      });
    }}
  >
    {editingId ? "Editar Producto" : "Agregar Producto"}
  </button>
  <button 
    className={`action-btn ${showDetails ? 'active' : ''}`}
    onClick={() => {
      setShowDetails(true);
      setShowForm(false);
    }}
  >
    Ver Productos
  </button>
</div>

      {showForm ? (
  <div className="form-container">
          <h2>{editingId ? "Editar Producto" : "Agregar Producto"}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Nombre:</label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Descripción:</label>
              <textarea
                name="descripcion"
                value={formData.descripcion}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label>Precio:</label>
              <input
                type="number"
                name="precio"
                value={formData.precio}
                onChange={handleInputChange}
                step="0.01"
                required
              />
            </div>

            <div className="form-group">
              <label>Cantidad:</label>
              <input
                type="number"
                name="cantidad"
                value={formData.cantidad}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Categoría:</label>
              <input
                type="text"
                name="categoria"
                value={formData.categoria}
                onChange={handleInputChange}
              />
            </div>

            <button className="btn" type="submit">
              {editingId ? "Actualizar" : "Agregar"}
            </button>
            {editingId && (
              <button
                type="button"
                className="btn secondary"
                onClick={() => {
                  setFormData({
                    nombre: "",
                    descripcion: "",
                    precio: "",
                    cantidad: "",
                    categoria: "",
                  });
                  setEditingId(null);
                }}
              >
                Cancelar
              </button>
            )}
          </form>
        </div>
      ):(

      <div className="productos-container">
        <h2>Lista de Productos</h2>
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Precio</th>
              <th>Cantidad</th>
              <th>Categoría</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((producto) => (
              <tr key={producto.id}>
                <td>{producto.nombre}</td>
                <td>{producto.descripcion}</td>
                <td>${producto.precio}</td>
                <td>{producto.cantidad}</td>
                <td>{producto.categoria}</td>
                <td>
                  <button 
                    type="button" 
                    className="btn edit"
                    onClick={() => handleEdit(producto)}
                  >
                    Editar
                  </button>
                  <button 
                    type="button" 
                    className="btn delete"
                    onClick={() => confirmDelete(producto.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      )}

      {!showForm && (
  <button 
    className="btn add-product-btn" 
    onClick={() => {
      setShowForm(true);
      setShowDetails(false);
      setEditingId(null);
      setFormData({
        nombre: "",
        descripcion: "",
        precio: "",
        cantidad: "",
        categoria: "",
      });
    }}
  >
    +
  </button>
)}

      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="card">
            <button className="exit-button" onClick={() => setShowDeleteModal(false)}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
            <div className="card-content">
              <h3 className="card-heading">Confirmar eliminación</h3>
              <p className="card-description">¿Estás seguro de que quieres eliminar este producto?</p>
            </div>
            <div className="card-button-wrapper">
              <button className="card-button secondary" onClick={() => setShowDeleteModal(false)}>
                Cancelar
              </button>
              <button 
                className="card-button primary" 
                onClick={handleDelete}
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {notification && (
        <div className="notification">
          {notification}
        </div>
      )}
    </div>
  );
}

export default App;
