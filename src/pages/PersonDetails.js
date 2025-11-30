import React, {useEffect, useState} from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPersonFull, getMovieSimilar } from '../api';
import { IMG_POSTER, IMG_BACKDROP } from '../tmdb';
import MovieCard from '../ui/MovieCard';
import sample from '../sample-data';

export default function PersonDetails(){
  const { id } = useParams();
  const [person, setPerson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [similar, setSimilar] = useState([]);
  const [credits, setCredits] = useState([]);

  useEffect(()=>{
    let mounted = true;
    setLoading(true);
    getPersonFull(id).then(d=>{
      if(!mounted) return;
      setPerson(d);
      // keep credits sorted by release date desc
      const allCredits = (d.movie_credits && d.movie_credits.cast) ? d.movie_credits.cast.slice().sort((a,b)=>{
        const da = a.release_date||a.first_air_date||'0000';
        const db = b.release_date||b.first_air_date||'0000';
        return db.localeCompare(da);
      }) : [];
      setCredits(allCredits);
      // fetch similar movies using the most popular movie if available
      const top = allCredits.find(c=>c.id && (c.poster_path||c.backdrop_path||c.poster));
      if(top && top.id){
        getMovieSimilar(top.id).then(s=>{
          if(mounted) setSimilar(s.results || []);
        }).catch(()=>{});
      }
      setLoading(false);
    }).catch(()=>{ setPerson(null); setLoading(false) });
    return ()=> mounted=false;
  },[id]);

  if(loading) return <div className='container'><div className='muted'>Loading…</div></div>;
  if(!person) return <div className='container'><h3>Actor not found</h3><p><Link to='/'>Go home</Link></p></div>;

  const profile = person.profile_path ? IMG_POSTER+person.profile_path : '';
  const backdrop = person.popular_movie_backdrop || (person.movie_credits && person.movie_credits.cast && person.movie_credits.cast[0] && person.movie_credits.cast[0].backdrop_path) ? IMG_BACKDROP+(person.movie_credits.cast[0].backdrop_path||'') : '';
  const known = (person.movie_credits && person.movie_credits.cast) ? person.movie_credits.cast.slice().sort((a,b)=> (b.popularity||0)-(a.popularity||0)).slice(0,8) : [];

  return (
    <div>
      <section className='movie-hero' style={{backgroundImage: `url(${backdrop})`}}>
        <div className='container inner'>
          
              <Link to={'/person/'+id} style={{textDecoration:'none'}}>
                <img src={profile} alt={person.name} style={{width:220,borderRadius:8,boxShadow:'0 8px 24px rgba(0,0,0,0.6)'}} />
              </Link>

          <div className='meta'>
            <h1>{person.name} <span className='muted' style={{fontSize:16}}>{person.birthday ? '('+person.birthday.slice(0,4)+')' : ''}</span></h1>
            <div style={{marginTop:8,display:'flex',gap:12,flexWrap:'wrap',alignItems:'center'}}>
              <div className='rating'>Popularity: {(person.popularity||0).toFixed(1)}</div>
              {person.known_for_department && <div className='genre-pill'>{person.known_for_department}</div>}
              {person.place_of_birth && <div className='muted' style={{fontSize:13}}>{person.place_of_birth}</div>}
            </div>
            <p style={{marginTop:12}}>{person.biography ? (person.biography.length>320 ? person.biography.slice(0,320)+'...' : person.biography) : 'No biography available.'}</p>
            {person.imdb_id && <p style={{marginTop:8}}><a target='_blank' rel='noreferrer' href={`https://www.imdb.com/name/${person.imdb_id}`}>View on IMDB</a></p>}
          </div>
        </div>
      </section>

      <div className='container' style={{marginTop:20}}>
        <h3>Known for</h3>
        <div className='grid'>
          {known.map(m=> <MovieCard key={m.id} movie={m} />)}
        </div>

        <h3 style={{marginTop:18}}>Filmography</h3>
        <div style={{marginTop:8}}>
          {credits.length===0 && <div className='muted'>No credits available.</div>}
          {credits.map(c=>(
            <div key={c.credit_id||c.id} style={{display:'flex',gap:12,alignItems:'center',padding:'10px 0',borderBottom:'1px solid rgba(255,255,255,0.02)'}}>
              <img src={c.poster_path ? IMG_POSTER+c.poster_path : (c.poster ? c.poster : 'https://via.placeholder.com/120x180?text=No+Image')} alt={c.title||c.name} style={{width:80,height:120,objectFit:'cover',borderRadius:6}} />
              <div>
                <Link to={'/movie/'+c.id} style={{textDecoration:'none',color:'inherit'}}><div style={{fontWeight:700}}>{c.title||c.name}</div></Link>
                <div className='muted' style={{fontSize:13}}>{c.release_date ? c.release_date.slice(0,4) : (c.first_air_date ? c.first_air_date.slice(0,4) : '')} • {c.character || c.job || ''}</div>
                <div style={{marginTop:6}}>{c.overview ? (c.overview.slice(0,140)+'...') : ''}</div>
              </div>
            </div>
          ))}
        </div>

        <h3 style={{marginTop:18}}>Similar movies (from top credited movie)</h3>
        <div className='grid'>
          {similar.map(m=> <MovieCard key={m.id} movie={m} />)}
        </div>
      </div>
    </div>
  )
}
