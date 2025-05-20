import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  Input,
  InputLabel,
  FormHelperText,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Divider,
  Card,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
  useAddCardMutation,
  useDeleteCardMutation,
  useGetCardsQuery,
  useUpdateCardMutation,
} from "../features/apiSlice";

const CardForm = () => {
  const [imageFile, setImageFile] = useState(null);
  // const [loading, setLoading] = useState(false);
  // const [cards, setCards] = useState([]);
  const [editingCard, setEditingCard] = useState(null);
  const [open, setOpen] = useState(false); // State to control dialog visibility
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false); // State for delete confirmation

  const { data: cards = [], isLoading: loading } = useGetCardsQuery();
  const [addCard] = useAddCardMutation();
  const [updateCard] = useUpdateCardMutation();
  const [deleteCard] = useDeleteCardMutation();

  const formik = useFormik({
    initialValues: {
      title: editingCard ? editingCard.title : "",
      description: editingCard ? editingCard.description : "",
      linkUrl: editingCard ? editingCard.linkUrl : "",
    },
    validationSchema: Yup.object({
      title: Yup.string()
        .min(3, "Title must be at least 3 characters")
        .required("Title is required"),
      description: Yup.string()
        .min(10, "Description must be at least 10 characters")
        .required("Description is required"),
      linkUrl: Yup.string()
        .url("Enter a valid URL")
        .required("URL is required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        const formData = new FormData();
        formData.append("title", values.title);
        formData.append("description", values.description);
        formData.append("linkUrl", values.linkUrl);
        if (imageFile) {
          formData.append("image", imageFile);
        }

        if (editingCard) {
          // Update card using RTK Query
          const result = await updateCard({
            id: editingCard._id,
            formData,
          }).unwrap();
          if (result) {
            toast.success("Card updated successfully!");
          }
        } else {
          // Create new card using RTK Query
          const result = await addCard(formData).unwrap();
          if (result) {
            toast.success("Card created successfully!");
          }
        }

        resetForm();
        setImageFile(null);
        setEditingCard(null); // Reset editing state
        setOpen(false); // Close the dialog
      } catch (error) {
        console.error(error);
        toast.error("Error saving card. Please try again.");
      }
    },
  });

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const reloadPage = () => {
    window.location.reload();
  };

  const handleEdit = (card) => {
    setEditingCard(card);
    formik.setValues({
      title: card.title,
      description: card.description,
      linkUrl: card.linkUrl,
    });
    setImageFile(null); // Reset image if no new image is selected
    setOpen(true); // Open the dialog when editing
  };

  const handleDelete = async (id) => {
    try {
      // Delete card using RTK Query
      const result = await deleteCard(id).unwrap();
      if (result) {
        toast.success("Card deleted successfully!");
      }
      setOpenDeleteDialog(false); // Close delete dialog after deletion
    } catch (error) {
      console.error("Error deleting card:", error);
      toast.error("Error deleting card.");
      setOpenDeleteDialog(false); // Close delete dialog on error
    }
  };

  const openDeleteConfirmationDialog = (card) => {
    setEditingCard(card);
    setOpenDeleteDialog(true); // Open delete confirmation dialog
  };

  return (
    <Box sx={{ color: "black" }}>
      <Button onClick={reloadPage} variant="contained">
        Reload Dashboard
      </Button>
      <div
        style={{
          height: "90vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <form onSubmit={formik.handleSubmit} style={{ width: "100%" }}>
          <Typography variant="h3">
            {editingCard ? "Edit Card" : "Add a New Card"}
          </Typography>

          <FormControl style={{ width: "100%" }} margin="dense">
            <InputLabel htmlFor="title">Title</InputLabel>
            <Input id="title" type="text" {...formik.getFieldProps("title")} />
            {formik.touched.title && formik.errors.title ? (
              <FormHelperText error>{formik.errors.title}</FormHelperText>
            ) : null}
          </FormControl>

          <FormControl style={{ width: "100%" }} margin="dense">
            <InputLabel htmlFor="description">Description</InputLabel>
            <Input
              id="description"
              type="text"
              {...formik.getFieldProps("description")}
            />
            {formik.touched.description && formik.errors.description ? (
              <FormHelperText error>{formik.errors.description}</FormHelperText>
            ) : null}
          </FormControl>

          <FormControl style={{ width: "100%" }} margin="dense">
            <InputLabel htmlFor="linkUrl">External Link (URL)</InputLabel>
            <Input
              id="linkUrl"
              type="text"
              {...formik.getFieldProps("linkUrl")}
            />
            {formik.touched.linkUrl && formik.errors.linkUrl ? (
              <FormHelperText error>{formik.errors.linkUrl}</FormHelperText>
            ) : null}
          </FormControl>

          <FormControl style={{ width: "100%" }} margin="dense">
            <InputLabel shrink htmlFor="blog_cover_image">
              Blog Cover Image
            </InputLabel>
            <Input
              id="blog_cover_image"
              type="file"
              onChange={handleImageChange}
            />
          </FormControl>

          {editingCard && editingCard.image && (
            <Box mt={2}>
              <Typography variant="body2">Current Image:</Typography>
              <img
                src={`${import.meta.env.VITE_BACKEND}/uploads/${editingCard.image}`}
                alt="current"
                width="100"
                height="100"
              />
            </Box>
          )}

          <Box
            sx={{ display: "flex", alignItems: "center", marginTop: "16px" }}
          >
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              style={{ marginRight: "16px" }}
            >
              {loading
                ? "Saving..."
                : editingCard
                ? "Update Card"
                : "Create Card"}
            </Button>
            {loading && <CircularProgress size={24} />}
          </Box>
        </form>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this card? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={() => handleDelete(editingCard._id)}
            variant="contained"
            color="error"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog for editing a card */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>{editingCard ? "Edit Card" : "Add New Card"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {editingCard
              ? "Update the details of the card."
              : "Create a new card."}
          </DialogContentText>

          <form onSubmit={formik.handleSubmit}>
            <FormControl fullWidth margin="dense">
              <InputLabel htmlFor="title">Title</InputLabel>
              <Input
                id="title"
                type="text"
                {...formik.getFieldProps("title")}
              />
              {formik.touched.title && formik.errors.title ? (
                <FormHelperText error>{formik.errors.title}</FormHelperText>
              ) : null}
            </FormControl>

            <FormControl fullWidth margin="dense">
              <InputLabel htmlFor="description">Description</InputLabel>
              <Input
                id="description"
                type="text"
                {...formik.getFieldProps("description")}
              />
              {formik.touched.description && formik.errors.description ? (
                <FormHelperText error>
                  {formik.errors.description}
                </FormHelperText>
              ) : null}
            </FormControl>

            <FormControl fullWidth margin="dense">
              <InputLabel htmlFor="linkUrl">External Link (URL)</InputLabel>
              <Input
                id="linkUrl"
                type="text"
                {...formik.getFieldProps("linkUrl")}
              />
              {formik.touched.linkUrl && formik.errors.linkUrl ? (
                <FormHelperText error>{formik.errors.linkUrl}</FormHelperText>
              ) : null}
            </FormControl>

            <FormControl fullWidth margin="dense">
              <InputLabel shrink htmlFor="image">
                Card Cover Image
              </InputLabel>
              <Input id="image" type="file" onChange={handleImageChange} />
            </FormControl>

            <DialogActions>
              <Button onClick={() => setOpen(false)} color="secondary">
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
                onClick={formik.handleSubmit}
              >
                {loading ? "Updating..." : "Update Card"}
              </Button>
              {loading && <CircularProgress size={24} />}
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>

      <div>
        <Typography variant="h4">Existing Cards</Typography>
        {cards.length === 0 ? (
          <Typography>No cards available</Typography>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            {cards.map((card) => (
              <Box
                key={card._id}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "16px",
                }}
              >
                <Box sx={{ flex: 1 }}>
                  <Card>
                    <Typography variant="h6">
                      <b>Card Title:- </b>
                      {card.title}
                    </Typography>
                    <Divider />
                    <Typography>
                      <b>Card Description:- </b>
                      {card.description}
                    </Typography>
                    <Divider />
                    <div>
                      <b>Card Image:- </b>
                      <br />
                      <img src={card.imageUrl} alt="card image" width={100} />
                    </div>
                    <Divider />
                    <Typography>
                      <b>Card Link:- </b>
                      {card.linkUrl}
                    </Typography>
                    <IconButton onClick={() => handleEdit(card)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => openDeleteConfirmationDialog(card)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Card>
                </Box>
              </Box>
            ))}
          </Box>
        )}
      </div>
    </Box>
  );
};

export default CardForm;
