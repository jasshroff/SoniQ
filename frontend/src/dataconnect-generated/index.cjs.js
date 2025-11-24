const { queryRef, executeQuery, mutationRef, executeMutation, validateArgs } = require('firebase/data-connect');

const connectorConfig = {
  connector: 'example',
  service: 'frontend',
  location: 'us-east4'
};
exports.connectorConfig = connectorConfig;

const createUserRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateUser');
}
createUserRef.operationName = 'CreateUser';
exports.createUserRef = createUserRef;

exports.createUser = function createUser(dc) {
  return executeMutation(createUserRef(dc));
};

const getSongsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetSongs');
}
getSongsRef.operationName = 'GetSongs';
exports.getSongsRef = getSongsRef;

exports.getSongs = function getSongs(dc) {
  return executeQuery(getSongsRef(dc));
};

const addSongToPlaylistRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'AddSongToPlaylist', inputVars);
}
addSongToPlaylistRef.operationName = 'AddSongToPlaylist';
exports.addSongToPlaylistRef = addSongToPlaylistRef;

exports.addSongToPlaylist = function addSongToPlaylist(dcOrVars, vars) {
  return executeMutation(addSongToPlaylistRef(dcOrVars, vars));
};

const getMyPlaylistsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetMyPlaylists');
}
getMyPlaylistsRef.operationName = 'GetMyPlaylists';
exports.getMyPlaylistsRef = getMyPlaylistsRef;

exports.getMyPlaylists = function getMyPlaylists(dc) {
  return executeQuery(getMyPlaylistsRef(dc));
};
