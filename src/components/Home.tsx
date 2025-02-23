import React from "react";
import Events from "./Events";

interface HomeProps {
    db: any;
    user: any;
}

const Home: React.FC<HomeProps> = ({ db, user }) => {

    return (
        <div className="master-container">
            <img className="home-image" src="./src/assets/images/logo.png" alt="Mountain Biking" />
            <h1>Welcome to Hummingbird Outdoor MTB Trails</h1>
            <h2>Hi, {user?.name || "Rider"}!</h2>
            <p>Explore, save, and share your favorite trails!</p>
            <Events db={db} user={user} />
            {/*Include events component*/}
        </div>
    );
};

export default Home;
