import React, { useState } from 'react';
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
} from 'date-fns';
import styles from '../styles/Calendar.module.css';
import Modal from './Modal';
import EventModal from './EventModal';
import EditEventModal from './EditEventModal';

const Calendar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false); // Pour créer un nouvel événement
  const [showEventsModal, setShowEventsModal] = useState(false); // Pour afficher tous les événements d'une journée
  const [viewingDate, setViewingDate] = useState(null); // Date pour laquelle on veut voir tous les événements
  const [editingEvent, setEditingEvent] = useState(null); // Stocke l'événement que l'on souhaite éditer

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

  const toggleEventType = (day, eventName, e) => {
    e.stopPropagation();
    const selected = format(day, 'yyyy-MM-dd');
    setEvents((prevEvents) => {
      const updatedEvents = prevEvents[selected].map((event) => {
        if (event.name === eventName) {
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
      return {
        ...prevEvents,
        [selected]: updatedEvents,
      };
    });
  };

  const deleteEvent = (day, eventName) => {
    const selected = format(day, 'yyyy-MM-dd');
    setEvents((prevEvents) => {
      const filteredEvents = prevEvents[selected].filter((event) => event.name !== eventName);
      return {
        ...prevEvents,
        [selected]: filteredEvents,
      };
    });
  };

  const handleEventSubmit = (eventName) => {
    if (!eventName) return;
    const selected = format(selectedDate, 'yyyy-MM-dd');
    setEvents((prevEvents) => ({
      ...prevEvents,
      [selected]: [...(prevEvents[selected] || []), { name: eventName, type: 'toDo' }],
    }));
    setIsModalOpen(false);
  };

  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  const onDateClick = (day) => {
    setSelectedDate(day);
    setIsModalOpen(true); // Ouvre le popup de création
  };

  const onEventClick = (day, event) => {
    setEditingEvent({ ...event, date: day });
    setIsModalOpen(false); // Ferme le modal de création si ouvert
  };

  const renderHeader = () => (
    <div className={styles.header}>
      <button onClick={prevMonth} className={styles.navButton}>←</button>
      <h2>{format(currentMonth, 'MMMM yyyy')}</h2>
      <button onClick={nextMonth} className={styles.navButton}>→</button>
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

        days.push(
          <div
            className={`${styles.cell} ${!isSameMonth(day, monthStart) ? styles.disabled : ''}`}
            key={day}
            onClick={() => onDateClick(cloneDay)}
          >
            <span className={styles.number}>{formattedDate}</span>
            {dayEvents.length > 0 && (
              <>
                <ul className={styles.eventList}>
                  {dayEvents.slice(0, 2).map((event, index) => (
                    <li
                      key={index}
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
      rows.push(<div className={styles.row} key={day}>{days}</div>);
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
      setEditingEvent({ ...event, date: viewingDate }); // L'événement à éditer
      setShowEventsModal(false); // Ferme le modal d'événements
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
                event.name === editingEvent.name ? updatedEvent : event
              ),
            }));
            setEditingEvent(null);
          }}
          onDelete={() => {
            deleteEvent(editingEvent.date, editingEvent.name);
            setEditingEvent(null);
          }}
        />
      )}
    </div>
  );
};

export default Calendar;
