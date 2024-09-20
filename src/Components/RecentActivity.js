// src/components/RecentActivities.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const RecentActivities = () => {
    const [activities, setActivities] = useState([]);

    useEffect(() => {
        const fetchActivities = async () => {
            try {
                const response = await axios.get('http://localhost:3000/activities');
                setActivities(response.data);
            } catch (error) {
                console.error('Error fetching activities:', error);
            }
        };

        fetchActivities();
    }, []);

    return (
        <div className="activities">
            <h2>Recent Activities</h2>
            <ul>
                {activities.map(activity => (
                    <li key={activity.id}>
                        {activity.description} - <span>{new Date(activity.date).toLocaleDateString()}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default RecentActivities;
