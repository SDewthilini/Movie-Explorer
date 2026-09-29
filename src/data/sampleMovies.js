export const sampleMovies = [
  { id: 27205, title: 'Inception', release_date: '2010-07-15', vote_average: 8.4, poster_path: '/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg', overview: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.' },
  { id: 157336, title: 'Interstellar', release_date: '2014-11-05', vote_average: 8.5, poster_path: '/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg', overview: 'A team of explorers travel beyond this galaxy to discover whether mankind has a future among the stars.' },
  { id: 693134, title: 'Dune: Part Two', release_date: '2024-02-27', vote_average: 8.2, poster_path: '/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg', overview: 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.' },
  { id: 11324, title: 'Shutter Island', release_date: '2010-02-14', vote_average: 8.2, poster_path: '/4GDy0PHYX3VRXUtwK5ysFbg3kEx.jpg', overview: 'A U.S. Marshal investigates the disappearance of a patient from a hospital for the criminally insane.' },
  { id: 550, title: 'Fight Club', release_date: '1999-10-15', vote_average: 8.4, poster_path: '/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg', overview: 'An office worker and a soap maker form an underground fight club that evolves into something much more.' },
  { id: 603, title: 'The Matrix', release_date: '1999-03-30', vote_average: 8.2, poster_path: '/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg', overview: 'A computer programmer discovers that reality as he knows it is a simulation and joins a rebellion to free humanity.' },
  { id: 438631, title: 'Dune', release_date: '2021-09-15', vote_average: 7.8, poster_path: '/d5NXSklXo0qyIYkgV94XAgMIckC.jpg', overview: 'A gifted young man must travel to the most dangerous planet in the universe to ensure the future of his family and people.' },
  { id: 872585, title: 'Oppenheimer', release_date: '2023-07-19', vote_average: 8.1, poster_path: '/ptpr0kGAckfQkJeJIt8st5dglvd.jpg', overview: 'The story of J. Robert Oppenheimer and his role in the development of the atomic bomb.' },
];

export const sampleDetails = (id) => {
  const movie = sampleMovies.find((item) => item.id === Number(id));
  if (!movie) return null;
  return {
    ...movie,
    tagline: 'A story worth discovering.',
    runtime: 148,
    genres: [{ id: 18, name: 'Drama' }, { id: 878, name: 'Science Fiction' }],
    credits: { cast: [
      { cast_id: 1, name: 'Featured cast', character: 'Lead role', profile_path: null },
      { cast_id: 2, name: 'Ensemble cast', character: 'Supporting role', profile_path: null },
    ] },
    videos: { results: [] },
    production_companies: [],
  };
};
