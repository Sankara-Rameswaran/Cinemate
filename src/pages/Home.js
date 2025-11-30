import React, {useEffect, useState} from 'react';
import { fetchPopular, searchMovies } from '../api';
import MovieCard from '../ui/MovieCard';
import sample from '../sample-data';

export default function Home(){
  const [list,setList]=useState([]);
  const [query,setQuery]=useState('');
  const [results,setResults]=useState(null);
  const [loading,setLoading]=useState(false);

  useEffect(()=>{ fetchPopular().then(d=>setList(d.results||sample)).catch(()=>setList(sample)); },[]);

  async function doSearch(e){
    e && e.preventDefault();
    if(!query) { setResults(null); return; }
    setLoading(true);
    try{
      const res = await searchMovies(query);
      setResults(res.results || []);
    }catch(err){
      setResults([]);
    }finally{
      setLoading(false);
    }
  }

  const show = results !== null ? results : list.slice(0,8);

  return (
    <div className='container'>
      <section className='hero'>
        <div className='left'>
          <h1>Discover movies and actors</h1>
          <p className='muted'></p>
          <form className='search' onSubmit={doSearch} style={{marginTop:12}}>
            <input value={query} onChange={e=>setQuery(e.target.value)} type='search' placeholder='Search movies, e.g. Inception' />
            <button className='trailer-btn' type='submit'>Search</button>
            <button type='button' className='trailer-btn' style={{marginLeft:8}} onClick={()=>{
              setQuery(''); setResults(null);
            }}>Clear</button>
          </form>
        </div>
      </section>

      <h3>{results !== null ? 'Search results' : 'Popular'}</h3>
      {loading && <div className='muted'>Loading…</div>}
      <div className='grid'>{show.map(m=> <MovieCard key={m.id} movie={m} />)}</div>
    </div>
  )
}
