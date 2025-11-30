import React, {useEffect, useState} from 'react';
import MovieCard from '../ui/MovieCard';
import { fetchPopular } from '../api';
import sample from '../sample-data';
export default function Movies(){
  const [movies,setMovies]=useState([]); const [page,setPage]=useState(1);
  useEffect(()=>{ fetchPopular(page).then(d=>setMovies(d.results||sample)).catch(()=>setMovies(sample)); },[page]);
  return (
    <div className='container'>
      <h2>Popular Movies</h2>
      <div className='grid'>{movies.map(m=> <MovieCard key={m.id} movie={m} />)}</div>
      <div style={{display:'flex',gap:8,justifyContent:'center',marginTop:20}}>
        <button className='trailer-btn' onClick={()=>setPage(p=>Math.max(1,p-1))}>Prev</button>
        <div className='muted' style={{alignSelf:'center'}}>Page {page}</div>
        <button className='trailer-btn' onClick={()=>setPage(p=>p+1)}>Next</button>
      </div>
    </div>
  )
}
