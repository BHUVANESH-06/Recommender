import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Top.css';

const API_KEY = process.env.REACT_APP_TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

function Top({ genre }) {
    const [recommendations, setRecommendations] = useState([]);

    useEffect(() => {
        const getRecommendations = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/top', {
                    params: { genre }
                });
                const movieTitles = response.data;
                const movieData = await Promise.all(movieTitles.map(fetchMovieDetails));
                setRecommendations(movieData);
            } catch (error) {
                console.error('Error fetching recommendations:', error);
                setRecommendations([]);
            }
        };

        if (genre) {
            getRecommendations(); 
        }
    }, [genre]); 

    const fetchMovieDetails = async (title) => {
        try {
            const response = await axios.get(`${TMDB_BASE_URL}/search/movie`, {
                params: {
                    api_key: API_KEY,
                    query: title,
                },
            });
            const movie = response.data.results[0];
            return {
                title: movie.title,
                poster: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
            };
        } catch (error) {
            console.error('Error fetching movie details:', error);
            return { title, poster: '' };
        }
    };

    return (
        <div>
            <div className='container'>
                {recommendations.map((rec, index) => (
                    <div key={index} className='row'>
                        {rec.poster && <img src={rec.poster} alt={rec.title} className='poster' />}
                        <p>{rec.title}</p> 
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Top;