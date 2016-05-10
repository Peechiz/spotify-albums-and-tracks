// Self envoking function! once the document is ready, bootstrap our application.
// We do this to make sure that all the HTML is rendered before we do things
// like attach event listeners and any dom manipulation.
(function(){
  $(document).ready(function(){
    bootstrapSpotifySearch();
  })
})();

/**
  This function bootstraps the spotify request functionality.
*/
function bootstrapSpotifySearch(){

  var userInput, searchUrl, results;
  var outputArea = $("#q-results");

  $('#spotify-q-button').on("click", function(){
      var spotifyQueryRequest;
      spotifyQueryString = $('#spotify-q').val();
      searchUrl = "https://api.spotify.com/v1/search?type=artist&q=" + spotifyQueryString;

      // Generate the request object
      spotifyQueryRequest = $.ajax({
          type: "GET",
          dataType: 'json',
          url: searchUrl
      });

      // Attach the callback for success
      // (We could have used the success callback directly)
      spotifyQueryRequest.done(function (data) {
        var artists = data.artists;

        // Clear the output area
        outputArea.html('');

        // The spotify API sends back an array 'items'
        // Which contains the first 20 matching elements.
        // In our case they are artists.
        artists.items.forEach(function(artist){
          var artistLi = $("<li>" + artist.name + " - " + artist.id + "</li>")
          artistLi.attr('data-spotify-id', artist.id);
          outputArea.append(artistLi);

          artistLi.click(displayAlbumsAndTracks);
        })
      });

      // Attach the callback for failure
      // (Again, we could have used the error callback direcetly)
      spotifyQueryRequest.fail(function (error) {
        console.log("Something Failed During Spotify Q Request:")
        console.log(error);
      });
  });
}

/* COMPLETE THIS FUNCTION! */
function displayAlbumsAndTracks(event) {
  var appendToMe = $('#albums-and-tracks');
  var albumData;
  var albumsArr = [];

  // These two lines can be deleted. They're mostly for show.
  // console.log("you clicked on:");
  var aritistID = $(event.target).attr('data-spotify-id');

  var getAlbums = $.ajax({
      type: "GET",
      dataType: 'json',
      url: 'https://api.spotify.com/v1/artists/'+ aritistID +'/albums'
  });

  getAlbums.done(function(data){
    albumData = data.items;
    albumData.forEach(function(album){
      albumsArr.push({
        'name':album.name,
        'id':album.id,
        'img':album.images[0]
      });
    })
    if (albumData.length === albumsArr.length){
      console.log(albumsArr);
      albumsArr.forEach(function(album){

        var getAlbum = $.ajax({
          type:'GET',
          dataType: 'JSON',
          url: 'https://api.spotify.com/v1/albums/'+ album.id
        }).done(function(data){
          album.date = data.release_date;
        })

        var getTracks = $.ajax({
          type:'GET',
          dataType: 'JSON',
          url: 'https://api.spotify.com/v1/albums/'+ album.id +'/tracks'
        })

        getTracks.done(function(data){
          var tracks = data.items;
          appendToMe.append('<h3>'+album.name+': '+album.date+'</h3>')
          appendToMe.append('<img src="'+album.img.url+'">')
          appendToMe.append('<ol class="'+album.id+'">');
          for (var i = 0; i < tracks.length; i++) {
            // album.['track' + i ] = tracks[i].name;
            $('.'+album.id).append('<li>'+tracks[i].name+'</li>')
          }
          appendToMe.append('</ol>');
        })
      })
    }
  })
}

/* YOU MAY WANT TO CREATE HELPER FUNCTIONS OF YOUR OWN */
/* THEN CALL THEM OR REFERENCE THEM FROM displayAlbumsAndTracks */
/* THATS PERFECTLY FINE, CREATE AS MANY AS YOU'D LIKE */
