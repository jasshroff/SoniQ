import { CreateUserData, GetSongsData, AddSongToPlaylistData, AddSongToPlaylistVariables, GetMyPlaylistsData } from '../';
import { UseDataConnectQueryResult, useDataConnectQueryOptions, UseDataConnectMutationResult, useDataConnectMutationOptions} from '@tanstack-query-firebase/react/data-connect';
import { UseQueryResult, UseMutationResult} from '@tanstack/react-query';
import { DataConnect } from 'firebase/data-connect';
import { FirebaseError } from 'firebase/app';


export function useCreateUser(options?: useDataConnectMutationOptions<CreateUserData, FirebaseError, void>): UseDataConnectMutationResult<CreateUserData, undefined>;
export function useCreateUser(dc: DataConnect, options?: useDataConnectMutationOptions<CreateUserData, FirebaseError, void>): UseDataConnectMutationResult<CreateUserData, undefined>;

export function useGetSongs(options?: useDataConnectQueryOptions<GetSongsData>): UseDataConnectQueryResult<GetSongsData, undefined>;
export function useGetSongs(dc: DataConnect, options?: useDataConnectQueryOptions<GetSongsData>): UseDataConnectQueryResult<GetSongsData, undefined>;

export function useAddSongToPlaylist(options?: useDataConnectMutationOptions<AddSongToPlaylistData, FirebaseError, AddSongToPlaylistVariables>): UseDataConnectMutationResult<AddSongToPlaylistData, AddSongToPlaylistVariables>;
export function useAddSongToPlaylist(dc: DataConnect, options?: useDataConnectMutationOptions<AddSongToPlaylistData, FirebaseError, AddSongToPlaylistVariables>): UseDataConnectMutationResult<AddSongToPlaylistData, AddSongToPlaylistVariables>;

export function useGetMyPlaylists(options?: useDataConnectQueryOptions<GetMyPlaylistsData>): UseDataConnectQueryResult<GetMyPlaylistsData, undefined>;
export function useGetMyPlaylists(dc: DataConnect, options?: useDataConnectQueryOptions<GetMyPlaylistsData>): UseDataConnectQueryResult<GetMyPlaylistsData, undefined>;
