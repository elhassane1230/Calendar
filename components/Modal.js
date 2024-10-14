import React from 'react';
import styles from '../styles/Modal.module.css';

const Modal = ({ isOpen, onClose, onSubmit }) => {
  const [eventName, setEventName] = React.useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(eventName);
    setEventName('');
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h2>Ajouter un Événement</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            placeholder="Nom de l'événement"
            required
          />
          <div className={styles.buttons}>
            <button type="submit" className={styles.submitButton}>Ajouter</button>
            <button type="button" className={styles.cancelButton} onClick={onClose}>Annuler</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Modal;
