import React from 'react';
import styles from '../styles/EventModal.module.css';
import { FaCheckCircle, FaExclamationCircle, FaTimesCircle } from 'react-icons/fa';

const EventModal = ({ isOpen, events, onClose, onEdit }) => {
  if (!isOpen) return null;

  const getEventIcon = (type) => {
    switch (type) {
      case 'done':
        return <FaCheckCircle className={`${styles.icon} ${styles.done}`} />;
      case 'canceled':
        return <FaTimesCircle className={`${styles.icon} ${styles.canceled}`} />;
      case 'toDo':
      default:
        return <FaExclamationCircle className={`${styles.icon} ${styles.toDo}`} />;
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>Événements du jour</h2>
        <ul className={styles.eventList}>
          {events.map((event, index) => (
            <li 
              key={index} 
              className={styles.eventItem} 
              onClick={() => onEdit(event)} 
            >
              {getEventIcon(event.type)}
              <span className={styles.eventName}>{event.name}</span>
              <span className={styles.eventType}>{event.type}</span>
            </li>
          ))}
        </ul>
        <button className={styles.closeButton} onClick={onClose}>Fermer</button>
      </div>
    </div>
  );
};

export default EventModal;
