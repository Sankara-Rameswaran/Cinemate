import React, {useEffect, useState} from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getMovieFull } from '../api';
import { IMG_BACKDROP, IMG_POSTER } from '../tmdb';
import MovieCard from '../ui/MovieCard';
import sample from '../sample-data';

function YouTubeModal({videoKey, onClose}){
  if(!videoKey) return null;
  return (
    <div className='modal-backdrop' onClick={onClose}>
      <div className='modal' onClick={e=>e.stopPropagation()}>
        <iframe width='100%' height='500' src={`https://www.youtube.com/embed/${videoKey}`} title='Trailer' frameBorder='0' allowFullScreen></iframe>
      </div>
    </div>
  )
}

export default function MovieDetails(){
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [trailer, setTrailer] = useState(null);

  useEffect(()=>{
    let mounted = true;
    setLoading(true);
    getMovieFull(id).then(d=>{
      if(!mounted) return;
      setMovie(d);
      // pick trailer from videos
      const vids = (d.videos && d.videos.results) || [];
      const yt = vids.find(v=>v.site==='YouTube' && v.type==='Trailer') || vids.find(v=>v.site==='YouTube');
      setTrailer(yt ? yt.key : null);
      setLoading(false);
    }).catch(()=>{ setMovie(sample.find(s=>String(s.id)===String(id))); setLoading(false) });
    return ()=> mounted=false;
  },[id]);

  if(loading) return <div className='container'><div className='muted'>Loading…</div></div>;
  if(!movie) return <div className='container'><h3>Not found</h3><p><Link to='/movies'>Back</Link></p></div>;

  const backdrop = movie.backdrop_path ? IMG_BACKDROP+movie.backdrop_path : '';
  const poster = movie.poster_path ? IMG_POSTER+movie.poster_path : '';
  const genres = movie.genres || [];
  const cast = (movie.credits && movie.credits.cast) ? movie.credits.cast.slice(0,12) : [];
  const similar = (movie.similar && movie.similar.results) ? movie.similar.results.slice(0,8) : [];

  return (
    <div>
      <section className='movie-hero' style={{backgroundImage: `url(${backdrop})`}}>
        <div className='container inner'>
          <img src={poster} alt='' style={{width:200,borderRadius:8}} className='poster-small' />
          <div className='meta'>
            <h1>{movie.title} <span className='muted' style={{fontSize:16}}>({movie.release_date ? movie.release_date.slice(0,4): ''})</span></h1>
            <div style={{marginTop:8}}>
              <span className='rating'>{movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}</span>
              <button className='trailer-btn' onClick={()=>setTrailer(prev=>prev||((movie.videos&&movie.videos.results[0])?movie.videos.results[0].key:null))}>Play Trailer</button>
            </div>
            <div className='genres'>
              {genres.map(g=> <div key={g.id} className='genre-pill'>{g.name}</div>)}
            </div>
            <p style={{marginTop:12}}>{movie.tagline || ''}</p>
            <p style={{marginTop:12}}>{movie.overview}</p>
          </div>
        </div>
      </section>

      <div className='container'>
        <h3>Cast</h3>
        <div className='cast-row'>
          {cast.map(c=>(
            <Link key={c.cast_id||c.credit_id} to={`/person/${c.id}`} className='cast-card' style={{textDecoration:'none'}}>
              <img src={c.profile_path ? IMG_POSTER+c.profile_path : 'https://via.placeholder.com/200x280?text=No+Image'} alt={c.name} />
              <div className='muted'>{c.name}</div>
              <div style={{fontSize:13}}>{c.character}</div>
            </Link>
          ))}
        </div>

        <h3>More like this</h3>
        <div className='similar-grid'>
          {similar.map(s=> <MovieCard key={s.id} movie={s} />)}
        </div>
      </div>

      {trailer && <YouTubeModal videoKey={trailer} onClose={()=>setTrailer(null)} />}
    </div>
  )
}
