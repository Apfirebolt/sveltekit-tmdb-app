export interface PersonResponse {
    page: number;
    results: Person[];
    total_pages: number;
    total_results: number;
}

export interface Person {
    adult: boolean;
    gender: number | null;
    id: number;
    known_for: KnownFor[];
    known_for_department: string;
    name: string;
    popularity: number;
    profile_path: string | null;
}

export interface KnownFor {
    adult: boolean;
    backdrop_path: string | null;
    genre_ids: number[];
    id: number;
    media_type: 'movie' | 'tv';
    original_language: string;
    original_title?: string;
    original_name?: string;
    overview: string;
    popularity: number;
    poster_path: string | null;
    release_date?: string;
    first_air_date?: string;
    title?: string;
    name?: string;
    video?: boolean;
    vote_average: number;
    vote_count: number;
}

export interface DetailedPerson {
    adult: boolean;
    also_known_as: string[];
    biography: string;
    birthday: string | null;
    deathday: string | null;
    gender: number | null;
    homepage: string | null;
    id: number;
    imdb_id: string | null;
    known_for_department: string;
    name: string;
    place_of_birth: string | null;
    popularity: number;
    profile_path: string | null;
}

export interface ImageResponse {
    id: number;
    profiles: Image[];
}

export interface Image {
    aspect_ratio: number;
    height: number;
    iso_639_1: string | null;
    file_path: string;
    vote_average: number;
    vote_count: number;
    width: number;
}

export interface TaggedImageResponse {
    id: number;
    page: number;
    results: MediaImage[];
    total_pages: number;
    total_results: number;
}

export interface TaggedImage {
    aspect_ratio: number;
    file_path: string;
    height: number;
    id: string;
    iso_639_1: string | null;
    vote_average: number;
    vote_count: number;
    width: number;
    image_type: string;
    media: MediaDetails;
    media_type: string;
}

export interface MediaDetails {
    backdrop_path: string | null;
    id: number;
    title?: string;
    original_title?: string;
    overview: string;
    poster_path: string | null;
    media_type: 'movie' | 'tv';
    adult: boolean;
    original_language: string;
    genre_ids: number[];
    popularity: number;
    release_date?: string;
    video?: boolean;
    vote_average: number;
    vote_count: number;
}
