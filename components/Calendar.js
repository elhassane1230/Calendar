import React, { useState, useEffect } from 'react';
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  isSameMonth,
  isSameDay,
} from 'date-fns';
import styles from '../styles/Calendar.module.css';
import Modal from './Modal';
import EventModal from './EventModal';
import EditEventModal from './EditEventModal';

const STORAGE_KEY = 'dynamic-calendar-events';

// Génère un identifiant unique et stable pour chaque événement.
const newId = () =>
  (typeof crypto !== 'undefined' && crypto.randomUUID)
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

const Calendar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState({});
  const [hydrated, setHydrated] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // Créer un nouvel événement
  const [showEventsModal, setShowEventsModal] = useState(false); // Voir tous les événements d'un jour
  const [viewingDate, setViewingDate] = useState(null);
  const [editingEvent, setEditingEvent] = useState(null); // Événement en cours d'édition

  // Chargement depuis localStorage (une seule fois, côté client).
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setEvents(JSON.parse(saved));
    } catch (err) {
      console.error('Lecture du stockage impossible :', err);
    }
    setHydrated(true);
  }, []);

  // Sauvegarde à chaque changement (après le chargement initial).
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
    } catch (err) {
      console.error('Écriture du stockage impossible :', err);
    }
  }, [events, hydrated]);

  // Fermeture des modales avec la touche Échap.
  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== 'Escape') return;
      setIsModalOpen(false);
      setShowEventsModal(false);
      setEditingEvent(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const getEventColor = (type) => {
    switch (type) {
      case 'done':
        return 'green';
      case 'canceled':
        return 'red';
      case 'toDo':
      default:
        return 'orange';
    }
  };

  const toggleEventType = (day, eventId, e) => {
    e.stopPropagation();
    const selected = format(day, 'yyyy-MM-dd');
    setEvents((prevEvents) => {
      const updatedEvents = prevEvents[selected].map((event) => {
        if (event.id === eventId) {
          let newType;
          switch (event.type) {
            case 'toDo':
              newType = 'done';
              break;
            case 'done':
              newType = 'canceled';
              break;
            case 'canceled':
            default:
              newType = 'toDo';
          }
          return { ...event, type: newType };
        }
        return event;
      });
      return { ...prevEvents, [selected]: updatedEvents };
    });
  };

  const deleteEvent = (day, eventId) => {
    const selected = format(day, 'yyyy-MM-dd');
    setEvents((prevEvents) => {
      const filteredEvents = prevEvents[selected].filter((event) => event.id !== eventId);
      return { ...prevEvents, [selected]: filteredEvents };
    });
  };

  const handleEventSubmit = (eventName) => {
    if (!eventName) return;
    const selected = format(selectedDate, 'yyyy-MM-dd');
    setEvents((prevEvents) => ({
      ...prevEvents,
      [selected]: [...(prevEvents[selected] || []), { id: newId(), name: eventName, type: 'toDo' }],
    }));
    setIsModalOpen(false);
  };

  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  const onDateClick = (day) => {
    setSelectedDate(day);
    setIsModalOpen(true);
  };

  const onEventClick = (day, event) => {
    setEditingEvent({ ...event, date: day });
    setIsModalOpen(false);
  };

  const renderHeader = () => (
    <div className={styles.header}>
      <button onClick={prevMonth} className={styles.navButton} aria-label="Mois précédent">←</button>
      <h2>{format(currentMonth, 'MMMM yyyy')}</h2>
      <button onClick={nextMonth} className={styles.navButton} aria-label="Mois suivant">→</button>
    </div>
  );

  const renderDays = () => (
    <div className={styles.daysRow}>
      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
        <div className={styles.day} key={index}>{day}</div>
      ))}
    </div>
  );

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);
    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = '';

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, 'd');
        const cloneDay = day;
        const dayEvents = events[format(cloneDay, 'yyyy-MM-dd')] || [];
        const isToday = isSameDay(cloneDay, new Date());

        days.push(
          <div
            className={`${styles.cell} ${!isSameMonth(day, monthStart) ? styles.disabled : ''}`}
            key={format(cloneDay, 'yyyy-MM-dd')}
            onClick={() => onDateClick(cloneDay)}
            style={isToday ? { outline: '2px solid #3d7eff', outlineOffset: '-2px' } : undefined}
          >
            <span className={styles.number}>{formattedDate}</span>
            {dayEvents.length > 0 && (
              <>
                <ul className={styles.eventList}>
                  {dayEvents.slice(0, 2).map((event) => (
                    <li
                      key={event.id}
                      className={styles.eventItem}
                      style={{ color: getEventColor(event.type) }}
                      onClick={(e) => { e.stopPropagation(); onEventClick(cloneDay, event); }}
                    >
                      {event.name}
                    </li>
                  ))}
                </ul>
                {dayEvents.length > 2 && (
                  <button
                    className={styles.viewMoreButton}
                    onClick={(e) => { e.stopPropagation(); setViewingDate(cloneDay); setShowEventsModal(true); }}
                  >
                    Voir plus...
                  </button>
                )}
              </>
            )}
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(<div className={styles.row} key={format(day, 'yyyy-MM-dd')}>{days}</div>);
      days = [];
    }
    return <div className={styles.body}>{rows}</div>;
  };

  return (
    <div className={styles.calendar}>
      {renderHeader()}
      {renderDays()}
      {renderCells()}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleEventSubmit} />
      {showEventsModal && viewingDate && (
        <EventModal
          isOpen={showEventsModal}
          events={events[format(viewingDate, 'yyyy-MM-dd')]}
          onClose={() => setShowEventsModal(false)}
          onEdit={(event) => {
            setEditingEvent({ ...event, date: viewingDate });
            setShowEventsModal(false);
          }}
        />
      )}
      {editingEvent && (
        <EditEventModal
          isOpen={!!editingEvent}
          event={editingEvent}
          onClose={() => setEditingEvent(null)}
          onUpdate={(updatedEvent) => {
            const selected = format(editingEvent.date, 'yyyy-MM-dd');
            setEvents((prevEvents) => ({
              ...prevEvents,
              [selected]: prevEvents[selected].map((event) =>
                event.id === editingEvent.id ? { ...event, ...updatedEvent } : event
              ),
            }));
            setEditingEvent(null);
          }}
          onDelete={() => {
            deleteEvent(editingEvent.date, editingEvent.id);
            setEditingEvent(null);
          }}
        />
      )}
    </div>
  );
};

export default Calendar;
