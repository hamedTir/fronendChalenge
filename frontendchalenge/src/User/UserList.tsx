import React, { FormEvent, useEffect, useState } from 'react';
import Axios from 'axios';
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
} from '@mui/material';
import { CleaningServicesTwoTone } from '@mui/icons-material';

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
    const [userData, setUserData] = useState<User>({
        id: 0,
        firstName: '',
        lastName: '',
        email: '',
        age: Number.NaN,
        website: '',
    });

    const handleInputChange = (event: { target: { name: any; value: any; }; }) => {
        const { name, value } = event.target;
        setUserData({ ...userData, [name]: value });

    };

    const createUser = (event: FormEvent) => {
        console.log("dataaaa", userData);
        event.preventDefault();
        Axios.post(`${baseUrl}api/users`, userData)
            .then((response) => {
                if(response.status == 201) {setIsModalOpen(false)}
                // Handle successful creation
                // You can add a success message or reset the form here
            })
            .catch((error) => {
                console.log('error message:', error.message)
                setIsModalOpen(false)
            });
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

            <Button style={{ marginBottom: '15px' }} variant="outlined" color="primary" onClick={openModal}>
                Create New User
            </Button>
            <TableContainer component={Paper}>

                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>First Name</TableCell>
                            <TableCell>Last Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Age</TableCell>
                            <TableCell>Website</TableCell>
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
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

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
        </>

    );
}

export default UserList;