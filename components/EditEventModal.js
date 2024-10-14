import React, { useState, useEffect } from 'react';
import styles from '../styles/EditEventModal.module.css';

const EditEventModal = ({ isOpen, event, onClose, onUpdate, onDelete }) => {
  const [eventName, setEventName] = useState(event.name);
  const [eventType, setEventType] = useState(event.type);

  useEffect(() => {
    if (event) {
      setEventName(event.name);
      setEventType(event.type);
    }
  }, [event]);

  if (!isOpen || !event) return null;

  const handleUpdate = () => {
    onUpdate({ name: eventName, type: eventType });
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>Modifier l'événement</h2>
        <input
          type="text"
          value={eventName}
          onChange={(e) => setEventName(e.target.value)}
          placeholder="Nom de l'événement"
          className={styles.eventInput}
        />
        <select value={eventType} onChange={(e) => setEventType(e.target.value)} className={styles.eventSelect}>
          <option value="toDo">À faire</option>
          <option value="done">Fait</option>
          <option value="canceled">Annulé</option>
        </select>
        <div className={styles.buttonGroup}>
          <button onClick={handleUpdate} className={styles.updateButton}>Mettre à jour</button>
          <button onClick={onDelete} className={styles.deleteButton}>Supprimer</button>
          <button onClick={onClose} className={styles.closeButton}>Fermer</button>
        </div>
      </div>
    </div>
  );
};

export default EditEventModal;
