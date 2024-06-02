import React, { useState, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import jaLocale from "@fullcalendar/core/locales/ja";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";

function Schedule() {
  const [events, setEvents] = useState([
    {
      id: 0,
      title: "event 1",
      start: "2020-05-22 10:00:00",
      end: "2020-05-22 11:00:00",
      memo: "memo1",
    },
    {
      id: 1,
      title: "event 2",
      start: "2020-05-23 10:00:00",
      end: "2020-05-23 11:00:00",
      memo: "memo2",
    },
  ]);

  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [title, setTitle] = useState("");
  const [start, setStart] = useState(new Date());
  const [end, setEnd] = useState(new Date());
  const [memo, setMemo] = useState("");
  const [currentEventId, setCurrentEventId] = useState(null);
  const calendarRef = useRef(null);

  const handleAddEvent = () => {
    const newEvent = { id: Date.now(), title, start, end, memo };
    setEvents([...events, newEvent]);
    calendarRef.current.getApi().addEvent(newEvent);
    resetForm();
  };

  const handleEditEvent = () => {
    const updatedEvents = events.map((event) =>
      event.id === currentEventId
        ? { ...event, title, start, end, memo }
        : event
    );
    setEvents(updatedEvents);
    const calendarApi = calendarRef.current.getApi();
    calendarApi.getEventById(currentEventId).remove();
    calendarApi.addEvent({ id: currentEventId, title, start, end, memo });
    resetForm();
  };

  const handleDeleteEvent = () => {
    const updatedEvents = events.filter((event) => event.id !== currentEventId);
    setEvents(updatedEvents);
    calendarRef.current.getApi().getEventById(currentEventId).remove();
    resetForm();
  };

  const handleEventClick = (clickInfo) => {
    const event = events.find(
      (event) => event.id === parseInt(clickInfo.event.id)
    );
    if (event) {
      setTitle(event.title);
      setStart(new Date(event.start));
      setEnd(new Date(event.end));
      setMemo(event.memo);
      setCurrentEventId(event.id);
      setIsEdit(true);
      setOpen(true);
    } else {
      console.error("Event not found");
    }
  };

  const handleSelect = (selectInfo) => {
    setStart(selectInfo.start);
    setEnd(selectInfo.end);
    setTitle("");
    setMemo("");
    setIsEdit(false);
    setOpen(true);
  };

  const resetForm = () => {
    setOpen(false);
    setIsEdit(false);
    setTitle("");
    setStart(new Date());
    setEnd(new Date());
    setMemo("");
    setCurrentEventId(null);
  };

  return (
    <div>
      <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
        スケジュールを追加
      </Button>
      <Dialog open={open} onClose={resetForm}>
        <DialogTitle>
          {isEdit ? "スケジュールを編集" : "新しいスケジュールを追加"}
        </DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="タイトル"
            type="text"
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <DatePicker
            selected={start}
            onChange={(date) => setStart(date)}
            locale="ja"
            dateFormat="yyyy/MM/d HH:mm"
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={10}
            todayButton="today"
          />
          <DatePicker
            selected={end}
            onChange={(date) => setEnd(date)}
            locale="ja"
            dateFormat="yyyy/MM/d HH:mm"
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={10}
            todayButton="today"
          />
          <TextField
            margin="dense"
            label="メモ"
            type="text"
            fullWidth
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={resetForm} color="primary">
            キャンセル
          </Button>
          {isEdit ? (
            <>
              <Button onClick={handleEditEvent} color="primary">
                編集
              </Button>
              <Button onClick={handleDeleteEvent} color="secondary">
                削除
              </Button>
            </>
          ) : (
            <Button onClick={handleAddEvent} color="primary">
              追加
            </Button>
          )}
        </DialogActions>
      </Dialog>
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        locales={[jaLocale]}
        locale="ja"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek",
        }}
        events={events}
        select={handleSelect}
        eventClick={handleEventClick}
        selectable={true}
        businessHours={{
          daysOfWeek: [1, 2, 3, 4, 5],
          startTime: "0:00",
          endTime: "24:00",
        }}
      />
    </div>
  );
}

export default Schedule;
