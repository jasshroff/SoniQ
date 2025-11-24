import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, MutationRef, MutationPromise } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;




export interface AddSongToPlaylistData {
  playlistItem_insert: PlaylistItem_Key;
}

export interface AddSongToPlaylistVariables {
  playlistId: UUIDString;
  songId: UUIDString;
  position: number;
}

export interface Artist_Key {
  id: UUIDString;
  __typename?: 'Artist_Key';
}

export interface CreateUserData {
  user_insert: User_Key;
}

export interface GetMyPlaylistsData {
  playlists: ({
    id: UUIDString;
    name: string;
    description?: string | null;
    isPublic?: boolean | null;
    songs_via_PlaylistItem: ({
      id: UUIDString;
      title: string;
      artist: {
        name: string;
      };
    } & Song_Key)[];
  } & Playlist_Key)[];
}

export interface GetSongsData {
  songs: ({
    id: UUIDString;
    title: string;
    artist: {
      name: string;
    };
  } & Song_Key)[];
}

export interface PlaylistItem_Key {
  playlistId: UUIDString;
  songId: UUIDString;
  __typename?: 'PlaylistItem_Key';
}

export interface Playlist_Key {
  id: UUIDString;
  __typename?: 'Playlist_Key';
}

export interface Rating_Key {
  userId: UUIDString;
  songId: UUIDString;
  __typename?: 'Rating_Key';
}

export interface Song_Key {
  id: UUIDString;
  __typename?: 'Song_Key';
}

export interface User_Key {
  id: UUIDString;
  __typename?: 'User_Key';
}

interface CreateUserRef {
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<CreateUserData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): MutationRef<CreateUserData, undefined>;
  operationName: string;
}
export const createUserRef: CreateUserRef;

export function createUser(): MutationPromise<CreateUserData, undefined>;
export function createUser(dc: DataConnect): MutationPromise<CreateUserData, undefined>;

interface GetSongsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetSongsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<GetSongsData, undefined>;
  operationName: string;
}
export const getSongsRef: GetSongsRef;

export function getSongs(): QueryPromise<GetSongsData, undefined>;
export function getSongs(dc: DataConnect): QueryPromise<GetSongsData, undefined>;

interface AddSongToPlaylistRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: AddSongToPlaylistVariables): MutationRef<AddSongToPlaylistData, AddSongToPlaylistVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: AddSongToPlaylistVariables): MutationRef<AddSongToPlaylistData, AddSongToPlaylistVariables>;
  operationName: string;
}
export const addSongToPlaylistRef: AddSongToPlaylistRef;

export function addSongToPlaylist(vars: AddSongToPlaylistVariables): MutationPromise<AddSongToPlaylistData, AddSongToPlaylistVariables>;
export function addSongToPlaylist(dc: DataConnect, vars: AddSongToPlaylistVariables): MutationPromise<AddSongToPlaylistData, AddSongToPlaylistVariables>;

interface GetMyPlaylistsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetMyPlaylistsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<GetMyPlaylistsData, undefined>;
  operationName: string;
}
export const getMyPlaylistsRef: GetMyPlaylistsRef;

export function getMyPlaylists(): QueryPromise<GetMyPlaylistsData, undefined>;
export function getMyPlaylists(dc: DataConnect): QueryPromise<GetMyPlaylistsData, undefined>;

