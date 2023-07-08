# REST MusicAPI

### Apa itu MusicAPI ?
Proyek backend REST MusicAPI adalah proyek pengembangan sistem yang bertujuan untuk menyediakan layanan API (Application Programming Interface) untuk mengelola dan menyediakan data terkait musik. API ini memungkinkan pengguna untuk melakukan berbagai operasi terhadap data musik, seperti pencarian, penambahan, pengeditan, dan penghapusan.
### Fitur Pada Aplikasi
* Users dapat mendaftar dan login dengan akun mereka.
* Public (non-authenticated) hanya bisa mengakes beberapa endpoint.
* Authenticated users dapat mengakses semua data pribadi akun tersebut baik membuat, mengedit, maupun menghapus enpoint Playlist, Album, Song, dan AlbumLike.
* Menggunakan Memurai untuk caching.
* Dapat mengupload foto.
* Dapat meng-export data Playlist.
* Menggukan Authorization sehingga data pribadi users aman.
### Panduan Insalasi
* Clone repositori ini.
* Jalankan `npm install` untuk meng-install semua dependencies.
* Buat sebuah `.env` file pada root folder dan tambahkan variable yang dibutuhkan. Lihat `.env.example` untuk lebih jelas.
* Jalankan `npm run migrate` untuk membuat table.
### Penggunaan
Untuk menjalankan Aplikasi :

    npm run start-dev

## API Endpoints
### Albums
| Endpoint | Body Request | Response | Keterangan |
| --- | --- | --- | --- |
| POST /albums | <ul><li>name: string</li><li>year: number</li></ul> | status code: 201 (created)<br> body:<ul><li>status: success</li><li>data:<ul><li>albumId: "album_id"</ul></li></li></ul> | Menambahkan Album. |
| GET /albums | - | status code: 200 (ok)<br> body:<ul><li>status: success</li><li>data:<ul><li>albumId: album | Mendapatkan album berdasarkan id. |
| PUT /albums/{id} | <ul><li>name: string</li><li>year: number</li></ul> | status code: 200 (ok)<br> body:<ul><li>status: success</li><li>message: *any | Mengubah album berdasarkan id album. |
| DELETE /albums/{id} | - | status code: 200 (ok)<br> body:<ul><li>status: success</li><li>message: any* | Menghapus album berdasarkan id album. |

### Album Output
`GET /album/{id}`

    {
        "status": "success",
        "data": {
            "album": {
            "id": "album-Mk8AnmCp210PwT6B",
            "name": "Viva la Vida",
            "year": 2008
            }
        }
    }

### Songs
| Endpoint | Body Request | Response | Keterangan |
| --- | --- | --- | --- |
| POST /songs | <ul><li>title: string</li><li>year: number</li></ul><ul><li>genre: string</li><li>performer: string</li></ul><ul><li>duration: number</li><li>albumId: string</li></ul> | status code: 201 (created)<br> body:<ul><li>status: success</li><li>data:<ul><li>songId: "song_id"</ul></li></li></ul> | Menambahkan lagu. |
| GET /songs | - | status code: 200 (ok)<br> body:<ul><li>status: success</li><li>data:<ul><li>songs: songs | Mendapatkan seluruh lagu. |
| GET /songs/{id} | - | status code: 200 (ok)<br> body:<ul><li>status: success</li><li>data:<ul><li>songs: song | Mendapatkan lagu berdasarkan id. |
| PUT /songs/{id} | <ul><li>title: string</li><li>year: number</li></ul><ul><li>genre: string</li><li>performer: string</li></ul><ul><li>duration: number</li><li>albumId: string</li></ul> | status code: 201 (created)<br> body:<ul><li>status: success</li><li>message: *any</li> | Mengubah lagu berdasarkan id lagu. |
| DELETE /songs/{id} | - | status code: 200 (ok)<br> body:<ul><li>status: success</li><li>message: *any | Menghapus lagu berdasarkan id. |

### Songs Output
`GET /songs/{id}`

    {
        "status": "success",
        "data": {
            "songs": [
                {
                    "id": "song-Qbax5Oy7L8WKf74l",
                    "title": "Life in Technicolor",
                    "performer": "Coldplay"
                },
                {
                    "id": "song-poax5Oy7L8WKllqw",
                    "title": "Centimeteries of London",
                    "performer": "Coldplay"
                },
                {
                    "id": "song-Qalokam7L8WKf74l",
                    "title": "Lost!",
                    "performer": "Coldplay"
                }
            ]
        }
    }

`GET /songs/{id}`

    {
        "status": "success",
        "data": {
            "song": {
                "id": "song-Qbax5Oy7L8WKf74l",
                "title": "Life in Technicolor",
                "year": 2008,
                "performer": "Coldplay",
                "genre": "Indie",
                "duration": 120,
                "albumId": "album-Mk8AnmCp210PwT6B"
            }
        }
    }

### Users
| Endpoint | Body Request | Response | Keterangan |
| --- | --- | --- | --- |
| POST /users | <ul><li>username: string</li><li>password: string</li></ul><li>fullname: string</li></ul> | status code: 201 (created)<br> body:<ul><li>status: success</li><li>data:<ul><li>userId: "user_id"</ul></li></li></ul> | Menambahkan pengguna. |
| POST /authentications | <ul><li>username: string</li><li>password: string</li></ul></ul> | status code: 201 (created)<br> body:<ul><li>status: success</li><li>data:<ul><li>accessToken: "token"</li><li>refreshToken: "token"</li></ul></li></ul> | Autentikasi pengguna / login. |
| PUT /authentications | <ul><li>refreshToken: string</li></ul> | status code: 200 (ok)<br> body:<ul><li>data:<li>accessToken: "token"</li></ul>| Memperbarui access token. |
| DELETE /authentications | <ul><li>refreshToken: string</li></ul> | status code: 200 (ok)<br> body:<ul><li>status: "success"</li><li>message: *any</li></ul> | Menghapus autentikasi. |

### Playlists
| Endpoint | Body Request | Response | Keterangan |
| --- | --- | --- | --- |
| POST /playlists | <ul><li>name: string</li> | status code: 201 (created)<br> body:<ul><li>status: success</li><li>data:<ul><li>playlistId: "playlist_id"</ul></li></li></ul> | Menambahkan playlist. |
| GET /playlists | - | status code: 200 (ok)<br> body:<ul><li>status: success</li><li>data:<ul><li>playlists: playlist[]</li></ul> | Melihat daftar laylist yang dimiliki. |
| DELETE /playlists/{id} | - | status code: 200 (ok)<br> body:<ul><li>status: 'success'<li>message: *any</li></ul>| Menghapus playlist. |
| POST /playlists/{id}/songs | <ul><li>songId: string</li></ul> | status code: 201 (ok)<br> body:<ul><li>status: "success"</li><li>message: *any</li></ul> | Menambahkan lagu ke playlist. |
| GET /playlists/{id}/songs | - | status code: 200 (ok)<br> body:<ul><li>status: "success"</li><li>message: *any</li></ul>| Melihat daftar lagu di dalam playlist. |
| DELETE /playlists/{id}/songs | <ul><li>songId: string</li></ul> | status code: 200 (ok)<br> body:<ul><li>status: "success"</li><li>message: *any</li></ul> | Menghapus lagu dari playlist. |

### Playlist Output
`POST /playlist`

    {
        "id": "playlist-Qbax5Oy7L8WKf74l",
        "name": "Lagu Indie Hits Indonesia",
        "owner": "user-Qbax5Oy7L8WKf74l",
    }

`GET /playlist`

    {
        "status": "success",
        "data": {
            "playlists": [
                {
                    "id": "playlist-Qbax5Oy7L8WKf74l",
                    "name": "Lagu Indie Hits Indonesia",
                    "username": "dicoding"
                },
                {
                    "id": "playlist-lmA4PkM3LseKlkmn",
                    "name": "Lagu Untuk Membaca",
                    "username": "dicoding"
                }
            ]
        }
    }

`GET /playlists/{id}/songs`

    {
        "status": "success",
        "data": {
            "playlist": {
            "id": "playlist-Mk8AnmCp210PwT6B",
            "name": "My Favorite Coldplay",
            "username": "dicoding",
            "songs": [
                {
                "id": "song-Qbax5Oy7L8WKf74l",
                "title": "Life in Technicolor",
                "performer": "Coldplay"
                },
                {
                "id": "song-poax5Oy7L8WKllqw",
                "title": "Centimeteries of London",
                "performer": "Coldplay"
                },
                {
                "id": "song-Qalokam7L8WKf74l",
                "title": "Lost!",
                "performer": "Coldplay"
                }
            ]
            }
        }
    }

### Ekspor
| Endpoint | Body Request | Response | Keterangan |
| --- | --- | --- | --- |
| POST /export/playlists/{playlistId} | <ul><li>targetEmail: string</li> | status code: 201 (created)<br><ul><li>status: success</li><li>data:<ul><li>playlistId: "playlist_id"</ul></li></li></ul> | Ekspor playlist. |

### Ekspor Output

    {
        "playlist": {
            "id": "playlist-Mk8AnmCp210PwT6B",
            "name": "My Favorite Coldplay Song",
            "songs": [
            {
                "id": "song-Qbax5Oy7L8WKf74l",
                "title": "Life in Technicolor",
                "performer": "Coldplay"
            },
            {
                "id": "song-poax5Oy7L8WKllqw",
                "title": "Centimeteries of London",
                "performer": "Coldplay"
            },
            {
                "id": "song-Qalokam7L8WKf74l",
                "title": "Lost!",
                "performer": "Coldplay"
            }
            ]
        }
    }

### Upload Album
| Endpoint | Body Request | Response | Keterangan |
| --- | --- | --- | --- |
| POST /albums/{id}/covers | Body Request (Form data)<ul><li>cover: file</li> | status code: 201 (created)<br><ul><li>status: success</li><li>message: Sampul berhasil diunggah</li></ul> | Ekspor playlist. |

### Albums Like
| Endpoint | Body Request | Response | Keterangan |
| --- | --- | --- | --- |
| POST /albums/{id}/likes | - | status code: 201 (created)<br> body:<ul><li>status: success</li><li>message: *any</li></ul> | Menyukai Album. |
| DELETE /albums/{id}/likes | - | status code: 200 (ok)<br> body:<ul><li>status: success</li><li>message: any* | Batal menyukai Album. |
| GET /albums/{id}/likes | - | status code: 200 (ok)<br> body:<ul><li>status: success</li><li>data:<ul><li>likes: number | Melihat jumlah yang menyukai album. |