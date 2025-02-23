import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, doc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
interface FriendsProps {
    user: any;
    db: any;
}

const Friends: React.FC<FriendsProps> = ({ user, db }) => {
    const [users, setUsers] = useState<any[]>([]); // List of users to display
    const [searchTerm, setSearchTerm] = useState<string>(''); // Search input value
    const [friends, setFriends] = useState<string[]>([]); // List of friends for the logged-in user
    const [friendRequests, setFriendRequests] = useState<string[]>([]); // List of pending friend requests
    const [pendingRequests, setPendingRequests] = useState<string[]>([]); // List of user requests waiting approval

    useEffect(() => {
        if (user) {
            // Fetch users based on the user's state
            const fetchUsers = async () => {
                const usersCollectionRef = collection(db, 'profileData'); // Ref to profileData collection
                const q = query(usersCollectionRef, where('state', '==', user.state)); // Filter by state field
                const usersSnapshot = await getDocs(q); // Get the matching documents
                const usersList = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })); // Get user data and doc id
                setUsers(usersList); // Update the state with the fetched users
            };

            fetchUsers();

            // Fetch the current user's friends, friend requests, and pending requests
            const fetchFriends = async () => {
                const userDocRef = doc(db, 'profileData', user.uid); // Get user document by UID
                const userDoc = await getDoc(userDocRef); // Fetch user document
                if (userDoc.exists()) {
                    setFriends(userDoc.data().friends || []); // Set the list of friends
                    setFriendRequests(userDoc.data().friendRequests || []); // Set the list of friend requests
                    setPendingRequests(userDoc.data().pendingRequests || []); // Set the list of pending requests
                }
            };

            fetchFriends();
        }
    }, [user, db]); // Re-run when user or db changes

    const handleAddFriend = async (friendId: string) => {
        const userDocRef = doc(db, 'profileData', user.uid); // Ref to the current user's document
        await updateDoc(userDocRef, {
            pendingRequests: arrayUnion(friendId) // Add friendId to pendingRequests array
        });

        const friendDocRef = doc(db, 'profileData', friendId); // Ref to friend's document
        await updateDoc(friendDocRef, {
            friendRequests: arrayUnion(user.uid) // Add user UID to friend's friendRequests array
        });

        setPendingRequests([...pendingRequests, friendId]); // Update local pending requests state
    };

    const handleAcceptFriend = async (friendId: string) => {
        const userDocRef = doc(db, 'profileData', user.uid); // Ref to the current user's document
        await updateDoc(userDocRef, {
            friends: arrayUnion(friendId), // Add friendId to the user's friends list
            friendRequests: arrayRemove(friendId) // Remove friendId from the user's friendRequests list
        });

        const friendDocRef = doc(db, 'profileData', friendId); // Ref to friend's document
        await updateDoc(friendDocRef, {
            friends: arrayUnion(user.uid), // Add user UID to friend's friends list
            pendingRequests: arrayRemove(user.uid) // Remove user UID from friend's pendingRequests list
        });

        setFriends([...friends, friendId]); // Update local friends state
        setFriendRequests(friendRequests.filter(id => id !== friendId)); // Remove friendId from local friendRequests state
    };

    const handleRejectFriend = async (friendId: string) => {
        const userDocRef = doc(db, 'profileData', user.uid); // Ref to the current user's document
        await updateDoc(userDocRef, {
            friendRequests: arrayRemove(friendId) // Remove friendId from the user's friendRequests list
        });

        const friendDocRef = doc(db, 'profileData', friendId); // Ref to friend's document
        await updateDoc(friendDocRef, {
            pendingRequests: arrayRemove(user.uid) // Remove user UID from friend's pendingRequests list
        });

        setFriendRequests(friendRequests.filter(id => id !== friendId)); // Update local friendRequests state
    };

    const handleRemoveFriend = async (friendId: string) => {
        const userDocRef = doc(db, 'profileData', user.uid); // Ref to the current user's document
        await updateDoc(userDocRef, {
            friends: arrayRemove(friendId) // Remove friendId from the user's friends list
        });

        const friendDocRef = doc(db, 'profileData', friendId); // Ref to friend's document
        await updateDoc(friendDocRef, {
            friends: arrayRemove(user.uid) // Remove user UID from friend's friends list
        });

        setFriends(friends.filter(id => id !== friendId)); // Update local friends state
    };

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) // Filter users by name based on the search term
    );

    return (
        <div className="master-container">
            <h1>Friends</h1>
            <input
                type="text"
                placeholder="Search by name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)} // Update search term as user types
            />
            <h2>Pending Friend Requests</h2>
            <ul>
                {friendRequests.map(friendId => {
                    const friend = users.find(user => user.id === friendId); // Find the friend in the users list
                    return (
                        <li key={friendId}>
                            <span>{friend?.name}</span>
                            <button onClick={() => handleAcceptFriend(friendId)}>Accept</button>
                            <button onClick={() => handleRejectFriend(friendId)}>Reject</button>
                        </li>
                    );
                })}
            </ul>
            <h2>All Users</h2>
            <ul>
                {filteredUsers.map(user => (
                    <li key={user.id}>
                        <span>{user.name}</span>
                        {friends.includes(user.id) ? (
                            <button onClick={() => handleRemoveFriend(user.id)}>Remove Friend</button>
                        ) : pendingRequests.includes(user.id) ? (
                            <button disabled>Pending</button>
                        ) : (
                            <button onClick={() => handleAddFriend(user.id)}>Add Friend</button>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Friends;
