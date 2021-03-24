import { Track } from './track.model';

export interface PlayList {
  description: string;
  spotifyWeb: string;
  id: string;
  imageUrl?: string;
  name: string;
  songsTotal: number;
  tracks: Track[];
}
