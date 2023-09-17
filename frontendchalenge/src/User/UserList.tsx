import React, { FormEvent, useEffect, useState } from 'react';
import Axios from 'axios';
import { toast } from 'react-toastify';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextField,
    IconButton,
    Divider,
    Chip
} from '@mui/material';
import { CleaningServicesTwoTone, Delete, Edit, Visibility } from '@mui/icons-material';
import ViewUser from './ViewUser';
import { Link } from 'react-router-dom';


interface User {
    id: number;
    firstName: string;
    lastName?: string;
    email: string;
    age: number;
    website?: string;
}

const UserList = () => {
    const baseUrl = 'http://localhost:5102/';
    const [users, setUsers] = useState<User[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setEditIsModalOpen] = useState(false);
    const [isViewingModalOpen, setViewingIsModalOpen] = useState(false);
    const [viewId, setViewId] = useState<number>(0);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [userData, setUserData] = useState<User>({
        id: 0,
        firstName: '',
        lastName: '',
        email: '',
        age: Number.NaN,
        website: '',
    });

    const openEditModal = (user: User) => {
        setEditingUser(user);
        setEditIsModalOpen(true);
    };

    const closeEditModal = () => {
        setEditIsModalOpen(false);
    };


    const updateUser = async (event: FormEvent) => {
        event.preventDefault();
        try {
            const response = await Axios.put(`${baseUrl}api/users/${editingUser?.id}`, editingUser);

            if (response.status === 204) {
                // setEditIsModalOpen(false);
                toast.success(`User successfully updated`, {
                    position: "top-right",
                    autoClose: 3000,
                });
                setEditingUser(null); // Clear the editingUser state
            }
        } catch (error) {
            toast.error(`User could not be updated`, {
                position: "top-right",
                autoClose: 3000,
            });
        }
    };

    const handleInputChange = (event: { target: { name: any; value: any; }; }) => {
        const { name, value } = event.target;
        setUserData({ ...userData, [name]: value });

    };

    const createUser = async (event: FormEvent) => {
        event.preventDefault();

        try {
            const response = await Axios.post(`${baseUrl}api/users`, userData);

            if (response.status === 201) {
                setIsModalOpen(false);
                toast.success(`User successfully created`, {
                    position: "top-right",
                    autoClose: 3000,
                });
            }
        } catch (error: any) {
            if (error.response.status === 400) {
                setIsModalOpen(false);
                toast.warning(`Email is already taken`, {
                    position: "top-right",
                    autoClose: 3000,
                });
            }
            else {

                toast.error(`User could not be created`, {
                    position: "top-right",
                    autoClose: 3000,
                });
            }

            setIsModalOpen(false);
        }
    };

    const handleDeleteUser = (userId: number) => {
        try {

            Axios.delete(`${baseUrl}api/users/${userId}`);
            setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
            toast.success(`User successfully deleted.`, {
                position: "top-right",
                autoClose: 3000,
            });

        } catch (error) {
            toast.error(`User with ID ${userId} could not deleted.`, {
                position: "top-right",
                autoClose: 3000,
            });
            console.error(`Error deleting user with ID ${userId}:`, error);
        }
    };



    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };





    useEffect(() => {
        Axios.get(`${baseUrl}api/users`)
            .then((response) => {
                console.log("data:", response.data);
                setUsers(response.data);
            })
            .catch((error) => {
                console.log('error message:', error.message)
            });
    }, [isModalOpen]);



    return (
        <>
            <Divider style={{ marginBottom: '15px' }}>
                <Chip label="USERSLIST" />
            </Divider>
            <Button style={{ marginBottom: '15px' }} variant="outlined" color="primary" onClick={openModal}>
                Create New User
            </Button>
            <TableContainer style={{ width: '700px' }} component={Paper}>

                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>First Name</TableCell>
                            <TableCell>Last Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Age</TableCell>
                            <TableCell>Website</TableCell>
                            <TableCell>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell>{user.firstName}</TableCell>
                                <TableCell>{user.lastName}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{user.age}</TableCell>
                                <TableCell>{user.website}</TableCell>
                                <TableCell>
                                    {/* Icons for viewing, editing, and deleting users */}
                                    <Link to={`/user/${user.id}`}>

                                        <IconButton color="primary">
                                            <Visibility />
                                        </IconButton>
                                    </Link>
                                    <IconButton color="primary">
                                        <Edit onClick={() => openEditModal(user)} />
                                    </IconButton>
                                    <IconButton onClick={() => handleDeleteUser(user.id)} color="secondary">
                                        <Delete />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            {/* for creating user */}
            <Dialog open={isModalOpen} onClose={closeModal}>
                <DialogTitle>Create New User</DialogTitle>
                <DialogContent>
                    <form onSubmit={createUser}>
                        <TextField
                            autoFocus
                            margin="dense"
                            label="First Name"
                            type="text"
                            name="firstName"
                            required
                            value={userData.firstName}
                            onChange={handleInputChange}
                            fullWidth
                        />
                        <TextField
                            margin="dense"
                            label="Last Name"
                            type="text"
                            name="lastName"
                            value={userData.lastName}
                            onChange={handleInputChange}
                            fullWidth
                        />
                        <TextField
                            margin="dense"
                            label="Email"
                            type="email"
                            name="email"
                            value={userData.email}
                            onChange={handleInputChange}
                            fullWidth
                            required
                        />
                        <TextField
                            margin="dense"
                            label="Age"
                            type="number"
                            name="age"
                            value={userData.age}
                            onChange={handleInputChange}
                            fullWidth
                            required
                        />
                        <TextField
                            margin="dense"
                            label="Website"
                            type="text"
                            name="website"
                            value={userData.website}
                            onChange={handleInputChange}
                            fullWidth

                        />
                        <Button type="submit" variant='contained' color="primary">
                            Submit
                        </Button>
                    </form>
                </DialogContent>

            </Dialog>

            {/* for editing user */}
            <Dialog open={isEditModalOpen} onClose={closeEditModal}>
                <DialogTitle>Edit User</DialogTitle>
                <DialogContent>
                    {editingUser && (
                        <form onSubmit={updateUser}>
                            {/* Render user data in the form */}
                            <TextField
                                autoFocus
                                margin="dense"
                                label="First Name"
                                type="text"
                                name="firstName"
                                required
                                value={editingUser.firstName}
                                onChange={(e) => setEditingUser({ ...editingUser, firstName: e.target.value })}
                                fullWidth
                            />
                            <TextField
                                margin="dense"
                                label="Last Name"
                                type="text"
                                name="lastName"
                                value={editingUser.lastName}
                                onChange={(e) => setEditingUser({ ...editingUser, lastName: e.target.value })}
                                fullWidth
                            />
                            <TextField
                                margin="dense"
                                label="Email"
                                type="email"
                                name="email"
                                value={editingUser.email}
                                onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                                fullWidth
                                required
                            />
                            <TextField
                                margin="dense"
                                label="Age"
                                type="number"
                                name="age"
                                value={editingUser.age}
                                onChange={(e) => setEditingUser({ ...editingUser, age: parseInt(e.target.value, 10) })}
                                fullWidth
                                required
                            />
                            <TextField
                                margin="dense"
                                label="Website"
                                type="text"
                                name="website"
                                value={editingUser.website}
                                onChange={(e) => setEditingUser({ ...editingUser, website: e.target.value })}
                                fullWidth
                            />
                            <Button type="submit" variant="contained" color="primary">
                                Update
                            </Button>
                        </form>
                    )}
                </DialogContent>
            </Dialog>
        </>

    );
}

export default UserList;