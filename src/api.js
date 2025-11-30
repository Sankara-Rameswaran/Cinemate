import { API_KEY, API_BASE } from './tmdb';

async function fetchJson(url){
  const res = await fetch(url);
  if(!res.ok) throw new Error('API error '+res.status);
  return res.json();
}

export function fetchPopular(page=1){
  return fetchJson(`${API_BASE}/movie/popular?api_key=${API_KEY}&language=en-US&page=${page}`);
}

export function searchMovies(query,page=1){
  return fetchJson(`${API_BASE}/search/movie?api_key=${API_KEY}&language=en-US&query=${encodeURIComponent(query)}&page=${page}&include_adult=false`);
}

export function getMovieFull(id){
  // include videos, credits, similar in one request
  return fetchJson(`${API_BASE}/movie/${id}?api_key=${API_KEY}&language=en-US&append_to_response=videos,credits,similar,release_dates`);
}


export function getPersonFull(id){
  // includes movie_credits
  return fetchJson(`${API_BASE}/person/${id}?api_key=${API_KEY}&language=en-US&append_to_response=movie_credits,combined_credits`);
}

export function getMovieSimilar(id,page=1){
  return fetchJson(`${API_BASE}/movie/${id}/similar?api_key=${API_KEY}&language=en-US&page=${page}`);
}
