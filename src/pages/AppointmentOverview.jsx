import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Chip,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  DialogContentText,
} from "@mui/material";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { toast } from "react-toastify";
import {
  useGetAppointmentsQuery,
  useUpdateAppointmentStatusMutation,
  useDeleteAppointmentMutation,
  useGetClosedSlotsQuery,
  useCloseSlotMutation,
  useReopenSlotMutation,
} from "../features/apiSlice";

const getStatusColor = (status) => {
  switch (status) {
    case "Completed":
      return "#4CAF50";
    case "Pending":
      return "#FF9800";
    case "Canceled":
      return "#F44336";
    case "Rescheduled":
      return "#2196F3";
    default:
      return "#9E9E9E";
  }
};

const AppointmentOverview = () => {
  // const [search, setSearch] = useState("");
  // const [filterStatus, setFilterStatus] = useState("All");
  // const [startDate, setStartDate] = useState("");
  // const [endDate, setEndDate] = useState("");
  // const [selectedAppointments, setSelectedAppointments] = useState([]);
  // const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  // const [appointmentToDelete, setAppointmentToDelete] = useState(null);
  // const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  // const [selectedAppointmentDetails, setSelectedAppointmentDetails] = useState(null);

  // // Closed slots states
  // const [openCloseDialog, setOpenCloseDialog] = useState(false);
  // const [closeDate, setCloseDate] = useState("");
  // const [closeTimeSlots, setCloseTimeSlots] = useState([]);

  // const availableTimeSlots = ["09:00-10:00", "10:00-11:00", "11:00-12:00"];

  // // RTK Query hooks
  // const { data: appointments = [], isLoading: isAppointmentsLoading } = useGetAppointmentsQuery();
  // const { data: closedSlots = [], isLoading: isClosedSlotsLoading } = useGetClosedSlotsQuery();
  // const [updateAppointmentStatus] = useUpdateAppointmentStatusMutation();
  // const [deleteAppointment] = useDeleteAppointmentMutation();
  // const [closeSlot] = useCloseSlotMutation();
  // const [reopenSlot] = useReopenSlotMutation();



  //======================================================================
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedAppointments, setSelectedAppointments] = useState([]);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [appointmentToDelete, setAppointmentToDelete] = useState(null);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [selectedAppointmentDetails, setSelectedAppointmentDetails] = useState(null);
  const [openCloseDialog, setOpenCloseDialog] = useState(false);
  const [closeDate, setCloseDate] = useState("");
  const [closeTimeSlots, setCloseTimeSlots] = useState([]);
  const [bulkAction, setBulkAction] = useState(""); // Added for MUI Select

  const availableTimeSlots = ["09:00-10:00", "10:00-11:00", "11:00-12:00"];

  const { data: appointments = [], isLoading: isAppointmentsLoading } = useGetAppointmentsQuery();
  const { data: closedSlots = [], isLoading: isClosedSlotsLoading } = useGetClosedSlotsQuery();
  const [updateAppointmentStatus] = useUpdateAppointmentStatusMutation();
  const [deleteAppointment] = useDeleteAppointmentMutation();
  const [closeSlot] = useCloseSlotMutation();
  const [reopenSlot] = useReopenSlotMutation();

 
  //======================================================================

  const formattedAppointments = appointments.map((item) => ({
    ...item,
    date: new Date(item.date),
  }));

  const handleSearch = (e) => setSearch(e.target.value);
  const handleFilterChange = (e) => setFilterStatus(e.target.value);

  const handleDateRangeFilter = () => {
    if (!startDate || !endDate) {
      toast.error("Both start date and end date must be selected.");
      return;
    }
  };

  const handleClearFilters = () => {
    setSearch("");
    setFilterStatus("All");
    setStartDate("");
    setEndDate("");
  };

  const handleStatusUpdate = async (appointmentId, newStatus) => {
    try {
      await updateAppointmentStatus({ id: appointmentId, status: newStatus }).unwrap();
      toast.success("Appointment status updated successfully.");
    } catch (error) {
      toast.error("Failed to update appointment status.");
    }
  };

  const handleDelete = (appointmentId) => {
    setAppointmentToDelete(appointmentId);
    setOpenDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (!appointmentToDelete) return;
    try {
      await deleteAppointment(appointmentToDelete).unwrap();
      setOpenDeleteDialog(false);
      setAppointmentToDelete(null);
      toast.success("Appointment deleted successfully.");
    } catch (error) {
      toast.error("Failed to delete the appointment.");
    }
  };

  const handleViewDetails = (appointment) => {
    setSelectedAppointmentDetails(appointment);
    setOpenDetailsDialog(true);
  };

  const handleBulkAction = async (action) => {
    if (selectedAppointments.length === 0) return;
    try {
      const bulkActions = selectedAppointments.map(async (appointmentId) => {
        if (action === "delete") {
          return deleteAppointment(appointmentId).unwrap();
        } else if (action === "updateStatus") {
          return updateAppointmentStatus({
            id: appointmentId,
            status: "Completed",
          }).unwrap();
        }
      });
      await Promise.all(bulkActions);
      setSelectedAppointments([]);
      toast.success("Bulk action completed successfully.");
    } catch (error) {
      toast.error("Failed to complete bulk action.");
    }
  };

  const filteredAppointments = formattedAppointments.filter((appointment) => {
    const matchesSearch =
      appointment.name.toLowerCase().includes(search.toLowerCase()) ||
      appointment.email.toLowerCase().includes(search.toLowerCase()) ||
      (appointment.phone && appointment.phone.includes(search));
    const matchesStatus = filterStatus === "All" || appointment.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const calendarEvents = filteredAppointments.map((appointment) => {
    const [hours, minutes] = appointment.timeSlot.split(":");
    const startDate = new Date(appointment.date);
    startDate.setHours(parseInt(hours), parseInt(minutes));
    const endDate = new Date(startDate);
    endDate.setHours(startDate.getHours() + 1); // Assuming 1-hour appointments
    return {
      id: appointment._id,
      title: `${appointment.name} - ${appointment.status}`,
      start: startDate,
      end: endDate,
      backgroundColor: getStatusColor(appointment.status),
      extendedProps: appointment,
    };
  });

  const handleEventClick = (info) => {
    handleViewDetails(info.event.extendedProps);
  };

  // Closed slots handlers
  // const handleCloseSlot = async () => {
  //   if (!closeDate) {
  //     toast.error("Please select a date to close");
  //     return;
  //   }
  //   try {
  //     await closeSlot({ date: closeDate, timeSlots: closeTimeSlots }).unwrap();
  //     setOpenCloseDialog(false);
  //     setCloseDate("");
  //     setCloseTimeSlots([]);
  //     toast.success("Date/time slots closed successfully");
  //   } catch (error) {
  //     toast.error("Failed to close date/time slots");
  //   }
  // };
  const handleCloseSlot = async () => {
    if (!closeDate) {
      toast.error("Please select a date to close");
      return;
    }
    try {
      await closeSlot({ date: closeDate, timeSlots: closeTimeSlots }).unwrap();
      setOpenCloseDialog(false);
      setCloseDate("");
      setCloseTimeSlots([]);
      toast.success("Date/time slots closed successfully");
    } catch (error) {
      toast.error("Failed to close date/time slots: " + (error.data?.message || error.message));
    }
  };

  const handleReopenSlot = async (date, timeSlot = null) => {
    try {
      await reopenSlot({ date, timeSlot }).unwrap();
      toast.success("Date/time slot reopened successfully");
    } catch (error) {
      toast.error("Failed to reopen date/time slot");
    }
  };

  if (isAppointmentsLoading || isClosedSlotsLoading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <Typography variant="h4" gutterBottom>Appointment Overview</Typography>

      {/* Filters */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <TextField
          label="Search by Name, Email, or Phone"
          variant="outlined"
          value={search}
          onChange={handleSearch}
          style={{ flex: 1 }}
        />
        <FormControl variant="outlined" style={{ minWidth: 150 }}>
          <InputLabel>Status</InputLabel>
          <Select value={filterStatus} onChange={handleFilterChange} label="Status">
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="Completed">Completed</MenuItem>
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="Canceled">Canceled</MenuItem>
            <MenuItem value="Rescheduled">Rescheduled</MenuItem>
          </Select>
        </FormControl>
      </div>

      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <TextField
          label="Start Date"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <TextField
          label="End Date"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
        <Button variant="contained" color="primary" onClick={handleDateRangeFilter}>
          Apply Date Range
        </Button>
        <Button variant="outlined" color="secondary" onClick={handleClearFilters}>
          Clear All Filters
        </Button>
      </div>

      {/* <div style={{ marginBottom: "20px" }}>
        <FormControl variant="outlined" style={{ minWidth: 150 }}>
          <InputLabel>Bulk Actions</InputLabel>
          <Select onChange={(e) => handleBulkAction(e.target.value)} label="Bulk Actions">
            <MenuItem value="updateStatus">Update Status</MenuItem>
            <MenuItem value="delete">Delete</MenuItem>
          </Select>
        </FormControl>
      </div> */}
      <div style={{ marginBottom: "20px" }}>
    <FormControl variant="outlined" style={{ minWidth: 150 }}>
      <InputLabel>Bulk Actions</InputLabel>
      <Select
        value={bulkAction}
        onChange={(e) => {
          setBulkAction(e.target.value);
          handleBulkAction(e.target.value);
        }}
        label="Bulk Actions"
      >
        <MenuItem value="">None</MenuItem>
        <MenuItem value="updateStatus">Update Status</MenuItem>
        <MenuItem value="delete">Delete</MenuItem>
      </Select>
    </FormControl>
  </div>

      {/* Appointments Table */}
      {filteredAppointments.length > 0 ? (
        <TableContainer component={Paper} style={{ marginBottom: "2rem" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <input
                    type="checkbox"
                    onChange={(e) =>
                      setSelectedAppointments(
                        e.target.checked ? filteredAppointments.map((app) => app._id) : []
                      )
                    }
                  />
                </TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Time</TableCell>
                <TableCell>Client Name</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Notes</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredAppointments.map((appointment) => (
                <TableRow key={appointment._id}>
                  <TableCell>
                    <input
                      type="checkbox"
                      checked={selectedAppointments.includes(appointment._id)}
                      onChange={(e) =>
                        setSelectedAppointments((prev) =>
                          e.target.checked
                            ? [...prev, appointment._id]
                            : prev.filter((id) => id !== appointment._id)
                        )
                      }
                    />
                  </TableCell>
                  <TableCell>{appointment.date.toLocaleDateString()}</TableCell>
                  <TableCell>{appointment.timeSlot}</TableCell>
                  <TableCell>
                    {appointment.name}
                    <br />
                    {appointment.email}
                    <br />
                    {appointment.phone || "N/A"}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={appointment.status}
                      style={{
                        backgroundColor: getStatusColor(appointment.status),
                        color: "white",
                      }}
                    />
                  </TableCell>
                  <TableCell>{appointment.notes || "N/A"}</TableCell>
                  <TableCell>
                    <FormControl variant="outlined" size="small" style={{ minWidth: 120 }}>
                      <Select
                        value={appointment.status}
                        onChange={(e) => handleStatusUpdate(appointment._id, e.target.value)}
                      >
                        <MenuItem value="Completed">Completed</MenuItem>
                        <MenuItem value="Pending">Pending</MenuItem>
                        <MenuItem value="Canceled">Canceled</MenuItem>
                        <MenuItem value="Rescheduled">Rescheduled</MenuItem>
                      </Select>
                    </FormControl>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => handleViewDetails(appointment)}
                    >
                      View Details
                    </Button>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => handleDelete(appointment._id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <p>No appointments found.</p>
      )}

      {/* Calendar */}
      <div className="mt-8">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="timeGridWeek"
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          events={calendarEvents}
          eventClick={handleEventClick}
          slotMinTime="08:00:00"
          slotMaxTime="20:00:00"
          allDaySlot={false}
          height="auto"
          aspectRatio={1.8}
          expandRows={true}
          stickyHeaderDates={true}
          nowIndicator={true}
          dayMaxEvents={true}
          eventTimeFormat={{
            hour: "2-digit",
            minute: "2-digit",
            meridiem: false,
            hour12: false,
          }}
        />
      </div>

      {/* Delete Dialog */}
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>Are you sure you want to delete this appointment?</DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={confirmDelete} color="secondary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      {/* Details Dialog */}
      <Dialog open={openDetailsDialog} onClose={() => setOpenDetailsDialog(false)}>
        <DialogTitle>Appointment Details</DialogTitle>
        <DialogContent>
          {selectedAppointmentDetails && (
            <div>
              <Typography><strong>Name:</strong> {selectedAppointmentDetails.name}</Typography>
              <Typography><strong>Email:</strong> {selectedAppointmentDetails.email}</Typography>
              <Typography><strong>Phone:</strong> {selectedAppointmentDetails.phone || "N/A"}</Typography>
              <Typography><strong>Status:</strong> {selectedAppointmentDetails.status}</Typography>
              <Typography>
                <strong>Date:</strong> {selectedAppointmentDetails.date.toLocaleDateString()}
              </Typography>
              <Typography><strong>Time:</strong> {selectedAppointmentDetails.timeSlot}</Typography>
              <Typography>
                <strong>Notes:</strong> {selectedAppointmentDetails.notes || "Notes Not Provided!"}
              </Typography>
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDetailsDialog(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Close Slots Section */}
      <Button
        variant="contained"
        color="primary"
        onClick={() => setOpenCloseDialog(true)}
        style={{ marginTop: "20px" }}
      >
        Close Date/Time Slots
      </Button>

      <div style={{ marginTop: "20px" }}>
        <Typography variant="h6">Closed Slots:</Typography>
        {closedSlots.length > 0 ? (
          closedSlots.map((slot) => (
            <div key={slot._id}>
              <Typography>
                {new Date(slot.date).toLocaleDateString()}:{" "}
                {slot.timeSlots.length === 0 ? "Entire Day" : slot.timeSlots.join(", ")}
              </Typography>
              <Button onClick={() => handleReopenSlot(slot.date)}>Reopen Entire Day</Button>
              {slot.timeSlots.map((ts) => (
                <Button key={ts} onClick={() => handleReopenSlot(slot.date, ts)}>
                  Reopen {ts}
                </Button>
              ))}
            </div>
          ))
        ) : (
          <Typography>No closed slots</Typography>
        )}
      </div>

      {/* Close Slot Dialog */}
      <Dialog open={openCloseDialog} onClose={() => setOpenCloseDialog(false)}>
        <DialogTitle>Close Date or Time Slots</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Select a date and optionally specific time slots to close.
          </DialogContentText>
          <TextField
            label="Date"
            type="date"
            value={closeDate}
            onChange={(e) => setCloseDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            fullWidth
            margin="normal"
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Time Slots (leave empty to close entire day)</InputLabel>
            <Select
              multiple
              value={closeTimeSlots}
              onChange={(e) => setCloseTimeSlots(e.target.value)}
            >
              {availableTimeSlots.map((slot) => (
                <MenuItem key={slot} value={slot}>{slot}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCloseDialog(false)}>Cancel</Button>
          <Button onClick={handleCloseSlot} color="primary">Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AppointmentOverview;