IF OBJECT_ID(N'dbo.Artists', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.Artists (
        ArtistID CHAR(5) NOT NULL CONSTRAINT PK_Artists PRIMARY KEY,
        ArtistName NVARCHAR(100) NOT NULL CONSTRAINT UQ_Artists_ArtistName UNIQUE,
        Hometown NVARCHAR(80) NOT NULL
    );
END;

IF OBJECT_ID(N'dbo.Genres', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.Genres (
        GenreID CHAR(5) NOT NULL CONSTRAINT PK_Genres PRIMARY KEY,
        GenreName NVARCHAR(80) NOT NULL CONSTRAINT UQ_Genres_GenreName UNIQUE,
        GenreDescription NVARCHAR(200) NOT NULL
    );
END;

IF OBJECT_ID(N'dbo.Albums', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.Albums (
        AlbumID CHAR(5) NOT NULL CONSTRAINT PK_Albums PRIMARY KEY,
        ArtistID CHAR(5) NOT NULL,
        AlbumTitle NVARCHAR(120) NOT NULL,
        ReleaseYear SMALLINT NOT NULL,
        CONSTRAINT FK_Albums_Artists FOREIGN KEY (ArtistID)
            REFERENCES dbo.Artists (ArtistID),
        CONSTRAINT CK_Albums_ReleaseYear CHECK (ReleaseYear BETWEEN 1900 AND 2100)
    );
END;

IF OBJECT_ID(N'dbo.Tracks', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.Tracks (
        TrackID CHAR(6) NOT NULL CONSTRAINT PK_Tracks PRIMARY KEY,
        AlbumID CHAR(5) NOT NULL,
        GenreID CHAR(5) NOT NULL,
        TrackTitle NVARCHAR(120) NOT NULL,
        DurationSeconds SMALLINT NOT NULL,
        MoodNote NVARCHAR(120) NOT NULL,
        Energy DECIMAL(3, 2) NOT NULL,
        Danceability DECIMAL(3, 2) NOT NULL,
        CONSTRAINT FK_Tracks_Albums FOREIGN KEY (AlbumID)
            REFERENCES dbo.Albums (AlbumID),
        CONSTRAINT FK_Tracks_Genres FOREIGN KEY (GenreID)
            REFERENCES dbo.Genres (GenreID),
        CONSTRAINT CK_Tracks_Duration CHECK (DurationSeconds BETWEEN 30 AND 1200),
        CONSTRAINT CK_Tracks_Energy CHECK (Energy BETWEEN 0 AND 1),
        CONSTRAINT CK_Tracks_Danceability CHECK (Danceability BETWEEN 0 AND 1)
    );
END;
