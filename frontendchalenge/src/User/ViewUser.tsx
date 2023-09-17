import Axios from 'axios';
import { FormEvent, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  Card,
  CardContent,
  Divider,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  IconButton,
} from '@mui/material';
import { toast } from 'react-toastify';
import { Delete, Edit } from '@mui/icons-material';

interface User {
  id: number;
  firstName: string;
  lastName?: string;
  email: string;
  age: number;
  website?: string;
  notes: Note[];
}

interface Note {
  id: number;
  content: string;
  dateCreated: string;
  dateModified: string;
  views: number;
  published: boolean;
  userId: number;
}

const ViewUser = () => {
  const baseUrl = 'http://localhost:5102/';
  const params = useParams<{ id: string }>();
  const [user, setUser] = useState<User>({
    id: 0,
    firstName: '',
    lastName: '',
    email: '',
    age: Number.NaN,
    website: '',
    notes: [
      {
        content: '',
        userId: 0,
        dateCreated: '',
        views: 0,
        dateModified: '',
        id: 0,
        published: false,
      },
    ],
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editedNote, setEditedNote] = useState<Note>({
    id: 0,
    content: '',
    dateCreated: '',
    dateModified: '',
    views: 0,
    published: false,
    userId: 0,
  });

  const [newNote, setNewNote] = useState({
    content: '',
    userId: user?.id || 0,
  });

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const openEditModal = (note: Note) => {
    setIsEditModalOpen(true);
    setEditedNote(note);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
  };

  const handleCreateNote = async (event: FormEvent) => {
    event.preventDefault();

    try {
      const response = await Axios.post(`${baseUrl}api/notes`, newNote);

      if (response.status === 201) {
        setIsModalOpen(false);
        toast.success(`Note successfully created`, {
          position: 'top-right',
          autoClose: 3000,
        });
      }
    } catch (error: any) {
      if (error.response.status === 404) {
        setIsModalOpen(false);
        toast.warning(`User Not Found`, {
          position: 'top-right',
          autoClose: 3000,
        });
      } else {
        toast.error(`Note could not be created`, {
          position: 'top-right',
          autoClose: 3000,
        });
      }

      setIsModalOpen(false);
    }
  };

  const handleEditNote = (note: Note) => {
    openEditModal(note);
  };

  const handleDeleteNote = async (noteId: number) => {
    try {
      await Axios.delete(`${baseUrl}api/notes/${noteId}`);

      const updatedNotes = user!.notes.filter((note) => note.id !== noteId);
      setUser((prevUser: User) => ({
        ...prevUser,
        notes: updatedNotes,
      }));

      toast.success(`Note successfully deleted`, {
        position: 'top-right',
        autoClose: 3000,
      });
    } catch (error) {
      console.error(`Error deleting note with ID ${noteId}:`, error);
      toast.error(`Note could not be deleted`, {
        position: 'top-right',
        autoClose: 3000,
      });
    }
  };

  const handleSaveEdit = async () => {
    try {
      const response = await Axios.put(
        `${baseUrl}api/notes/${editedNote.id}`,
        editedNote
      );

      if (response.status === 204) {
        setIsEditModalOpen(false);
        toast.success(`Note successfully edited`, {
          position: 'top-right',
          autoClose: 3000,
        });
      }
    } catch (error: any) {
      toast.error(`Note could not be edited`, {
        position: 'top-right',
        autoClose: 3000,
      });
    }
  };

  useEffect(() => {
    if (params && params.id) {
      setNewNote({ ...newNote, userId: parseInt(params.id, 10) });
      Axios.get(`${baseUrl}api/users/${parseInt(params.id, 10)}`)
        .then((response) => {
          setUser(response.data);
        })
        .catch((error) => {
          console.log('error message:', error.message);
        });
    }
  }, [params, isModalOpen, isEditModalOpen]);

  return (
    <Container maxWidth="md">
      <Divider />
      {user ? (
        <div>
          <Typography variant="h4" gutterBottom>
            {user.firstName} {user.lastName}
          </Typography>
          <Typography variant="h6" gutterBottom>
            Email: {user.email}
          </Typography>
          <Typography variant="h6" gutterBottom>
            Age: {user.age}
          </Typography>
          <Typography variant="h6" gutterBottom>
            Website: {user.website}
          </Typography>
          <Divider style={{ marginBottom: '15px' }}>
            <Chip label="NOTES LIST" />
          </Divider>

          <Button
            style={{ marginBottom: '15px' }}
            variant="outlined"
            color="primary"
            onClick={openModal}
          >
            Create New Note
          </Button>
          <List>
            {user.notes.map((note) => (
              <Card key={note.id} variant="outlined" style={{ marginBottom: '16px' }}>
                <CardContent>
                  {/* Delete and Edit Icons */}
                  <IconButton color="primary" onClick={() => handleEditNote(note)}>
                    <Edit />
                  </IconButton>
                  <IconButton color="secondary" onClick={() => handleDeleteNote(note.id)}>
                    <Delete />
                  </IconButton>

                  <Typography variant="body1" gutterBottom>
                    {note.content}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    Date Created: {formatDate(note.dateCreated)}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </List>
        </div>
      ) : (
        <p>User not found.</p>
      )}

      {/* Create New Note Modal */}
      <Dialog open={isModalOpen} onClose={closeModal}>
        <DialogTitle>Create New Note</DialogTitle>
        <DialogContent>
          <form onSubmit={handleCreateNote}>
            <TextField
              margin="dense"
              fullWidth
              multiline
              label="Note Content"
              name="content"
              required
              value={newNote.content}
              onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
            />

            <DialogActions>
              <Button type="button" onClick={closeModal} color="secondary">
                Cancel
              </Button>
              <Button type="submit" color="primary">
                Create
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Note Modal */}
      <Dialog open={isEditModalOpen} onClose={closeEditModal}>
        <DialogTitle>Edit Note</DialogTitle>
        <DialogContent>
          <form>
            <TextField
              margin="dense"
              fullWidth
              multiline
              label="Note Content"
              name="content"
              required
              value={editedNote.content}
              onChange={(e) =>
                setEditedNote({ ...editedNote, content: e.target.value })
              }
            />
            <TextField
              margin="dense"
              fullWidth
              label="Date Created"
              name="dateCreated"
              required
              value={formatDate(editedNote.dateCreated)}
              disabled
            />
            <TextField
              margin="dense"
              fullWidth
              label="Date Modified"
              name="dateModified"
              required
              value={formatDate(editedNote.dateModified)}
              disabled
            />
            <TextField
              margin="dense"
              fullWidth
              label="Views"
              name="views"
              required
              value={editedNote.views.toString()} // Convert to string if it's not a string
              disabled
            />
            <TextField
              margin="dense"
              fullWidth
              label="Published"
              name="published"
              required
              value={editedNote.published ? "Yes" : "No"} // Display Yes or No based on the boolean value
              disabled
            />

            <DialogActions>
              <Button type="button" onClick={closeEditModal} color="secondary">
                Cancel
              </Button>
              <Button type="button" onClick={handleSaveEdit} color="primary">
                Save
              </Button>
            </DialogActions>
          </form>
        </DialogContent>

      </Dialog>
    </Container>
  );
};

export default ViewUser;

function formatDate(dateTimeString: string): string {
  const date = new Date(dateTimeString);
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    timeZoneName: 'short',
  };

  return new Intl.DateTimeFormat('en-US', options).format(date);
}