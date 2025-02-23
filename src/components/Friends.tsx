import React, { useState, useEffect } from 'react';
import {collection, getDocs} from "firebase/firestore";

interface FriendsProps {
    db: any;
    user: any;
}

const Friends: React.FC<FriendsProps> = ({ db }) => {
    const [users, setUsers] = useState<User[]>([]); // Type users state as an array of User objects

    useEffect(() => {
        const fetchUsers = async () => {
            // Fetch all users from profileData collection
            const friendCollectionRef = collection(db, 'profileData');
            const querySnapshot = await getDocs(friendCollectionRef);

            if (querySnapshot.empty) {
                console.log('No users found in the database.');
                return; // Exit if no users are found
            }

            // Log the snapshot to see the structure of data
            querySnapshot.docs.forEach(doc => {
                console.log(doc.id, doc.data()); // This will log the doc ID and the actual data
            });

            // Map through the documents and structure the user data
            const fetchedUsers = querySnapshot.docs.map((doc) => ({
                id: doc.id,  // Get the document ID
                username: doc.data().name || 'Unnamed User',  // Get the username field (default if not found)
                // Add any other fields like email, profilePicture, etc.
            }));

            setUsers(fetchedUsers);  // Update the state with the fetched users
        };

        fetchUsers();
    }, [db]);  // The effect will run whenever `db` changes

    return (
        <div>
            <h1>Users</h1>
            <ul>
                {users.map((user) => (
                    <li key={user.id}>{user.username}</li> 
                ))}
            </ul>
        </div>
    );
};

export default Friends;