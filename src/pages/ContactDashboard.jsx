import React, { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import axios from "axios";

const ContactDashboard = () => {
  const [contacts, setContacts] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);

  // Fetch contacts
  useEffect(() => {
    axios.get(`${import.meta.env.VITE_BACKEND}/api/contacts`)
      .then(res => setContacts(res.data))
      .catch(err => console.error("Error fetching contacts:", err));
  }, []);

  // Handle Edit
  const handleEdit = (contact) => {
    setSelectedContact(contact);
    setOpen(true);
  };

  // Handle Delete
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this inquiry?")) {
      await axios.delete(`${import.meta.env.VITE_BACKEND}/api/contacts/${id}`);
      setContacts(contacts.filter(contact => contact._id !== id));
    }
  };

  // Handle Save (Update)
  const handleSave = async () => {
    try {
      const res = await axios.put(`${import.meta.env.VITE_BACKEND}/api/contacts/${selectedContact._id}`, selectedContact);
      setContacts(contacts.map(c => (c._id === selectedContact._id ? res.data : c)));
      setOpen(false);
    } catch (error) {
      console.error("Error updating contact:", error);
    }
  };

  return (
    <div>
      <h2>Contact Inquiries</h2>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Subject</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {contacts.map(contact => (
              <TableRow key={contact._id}>
                <TableCell>{contact.name}</TableCell>
                <TableCell>{contact.phone}</TableCell>
                <TableCell>{contact.email}</TableCell>
                <TableCell>{contact.subject}</TableCell>
                <TableCell>
                  <Button onClick={() => handleEdit(contact)} color="primary">Edit</Button>
                  <Button onClick={() => handleDelete(contact._id)} color="error">Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Edit Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Edit Contact</DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            value={selectedContact?.name || ""}
            onChange={(e) => setSelectedContact({ ...selectedContact, name: e.target.value })}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Phone"
            value={selectedContact?.phone || ""}
            onChange={(e) => setSelectedContact({ ...selectedContact, phone: e.target.value })}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Email"
            value={selectedContact?.email || ""}
            onChange={(e) => setSelectedContact({ ...selectedContact, email: e.target.value })}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Subject"
            value={selectedContact?.subject || ""}
            onChange={(e) => setSelectedContact({ ...selectedContact, subject: e.target.value })}
            fullWidth
            multiline
            rows={3}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="secondary">Cancel</Button>
          <Button onClick={handleSave} color="primary">Save</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ContactDashboard;
