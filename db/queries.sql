-- Bind @genre as NVARCHAR(80). Pass NULL to return tracks from every genre.
SELECT
    t.TrackTitle AS track,
    a.ArtistName AS artist,
    g.GenreName AS genre,
    al.AlbumTitle AS album,
    al.ReleaseYear AS releaseYear,
    t.DurationSeconds AS durationSeconds,
    t.MoodNote AS mood
FROM dbo.Tracks AS t
INNER JOIN dbo.Albums AS al ON al.AlbumID = t.AlbumID
INNER JOIN dbo.Artists AS a ON a.ArtistID = al.ArtistID
INNER JOIN dbo.Genres AS g ON g.GenreID = t.GenreID
WHERE @genre IS NULL OR g.GenreName = @genre
ORDER BY g.GenreName, a.ArtistName, t.TrackTitle;
