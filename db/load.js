const fs = require('node:fs/promises');
const path = require('node:path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const sql = require('mssql');

const databaseName = process.env.DB_NAME || '';
const artists = [
  ['AR001', 'Alina Wren', 'Reykjavik, Iceland'],
  ['AR002', 'Kofi Adom', 'Accra, Ghana'],
  ['AR003', 'Sena Blue', 'Pretoria, South Africa'],
  ['AR004', 'Ari Solenne', 'Portland, United States'],
  ['AR005', 'Lia Moreira', 'Recife, Brazil'],
  ['AR006', 'Jonah Vale', 'Detroit, United States'],
  ['AR007', 'Nia Marlow', 'London, United Kingdom'],
  ['AR008', 'Theo Calder', 'Melbourne, Australia'],
  ['AR009', 'Mira Sol', 'Manila, Philippines'],
  ['AR010', 'Eli Navarro', 'Madrid, Spain'],
  ['AR011', 'June Wilder', 'Asheville, United States'],
  ['AR012', 'Rowan Finch', 'Dublin, Ireland'],
  ['AR013', 'The North Windows', 'Vancouver, Canada'],
  ['AR014', 'Luna y Sol', 'Valparaiso, Chile'],
  ['AR015', 'Amara Ellis', 'New Orleans, United States'],
  ['AR016', 'Mateo Luz', 'San Juan, Puerto Rico'],
  ['AR017', 'Vera Static', 'Berlin, Germany'],
  ['AR018', 'Noah Kestrel', 'Bristol, United Kingdom'],
  ['AR019', 'Blue Signal Club', 'Tokyo, Japan'],
  ['AR020', 'Sora Ndlovu', 'Cape Town, South Africa']
];

const albums = [
  ['AL001', 'AR001', 'Soft Coordinates', 2023],
  ['AL002', 'AR002', 'Sunwise', 2022],
  ['AL003', 'AR003', 'Blue Hour Market', 2024],
  ['AL004', 'AR004', 'Open Sky Rooms', 2021],
  ['AL005', 'AR005', 'At the Small Cafe', 2020],
  ['AL006', 'AR006', 'Velvet Postcard', 2019],
  ['AL007', 'AR007', 'Peach Neon', 2024],
  ['AL008', 'AR008', 'Afterlight Sessions', 2022],
  ['AL009', 'AR009', 'Cloud Atlas Motel', 2021],
  ['AL010', 'AR010', 'Soft Circuits', 2025],
  ['AL011', 'AR011', 'Wildflower Maps', 2020],
  ['AL012', 'AR012', 'The Long Way Home', 2023],
  ['AL013', 'AR013', 'Friendly Static', 2022],
  ['AL014', 'AR014', 'Agua de Abril', 2024],
  ['AL015', 'AR015', 'Copper and Honey', 2021],
  ['AL016', 'AR016', 'Cielo de Noche', 2023],
  ['AL017', 'AR017', 'Future Keepsakes', 2024],
  ['AL018', 'AR018', 'Windowseat Echoes', 2019],
  ['AL019', 'AR019', 'Blue Signal', 2022],
  ['AL020', 'AR020', 'Many Rivers, One Sky', 2025]
];

const genres = [
  ['GN001', 'Indie pop', 'Melodic pop with a handmade, independent edge.'],
  ['GN002', 'Afrobeat', 'Layered West African rhythms, horns, and long grooves.'],
  ['GN003', 'Amapiano', 'South African dance music with deep log-drum bass.'],
  ['GN004', 'Ambient', 'Atmospheric sound built for slow, focused listening.'],
  ['GN005', 'Bossa nova', 'Soft Brazilian guitar rhythms with a relaxed sway.'],
  ['GN006', 'Classic soul', 'Expressive vocals over warm, groove-led arrangements.'],
  ['GN007', 'Dance-pop', 'Bright pop hooks made for the dance floor.'],
  ['GN008', 'Deep house', 'Smooth, steady electronic grooves with rich low end.'],
  ['GN009', 'Dream pop', 'Hazy vocals and shimmering, spacious guitars.'],
  ['GN010', 'Electronic', 'Synth-led music shaped by inventive sound design.'],
  ['GN011', 'Folk-pop', 'Acoustic storytelling paired with pop melodies.'],
  ['GN012', 'Indie folk', 'Intimate songwriting with organic instrumentation.'],
  ['GN013', 'Indie rock', 'Guitar-driven songs with an independent spirit.'],
  ['GN014', 'Latin pop', 'Polished pop melodies with Latin rhythms.'],
  ['GN015', 'Neo-soul', 'Soulful vocals, modern harmony, and relaxed grooves.'],
  ['GN016', 'Reggaeton', 'Syncopated Caribbean rhythms and dancehall-inspired beats.'],
  ['GN017', 'Synth-pop', 'Catchy pop built around bright synthesizers.'],
  ['GN018', 'Trip-hop', 'Moody, downtempo beats with cinematic textures.'],
  ['GN019', 'UK garage', 'Swinging British club rhythms and nimble basslines.'],
  ['GN020', 'World fusion', 'Contemporary songwriting across musical traditions.']
];

const tracks = [
  ['TR0001', 'Paper Satellites', 'AL001', 'GN001', 218, 'Bright, late-night drive', 0.62, 0.71],
  ['TR0002', 'Palmline', 'AL001', 'GN002', 231, 'Sunlit horns and an easy pulse', 0.78, 0.76],
  ['TR0003', 'Market at Blue Hour', 'AL002', 'GN002', 244, 'Layered percussion for an open-air evening', 0.81, 0.72],
  ['TR0004', 'Lowveld Lights', 'AL002', 'GN003', 207, 'Deep bass under a mellow dance groove', 0.72, 0.83],
  ['TR0005', 'Soft Landing', 'AL003', 'GN003', 226, 'Unhurried keys and a rolling rhythm', 0.66, 0.79],
  ['TR0006', 'A Room Made of Rain', 'AL003', 'GN004', 286, 'Quiet textures for a clear head', 0.24, 0.31],
  ['TR0007', 'Open Sky, Slow River', 'AL004', 'GN004', 301, 'Patient piano and drifting field sounds', 0.19, 0.28],
  ['TR0008', 'Blue Tile Morning', 'AL004', 'GN005', 194, 'Gentle guitar with a breezy sway', 0.43, 0.66],
  ['TR0009', 'Cafe Without Clocks', 'AL005', 'GN005', 202, 'A quiet table-side guitar melody', 0.39, 0.64],
  ['TR0010', 'Honey on the Needle', 'AL005', 'GN006', 219, 'Warm vocals over a patient backbeat', 0.58, 0.68],
  ['TR0011', 'Velvet Postcard', 'AL006', 'GN006', 236, 'Full-bodied vocals with a brass glow', 0.71, 0.69],
  ['TR0012', 'Peach Neon Sign', 'AL006', 'GN007', 198, 'A bright chorus built for a night out', 0.84, 0.86],
  ['TR0013', 'Tangerine Skies', 'AL007', 'GN007', 205, 'Bouncy hooks and a sun-up finish', 0.88, 0.89],
  ['TR0014', 'Blue Door at 2 AM', 'AL007', 'GN008', 257, 'A smooth club groove with room to breathe', 0.64, 0.82],
  ['TR0015', 'Afterlight', 'AL008', 'GN008', 263, 'Deep bass and soft lights after midnight', 0.69, 0.84],
  ['TR0016', 'Cloud Atlas Motel', 'AL008', 'GN009', 229, 'Floaty guitars with a soft-focus chorus', 0.52, 0.57],
  ['TR0017', 'Silver on the Window', 'AL009', 'GN009', 241, 'A hazy melody that slowly opens up', 0.47, 0.54],
  ['TR0018', 'Soft Circuits', 'AL009', 'GN010', 212, 'Playful synth patterns and crisp drums', 0.73, 0.78],
  ['TR0019', 'Small Machines', 'AL010', 'GN010', 223, 'Curious electronic details over a steady beat', 0.68, 0.74],
  ['TR0020', 'Wildflower Map', 'AL010', 'GN011', 216, 'Acoustic verses with a bright singalong', 0.56, 0.62],
  ['TR0021', 'Northbound Flowers', 'AL011', 'GN011', 228, 'A gentle melody with a hopeful lift', 0.51, 0.59],
  ['TR0022', 'The Long Way Home', 'AL011', 'GN012', 247, 'Fingerpicked guitar and close-up storytelling', 0.38, 0.48],
  ['TR0023', 'Tin Roof Constellations', 'AL012', 'GN012', 233, 'An intimate folk song with a wandering feel', 0.42, 0.51],
  ['TR0024', 'Friendly Static', 'AL012', 'GN013', 205, 'Crunchy guitars with a playful melody', 0.77, 0.65],
  ['TR0025', 'Quiet Thunder', 'AL013', 'GN013', 238, 'Warm guitars and a wide-open chorus', 0.74, 0.61],
  ['TR0026', 'Agua de Abril', 'AL013', 'GN014', 211, 'A bright rhythm with a breezy vocal line', 0.79, 0.81],
  ['TR0027', 'Mar de Colores', 'AL014', 'GN014', 219, 'Easy rhythm for a golden-hour walk', 0.76, 0.84],
  ['TR0028', 'Copper and Honey', 'AL014', 'GN015', 251, 'Silky harmonies over a loose pocket', 0.53, 0.63],
  ['TR0029', 'Slow Gold', 'AL015', 'GN015', 234, 'A thoughtful vocal over soft electric keys', 0.49, 0.58],
  ['TR0030', 'Cielo de Noche', 'AL015', 'GN016', 203, 'A steady dance beat with a cool-night feel', 0.86, 0.88],
  ['TR0031', 'Pasos de Arena', 'AL016', 'GN016', 216, 'A buoyant rhythm made for moving', 0.89, 0.91],
  ['TR0032', 'Future Keepsakes', 'AL016', 'GN017', 207, 'Shiny synths and a nostalgic pop chorus', 0.75, 0.82],
  ['TR0033', 'Polaroid Comet', 'AL017', 'GN017', 214, 'An upbeat synth melody with a soft edge', 0.71, 0.79],
  ['TR0034', 'Windowseat Echoes', 'AL017', 'GN018', 268, 'Dusty beats and a cinematic, rainy mood', 0.37, 0.55],
  ['TR0035', 'Blue Signal', 'AL018', 'GN018', 259, 'Low-key percussion with a midnight haze', 0.34, 0.51],
  ['TR0036', 'Night Bus Rhythm', 'AL018', 'GN019', 224, 'Quick, shuffling drums and nimble bass', 0.82, 0.87],
  ['TR0037', 'Last Train Home', 'AL019', 'GN019', 218, 'A lively club rhythm with a warm finish', 0.85, 0.89],
  ['TR0038', 'Many Rivers', 'AL019', 'GN020', 246, 'Hand percussion and strings in an open groove', 0.61, 0.69],
  ['TR0039', 'One Sky, Many Voices', 'AL020', 'GN020', 253, 'A thoughtful blend of acoustic and global textures', 0.57, 0.65],
  ['TR0040', 'Lanterns in the Rain', 'AL020', 'GN001', 222, 'Gentle pop with a small, glowing chorus', 0.55, 0.67]
];

function getConnectionConfig() {
  if (!/^[A-Za-z][A-Za-z0-9_]*_myapp$/.test(databaseName)) {
    throw new Error('Set DB_NAME in .env to your own database name, ending in _myapp.');
  }
  if (!process.env.DB_SERVER || !process.env.DB_USER || !process.env.DB_PASSWORD) {
    throw new Error('Set DB_SERVER, DB_USER, and DB_PASSWORD in .env before loading sample data.');
  }

  return {
    server: process.env.DB_SERVER,
    port: Number(process.env.DB_PORT || 1433),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: databaseName,
    options: { encrypt: true, trustServerCertificate: true }
  };
}

async function loadSampleData() {
  const pool = await sql.connect(getConnectionConfig());
  try {
    const schema = await fs.readFile(path.join(__dirname, 'schema.sql'), 'utf8');
    await pool.request().batch(schema);

    const transaction = new sql.Transaction(pool);
    await transaction.begin();
    try {
      const countsResult = await transaction.request().query(`
        SELECT
          (SELECT COUNT(*) FROM dbo.Artists) AS artistCount,
          (SELECT COUNT(*) FROM dbo.Albums) AS albumCount,
          (SELECT COUNT(*) FROM dbo.Genres) AS genreCount,
          (SELECT COUNT(*) FROM dbo.Tracks) AS trackCount;
      `);
      const counts = countsResult.recordset[0];
      if (Object.values(counts).some((count) => count > 0)) {
        throw new Error('The music tables already contain data. No rows were changed; inspect them before loading sample data.');
      }

      for (const [artistId, artistName, hometown] of artists) {
        await transaction.request()
          .input('artistId', sql.Char(5), artistId)
          .input('artistName', sql.NVarChar(100), artistName)
          .input('hometown', sql.NVarChar(80), hometown)
          .query(`
            INSERT INTO dbo.Artists (ArtistID, ArtistName, Hometown)
            VALUES (@artistId, @artistName, @hometown);
          `);
      }

      for (const [albumId, artistId, albumTitle, releaseYear] of albums) {
        await transaction.request()
          .input('albumId', sql.Char(5), albumId)
          .input('artistId', sql.Char(5), artistId)
          .input('albumTitle', sql.NVarChar(120), albumTitle)
          .input('releaseYear', sql.SmallInt, releaseYear)
          .query(`
            INSERT INTO dbo.Albums (AlbumID, ArtistID, AlbumTitle, ReleaseYear)
            VALUES (@albumId, @artistId, @albumTitle, @releaseYear);
          `);
      }

      for (const [genreId, genreName, genreDescription] of genres) {
        await transaction.request()
          .input('genreId', sql.Char(5), genreId)
          .input('genreName', sql.NVarChar(80), genreName)
          .input('genreDescription', sql.NVarChar(200), genreDescription)
          .query(`
            INSERT INTO dbo.Genres (GenreID, GenreName, GenreDescription)
            VALUES (@genreId, @genreName, @genreDescription);
          `);
      }

      for (const [trackId, trackTitle, albumId, genreId, durationSeconds, moodNote, energy, danceability] of tracks) {
        await transaction.request()
          .input('trackId', sql.Char(6), trackId)
          .input('trackTitle', sql.NVarChar(120), trackTitle)
          .input('albumId', sql.Char(5), albumId)
          .input('genreId', sql.Char(5), genreId)
          .input('durationSeconds', sql.SmallInt, durationSeconds)
          .input('moodNote', sql.NVarChar(120), moodNote)
          .input('energy', sql.Decimal(3, 2), energy)
          .input('danceability', sql.Decimal(3, 2), danceability)
          .query(`
            INSERT INTO dbo.Tracks (
              TrackID, TrackTitle, AlbumID, GenreID, DurationSeconds, MoodNote, Energy, Danceability
            )
            VALUES (
              @trackId, @trackTitle, @albumId, @genreId, @durationSeconds, @moodNote, @energy, @danceability
            );
          `);
      }

      await transaction.commit();
      console.log(`Loaded ${artists.length} artists, ${albums.length} albums, ${genres.length} genres, and ${tracks.length} tracks into ${databaseName}.`);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  } finally {
    await pool.close();
  }
}

loadSampleData().catch((error) => {
  console.error(`Sample data load failed: ${error.message}`);
  process.exitCode = 1;
});
